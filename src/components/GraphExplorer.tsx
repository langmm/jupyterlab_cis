import * as React from "react";
import * as ReactDOM from "react-dom";

import * as TheGraph from "the-graph";

export class GraphExplorer extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);
    
    console.log("TheGraph loaded:", TheGraph);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
  }
}

window.customElements.define('the-graph', GraphExplorer);

// Reactify it?
//export default reactify(GraphExplorer);

