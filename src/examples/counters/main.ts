import { bootstrap } from 'aurelia-bootstrapper';
import { Aurelia, PLATFORM } from 'aurelia-framework';

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