export interface QuestionAnalysis {
    type: 'performance' | 'matchup' | 'situation' | 'prediction' | 'strategy' | 'comparison' | 'trend' | 'general';
    focus: 'batter' | 'pitcher' | 'both' | 'game' | 'team';
    timeframe: 'current' | 'season' | 'recent' | 'historical';
    dataNeeded: {
        gameContext: boolean;
        batterStats: boolean;
        pitcherStats: boolean;
        matchupHistory: boolean;
        recentPerformance: boolean;
        pitchData: boolean;
    };
}

export class QuestionAnalyzer {
    private readonly TYPE_KEYWORDS = {
        performance: ['how has', 'how is', 'stats', 'statistics', 'numbers', 'performing'],
        matchup: ['matchup', 'against', 'face', 'versus', 'vs'],
        situation: ['situation', 'count', 'inning', 'score', 'runners', 'bases'],
        prediction: ['will', 'predict', 'likely', 'chance', 'probability', 'expect'],
        strategy: ['should', 'approach', 'plan', 'strategy', 'handle', 'pitch to'],
        comparison: ['compare', 'better', 'worse', 'difference', 'between'],
        trend: ['trend', 'lately', 'recent', 'last few', 'been doing', 'streak']
    };

    private readonly FOCUS_KEYWORDS = {
        batter: ['batter', 'hitting', 'hitter', 'bat', 'offense', 'swing'],
        pitcher: ['pitcher', 'throwing', 'pitch', 'pitching', 'throw', 'delivery'],
        team: ['team', 'club', 'lineup', 'roster'],
        game: ['game', 'match', 'score', 'situation', 'inning']
    };

    private readonly TIMEFRAME_KEYWORDS = {
        current: ['now', 'current', 'this', 'moment'],
        season: ['season', 'year', 'overall'],
        recent: ['recent', 'lately', 'last few', 'past week', 'trending'],
        historical: ['career', 'history', 'historically', 'lifetime', 'ever']
    };

    analyze(question: string): QuestionAnalysis {
        const lowerQuestion = question.toLowerCase();

        // Initialize default analysis
        const analysis: QuestionAnalysis = {
            type: 'general',
            focus: 'game',
            timeframe: 'current',
            dataNeeded: {
                gameContext: false,
                batterStats: false,
                pitcherStats: false,
                matchupHistory: false,
                recentPerformance: false,
                pitchData: false
            }
        };

        // Determine question type
        analysis.type = this.determineType(lowerQuestion);

        // Determine focus
        analysis.focus = this.determineFocus(lowerQuestion);

        // Determine timeframe
        analysis.timeframe = this.determineTimeframe(lowerQuestion);

        // Determine required data based on type, focus, and timeframe
        analysis.dataNeeded = this.determineRequiredData(analysis);

        return analysis;
    }

    private determineType(question: string): QuestionAnalysis['type'] {
        for (const [type, keywords] of Object.entries(this.TYPE_KEYWORDS)) {
            if (keywords.some(keyword => question.includes(keyword))) {
                return type as QuestionAnalysis['type'];
            }
        }
        return 'general';
    }

    private determineFocus(question: string): QuestionAnalysis['focus'] {
        for (const [focus, keywords] of Object.entries(this.FOCUS_KEYWORDS)) {
            if (keywords.some(keyword => question.includes(keyword))) {
                return focus as QuestionAnalysis['focus'];
            }
        }

        // If multiple focuses are detected, set to 'both' for batter/pitcher
        if (this.FOCUS_KEYWORDS.batter.some(k => question.includes(k)) &&
            this.FOCUS_KEYWORDS.pitcher.some(k => question.includes(k))) {
            return 'both';
        }

        return 'game';
    }

    private determineTimeframe(question: string): QuestionAnalysis['timeframe'] {
        for (const [timeframe, keywords] of Object.entries(this.TIMEFRAME_KEYWORDS)) {
            if (keywords.some(keyword => question.includes(keyword))) {
                return timeframe as QuestionAnalysis['timeframe'];
            }
        }
        return 'current';
    }

    private determineRequiredData(analysis: QuestionAnalysis): QuestionAnalysis['dataNeeded'] {
        const dataNeeded = {
            gameContext: false,
            batterStats: false,
            pitcherStats: false,
            matchupHistory: false,
            recentPerformance: false,
            pitchData: false
        };

        // Game context is needed for most questions
        dataNeeded.gameContext = ['situation', 'prediction', 'strategy'].includes(analysis.type);

        // Determine other data needs based on type and focus
        switch (analysis.type) {
            case 'performance':
                dataNeeded.batterStats = ['batter', 'both'].includes(analysis.focus);
                dataNeeded.pitcherStats = ['pitcher', 'both'].includes(analysis.focus);
                dataNeeded.recentPerformance = analysis.timeframe === 'recent';
                break;

            case 'matchup':
                dataNeeded.batterStats = true;
                dataNeeded.pitcherStats = true;
                dataNeeded.matchupHistory = true;
                break;

            case 'situation':
                dataNeeded.gameContext = true;
                dataNeeded.pitchData = true;
                break;

            case 'prediction':
            case 'strategy':
                dataNeeded.gameContext = true;
                dataNeeded.batterStats = true;
                dataNeeded.pitcherStats = true;
                dataNeeded.matchupHistory = true;
                dataNeeded.recentPerformance = true;
                break;

            case 'trend':
                dataNeeded.recentPerformance = true;
                dataNeeded.batterStats = ['batter', 'both'].includes(analysis.focus);
                dataNeeded.pitcherStats = ['pitcher', 'both'].includes(analysis.focus);
                break;
        }

        return dataNeeded;
    }
} 