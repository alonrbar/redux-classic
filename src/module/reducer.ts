import { Reducer, ReducersMapObject } from 'redux';
import { IgnoreState } from '../decorators';
import { ModuleInfo, ModuleTemplateInfo } from '../info';
import { ROOT_MODULE_PATH } from '../reduxClassic';
import { IMap, Listener } from '../types';
import { clearProperties, defineProperties, DescriptorType, getMethods, isPrimitive, log, simpleCombineReducers } from '../utils';
import { ModuleActions, ReduxClassicAction } from './actions';
import { Module } from './module';

// tslint:disable:member-ordering ban-types

export type ReducerCreator = (changeListener: Listener<Module>) => Reducer<object>;

export class CombineReducersContext {

    public visited = new Set();
    public path = ROOT_MODULE_PATH;
    public modulePaths: string[] = [];
    public changedModules: IMap<Module> = {};
    public invoked = false;

    constructor(initial?: Partial<CombineReducersContext>) {
        Object.assign(this, initial);
    }

    public reset(): void {
        clearProperties(this.changedModules);
        this.invoked = false;
    }
}

export class ModuleReducer {

    private static readonly identityReducer = (state: any) => state;

    //
    // public methods
    //

    public static createReducer(mod: Module, moduleTemplate: object): ReducerCreator {

        const templateInfo = ModuleTemplateInfo.getInfo(moduleTemplate);
        if (!templateInfo)
            throw new Error(`Inconsistent module '${moduleTemplate.constructor.name}'.`);

        const methods = ModuleReducer.createMethodsLookup(moduleTemplate, templateInfo);
        const stateProto = ModuleReducer.createStateObjectPrototype(mod, templateInfo);
        const moduleId = ModuleInfo.getInfo(mod).id;

        // reducer creator
        return (changeListener: Listener<Module>) =>

            // the reducer
            (state: object, action: ReduxClassicAction) => {

                log.verbose(`[reducer] Reducer of: ${moduleTemplate.constructor.name}, action: ${action.type}.`);

                // initial state
                if (state === undefined) {
                    log.verbose('[reducer] State is undefined, returning initial value.');
                    return ModuleReducer.finalizeStateObject(mod, mod);
                }

                // preloaded state
                if (state === moduleTemplate) {
                    log.verbose("[reducer] State equals to module's template, returning initial value.");
                    return ModuleReducer.finalizeStateObject(mod, mod);
                }

                // check module id
                if (moduleId !== action.id) {
                    log.verbose(`[reducer] Module id and action.id don't match (${moduleId} !== ${action.id}).`);
                    return state;
                }

                // check if should use this reducer
                const actionReducer = methods[action.type];
                if (!actionReducer) {
                    log.verbose('[reducer] No matching action in this reducer, returning previous state.');
                    return state;
                }

                // call the action-reducer with the new state as the 'this' argument
                const newState = ModuleReducer.createStateObject(state, stateProto);
                actionReducer.call(newState, ...action.payload);

                // notify changes
                changeListener(mod);

                // return new state                
                log.verbose('[reducer] Reducer invoked, returning new state.');
                return ModuleReducer.finalizeStateObject(newState, mod);
            };
    }

    public static combineReducersTree(root: Module, context: CombineReducersContext): Reducer<any> {

        const reducer = ModuleReducer.combineReducersRecursion(root, context);

        return (state: any, action: ReduxClassicAction) => {
            const start = Date.now();

            context.invoked = true;
            log.debug(`[rootReducer] Reducing action: ${action.type}.`);

            const newState = reducer(state, action);

            const end = Date.now();
            log.debug(`[rootReducer] Reducer tree processed in ${end - start}ms.`);

            return newState;
        };
    }

    //
    // private methods - state object
    //

    private static createMethodsLookup(moduleTemplate: object, templateInfo: ModuleTemplateInfo): IMap<Function> {

        const allMethods = getMethods(moduleTemplate);

        const actionMethods: IMap<Function> = {};
        Object.keys(templateInfo.actions).forEach(originalActionName => {
            const normalizedActionName = ModuleActions.getActionName(moduleTemplate, originalActionName);
            actionMethods[normalizedActionName] = allMethods[originalActionName];
        });

        return actionMethods;
    }

