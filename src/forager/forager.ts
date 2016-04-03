import {Network} from "../brain/network";
import {Genome} from "../dna/genome";
import {Entity} from "../world/entity";
import {ForagerWorld} from "./forager.world";
import {ForagerGenome} from "./forager.genome";
import {Food} from "./food";
import {Shape} from "../world/shape";

export class Forager extends Entity {
    static maxEnergy:number = 10000;
    static viewAngle:number = Math.PI;
    static viewDistance:number = 192;

    genome:Genome;
    network:Network;
    viewAngle:number;
    viewDistance:number;

    constructor(x:number, y:number, angle:number, genome?:Genome) {
        super(x, y, angle, Forager.maxEnergy);
        this.genome = genome || new Genome({
            layers: [3, 3, 3]
        });
        this.network = Network.build(this.genome);
        this.viewAngle = Forager.viewAngle;
        this.viewDistance = Forager.viewDistance;
        this.shape = Shape.Triangle;
    }

    tick(world:ForagerWorld, ...args:any[]):boolean {
        let food = world.findFood(this),
            output = this.think(food),
            velocity = output[0] * 0.5,
            turnAngle = (output[1] - output[2]) * 0.2,
            eat = output[2];

        if(food && eat) this.eat(food);
        this.move(velocity);
        this.turn(turnAngle);

        return super.tick(world, ...args);
    }

    think(food:Food):number[] {
        let leftAngle = 0,
            rightAngle = 0,
            health = this.energy / this.maxEnergy;

        if (food !== null) {
            let foodAngle = this.angleTo(food);
            if (foodAngle < 0) {
                leftAngle = Math.abs(foodAngle) / (this.viewAngle / 2);
            } else if (foodAngle > 0) {
                rightAngle = Math.abs(foodAngle) / (this.viewAngle / 2);
            }
        }

        return this.network.activate([1, health, leftAngle, rightAngle]);
    }
    
    eat(food:Food):boolean {
        if(food === null) {
            return false;
        }

        let deltaX = this.radius * Math.cos(this.angle),
            deltaY = this.radius * Math.sin(this.angle),
            mouthX = this.x + deltaX,
            mouthY = this.y + deltaY;

        if(!food.touchesXY(mouthX, mouthY)) {
            return false;
        }
        this.drain(food);
        return true;
    }

}