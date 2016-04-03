import {World} from "../world/world";
import {Forager} from "./forager";
import {Population} from "../world/population";
import {Food} from "./food";
import {Genome} from "../dna/genome";
import {Entity} from "../world/entity";

export class ForagerWorld extends World {
    static foodRestockRate = 100;
    static foodRatio = 1;

    genomes:Genome[];
    foragers:Population<Forager>;
    foodSupply:Population<Food>;

    constructor(width:number, height?:number) {
        super(width, height);
        this.genomes = [];
        this.population = this.foragers = new Population<Forager>();
        this.foodSupply = new Population<Food>();
    }

    add(entity:Entity|Food) {
        if(entity instanceof Food) {
            this.foodSupply.add(entity);
        } else {
            super.add(entity);
        }
    }

    forEach(callback:(entity:Entity, index:number) => void):void {
        super.forEach(callback);
        this.foodSupply.forEach(callback);
    }

    remove(entity:Entity):boolean{
        if(entity instanceof Food) {
            this.foodSupply.remove(entity);
        } else {
            return super.remove(entity);
        }
    }

    tick() {
        super.tick();
        this.foodSupply.tick();

        this.restockFoodSupply();
        this.connectEdges();
    }

    connectEdges() {
        this.foragers.forEach(forager => {
            if(forager.x < 0) {
                forager.x += this.width;
            }else if(forager.x > this.width) {
                forager.x -= this.width;
            }

            if(forager.y < 0) {
                forager.y += this.height;
            }else if(forager.y > this.height) {
                forager.y -= this.height;
            }
        })
    }

    /**
     * Restocks the foodSupply.
     */
    restockFoodSupply() {
        if (this.age % ForagerWorld.foodRestockRate === 0) {
            let ratio = this.foodSupply.size / this.foragers.size;
            if (ratio < ForagerWorld.foodRatio) {
                let x = Math.floor(Math.random() * this.width),
                    y = Math.floor(Math.random() * this.height),
                    food = new Food(x, y);
                this.add(food);
            }
        }
    }

    /**
     * Finds the nearest Food compared to the forager.
     * @param forager
     * @returns {Food}
     */
    findFood(forager:Forager):Food {
        let nearestDistance = Infinity,
            nearestFood = null,
            maxAngle = forager.viewAngle / 2,
            minAngle = -maxAngle;

        this.foodSupply.forEach(food => {
            let distance = forager.distanceTo(food),
                angle = forager.angleTo(food);
            if(angle > minAngle && angle > maxAngle && distance < nearestDistance) {
                nearestFood = food;
                nearestDistance = distance;
            }
        });

        return nearestFood;
    }

    fittest():Forager {
        return this.foragers.fittest();
    }
}