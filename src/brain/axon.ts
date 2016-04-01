import {Neuron} from "./neuron";

export class Axon {
    static maxStrength:number = 20;

    strength:number;
    target:Neuron;

    constructor(target:Neuron, strength:number) {
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
