import {Entity} from "./entity";
export class Sensor {
    entity:Entity;

    constructor(entity:Entity) {
        this.entity = entity;
    }

    sense(...args:any[]):number {
        return null;
    }
}