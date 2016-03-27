import {World} from "./world";
import {HerbivoreNode} from "./herbivore.node";

export class HerbivoreHealth extends HerbivoreNode {

    activate(world:World):number {
        let input = this.target.energy / this.target.maxEnergy;
        return super.activate(input);
    }

}