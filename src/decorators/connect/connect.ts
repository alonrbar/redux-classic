import { Component } from '../../components';
import { ClassInfo, ComponentInfo } from '../../info';

export class Connect {

    public static readonly placeholderPrefix = '<connected';

    public static isConnectedProperty(propHolder: object, propKey: string | symbol): boolean {
        const info = ClassInfo.getInfo(propHolder);
        return info && info.connectedProps[propKey];
    }

    public static setupConnectedProps(target: Component, targetInfo: ClassInfo, source: object, sourceInfo: ClassInfo): void {
        if (!sourceInfo)
            return;

        // trigger connected props (necessary for connected props with initial 'undefined' value)
        for (let propKey of Object.keys(sourceInfo.connectedProps)) {

            // tslint:disable-next-line:no-unused-expression
            (source as any)[propKey];
            var desc = Object.getOwnPropertyDescriptor(source, propKey);
            Object.defineProperty(target, propKey, desc);
        }

        // copy metadata
        targetInfo.connectedProps = sourceInfo.connectedProps;
    }

    /**
     * Returns a shallow clone of 'state' with it's computed props replaced with
     * Connect.placeholder.
     */
    public static removeConnectedProps(state: any, obj: any): any {
        const info = ClassInfo.getInfo(obj);
        if (!info)
            return state;

        const newState = Object.assign({}, state);
        for (let propKey of Object.keys(info.connectedProps)) {
            
            var sourceInfoString = '';
            
            var sourceInfo = ComponentInfo.getInfo(obj[propKey]);            
            if (sourceInfo) {
                var sourceIdString = (sourceInfo.id !== undefined ? '.' + sourceInfo.id : '');
                sourceInfoString = '.' + sourceInfo.originalClass.name + sourceIdString;
            }

            newState[propKey] = Connect.placeholderPrefix + sourceInfoString + '>';
        }
        return newState;
    }
}