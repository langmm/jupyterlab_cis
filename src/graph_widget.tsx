import {Widget} from "@phosphor/widgets";
import {Message} from "@phosphor/messaging";
import * as React from "react";
import * as ReactDOM from "react-dom";

import * as TheGraph from "the-graph";
import * as fbpGraph from "fbp-graph";

export class CisGraphWidget extends Widget {

    data: HTMLDivElement;
    buttonBar: HTMLDivElement;
    
    randomBtn: HTMLButtonElement;
    getBtn: HTMLButtonElement;
    addnodeBtn: HTMLButtonElement;
    addedgeBtn: HTMLButtonElement;
    clearBtn: HTMLButtonElement;
    
    graph: any;
    library: any;

    constructor() {
        super();
        
        // Component library
        this.library = {
            basic: {
              name: 'basic',
              description: 'basic demo component',
              icon: 'eye',
              inports: [
                {'name': 'in0', 'type': 'all'},
                {'name': 'in1', 'type': 'all'},
                {'name': 'in2', 'type': 'all'}
              ],
              outports: [
                {'name': 'out', 'type': 'all'}
              ]
            },
            tall: {
              name: 'tall',
              description: 'tall demo component',
              icon: 'cog',
              inports: [
                {'name': 'in0', 'type': 'all'},
                {'name': 'in1', 'type': 'all'},
                {'name': 'in2', 'type': 'all'},
                {'name': 'in3', 'type': 'all'},
                {'name': 'in4', 'type': 'all'},
                {'name': 'in5', 'type': 'all'},
                {'name': 'in6', 'type': 'all'},
                {'name': 'in7', 'type': 'all'},
                {'name': 'in8', 'type': 'all'},
                {'name': 'in9', 'type': 'all'},
                {'name': 'in10', 'type': 'all'},
                {'name': 'in11', 'type': 'all'},
                {'name': 'in12', 'type': 'all'}
              ],
              outports: [
                {'name': 'out0', 'type': 'all'}
              ]
            }
        };
        
        debugger;
        this.graph = new fbpGraph.Graph();
        
        this.id = 'cis-graph-jupyterlab';
        this.title.label = 'CiS Model Composer';
        this.title.closable = true;
        this.addClass('jp-graphWidget');
        
        
        this.data = document.createElement('div');
        this.data.className = "the-graph-dark";
        this.data.id = "jp-graph";
        
        let me = this;
        
        this.randomBtn = document.createElement('button');
        this.randomBtn.id = "random";
        this.randomBtn.innerHTML = 'Random';
        this.randomBtn.onclick = function() { me.random(); };
        this.getBtn = document.createElement('button');
        this.getBtn.id = "get";
        this.getBtn.innerHTML = 'Get';
        this.getBtn.onclick = function() { me.get(); };
        this.addedgeBtn = document.createElement('button');
        this.addedgeBtn.id = "addedge";
        this.addedgeBtn.innerHTML = 'Add Edge';
        this.addedgeBtn.onclick = function(event) { me.addedge(event); };
        this.addnodeBtn = document.createElement('button');
        this.addnodeBtn.id = "addnode";
        this.addnodeBtn.innerHTML = 'Add Node';
        this.addnodeBtn.onclick = function() { me.addnode(); };
        this.clearBtn = document.createElement('button');
        this.clearBtn.id = "clear";
        this.clearBtn.innerHTML = 'Clear';
        this.clearBtn.onclick = function() { me.clear(); };
        
        
        this.buttonBar = document.createElement('div');
        this.buttonBar.id = 'button-bar';
        this.buttonBar.style.position = 'absolute';
        this.buttonBar.appendChild(this.randomBtn);
        this.buttonBar.appendChild(this.getBtn);
        this.buttonBar.appendChild(this.addedgeBtn);
        this.buttonBar.appendChild(this.addnodeBtn);
        this.buttonBar.appendChild(this.clearBtn);
        
        this.node.appendChild(this.data);
        this.node.appendChild(this.buttonBar);

/*
            <div id="jp-graphviewer">
                <div id="editor">
                    <link rel="stylesheet" href="node_modules/the-graph/themes/the-graph-dark.css"/>
                    <link rel="stylesheet" href="node-modules/the-graph/themes/the-graph-light.css"/>
                    
                    <div id="jp-graph" className="the-graph-dark"></div>
                </div>
            
                <div id="button-bar">
                  <button id="random" onClick={this.random}>random graph</button>
                  <button id="addnode" onClick={this.addnode}>add node</button>
                  <button id="addedge" onClick={this.addedge}>add edge</button>
                  <button id="get" onClick={this.get}>get graph</button>
                  <button id="clear" onClick={this.clear}>clear</button>
                </div>
            </div>
*/
    }
    
    
        
      // Add node button
    addnode() {
        var id = Math.round(Math.random()*100000).toString(36);
        var component = Math.random() > 0.5 ? 'basic' : 'tall';
        var metadata = {
          label: component,
          x: Math.round(Math.random()*800),
          y: Math.round(Math.random()*600)
        };
        var newNode = this.graph.addNode(id, component, metadata);
        return newNode;
    }
    
    get() {
        
        var graphJSON = JSON.stringify(this.graph.toJSON(), null, 2);
        alert(graphJSON);
        //you can use the var graphJSON to save the graph definition in a file/database
    }
    
    clear() {
        this.graph = new fbpGraph.Graph();
        this.render();
    }
    
    random() {
        this.graph.startTransaction('randomgraph');
        for (var i=0; i<20; i++) {
          var node = this.addnode();
          this.addedge(node.id);
          this.addedge(node.id);
        }
        this.graph.endTransaction('randomgraph');
    }
    
    addedge(outNodeID: any = null) {
        var nodes = this.graph.nodes;
        var len = nodes.length;
        if ( len<1 ) { return; }
        var node1 = outNodeID || nodes[Math.floor(Math.random()*len)].id;
        var node2 = nodes[Math.floor(Math.random()*len)].id;
        var port1 = 'out' + Math.floor(Math.random()*3);
        var port2 = 'in' + Math.floor(Math.random()*12);
        var meta = { route: Math.floor(Math.random()*10) };
        var newEdge = this.graph.addEdge(node1, port1, node2, port2, meta);
        return newEdge;
      }
    
    render() {
        var props = {
            readonly: false,
            height: 600, // window.innerHeight,
            width: 800, // window.innerWidth,
            graph: this.graph,
            library: this.library,
        };
        //console.log('render', props);
        var editor = document.getElementById('jp-graph');
        if (editor) {
            editor['width'] = props.width;
            editor['height'] = props.height;
        }
        var element = React.createElement(TheGraph.App, props);
        ReactDOM.render(element, editor);
    }
    
    onUpdateRequest(msg: Message): void {
        this.render();
    }



}
