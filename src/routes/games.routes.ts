import { Router } from 'express';
import { MLBService } from '../services/mlb.service';
import { PromptService } from '../services/prompt.service';
import { VertexAIService } from '../services/vertexai.service';


const router = Router();
const mlbService = new MLBService();
const promptService = new PromptService();
const vertexAI = new VertexAIService();
// Existing route for today's games
router.get('/today', async (req, res) => {
    try {
        const games = await mlbService.getTodaysGames();
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch today\'s games' });
    }
});

// New route for date-specific games
router.get('/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const games = await mlbService.getGamesForDate(date);
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch games for specified date' });
    }
});

router.post('/:gameId/restart', async (req, res) => {
    try {
        const { gameId } = req.params;
        // Reset the game state in your database/cache
        // This will depend on how you're storing game state
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to restart game' });
    }
});

router.get('/:gameId/atbat/:atBatNumber', async (req, res) => {
    try {
        const { gameId, atBatNumber } = req.params;

        // Fetch the at-bat data
        const atBat = await mlbService.getAtBat(gameId, parseInt(atBatNumber));

        // Generate AI commentary
        const commentaryPrompt = await promptService.generateAtBatCommentary({
            result: atBat.result,
            matchup: {
                batter: atBat.matchup.batter.fullName,
                pitcher: atBat.matchup.pitcher.fullName
            },
            count: atBat.count,
            pitches: atBat.playEvents.filter((event: any) => event.isPitch).map((pitch: any) => ({
                type: pitch.details.type,
                speed: pitch.pitchData.startSpeed,
                location: pitch.pitchData.zone,
                result: pitch.details.description
            })),
            runners: atBat.runners,
            gameContext: {
                inning: atBat.about.inning,
                isTopInning: atBat.about.isTopInning,
                outs: atBat.count.outs,
                score: {
                    away: atBat.result.awayScore,
                    home: atBat.result.homeScore
                }
            }
        });

        // Get the AI response
        const aiResponse = await vertexAI.generateResponse(commentaryPrompt);

        // Structure the commentary
        const commentary = {
            summary: aiResponse.split('\n\n')[0] || '',
            analysis: aiResponse.split('\n\n')[1] || '',
            keyMoment: atBat.about.isScoringPlay || false,
            significance: aiResponse.split('\n\n')[2] || ''
        };

        // Return both the at-bat data and the structured commentary
        res.json({
            atBat,
            commentary: {
                ...commentary,
                text: `${commentary.summary}\n\n${commentary.analysis}${commentary.keyMoment ? `\n\nKey Moment: ${commentary.significance}` : ''
                    }`
            }
        });

    } catch (error) {
        console.error('Error fetching at-bat:', error);
        res.status(500).json({ error: 'Failed to fetch at-bat data and commentary' });
    }
});

export default router; 