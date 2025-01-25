import axios from 'axios';
import { Player, GameContext, MatchupStats } from '../types/mlb.types';
import { format } from 'date-fns';

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

    private async getGamesForDate(date: string): Promise<GameResponse[]> {
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

    async getPlayerStats(playerId: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/people/${playerId}/stats?stats=season`);
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
            console.log(response.data);
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
            const currentPlay = plays.currentPlay;

            return {
                gameId,
                inning: currentPlay.about.inning,
                isTopInning: currentPlay.about.isTopInning,
                outs: currentPlay.count.outs,
                balls: currentPlay.count.balls,
                strikes: currentPlay.count.strikes,
                pitcher: await this.getPlayer(currentPlay.matchup.pitcher.id),
                batter: await this.getPlayer(currentPlay.matchup.batter.id),
                runnersOn: await this.getCurrentRunners(gameData)
            };
        } catch (error) {
            console.error('Error getting game context:', error);
            throw error;
        }
    }

    async getPlayer(playerId: string): Promise<Player> {
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
} 