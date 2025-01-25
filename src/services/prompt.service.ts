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

export class PromptService {
    private static readonly LANGUAGES = {
        en: 'English',
        es: 'Spanish',
        ja: 'Japanese'
    };

    generateBaseballPrompt(context: {
        message: string,
        gameContext?: any,
        playerStats?: any,
        matchupStats?: any,
        language?: keyof typeof PromptService.LANGUAGES
    }) {
        const lang = context.language || 'en';

        // Build context sections
        const gameSection = this.buildGameContext(context.gameContext, lang);
        const statsSection = this.buildStatsContext(context.playerStats, context.matchupStats, lang);

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

    private buildGameContext(gameContext: any, language: string): string {
        if (!gameContext) return '';

        const inningPhrase = language === 'es' ?
            `${gameContext.isTopInning ? 'Parte alta' : 'Parte baja'} del ${gameContext.inning}° inning` :
            language === 'ja' ?
                `${gameContext.inning}回${gameContext.isTopInning ? '表' : '裏'}` :
                `${gameContext.isTopInning ? 'Top' : 'Bottom'} of the ${gameContext.inning}th inning`;

        return `
Game Situation:
- ${inningPhrase}
- Count: ${gameContext.balls}-${gameContext.strikes}
- Outs: ${gameContext.outs}
- Pitcher: ${gameContext.pitcher?.fullName}
- Batter: ${gameContext.batter?.fullName}
- Runners: ${this.formatRunners(gameContext.runnersOn)}
`;
    }

    private buildStatsContext(playerStats: any, matchupStats: any, language: string): string {
        if (!playerStats && !matchupStats) return '';

        return `
Statistical Context:
${matchupStats ? `
Head-to-Head Statistics:
${this.formatMatchupStats(matchupStats)}` : ''}

${playerStats ? `
Season Statistics:
${this.formatPlayerStats(playerStats)}` : ''}
`;
    }

    private formatRunners(runners: Array<{ base: string, player: any }> = []): string {
        if (runners.length === 0) return 'Bases empty';
        return runners
            .map(r => `${r.player.fullName} on ${r.base}`)
            .join(', ');
    }

    private formatMatchupStats(stats: any): string {
        // Format based on actual MLB API response structure
        return Object.entries(stats)
            .map(([key, value]) => `- ${key}: ${value}`)
            .join('\n');
    }

    private formatPlayerStats(stats: PlayerStats): string {
        let formattedStats = '';

        // Format batter stats if available
        if (stats.batter?.stats[0]?.splits[0]) {
            const batterData = stats.batter.stats[0].splits[0];
            const batterStats = batterData.stat;
            formattedStats += `BATTER: ${batterData.player.fullName} (${batterData.team.name})\n`;
            formattedStats += `Season Stats:\n`;
            formattedStats += `- AVG/OBP/SLG: ${batterStats.avg}/${batterStats.obp}/${batterStats.slg}\n`;
            formattedStats += `- HR: ${batterStats.homeRuns}, RBI: ${batterStats.rbi}, Runs: ${batterStats.runs}\n`;
            formattedStats += `- Hits: ${batterStats.hits}, 2B: ${batterStats.doubles}, 3B: ${batterStats.triples}\n`;
            formattedStats += `- BB: ${batterStats.baseOnBalls}, SO: ${batterStats.strikeOuts}\n`;
            formattedStats += `- Games: ${batterStats.gamesPlayed}, PA: ${batterStats.plateAppearances}\n\n`;
        }

        // Format pitcher stats if available
        if (stats.pitcher?.stats[0]?.splits[0]) {
            const pitcherData = stats.pitcher.stats[0].splits[0];
            const pitcherStats = pitcherData.stat;
            formattedStats += `PITCHER: ${pitcherData.player.fullName} (${pitcherData.team.name})\n`;
            formattedStats += `Season Stats:\n`;
            formattedStats += `- ERA: ${pitcherStats.era}, WHIP: ${pitcherStats.whip}\n`;
            formattedStats += `- Record: ${pitcherStats.wins}-${pitcherStats.losses}, IP: ${pitcherStats.inningsPitched}\n`;
            formattedStats += `- SO/9: ${pitcherStats.strikeoutsPer9Inn}, BB/9: ${pitcherStats.walksPer9Inn}\n`;
            formattedStats += `- Hits: ${pitcherStats.hits}, HR: ${pitcherStats.homeRuns}\n`;
            formattedStats += `- SO/BB: ${pitcherStats.strikeoutWalkRatio}, Strike%: ${(parseFloat(pitcherStats.strikePercentage) * 100).toFixed(1)}%\n`;
        }

        return formattedStats || 'No stats available';
    }
} 