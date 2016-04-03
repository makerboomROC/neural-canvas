import {Component, ViewChild, AfterViewInit} from "angular2/core";
import {Forager} from "./forager";
import {Food} from "./food";
import {ForagerWorld} from "./forager.world";
import {SimulationComponent} from "../simulation/simulation.component";
import {NetworkDiagramComponent} from "../simulation/network.diagram.component";
import {Network} from "../brain/network";
import {ForagerGenome} from "./forager.genome";

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

        while (this.world.foragers.size < 20) {
            let x = Math.floor(Math.random() * this.world.width),
                y = Math.floor(Math.random() * this.world.height),
                angle = Math.random() * Math.PI * 2,
                genome = ForagerGenome.random([5,5,5]),
                forager = new Forager(x, y, angle, genome);
            this.world.add(forager);
        }
        while (this.world.foodSupply.size < 10) {
            let x = Math.floor(Math.random() * this.world.width),
                y = Math.floor(Math.random() * this.world.height),
                food = new Food(x, y);
            this.world.add(food);
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