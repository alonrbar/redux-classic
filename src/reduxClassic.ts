import { Store } from 'redux';
import { ReduxClassicOptions } from './options';
import { IResolver, ResolverKey } from './types';

//
// public
//

export class ReduxClassic {

    /**
     * The redux store.
     */
    public static store: Store<any>;

    public static resolver: IResolver;

    /**
     * Global options
     */
    public static options = new ReduxClassicOptions();

    public static getModule<T>(type: ResolverKey<T>): T {
        if (!ReduxClassic.resolver)
            throw new Error('No resolver is assigned.');
        return ReduxClassic.resolver.get(type);
    }

    public static init(store: Store<any>, resolver: IResolver) {
        ReduxClassic.store = store;
        ReduxClassic.resolver = resolver;
    }
}