import {Entity} from "../world/entity";

export class Food extends Entity {
    constructor(x:number, y:number) {
        super(x, y, 0, 100);
        this.color = '#009999';
    }

    tick():boolean {
        this.age++;

        return this.energy > 0;
    }
}