import {Network} from "../brain/network";
import {NetworkGenome} from "../brain/network.genome";
import {ForagerWorld} from "./forager.world";
import {Food} from "./food";
import {Shape} from "../world/shape";
import {ThinkingEntity} from "../world/thinking.entity";

export class Forager extends ThinkingEntity {
    static lastId:number = 0;
    static maxVelocity:number = 1;
    static maxTurn:number = 0.3;
    static maxEnergy:number = 10000;
    static viewAngle:number = Math.PI;
    static viewDistance:number = 192;

    static networkInputs:number = 4;
    static networkOutputs:number = 4;

    id:number;
    genome:NetworkGenome;
    network:Network;
    viewAngle:number;
    viewDistance:number;
    
    eaten:number;

    static genome(minLayers = 1, maxLayers = 2, minSize?:number, maxSize?:number):NetworkGenome {
        if(typeof minSize === 'undefined') {
            minSize = Math.min(Forager.networkInputs, Forager.networkOutputs) - 1;
        }
        if(typeof maxSize === 'undefined') {
            maxSize = Math.max(Forager.networkInputs, Forager.networkOutputs) + 1;
        }
        let hiddenLayers = [],
            numLayers= Math.floor(minLayers + (maxLayers - minLayers + 1) * Math.random());

        while(hiddenLayers.length < numLayers) {
            let layerSize = Math.floor(minSize + (maxSize - minSize) * Math.random());
            hiddenLayers.push(layerSize);
        }

        let layers = [Forager.networkInputs].concat(hiddenLayers).concat([Forager.networkOutputs]);

        return NetworkGenome.random(layers);
    }

    constructor(x:number, y:number, angle:number, genome?:NetworkGenome) {
        genome = genome || Forager.genome();
        let network = Network.build(genome);
        super(x, y, angle, Forager.maxEnergy, network);
        this.genome = genome;
        this.viewAngle = Forager.viewAngle;
        this.viewDistance = Forager.viewDistance;
        this.shape = Shape.Triangle;
        this.eaten = 0;
        this.id = ++Forager.lastId;
    }

    tick(world:ForagerWorld, ...args:any[]):boolean {
        let food = world.findFood(this);
        return super.tick(world, food, ...args);
    }

    act(speed:number, turnLeft:number, turnRight:number, eat:number, world:ForagerWorld, food:Food):void {
        let distance = Forager.maxVelocity * speed;
        if(this.move(distance)) {
            this.energy -= distance * 1;
        }
        let angle = Forager.maxTurn * (turnRight - turnLeft);
        if(this.turn(angle)){
            this.energy -= angle * 0.1;
        }
        // if(eat > 0.5)
            this.eat(food);
    }

    sense(world:ForagerWorld, food:Food, ...args:any[]):number[] {
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

        return [20, health * 20, leftAngle * 20, rightAngle * 20];
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
        this.eaten += this.drain(food);
        return true;
    }

}