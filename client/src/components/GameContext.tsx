import React, { useEffect, useState, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Paper,
    CircularProgress,
    Button
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const GameInfoContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
}));

interface Game {
    gamePk: string;
    teams: {
        away: { team: { name: string } };
        home: { team: { name: string } };
    };
    gameDate: string;
    status: { abstractGameState: string };
}

interface Props {
    gameId?: string;
    onGameSelect: (gameId: string) => void;
    onGameContextUpdate?: (context: any) => void;
}

export default function GameContext({ gameId, onGameSelect, onGameContextUpdate }: Props) {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [autoAdvance, setAutoAdvance] = useState(false);
    const [currentAtBat, setCurrentAtBat] = useState(0);

    const fetchGames = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/games/date/2024-09-29');
            if (!response.ok) {
                throw new Error('Failed to fetch games');
            }

            const data = await response.json();
            setGames(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch games');
        } finally {
            setLoading(false);
        }
    };

    const handleRestartGame = useCallback(async () => {
        if (!gameId) return;
        setCurrentAtBat(0);
        try {
            await fetch(`/api/games/${gameId}/restart`, { method: 'POST' });
            fetchGames();
        } catch (err) {
            setError('Failed to restart game');
        }
    }, [gameId]);

    const handleNextAtBat = useCallback(async () => {
        if (!gameId) return;
        try {
            // First, get the preview
            const previewResponse = await fetch(`/api/games/${gameId}/atbat/${currentAtBat + 1}/preview`);
            if (!previewResponse.ok) throw new Error('Failed to fetch preview');
            const previewData = await previewResponse.json();

            // Dispatch preview message
            const previewMessage = {
                id: Date.now().toString(),
                sender: 'ai',
                text: previewData.preview,
                isPreview: true
            };
            window.dispatchEvent(new CustomEvent('newCommentary', { detail: previewMessage }));

            // Get the at-bat data
            const atBatResponse = await fetch(`/api/games/${gameId}/atbat/${currentAtBat + 1}`);
            if (!atBatResponse.ok) throw new Error('Failed to fetch at-bat');
            const { atBat } = await atBatResponse.json();

            // Update game context
            const updatedContext = {
                gameId,
                inning: atBat.about.inning,
                isTopInning: atBat.about.isTopInning,
                count: {
                    balls: atBat.count.balls,
                    strikes: atBat.count.strikes,
                    outs: atBat.count.outs
                },
                pitcher: {
                    id: atBat.matchup.pitcher.id,
                    fullName: atBat.matchup.pitcher.fullName,
                    stats: atBat.matchup.pitcher.stats
                },
                batter: {
                    id: atBat.matchup.batter.id,
                    fullName: atBat.matchup.batter.fullName,
                    stats: atBat.matchup.batter.stats
                },
                runnersOn: atBat.runners
                    .filter((runner: any) => runner.movement.start)
                    .map((runner: any) => ({
                        base: runner.movement.start,
                        player: {
                            id: runner.details.runner.id,
                            fullName: runner.details.runner.fullName
                        }
                    })),
                score: {
                    away: atBat.result.awayScore,
                    home: atBat.result.homeScore
                }
            };

            if (onGameContextUpdate) {
                onGameContextUpdate(updatedContext);
            }

            // Get the commentary
            const commentaryResponse = await fetch(`/api/games/${gameId}/atbat/${currentAtBat + 1}/commentary`);
            if (!commentaryResponse.ok) throw new Error('Failed to fetch commentary');
            const commentaryData = await commentaryResponse.json();

            // Dispatch result commentary
            const commentaryMessage = {
                id: Date.now().toString() + '-result',
                sender: 'ai',
                text: commentaryData.commentary,
                gameContext: updatedContext,
                isCommentary: true
            };
            window.dispatchEvent(new CustomEvent('newCommentary', { detail: commentaryMessage }));

            setCurrentAtBat(prev => prev + 1);

        } catch (err) {
            setError('Failed to advance to next at-bat');
            setAutoAdvance(false);
        }
    }, [gameId, currentAtBat, onGameContextUpdate]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (autoAdvance && gameId) {
            interval = setInterval(handleNextAtBat, 30000);
        }
        return () => clearInterval(interval);
    }, [autoAdvance, gameId, handleNextAtBat]);

    useEffect(() => {
        fetchGames();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <GameInfoContainer>
            <Typography variant="h6" gutterBottom>
                MLB 2024 Regular Season Final Day
            </Typography>

            {gameId && (
                <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<RestartAltIcon />}
                        onClick={handleRestartGame}
                    >
                        Restart Game
                    </Button>
                    <Button
                        variant="contained"
                        color={autoAdvance ? "error" : "primary"}
                        startIcon={<PlayArrowIcon />}
                        onClick={() => setAutoAdvance(!autoAdvance)}
                    >
                        {autoAdvance ? "Stop Auto-Advance" : "Auto-Advance"}
                    </Button>
                </Box>
            )}

            <FormControl fullWidth>
                <InputLabel>Select Game</InputLabel>
                <Select
                    value={gameId || ''}
                    onChange={(e) => {
                        onGameSelect(e.target.value);
                        setCurrentAtBat(0);
                    }}
                    label="Select Game"
                >
                    {games.map((game) => (
                        <MenuItem key={game.gamePk} value={game.gamePk}>
                            {game.teams.away.team.name} @ {game.teams.home.team.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </GameInfoContainer>
    );
} 