import {Network} from "./network";
import {LayerConnection, LayerConnectionType} from "./layer.connection";
import {Node} from './node';
import {Connection} from "./connection";

export class Layer {

    size:number;
    label:string;

    list:Node[] = [];
    connectedTo = [];

    build(list:Node[], label?:string) {
        let layer = new Layer(list.length, label);
        list.forEach(node => layer.add(node));
        return layer;
    }

    constructor(size?:number, label?:string) {
        this.size = size = size | 0;
        this.label = label || null;

        while (size--) {
            let node = new Node();
            this.list.push(node);
        }
    }

    // activates all the nodes in the layer
    activate(inputs?:number[]):number[] {
        let activations = [],
            index = 0;

        if (typeof inputs !== 'undefined') {
            if (inputs.length !== this.size)
                throw new Error("INPUT size and LAYER size must be the same to activate!");

            while (index < this.size) {
                let node = this.list[index],
                    input = inputs[index],
                    activation = node.activate(input);
                activations.push(activation);
                index++;
            }
        } else {
            while (index < this.size) {
                let node = this.list[index],
                    activation = node.activate();
                activations.push(activation);
                index++;
            }
        }
        return activations;
    }

    // projects a connection from this layer to another one
    project(layer:Layer|Network, type?:LayerConnectionType, weights?:number) {

        if (layer instanceof Network) {
            layer = (<Network>layer).input;
        }

        if (layer instanceof Layer) {
            if (!this.connected(layer))
                return new LayerConnection(this, layer, type, weights);
        } else
            throw new Error("Invalid argument, you can only project connections to LAYERS and NETWORKS!");


    }

    // true of false whether the layer is connected to another layer (parameter) or not
    connected(layer:Layer):LayerConnectionType {
        // Check if ALL to ALL connection
        let connections = 0;
        this.list.forEach((inputNode:Node) => {
            layer.list.forEach(outputNode => {
                if (inputNode.outputTo(outputNode)) {
                    connections++;
                }
            });
        });

        if (connections === this.size * layer.size)
            return LayerConnectionType.ALL_TO_ALL;

        // Check if ONE to ONE connection
        connections = 0;
        this.list.forEach((inputNode, index) => {
            let outputNode = layer.list[index];
            if (inputNode.outputTo(inputNode)) {
                connections++;
            }
        });
        if (connections == this.size) {
            return LayerConnectionType.ONE_TO_ONE;
        }
        return null;
    }

    projections():Connection[] {
        return this.list.reduce((result, node) => {
            return result.concat(node.outputs);
        }, [])
    }

    // clears all the neuorns in the layer
    clear() {
        this.list.forEach(node => {
            node.clear();
        });
    }

    // resets all the neurons in the layer
    reset() {
        this.list.forEach(node => {
            node.reset();
        });
    }

    // adds a neuron to the layer
    add(node:Node = new Node()):Node {
        this.size = this.list.push(node);
        return node;
    }

    mutate(chance:number = 0.1, projections:boolean = true, nodes:boolean = true) {
        this.list.forEach(node => {
            node.mutate(chance);
        });

        projections && this.mutateProjections(chance);
        nodes && this.mutateNodes(chance);
    }

    mutateNodes(chance:number = 0.1) {
        // Add random node
        if (Math.random() > 1 - chance / 10) {
            let projections = this.projections(),
                index = Math.floor(Math.random() * projections.length),
                projection = projections[index],
                outputNode = projection.output,
                newNode = this.add();

            newNode.project(outputNode);
            projection.output = newNode;
        }
    }

    mutateProjections(chance:number = 0.1) {
        // Add random connection
        if (Math.random() > 1 - chance / 10) {
            let inputIndex = Math.floor(Math.random() * this.list.length),
                outputIndex = Math.floor(Math.random() * this.list.length),
                inputNode = this.list[inputIndex],
                outputNode = this.list[outputIndex];

            inputNode.project(outputNode);
        }
        // Remove random connection
        else if (Math.random() > 1 - chance / 10) {
            let projections = this.projections(),
                index = Math.floor(Math.random() * projections.length),
                projection = projections[index],
                inputNode = projection.input,
                outputNode = projection.output;

            inputNode.deproject(outputNode);
        }
    }

    clone():Layer {
        let layer = new Layer(0, this.label);
        this.list.forEach(node => {
            layer.add(node);
        });
        // this.projections().forEach(projection => {
        //     let inputIndex = this.list.indexOf(projection.input),
        //         outputIndex = this.list.indexOf(projection.output),
        //         inputNode = layer.list[inputIndex],
        //         outputNode = layer.list[outputIndex];
        //     inputNode.project(outputNode, projection.weight);
        // });
        return layer;
    }
}