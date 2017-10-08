const template = document.createElement("template");
const html = require("./backdrop.component.html");
const css = require("./backdrop.component.css");
import { Logger, ILogger } from "../services/logger.service";

export class BackdropComponent extends HTMLElement {
    constructor(private _logger: ILogger = Logger.instance) {
        super();
    }
    
    connectedCallback() {
        this._logger.warn(`(Backdrop) connectedCallback`);

        template.innerHTML = `<style>${css}</style>${html}`;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.importNode(template.content, true));

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'backdrop');        
    }
    
}

customElements.define(`ce-backdrop`, BackdropComponent);