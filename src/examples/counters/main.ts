import { bootstrap } from 'aurelia-bootstrapper';
import { Aurelia, PLATFORM } from 'aurelia-framework';
import { ReduxApp } from 'lib';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { App } from './viewModel/app';
//
// bootstrap redux
// 

const app = new ReduxApp(new App(), devToolsEnhancer(undefined));
app.root.children.counter1.component.actions.INCREMENT(1);
app.root.children.counter1.component.actions.INCREMENT(1);
app.root.children.counter2.component.actions.INCREMENT(2);

console.log(app.root.getState());

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