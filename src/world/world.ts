import {Population} from "./population";
import {Entity} from "./entity";

export class World {
    width:number;
    height:number;
    populations:Population<any>[];
    age:number;

    constructor(width:number, height:number = width) {
        this.width = width;
        this.height = height;
        this.populations = [];
        this.age = 0;
    }

    add(population:Population<any>) {
        this.populations.push(population);
    }

    size():number {
        return this.populations.reduce((sum, population) => population.size, 0)
    }

    forEach(callback:(population:Population<any>, index:number) => void) {
        this.populations.forEach(callback);
    }

    forEachEntity(callback:(entity:Entity, index:number) => void) {
        this.forEach((population) => {
            population.forEach(callback);
        });
    }

    fittest():Entity {
        let fittest:Entity = null;
        this.populations.map(population => population.fittest()).forEach(entity => {
            if(fittest === null || fittest.fitness() < entity.fitness()) {
                fittest = entity;
            }
        });
        return fittest;
    }

    tick() {
        this.populations.forEach(population => {
            population.tick();
        });
        this.age++;
    }
}