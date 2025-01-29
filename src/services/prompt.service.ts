import { GameContext } from "src/types/mlb.types";
import { StatcastService } from "./statcast.service";
import { ServiceContainer } from "./container";

interface PlayerStats {
    batter?: {
        stats: Array<{
            splits: Array<{
                stat: any;
                player: { fullName: string };
                team: { name: string };
            }>;
        }>;
    };
    pitcher?: {
        stats: Array<{
            splits: Array<{
                stat: any;
                player: { fullName: string };
                team: { name: string };
            }>;
        }>;
    };
}

interface QuestionAnalysis {
    type: 'performance' | 'matchup' | 'situation' | 'prediction' | 'strategy' | 'comparison' | 'trend' | 'general';
    focus: 'batter' | 'pitcher' | 'both' | 'game' | 'team';
    timeframe: 'current' | 'season' | 'recent' | 'historical';
    context: {
        situational: boolean;  // Is game situation relevant?
        statistical: boolean;  // Are player stats relevant?
        matchup: boolean;      // Is matchup history relevant?
        strategic: boolean;    // Is strategic analysis needed?
    };
    relevantStats: string[];
}

interface StatCategories {
    batting: {
        basic: string[];
        advanced: string[];
        situational: string[];
        splits: string[];
        trends: string[];
    };
    pitching: {
        basic: string[];
        advanced: string[];
        situational: string[];
        control: string[];
        trends: string[];
    };
}

interface AtBatContext {
    result: any;
    matchup: {
        batter: string;
        pitcher: string;
    };
    count: {
        balls: number;
        strikes: number;
        outs: number;
    };
    pitches: Array<{
        type: string;
        speed: number;
        location: number;
        result: string;
    }>;
    runners: any[];
    gameContext: {
        inning: number;
        isTopInning: boolean;
        outs: number;
        score: {
            away: number;
            home: number;
        };
    };
}

interface Commentary {
    summary: string;
    analysis: string;
    isKeyMoment: boolean;
    significance: string;
}

interface PreviewContext {
    matchup: {
        batter: string;
        pitcher: string;
    };
    gameContext: {
        inning: number;
        isTopInning: boolean;
        outs: number;
        score: {
            away: number;
            home: number;
        };
    };
}

export class PromptService {
    private static readonly LANGUAGES = {
        en: 'English',
        es: 'Spanish',
        ja: 'Japanese'
    };

    private readonly statCategories: StatCategories = {
        batting: {
            basic: [
                'avg', 'obp', 'slg', 'ops',
                'hits', 'doubles', 'triples', 'homeRuns',
                'rbi', 'runs', 'gamesPlayed'
            ],
            advanced: [
                'babip', 'totalBases', 'groundOutsToAirouts',
                'atBatsPerHomeRun', 'plateAppearances'
            ],
            situational: [
                'stolenBases', 'stolenBasePercentage',
                'groundIntoDoublePlay', 'sacBunts', 'sacFlies',
                'intentionalWalks', 'hitByPitch'
            ],
            splits: [
                'groundOuts', 'airOuts', 'strikeOuts',
                'baseOnBalls', 'leftOnBase'
            ],
            trends: [
                'lastGameHits', 'recentAvg', 'recentObp',
                'recentSlg', 'recentOps', 'currentStreak'
            ]
        },
        pitching: {
            basic: [
                'era', 'whip', 'wins', 'losses',
                'inningsPitched', 'gamesPitched', 'gamesStarted',
                'completeGames', 'shutouts'
            ],
            advanced: [
                'strikeoutsPer9Inn', 'walksPer9Inn',
                'hitsPer9Inn', 'homeRunsPer9',
                'runsScoredPer9', 'pitchesPerInning'
            ],
            situational: [
                'inheritedRunners', 'inheritedRunnersScored',
                'saveOpportunities', 'saves', 'holds',
                'blownSaves', 'gamesFinished'
            ],
            control: [
                'strikes', 'strikePercentage',
                'strikeoutWalkRatio', 'wildPitches',
                'balks', 'pickoffs', 'totalBases'
            ],
            trends: [
                'lastGamePitches', 'lastGameStrikeouts',
                'recentEra', 'recentWhip', 'currentStreak'
            ]
        }
    };

