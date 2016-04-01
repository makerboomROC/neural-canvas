import {GeneSource} from "./gene.source";

export interface GenomeSource {
    layers:number[];
    genes?:GeneSource[];
}