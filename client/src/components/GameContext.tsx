import React, { useEffect, useState } from 'react';
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
    CircularProgress
} from '@mui/material';
import { GameContext as GameContextType } from '../types/chat.types';

const GameInfoContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1)
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

interface Props {
    gameId: string | null;
    onGameSelect: (gameId: string) => void;
}

export default function GameContext({ gameId, onGameSelect }: Props) {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [gameContext, setGameContext] = useState<GameContextType | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch today's games
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch('http://localhost:3030/api/chat/games/today');
                const data = await response.json();
                setGames(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch games');
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

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
        return (
            <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={2}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <GameInfoContainer>
            <Typography variant="h6" gutterBottom>
                Game Information
            </Typography>

            <FormControl fullWidth>
                <InputLabel>Select Game</InputLabel>
                <Select
                    value={gameId || ''}
                    onChange={(e) => onGameSelect(e.target.value)}
                    label="Select Game"
                >
                    {games.map((game) => (
                        <MenuItem key={game.gamePk} value={game.gamePk}>
                            {game.teams.away.team.name} @ {game.teams.home.team.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {gameContext && (
                <>
                    <StatsRow>
                        <Typography variant="subtitle2">Inning</Typography>
                        <Chip
                            label={`${gameContext.isTopInning ? 'Top' : 'Bottom'} ${gameContext.inning}`}
                            color="primary"
                            variant="outlined"
                        />
                    </StatsRow>

                    <StatsRow>
                        <Typography variant="subtitle2">Situation</Typography>
                        <Chip
                            label={`${gameContext.count.balls} balls, ${gameContext.count.strikes} strikes, ${gameContext.count.outs} outs`}
                            color="primary"
                            variant="outlined"
                        />
                    </StatsRow>

                    <StatsRow>
                        <Typography variant="subtitle2">Pitcher</Typography>
                        <Typography>{gameContext.pitcher.fullName}</Typography>
                    </StatsRow>

                    <StatsRow>
                        <Typography variant="subtitle2">Batter</Typography>
                        <Typography>{gameContext.batter.fullName}</Typography>
                    </StatsRow>

                    {gameContext.runnersOn.length > 0 && (
                        <StatsRow>
                            <Typography variant="subtitle2">Runners On</Typography>
                            <Box display="flex" gap={1}>
                                {gameContext.runnersOn.map((runner) => (
                                    <Chip
                                        key={runner.base}
                                        label={`${runner.base}: ${runner.player.fullName}`}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                    />
                                ))}
                            </Box>
                        </StatsRow>
                    )}
                </>
            )}
        </GameInfoContainer>
    );
} 