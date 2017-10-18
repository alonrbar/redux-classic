import { ReduxApp } from 'lib';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { App as AppViewModel } from '../viewModel/app';
import { viewResources, PLATFORM } from 'aurelia-framework';

@viewResources(PLATFORM.moduleName('examples/counters/view/counter'))
export class App {
    
    public vm: ReduxApp<AppViewModel>;

    constructor() {
        this.vm = new ReduxApp(new AppViewModel(), devToolsEnhancer(undefined));
    }
}