import {World} from "../world/world";
import {Forager} from "./forager";
import {Population} from "../world/population";
import {Food} from "./food";

export class ForagerWorld extends World {
    static foodRestockRate = 100;
    static foodRatio = 1;

    foragers:Population<Forager>;
    foodSupply:Population<Food>;

    constructor(width:number, height?:number) {
        super(width, height);
        this.foragers = new Population<Forager>();
        this.foodSupply = new Population<Food>();
        this.add(this.foragers);
        this.add(this.foodSupply);
    }


    tick() {
        this.foragers.forEach(forager => {
            forager.tick(this);
        });

        this.restockFoodSupply();
        this.connectEdges();
        this.age++;
    }

    connectEdges() {
        this.forEachEntity(entity => {
            if(entity.x < 0) {
                entity.x += this.width;
            }else if(entity.x > this.width) {
                entity.x -= this.width;
            }

            if(entity.y < 0) {
                entity.y += this.height;
            }else if(entity.y > this.height) {
                entity.y -= this.height;
            }
        })
    }

    restockFoodSupply() {
        if (this.age % ForagerWorld.foodRestockRate === 0) {
            let ratio = this.foodSupply.size / this.foragers.size;
            if (ratio < ForagerWorld.foodRatio) {
                let x = Math.floor(Math.random() * this.width),
                    y = Math.floor(Math.random() * this.height),
                    food = new Food(x, y);
                this.foodSupply.add(food);
            }
        }
    }

    nearestFood(forager:Forager):Food {
        let nearestDistance = Infinity,
            nearestFood = null;
        this.foodSupply.forEach(food => {
            let distance = forager.distanceTo(food);
            if(distance < nearestDistance) {
                nearestFood = food;
            }
        });
        return nearestFood;
    }

    look(forager:Forager):Food {
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