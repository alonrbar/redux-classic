import { bootstrap } from 'aurelia-bootstrapper';
import { Aurelia, PLATFORM } from 'aurelia-framework';
import { appCreator } from 'examples/counters/viewModel/app';
import { createApp, createTree } from 'lib';
import { devToolsEnhancer } from 'redux-devtools-extension';
//
// bootstrap redux
// 

const app = createApp(appCreator, devToolsEnhancer(undefined));
(app.component as any).counter1.actions.INCREMENT(1);
(app.component as any).counter1.actions.INCREMENT(1);
(app.component as any).counter2.actions.INCREMENT(2);

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