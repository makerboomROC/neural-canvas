interface Location {
    x:number;
    y:number;
}

export class Herbivore {
    location:Location;
    orientation:number;

    constructor(location:Location, orientation:number) {
        this.location = location;
        this.orientation = orientation;
    }

    turn(degrees:number) {
        this.orientation = this.orientation + degrees % 360
    }

    move(x:number, y:number) {
        this.location.x += x;
        this.location.y += y;
    }
}