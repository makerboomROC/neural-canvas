import {Location} from './location';
import {World} from "./world";

export class Entity {
    location:Location;
    energy:number;

    constructor(location:Location, energy?:number) {
        this.location = location;
        this.energy = energy || 0;
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

    clone() {
        let location = {x: this.location.x, y: this.location.y},
            energy = this.energy;

        return new Entity(location, energy);
    }
}