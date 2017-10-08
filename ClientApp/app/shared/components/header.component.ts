import {Component, ElementRef} from "@angular/core";
import {PopoverService} from "../services/popover.service";
import {Router,NavigationEnd} from "@angular/router";
import {Logger} from "../services/logger.service";

@Component({
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.css"],
    selector: "ce-header"
})
export class HeaderComponent {
    constructor(
        private _elementRef: ElementRef,
        private _logger: Logger,
        private _popoverService: PopoverService,
        private _router: Router
    ) {
    }

    ngOnInit() {
        this._logger.trace(`(Header) ngOnInit`);

        this._router.events.subscribe(x => {
            if (x instanceof NavigationEnd)
                this._popoverService.hide();
        });
    }

    public onMenuClick() {
        this._logger.trace(`(Header) onMenuClick`);

        this._popoverService.show({
            target: this._elementRef.nativeElement,
            html: "<ce-menu></ce-menu>"
        });
    }

    public get searchIconImageUrl() {        
        return "ClientApp/assets/ic_search_white_24px.svg";
    }

    public onSearchClick() {
        this._logger.trace(`(Header) onSearchClick`);

        this._router.navigateByUrl("/search");
    }

    public onTitleClick() {
        this._logger.trace(`(Header) onTitleClick`);

        this._router.navigateByUrl("/");
    }
}
