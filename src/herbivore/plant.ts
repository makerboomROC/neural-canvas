import {Entity} from "./entity";
import {Location} from "./location";

export class Plant extends Entity{
    constructor(location:Location, energy:number = 10) {
        super(location);
        this.energy = energy;
    }
}