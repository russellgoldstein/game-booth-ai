import React from 'react';
import { styled } from '@mui/material/styles';
import { Paper, Box, Typography } from '@mui/material';
import DiamondIcon from '@mui/icons-material/Diamond';
import PersonIcon from '@mui/icons-material/Person';

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

interface BaseProps {
    hasrunner: boolean;  // lowercase for DOM attribute
}

interface OutIndicatorProps {
    isout: boolean;  // lowercase for DOM attribute
}

const SituationContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
}));

const DiamondContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '200px',
    height: '200px',
    margin: theme.spacing(2)
}));

const Base = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'hasrunner'
})<BaseProps>(({ theme, hasrunner }) => ({
    position: 'absolute',
    width: '20px',
    height: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiSvgIcon-root': {
        color: hasrunner ? theme.palette.primary.main : theme.palette.grey[300]
    }
}));

const OutIndicator = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isout'
})<OutIndicatorProps>(({ theme, isout }) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: isout ? theme.palette.error.main : theme.palette.grey[300],
    margin: '0 4px'
}));

const CountDisplay = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(1)
}));

export default function GameSituation({ gameContext }: Props) {
    if (!gameContext) return null;

    const hasRunnerOnBase = (base: string) =>
        gameContext.runnersOn?.some(runner => runner.base === base);

    return (
        <SituationContainer>
            <Typography variant="h6" gutterBottom>
                {gameContext.isTopInning ? "Top" : "Bottom"} {gameContext.inning}
            </Typography>

            <Typography variant="h4" gutterBottom>
                {gameContext.score?.away} - {gameContext.score?.home}
            </Typography>

            <CountDisplay>
                <Box>
                    <Typography variant="subtitle2">Balls</Typography>
                    <Typography variant="h6">{gameContext.count?.balls}</Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2">Strikes</Typography>
                    <Typography variant="h6">{gameContext.count?.strikes}</Typography>
                </Box>
                <Box>
                    <Typography variant="subtitle2">Outs</Typography>
                    <Box sx={{ display: 'flex', mt: 1 }}>
                        {[0, 1, 2].map((i) => (
                            <OutIndicator
                                key={i}
                                isout={i < gameContext.count?.outs}
                            />
                        ))}
                    </Box>
                </Box>
            </CountDisplay>

            <DiamondContainer>
                {/* Home Plate */}
                <Box sx={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}>
                    <PersonIcon />
                </Box>

                {/* First Base */}
                <Base
                    hasrunner={hasRunnerOnBase('1B')}
                    sx={{ top: '50%', right: 0, transform: 'translateY(-50%)' }}
                >
                    <DiamondIcon />
                </Base>

                {/* Second Base */}
                <Base
                    hasrunner={hasRunnerOnBase('2B')}
                    sx={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}
                >
                    <DiamondIcon />
                </Base>

                {/* Third Base */}
                <Base
                    hasrunner={hasRunnerOnBase('3B')}
                    sx={{ top: '50%', left: 0, transform: 'translateY(-50%)' }}
                >
                    <DiamondIcon />
                </Base>
            </DiamondContainer>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="subtitle1">
                    {gameContext.pitcher?.fullName}
                </Typography>
                <Typography variant="caption">
                    pitching to
                </Typography>
                <Typography variant="subtitle1">
                    {gameContext.batter?.fullName}
                </Typography>
            </Box>
        </SituationContainer>
    );
} 