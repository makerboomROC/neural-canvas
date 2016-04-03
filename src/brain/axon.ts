import {Neuron} from "./neuron";

export class Axon {
    static maxStrength:number = 20;

    strength:number;
    origin:Neuron;
    target:Neuron;

    constructor(origin:Neuron, target:Neuron, strength:number) {
        this.origin = origin;
        this.target = target;
        this.strength = strength;
    }

    fire() {
        let energy = this.target.energy + this.strength;
        if(energy < 0) {
            energy = 0;
        }
        this.target.energy = energy;
    }

}
