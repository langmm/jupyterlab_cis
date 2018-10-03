import {Widget} from "@phosphor/widgets";
import {Message} from "@phosphor/messaging";
import * as React from "react";
import * as ReactDOM from "react-dom";

import * as TheGraph from "the-graph";
import * as fbpGraph from "fbp-graph";


export class CisGraphWidget extends Widget {
    
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
        
        this.graph = new fbpGraph.Graph();
        
        this.id = 'cis-graph-jupyterlab';
        this.title.label = 'CiS Model Composer';
        this.title.closable = true;
        this.addClass('jp-graphWidget');

// <h4 class="pull-left libraryHeader">Model Library</h4>
                //<table>
                //</table>
        ReactDOM.render(<div id="jp-graphviewer">
               
        
                <div id="editor">
                    <link rel="stylesheet" href="node_modules/the-graph/themes/the-graph-dark.css"/>
                    <link rel="stylesheet" href="node-modules/the-graph/themes/the-graph-light.css"/>
                    
                    <div id="jp-graph" className="the-graph-dark"></div>
                </div>
                
                <i className="fa fa-fw fa-eye"></i>
            
                <div id="button-bar">
                  <button id="random" onClick={this.random}>random graph</button>
                  <button id="addnode" onClick={this.addnode}>add node</button>
                  <button id="addedge" onClick={this.addedge}>add edge</button>
                  <button id="get" onClick={this.get}>get graph</button>
                  <button id="clear" onClick={this.clear}>clear</button>
                </div>
            </div>, this.node);
            
        /*ReactDOM.render(
          <Graph
            width={window.innerWidth}
            height={window.innerHeight}
          />,
          this.node
        );*/
    }
    
    // Add node button
    addnode = () => {
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
    
    get = () => {
        
        var graphJSON = JSON.stringify(this.graph.toJSON(), null, 2);
        alert(graphJSON);
        //you can use the var graphJSON to save the graph definition in a file/database
    }
    
    clear = () => {
        this.graph = new fbpGraph.Graph();
        this.render();
    }
    
    random = () => {
        this.graph.startTransaction('randomgraph');
        for (var i=0; i<20; i++) {
          var node = this.addnode();
          this.addedge(node.id);
          this.addedge(node.id);
        }
        this.graph.endTransaction('randomgraph');
    }
    
    addedge = (outNodeID: any = null) => {
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
    
    render = () => {
        var editor = document.getElementById('jp-graph');
        var props = {
            readonly: false,
            height: /*editor ? editor.parentElement.clientHeight :*/ 600,
            width: /*editor ? editor.parentElement.clientWidth :*/ 800,
            graph: this.graph,
            library: this.library,
        };
        console.log('rendering graph', props);
        var element = React.createElement(TheGraph.App, props);
        ReactDOM.render(element, editor);
    }
    
    onUpdateRequest(msg: Message): void {
        this.render();
    }
}
