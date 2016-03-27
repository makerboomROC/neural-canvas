import {Herbivore} from "./herbivore";
import {Node} from "../network/node";

export class Engine extends Node {
    target:Herbivore;
    maxSpeed:number = 0.1;

    constructor(target:Herbivore) {
        super();
        this.target = target;
    }

    activate(input?:number):number {
        let result = super.activate(input);
        this.moveTarget();
        return result;
    }

    moveTarget() {
        if(this.activation !== 0){
            let speed = this.activation * this.maxSpeed,
                angle = (Math.PI / 180) * this.target.orientation,
                location = this.target.location,
                dx = speed * Math.sin(angle),
                dy = speed * Math.cos(angle);
            location.x += dx;
            location.y -= dy;
        }
    }
}