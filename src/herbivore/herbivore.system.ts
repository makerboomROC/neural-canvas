import {System} from "../network/system";
import {Network} from "../network/network";
import {Node} from "../network/node";
import {Herbivore} from "./herbivore";
import {World} from "./world";
import {Layer} from "../network/layer";

export class HerbivoreSystem extends System {
    herbivore:Herbivore;

    clock:Node;
    health:Node;
    smell:Node;

    mouth:Node;
    propulsion:Node;
    rotation:Node;
    reproduction:Node;

    perception:Layer;

    constructor(herbivore:Herbivore, network?:Network) {
        super(network || Network.perceptron(3, 1, 4));

        this.herbivore = herbivore;
        this.perception = this.network.hidden[0];

        this.clock = this.inputs[0];
        this.health = this.inputs[1];
        this.smell = this.inputs[2];

        this.propulsion = this.outputs[0];
        this.rotation = this.outputs[1];
        this.mouth = this.outputs[2];
        this.reproduction = this.outputs[3];
    }

    tick(world:World) {
        let health = this.herbivore.health(),
            smell = this.herbivore.smell(world),
            inputs = [1, health, smell];

        super.tick(inputs);

        this.herbivore.eat(world);
        this.moveHerbivore();
        this.rotateHerbivore();
        if(this.reproduction.activation > 0.5) {
            this.herbivore.reproduce(world);
        }
    }

    moveHerbivore() {
        this.herbivore.move(this.propulsion.activation);
    }

    rotateHerbivore() {
        let direction = this.rotation.activation > 0.5 ? 1 : -1,
            degrees = this.rotation.activation;
        this.herbivore.rotate(direction * degrees);
    }

    clone():HerbivoreSystem {
        let network = this.network.clone(),
            system = new HerbivoreSystem(this.herbivore, network);

        return system;
    }
}