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
    ) { }

    ngOnInit() {
        this.nativeElement.addEventListener("click", () => {

            if (this._clickStream != null) return;

            this._clickStream = Observable.fromEvent(this.nativeElement, "click");

            var subscription =  this._clickStream.buffer(this._clickStream.debounce(() => Observable.timer(250)))
                .map(list => list.length)
                .filter(x => x === 2)
                .subscribe(() => {
                    subscription = null;
                    this._clickStream = null;
                    this._loginRedirectService.redirectToLogin()
                });
        })        
    }

    private _clickStream: Observable<any>;

    public get nativeElement(): HTMLElement { return this._elementRef.nativeElement as HTMLElement; }
}