import { Injectable } from "@angular/core";
import {
    CanActivate,
    CanActivateChild,
    CanLoad,
    Route,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';

import { Storage } from "../services/storage.service";
import { Observable } from "rxjs";
import { constants } from "../constants";
import { UsersService } from "../services/users.service";
import { Logger } from "../services/logger.service";

@Injectable()
export class CurrentUserGuardService implements CanActivate {
    constructor(
        private _logger: Logger,
        private _usersService: UsersService,
        private _storage: Storage
    ) { }

    public canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        this._logger.trace(`(CurrentUserGuard) canActivate`);

        var currentUser = this._storage.get({ name: constants.CURRENT_USER_KEY });

        if (currentUser)
            return Observable.of(true);

        return this._usersService.getCurrent()
            .map(result => {                
                this._storage.put({ name: constants.CURRENT_USER_KEY, value: result.user });
                return true;
            });
    }
}