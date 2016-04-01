import {Component, ViewChild, AfterViewInit, Input, OnInit} from "angular2/core";
import {World} from "../world/world";

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
        this.world.forEachEntity(entity => {
           this.drawEntity(entity);
        });
    }

    protected drawEntity(entity) {
        let context = this.canvasContext,
            size = 2,
            x = entity.x,
            y = entity.y;

        context.save();
        context.translate(x, y);
        context.fillStyle = "#000000";
        context.fillRect(-size, -size, size * 2, size * 2);
        context.restore();
    }
}