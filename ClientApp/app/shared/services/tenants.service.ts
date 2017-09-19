import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { ErrorService } from "./error.service";

@Injectable()
export class TenantsService {
    constructor(
        private _errorService: ErrorService,
        private _httpClient: HttpClient)
    { }

    public set(options: { uniqueId: string }) {
        return this._httpClient
            .post(`${this._baseUrl}/api/tenants/set`, options)
            .catch(this._errorService.catchErrorResponse);
    }

    public get _baseUrl() { return window["__BASE_URL__"]; }
}
