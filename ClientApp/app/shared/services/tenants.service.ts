import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { ErrorService } from "./error.service";
import { Storage } from "./storage.service";
import { constants } from "../constants";
import { addOrUpdate } from "../utilities/add-or-update";

@Injectable()
export class TenantsService {
    constructor(
        private _errorService: ErrorService,
        private _httpClient: HttpClient,
        private _storage:Storage
    )
    {        
        this._tenants = this._storage.get({ name: constants.TENANTS }) || this._tenants;        
    }

    private _tenants: Array<string> = [];

    public set(options: { uniqueId: string }) {
        this._storage.put({ name: constants.TENANTS, value: addOrUpdate({ items: this._tenants, item: options.uniqueId, mode:"single" }) });

        return this._httpClient            
            .post(`${this._baseUrl}/api/tenants/set`, options)
            .catch(this._errorService.catchErrorResponse);
    }

    public get():Observable<Array<string>> {
        return Observable.of(this._tenants);
    }

    public get _baseUrl() { return window["__BASE_URL__"]; }
}
