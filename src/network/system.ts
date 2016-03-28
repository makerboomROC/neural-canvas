import {Network} from "./network";
import {Node} from "./node";

export class System {
    network:Network;
    inputs:Node[];
    outputs:Node[];

    constructor(network:Network) {
        if(typeof network !== 'undefined') {
            this.network = network;
            this.inputs = network.input.list;
            this.outputs = network.output.list;
        }
    }

    tick(input:any) {
        this.network.activate(input);
    }

    clone():System {
        let network = this.network.clone(),
            system = new System(network);
        return system;
    }
}