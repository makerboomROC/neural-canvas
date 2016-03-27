import {Herbivore} from "./herbivore";
import {Node} from "../network/node";

export class HerbivorePropulsion extends Node {
    target:Herbivore;
    maxSpeed:number = 1;

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
                orientation = this.target.orientation - 90,
                angle = (Math.PI / 180) * orientation,
                location = this.target.location,
                dx = speed * Math.cos(angle),
                dy = speed * Math.sin(angle);
            location.x += dx;
            location.y += dy;
        }
    }
}