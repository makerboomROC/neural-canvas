import {Connection} from "./connection";

export class Node {
    static squash(x:number, derivate:boolean = false) {
        if (!derivate)
            return 1 / (1 + Math.exp(-x));
        var fx = Node.squash(x);
        return fx * (1 - fx);
    }

    activation:number = 0;
    derivative:number = 0;
    bias:number = Math.random() * .2 - .1;
    state:number = 0;
    old:number = 0;

    inputs:Connection[] = [];
    outputs:Connection[] = [];
    selfConnection:Connection;
    squash:Function = Node.squash;

    constructor() {
        this.selfConnection = new Connection(this, this, 0);
    }

    // activate the neuron
    activate(input?:number):number {
        // activation from enviroment (for input neurons)
        if (typeof input != 'undefined') {
            this.activation = input;
            this.derivative = 0;
            this.bias = 0;
            return this.activation;
        }
        // old state
        this.old = this.state;

        // eq. 15
        this.state = this.selfConnection.gain * this.selfConnection.weight * this.state + this.bias;

        this.inputs.forEach(connection => {
            this.state += connection.input.activation * connection.weight * connection.gain;
        });

        // eq. 16
        this.activation = this.squash(this.state);

        // f'(s)
        this.derivative = this.squash(this.state, true);

        return this.activation;
    }

    outputTo(node:Node):Connection {
        if(node === this) {
            if(this.selfconnected()) {
                return this.selfConnection;
            } else {
                return null;
            }
        }

        let result = null;
        this.outputs.some(connection => {
            if (connection.output === node) {
                result = connection;
                return true;
            }
        });
        return result;
    }

    inputFrom(node:Node):Connection {
        if(node === this) {
            if(this.selfconnected()) {
                return this.selfConnection;
            } else {
                return null;
            }
        }

        let result = null;
        this.inputs.some(connection => {
            if (connection.output === node) {
                result = connection;
                return true;
            }
        });
        return result;
    }

    connected(node:Node):boolean{
        let connection = this.inputFrom(node) || this.outputTo(node);
        return typeof connection !== 'undefined';
    }

    project(node:Node, weight?:number):Connection {
        // self-connection
        if (node === this) {
            this.selfConnection.weight = 1;
            return this.selfConnection;
        }

        // check if connection already exists
        let connection = this.outputTo(node);
        if (connection) {
            // update connection
            if (typeof weight != 'undefined')
                connection.weight = weight;
            // return existing connection
            return connection;
        } else {
            // create a new connection
            connection = new Connection(this, node, weight);
        }

        // reference all the connections and traces
        this.outputs.push(connection);
        node.inputs.push(connection);

        return connection;
    }

    // returns true or false whether the neuron is self-connected or not
    selfconnected():boolean {
        return this.selfConnection.weight !== 0;
    }

    reset() {

    }

    clear() {

    }
    
    mutate(chance:number = 0.1) {
        this.outputs.forEach(connection => {
            if(Math.random() < chance) {
                connection.mutate();
            }
        })
    }
}