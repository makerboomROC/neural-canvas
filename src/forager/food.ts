import {Entity} from "../world/entity";

export class Food extends Entity {
    constructor(x:number, y:number) {
        super(x, y, 0, 100);
    }

    tick():boolean {
        return true;
    }
}