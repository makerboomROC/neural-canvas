import {Network} from "../brain/network";
import {Genome} from "../dna/genome";
import {Entity} from "../world/entity";
import {ForagerWorld} from "./forager.world";
import {ForagerGenome} from "./forager.genome";

export class Forager extends Entity {
    static viewAngle:number = Math.PI;
    static viewDistance:number = 192;

    genome:Genome;
    network:Network;
    viewAngle:number;
    viewDistance:number;

    constructor(x:number, y:number, angle:number, energy?:number, viewAngle:number = Forager.viewAngle, viewDistance:number = Forager.viewDistance) {
        super(x, y, angle, energy);
        this.genome = new Genome({
            layers: [3, 3, 3]
        });
        this.network = new Network(this.genome);
        this.viewAngle = viewAngle;
        this.viewDistance = viewDistance;
    }

    tick(world:ForagerWorld, ...args:any[]):boolean {
        let output = this.think(world),
            velocity = output[0] * 0.5,
            turnAngle = (output[1] - output[2]) * 0.1;

        this.move(velocity);
        this.turn(turnAngle);

        return super.tick(world, ...args);
    }

    think(world:ForagerWorld):number[] {
        let food = world.look(this),
            leftEye = 0,
            rightEye = 0;

        if (food !== null) {
            let foodAngle = this.angleTo(food);
            if (foodAngle < 0) {
                leftEye = Math.abs(foodAngle) / (this.viewAngle / 2);
            } else if (foodAngle > 0) {
                rightEye = Math.abs(foodAngle) / (this.viewAngle / 2);
            }
        }

        return this.network.activate([1, leftEye, rightEye]);
    }
}