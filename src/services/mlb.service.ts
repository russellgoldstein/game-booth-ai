import axios from 'axios';
import { Player, GameContext, MatchupStats, CurrentPlay, GameMetadata, Game } from '../types/mlb.types';
import { format } from 'date-fns';
import { QuestionAnalysis } from '../types/question-analyzer.types';

interface GameResponse {
    gamePk: string;
    gameDate: string;
    status: {
        abstractGameState: string;
        detailedState: string;
    };
    teams: {
        away: {
            team: {
                id: string;
                name: string;
            };
            score: number;
        };
        home: {
            team: {
                id: string;
                name: string;
            };
            score: number;
        };
    };
    venue: {
        id: string;
        name: string;
    };
    content: any;
    linescore: any;
}


export class MLBService {
    public baseUrl = 'https://statsapi.mlb.com/api/v1';

    public async getGamesForDate(date: string): Promise<GameResponse[]> {
        const response = await axios.get(`${this.baseUrl}/schedule`, {
            params: {
                sportId: 1,  // MLB
                date,
                hydrate: 'team,venue,game(content(summary,media(epg))),linescore'
            }
        });

        return response.data.dates?.[0]?.games?.map(this.formatGameResponse) || [];
    }

    private formatGameResponse(game: any): GameResponse {
        return {
            gamePk: game.gamePk,
            gameDate: game.gameDate,
            status: {
                abstractGameState: game.status.abstractGameState,
                detailedState: game.status.detailedState
            },
            teams: {
                away: {
                    team: {
                        id: game.teams.away.team.id,
                        name: game.teams.away.team.name
                    },
                    score: game.teams.away.score
                },
                home: {
                    team: {
                        id: game.teams.home.team.id,
                        name: game.teams.home.team.name
                    },
                    score: game.teams.home.score
                }
            },
            venue: {
                id: game.venue.id,
                name: game.venue.name
            },
            content: game.content,
            linescore: game.linescore
        };
    }

    async getTodaysGames(): Promise<GameResponse[]> {
        const today = format(new Date(), 'yyyy-MM-dd');
        let games = await this.getGamesForDate(today);

        // If no games today, fall back to October 30, 2024
        if (!games.length) {
            games = await this.getGamesForDate('2024-10-30');
        }

        return games;
    }

    async getLiveGameData(gameId: string) {
        try {
            const response = await axios.get(`https://statsapi.mlb.com/api/v1.1/game/${gameId}/feed/live`);
            return response.data;
        } catch (error) {
            console.error('Error fetching live game data:', error);
            throw error;
        }
    }

