import {Genome} from "../dna/genome";

export class ForagerGenome extends Genome {
    static random(hiddenLayers:number[] = [3]):ForagerGenome {
        let layers = [3].concat(hiddenLayers).concat([3]),
            source = {
                layers: layers
            };
        return new ForagerGenome(source);
    }
}