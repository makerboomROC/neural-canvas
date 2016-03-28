import {Component, ViewChild, AfterViewInit} from "angular2/core";
import {Herbivore} from "./herbivore";
import {World} from "./world";
import {Entity} from "./entity";
import {Plant} from "./plant";
import {HerbivoreWorld} from "./herbivore.world";
import {DecimalPipe} from "angular2/common";

@Component({
    selector: 'herbivore-canvas',
    templateUrl: 'herbivore/herbivore.canvas.component.html',
    pipes:[DecimalPipe]
})
export class HerbivoreCanvasComponent implements AfterViewInit {
    @ViewChild("canvas")
    canvas;
    context:CanvasRenderingContext2D;
    canvasElement:HTMLCanvasElement;

    world:HerbivoreWorld;
    entities:Entity[] = [];
    herbivores:Herbivore[] = [];
    lastHerbivore:Herbivore = null;
    bestHerbivore:Herbivore = null;
    plants:Plant[] = [];

    constructor() {
        this.world = new HerbivoreWorld(400);
    }

    ngAfterViewInit() {
        this.canvasElement = this.canvas.nativeElement;
        this.tick();
    }

    tick() {
        this.world.tick();

        this.entities = this.world.entities;
        this.herbivores = this.world.herbivores();
        this.lastHerbivore = this.herbivores[this.herbivores.length - 1];
        this.bestHerbivore = this.herbivores.reduce((best, herbivore) => {
            if(!best || best.energy < herbivore.energy) {
                best = herbivore;
            }
            return best;
        });
        this.plants = this.world.plants();

        this.draw();

        requestAnimationFrame(() => {
            this.tick();
        });
    }

    protected draw() {
        let context = this.getContext();
        this.clearCanvas(context);
        this.entities.forEach(entity => {
            this.drawEntity(entity, context);
        });
    }

    protected drawEntity(entity:Entity, context:CanvasRenderingContext2D){
        if(entity instanceof Herbivore) {
            this.drawHerbivore(<Herbivore>entity, context)
        } else if(entity instanceof Plant) {
            this.drawPlant(<Plant>entity, context);
        }
    }

    protected drawHerbivore(herbivore:Herbivore, context:CanvasRenderingContext2D) {
        let size = 3,
            x = herbivore.location.x % this.world.width,
            y = herbivore.location.y % this.world.height,
            angle = (Math.PI / 180) * herbivore.orientation;
        if(x < 0) x = this.world.width + x;
        if(y < 0) y = this.world.height+ y;
        context.save();
        context.translate(x, y);
        context.fillStyle = "#000000";
        if(herbivore === this.lastHerbivore)
            context.fillStyle = "#EE0000";
        if(herbivore === this.bestHerbivore)
            context.fillStyle = "#00EE00";
        context.rotate(angle);
        context.beginPath();
        context.moveTo(0, -size);
        context.lineTo(-size, size);
        context.lineTo(size, size);
        context.fill();
        context.restore();
    }

    protected drawPlant(plant:Plant, context:CanvasRenderingContext2D) {
        let size = 2,
            x = Math.abs(plant.location.x % this.world.width),
            y = Math.abs(plant.location.y % this.world.height);
        context.save();
        context.translate(x, y);
        context.fillStyle = "#000000";
        context.fillRect(-size, -size, size * 2, size * 2);
        context.restore();
    }

    protected clearCanvas(context:CanvasRenderingContext2D) {
        context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }

    getContext():CanvasRenderingContext2D {
        return this.canvasElement.getContext("2d");
    }
}