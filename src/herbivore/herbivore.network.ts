import {Network} from "../network/network";
import {Layer} from "../network/layer";
import {Node} from "../network/node";

export class HerbivoreNetwork extends Network {
    perception:Layer;

    constructor(propulsion:Node, rotation:Node, perception?:Layer) {
        super();
        this.input.add(new Node());
        this.output.add(propulsion);
        this.output.add(rotation);

        this.perception = perception || new Layer(1);
        this.hidden.push(this.perception);

        this.input.project(this.perception);
        this.perception.project(this.output);
    }

}