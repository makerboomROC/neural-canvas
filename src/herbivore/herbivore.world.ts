import {World} from "./world";
import {Location} from "./location";
import {Plant} from "./plant";
import {Herbivore} from "./herbivore";

export class HerbivoreWorld extends World {

    ticks:number = 0;
    plantGrowRate:number = 1000;
    maxPlants:number = 400;

    constructor(size:number, herbivores:number = 100, plants:number = 400, mutations:number = 10) {
        super(size);
        while(plants--) this.addPlant();
        while(herbivores--) {
            let herbivore = this.addHerbivore();
            for(let c = 100; c > 0; c--) {
                herbivore.mutate(1);
            }
        }

    }

    tick() {
        super.tick();
        this.ticks++;

        if(this.ticks % this.plantGrowRate === 0 && this.plants().length < this.maxPlants) {
            this.addPlant();
        }
    }

    herbivores():Herbivore[] {
        return this.entities.filter(entity => entity instanceof Herbivore).map(entity => <Herbivore>entity);
    }

    plants():Plant[] {
        return this.entities.filter(entity => entity instanceof Plant).map(entity => <Plant>entity);
    }

    addPlant(location?:Location) {
        if(typeof location === 'undefined') {
            location = this.randomLocation();
        }
        let plant = new Plant(location);
        this.add(plant);
        console.log("Added Plant!")

        return plant;
    }

    addHerbivore(location?:Location):Herbivore {
        if(typeof location === 'undefined') {
            location = this.randomLocation();
        }
        let herbivore = new Herbivore(location);
        this.add(herbivore);
        console.log("Added Herbivore!")
        return herbivore;
    }

    randomLocation():Location {
        return {x: Math.random() * this.width, y: Math.random() * this.height};
    }
}