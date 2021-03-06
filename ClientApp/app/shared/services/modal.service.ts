﻿import { Injectable } from "@angular/core";
import { createElement } from "../utilities/create-element";

export const MODAL_CLOSE = "[Modal] Close";

export function ModalServiceFactory() {
    return ModalService.instance;
}

@Injectable()
export class ModalService {    

    constructor() {
        this.close = this.close.bind(this);

        document.body.addEventListener(MODAL_CLOSE, this.close);
    }

    public static get instance() {
        this._instance = this._instance || new ModalService();
        return this._instance;
    }

    private static _instance: ModalService;

    private _backdropNativeElement: HTMLElement;

    private _modalNativeElement: HTMLElement;

    public open(options: { html: any }) {
        var containerElement = document.querySelector('body');
        
        this._backdropNativeElement = createElement({ html: "<ce-backdrop></ce-backdrop>"});
        
        containerElement.appendChild(this._backdropNativeElement);

        this._modalNativeElement = createElement({ html: options.html });

        containerElement.appendChild(this._modalNativeElement);        
    }

    public close() {
        this._backdropNativeElement.parentNode.removeChild(this._backdropNativeElement);
        this._modalNativeElement.parentNode.removeChild(this._modalNativeElement);
    }
}