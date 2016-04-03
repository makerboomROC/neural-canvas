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
     * Ticks every entity, removing it if dead.
     * Returns removed entities.
     * @returns {Entity[]}
     */
    tick(...args:any[]):Entity[] {
        let removed = [];
        this.forEach((entity) => {
            if(entity.tick(...args) === false) {
                this.remove(entity);
            }
        });
        return removed;
    }

    add(entity:EntityType):boolean {
        if(this.entities.length >= this.max) return false;
        this.size = this.entities.push(entity);
        return true;
    }

    remove(entity:EntityType):boolean {
        let index = this.entities.indexOf(entity);
        if(index > -1) {
            this.entities.splice(index, 1);
            this.size--;
            return true;
        }
        return false;
    }
    
    forEach(callback:(entity:EntityType, index:number) => void):void {
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