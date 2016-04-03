import {Component} from "angular2/core";
import {ForagerSimulationComponent} from "../forager/forager.simulation.component";

@Component({
    selector: 'neural-canvas',
    templateUrl: 'application/application.component.html',
    directives: [ForagerSimulationComponent]
})
export class ApplicationComponent {

}