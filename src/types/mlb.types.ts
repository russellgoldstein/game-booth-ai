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
    count: Count;
    pitcher: Player;
    batter: Player;
    gameMetadata: GameMetadata;
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


export interface GameMetadata {
    copyright: string;
    gamePk: number;
    link: string;
    metaData: {
        wait: number;
        timeStamp: string;
        gameEvents: string[];
        logicalEvents: string[];
    };
    gameData: {
        game: {
            pk: number;
            type: string;
            doubleHeader: 'N' | 'Y';
            id: string;
            gamedayType: string;
            tiebreaker: 'N' | 'Y';
            gameNumber: number;
            calendarEventID: string;
            season: string;
            seasonDisplay: string;
        };
        datetime: {
            dateTime: string;
            originalDate: string;
            officialDate: string;
            dayNight: 'day' | 'night';
            time: string;
            ampm: 'AM' | 'PM';
        };
        status: {
            abstractGameState: 'Live' | 'Final' | 'Preview' | 'Postponed' | 'Suspended';
            codedGameState: string;
            detailedState: string;
            statusCode: string;
            startTimeTBD: boolean;
            abstractGameCode: string;
        };
        teams: {
            away: Record<string, any>; // We can expand this if needed
            home: Record<string, any>;
        };
        players: Record<string, any>; // Map of player IDs to player data
        venue: {
            id: number;
            name: string;
            link: string;
            location: Record<string, any>;
            timeZone: Record<string, any>;
            fieldInfo: Record<string, any>;
            active: boolean;
            season: string;
        };
        officialVenue: {
            id: number;
            link: string;
        };
        weather: {
            condition: string;
            temp: string;
            wind: string;
        };
        gameInfo: {
            attendance: number;
            firstPitch: string;
            gameDurationMinutes: number;
        };
        review: {
            hasChallenges: boolean;
            away: Record<string, any>;
            home: Record<string, any>;
        };
        flags: {
            noHitter: boolean;
            perfectGame: boolean;
            awayTeamNoHitter: boolean;
            awayTeamPerfectGame: boolean;
            homeTeamNoHitter: boolean;
            homeTeamPerfectGame: boolean;
        };
        alerts: any[];
        probablePitchers: {
            away: Record<string, any>;
            home: Record<string, any>;
        };
        officialScorer: {
            id: number;
            fullName: string;
            link: string;
        };
        primaryDatacaster: {
            id: number;
            fullName: string;
            link: string;
        };
        moundVisits: {
            away: Record<string, any>;
            home: Record<string, any>;
        };
    };
    liveData: {
        plays: {
            allPlays: any[];
            currentPlay: Record<string, any>;
            scoringPlays: any[];
            playsByInning: any[];
        };
        linescore: {
            currentInning: number;
            currentInningOrdinal: string;
            inningState: string;
            inningHalf: string;
            isTopInning: boolean;
            scheduledInnings: number;
            innings: any[];
            teams: Record<string, any>;
            defense: Record<string, any>;
            offense: Record<string, any>;
            balls: number;
            strikes: number;
            outs: number;
        };
        boxscore: {
            teams: Record<string, any>;
            officials: any[];
            info: any[];
            pitchingNotes: any[];
            topPerformers: any[];
        };
        decisions: {
            winner: Record<string, any>;
            loser: Record<string, any>;
            save: Record<string, any>;
        };
        leaders: {
            hitDistance: Record<string, any>;
            hitSpeed: Record<string, any>;
            pitchSpeed: Record<string, any>;
        };
    };
}

export interface Game {
    gamePk: number;
    gameDate: string;
    status: {
        abstractGameState: 'Live' | 'Final' | 'Preview' | 'Postponed' | 'Suspended';
        detailedState: string;
    };
    teams: {
        away: {
            team: {
                id: number;
                name: string;
            };
            score: number;
        };
        home: {
            team: {
                id: number;
                name: string;
            };
            score: number;
        };
    };
    venue: {
        id: number;
        name: string;
    };
}