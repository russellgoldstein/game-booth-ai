import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    Select,
    MenuItem
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { ChatMessage as ChatMessageType } from '../types/chat.types';
import GameContext from './GameContext';
import ChatMessageComponent from './ChatMessage';
import StatsVisualization from './StatsVisualization';
import mlbService from '../services/mlb.service';

const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    height: '100vh',
    padding: theme.spacing(2),
    gap: theme.spacing(2)
}));

const ChatContainer = styled(Paper)(({ theme }) => ({
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    height: '100%'
}));

const SidePanel = styled(Paper)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2)
}));

export default function ChatInterface() {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [input, setInput] = useState('');
    const [language, setLanguage] = useState('en');
    const [gameId, setGameId] = useState<string | null>(null);

    const fetchVisualizations = async (gameContext: any) => {
        try {
            const [pitchData, tendencies, matchupData] = await Promise.all([
                mlbService.getPitchData(gameContext.gameId, gameContext.pitcher.id),
                mlbService.getPitchingTendencies(gameContext.pitcher.id),
                mlbService.getMatchupVisualizations(
                    gameContext.batter.id,
                    gameContext.pitcher.id
                )
            ]);

            return [
                {
                    type: 'pitchLocation',
                    data: pitchData
                },
                {
                    type: 'heatmap',
                    data: tendencies
                },
                // Add additional visualizations from matchupData
            ];
        } catch (error) {
            console.error('Error fetching visualizations:', error);
            return [];
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessageType = {
            id: Date.now().toString(),
            text: input,
            sender: 'user'
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            const response = await fetch('http://localhost:3030/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: input,
                    language,
                    gameId
                })
            });

            const data = await response.json();

            const aiMessage: ChatMessageType = {
                id: Date.now().toString(),
                text: data.response,
                sender: 'ai',
                gameContext: data.gameContext,
                visualizations: data.visualizations
            };

            if (data.gameContext) {
                const visualizations = await fetchVisualizations(data.gameContext);
                aiMessage.visualizations = visualizations;
            }

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <Container>
            <ChatContainer>
                <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
                    {messages.map(message => (
                        <ChatMessageComponent
                            key={message.id}
                            message={message}
                        />
                    ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        size="small"
                        sx={{ width: 100 }}
                    >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Español</MenuItem>
                        <MenuItem value="ja">日本語</MenuItem>
                    </Select>
                    <TextField
                        fullWidth
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about the game..."
                        size="small"
                    />
                    <IconButton onClick={handleSend} color="primary">
                        <SendIcon />
                    </IconButton>
                </Box>
            </ChatContainer>
            <SidePanel>
                <GameContext gameId={gameId} onGameSelect={setGameId} />
                <StatsVisualization />
            </SidePanel>
        </Container>
    );
} 