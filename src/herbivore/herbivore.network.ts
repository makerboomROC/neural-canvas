import {Network} from "../network/network";
import {Layer} from "../network/layer";
import {Node} from "../network/node";
import {World} from "./world";
import {HerbivoreNose} from "./herbivore.nose";

export class HerbivoreNetwork extends Network {
    perception:Layer;

    constructor(inputs:Node[], outputs:Node[], perception?:Layer) {
        super();
        this.input.add(new Node());
        inputs.forEach(input => {
            this.input.add(input);
        });
        outputs.forEach(output => {
            this.output.add(output);
        });

        this.perception = perception || new Layer(1);
        this.hidden.push(this.perception);

        this.input.project(this.perception);
        this.perception.project(this.output);
    }

    activate(world:World){
        let inputs = [0];
        while(inputs.length < this.input.size) {
            inputs.push(world);
        }
        super.activate(inputs);
    }

}