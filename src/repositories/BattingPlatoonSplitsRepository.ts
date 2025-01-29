import { BattingPlatoonSplits } from "src/entity/BattingPlatoonSplits";
import { EntityManager } from "typeorm";
import { IBattingPlatoonSplitsRepository } from "./interfaces/IBattingPlatoonSplitsRepository";

export class BattingPlatoonSplitsRepository implements IBattingPlatoonSplitsRepository {
    constructor(private manager: EntityManager) { }

    async saveBattingPlatoonSplits(battingPlatoonSplits: BattingPlatoonSplits[]): Promise<BattingPlatoonSplits[]> {
        return this.manager.save(BattingPlatoonSplits, battingPlatoonSplits);
    }

    async getBattingPlatoonSplitsByPlayerSeasonId(playerSeasonId: number): Promise<BattingPlatoonSplits[]> {
        return this.manager.find(BattingPlatoonSplits, { where: { playerSeasonId } });
    }
}
