import {Injectable} from "@angular/core";
import {
    CanActivate,
    CanActivateChild,
    CanLoad,
    Route,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';

import {Storage} from "../services/storage.service";
import {LoginRedirectService} from "../services/login-redirect.service";
import {Observable} from "rxjs";
import {constants} from "../constants";
import {Logger} from "../services/logger.service";

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(
        private _storage: Storage,
        private _logger: Logger,
        private _loginRedirectService: LoginRedirectService
    ) { }

    public canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {        
        const token = this._storage.get({ name: constants.ACCESS_TOKEN_KEY });

        this._logger.trace(`(AuthGuard) canActivate ${JSON.stringify(token)}`);

        if (token)
            return Observable.of(true);

        this._loginRedirectService.lastPath = state.url;
        this._loginRedirectService.redirectToLogin();

        return Observable.of(false);       
    }
}