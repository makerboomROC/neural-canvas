import {Component} from "angular2/core";
import {HerbivoreCanvasComponent} from "../herbivore/herbivore.canvas.component";

@Component({
    selector: 'neural-canvas',
    templateUrl: 'application/application.component.html',
    directives: [HerbivoreCanvasComponent]
})
export class ApplicationComponent {

}