import { Component, OnInit } from "@angular/core";
import { AuthenticationService, LoginRedirectService, constants, Storage } from "../shared";
import { Logger } from "../shared/services/logger.service";

@Component({
    templateUrl: "./login-page.component.html",
    styleUrls: ["./login-page.component.css"],
    selector: "ce-login-page"
})
export class LoginPageComponent implements OnInit {
    constructor(
        private _authenticationService: AuthenticationService,
        private _logger: Logger,
        private _loginRedirectService: LoginRedirectService,
        private _storage: Storage
    ) { }

    public ngOnInit() {
        this._logger.trace(`(LoginPage) ngOnInit`);

        this._storage.put({ name: constants.ACCESS_TOKEN_KEY, value: null });

        const loginCredentials = this._storage.get({ name: constants.LOGIN_CREDENTIALS });

        if (loginCredentials && loginCredentials.rememberMe) {
            this.username = loginCredentials.username;
            this.password = loginCredentials.password;
            this.rememberMe = loginCredentials.rememberMe;
        }
    }

    public username: string = "";

    public password: string = "";

    public rememberMe: boolean = false;

    public async tryToLogin($event: { value: { username: string, password: string, rememberMe: boolean } }) {
        this._logger.trace(`(LoginPage) tryToLogin  ${JSON.stringify($event)}`);

        this._storage.put({ name: constants.LOGIN_CREDENTIALS, value: $event.value.rememberMe ? $event.value : null });

        await this._authenticationService.tryToLogin({ username: $event.value.username, password: $event.value.password }).toPromise();

        this._loginRedirectService.redirectPreLogin();
    }
}