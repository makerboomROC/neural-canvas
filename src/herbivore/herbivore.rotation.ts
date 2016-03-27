import {Herbivore} from "./herbivore";
import {Node} from "../network/node";

export class HerbivoreRotation extends Node {
    target:Herbivore;
    maxSpeed:number = 1;

    constructor(target:Herbivore) {
        super();
        this.target = target;
    }

    activate(input?:number):number {
        let result = super.activate(input);
        this.rotateTarget();
        return result;
    }

    rotateTarget() {
        if(this.activation !== 0){
            let activation = this.activation;
            if(Math.random() > 0.5) activation *= -1;

            let speed = activation * this.maxSpeed;
            this.target.orientation += speed;
        }
    }
}