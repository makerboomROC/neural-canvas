import {Population} from "./population";
import {Entity} from "./entity";

export class World {
    width:number;
    height:number;
    population:Population<Entity>;
    age:number;
    size:number;

    constructor(width:number, height?:number) {
        this.width = width;
        this.height = typeof height !== 'undefined' ? height : width;
        this.population = new Population<Entity>();
        this.age = 0;
    }

    add(entity:Entity) {
        this.population.add(entity);
    }

    remove(entity:Entity):boolean {
        return this.population.remove(entity);
    }

    forEach(callback:(entity:Entity, index:number) => void) {
        this.population.forEach(callback);
    }

    tick(...args:any[]) {
        this.population.tick(this, ...args);
        this.age++;
    }
}