    constructor(
        private statcastService: StatcastService = new StatcastService(
            ServiceContainer.getInstance().statcastPlayRepository
        )
    ) { }

    generateBaseballPrompt(context: {
        message: string,
        gameContext?: any,
        playerStats?: any,
        matchupStats?: any,
        language?: keyof typeof PromptService.LANGUAGES
    }) {
        const lang = context.language || 'en';
        const analysis = this.analyzeQuestion(context.message);

        // Build context sections with relevant stats only
        const gameSection = this.buildGameContext(context.gameContext, lang);
        const statsSection = this.buildStatsContext(
            context.playerStats,
            context.matchupStats,
            lang,
            analysis.relevantStats
        );

        // Combine into final prompt
        const prompt = `
You are a baseball analytics expert and commentator. Provide insights in ${PromptService.LANGUAGES[lang]} based STRICTLY on the following context:

${gameSection}

${statsSection}

User Question: ${context.message}

CRITICAL GUIDELINES:
1. ONLY use statistics explicitly provided in the context above
2. DO NOT reference any external statistics or historical data
3. DO NOT make assumptions about:
   - The score of the game
   - Player tendencies or preferences
   - Pitch types or velocities
   - Historical matchups
   - Any other data not explicitly provided
4. If asked about information not provided, clearly state: "That information is not available in the current context."
5. Be extremely precise about the current game situation (inning, outs, count)
6. If the question assumes incorrect information, politely correct it using only the provided context
7. Never reference sources like Baseball Savant, FanGraphs, or other databases

Your response must:
1. Use only the exact statistics shown above
2. Acknowledge what information is missing
3. Be factual without speculation
4. Focus on what can be concluded from the available data only

Remember: It's better to acknowledge limited information than to make assumptions or reference external data.
`;

        return prompt.trim();
    }

    private analyzeQuestion(question: string): QuestionAnalysis {
        question = question.toLowerCase();

        // Default analysis
        const analysis: QuestionAnalysis = {
            type: 'general',
            focus: 'game',
            timeframe: 'current',
            context: {
                situational: false,
                statistical: false,
                matchup: false,
                strategic: false
            },
            relevantStats: []
        };

        // Determine question type
        if (question.includes('how has') || question.includes('how is') || question.includes('stats')) {
            analysis.type = 'performance';
            analysis.timeframe = 'season';
            analysis.context.statistical = true;
        } else if (question.includes('matchup') || question.includes('against') || question.includes('face')) {
            analysis.type = 'matchup';
            analysis.context.matchup = true;
            analysis.context.statistical = true;
        } else if (question.includes('what should') || question.includes('how should')) {
            analysis.type = 'strategy';
            analysis.context.strategic = true;
            analysis.context.situational = true;
        } else if (question.includes('will') || question.includes('predict') || question.includes('likely')) {
            analysis.type = 'prediction';
            analysis.context.statistical = true;
            analysis.context.situational = true;
        } else if (question.includes('compare') || question.includes('better') || question.includes('versus')) {
            analysis.type = 'comparison';
            analysis.context.statistical = true;
        } else if (question.includes('trend') || question.includes('lately') || question.includes('recent')) {
            analysis.type = 'trend';
            analysis.timeframe = 'recent';
            analysis.context.statistical = true;
        } else if (question.includes('situation') || question.includes('count') || question.includes('inning')) {
            analysis.type = 'situation';
            analysis.timeframe = 'current';
            analysis.context.situational = true;
        }

        // Determine focus
        if (question.includes('pitcher') || question.includes('throwing') || question.includes('pitch')) {
            analysis.focus = 'pitcher';
            analysis.relevantStats = this.getPitcherRelevantStats(analysis.type, analysis.timeframe);
        } else if (question.includes('batter') || question.includes('hitting') || question.includes('bat')) {
            analysis.focus = 'batter';
            analysis.relevantStats = this.getBatterRelevantStats(analysis.type, analysis.timeframe);
        } else if (question.includes('matchup') || question.includes('against') || question.includes('face')) {
            analysis.focus = 'both';
            analysis.relevantStats = [
                ...this.getPitcherRelevantStats(analysis.type, analysis.timeframe),
                ...this.getBatterRelevantStats(analysis.type, analysis.timeframe)
            ];
        } else if (question.includes('team')) {
            analysis.focus = 'team';
        }

        return analysis;
    }

