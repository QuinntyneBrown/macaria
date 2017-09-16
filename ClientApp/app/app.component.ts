import { Component, ElementRef } from "@angular/core";
import { LoginRedirectService } from "./shared/services/login-redirect.service";
import { Observable } from "rxjs";

@Component({
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    selector: "app"
})
export class AppComponent {
    constructor(private _elementRef: ElementRef,
        private _loginRedirectService: LoginRedirectService
    ) {
        this._onClick = this._onClick.bind(this);
    }

    ngOnInit() {
        this.nativeElement.addEventListener("click", this._onClick);
    }

    private _timeoutId: number;

    private _clickCount:number = 0;
    private _onClick() {
        if (this._timeoutId) clearTimeout(this._timeoutId);

        this._clickCount++;

        if (this._clickCount == 2) {
            this._loginRedirectService.redirectToLogin();
            clearTimeout(this._timeoutId);
            return;
        }

        this._timeoutId = (setTimeout(() => this._clickCount = 0, 250) as any); 
    }

    public get nativeElement(): HTMLElement { return this._elementRef.nativeElement as HTMLElement; }
}