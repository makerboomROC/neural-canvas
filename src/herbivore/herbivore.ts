import {Location} from './location';
import {Entity} from "./entity";
import {World} from "./world";
import {Plant} from "./plant";
import {HerbivoreSystem} from "./herbivore.system";

var nextId = 1;

export class Herbivore extends Entity {
    static uid():string {
        return "H" + nextId++;
    }

    id:string;
    parentId:string;
    age:number = 0;

    orientation:number;
    system:HerbivoreSystem;

    maxEnergy:number = 100;
    maxSmellDistance:number = 40;

    constructor(location:Location, orientation?:number, system?:HerbivoreSystem) {
        super(location, 80);
        this.id = Herbivore.uid();

        this.orientation = orientation || Math.random() * 360;
        this.system = system || new HerbivoreSystem(this);
    }

    tick(world:World) {
        this.system.tick(world);
        super.tick(world);
        // if(this.energy > 90) {
        //     this.reproduce(world);
        // }
        this.energy -= 0.01;
        this.age++;
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
        if (plant && plant.distance(this.location) < 0.5) {
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
        let energy = distance * 0.01;
        if (this.energy < energy) return;
        let orientation = this.orientation - 90,
            angle = (Math.PI / 180) * orientation,
            dx = distance * Math.cos(angle),
            dy = distance * Math.sin(angle);
        this.location.x += dx;
        this.location.y += dy;
        this.energy -= energy;
    }

    rotate(degrees:number) {
        let energy = degrees * 0.01;
        if (this.energy < energy) return;
        this.orientation += degrees;
        this.energy -= energy;
    }

    reproduce(world:World) {
        let energy = 40;
        if (this.energy < energy) return;
        let child = this.clone();
        child.parentId = this.id;
        child.mutate();
        this.energy -= energy;
        child.energy = energy;
        world.add(child);
    }

    clone():Herbivore {
        let location = {x: this.location.x, y: this.location.y},
            system = this.system.clone(),
            clone = new Herbivore(location, this.orientation, system);

        return clone;
    }

    mutate(chance?:number) {
        this.system.network.mutate(chance);
    }

    protected closestPlant(world:World):Plant {
        let plants = world.entities.filter(entity => entity instanceof Plant),
            location = this.location,
            closestPlant = null,
            closestDistance = Infinity;

        plants.forEach(plant => {
            let distance = plant.distanceTo(location);
            if (distance < closestDistance) {
                closestPlant = plant;
                closestDistance = distance;
            }
        });

        return closestPlant;
    }
}