    private getPitcherRelevantStats(type: QuestionAnalysis['type'], timeframe: QuestionAnalysis['timeframe']): string[] {
        const { basic, advanced, situational, control, trends } = this.statCategories.pitching;

        switch (type) {
            case 'performance':
                return timeframe === 'season'
                    ? [...basic, ...advanced]
                    : [...basic, ...trends];
            case 'situation':
                return [...situational, ...control];
            case 'strategy':
                return [...basic, ...control, ...situational];
            case 'matchup':
                return [...basic, ...control];
            case 'prediction':
                return [...basic, ...advanced, ...control, ...trends];
            case 'comparison':
                return [...basic, ...advanced, ...control];
            case 'trend':
                return [...trends, ...basic];
            default:
                return basic;
        }
    }

    private getBatterRelevantStats(type: QuestionAnalysis['type'], timeframe: QuestionAnalysis['timeframe']): string[] {
        const { basic, advanced, situational, splits, trends } = this.statCategories.batting;

        switch (type) {
            case 'performance':
                return timeframe === 'season'
                    ? [...basic, ...advanced]
                    : [...basic, ...trends];
            case 'situation':
                return [...situational, ...splits];
            case 'strategy':
                return [...basic, ...situational];
            case 'matchup':
                return [...basic, ...splits];
            case 'prediction':
                return [...basic, ...advanced, ...splits, ...trends];
            case 'comparison':
                return [...basic, ...advanced];
            case 'trend':
                return [...trends, ...basic];
            default:
                return basic;
        }
    }

    private buildGameContext(gameContext: GameContext, language: string): string {
        if (!gameContext) return '';

        const inningPhrase = language === 'es' ?
            `${gameContext.isTopInning ? 'Parte alta' : 'Parte baja'} del ${gameContext.inning}° inning` :
            language === 'ja' ?
                `${gameContext.inning}回${gameContext.isTopInning ? '表' : '裏'}` :
                `${gameContext.isTopInning ? 'Top' : 'Bottom'} of the ${gameContext.inning}th inning`;

        return `
Game Situation:
- ${inningPhrase}
- Situation: ${gameContext.count.balls} balls, ${gameContext.count.strikes} strikes, ${gameContext.count.outs} outs
- Pitcher: ${gameContext.pitcher?.fullName}
- Batter: ${gameContext.batter?.fullName}
- Runners: ${this.formatRunners(gameContext.runnersOn)}
- Current Play: ${gameContext.currentPlayResult.description}
- Score: ${gameContext.currentPlayResult.homeScore}-${gameContext.currentPlayResult.awayScore}
`;
    }

    private buildStatsContext(
        playerStats: any,
        matchupStats: any,
        language: string,
        relevantStats: string[]
    ): string {
        if (!playerStats && !matchupStats) return '';

        return `
Statistical Context:
${matchupStats ? `
Head-to-Head Statistics:
${this.formatMatchupStats(matchupStats, relevantStats)}` : ''}

${playerStats ? `
Season Statistics:
${this.formatPlayerStats(playerStats, relevantStats)}` : ''}
`;
    }

    private formatRunners(runners: Array<{ base: string, player: any }> = []): string {
        if (runners.length === 0) return 'Bases empty';
        return runners
            .map(r => `${r.player.fullName} on ${r.base}`)
            .join(', ');
    }

    private formatMatchupStats(stats: any, relevantStats: string[]): string {
        // Format based on actual MLB API response structure
        return Object.entries(stats)
            .filter(([key, _]) => relevantStats.includes(key))
            .map(([key, value]) => `- ${key}: ${value}`)
            .join('\n');
    }

