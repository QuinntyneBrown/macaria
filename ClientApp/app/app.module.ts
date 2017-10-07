import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogLevel } from "./shared/services/logger.service";

import { PagesModule } from "./pages/pages.module";
import { SharedModule } from "./shared/shared.module";

import { AppComponent } from './app.component';

import {
    RoutingModule
} from "./app.routing";

const declarables = [
    AppComponent
];

const providers = [
    { provide: "MINIMUM_LOG_LEVEL", useValue: LogLevel.Trace }
];

@NgModule({
    imports: [        
        BrowserModule,        
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        RouterModule,

        PagesModule,
        RoutingModule,
        SharedModule,
    ],
    providers,
    declarations: [declarables],
    exports: [declarables],
    bootstrap: [AppComponent]
})
export class AppModule { }