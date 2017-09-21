import { SAVE_TAG_CLICK } from "./tag-edit.component";
import { ModalService } from "../services/modal.service";
import { customEvents } from "../services/custom-events";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Tag } from "../models/tag.model";

const template = document.createElement("template");
const html = require("./tag-edit-modal.component.html");
const css = require("./tag-edit-modal.component.css");
const modalCss = require("../../../styles/modal-window.css");


export const SAVE_TAG = "[Tags] Save Tag";

export class TagEditModalComponent extends HTMLElement {
    constructor(private _modalService: ModalService = ModalService.instance) {
        super();
        this.onTagSaveClick = this.onTagSaveClick.bind(this);
    }

    static get observedAttributes () {
        return ["tag"];
    }

    public tag$: BehaviorSubject<Tag> = new BehaviorSubject(<Tag>{});

    async connectedCallback() {
        
        
        template.innerHTML = `<style>${[modalCss,css].join(' ')}</style>${html}`; 

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.importNode(template.content, true));  

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'tageditmodal');

        this._bind();
        this._setEventListeners();
    }

    private async _bind() {
        this.tag$.subscribe(x => this.tagEditElement.setAttribute("tag", JSON.stringify(x)));
    }

    private _setEventListeners() {
        this.tagEditElement.addEventListener(SAVE_TAG_CLICK, this.onTagSaveClick);
    }

    public onTagSaveClick(e) {        
        this.dispatchEvent(customEvents.create({ name: SAVE_TAG, detail: e.detail }));
        this._modalService.close();
        
    }

    disconnectedCallback() {

    }

    public get tagEditElement(): HTMLElement {
        return this.shadowRoot.querySelector("ce-tag-edit") as HTMLElement;
    }

    attributeChangedCallback (name, oldValue, newValue) {
        switch (name) {
            case "tag":
                this.tag$.next(JSON.parse(newValue));
                break;
        }
    }
}

customElements.define(`ce-tag-edit-modal`,TagEditModalComponent);
