import { Aurelia, PLATFORM } from 'aurelia-framework';
import { bootstrap } from 'aurelia-bootstrapper';

bootstrap((aurelia: Aurelia) => {

    aurelia.use
        .standardConfiguration()
        .developmentLogging();

    aurelia.start()
    .then(() => aurelia.setRoot(PLATFORM.moduleName('examples/counters/app/app'), document.body))    
});