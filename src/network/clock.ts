import {Node} from "./node";

export class Clock extends Node {
    activate(input?:number):number {
        this.activation = 1;
        return this.activation;
    }
}