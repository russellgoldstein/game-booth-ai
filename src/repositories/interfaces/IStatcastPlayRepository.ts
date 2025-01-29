import { BatBallType } from '../../entity/StatcastPlay';
import { StatcastPlay } from '../../entity';

export interface IStatcastPlayRepository {
    findByHitterAndBatBallType(
        hitterPlayerSeasonId: number,
        year: number,
        bbType: BatBallType
    ): Promise<StatcastPlay[]>;
    findDistinctTeamsByYear(year: number): Promise<string[]>;
}
