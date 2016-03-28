import {Component, ViewChild, AfterViewInit} from "angular2/core";
import {Herbivore} from "./herbivore";
import {World} from "./world";
import {Entity} from "./entity";
import {Plant} from "./plant";

@Component({
    selector: 'herbivore-canvas',
    templateUrl: 'herbivore/herbivore.canvas.component.html'
})
export class HerbivoreCanvasComponent implements AfterViewInit {
    @ViewChild("canvas")
    canvas;
    context:CanvasRenderingContext2D;
    world:World;
    canvasElement:HTMLCanvasElement;

    constructor() {
        this.world = new World(400);
        this.world.add(new Herbivore({x: 10, y: 10}, 180));
        this.world.add(new Plant({x: 30, y: 30}));
    }

    ngAfterViewInit() {
        this.canvasElement = this.canvas.nativeElement;
        this.tick();
    }

    tick() {
        this.world.tick();

        let context = this.getContext();
        this.clearCanvas(context);
        this.world.entities.forEach(entity => {
            this.drawEntity(entity, context);
        });

        requestAnimationFrame(() => {
            this.tick();
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