    private formatPlayerStats(stats: PlayerStats, relevantStats: string[]): string {
        let formattedStats = '';

        // Format batter stats if available
        if (stats.batter?.stats[0]?.splits[0]) {
            const batterData = stats.batter.stats[0].splits[0];
            const batterStats = batterData.stat;
            formattedStats += `BATTER: ${batterData.player.fullName} (${batterData.team.name})\n`;
            formattedStats += `Season Stats:\n`;

            // Only include stats that are in the relevantStats array
            const batterLines = [];

            if (relevantStats.some(stat => ['avg', 'obp', 'slg'].includes(stat))) {
                batterLines.push(`- AVG/OBP/SLG: ${batterStats.avg}/${batterStats.obp}/${batterStats.slg}`);
            }

            const basicStats = new Map([
                ['homeRuns', 'HR'],
                ['rbi', 'RBI'],
                ['runs', 'Runs'],
                ['hits', 'Hits'],
                ['doubles', '2B'],
                ['triples', '3B'],
                ['baseOnBalls', 'BB'],
                ['strikeOuts', 'SO'],
                ['gamesPlayed', 'Games'],
                ['plateAppearances', 'PA'],
                ['stolenBases', 'SB'],
                ['groundOuts', 'Ground Outs'],
                ['airOuts', 'Air Outs'],
                ['leftOnBase', 'LOB']
            ]);

            // Group related stats together
            const statGroups: { [key: string]: string[] } = {};

            for (const [statKey, label] of basicStats) {
                if (relevantStats.includes(statKey) && batterStats[statKey] !== undefined) {
                    const groupKey = this.getStatGroupKey(statKey);
                    if (!statGroups[groupKey]) {
                        statGroups[groupKey] = [];
                    }
                    statGroups[groupKey].push(`${label}: ${batterStats[statKey]}`);
                }
            }

            // Add each group's stats as a line
            for (const stats of Object.values(statGroups)) {
                if (stats.length > 0) {
                    batterLines.push(`- ${stats.join(', ')}`);
                }
            }

            formattedStats += batterLines.join('\n') + '\n\n';
        }

        // Format pitcher stats if available
        if (stats.pitcher?.stats[0]?.splits[0]) {
            const pitcherData = stats.pitcher.stats[0].splits[0];
            const pitcherStats = pitcherData.stat;
            formattedStats += `PITCHER: ${pitcherData.player.fullName} (${pitcherData.team.name})\n`;
            formattedStats += `Season Stats:\n`;

            // Only include stats that are in the relevantStats array
            const pitcherLines = [];

            const pitcherStatMap = new Map([
                ['era', 'ERA'],
                ['whip', 'WHIP'],
                ['wins', 'W'],
                ['losses', 'L'],
                ['inningsPitched', 'IP'],
                ['strikeoutsPer9Inn', 'SO/9'],
                ['walksPer9Inn', 'BB/9'],
                ['hits', 'Hits'],
                ['homeRuns', 'HR'],
                ['strikeoutWalkRatio', 'SO/BB'],
                ['strikePercentage', 'Strike%'],
                ['pitchesPerInning', 'Pitches/IP'],
                ['inheritedRunners', 'IR'],
                ['inheritedRunnersScored', 'IRS']
            ]);

            // Group related stats together
            const statGroups: { [key: string]: string[] } = {};

            for (const [statKey, label] of pitcherStatMap) {
                if (relevantStats.includes(statKey) && pitcherStats[statKey] !== undefined) {
                    const groupKey = this.getStatGroupKey(statKey);
                    if (!statGroups[groupKey]) {
                        statGroups[groupKey] = [];
                    }
                    const value = statKey === 'strikePercentage'
                        ? `${(parseFloat(pitcherStats[statKey]) * 100).toFixed(1)}%`
                        : pitcherStats[statKey];
                    statGroups[groupKey].push(`${label}: ${value}`);
                }
            }

            // Add each group's stats as a line
            for (const stats of Object.values(statGroups)) {
                if (stats.length > 0) {
                    pitcherLines.push(`- ${stats.join(', ')}`);
                }
            }

            formattedStats += pitcherLines.join('\n');
        }

        return formattedStats || 'No stats available';
    }

