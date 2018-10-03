import * as React from "react";
import * as ReactDOM from "react-dom";

export class ModelPalette extends Widget {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
  }
}

window.customElements.define('model-palette', ModelPalette);

// Reactify it?
//export default reactify(GraphExplorer);

