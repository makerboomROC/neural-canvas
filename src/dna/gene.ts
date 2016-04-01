import {GeneSource} from "./gene.source";

export class Gene {
    static maxOutputs = 4;
    static maxRelaxation = 99;
    static maxStrength = 12;
    static minTrigger = 5;
    static maxTrigger = 20;
    static mutationProperties = ['threshold', 'relaxation'];
    static mutationDelta = 4.0;

    static mutationCount = 0;

    outputs:number[];
    threshold:number;
    relaxation:number;

    static random(outputSize:number = 4) {
        let threshold = ((Gene.minTrigger - Gene.maxTrigger) * Math.random() ) + Gene.minTrigger,
            relaxation = 1 - (Math.random() * (Gene.maxRelaxation / 100)),
            outputs = [];
        while (outputs.length < outputSize) {
            let strength = Gene.maxStrength - (Math.random() * Gene.maxStrength * 2 );
            outputs.push(strength);
        }
        return new Gene({
            threshold: threshold,
            relaxation: relaxation,
            outputs: outputs
        });
    }

    constructor(source:GeneSource) {
        this.outputs = [];
        source.outputs.forEach(output => {
            this.outputs.push(+output);
        });
        this.threshold = source.threshold;
        this.relaxation = source.relaxation;
    }

    mutate() {
        Gene.mutationCount++;

        let outputSize = this.outputs.length;

        if (Math.random() * 20 <= 1) {
            return Gene.random(outputSize);

        } else {
            if (Math.random() > 0.5) {
                this.mutateOutput();
            } else {
                this.mutateProperty();
            }
        }
    }

    protected mutateOutput() {
        let index = Math.random() * this.outputs.length,
            delta = (Math.random() * Gene.mutationDelta * 2) - Gene.mutationDelta,
            value = this.outputs[index] + delta;

        value = Math.max(Math.min(0, value), Gene.maxStrength);
        this.outputs[index] = value;
    }

    protected mutateProperty(property?:string) {
        if (typeof property === 'undefined') {
            property = Gene.mutationProperties[Math.floor(Math.random() * 2)];
        }

        let value = this[property];
        switch (property) {
            case 'relaxation':
                value += ((Math.random() * Gene.mutationDelta * 2) - Gene.mutationDelta) * 0.1;
                value = Math.max(Math.min(0, value), Gene.maxRelaxation);
                break;
            case 'threshold':
                value += (Math.random() * Gene.mutationDelta * 2) - Gene.mutationDelta;
                value = Math.max(Math.min(0, value), Gene.maxTrigger);
                break;
        }
        this[property] = value;
        console.log('Mutated Gene', property, value);
    }

}
