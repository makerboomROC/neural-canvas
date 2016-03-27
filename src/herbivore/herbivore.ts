import {HerbivorePropulsion} from "./herbivore.propulsion";
import {HerbivoreNetwork} from "./herbivore.network";
import {HerbivoreRotation} from "./herbivore.rotation";
import {Location} from './location';
import {Entity} from "./entity";
import {World} from "./world";
import {HerbivoreNose} from "./herbivore.nose";
import {Plant} from "./plant";
import {HerbivoreMouth} from "./herbivore.mouth";
import {HerbivoreHealth} from "./herbivore.health";

export class Herbivore extends Entity{
    orientation:number;

    nose:HerbivoreNose;
    mouth:HerbivoreMouth;
    health:HerbivoreHealth;

    rotation:HerbivoreRotation;
    propulsion:HerbivorePropulsion;

    network:HerbivoreNetwork;

    energy:number = 100;
    maxEnergy:number = 100;

    constructor(location:Location, orientation?:number) {
        super(location);

        this.orientation = orientation || Math.random() * 360;

        this.nose = new HerbivoreNose(this);
        this.mouth= new HerbivoreMouth(this);
        this.health= new HerbivoreHealth(this);

        this.propulsion = new HerbivorePropulsion(this);
        this.rotation = new HerbivoreRotation(this);

        let inputs = [this.nose, this.mouth],
            outputs = [this.propulsion, this.rotation];
        let network = this.network = new HerbivoreNetwork(inputs, outputs),
            count = 0;
    }

    tick(world:World) {
        super.tick(world);
        if(this.energy > 0){
            this.network.activate(world);
        }
    }

    eat(plant:Plant) {
        let gain = plant.energy,
            maxGain = this.maxEnergy - this.energy;
        if(gain > maxGain) {
            gain = maxGain;
        }
        plant.energy -= gain;
        this.energy += gain;
    }
}