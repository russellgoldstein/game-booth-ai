import { EntityManager } from "typeorm";
import { IPitchingPlatoonSplitsRepository } from "./interfaces/IPitchingPlatoonSplitsRepository";
import { PitchingPlatoonSplits } from "src/entity/PitchingPlatoonSplits";

export class PitchingPlatoonSplitsRepository implements IPitchingPlatoonSplitsRepository {
    constructor(private manager: EntityManager) { }

    async savePitchingPlatoonSplits(pitchingPlatoonSplits: PitchingPlatoonSplits[]): Promise<PitchingPlatoonSplits[]> {
        return this.manager.save(PitchingPlatoonSplits, pitchingPlatoonSplits);
    }

    async getPitchingPlatoonSplitsByPlayerSeasonId(playerSeasonId: number): Promise<PitchingPlatoonSplits[]> {
        return this.manager.find(PitchingPlatoonSplits, { where: { playerSeasonId } });
    }
}
