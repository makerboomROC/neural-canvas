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

    mutate(rate = 0.1, gradient?:number) {
        if(typeof gradient === 'undefined') {
            gradient = 0.01;
            if(Math.random() < 0.5) {
                gradient *= -1;
            }
        }
        this.weight += rate * gradient;
    }
    
}