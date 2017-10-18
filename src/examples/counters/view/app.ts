import { ReduxApp } from 'lib';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { App as AppViewModel } from '../viewModel/app';
import { viewResources, PLATFORM } from 'aurelia-framework';

@viewResources(PLATFORM.moduleName('examples/counters/view/counter'))
export class App {
    
    public vm: ReduxApp<AppViewModel>;

    constructor() {

        //
        // bootstrap redux
        // 

        const app = new ReduxApp<AppViewModel>(new AppViewModel(), devToolsEnhancer(undefined));
        app.store.dispatch({type: 'init'})
        this.vm = app;
    }
}