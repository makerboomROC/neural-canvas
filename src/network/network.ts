import {Layer} from "./layer";

export class Network {

    static perceptron(...layerSizes:number[]):Network {
        let inputSize = layerSizes.shift(),
            outputSize = layerSizes.pop(),
            input = new Layer(inputSize),
            output = new Layer(outputSize),
            hidden = [],
            previous = input;

        layerSizes.forEach(layerSize => {
            let layer = new Layer(layerSize);
            hidden.push(layer);
            previous.project(layer);
            previous = layer;
        });
        previous.project(output);

        let network = new Network(input, output, hidden);
        return network;
    }

    input:Layer;
    hidden:Layer[];
    output:Layer;
    optimized:boolean = false;

    constructor(input?:Layer, output?:Layer, hidden:Layer[] = []) {
        this.input = input || new Layer();
        this.output = output|| new Layer();
        this.hidden = hidden;
    }

    activate(input) {
        if (this.optimized === false) {
            this.input.activate(input);
            this.hidden.forEach(layer => {
                layer.activate();
            });
            return this.output.activate();
        }
        else {
            // if (this.optimized == null)
            //     this.optimize();
            // return this.optimized.activate(input);
        }
    }

    // project a connection to another unit (either a network or a layer)
    project(unit, type, weights) {

        if (unit instanceof Network)
            return this.output.project(unit.input, type, weights);

        if (unit instanceof Layer)
            return this.output.project(unit, type, weights);

        throw new Error("Invalid argument, you can only project connections to LAYERS and NETWORKS!");
    }

    clear() {
        this.input.clear();
        this.hidden.forEach(layer => {
            layer.clear();
        });
        this.output.clear();
    }

    // reset all weights and clear all traces (ends up like a new network)
    reset() {
        this.input.reset();
        this.hidden.forEach(layer => {
            layer.reset();
        });
        this.output.reset();
    }

    nodes() {
        let result = this.input.list.concat(this.output.list);
        this.hidden.forEach(layer => {
            result = result.concat(layer.list);
        });
        return result;
    }

    mutate(chance:number = 0.1) {
        this.input.mutate(chance, false);
        this.output.mutate(chance, false);
        this.hidden.forEach(layer => {
            layer.mutate(chance);
        });
    }
}