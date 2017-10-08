import { customEvents } from "../services/custom-events";
import { Logger, ILogger } from "../services/logger.service";

const template = document.createElement("template");
const html = require("./menu.component.html");
const css = require("./menu.component.css");

export const MENU_ITEM_CLICKED = "MENU_ITEM_CLICKED";
export const NAVIGATE_BY_URL = "NAVIGATE_BY_URL";

export class MenuComponent extends HTMLElement {
    constructor(private _logger: ILogger = Logger.instance) {
        super();

        this._onMenuItemClick = this._onMenuItemClick.bind(this);
    }

    async connectedCallback() {
        this._logger.trace(`(Menu) connectedCallback`);

        template.innerHTML = `<style>${css}</style>${html}`; 

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.importNode(template.content, true));  

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'menu');

        this._setEventListeners();
    }

    private _setEventListeners() {        
        for (let i = 0; i < this.menuItemElements.length; i++) {
            this.menuItemElements[i].addEventListener("click", this._onMenuItemClick);
        }
    }

    private _onMenuItemClick(e: Event) {
        e.stopPropagation();
        e.preventDefault();
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
}

customElements.define(`ce-menu`,MenuComponent);
