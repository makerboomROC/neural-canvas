import {Engine} from "./engine";
import {Network} from "../network/network";
import {Clock} from "../network/clock";
import {LayerConnectionType} from "../network/layer.connection";
interface Location {
    x:number;
    y:number;
}

export class Herbivore {
    location:Location;
    orientation:number;

    propulsion:Engine;
    clock:Clock;
    network:Network;

    constructor(location:Location, orientation:number) {
        this.location = location;
        this.orientation = orientation;

        this.network = new Network();

        this.clock = new Clock();
        this.network.input.add(this.clock);

        this.propulsion = new Engine(this);
        this.network.output.add(this.propulsion);

        this.network.input.project(this.network.output, LayerConnectionType.ONE_TO_ONE, [0.5]);
    }

    tick() {
        this.network.activate([1]);
    }
}