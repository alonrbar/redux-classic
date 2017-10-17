import { bootstrap } from 'aurelia-bootstrapper';
import { Aurelia, PLATFORM } from 'aurelia-framework';
import { ReduxApp } from 'lib';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { App } from './viewModel/app';
//
// bootstrap redux
// 

const app = new ReduxApp<App>(new App(), devToolsEnhancer(undefined));
app.root.counter1.increment(1);
app.root.counter1.increment(1);
app.root.counter2.increment(2);

console.log('root: ', app.root);
console.log('state: ', app.store.getState());

//
// bootstrap Aurelia
//

bootstrap((aurelia: Aurelia) => {

    aurelia.use
        .standardConfiguration()
        .developmentLogging();

    aurelia.start()
    .then(() => aurelia.setRoot(PLATFORM.moduleName('examples/counters/view/app'), document.body))    
});