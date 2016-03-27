import {Entity} from "./entity";
import {Location} from "./location";

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

    remove(entity:Entity) {
        let index = this.entities.indexOf(entity);
        if(index > -1) {
            this.entities.splice(index, 1);
        }
    }

    tick() {
        this.entities.forEach(entity => {
            entity.tick(this);
        })
    }

    closest<T>(location:Location, type:T = Entity):T {
        let closestDistance = Infinity,
            closestEntity = null;

        this.entities.forEach(entity => {
            if(!entity instanceof type) return;

            let distance = entity.distance(location);

            if(distance < closestDistance) {
                closestDistance = distance;
                closestEntity = entity;
            }
        });
        return closestEntity;
    }
}