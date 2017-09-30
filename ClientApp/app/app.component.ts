import { Component, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { NAVIGATE_BY_URL } from "./shared/components/menu.component";
import { LoginRedirectService } from "./shared/services/login-redirect.service";
import { PopoverService } from "./shared/services/popover.service";

@Component({
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    selector: "app"
})
export class AppComponent {
    constructor(
        private _elementRef: ElementRef,
        private _loginRedirectService: LoginRedirectService,
        private _popoverService: PopoverService,
        private _router: Router        
    ) {
        this.onNavigateByUrl = this.onNavigateByUrl.bind(this);
    }

    private get _click$(): Observable<any> { return Observable.fromEvent(this.nativeElement, "click"); }

    private get _logoutOnDoubleClick$(): Observable<any> {
        return this._click$
            .buffer(this._click$.debounce(x => Observable.timer(300)))
            .map(clickEvents => clickEvents.length)
            .filter(x => x === 2)
            .do(x => this._loginRedirectService.redirectToLogin())
    }

    ngOnInit() {
        this._logoutOnDoubleClick$.subscribe();
        
        document.body.addEventListener(NAVIGATE_BY_URL, this.onNavigateByUrl);
    }

    public onNavigateByUrl(e) {
        this._popoverService.hide();
        this._router.navigateByUrl(e.detail.url);
    }
    
    public get nativeElement(): HTMLElement { return this._elementRef.nativeElement as HTMLElement; }
}