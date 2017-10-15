import { bootstrap } from 'aurelia-bootstrapper';
import { Aurelia, PLATFORM } from 'aurelia-framework';
import { appCreator } from 'examples/counters/viewModel/app';
import { reduxAutomata, createTree } from 'lib';
import { devToolsEnhancer } from 'redux-devtools-extension';
//
// bootstrap redux
// 

const auto = reduxAutomata(appCreator, devToolsEnhancer(undefined));
(auto.automata as any).counter1.actions.INCREMENT(1);
(auto.automata as any).counter1.actions.INCREMENT(1);
(auto.automata as any).counter2.actions.INCREMENT(2);

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