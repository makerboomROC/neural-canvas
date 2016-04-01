export class Entity {
    static maxEnergy = 10000;

    x:number;
    y:number;
    angle:number;

    maxEnergy:number;
    energy:number;

    age:number;
    maxAge:number;

    constructor(x:number, y:number, angle:number = 0, energy:number = Entity.maxEnergy) {
        this.x = x;
        this.y = y;
        this.angle = angle;

        this.energy = energy;
        this.maxEnergy = Entity.maxEnergy;

        this.age = 0;
        this.maxAge = Infinity;
    }

    /**
     * Life tick
     */
    tick(...args:any[]):boolean {
        if (this.energy < 1) return false;
        this.energy--;
        this.age++;
        return true;
    }

    /**
     * Drains another Entity of its energy.
     * @param entity
     * @returns {boolean}
     */
    drain(entity:Entity):boolean {
        if (entity.energy < 0 || this.energy > this.maxEnergy) return false;
        entity.energy--;
        this.energy++;
        return true;
    }

    /**
     * Charges another Entity with energy
     * @param entity
     * @returns {boolean}
     */
    charge(entity:Entity):boolean {
        if (entity.energy > entity.maxEnergy || this.energy < 0) return false;
        this.energy--;
        entity.energy++;
        return true;
    }

    move(distance:number = 1) {
        // Convert movement vector into polar
        let dx = ( Math.cos(this.angle) * distance ),
            dy = ( Math.sin(this.angle) * distance );

        // Move the entity
        this.x += dx;
        this.y += dy;
    }

    turn(angle:number) {
        this.angle += angle;
        this.angle = this.angle % (Math.PI * 2);
    }

    fitness():number {
        return this.age + (this.energy / this.maxEnergy);
    }

    distanceTo(entity:Entity):number {
        let dx = entity.x - this.x,
            dy = entity.y - this.y;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }

    angleTo(entity:Entity):number {
        let dx = entity.x - this.x,
            dy = entity.y - this.y,
            angle = Math.atan2(dy, dx);
        if (angle > Math.PI) angle -= 2 * Math.PI;
        return angle;
    }
}