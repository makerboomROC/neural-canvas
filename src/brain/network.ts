import {Layer} from "./layer";
import {Neuron} from "./neuron";
import {NetworkGenome} from "./network.genome";
import {NeuronGene} from "./neuron.gene";

export class Network {
    layers:Layer[];
    size:number;

    hidden:Layer[];
    input:Layer;
    output:Layer;

    neurons:Neuron[];

    static build(genome:NetworkGenome):Network {
        let index = genome.genes.length,
            outputLayer:Layer = null,
            layers = [];

        genome.layers.reverse().forEach(size => {
            let genes = genome.genes.slice(index - size, index),
                layer = Layer.build(genes);

            genes.forEach((gene, index) => {
                if (outputLayer !== null) {
                    (<NeuronGene>gene).outputs.forEach((strength, target) => {
                        let input = layer.neurons[index],
                            output = outputLayer.neurons[target];
                        if (typeof output !== 'undefined' && typeof strength === 'number') {
                            input.project(output, strength);
                        }
                    });
                }
            });

            layers.unshift(layer);

            index -= size;
            outputLayer = layer;
        });

        return new Network(layers);
    }

    constructor(layers:Layer[]) {
        if (layers.length < 3) {
            throw new Error("A network must have at least 3 layers");
        }
        this.layers = [];
        this.size = 0;
        layers.forEach(layer => this.add(layer));
        this.input = this.layers[0];
        this.output = this.layers[this.layers.length - 1];
        this.hidden = this.layers.slice(1, this.layers.length - 1);
        this.neurons = this.layers.reduce((neurons, layer) => neurons.concat(layer.neurons), []);
    }

    add(layer:Layer):number {
        this.size = this.layers.push(layer);
        return this.size;
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