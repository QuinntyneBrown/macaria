import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../shared/shared.module";

import { LandingPageComponent } from "./landing-page.component";
import { LoginPageComponent } from "./login-page.component";
import { SearchPageComponent } from "./search-page.component";
import { SetTenantPageComponent } from "./set-tenant-page.component";

const declarables = [
    LandingPageComponent,
    LoginPageComponent,
    SearchPageComponent,
    SetTenantPageComponent
];

@NgModule({
    imports: [CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule, RouterModule, SharedModule],
    exports: [declarables],
    declarations: [declarables]
})
export class PagesModule { }
