import {Component} from "@angular/core";
import {constants} from "../shared/constants";
import {LoginRedirectService} from "../shared/services/login-redirect.service";
import {Storage} from "../shared/services/storage.service";
import {TenantsService} from "../shared/services/tenants.service";
import {addOrUpdate} from "../shared/utilities/add-or-update";
import {Subject} from "rxjs/Subject";
import { Logger } from "../shared/services/logger.service";

@Component({
    templateUrl: "./set-tenant-page.component.html",
    styleUrls: ["./set-tenant-page.component.css"],
    selector: "ce-set-tenant-page"
})
export class SetTenantPageComponent {
    constructor(
        private _logger: Logger,
        private _loginRedirectService: LoginRedirectService,
        private _storage: Storage,
        private _tenantsService: TenantsService
    ) { }

    private _ngUnsubscribe: Subject<void> = new Subject<void>();

    ngOnInit() {
        this._logger.trace(`(SetTenantPage): ngOnInit`);
        this._tenantsService
            .get()
            .takeUntil(this._ngUnsubscribe)
            .subscribe(x => this.tenants = x);
    }

    public tenantClicked(tenant) {
        this._logger.trace(`(SetTenantPage): tenantClicked: ${JSON.stringify(tenant)}`);

        this.tryToSubmit({ detail: { tenant: { id: tenant } } });
    }
    
    public tryToSubmit($event) {
        this._logger.trace(`(SetTenantPage): tryToSubmit ${JSON.stringify($event)}`);

        this._storage.put({ name: constants.TENANT, value: $event.detail.tenant.id });

        this._tenantsService.set({ uniqueId: $event.detail.tenant.id })
            .catch((e) => {
                this._storage.put({ name: constants.TENANT, value: null });
                this._logger.error(`(SetTenantPage): tryToSubmit Failed ${JSON.stringify(e)}`);
                throw new Error(e);
            })
            .subscribe(() => this._loginRedirectService.redirectPreLogin());
    }

    ngOnDestroy() {
        this._logger.trace(`(SetTenantPage): ngOnDestroy`);

        this._ngUnsubscribe.next();
    }

    public tenants: Array<string> = [];
}
