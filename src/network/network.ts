import {Layer} from "./layer";

export class Network {
    input:Layer = null;
    hidden:Layer[] = [];
    output:Layer = null;
    optimized:boolean = false;

    constructor(inputSize:number = 0, outputSize:number = 0) {
        this.input = new Layer(inputSize);
        this.output = new Layer(outputSize);
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
}