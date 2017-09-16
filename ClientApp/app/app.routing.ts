﻿import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from "./shared/guards/auth-guard.service";
import { TenantGuardService } from "./shared/guards/tenant-guard.service";
import { EventHubConnectionGuardService } from "./shared/guards/event-hub-connection-guard.service";
import { CurrentUserGuardService } from "./shared/guards/current-user-guard.service";

import { LandingPageComponent } from "./pages/landing-page.component";
import { LoginPageComponent } from "./pages/login-page.component";
import { SetTenantPageComponent } from "./pages/set-tenant-page.component";

export const RoutingModule = RouterModule.forRoot([
    {
        path: '',
        component: LandingPageComponent,
        canActivate: [
            TenantGuardService,
            AuthGuardService,
            EventHubConnectionGuardService
        ]
    },
    {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [
            TenantGuardService
        ]
    },
    {
        path: 'tenants/set',
        component: SetTenantPageComponent
    },
    {
        path: ':slug',
        component: LandingPageComponent,
        canActivate: [
            TenantGuardService,
            AuthGuardService,
            EventHubConnectionGuardService
        ]
    },
]);