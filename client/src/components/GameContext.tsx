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
    Chip,
    CircularProgress,
    TextField,
    Button
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useSearchParams } from 'react-router-dom';
import { GameContext as GameContextType } from '../types/chat.types';
import dayjs, { Dayjs } from 'dayjs';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const GameInfoContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
}));

const StatsRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[50]
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

interface AtBatCommentary {
    summary: string;
    analysis: string;
    keyMoment: boolean;
    significance: string;
}

interface Props {
    gameId?: string;
    onGameSelect: (gameId: string) => void;
    onGameContextUpdate?: (context: any) => void;
}

export default function GameContext({ gameId, onGameSelect, onGameContextUpdate }: Props) {
    const [searchParams] = useSearchParams();
    const isDemo = searchParams.get('demo') === 'true';
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs('2023-10-01'));
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(false);
    const [gameContext, setGameContext] = useState<GameContextType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [autoAdvance, setAutoAdvance] = useState(false);
    const [currentAtBat, setCurrentAtBat] = useState(0);
    const [commentary, setCommentary] = useState<AtBatCommentary | null>(null);

    const fetchGames = async () => {
        try {
            setLoading(true);
            setError(null);

            const endpoint = isDemo && selectedDate
                ? `/api/games/date/${selectedDate.format('YYYY-MM-DD')}`
                : '/api/games/today';

            const response = await fetch(endpoint);
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
        // Call API to reset game state
        try {
            await fetch(`/api/games/${gameId}/restart`, { method: 'POST' });
            // Refetch game data
            fetchGames();
        } catch (err) {
            setError('Failed to restart game');
        }
    }, [gameId]);

    const handleNextAtBat = useCallback(async () => {
        if (!gameId) return;
        try {
            const response = await fetch(`/api/games/${gameId}/atbat/${currentAtBat + 1}`);
            if (!response.ok) {
                throw new Error('Failed to fetch next at-bat');
            }
            const data = await response.json();

            // Create updated game context from at-bat data
            const updatedContext = {
                gameId,
                inning: data.atBat.about.inning,
                isTopInning: data.atBat.about.isTopInning,
                count: {
                    balls: data.atBat.count.balls,
                    strikes: data.atBat.count.strikes,
                    outs: data.atBat.count.outs
                },
                pitcher: {
                    id: data.atBat.matchup.pitcher.id,
                    fullName: data.atBat.matchup.pitcher.fullName,
                    stats: data.atBat.matchup.pitcher.stats
                },
                batter: {
                    id: data.atBat.matchup.batter.id,
                    fullName: data.atBat.matchup.batter.fullName,
                    stats: data.atBat.matchup.batter.stats
                },
                runnersOn: data.atBat.runners
                    .filter((runner: any) => runner.movement.start)
                    .map((runner: any) => ({
                        base: runner.movement.start,
                        player: {
                            id: runner.details.runner.id,
                            fullName: runner.details.runner.fullName
                        }
                    })),
                score: {
                    away: data.atBat.result.awayScore,
                    home: data.atBat.result.homeScore
                }
            };

            // Update the current at-bat counter
            setCurrentAtBat(prev => prev + 1);

            // Set the commentary
            setCommentary(data.commentary);

            // Notify parent component of the updated context
            if (onGameContextUpdate) {
                onGameContextUpdate(updatedContext);
            }

            // Create and dispatch AI message with commentary
            const aiMessage = {
                id: Date.now().toString(),
                sender: 'ai',
                text: `${data.commentary.summary}\n\n${data.commentary.analysis}${data.commentary.keyMoment
                    ? `\n\nKey Moment: ${data.commentary.significance}`
                    : ''
                    }`,
                gameContext: updatedContext,
                isCommentary: true
            };

            // Dispatch a custom event with the AI message
            const event = new CustomEvent('newCommentary', {
                detail: aiMessage
            });
            window.dispatchEvent(event);

        } catch (err) {
            setError('Failed to advance to next at-bat');
            setAutoAdvance(false);
        }
    }, [gameId, currentAtBat, onGameContextUpdate]);

    // Effect for auto-advancing
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isDemo && autoAdvance && gameId) {
            interval = setInterval(handleNextAtBat, 30000);
        }
        return () => clearInterval(interval);
    }, [isDemo, autoAdvance, gameId, handleNextAtBat]);

    // Effect for fetching games
    useEffect(() => {
        fetchGames();
    }, [isDemo, selectedDate]);

    // Fetch game context when gameId changes
    useEffect(() => {
        if (!gameId) return;

        const fetchGameContext = async () => {
            try {
                const response = await fetch(`http://localhost:3030/api/chat/games/${gameId}/context`);
                const data = await response.json();
                setGameContext(data);
            } catch (err) {
                setError('Failed to fetch game context');
            }
        };

        fetchGameContext();
    }, [gameId]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <GameInfoContainer>
            <Typography variant="h6" gutterBottom>
                Game Information
            </Typography>

            {isDemo && (
                <Box sx={{ mb: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Select Game Date"
                            value={selectedDate}
                            onChange={(newDate) => setSelectedDate(newDate)}
                            minDate={dayjs('2024-03-30')}
                            maxDate={dayjs('2024-10-01')}
                            disableFuture
                            views={['year', 'month', 'day']}
                            sx={{ width: '100%' }}
                            slotProps={{
                                textField: {
                                    helperText: 'MM/DD/YYYY',
                                },
                            }}
                            defaultValue={dayjs('2023-10-01')}
                        />
                    </LocalizationProvider>

                    {gameId && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
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
                </Box>
            )}

            <FormControl fullWidth>
                <InputLabel>Select Game</InputLabel>
                <Select
                    value={gameId || ''}
                    onChange={(e) => {
                        onGameSelect(e.target.value);
                        setCurrentAtBat(0); // Reset at-bat counter when game changes
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