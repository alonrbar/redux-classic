import { bootstrap } from 'aurelia-bootstrapper';
import { Aurelia, PLATFORM } from 'aurelia-framework';
import { appSchema } from 'examples/counters/viewModel/components/app';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { ReduxApp } from 'lib';
//
// bootstrap redux
// 

const app = new ReduxApp(appSchema, devToolsEnhancer(undefined));
app.root.children.counter1.component.actions.INCREMENT(1);
app.root.children.counter1.component.actions.INCREMENT(1);
app.root.children.counter2.component.actions.INCREMENT(2);

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