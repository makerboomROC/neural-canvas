import {Component, ViewChild, AfterViewInit} from "angular2/core";
import {Herbivore} from "./herbivore";

@Component({
    selector: 'herbivore-canvas',
    templateUrl: 'herbivore/herbivore.canvas.component.html'
})
export class HerbivoreCanvasComponent implements AfterViewInit {
    @ViewChild("canvas")
    canvas;
    context:CanvasRenderingContext2D;
    herbivores:Herbivore[] = [];
    canvasElement:HTMLCanvasElement;

    constructor() {
        this.herbivores.push(new Herbivore({x: 10, y: 10}, 0));
    }

    ngAfterViewInit() {
        this.canvasElement = this.canvas.nativeElement;
        this.tick();
    }

    tick() {
        let context = this.getContext();

        this.clearCanvas(context);
        this.herbivores.forEach(herbivore => {
            herbivore.turn(0.1);
            this.drawHerbivore(context, herbivore);
        });

        requestAnimationFrame(() => {
            this.tick();
        });
    }

    protected drawHerbivore(context:CanvasRenderingContext2D, herbivore:Herbivore) {
        let size = 3,
            x = herbivore.location.x,
            y = herbivore.location.y,
            angle = (Math.PI / 180) * herbivore.orientation;
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

    protected clearCanvas(context:CanvasRenderingContext2D) {
        context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }

    getContext():CanvasRenderingContext2D {
        return this.canvasElement.getContext("2d");
    }
}