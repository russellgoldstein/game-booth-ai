import { EntityManager, Repository } from 'typeorm';
import { IFangraphsStatsRepository } from './interfaces/IFangraphsStatsRepository';
import { PlayerSeason } from '../entity/PlayerSeason';
import { FangraphsBattingStats } from '../entity/FangraphsBattingStats';
import { FangraphsPitchingStats } from '../entity/FangraphsPitchingStats';

export class FangraphsStatsRepository implements IFangraphsStatsRepository {
    private battingStatsRepository: Repository<FangraphsBattingStats>;
    private pitchingStatsRepository: Repository<FangraphsPitchingStats>;

    constructor(private entityManager: EntityManager) {
        this.battingStatsRepository = this.entityManager.getRepository(FangraphsBattingStats);
        this.pitchingStatsRepository = this.entityManager.getRepository(FangraphsPitchingStats);
    }
    async getHittersSeasonStats(playerSeasons: PlayerSeason[]): Promise<FangraphsBattingStats[]> {
        if (playerSeasons.length === 0) {
            return [];
        }
        const playerSeasonIds = playerSeasons.map(ps => ps.id);

        return this.battingStatsRepository
            .createQueryBuilder('fbs')
            .innerJoinAndSelect('fbs.playerSeason', 'playerSeason')
            .innerJoinAndSelect('playerSeason.player', 'player')
            .where('fbs.playerSeasonId IN (:...ids)', { ids: playerSeasonIds })
            .getMany();
    }

    async getPitchersSeasonStats(playerSeasons: PlayerSeason[]): Promise<FangraphsPitchingStats[]> {
        if (playerSeasons.length === 0) {
            return [];
        }
        const playerSeasonIds = playerSeasons.map(ps => ps.id);

        return this.pitchingStatsRepository
            .createQueryBuilder('fps')
            .innerJoinAndSelect('fps.playerSeason', 'playerSeason')
            .innerJoinAndSelect('playerSeason.player', 'player')
            .where('fps.playerSeasonId IN (:...ids)', { ids: playerSeasonIds })
            .getMany();
    }

    async getBattingStatsByPlayerSeasonId(playerSeasonId: string): Promise<FangraphsBattingStats[]> {
        return this.battingStatsRepository
            .createQueryBuilder('fangraphs_batting_stats')
            .innerJoinAndSelect(
                'fangraphs_batting_stats.playerSeason',
                'playerSeason',
                'playerSeason.id = fangraphs_batting_stats.player_season_id'
            )
            .innerJoinAndSelect(
                'playerSeason.player',
                'player',
                'player.id = playerSeason.player_id'
            )
            .where('fangraphs_batting_stats.player_season_id = :playerSeasonId', { playerSeasonId })
            .getMany();
    }

    async getPitchingStatsByPlayerSeasonId(playerSeasonId: string): Promise<FangraphsPitchingStats[]> {
        return this.pitchingStatsRepository
            .createQueryBuilder('fangraphs_pitching_stats')
            .innerJoinAndSelect(
                'fangraphs_pitching_stats.playerSeason',
                'playerSeason',
                'playerSeason.id = fangraphs_pitching_stats.player_season_id'
            )
            .innerJoinAndSelect(
                'playerSeason.player',
                'player',
                'player.id = playerSeason.player_id'
            )
            .where('fangraphs_pitching_stats.player_season_id = :playerSeasonId', { playerSeasonId })
            .getMany();
    }

    async findBattingStatsByTeamAndYear(teamAbbrev: string, year: number): Promise<FangraphsBattingStats[]> {
        return this.battingStatsRepository
            .createQueryBuilder('fbs')
            .innerJoinAndSelect('fbs.playerSeason', 'playerSeason')
            .innerJoinAndSelect('playerSeason.player', 'player')
            .innerJoin('MlbTeamPlayer', 'mtp', 'mtp.playerSeasonId = fbs.playerSeasonId')
            .where('mtp.team = :team', { team: teamAbbrev })
            .andWhere('playerSeason.year = :year', { year })
            .getMany();
    }

    async findPitchingStatsByTeamAndYear(teamAbbrev: string, year: number): Promise<FangraphsPitchingStats[]> {
        return this.pitchingStatsRepository
            .createQueryBuilder('fps')
            .innerJoinAndSelect('fps.playerSeason', 'playerSeason')
            .innerJoinAndSelect('playerSeason.player', 'player')
            .innerJoin('MlbTeamPlayer', 'mtp', 'mtp.playerSeasonId = fps.playerSeasonId')
            .where('mtp.team = :team', { team: teamAbbrev })
            .andWhere('playerSeason.year = :year', { year })
            .getMany();
    }
}
