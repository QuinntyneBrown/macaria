import { Component, ElementRef } from "@angular/core";
import { LoginRedirectService } from "./shared/services/login-redirect.service";
import { Observable } from "rxjs";
import { NAVIGATE_BY_URL } from "./shared/components/menu.component";
import { Router } from "@angular/router";
import { PopoverService } from "./shared/services/popover.service";

@Component({
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    selector: "app"
})
export class AppComponent {
    constructor(private _elementRef: ElementRef,
        private _loginRedirectService: LoginRedirectService,
        private _router: Router,
        private _popoverService: PopoverService
    ) {
        this._onClick = this._onClick.bind(this);
        this.onNavigateByUrl = this.onNavigateByUrl.bind(this);
    }

    ngOnInit() {
        this.nativeElement.addEventListener("click", this._onClick);
        document.body.addEventListener(NAVIGATE_BY_URL, this.onNavigateByUrl);
    }

    public onNavigateByUrl(e) {
        this._popoverService.hide();
        this._router.navigateByUrl(e.detail.url);
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