    async getPlayerStats(playerId: string, params: ReturnType<typeof this.getStatsParams>) {
        try {
            console.log('Getting player stats for:', playerId, JSON.stringify(params, null, 2));
            const response = await axios.get(
                `${this.baseUrl}/people/${playerId}/stats`,
                { params }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching player stats:', error);
            throw error;
        }
    }

    async getStatTypes() {
        try {
            const response = await axios.get(`${this.baseUrl}/statTypes`);
            return response.data;
        } catch (error) {
            console.error('Error fetching stat types:', error);
            throw error;
        }
    }

    async getMatchupStats(batterId: string, pitcherId: string) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/people/${batterId}/stats`,
                {
                    params: {
                        stats: 'statSplits',  // Changed from vsPlayer to statSplits
                        opposingPlayerId: pitcherId,
                        group: 'hitting',      // Changed from array to string
                        gameType: 'R'          // Changed from array to string
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching matchup stats:', error);
            throw error;
        }
    }

    async getCurrentGameContext(gameId: string): Promise<GameContext> {
        try {
            const gameData = await this.getLiveGameData(gameId);
            const liveData = gameData.liveData;
            const plays = liveData.plays;
            const currentPlay: CurrentPlay = plays.currentPlay;

            return {
                gameId,
                inning: currentPlay.about.inning,
                isTopInning: currentPlay.about.isTopInning,
                count: currentPlay.count,
                currentPlayResult: currentPlay.result,
                pitcher: await this.getPlayer(currentPlay.matchup.pitcher.id),
                batter: await this.getPlayer(currentPlay.matchup.batter.id),
                runnersOn: await this.getCurrentRunners(gameData),
                gameMetadata: gameData
            };
        } catch (error) {
            console.error('Error getting game context:', error);
            throw error;
        }
    }

    async getPlayer(playerId: number): Promise<Player> {
        try {
            const response = await axios.get(`${this.baseUrl}/people/${playerId}`);
            return response.data.people[0];
        } catch (error) {
            console.error('Error fetching player:', error);
            throw error;
        }
    }

    private async getCurrentRunners(gameData: any): Promise<{ base: string; player: Player; }[]> {
        const runners: { base: string; player: Player; }[] = [];
        const offense = gameData.liveData.linescore.offense;

        if (offense.first) {
            runners.push({ base: '1st', player: await this.getPlayer(offense.first.id) });
        }
        if (offense.second) {
            runners.push({ base: '2nd', player: await this.getPlayer(offense.second.id) });
        }
        if (offense.third) {
            runners.push({ base: '3rd', player: await this.getPlayer(offense.third.id) });
        }

        return runners;
    }

    async getSituationalStats(playerId: string, situation: string): Promise<any> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/people/${playerId}/stats?stats=statSplits&sportId=1&group=runnerPosition`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching situational stats:', error);
            throw error;
        }
    }

    async getRequiredData(analysis: QuestionAnalysis, gameId?: string, gameContext?: GameContext, gameMetadata?: GameMetadata) {
        const data: any = {};

        if (analysis.dataNeeded.gameContext && gameId) {
            data.gameContext = await this.getCurrentGameContext(gameId);
        }

        if (analysis.dataNeeded.batterStats && gameContext?.batter) {
            data.batterStats = await this.getPlayerStats(
                gameContext.batter.id,
                this.getStatsParams(analysis.timeframe, gameMetadata?.gameData.datetime.dateTime)
            );
        }

        if (analysis.dataNeeded.pitcherStats && gameContext?.pitcher) {
            data.pitcherStats = await this.getPlayerStats(
                gameContext.pitcher.id,
                this.getStatsParams(analysis.timeframe, gameMetadata?.gameData.datetime.dateTime)
            );
        }

        if (analysis.dataNeeded.matchupHistory &&
            gameContext?.batter &&
            gameContext?.pitcher) {
            data.matchupStats = await this.getMatchupStats(
                gameContext.batter.id,
                gameContext.pitcher.id
            );
        }

        if (analysis.dataNeeded.recentPerformance && gameContext?.pitcher) {
            data.recentPerformance = await this.getPlayerStats(
                gameContext.pitcher.id,
                this.getStatsParams(analysis.timeframe, gameMetadata?.gameData.datetime.dateTime)
            );
        }

        if (analysis.dataNeeded.recentPerformance && gameContext?.batter) {
            console.log('Getting recent performance for game Metadata:', gameMetadata);
            data.recentPerformance = await this.getPlayerStats(
                gameContext.batter.id,
                this.getStatsParams(analysis.timeframe, gameMetadata?.gameData.datetime.dateTime)
            );
        }

        console.log('Data:', JSON.stringify(data, null, 2));
        return data;
    }

    private getStatsParams(timeframe: QuestionAnalysis['timeframe'], gameDate?: string) {
        const gameDateObj = gameDate ? new Date(gameDate) : new Date();
        const params: {
            stats: string;
            group?: string;
            season?: number;
            gameType?: string;
            startDate?: string;
            endDate?: string;
        } = {
            stats: 'season',
        };

        switch (timeframe) {
            case 'season':
                params.stats = 'season';
                params.season = gameDateObj.getFullYear();
                break;

            case 'recent':
                params.stats = 'byDateRange';
                // Last 14 days
                if (gameDate) {
                    const startDate = new Date(gameDate);
                    startDate.setDate(startDate.getDate() - 14);
                    params.startDate = startDate.toISOString().split('T')[0];
                    params.endDate = gameDateObj.toISOString().split('T')[0];
                }
                console.log('Recent Stats Params:', JSON.stringify(params, null, 2));
                break;

            case 'historical':
                params.stats = 'career';
                break;

            case 'current':
                params.stats = 'byDateRange';
                // Last 3 days for "current" form
                const end = new Date();

                if (gameDate) {
                    const startDate = new Date(gameDate);
                    startDate.setDate(startDate.getDate() - 3);
                    params.startDate = startDate.toISOString().split('T')[0];
                    params.endDate = gameDateObj.toISOString().split('T')[0];
                }
                break;
        }

        return params;
    }

    async getAtBat(gameId: string, atBatNumber: number): Promise<any> {
        try {
            const response = await axios.get(
                `${this.baseUrl}/game/${gameId}/playByPlay`,
            );
            console.log('At-bat:', JSON.stringify(response.data, null, 2));

            const { allPlays } = response.data;

            // Ensure atBatNumber is within bounds
            if (atBatNumber >= allPlays.length) {
                throw new Error('At-bat number exceeds game length');
            }

            // Get the specific at-bat
            const atBat = allPlays[atBatNumber];

            // Transform the at-bat data into a consistent format
            return {
                result: {
                    type: atBat.result.type,
                    event: atBat.result.event,
                    eventType: atBat.result.eventType,
                    description: atBat.result.description,
                    rbi: atBat.result.rbi,
                    awayScore: atBat.result.awayScore,
                    homeScore: atBat.result.homeScore,
                    isOut: atBat.result.isOut
                },
                about: {
                    atBatIndex: atBat.about.atBatIndex,
                    halfInning: atBat.about.halfInning,
                    isTopInning: atBat.about.isTopInning,
                    inning: atBat.about.inning,
                    startTime: atBat.about.startTime,
                    endTime: atBat.about.endTime,
                    isComplete: atBat.about.isComplete,
                    isScoringPlay: atBat.about.isScoringPlay,
                    hasOut: atBat.about.hasOut,
                    captivatingIndex: atBat.about.captivatingIndex
                },
                count: {
                    balls: atBat.count.balls,
                    strikes: atBat.count.strikes,
                    outs: atBat.count.outs
                },
                matchup: {
                    batter: {
                        id: atBat.matchup.batter.id,
                        fullName: atBat.matchup.batter.fullName,
                        link: atBat.matchup.batter.link
                    },
                    pitcher: {
                        id: atBat.matchup.pitcher.id,
                        fullName: atBat.matchup.pitcher.fullName,
                        link: atBat.matchup.pitcher.link
                    },
                    batSide: atBat.matchup.batSide,
                    pitchHand: atBat.matchup.pitchHand,
                    splits: atBat.matchup.splits
                },
                pitchIndex: atBat.pitchIndex,
                actionIndex: atBat.actionIndex,
                runnerIndex: atBat.runnerIndex,
                runners: atBat.runners.map((runner: any) => ({
                    movement: {
                        originBase: runner.movement.originBase,
                        start: runner.movement.start,
                        end: runner.movement.end,
                        outBase: runner.movement.outBase,
                        isOut: runner.movement.isOut
                    },
                    details: {
                        event: runner.details.event,
                        eventType: runner.details.eventType,
                        movementReason: runner.details.movementReason,
                        runner: {
                            id: runner.details.runner.id,
                            fullName: runner.details.runner.fullName,
                            link: runner.details.runner.link
                        },
                        responsiblePitcher: runner.details.responsiblePitcher,
                        isScoringEvent: runner.details.isScoringEvent,
                        rbi: runner.details.rbi,
                        earned: runner.details.earned,
                        teamUnearned: runner.details.teamUnearned,
                        playIndex: runner.details.playIndex
                    },
                    credits: runner.credits
                })),
                playEvents: atBat.playEvents,
                playEndTime: atBat.playEndTime,
                atBatIndex: atBat.atBatIndex
            };

        } catch (error) {
            console.error('Error fetching at-bat:', error);
            throw error;
        }
    }
} 