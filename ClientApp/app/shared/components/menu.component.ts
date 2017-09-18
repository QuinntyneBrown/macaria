import { customEvents } from "../services/custom-events";

const template = document.createElement("template");
const html = require("./menu.component.html");
const css = require("./menu.component.css");

export const MENU_ITEM_CLICKED = "MENU_ITEM_CLICKED";
export const NAVIGATE_BY_URL = "NAVIGATE_BY_URL";

export class MenuComponent extends HTMLElement {
    constructor() {
        super();

        this._onMenuItemClick = this._onMenuItemClick.bind(this);
    }

    static get observedAttributes () {
        return [];
    }

    async connectedCallback() {

        template.innerHTML = `<style>${css}</style>${html}`; 

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.importNode(template.content, true));  

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'menu');

        this._bind();
        this._setEventListeners();
    }

    private async _bind() {

    }

    private _setEventListeners() {
        for (let i = 0; i < this.menuItemElements.length; i++) {
            this.menuItemElements[i].addEventListener("click", this._onMenuItemClick);
        }
    }

    private _onMenuItemClick(e: Event) {
        this.dispatchEvent(customEvents.create({
            name: NAVIGATE_BY_URL, detail: { url: (e.target as HTMLElement).getAttribute("[routerLink]") }
        }));        
    }

    disconnectedCallback() {
        for (let i = 0; i < this.menuItemElements.length; i++) {
            this.menuItemElements[i].removeEventListener("click", this._onMenuItemClick);
        }
    }

    public get menuItemElements(): NodeListOf<HTMLElement> {
        return this.shadowRoot.querySelectorAll("li a") as any;
    }

    attributeChangedCallback (name, oldValue, newValue) {
        switch (name) {
            default:
                break;
        }
    }
}

customElements.define(`ce-menu`,MenuComponent);
