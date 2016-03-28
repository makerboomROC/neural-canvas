import {Layer} from "./layer";
import {Connection} from "./connection";
import {Node} from "./node";

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
        this.output = output || new Layer();
        this.hidden = hidden;
    }

    projections(onlyHidden:boolean = false):Connection[] {
        let projections = [],
            nodes = this.nodes(onlyHidden);
        nodes.forEach(node => {
            projections = projections.concat(node.outputs);
        });
        return projections;
    }

    activate(input?:any):number[] {
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

    nodes(onlyHidden:boolean = false):Node[] {
        let result = [];
        if (!onlyHidden) {
            result = result
                .concat(this.input.list)
                .concat(this.output.list);
        }
        this.hidden.forEach(layer => {
            result = result.concat(layer.list);
        });
        return result;
    }

    mutate(chance:number = 0.1) {

        this.mutateProjections(chance);
        this.mutateNodes(chance);

        this.input.mutate(chance, false, false);
        this.output.mutate(chance, false, false);
        this.hidden.forEach(layer => {
            layer.mutate(chance, false, false);
        });

    }

    mutateProjections(chance:number = 0.1) {
        // Add random connection
        if (Math.random() < chance / 10) {
            let nodes = this.nodes(),
                inputIndex = Math.floor(Math.random() * nodes.length),
                outputIndex = Math.floor(Math.random() * nodes.length),
                inputNode = nodes[inputIndex],
                outputNode = nodes[outputIndex];

            inputNode.project(outputNode);
        }
        // Remove random connection
        else if (Math.random() < chance / 10) {
            let projections = this.projections(),
                index = Math.floor(Math.random() * projections.length),
                projection = projections[index],
                inputNode = projection.input,
                outputNode = projection.output;

            inputNode.deproject(outputNode);
        }
    }

    mutateNodes(chance:number = 0.1) {
        let index = Math.floor(Math.random() * this.hidden.length),
            layer = this.hidden[index];
        layer.mutateNodes(chance);
    }

    clone() {
        let input = this.input.clone(),
            output = this.output.clone(),
            hidden = this.hidden.map(layer => layer.clone()),
            originalNodes:Node[] = this.nodes(),
            network = new Network(input, output, hidden),
            nodes = network.nodes();

        originalNodes.forEach((originalInputNode, inputIndex) => {
            let inputNode = nodes[inputIndex];
            originalInputNode.outputs.forEach((originalOutputNode, outputIndex) => {
                let outputNode = nodes[outputIndex];
                inputNode.project(outputNode);
            });
        });

        return network;
    }
}

export class Perceptron extends Network {

}