    private getStatGroupKey(statKey: string): string {
        if (['avg', 'obp', 'slg', 'ops'].includes(statKey)) return 'rates';
        if (['hits', 'doubles', 'triples', 'homeRuns'].includes(statKey)) return 'hits';
        if (['rbi', 'runs'].includes(statKey)) return 'production';
        if (['baseOnBalls', 'strikeOuts'].includes(statKey)) return 'discipline';
        if (['era', 'whip'].includes(statKey)) return 'rates';
        if (['wins', 'losses', 'saves', 'holds'].includes(statKey)) return 'results';
        if (['strikeoutsPer9Inn', 'walksPer9Inn'].includes(statKey)) return 'rates';
        return 'other';
    }

    generateAtBatCommentary(context: AtBatContext): string {
        const prompt = `
            As a baseball commentator, provide analysis for this at-bat result:
            
            Situation: ${context.gameContext.isTopInning ? 'Top' : 'Bottom'} of the ${context.gameContext.inning}${this.getInningOrdinal(context.gameContext.inning)},
            ${context.count.balls} balls, ${context.count.strikes} strikes, ${context.count.outs} outs
            Score: ${context.gameContext.score.away}-${context.gameContext.score.home}
            ${context.matchup.pitcher} pitching to ${context.matchup.batter}
            
            Pitch Sequence:
            ${context.pitches.map((pitch, i) =>
            `Pitch ${i + 1}: ${JSON.stringify(pitch.type)} (${pitch.speed} mph) - ${pitch.result}`
        ).join('\n')}
            
            Final Result: ${context.result.description}
            
            Please provide a brief commentary on the at-bat of no more than 50 words, with the at bat result and a short commentary on the at-bat. Do not include any other information not directly related to the at-bat. Use only the information provided in the context.
        `;

        return prompt;
    }

    generateAtBatPreviewCommentary(context: AtBatContext): string {
        const prompt = `
            As a baseball commentator, provide a preview of the at-bat:
            
            Situation: ${context.gameContext.isTopInning ? 'Top' : 'Bottom'} of the ${context.gameContext.inning}${this.getInningOrdinal(context.gameContext.inning)},
        `;

        return prompt;
    }

    private getInningOrdinal(inning: number): string {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = inning % 100;
        return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
    }

    private isKeyMoment(context: AtBatContext): boolean {
        // Define criteria for key moments
        const isLateInning = context.gameContext.inning >= 7;
        const isCloseSituation = Math.abs(context.gameContext.score.away - context.gameContext.score.home) <= 3;
        const hasRunnersInScoringPosition = context.runners.some(runner =>
            runner.movement.start === '2B' || runner.movement.start === '3B'
        );

        return isLateInning && (isCloseSituation || hasRunnersInScoringPosition);
    }

    async generateAtBatPreview(context: PreviewContext): Promise<string> {
        // Get the matchup stats
        const matchupStats = await this.statcastService.getBatterVsPitcherStats(
            1234567890,
            1234567890
        );

        const matchupHistory = this.statcastService.formatMatchupStats(matchupStats);

        console.log(JSON.stringify(matchupStats, null, 2));
        console.log(JSON.stringify(matchupHistory, null, 2));

        const prompt = `
            As a baseball commentator, set up this upcoming at-bat:
            
            Situation: ${context.gameContext.isTopInning ? 'Top' : 'Bottom'} of the ${context.gameContext.inning}${this.getInningOrdinal(context.gameContext.inning)},
            Score: ${context.gameContext.score.away}-${context.gameContext.score.home}
            ${context.matchup.pitcher} on the mound
            ${context.matchup.batter} stepping into the box
            ${context.gameContext.outs} out(s)

            Career Matchup History:
            ${matchupHistory}

            Please provide a brief, engaging preview of this matchup that:
            1. Highlights any notable context about the game situation
            2. References the specific history between these players
            3. Sets up the drama of the moment
            
            Keep the response concise and focused on building anticipation for the at-bat.
        `;

        return prompt;
    }
} 