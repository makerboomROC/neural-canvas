import {HerbivorePropulsion} from "./herbivore.propulsion";
import {HerbivoreNetwork} from "./herbivore.network";
import {HerbivoreRotation} from "./herbivore.rotation";
import {Location} from './location';
import {Entity} from "./entity";

export class Herbivore extends Entity{
    orientation:number;

    rotation:HerbivoreRotation;
    propulsion:HerbivorePropulsion;
    network:HerbivoreNetwork;

    constructor(location:Location, orientation?:number) {
        super(location);

        this.orientation = orientation || Math.random() * 360;
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