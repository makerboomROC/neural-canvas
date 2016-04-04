import {Axon} from "./axon";
import {NeuronGene} from "./neuron.gene";

export class Neuron {
    energy:number;
    threshold:number;
    relaxation:number;
    axons:Axon[];

    static build(gene:NeuronGene) {
        return new Neuron(gene.threshold, gene.relaxation);
    }

    constructor(threshold:number, relaxation:number) {
        this.threshold = threshold;
        this.relaxation = relaxation;
        this.energy = 0;
        this.axons = [];
    }

    activate(input?:number):number {
        if(typeof input !== 'undefined') {
            this.energy = input;
        }
        if(this.excited()) {
            this.fire();
        } else {
            this.relax();
        }
        return this.energy;
    }

    fire() {
        this.axons.forEach(axon => {
            axon.fire();
        });
        this.energy = 0;
    }

    relax() {
        if ( this.energy > 0.01 ) {
            this.energy *= this.relaxation;
        }
    }

    excited():boolean {
        return this.energy > this.threshold;
    }
    
    project(target:Neuron, strength:number):Axon {
        let axon = new Axon(this, target, strength);
        this.axons.push(axon);
        return axon;
    }
}