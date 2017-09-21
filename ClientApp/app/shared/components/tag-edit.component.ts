import { Tag } from "../models/tag.model";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { customEvents } from "../services/custom-events";
const template = require("./tag-edit.component.html");
const css = require("./tag-edit.component.css");
const formsCss = require("../../../styles/forms.css");

const SAVE_TAG_CLICK = "[Tags] SAVE TAG";

export class TagEditComponent extends HTMLElement {
    constructor() {
        super();
        this.onSave = this.onSave.bind(this);
    }

    static get observedAttributes() {
        return ["tag"];
    }

    public tag$: BehaviorSubject<Tag> = new BehaviorSubject(<Tag>{});

    connectedCallback() {        
        this.innerHTML = `<style>${[formsCss,css].join(' ')}</style> ${template}`; 
        this._bind();
        this._setEventListeners();
    }
    
    private async _bind() {
        this.tag$.subscribe(x => {
            this._titleElement.textContent = x.id ? "Edit Tag" : "Create Tag";
            this._nameInputElement.value = x.name;
        });        
    }

    private _setEventListeners() {
        this._saveButtonElement.addEventListener("click", this.onSave);
    }

    private disconnectedCallback() {
        this._saveButtonElement.removeEventListener("click", this.onSave);
    }

    public async onSave() {
        this.dispatchEvent(customEvents.create({
            name: SAVE_TAG_CLICK, detail: {
                tag: {
                    id: this.tag$.value.id,
                    name: this._nameInputElement.value
                }
            }
        }))
    }
    

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "tag":
                this.tag$.next(JSON.parse(newValue));
                break;
        }        
    }
    
    private get _titleElement(): HTMLElement { return this.querySelector("h2") as HTMLElement; }
    private get _saveButtonElement(): HTMLElement { return this.querySelector(".save-button") as HTMLElement };
    private get _nameInputElement(): HTMLInputElement { return this.querySelector(".tag-name") as HTMLInputElement;}
}

customElements.define(`ce-tag-edit`,TagEditComponent);
