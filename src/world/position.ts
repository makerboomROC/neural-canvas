import {World} from "./world";

export class Position {
    x:number;
    y:number;
    angle:number;
    world:World;
    entity:any;

    constructor(world:World, entity:any,x:number, y:number, angle:number) {
        this.world = world;
        this.entity = entity;
        this.x = x;
        this.y = y;
        this.angle = angle;
    }

    angleTo(position:Position):number {
        let dx = position.x - this.x,
            dy = position.y - this.y,
            angle = Math.atan2(dy, dx);
        if (angle > Math.PI) angle -= 2 * Math.PI;
        return angle;
    }

    distanceTo(position:Position):number {
        let dx = position.x - this.x,
            dy = position.y - this.y;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }

    move(distance:number) {
        // Convert movement vector into polar
        let dx = ( Math.cos(this.angle) * distance ),
            dy = ( Math.sin(this.angle) * distance );

        // Move the entity
        this.x += dx;
        this.y += dy;
    }

    turn(angle:number) {
        this.angle += angle;
        this.angle = (this.angle + angle) % (Math.PI * 2);
        if(this.angle < 0) {
            this.angle += Math.PI * 2;
        }
        return true;
    }
}