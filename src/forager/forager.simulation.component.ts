import {Component, ViewChild, AfterViewInit} from "angular2/core";
import {Forager} from "./forager";
import {Food} from "./food";
import {ForagerWorld} from "./forager.world";
import {SimulationComponent} from "../simulation/simulation.component";
import {NetworkDiagramComponent} from "../simulation/network.diagram.component";
import {Network} from "../brain/network";

@Component({
    selector: 'forager-simulation',
    templateUrl: 'forager/forager.simulation.component.html',
    directives: [SimulationComponent, NetworkDiagramComponent]
})

export class ForagerSimulationComponent extends SimulationComponent implements AfterViewInit{

    world:ForagerWorld;
    fittestNetwork:Network;

    @ViewChild(SimulationComponent)
    simulation:SimulationComponent;

    @ViewChild(NetworkDiagramComponent)
    networkDiagram:NetworkDiagramComponent;

    constructor() {
        super();
        this.world = new ForagerWorld(400);

        while (this.world.foragers.size < 10) {
            let x = Math.floor(Math.random() * 100),
                y = Math.floor(Math.random() * 100),
                angle = Math.random() * Math.PI * 2,
                forager = new Forager(x, y, angle);
            this.world.foragers.add(forager);
        }
        while (this.world.foodSupply.size < 10) {
            let x = Math.floor(Math.random() * 100),
                y = Math.floor(Math.random() * 100),
                food = new Food(x, y);
            this.world.foodSupply.add(food);
        }
    }

    ngAfterViewInit(){
        this.start();
    }

    tick() {
        this.simulation.tick();
        let fittest = this.world.fittest();
        if (fittest !== null) {
            this.fittestNetwork = fittest.network;
        }
    }
}