export interface GameContext {
    gameId: string;
    inning: number;
    isTopInning: boolean;
    outs: number;
    balls: number;
    strikes: number;
    pitcher: Player;
    batter: Player;
    runnersOn: RunnerOnBase[];
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