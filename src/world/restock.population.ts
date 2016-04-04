import {Population} from "./population";
import {Entity} from "./entity";

export class RestockPopulation <EntityType extends Entity> extends Population <EntityType> {

    restockRate:number;
    restockCallback:(population:RestockPopulation<EntityType>) => EntityType;
    history:Population<EntityType>;

    constructor(max:number = Infinity, restockCallback:(population:RestockPopulation<EntityType>) => EntityType, restockRate:number = 0) {
        super(max);
        this.restockRate = restockRate;
        this.restockCallback = restockCallback;
        this.history = new Population<EntityType>();
    }

    tick(...args:any[]) {
        let result = super.tick(...args);
        this.restock();
        return result;
    }

    clean():EntityType[] {
        let removed = super.clean();
        if(removed.length > 0) {
            this.history.sort();
            this.history.entities = this.history.entities.slice(0, Math.floor(this.max * 2));
            this.restock();
        }
        return removed;
    }

    restock(all:boolean = false):EntityType[] {
        let restocked = [];

        if (all === true || this.restockRate === 0) {
            while (this.size < this.max) {
                let entity = this.restockCallback(this);
                this.add(entity);
                restocked.push(entity);
            }
        } else if (this.age % this.restockRate === 0) {
            let entity = this.restockCallback(this);
            this.add(entity);
            restocked.push(entity);
        }

        return restocked;
    }

    add(entity:EntityType):boolean {
        let result = super.add(entity);
        this.history.add(entity);
        return result;
    }
}