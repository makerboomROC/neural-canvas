import {Genome} from "../dna/genome";
import {NeuronGene} from "./neuron.gene";
import {GenomeSource} from "../dna/genome.source";

export class NetworkGenome extends Genome<NeuronGene> {
    static mutationRate = 1.5;

    layers:number[];

    static random(layers:number[]):NetworkGenome {
        let genes = [];
        layers.forEach((size, index) => {
            let nextSize = layers[index + 1];
            for (let c = 0; c < size; c++) {
                genes.push(NeuronGene.random(nextSize));
            }
        });
        return new this(genes, layers);
    }

    static build(source:GenomeSource):NetworkGenome {
        let genes = this.buildGenes<NeuronGene>(source.genes),
            layers = source.layers;
        return new this(genes, layers);
    }

    constructor(genes:NeuronGene[], layers:number[]) {
        super(genes);
        this.layers = layers;
    }

    add(gene:NeuronGene):number {
        return super.add(gene);
    }

    clone():NetworkGenome {
        let layers = this.layers.map(size => size),
            genes = this.genes.map(gene => gene.clone());
        return new NetworkGenome(genes, layers);
    }

}