import {Component, Input, ViewChild, AfterViewInit, OnChanges, SimpleChange} from "angular2/core";
import {Network} from "../brain/network";
import {Neuron} from "../brain/neuron";
import {Axon} from "../brain/axon";

interface Coordinate {
    x:number;
    y:number;
}

@Component({
    selector: 'network-diagram',
    template: '<canvas #canvas width="200" height="400"></canvas>'
})

export class NetworkDiagramComponent implements AfterViewInit, OnChanges {
    @Input()
    network:Network;
    coordinates:Coordinate[];

    @ViewChild('canvas')
    canvasChild;
    private canvasElement;
    private canvasContext;
    private canvasBorder = 0;

    private neuronRadius;
    private neuronSpread;

    constructor() {
        this.neuronRadius = 20;
    }

    ngAfterViewInit() {
        this.canvasElement = this.canvasChild.nativeElement;
        this.canvasContext = this.canvasElement.getContext('2d');
    }

    ngOnChanges(changes:{[propname:string]:SimpleChange}) {
        if(this.network) {
            this.updateCoordinates();
            this.clear();
            this.drawNetwork();
        }
    }


    clear() {
        this.canvasContext.clearRect(0,0, this.canvasElement.width, this.canvasElement.height);
    }

    private drawNetwork() {
        let layers = this.network.layers;

        layers.forEach(layer => {
            let drawAxons = typeof layer.output !== 'undefined';

            layer.neurons.forEach(neuron => {
                this.drawNeuron(neuron);
            });
        });
    }

    private drawAxons(neuron:Neuron, x:number, y:number) {
        neuron.axons.forEach(axon => {
            let context = this.canvasContext,
                targetIndex = this.network.neurons.indexOf(axon.target),
                targetCoords = this.coordinates[targetIndex],
                targetX = targetCoords.x,
                targetY = targetCoords.y;

            // Size line width relative to axon strength
            context.lineWidth = ( axon.strength / Axon.maxStrength) * ( ( this.neuronSpread / 4 ) / 2 );

            // Draw the axon
            context.beginPath();
            // dContext.shadow("#000", 4, 2, 2);

            // Color codinbg ( green = excitory / red = inhibitory )
            if (axon.strength > 0) context.strokeStyle = "#090";
            else context.strokeStyle = "#900";

            // Draw the line
            context.moveTo(x, y);
            context.lineTo(targetX, targetY);
            context.stroke();
            // dContext.shadow();
            context.closePath();
        });
    }

    private drawNeuron(neuron:Neuron) {
        let context = this.canvasContext,
            index = this.network.neurons.indexOf(neuron),
            coords = this.coordinates[index],
            x = coords.x,
            y= coords.y;

        this.drawAxons(neuron, x, y);
        // Draw node with white outer border
        context.strokeStyle = "#fff";
        context.lineWidth = 2.2;

        // Use a blue radial grandient to give impression of 3D
        let gradient = context.createRadialGradient(x - 5, y - 5, this.neuronRadius * 0.4, x, y, this.neuronRadius);
        gradient.addColorStop(0, "#269");
        gradient.addColorStop(1, "#036");
        context.fillStyle = gradient;

        context.beginPath();
        // dContext.shadow("#000", 4, 2, 2);
        context.arc(x, y, this.neuronRadius, 0, Math.PI * 2, true);
        context.stroke();
        // context.shadow();
        context.fill();
        context.closePath();

        // Align text in node circle
        context.textAlign = "center";
        context.textBaseline = "middle";

        // White text with black shadow
        // dContext.shadow('#000', 4, 2, 2);
        context.fillStyle = "#fff";

        // Draw threshold and relaxation rate
        context.fillText(neuron.threshold.toFixed(1), x, y - 6);
        context.fillText(( ( 1 - neuron.relaxation) * 100 ).toFixed(0) + "%", x, y + 6);
        // context.shadow();
    }

    private updateCoordinates() {
        this.coordinates = [];

        // Find drawing area ( minus the borders )
        let drawAreaWidth = this.canvasElement.width - (this.canvasBorder * 2),
            drawAreaHeight = this.canvasElement.height - (this.canvasBorder * 2),
            deltaY = (drawAreaHeight - (this.neuronRadius * 2)) / (this.network.layers.length);


        this.network.layers.forEach((layer, layerIndex) => {
            let y = Math.floor(this.neuronRadius + this.neuronRadius + ( layerIndex * deltaY)),
                distanceX = (drawAreaWidth - (this.neuronRadius * 2)) / (layer.neurons.length);

            layer.neurons.forEach((neuron, neuronIndex) => {
                let x = Math.floor(this.neuronRadius + this.neuronRadius + ( neuronIndex * distanceX));
                this.coordinates.push({x: x, y: y});
            });
        });
    }
}