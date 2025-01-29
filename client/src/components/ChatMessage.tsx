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
    shouldForwardProp: (prop) => !['isAi', 'isCommentary', 'isPreview'].includes(prop as string)
})<{ isAi: boolean; isCommentary?: boolean; isPreview?: boolean }>(({ theme, isAi, isCommentary, isPreview }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    justifyContent: isAi ? 'flex-start' : 'flex-end',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: isPreview
        ? theme.palette.warning.light
        : isCommentary
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
    commentary: string;
}

export default function ChatMessage({ message }: Props) {
    const { sender, text, gameContext, isPreview, isCommentary } = message;
    const isAi = sender === 'ai';

    return (
        <MessageContainer isAi={isAi} isCommentary={isCommentary} isPreview={isPreview}>
            {isAi && (
                <IconWrapper>
                    <SmartToyIcon color={isPreview ? "warning" : "primary"} />
                </IconWrapper>
            )}
            <MessageContent>
                <Typography variant="body1">
                    {text}
                </Typography>

                {gameContext && !isPreview && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" gutterBottom>
                            Game Context:
                        </Typography>
                        <Typography variant="body2">
                            {`${gameContext.isTopInning ? 'Top' : 'Bottom'} ${gameContext.inning}, 
                            ${gameContext.count.outs} out(s), 
                            Count: ${gameContext.count.balls}-${gameContext.count.strikes}`}
                        </Typography>
                    </>
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