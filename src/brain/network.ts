import {Layer} from "./layer";
import {Genome} from "../dna/genome";
import {Neuron} from "./neuron";

export class Network {
    layers:Layer[];
    hidden:Layer[];
    input:Layer;
    output:Layer;
    neurons:Neuron[];

    constructor(genome:Genome) {
        this.layers = [];
        this.neurons = [];

        let index = genome.genes.length,
            outputLayer:Layer = null;

        genome.layers.reverse().forEach(size => {
            let genes = genome.genes.slice(index - size, index),
                layer = new Layer(genes);

            genes.forEach((gene, index) => {
                if (outputLayer) {
                    gene.outputs.forEach((strength, target) => {
                        let input = layer.neurons[index],
                            output = outputLayer.neurons[target];
                        if(typeof output !== 'undefined') {
                            input.project(output, strength);
                        }
                    });
                }
            });

            this.layers.unshift(layer);
            this.neurons = this.neurons.concat(layer.neurons);

            index -= size;
            outputLayer = layer;
        });

        this.input = this.layers[0];
        this.output = this.layers[this.layers.length - 1];
        this.hidden = this.layers.slice(1, this.layers.length - 1);
    }

    activate(inputs:number[]):number[] {
        let output = null;
        this.layers.forEach(layer => {
            if (layer === this.input) {
                output = layer.activate(inputs);
            } else {
                output = layer.activate();
            }
        });
        return output;
    }

}