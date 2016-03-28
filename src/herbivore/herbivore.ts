import {Location} from './location';
import {Entity} from "./entity";
import {World} from "./world";
import {Plant} from "./plant";
import {HerbivoreSystem} from "./herbivore.system";

export class Herbivore extends Entity {
    orientation:number;
    system:HerbivoreSystem;

    energy:number = 100;
    maxEnergy:number = 100;

    maxSmellDistance:number = 40;

    constructor(location:Location, orientation?:number) {
        super(location);

        this.orientation = orientation || Math.random() * 360;
        this.system = new HerbivoreSystem(this);
    }

    tick(world:World) {
        this.system.tick(world);
        super.tick(world);
    }

    smell(world:World):number {
        let plant = this.closestPlant(world);
        if (typeof plant === 'undefined') {
            return 0;
        }
        let distance = plant.distance(this.location),
            strength = 1 - distance / this.maxSmellDistance;
        return strength > 1 ? 1 : strength;
    }

    health():number {
        return this.energy / this.maxEnergy;
    }

    eat(world:World) {
        let plant = this.closestPlant(world);
        if (plant && plant.distance(this.location) < 0.1) {
            let gain = plant.energy,
                maxGain = this.maxEnergy - this.energy;
            if (gain > maxGain) {
                gain = maxGain;
            }
            plant.energy -= gain;
            this.energy += gain;
        }
    }

    move(distance:number) {
        let orientation = this.orientation - 90,
            angle = (Math.PI / 180) * orientation,
            dx = distance * Math.cos(angle),
            dy = distance * Math.sin(angle);
        this.location.x += dx;
        this.location.y += dy;
        this.energy -= distance * 0.1;
    }

    rotate(degrees:number) {
        this.orientation += degrees;
    }

    protected closestPlant(world:World):Plant {
        let plants = world.entities.filter(entity => entity instanceof Plant),
            location = this.location,
            closestPlant = null,
            closestDistance = Infinity;

        plants.forEach(plant => {
            let distance = plant.distance(location);
            if (distance < closestDistance) {
                closestPlant = plant;
                closestDistance = distance;
            }
        });

        return closestPlant;
    }
}