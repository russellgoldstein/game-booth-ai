import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';
import { PromptService } from './prompt.service';
import { QuestionAnalysis } from 'src/types/question-analyzer.types';

// Load environment variables
dotenv.config();

export class VertexAIService {
    private vertexAI: VertexAI;
    private model: string = 'gemini-pro';
    private promptService: PromptService;

    constructor() {
        const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
        if (!projectId) {
            throw new Error('GOOGLE_CLOUD_PROJECT_ID environment variable is not set');
        }

        this.vertexAI = new VertexAI({
            project: projectId,
            location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
        });

        this.promptService = new PromptService();
    }

    async generateResponse(prompt: string): Promise<string> {
        try {
            const generativeModel = this.vertexAI.preview.getGenerativeModel({
                model: this.model,
            });

            const request = {
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: prompt }],
                    },
                ],
                generation_config: {
                    temperature: 0.7,
                    top_p: 0.8,
                    top_k: 40,
                },
            };

            const response = await generativeModel.generateContent(request);
            const fullResponse = await response.response;
            if (!fullResponse || !fullResponse.candidates || !fullResponse.candidates[0] || !fullResponse.candidates[0].content || !fullResponse.candidates[0].content.parts || !fullResponse.candidates[0].content.parts[0] || !fullResponse.candidates[0].content.parts[0].text) {
                throw new Error('Invalid response structure');
            }
            return fullResponse.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Error generating response:', error);
            throw error;
        }
    }
}