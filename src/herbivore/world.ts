import {Entity} from "./entity";
export class World {
    entities:Entity[];
    width:number;
    height:number;

    constructor(width:number, height?:number, entities:Entity[] = []){
        this.width = width;
        this.height = height || width;

        this.entities = entities;
    }

    add(entity:Entity) {
        this.entities.push(entity);
    }
}