import {Component, ViewChild, AfterViewInit} from "angular2/core";
import {Forager} from "./forager";
import {ForagerWorld} from "./forager.world";
import {SimulationComponent} from "../simulation/simulation.component";
import {NetworkDiagramComponent} from "../simulation/network.diagram.component";
import {Network} from "../brain/network";
import {NetworkGenome} from "../brain/network.genome";
import {NgIf} from "angular2/common";
import {WorldComponent} from "../world/world.component";

@Component({
    selector: 'forager-simulation',
    templateUrl: 'forager/forager.simulation.component.html',
    directives: [WorldComponent, NetworkDiagramComponent, NgIf]
})

export class ForagerSimulationComponent extends SimulationComponent implements AfterViewInit{

    world:ForagerWorld;
    fittestNetwork:Network;

    @ViewChild(WorldComponent)
    worldComponent:WorldComponent;

    @ViewChild(SimulationComponent)
    simulation:SimulationComponent;

    @ViewChild(NetworkDiagramComponent)
    networkDiagram:NetworkDiagramComponent;
    fittest:Forager;

    constructor() {
        super();
        this.world = new ForagerWorld(400);

        while (this.world.foragers.size < 40) {
            let x = Math.floor(Math.random() * this.world.width),
                y = Math.floor(Math.random() * this.world.height),
                angle = Math.random() * Math.PI * 2,
                forager = new Forager(x, y, angle);
            this.world.add(forager);
        }
        this.fittest =null;
    }

    ngAfterViewInit(){
        requestAnimationFrame(() => this.start());
    }

    tick() {
        super.tick();
        let fittest = this.world.foragers.fittest();
        this.fittest = fittest;
        this.fittestNetwork = fittest !== null ? fittest.network : null;
    }
}