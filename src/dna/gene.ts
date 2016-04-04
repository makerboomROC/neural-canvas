import {GeneSource} from "./gene.source";

export class Gene {
    static mutationCount = 0;

    static build(source:GeneSource):Gene {
        return new this();
    }

    constructor() {}

    mutate() {
        Gene.mutationCount++;
    }

    clone():Gene {
        return new Gene();
    }

}
