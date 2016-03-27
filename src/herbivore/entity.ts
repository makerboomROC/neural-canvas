import {Location} from './location';
import {World} from "./world";

export class Entity {
    location:Location;
    energy:number;

    constructor(location:Location) {
        this.location = location;
    }

    tick(world:World) {
        if(this.energy <= 0) {
            world.remove(this);
        }
    }

    distance(location:Location) {
        let dx = Math.abs(this.location.x - location.x),
            dy = Math.abs(this.location.y - location.y);
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }
}