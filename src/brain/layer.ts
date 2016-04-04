import {Neuron} from "./neuron";
import {NeuronGene} from "./neuron.gene";

export class Layer {
    neurons:Neuron[];
    size:number;
    output:Layer;

    static build(genes:NeuronGene[], output?:Layer):Layer {
        let neurons = genes.map(gene => {
                return Neuron.build(gene);
            });
        return new Layer(output, neurons);
    }

    constructor(output?:Layer, neurons:Neuron[] = []) {
        this.output = output;
        this.neurons = neurons;
        this.size = 0;
    }

    activate(inputs?:number[]):number[] {
        // Input Layer
        if (typeof inputs !== 'undefined') {
            return this.neurons.map((neuron, index) => {
                let input = inputs[index],
                    energy = neuron.activate(input);
                return energy / neuron.threshold;
            });
        } else {
            return this.neurons.map((neuron) => {
                let energy = neuron.activate();
                return energy / neuron.threshold;
            });
        }
    }

    add(neuron:Neuron):number {
        this.size = this.neurons.push(neuron);
        return this.size;
    }
}