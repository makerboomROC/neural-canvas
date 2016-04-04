import {Component, ViewChild, AfterViewInit, Input, OnInit} from "angular2/core";
import {World} from "./world";
import {Shape} from "./shape";
import {Entity} from "./entity";

@Component({
    selector: 'world',
    template: '<canvas #canvas [width]="width" [height]="height"></canvas>',
    directives: []
})

export class WorldComponent implements AfterViewInit, OnInit {
    @Input()
    world:World;

    @ViewChild('canvas')
    canvasChild;
    private canvasElement:HTMLCanvasElement;
    private canvasContext:CanvasRenderingContext2D;

    width:number = 0;
    height:number = 0;

    ngOnInit() {
        this.width = this.world.width;
        this.height = this.world.height;
    }

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
        this.canvasContext.clearRect(0,0,this.width, this.height);
    }
    protected draw() {
        this.world.forEach(entity => {
           this.drawEntity(entity);
        });
    }

    protected drawEntity(entity:Entity) {
        let context = this.canvasContext,
            fittest = this.world.population.fittest();
        if(entity === fittest) {
            this.drawShape(context, Shape.Circle, entity.x, entity.y, entity.angle, 2 + entity.radius, '#00FF00');
        }
        this.drawShape(context, entity.shape, entity.x, entity.y, entity.angle, entity.radius, entity.color);
    }
    
    private drawShape(context:CanvasRenderingContext2D, shape:Shape, x:number, y:number, angle:number, radius:number, color:string = '#000000') {
        context.save();
        context.translate(x, y);
        context.rotate(angle);
        context.fillStyle = color;
        switch (shape) {
            case Shape.Triangle:
                this.drawTriangle(context, radius);
                break;
            case Shape.Square:
                this.drawSquare(context, radius);
                break;
            case Shape.Circle:
                this.drawCircle(context, radius);
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