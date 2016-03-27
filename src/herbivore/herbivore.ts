import {HerbivorePropulsion} from "./herbivore.propulsion";
import {HerbivoreNetwork} from "./herbivore.network";

interface Location {
    x:number;
    y:number;
}

export class Herbivore {
    location:Location;
    orientation:number;

    propulsion:HerbivorePropulsion;
    network:HerbivoreNetwork;

    constructor(location:Location, orientation:number) {
        this.location = location;
        this.orientation = orientation;

        this.propulsion = new HerbivorePropulsion(this);
        this.network = new HerbivoreNetwork(this.propulsion);
    }

    tick() {
        this.network.activate([1]);
    }
}