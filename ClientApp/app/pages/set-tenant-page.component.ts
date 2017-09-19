import { Component } from "@angular/core";
import { Storage } from "../shared/services/storage.service";
import { constants } from "../shared/constants";
import { LoginRedirectService } from "../shared/services/login-redirect.service";
import { TenantsService } from "../shared/services/tenants.service";

@Component({
    templateUrl: "./set-tenant-page.component.html",
    styleUrls: ["./set-tenant-page.component.css"],
    selector: "ce-set-tenant-page"
})
export class SetTenantPageComponent {
    constructor(
        private _loginRedirectService: LoginRedirectService,
        private _storage: Storage,
        private _tenantsService: TenantsService
    ) { }
    
    tryToSubmit($event) {
        this._storage.put({ name: constants.TENANT, value: $event.detail.tenant.id });

        this._tenantsService.set({ uniqueId: $event.detail.tenant.id })
            .catch(() => {
                this._storage.put({ name: constants.TENANT, value: null });
                throw new Error("");
            })
            .subscribe(() => {
            this._loginRedirectService.redirectPreLogin();
        });
    }
}
