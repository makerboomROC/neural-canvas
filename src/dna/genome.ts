import {Gene} from "./gene";
import {GenomeSource} from "./genome.source";
import {GeneSource} from "./gene.source";

export class Genome <GeneType extends Gene>{
    static mutationRate = 1.5;

    genes:GeneType[];
    size:number;

    static build<GeneType extends Gene>(source:GenomeSource):Genome<GeneType> {
        let genes = this.buildGenes<GeneType>(source.genes);
        return new this<GeneType>(genes);
    }

    static buildGenes<GeneType extends Gene>(geneSources:GeneSource[]):GeneType[] {
        let genes = [];
        geneSources.map(geneSource => {
            let gene = GeneType.build(geneSource);
            genes.push(gene);
        });
        return genes;
    }

    constructor(genes:GeneType[] = []) {
        this.genes = genes;
        this.size = this.genes.length;
    }

    add(gene:GeneType):number {
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

    clone():Genome<GeneType> {
        let genes = this.genes.map(gene => gene.clone());
        return new Genome<GeneType>(genes);
    }
}