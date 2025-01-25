export interface Player {
    id: string;
    fullName: string;
    primaryPosition: {
        code: string;
        name: string;
    };
    stats?: any; // We'll expand this based on the actual data we need
}

export interface GameContext {
    gameId: string;
    inning: number;
    isTopInning: boolean;
    outs: number;
    balls: number;
    strikes: number;
    pitcher: Player;
    batter: Player;
    runnersOn: {
        base: string;
        player: Player;
    }[];
}

export interface MatchupStats {
    atBats: number;
    hits: number;
    homeRuns: number;
    strikeouts: number;
    walks: number;
    avg: string;
    ops: string;
} 