
export interface GameContext {
    gameId: string;
    inning: number;
    isTopInning: boolean;
    count: Count;
    pitcher: Player;
    batter: Player;
    currentPlayResult: CurrentPlayResult;
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

export interface Count {
    balls: number;
    strikes: number;
    outs: number;
}

export interface CurrentPlayResult {
    type: string;
    event: string;
    eventType: string;
    description: string;
    rbi: number;
    awayScore: number;
    homeScore: number;
    isOut: boolean;
}

export interface CurrentPlay {
    result: CurrentPlayResult;
    about: {
        atBatIndex: number;
        halfInning: 'top' | 'bottom';
        isTopInning: boolean;
        inning: number;
        startTime: string;
        endTime: string;
        isComplete: boolean;
        isScoringPlay: boolean;
        hasReview: boolean;
        hasOut: boolean;
        captivatingIndex: number;
    };
    count: Count;
    matchup: {
        batter: {
            id: number;
            fullName: string;
            link: string;
        };
        batSide: {
            code: string;
            description: string;
        };
        pitcher: {
            id: number;
            fullName: string;
            link: string;
        };
        pitchHand: {
            code: string;
            description: string;
        };
        splits: {
            batter: string;
            pitcher: string;
            menOnBase: string;
        };
    };
    pitchIndex: number[];
    actionIndex: number[];
    runnerIndex: number[];
    runners: Array<{
        movement: {
            originBase: string | null;
            start: string | null;
            end: string | null;
            outBase: string | null;
            isOut: boolean;
            outNumber: number;
        };
        details: {
            event: string;
            eventType: string;
            movementReason: string | null;
            runner: {
                id: number;
                fullName: string;
                link: string;
            };
            responsiblePitcher: null;
            isScoringEvent: boolean;
            rbi: boolean;
            earned: boolean;
            teamUnearned: boolean;
            playIndex: number;
        };
        credits?: Array<{
            player: {
                id: number;
                link: string;
            };
            position: {
                code: string;
                name: string;
                type: string;
                abbreviation: string;
            };
            credit: string;
        }>;
    }>;
    playEvents: Array<{
        details: {
            call?: {
                code: string;
                description: string;
            };
            description: string;
            code: string;
            ballColor: string;
            trailColor: string;
            isInPlay: boolean;
            isStrike: boolean;
            isBall: boolean;
            type: {
                code: string;
                description: string;
            };
            isOut: boolean;
            hasReview: boolean;
        };
        count: {
            balls: number;
            strikes: number;
            outs: number;
        };
        pitchData: {
            startSpeed: number;
            endSpeed: number;
            strikeZoneTop: number;
            strikeZoneBottom: number;
            coordinates: {
                aY: number;
                aZ: number;
                pfxX: number;
                pfxZ: number;
                pX: number;
                pZ: number;
                vX0: number;
                vY0: number;
                vZ0: number;
                x: number;
                y: number;
                x0: number;
                y0: number;
                z0: number;
                aX: number;
            };
            breaks: {
                breakAngle: number;
                breakLength: number;
                breakY: number;
                breakVertical: number;
                breakVerticalInduced: number;
                breakHorizontal: number;
                spinRate: number;
                spinDirection: number;
            };
            zone: number;
            typeConfidence: number;
            plateTime: number;
            extension: number;
        };
        index: number;
        playId: string;
        pitchNumber: number;
        startTime: string;
        endTime: string;
        isPitch: boolean;
        type: string;
    }>;
    playEndTime: string;
    atBatIndex: number;
}



export interface Player {
    id: string;
    fullName: string;
    primaryPosition: {
        code: string;
        name: string;
    };
}

export interface RunnerOnBase {
    base: string;
    player: Player;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    gameContext?: GameContext;
    visualizations?: {
        type: 'chart' | 'heatmap' | 'pitchLocation';
        data: any;
    }[];
} 