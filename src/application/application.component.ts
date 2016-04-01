import {Component} from "angular2/core";
import {HerbivoreCanvasComponent} from "../herbivore/herbivore.canvas.component";
import {ForagerSimulationComponent} from "../forager/forager.simulation.component";

@Component({
    selector: 'neural-canvas',
    templateUrl: 'application/application.component.html',
    directives: [ForagerSimulationComponent]
})
export class ApplicationComponent {

}