import {Entity} from "./entity";
import {Network} from "../brain/network";

export class ThinkingEntity extends Entity {
    network:Network;

    constructor(x:number, y:number, angle:number, maxEnergy:number, network:Network) {
        super(x, y, angle, maxEnergy);
        this.network = network;
    }

    tick(...args:any[]):boolean {
        let input = this.sense(...args),
            output = this.think(...input);
        this.act(...output, ...args)
        return super.tick(...args);
    }

    sense(...args:any[]):number[] {
        return [];
    }

    think(...input:number[]):number[] {
        return this.network.activate(...input);;
    }

    act(...args:any[]):void {
    }
}