    /**
     * See description of 'createStateObject'.
     */
    private static createStateObjectPrototype(mod: Module, templateInfo: ModuleTemplateInfo): object {

        // assign properties
        const stateProto: any = defineProperties({}, mod, [DescriptorType.Property]);

        // assign methods
        const moduleMethods = getMethods(mod);
        for (let key of Object.keys(moduleMethods)) {
            if (!templateInfo.actions[key]) {
                // regular method
                stateProto[key] = moduleMethods[key].bind(mod);
            } else {
                // action (not allowed)
                stateProto[key] = ModuleReducer.actionInvokedError;
            }
        }
        return stateProto;
    }

    private static actionInvokedError() {
        throw new Error("Actions should not be invoked from within other actions.");
    }

    /**
     * Create a "state object". The state object receives it's properties from
     * the current state and it's methods from the owning module. Methods that
     * represent actions are replace with a throw call, while regular methods
     * are kept in place.
     */
    private static createStateObject(state: any, stateProto: object): object {
        const stateObj = Object.create(stateProto);
        for (const key of Object.keys(state)) {

            // don't attempt to assign get only properties
            const desc = Object.getOwnPropertyDescriptor(stateProto, key);
            if (desc && typeof desc.get === 'function' && typeof desc.set !== 'function')
                continue;

            stateObj[key] = state[key];
        }
        return stateObj;
    }

    private static finalizeStateObject(state: object, mod: Module): object {

        log.verbose('[finalizeStateObject] finalizing state.');
        let finalizedState = Object.assign({}, state);

        finalizedState = IgnoreState.removeIgnoredProps(finalizedState, mod);

        log.verbose('[finalizeStateObject] state finalized.');
        return finalizedState;
    }

    //
    // private methods - combine reducers
    //

    private static combineReducersRecursion(obj: any, context: CombineReducersContext): Reducer<any> {

        // no need to search inside primitives
        if (isPrimitive(obj))
            return undefined;

        // prevent endless loops on circular references
        if (context.visited.has(obj))
            return undefined;
        context.visited.add(obj);

        // ignore branches with no descendant modules
        if (!context.modulePaths.some(path => path.startsWith(context.path)))
            return ModuleReducer.identityReducer;

        // get the root reducer
        let rootReducer: Reducer<any>;
        const info = ModuleInfo.getInfo(obj as any);
        if (info) {
            rootReducer = info.reducerCreator(comp => {
                context.changedModules[context.path] = comp;
            });
        } else {
            rootReducer = ModuleReducer.identityReducer;
        }

        // gather the sub-reducers
        const subReducers: ReducersMapObject = {};
        for (let key of Object.keys(obj)) {

            // other objects
            const newSubReducer = ModuleReducer.combineReducersRecursion((obj as any)[key], new CombineReducersContext({
                ...context,
                path: (context.path === '' ? key : context.path + '.' + key)
            }));
            if (typeof newSubReducer === 'function')
                subReducers[key] = newSubReducer;
        }

        let resultReducer = rootReducer;

        // combine reducers
        if (Object.keys(subReducers).length) {
            const combinedSubReducer = simpleCombineReducers(subReducers);

            resultReducer = (state: object, action: ReduxClassicAction) => {

                const thisState = rootReducer(state, action);
                const subStates = combinedSubReducer(thisState, action);

                // merge self and sub states
                const combinedState = ModuleReducer.mergeState(thisState, subStates);

                return combinedState;
            };
        }

        return resultReducer;
    }

    private static mergeState(state: any, subStates: any): any {

        if (Array.isArray(state) && Array.isArray(subStates)) {

            // merge arrays
            for (let i = 0; i < subStates.length; i++)
                state[i] = subStates[i];
            return state;

        } else {

            // merge objects
            return {
                ...state,
                ...subStates
            };
        }
    }
}