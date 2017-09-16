import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Note } from "../models/note.model";
import { Observable } from "rxjs/Observable";
import { ErrorService } from "./error.service";

@Injectable()
export class NotesService {
    constructor(
        private _errorService: ErrorService,
        private _httpClient: HttpClient)
    { }

    public addOrUpdate(options: { note: Note, correlationId: string }) {
        return this._httpClient
            .post(`${this._baseUrl}/api/notes/add`, options)
            .catch(this._errorService.catchErrorResponse);
    }

    public get(): Observable<{ notes: Array<Note> }> {
        return this._httpClient
            .get<{ notes: Array<Note> }>(`${this._baseUrl}/api/notes/get`)
            .catch(this._errorService.catchErrorResponse);
    }

    public getByCurrentUser(): Observable<{ notes: Array<Note> }> {
        return this._httpClient
            .get<{ notes: Array<Note> }>(`${this._baseUrl}/api/notes/getByCurrentUser`)
            .catch(this._errorService.catchErrorResponse);
    }

    public getById(options: { id: number }): Observable<{ note:Note}> {
        return this._httpClient
            .get<{note: Note}>(`${this._baseUrl}/api/notes/getById?id=${options.id}`)
            .catch(this._errorService.catchErrorResponse);
    }

    public remove(options: { note: Note, correlationId: string }) {
        return this._httpClient
            .delete(`${this._baseUrl}/api/notes/remove?id=${options.note.id}&correlationId=${options.correlationId}`)
            .catch(this._errorService.catchErrorResponse);
    }

    public get _baseUrl() { return window["__BASE_URL__"]; }
}
