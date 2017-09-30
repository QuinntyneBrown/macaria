import { enableProdMode } from "@angular/core";
import { environment } from "./app/environment";
import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from '../aot/ClientApp/app/app.module.ngfactory';

if (environment.production) {
    enableProdMode();
}

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory)
    .catch(err => console.error(err));