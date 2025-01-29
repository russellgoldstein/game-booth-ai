import React, { useState, useEffect } from 'react';
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
import ChatMessageComponent from './ChatMessage';
import StatsVisualization from './StatsVisualization';
import GameSituation from './GameSituation';

interface GameContext {
    gameId: string;
    inning: number;
    isTopInning: boolean;
    count: {
        balls: number;
        strikes: number;
        outs: number;
    };
    pitcher: {
        id: string;
        fullName: string;
        stats: any;
    };
    batter: {
        id: string;
        fullName: string;
        stats: any;
    };
    runnersOn: Array<{
        base: string;
        player: {
            id: string;
            fullName: string;
        };
    }>;
    score: {
        away: number;
        home: number;
    };
}

interface Props {
    gameContext: GameContext | null;
}

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

export default function ChatInterface({ gameContext }: Props) {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [input, setInput] = useState('');
    const [language, setLanguage] = useState('en');

    // Add event listener for commentary messages
    useEffect(() => {
        const handleNewCommentary = (event: CustomEvent<ChatMessageType>) => {
            setMessages(prev => [...prev, event.detail]);
        };

        window.addEventListener('newCommentary', handleNewCommentary as EventListener);

        return () => {
            window.removeEventListener('newCommentary', handleNewCommentary as EventListener);
        };
    }, []);

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
                    gameContext // Pass the entire game context
                })
            });

            const data = await response.json();

            const aiMessage: ChatMessageType = {
                id: Date.now().toString(),
                text: data.response,
                sender: 'ai',
                gameContext: gameContext, // Use the current game context
                visualizations: data.visualizations
            };

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
                            isCommentary={message.isCommentary}
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
                        placeholder={gameContext ? "Ask about the game..." : "Select a game to start chatting..."}
                        size="small"
                        disabled={!gameContext}
                    />
                    <IconButton
                        onClick={handleSend}
                        color="primary"
                        disabled={!gameContext}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            </ChatContainer>
            <SidePanel>
                {gameContext && <GameSituation gameContext={gameContext} />}
            </SidePanel>
        </Container>
    );
} 