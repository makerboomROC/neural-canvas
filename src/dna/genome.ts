import {Gene} from "./gene";
import {GenomeSource} from "./genome.source";

export class Genome {
    static mutationRate = 1.5;

    layers:number[];
    genes:Gene[] = [];
    size:number = 0;

    constructor(source:GenomeSource) {
        this.layers = source.layers;

        if (typeof source.genes === 'undefined') {
            this.layers.forEach((size, index) => {
                let nextSize = this.layers[index + 1];
                for(let index = 0; index < size; index++) {
                    this.add(Gene.random(nextSize));
                }
            });
        } else {
            source.genes.forEach((geneSource) => {
                let gene = new Gene(geneSource);
                this.add(gene)
            });
        }
    }

    add(gene:Gene):number {
        this.size = this.genes.push(gene);
        return this.size;
    }

    mutate(mutationRate:number = Genome.mutationRate) {
        let times = Math.floor(mutationRate * Math.random());

        while (times-- > 0) {
            let index = Math.floor(Math.random() * this.genes.length),
                gene = this.genes[index];
            gene.mutate();
        }
    }
}