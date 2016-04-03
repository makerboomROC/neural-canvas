import {Component, ViewChild, AfterViewInit, Input, OnInit} from "angular2/core";
import {World} from "./world";
import {Shape} from "./shape";
import {Entity} from "./entity";

@Component({
    selector: 'world',
    template: '<canvas #canvas width="400" height="400"></canvas>',
    directives: []
})

export class WorldComponent implements AfterViewInit {
    @Input()
    world:World;

    @ViewChild('canvas')
    canvasChild;
    private canvasElement:HTMLCanvasElement;
    private canvasContext:CanvasRenderingContext2D;


    ngAfterViewInit() {
        this.canvasElement = this.canvasChild.nativeElement;
        this.canvasContext = this.canvasElement.getContext('2d');
        this.draw();
    }

    update() {
        this.clear();
        this.draw();
    }

    protected clear() {
        let width = this.canvasElement.width,
            height = this.canvasElement.height;
        this.canvasContext.clearRect(0,0,width, height);
    }
    protected draw() {
        this.world.forEach(entity => {
           this.drawEntity(entity);
        });
    }

    protected drawEntity(entity:Entity) {
        let context = this.canvasContext;
        this.drawShape(context, entity.shape, entity.x, entity.y, entity.angle);
    }
    
    private drawShape(context:CanvasRenderingContext2D, shape:Shape, x:number, y:number, angle:number) {
        context.save();
        context.translate(x, y);
        context.rotate(angle);
        context.fillStyle = "#000000";
        switch (shape) {
            case Shape.Triangle:
                this.drawTriangle(context, 2);
                break;
            case Shape.Square:
                this.drawSquare(context, 2);
                break;
            case Shape.Circle:
                this.drawCircle(context, 2);
                break;
        }
        context.restore();
    }

    private drawSquare(context:CanvasRenderingContext2D, width) {
        this.drawRectangle(context, width, width);
    }

    private drawRectangle(context:CanvasRenderingContext2D, width , height ) {
        context.fillRect(-(width / 2), -(height / 2), width, height);
    }

    private drawCircle(context:CanvasRenderingContext2D, radius) {
        context.beginPath();
        context.arc(0, 0, radius, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    }

    private drawTriangle(context:CanvasRenderingContext2D, radius) {
        context.beginPath();
        context.moveTo(radius, 0);
        context.lineTo(-radius, -radius);
        context.lineTo(-radius, radius);
        context.closePath();
        context.fill();
    }
}