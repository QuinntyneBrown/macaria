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
        this.onNavigateByUrl = this.onNavigateByUrl.bind(this);
    }
    
    ngOnInit() {

        Observable.fromEvent(this.nativeElement, "click")
            .do(x => this._clickCount++)
            .debounce(x => Observable.timer(300))
            .map(x => this._clickCount)
            .do(() => this._clickCount = 0)            
            .filter(x => x >= 2)
            .do(x => this._loginRedirectService.redirectToLogin())
            .subscribe();
        
        document.body.addEventListener(NAVIGATE_BY_URL, this.onNavigateByUrl);
    }

    public onNavigateByUrl(e) {
        this._popoverService.hide();
        this._router.navigateByUrl(e.detail.url);
    }
    
    private _clickCount:number = 0;
    
    public get nativeElement(): HTMLElement { return this._elementRef.nativeElement as HTMLElement; }
}