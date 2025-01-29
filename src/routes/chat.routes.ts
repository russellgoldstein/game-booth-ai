import { Router, Request, Response } from 'express';
import { VertexAIService } from '../services/vertexai.service';
import { MLBService } from '../services/mlb.service';
import { QuestionAnalyzer } from '../services/question-analyzer.service';
import { PromptService } from '../services/prompt.service';

const router = Router();
const vertexAI = new VertexAIService();
const mlbService = new MLBService();
const questionAnalyzer = new QuestionAnalyzer();
const promptService = new PromptService();

interface ChatRequest {
    message: string;
    language?: string;
    gameId?: string;
}

// Basic chat endpoint
router.post('/', async (req: Request<{}, {}, ChatRequest>, res: Response) => {
    try {
        const { message, language = 'en', gameId } = req.body;

        if (!gameId) {
            throw new Error('Game ID is required');
        }


        // First, analyze the question to determine what data we need
        const analysis = await questionAnalyzer.analyze(message);

        console.log('Analysis:', JSON.stringify(analysis, null, 2));

        // Get the game context
        const gameContext = await mlbService.getCurrentGameContext(gameId);

        console.log('Game Context:', JSON.stringify(gameContext, null, 2));
        // Gather only the required data based on the analysis
        const requiredData = await mlbService.getRequiredData(analysis, gameId, gameContext, gameContext.gameMetadata);
        console.log('Required Data:', JSON.stringify(requiredData, null, 2));
        // Generate the prompt with the targeted data
        const prompt = promptService.generateBaseballPrompt({
            message,
            analysis,
            ...requiredData,
            language
        });

        // Generate AI response using the crafted prompt
        const response = await vertexAI.generateResponse(prompt);

        res.json({
            response,
            gameContext: requiredData.gameContext
        });
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