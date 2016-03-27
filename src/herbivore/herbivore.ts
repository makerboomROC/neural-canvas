import {HerbivorePropulsion} from "./herbivore.propulsion";
import {HerbivoreNetwork} from "./herbivore.network";
import {HerbivoreRotation} from "./herbivore.rotation";

interface Location {
    x:number;
    y:number;
}

export class Herbivore {
    location:Location;
    orientation:number;

    rotation:HerbivoreRotation;
    propulsion:HerbivorePropulsion;
    network:HerbivoreNetwork;

    constructor(location:Location, orientation:number) {
        this.location = location;
        this.orientation = orientation;

        this.propulsion = new HerbivorePropulsion(this);
        this.rotation = new HerbivoreRotation(this);
        let network = this.network = new HerbivoreNetwork(this.propulsion, this.rotation);
        network.mutate(1);
        network.mutate(1);
        network.mutate(1);
    }

    tick() {
        this.network.activate([1]);
    }
}