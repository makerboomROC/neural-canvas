import {Herbivore} from "./herbivore";
import {Node} from "../network/node";

export class HerbivoreNode extends Node {
    target:Herbivore;
    
    constructor(target:Herbivore) {
        this.target = target;
        super();
    }
}