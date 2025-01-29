import { PitchingPlatoonSplits } from "src/entity/PitchingPlatoonSplits";

export interface IPitchingPlatoonSplitsRepository {
    savePitchingPlatoonSplits(pitchingPlatoonSplits: PitchingPlatoonSplits[]): Promise<PitchingPlatoonSplits[]>;
    getPitchingPlatoonSplitsByPlayerSeasonId(playerSeasonId: number): Promise<PitchingPlatoonSplits[]>;
}
