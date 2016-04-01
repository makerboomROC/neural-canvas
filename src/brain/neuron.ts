import {Axon} from "./axon";
import {Gene} from "../dna/gene";

export class Neuron {
    energy:number;
    threshold:number;
    relaxation:number;
    axons:Axon[];

    constructor(gene:Gene) {
        this.threshold = gene.threshold;
        this.relaxation = gene.relaxation;
        this.energy = 0;
        this.axons = [];
    }

    activate(input?:number):number {
        if(typeof input !== 'undefined') {
            this.energy = input;
        }
        if(this.excited()) {
            this.fire();
            return 1;
        } else {
            this.relax();
            return 0;
        }
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
        let axon = new Axon(target, strength);
        this.axons.push(axon);
        return axon;
    }
}