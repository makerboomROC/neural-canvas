import {Network} from "../brain/network";
import {Genome} from "../dna/genome";
import {ForagerWorld} from "./forager.world";
import {Food} from "./food";
import {Shape} from "../world/shape";
import {ThinkingEntity} from "../world/thinking.entity";

export class Forager extends ThinkingEntity {
    static maxVelocity:number = 0.5;
    static maxTurn:number = 0.2;
    static maxEnergy:number = 10000;
    static viewAngle:number = Math.PI;
    static viewDistance:number = 192;

    genome:Genome;
    network:Network;
    viewAngle:number;
    viewDistance:number;

    constructor(x:number, y:number, angle:number, genome?:Genome) {
        genome = genome || new Genome({
                layers: [3, 3, 3]
            });
        let network = Network.build(genome);
        super(x, y, angle, Forager.maxEnergy, network);
        this.genome = genome;
        this.viewAngle = Forager.viewAngle;
        this.viewDistance = Forager.viewDistance;
        this.shape = Shape.Triangle;
    }

    tick(world:ForagerWorld, ...args:any[]):boolean {
        let food = world.findFood(this);
        return super.tick(world, food, ...args);
    }

    act(speed:number, turnLeft:number, turnRight:number, eat:number, world:ForagerWorld, food:Food):void {
        this.move(Forager.maxVelocity * speed);
        this.turn(Forager.maxTurn * (turnRight - turnLeft));
        if(eat > 0.5) this.eat(food);
    }

    sense(world:ForagerWorld, food:Food, ...args:any[]) {
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

        return [1, health, leftAngle, rightAngle];
    }
    

    eat(food:Food):boolean {
        if (food === null) {
            return false;
        }

        let deltaX = this.radius * Math.cos(this.angle),
            deltaY = this.radius * Math.sin(this.angle),
            mouthX = this.x + deltaX,
            mouthY = this.y + deltaY;

        if (!food.touchesXY(mouthX, mouthY)) {
            return false;
        }
        this.drain(food);
        return true;
    }

}