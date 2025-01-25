import { Router, Request, Response } from 'express';
import { VertexAIService } from '../services/vertexai.service';
import { MLBService } from '../services/mlb.service';
import { GameContext } from '../types/mlb.types';
import { format } from 'date-fns';
import axios from 'axios';

const router = Router();
const vertexAI = new VertexAIService();
const mlbService = new MLBService();

interface ChatRequest {
    message: string;
    language?: string;
    gameId?: string;
}

// Basic chat endpoint
router.post('/', async (req: Request<{}, {}, ChatRequest>, res: Response) => {
    try {
        const { message, language = 'en', gameId } = req.body;

        // Gather all context
        let gameContext, playerStats, matchupStats;

        if (gameId) {
            gameContext = await mlbService.getCurrentGameContext(gameId);

            if (gameContext.pitcher && gameContext.batter) {
                matchupStats = await mlbService.getMatchupStats(
                    gameContext.batter.id,
                    gameContext.pitcher.id
                );

                // Get individual player stats
                const [batterStats, pitcherStats] = await Promise.all([
                    mlbService.getPlayerStats(gameContext.batter.id),
                    mlbService.getPlayerStats(gameContext.pitcher.id)
                ]);

                playerStats = {
                    batter: batterStats,
                    pitcher: pitcherStats
                };
            }
        }

        console.log(JSON.stringify(gameContext, null, 2));
        console.log(JSON.stringify(playerStats, null, 2));
        console.log(JSON.stringify(matchupStats, null, 2));
        // Generate AI response with all context
        const response = await vertexAI.generateResponse({
            message,
            gameContext,
            playerStats,
            matchupStats,
            language
        });

        res.json({ response, gameContext });
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'Chat service is healthy' });
});

// Add this endpoint to your existing chat.routes.ts
router.get('/games/:gameId/context', async (req: Request, res: Response) => {
    try {
        const { gameId } = req.params;
        const gameContext = await mlbService.getCurrentGameContext(gameId);
        res.json(gameContext);
    } catch (error) {
        console.error('Error fetching game context:', error);
        res.status(500).json({ error: 'Failed to fetch game context' });
    }
});

// Add this route handler
router.get('/games/today', async (req: Request, res: Response) => {
    try {
        const games = await mlbService.getTodaysGames();
        res.json(games);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

export default router; 