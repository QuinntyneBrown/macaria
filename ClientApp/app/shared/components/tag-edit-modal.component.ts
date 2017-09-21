const template = document.createElement("template");
const html = require("./tag-edit-modal.component.html");
const css = require("./tag-edit-modal.component.css");
const modalCss = require("../../../styles/modal-window.css");

export class TagEditModalComponent extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes () {
        return [];
    }

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

    }

    private _setEventListeners() {

    }

    disconnectedCallback() {

    }

    attributeChangedCallback (name, oldValue, newValue) {
        switch (name) {
            default:
                break;
        }
    }
}

customElements.define(`ce-tag-edit-modal`,TagEditModalComponent);
