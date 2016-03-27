import {Layer} from "./layer";
import {Connection} from "./connection";
import {Node} from "./node";

export enum LayerConnectionType {
    ONE_TO_ONE, ALL_TO_ALL, ALL_TO_ELSE
}

export class LayerConnection {
    input:Layer;
    output:Layer;
    selfConnection:boolean;
    type:LayerConnectionType;
    connections = {};
    list = [];
    size:number = 0;

    constructor(input:Layer, output:Layer, type:LayerConnectionType, weights) {
        this.input = input;
        this.output = output;
        this.selfConnection = output === input;
        this.type = type;
        this.connections = {};
        this.list = [];
        this.size = 0;

        if (typeof this.type === 'undefined') {
            if (input === output) {
                this.type = LayerConnectionType.ONE_TO_ONE;
            } else {
                this.type = LayerConnectionType.ALL_TO_ALL;
            }
        }

        if (this.type == LayerConnectionType.ALL_TO_ALL ||
            this.type == LayerConnectionType.ALL_TO_ELSE) {
            this.input.list.forEach(inputNode => {
                this.output.list.forEach(outputNode => {
                    if (this.type === LayerConnectionType.ALL_TO_ELSE && inputNode === outputNode) {
                        return;
                    }
                    this.connectNodes(inputNode, outputNode, weights);
                });
            });
        } else if (this.type === LayerConnectionType.ONE_TO_ONE) {
            this.input.list.forEach((inputNode, index) => {
                let outputNode = this.output.list[index];
                this.connectNodes(inputNode, outputNode, weights);
            });
        }

        input.connectedTo.push(this);
    }

    private connectNodes(inputNode:Node, outputNode:Node, weights):Connection {
        let connection = inputNode.project(outputNode, weights);
        this.size = this.list.push(connection);
        return connection;
    }

}