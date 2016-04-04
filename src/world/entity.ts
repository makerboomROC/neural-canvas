import {Shape} from "./shape";
export class Entity {
    static maxEnergy = 1000;

    x:number;
    y:number;
    angle:number;
    shape:Shape;
    radius:number;
    color:string;

    maxEnergy:number;
    energy:number;

    age:number;
    maxAge:number;

    constructor(x:number, y:number, angle?:number, maxEnergy?:number) {
        this.x = x;
        this.y = y;
        this.angle = typeof angle !== 'undefined' ? angle : 0;

        this.maxEnergy = typeof maxEnergy !== 'undefined' ? maxEnergy : Entity.maxEnergy;
        this.energy = this.maxEnergy - Math.floor(Math.random() * this.maxEnergy / 10);

        this.age = 0;
        this.maxAge = Infinity;

        this.shape = Shape.Circle;
        this.radius = 3;
        this.color = '#000000';
    }

    /**
     * Returns false if died(energy < 0) this tick, true otherwise
     * @returns {boolean}
     */
    tick(...args:any[]):boolean {
        this.energy -= 1;
        this.age++;

        return this.energy > 0;
    }

    /**
     * Drains another Entity of its energy.
     * @param entity
     * @returns {boolean}
     */
    drain(entity:Entity):number {
        let amount = Math.max(Math.min(10, entity.energy), this.maxEnergy - this.energy);
        entity.energy -= amount;
        this.energy += amount;
        return amount;
    }

    /**
     * Charges another Entity with energy
     * @param entity
     * @returns {boolean}
     */
    charge(entity:Entity):number {
        let amount = Math.max(Math.min(10, this.energy), entity.maxEnergy - entity.energy);
        this.energy -= amount;
        entity.energy += amount;
        return amount;
    }

    move(distance:number):boolean {
        // Convert movement vector into polar
        let dx = ( Math.cos(this.angle) * distance ),
            dy = ( Math.sin(this.angle) * distance );

        // Move the entity
        this.x += dx;
        this.y += dy;

        return true;
    }

    turn(angle:number):boolean {
        this.angle += angle;
        this.angle = this.angle % (Math.PI * 2);
        return true;
    }

    fitness():number {
        return this.age + this.energy;
    }

    distanceTo(entity:Entity):number {
        return this.distanceXY(entity.x, entity.y);
    }

    distanceXY(x:number, y:number):number {
        let dx = x - this.x,
            dy = y - this.y;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    }

    /**
     * Returns the relative angle in radians to another Entity,
     * which is negative to the left and positive to the right.
     * @param entity {Entity}
     * @returns {number}
     */
    angleTo(entity:Entity):number {
        return this.angleXY(entity.x, entity.y);
    }
    angleXY(x:number, y:number):number {
        let dx = x - this.x,
            dy = y - this.y,
            angle = Math.atan2(dy, dx);
        if (angle > Math.PI) angle -= 2 * Math.PI;
        return angle;
    }

    touchesXY(x:number, y:number):boolean {
        switch (this.shape) {
            case Shape.Square:
                let minX = this.x - this.radius,
                    maxX = this.x + this.radius,
                    minY = this.y - this.radius,
                    maxY = this.y + this.radius;
                return x >= minX && x <= maxX && x >= minY && x <= maxY;
            case Shape.Circle:
                let distance = this.distanceXY(x, y);
                return distance < this.radius;
        }
        return false;
    }
}