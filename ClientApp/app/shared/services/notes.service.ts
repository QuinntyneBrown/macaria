import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Note } from "../models/note.model";
import { Observable } from "rxjs/Observable";
import { ErrorService } from "./error.service";
import { Logger } from "./logger.service";

@Injectable()
export class NotesService {
    constructor(
        private _errorService: ErrorService,
        private _httpClient: HttpClient,
        private _logger: Logger)
    { }

    public addOrUpdate(options: { note: Note, correlationId: string }) {
        this._logger.trace(`(NoteService) ${JSON.stringify(options)}`);

        return this._httpClient
            .post(`${this._baseUrl}/api/notes/add`, options)
            .catch(this._errorService.catchErrorResponse);
    }

    public addTag(options: { noteId: number, tagId: number, correlationId: string }) {
        this._logger.trace(`(NoteService) ${JSON.stringify(options)}`);

        return this._httpClient
            .post(`${this._baseUrl}/api/notes/addTag`, options)
            .catch(this._errorService.catchErrorResponse);
    }

    public removeTag(options: { noteId: number, tagId: number, correlationId: string }) {
        this._logger.trace(`(NoteService) ${JSON.stringify(options)}`);

        return this._httpClient
            .post(`${this._baseUrl}/api/notes/removeTag`, options)
            .catch(this._errorService.catchErrorResponse);
    }

    public get(): Observable<{ notes: Array<Note> }> {
        this._logger.trace(`(NoteService) get`);

        return this._httpClient
            .get<{ notes: Array<Note> }>(`${this._baseUrl}/api/notes/get`)
            .catch(this._errorService.catchErrorResponse);
    }
    
    public getByTitleAndCurrentUser(options: { title: string }): Observable<{ note: Note }> {
        this._logger.trace(`(NoteService) getByTitleAndCurrentUser ${JSON.stringify(options)}`);

        return this._httpClient
            .get<{ note: Note }>(`${this._baseUrl}/api/notes/getByTitleAndCurrentUser?title=${options.title}`)
            .catch(this._errorService.catchErrorResponse);
    }

    public getByCurrentUser(): Observable<{ notes: Array<Note> }> {
        this._logger.trace(`(NoteService) getByCurrentUser`);

        return this._httpClient
            .get<{ notes: Array<Note> }>(`${this._baseUrl}/api/notes/getByCurrentUser`)
            .catch(this._errorService.catchErrorResponse);
    }

    public getBySlugAndCurrentUser(options: { slug: string }): Observable<{ note: Note }> {
        this._logger.trace(`(NoteService) getBySlugAndCurrentUser ${JSON.stringify(options)}`);

        return this._httpClient
            .get<{ note: Note }>(`${this._baseUrl}/api/notes/getBySlugAndCurrentUser?slug=${options.slug}`)
            .catch(this._errorService.catchErrorResponse);
    }

    public getById(options: { id: number }): Observable<{ note: Note }> {
        this._logger.trace(`(NoteService) getById ${JSON.stringify(options)}`);

        return this._httpClient
            .get<{note: Note}>(`${this._baseUrl}/api/notes/getById?id=${options.id}`)
            .catch(this._errorService.catchErrorResponse);
    }

    public remove(options: { note: Note, correlationId: string }) {
        this._logger.trace(`(NoteService) remove ${JSON.stringify(options)}`);

        return this._httpClient
            .delete(`${this._baseUrl}/api/notes/remove?id=${options.note.id}&correlationId=${options.correlationId}`)
            .catch(this._errorService.catchErrorResponse);
    }

    public get _baseUrl() { return window["__BASE_URL__"]; }
}
