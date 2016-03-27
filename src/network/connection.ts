import {Node} from './node';

export class Connection {
    input:Node;
    output:Node;
    weight:number;
    gain:number = 1;

    // activate the neuron
    constructor(input:Node, output:Node, weight?:number) {
        this.input = input;
        this.output = output;
        this.weight = typeof weight == 'undefined' ? Math.random() * .2 - .1 : weight;
    }
    
}