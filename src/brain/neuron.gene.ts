import {Gene} from "../dna/gene";
import {GeneSource} from "../dna/gene.source";

export class NeuronGene extends Gene{
    static maxRelaxation = 99;
    static maxStrength = 12;
    static minTrigger = 5;
    static maxTrigger = 20;
    static mutationDelta = 4.0;

    static mutationCount = 0;

    outputs:number[];
    threshold:number;
    relaxation:number;

    static random(outputSize:number = 4):NeuronGene {
        let threshold = ((NeuronGene.maxTrigger - NeuronGene.minTrigger) * Math.random() ) + NeuronGene.minTrigger,
            relaxation = 1 - (Math.random() * (NeuronGene.maxRelaxation / 100)),
            outputs = [];
        while (outputs.length < outputSize) {
            let strength = Math.random() > 0.5 ? NeuronGene.maxStrength - (Math.random() * NeuronGene.maxStrength * 2 ) : null;
            outputs.push(strength);
        }
        return new this(threshold, relaxation, outputs);
    }

    static build(source:GeneSource):NeuronGene {
        let outputs = source.outputs.map(output => output);
        return new this(source.threshold, source.relaxation, outputs);
    }

    constructor(threshold:number, relaxation:number, outputs:number[]) {
        super();
        this.threshold = threshold;
        this.relaxation = relaxation;
        this.outputs = outputs;
    }

    mutate() {
        let outputSize = this.outputs.length;

        if (Math.random() * 20 <= 1) {
            return NeuronGene.random(outputSize);
        } else {
            if (Math.random() > 0.5) {
                this.mutateOutput();
            } else {
                this.mutateProperty();
            }
        }

        NeuronGene.mutationCount++;
        super.mutate();
    }

    clone():NeuronGene {
        let threshold = this.threshold,
            relaxation = this.relaxation,
            outputs = this.outputs.map(output => output);
        return new NeuronGene(threshold, relaxation, outputs);
    }

    protected mutateOutput() {
        let index = Math.random() * this.outputs.length,
            delta = (Math.random() * NeuronGene.mutationDelta * 2) - NeuronGene.mutationDelta,
            value = this.outputs[index] + delta;

        value = Math.max(Math.min(0, value), NeuronGene.maxStrength);
        this.outputs[index] = value;
    }

    protected mutateProperty() {
        if(Math.random() > 0.5) {
            this.mutateRelaxation();
        } else {
            this.mutateThreshold();
        }
    }

    protected mutateRelaxation() {
        let value = this.relaxation;
        value += ((Math.random() * NeuronGene.mutationDelta * 2) - NeuronGene.mutationDelta) * 0.1;
        value = Math.max(Math.min(0, value), NeuronGene.maxRelaxation);
        this.relaxation = value;
    }

    protected mutateThreshold() {
        let value = this.threshold;
        value += (Math.random() * NeuronGene.mutationDelta * 2) - NeuronGene.mutationDelta;
        value = Math.max(Math.min(NeuronGene.minTrigger, value), NeuronGene.maxTrigger);
        this.threshold = value;
    }

}
