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
    private _running:boolean;

    constructor() {
        this._timer = null;
        this._running = false;
    }

    start() {
        this._running = true;
        this.tick();
    }

    stop() {
        this._running = false;
    }

    tick() {
        if(this._running) {
            this.world.tick();
            this.worldComponent.update();
            this._timer = setTimeout(() => this.tick());
        }
    }
}