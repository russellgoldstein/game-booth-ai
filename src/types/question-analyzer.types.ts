export type QuestionType =
    | 'performance'  // How is X performing?
    | 'matchup'      // How does X do against Y?
    | 'situation'    // What's the current situation?
    | 'prediction'   // What's likely to happen?
    | 'strategy'     // What should they do?
    | 'comparison'   // How do X and Y compare?
    | 'trend'        // How has X been doing lately?
    | 'general';     // Default/fallback type

export type QuestionFocus =
    | 'batter'   // Focus on the batter
    | 'pitcher'  // Focus on the pitcher
    | 'both'     // Focus on both batter and pitcher
    | 'game'     // Focus on the game situation
    | 'team';    // Focus on team performance

export type QuestionTimeframe =
    | 'current'    // Right now/today
    | 'season'     // This season
    | 'recent'     // Last few games/weeks
    | 'historical'; // Career/all-time

export interface DataNeeded {
    gameContext: boolean;      // Current game situation
    batterStats: boolean;      // Batter statistics
    pitcherStats: boolean;     // Pitcher statistics
    matchupHistory: boolean;   // Head-to-head history
    recentPerformance: boolean; // Recent performance trends
    pitchData: boolean;        // Detailed pitch information
}

export interface QuestionAnalysis {
    type: QuestionType;
    focus: QuestionFocus;
    timeframe: QuestionTimeframe;
    dataNeeded: DataNeeded;
}

// Optional: Helper type for keyword mappings
export interface KeywordMappings {
    TYPE_KEYWORDS: Record<Exclude<QuestionType, 'general'>, string[]>;
    FOCUS_KEYWORDS: Record<QuestionFocus, string[]>;
    TIMEFRAME_KEYWORDS: Record<QuestionTimeframe, string[]>;
} 