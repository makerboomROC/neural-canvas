import {Location} from './location';

export class Entity {
    location:Location;

    constructor(location:Location) {
        this.location = location;
    }

    tick(){}
}