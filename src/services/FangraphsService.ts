import { FangraphsBattingStats } from '../entity/FangraphsBattingStats';
import { FangraphsPitchingStats } from '../entity/FangraphsPitchingStats';
import { PlayerSeason } from '../entity/PlayerSeason';
import { IFangraphsStatsRepository } from '../repositories/interfaces/IFangraphsStatsRepository';

export type RateStats = {
  strikeoutPercentage: number;
  walkPercentage: number;
  groundballPercentage: number;
  flyballPercentage: number;
  homerunsPerFlyBallRate: number;
  pullPercentage: number;
  centerPercentage: number;
  oppoPercentage: number;
  softPercentage: number;
  mediumPercentage: number;
  hardPercentage: number;
};


export class FangraphsService {
  constructor(private fangraphsStatsRepository: IFangraphsStatsRepository) { }

  async getFangraphsHittersSeasonStats(playerSeasons: PlayerSeason[]) {
    return this.fangraphsStatsRepository.getHittersSeasonStats(playerSeasons);
  }

  async getFangraphsPitcherSeasonStats(playerSeasons: PlayerSeason[]) {
    return this.fangraphsStatsRepository.getPitchersSeasonStats(playerSeasons);
  }

  convertFangraphsSeasonStatsToRateStats = (
    stats: FangraphsBattingStats | FangraphsPitchingStats | undefined
  ): RateStats => {
    return {
      strikeoutPercentage: (stats?.['K%'] ?? 0) * 100,
      walkPercentage: (stats?.['BB%'] ?? 0) * 100,
      groundballPercentage: (stats?.['GB%'] ?? 0) * 100,
      flyballPercentage: (stats?.['FB%'] ?? 0) * 100,
      homerunsPerFlyBallRate: (stats?.['HR/FB'] ?? 0) * 100,
      pullPercentage: (stats?.['Pull%'] ?? 0) * 100,
      centerPercentage: (stats?.['Cent%'] ?? 0) * 100,
      oppoPercentage: (stats?.['Oppo%'] ?? 0) * 100,
      softPercentage: (stats?.['Soft%'] ?? 0) * 100,
      mediumPercentage: (stats?.['Med%'] ?? 0) * 100,
      hardPercentage: (stats?.['Hard%'] ?? 0) * 100,
    };
  };

  getFangraphsBatterRateStats = async (playerSeason: PlayerSeason) => {
    const hitterData = await this.getFangraphsHittersSeasonStats([playerSeason]);
    const hitter = hitterData.find((h) => h.playerSeasonId === playerSeason.id);
    if (!hitter) {
      throw new Error('Hitter not found');
    }
    return this.convertFangraphsSeasonStatsToRateStats(hitter);
  }

  getFangraphsPitcherRateStats = async (playerSeason: PlayerSeason) => {
    const pitcherData = await this.getFangraphsPitcherSeasonStats([playerSeason]);
    const pitcher = pitcherData.find((p) => p.playerSeasonId === playerSeason.id);
    if (!pitcher) {
      throw new Error('Pitcher not found');
    }
    return this.convertFangraphsSeasonStatsToRateStats(pitcher);
  }

  getTeam = async (hitterPlayerSeasons: PlayerSeason[], pitcherPlayerSeasons: PlayerSeason[]) => {
    const hitters = await this.getFangraphsHittersSeasonStats(hitterPlayerSeasons);

    const hitterObjects = hitterPlayerSeasons.map((ps) => {
      const h = hitters.find((h) => h.playerSeasonId === ps.id);
      if (!h) {
        throw new Error('Hitter not found');
      }
      return {
        player: ps.player,
        rateStats: this.convertFangraphsSeasonStatsToRateStats(h),
      };
    });

    const pitchers = await this.getFangraphsPitcherSeasonStats(pitcherPlayerSeasons);

    const pitcherObjects = pitcherPlayerSeasons.map((ps) => {
      const p = pitchers.find((p) => p.playerSeasonId === ps.id);
      if (!p) {
        throw new Error('Pitcher not found');
      }
      return {
        player: ps.player,
        rateStats: this.convertFangraphsSeasonStatsToRateStats(p),
      };
    });

    return {
      lineup: hitterObjects,
      pitchers: pitcherObjects,
    };
  };
}
