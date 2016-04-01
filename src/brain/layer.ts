import {Neuron} from "./neuron";
import {Gene} from "../dna/gene";

export class Layer {
    neurons:Neuron[];
    output:Layer;

    constructor(genes:Gene[], output?:Layer) {
        this.neurons = [];
        this.output = output;
        genes.forEach(gene => {
            let neuron = new Neuron(gene);
            this.neurons.push(neuron);
        });
    }

    activate(inputs?:number[]):number[] {
        // Input Layer
        if(typeof inputs !== 'undefined') {
            return this.neurons.map((neuron, index) => {
                let input = inputs[index];
                return neuron.activate(input);
            });
        } else {
            return this.neurons.map((neuron) => {
                return neuron.activate();
            });
        }
    }

    size():number {
        return this.neurons.length;
    }
}