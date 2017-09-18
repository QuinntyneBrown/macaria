import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Tag } from "../models/tag.model";
import { Observable } from "rxjs/Observable";
import { ErrorService } from "./error.service";

@Injectable()
export class TagsService {
    constructor(
        private _errorService: ErrorService,
        private _httpClient: HttpClient)
    { }

    public addOrUpdate(options: { tag: Tag, correlationId: string }) {
        return this._httpClient
            .post(`${this._baseUrl}/api/tags/add`, options)
            .catch(this._errorService.catchErrorResponse);
    }

    public get(): Observable<{ tags: Array<Tag> }> {
        return this._httpClient
            .get<{ tags: Array<Tag> }>(`${this._baseUrl}/api/tags/get`)
            .catch(this._errorService.catchErrorResponse);
    }

    public getById(options: { id: number }): Observable<{ tag:Tag}> {
        return this._httpClient
            .get<{tag: Tag}>(`${this._baseUrl}/api/tags/getById?id=${options.id}`)
            .catch(this._errorService.catchErrorResponse);
    }

    public remove(options: { tag: Tag, correlationId: string }) {
        return this._httpClient
            .delete(`${this._baseUrl}/api/tags/remove?id=${options.tag.id}&correlationId=${options.correlationId}`)
            .catch(this._errorService.catchErrorResponse);
    }

    public get _baseUrl() { return window["__BASE_URL__"]; }
}
