import { Injectable } from "@angular/core";
import { HttpClient, HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Storage } from "../services/storage.service";
import { constants } from "../constants";
import { Logger } from "../services/logger.service";

@Injectable()
export class HttpLogInterceptor implements HttpInterceptor {
    constructor(private _logger: Logger) { }

    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this._logger.trace(`(HttpLog) intercept request ${JSON.stringify(httpRequest)}`);
        return next.handle(httpRequest)
            .do((x) => this._logger.trace(`(HttpLog) intercept response ${JSON.stringify(x)}`));
    }
}
