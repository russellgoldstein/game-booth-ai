import { BattingPlatoonSplits } from "src/entity/BattingPlatoonSplits";

export interface IBattingPlatoonSplitsRepository {
    saveBattingPlatoonSplits(battingPlatoonSplits: BattingPlatoonSplits[]): Promise<BattingPlatoonSplits[]>;
    getBattingPlatoonSplitsByPlayerSeasonId(playerSeasonId: number): Promise<BattingPlatoonSplits[]>;
}
