import {Entity} from "./entity";

export class Population <EntityType extends Entity> {

    entities:EntityType[];
    max:number;
    size:number;

    constructor(max:number = Infinity) {
        this.entities = [];
        this.size = 0;
        this.max = max;
    }

    /**
     * Life tick
     */
    tick():boolean {
        this.entities.forEach((entity, index) => {
            if(!entity.tick()) {
                this.entities.splice(index, 1);
            }
        });
        return true;
    }


    add(entity:EntityType):boolean {
        if(this.entities.length >= this.max) return false;
        this.size = this.entities.push(entity);
        return true;
    }

    forEach(callback:(entity:EntityType, index:number) => void) {
        this.entities.forEach(callback);
    }

    fittest():EntityType {
        let fittest:EntityType = null;
        this.entities.forEach(entity => {
            if(fittest === null || entity.fitness() > fittest.fitness()) {
                fittest = entity;
            }
        });

        return fittest;
    }

}