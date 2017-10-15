import { Aurelia, PLATFORM } from 'aurelia-framework';
import { bootstrap } from 'aurelia-bootstrapper';

//
// bootstrap redux
// 



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