import { Repository } from 'typeorm';
import { StatcastPlay, StatcastEvent } from '../entity/StatcastPlay';
import { Player } from '../entity/Player';

interface MatchupStats {
    totalAtBats: number;
    hits: number;
    doubles: number;
    triples: number;
    homeRuns: number;
    walks: number;
    strikeouts: number;
    battingAverage: number;
    sluggingPercentage: number;
    onBasePercentage: number;
    avgExitVelocity?: number;
    avgLaunchAngle?: number;
    hardHitRate?: number;  // Percentage of balls hit 95+ mph
}

export class StatcastService {
    constructor(
        private statcastRepository: Repository<StatcastPlay>
    ) { }

    async getBatterVsPitcherStats(batterId: number, pitcherId: number): Promise<MatchupStats> {
        // Get all matchups between these players
        const matchups = await this.statcastRepository
            .createQueryBuilder('play')
            .innerJoin('play.hitterPlayerSeason', 'hitterSeason')
            .innerJoin('hitterSeason.player', 'hitter')
            .innerJoin('play.pitcherPlayerSeason', 'pitcherSeason')
            .innerJoin('pitcherSeason.player', 'pitcher')
            .where('hitter.key_mlbam = :batterId', { batterId })
            .andWhere('pitcher.key_mlbam = :pitcherId', { pitcherId })
            .getMany();

        // Initialize stats
        let stats: MatchupStats = {
            totalAtBats: 0,
            hits: 0,
            doubles: 0,
            triples: 0,
            homeRuns: 0,
            walks: 0,
            strikeouts: 0,
            battingAverage: 0,
            sluggingPercentage: 0,
            onBasePercentage: 0
        };

        // Track totals for averages
        let totalExitVelocity = 0;
        let totalLaunchAngle = 0;
        let hardHitBalls = 0;
        let ballsInPlay = 0;

        // Process each plate appearance
        const plateAppearances = matchups.filter(play =>
            play.events !== null &&
            play.at_bat_number !== null
        );

        // Group by at-bat number to handle multiple pitches in same at-bat
        const atBats = new Map<number, StatcastPlay>();
        plateAppearances.forEach(play => {
            if (!atBats.has(play.at_bat_number) ||
                play.events !== null) {
                atBats.set(play.at_bat_number, play);
            }
        });

        atBats.forEach(play => {
            // Track exit velocity and launch angle when available
            if (play.launch_speed) {
                totalExitVelocity += play.launch_speed;
                ballsInPlay++;
                if (play.launch_speed >= 95) {
                    hardHitBalls++;
                }
            }
            if (play.launch_angle) {
                totalLaunchAngle += play.launch_angle;
            }

            // Process the result
            switch (play.events) {
                case StatcastEvent.SINGLE:
                    stats.hits++;
                    stats.totalAtBats++;
                    break;
                case StatcastEvent.DOUBLE:
                    stats.hits++;
                    stats.doubles++;
                    stats.totalAtBats++;
                    break;
                case StatcastEvent.TRIPLE:
                    stats.hits++;
                    stats.triples++;
                    stats.totalAtBats++;
                    break;
                case StatcastEvent.HOME_RUN:
                    stats.hits++;
                    stats.homeRuns++;
                    stats.totalAtBats++;
                    break;
                case StatcastEvent.STRIKEOUT:
                case StatcastEvent.STRIKEOUT_DOUBLE_PLAY:
                    stats.strikeouts++;
                    stats.totalAtBats++;
                    break;
                case StatcastEvent.WALK:
                case StatcastEvent.INTENT_WALK:
                    stats.walks++;
                    break;
                case StatcastEvent.HIT_BY_PITCH:
                    // Count as a walk for OBP
                    stats.walks++;
                    break;
                case StatcastEvent.FIELD_OUT:
                case StatcastEvent.FORCE_OUT:
                case StatcastEvent.DOUBLE_PLAY:
                case StatcastEvent.GROUNDED_INTO_DOUBLE_PLAY:
                case StatcastEvent.FIELDERS_CHOICE:
                case StatcastEvent.FIELDERS_CHOICE_OUT:
                    stats.totalAtBats++;
                    break;
            }
        });

        // Calculate averages
        const plateAppearanceCount = stats.totalAtBats + stats.walks;
        stats.battingAverage = stats.totalAtBats > 0 ? stats.hits / stats.totalAtBats : 0;
        stats.onBasePercentage = plateAppearanceCount > 0 ?
            (stats.hits + stats.walks) / plateAppearanceCount : 0;
        stats.sluggingPercentage = stats.totalAtBats > 0 ?
            (stats.hits + stats.doubles + 2 * stats.triples + 3 * stats.homeRuns) / stats.totalAtBats : 0;

        // Add Statcast metrics if we have enough data
        if (ballsInPlay > 0) {
            stats.avgExitVelocity = totalExitVelocity / ballsInPlay;
            stats.avgLaunchAngle = totalLaunchAngle / ballsInPlay;
            stats.hardHitRate = hardHitBalls / ballsInPlay;
        }

        return stats;
    }

    formatMatchupStats(stats: MatchupStats): string {
        return `
      ${stats.hits}-for-${stats.totalAtBats} (${(stats.battingAverage * 1000).toFixed(3)})
      ${stats.doubles} 2B, ${stats.triples} 3B, ${stats.homeRuns} HR
      ${stats.walks} BB, ${stats.strikeouts} K
      ${stats.avgExitVelocity ? `\nAvg Exit Velo: ${stats.avgExitVelocity.toFixed(1)} mph` : ''}
      ${stats.hardHitRate ? `Hard Hit Rate: ${(stats.hardHitRate * 100).toFixed(1)}%` : ''}
    `.trim();
    }
} 