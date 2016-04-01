import {Component, Input, ViewChild} from "angular2/core";
import {WorldComponent} from "../world/world.component";
import {World} from "../world/world";

@Component({
    selector: 'simulation',
    template: `
        <world [world]="world"></world>
        <network-diagram [network]="fittestNetwork"></network-diagram>
    `,
    directives: [WorldComponent]
})

export class SimulationComponent {
    @Input()
    world:World;

    @ViewChild(WorldComponent)
    worldComponent:WorldComponent;

    private _timer;

    constructor() {
        this._timer = null;
    }

    start() {
        if(this._timer === null)
        this._timer = setInterval(() => this.tick(), 10);
    }

    stop() {
        clearInterval(this._timer);
        this._timer = null;
    }

    tick() {
        this.world.tick();
        this.worldComponent.update();
    }
}