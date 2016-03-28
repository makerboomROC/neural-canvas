import {System} from "../network/system";
import {Network} from "../network/network";
import {Node} from "../network/node";
import {Herbivore} from "./herbivore";
import {World} from "./world";

export class HerbivoreSystem extends System {
    herbivore:Herbivore;

    clock:Node;
    health:Node;
    smell:Node;

    mouth:Node;
    propulsion:Node;
    rotatation:Node;

    constructor(herbivore:Herbivore) {
        super(Network.perceptron(3, 1, 3));

        this.herbivore = herbivore;

        this.clock = this.inputs[0];
        this.health = this.inputs[1];
        this.smell = this.inputs[2];

        this.propulsion = this.outputs[0];
        this.rotatation = this.outputs[1];
        this.mouth = this.outputs[2];
    }

    tick(world:World) {
        let health = this.herbivore.health(),
            smell = this.herbivore.smell(world),
            inputs = [1, health, smell];

        super.tick(inputs);

        this.herbivore.eat(world);
        this.moveHerbivore();
        this.rotateHerbivore();
    }

    moveHerbivore() {
        this.herbivore.move(this.propulsion.activation);
    }

    rotateHerbivore() {
        let direction = this.rotatation.activation > 0.5 ? 1 : -1,
            degrees = this.rotatation.activation;
        this.herbivore.rotate(direction * degrees);
    }
}