import {World} from "./world";
import {Plant} from "./plant";
import {HerbivoreNode} from "./herbivore.node";

export class HerbivoreMouth extends HerbivoreNode {

    activate(world:World):number {
        let input = 0,
            plant = this.plant(world);
        if(plant) {
            this.target.eat(plant);
            input = 1;
        }
        return super.activate(input);
    }

    protected plant(world:World):Plant {
        let plants = world.entities.filter(entity => entity instanceof Plant),
            location = this.target.location,
            result = null;

        plants.some(plant => {
            if(plant.location.x === location.x && plant.location.y === location.y){
                result = plant;
                return true;
            }
        });

        return result;
    }
}