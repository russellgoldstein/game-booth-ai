import React from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Paper,
    Typography,
    Divider
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { ChatMessage as ChatMessageType } from '../types/chat.types';
import StatsVisualization from './StatsVisualization';

const MessageContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isAi' && prop !== 'isCommentary'
})<{ isAi: boolean; isCommentary?: boolean }>(({ theme, isAi, isCommentary }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    justifyContent: isAi ? 'flex-start' : 'flex-end',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: isCommentary
        ? theme.palette.info.light
        : isAi ? theme.palette.grey[100] : theme.palette.primary.light,
    '.MuiPaper-root': {
        backgroundColor: isAi ? theme.palette.grey[100] : theme.palette.primary.light,
        color: isAi ? theme.palette.text.primary : theme.palette.primary.contrastText,
    },
    maxWidth: '80%',
    alignSelf: 'flex-start',
}));

const MessageContent = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    maxWidth: '70%',
    borderRadius: theme.spacing(2),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.grey[200],
}));

const VisualizationContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    '& > *': {
        marginBottom: theme.spacing(2),
    }
}));

interface Props {
    message: ChatMessageType;
    isCommentary?: boolean;
}

export default function ChatMessage({ message, isCommentary }: Props) {
    const { text, sender, gameContext, visualizations } = message;
    const isAi = sender === 'ai';

    // Split message into paragraphs
    const paragraphs = text.split('\n').filter(p => p.trim());

    return (
        <MessageContainer isAi={isAi} isCommentary={isCommentary}>
            {isAi && (
                <IconWrapper>
                    <SmartToyIcon color="primary" />
                </IconWrapper>
            )}
            <MessageContent>
                {paragraphs.map((paragraph, index) => (
                    <Typography
                        key={index}
                        variant="body1"
                        gutterBottom={index < paragraphs.length - 1}
                    >
                        {paragraph}
                    </Typography>
                ))}

                {gameContext && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" gutterBottom>
                            Game Context:
                        </Typography>
                        <Typography variant="body2">
                            {`${gameContext.isTopInning ? 'Top' : 'Bottom'} ${gameContext.inning}, 
                            ${gameContext.outs} out(s), 
                            Count: ${gameContext.balls}-${gameContext.strikes}`}
                        </Typography>
                    </>
                )}

                {visualizations && visualizations.length > 0 && (
                    <VisualizationContainer>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" gutterBottom>
                            Statistics & Visualizations:
                        </Typography>
                        {visualizations.map((viz, index) => (
                            <StatsVisualization
                                key={index}
                                data={viz.data}
                                type={viz.type}
                            />
                        ))}
                    </VisualizationContainer>
                )}
            </MessageContent>
            {!isAi && (
                <IconWrapper>
                    <PersonIcon />
                </IconWrapper>
            )}
        </MessageContainer>
    );
} 