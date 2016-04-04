import {World} from "../world/world";
import {Forager} from "./forager";
import {Population} from "../world/population";
import {Food} from "./food";
import {NetworkGenome} from "../brain/network.genome";
import {Entity} from "../world/entity";
import {RestockPopulation} from "../world/restock.population";

export class ForagerWorld extends World {
    static foodRestockRate = 100;
    static foodRatio = 1;

    genomes:NetworkGenome[];
    foragers:RestockPopulation<Forager>;
    foodSupply:RestockPopulation<Food>;

    constructor(width:number, height?:number) {
        super(width, height);
        let max = 100;
        this.genomes = [];
        this.population = this.foragers = new RestockPopulation<Forager>(max, (population) => {
            let x = Math.floor(Math.random() * this.width),
                y = Math.floor(Math.random() * this.height),
                angle = Math.floor(Math.random() * Math.PI * 2),
                genome;
            if(population.history.size > 0) {
                let topLength = Math.floor(population.history.size / 10),
                    index = Math.floor(Math.random() * topLength),
                    forager = population.history.entities[index];
                genome = forager.genome.clone();
                genome.mutate();
            }
            return new Forager(x, y, angle, genome);
        }, 100);
        
        this.foodSupply = new RestockPopulation<Food>(100, () => {
            let x = Math.floor(Math.random() * this.width),
                y = Math.floor(Math.random() * this.height);
            return new Food(x, y);
        }, 1000);
        this.foodSupply.restock(true);
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

        // this.restockFoodSupply();
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