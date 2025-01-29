import { PlayerSeason } from '../../entity/PlayerSeason';
import { FangraphsBattingStats } from '../../entity/FangraphsBattingStats';
import { FangraphsPitchingStats } from '../../entity/FangraphsPitchingStats';

export interface IFangraphsStatsRepository {
    getHittersSeasonStats(playerSeasons: PlayerSeason[]): Promise<FangraphsBattingStats[]>;
    getPitchersSeasonStats(playerSeasons: PlayerSeason[]): Promise<FangraphsPitchingStats[]>;
    getBattingStatsByPlayerSeasonId(playerSeasonId: string): Promise<FangraphsBattingStats[]>;
    getPitchingStatsByPlayerSeasonId(playerSeasonId: string): Promise<FangraphsPitchingStats[]>;
    findBattingStatsByTeamAndYear(teamAbbrev: string, year: number): Promise<FangraphsBattingStats[]>;
    findPitchingStatsByTeamAndYear(teamAbbrev: string, year: number): Promise<FangraphsPitchingStats[]>;
}
