//import { enableProdMode } from "@angular/core";
//import { environment } from "./app/environment";
//import { platformBrowser } from '@angular/platform-browser';
//import { AppModuleNgFactory } from '../aot/ClientApp/app/app.module.ngfactory';

//if (environment.production) {
//    enableProdMode();
//}

//platformBrowser().bootstrapModuleFactory(AppModuleNgFactory)
//    .catch(err => console.error(err));


import { enableProdMode } from "@angular/core";
import { AppModule } from "./app/app.module";
import { environment } from "./app/environment";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

if (environment.production) {
    enableProdMode();
}



platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));