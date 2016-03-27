import {World} from "./world";
import {Plant} from "./plant";
import {HerbivoreNode} from "./herbivore.node";

export class HerbivoreNose extends HerbivoreNode {
    maxDistance:number = 1;

    activate(world:World):number {
        let plant = this.closestPlant(world),
            input = 0;
        if (plant) {
            let distance = plant.distance(this.target.location);
            if (distance < this.maxDistance) {
                input = distance / this.maxDistance;
            }
        }
        return super.activate(input);
    }

    protected closestPlant(world:World):Plant {
        let plants = world.entities.filter(entity => entity instanceof Plant),
            location = this.target.location,
            closestPlant = null,
            closestDistance = Infinity;

        plants.forEach(plant => {
            let distance = plant.distance(location);
            if(distance < closestDistance) {
                closestPlant = plant;
                closestDistance = distance;
            }
        });

        return closestPlant;
    }

}