import { Router } from 'express';
import { MLBService } from '../services/mlb.service';

const router = Router();
const mlbService = new MLBService();

// Get pitch data for visualization
router.get('/pitches', async (req, res) => {
    try {
        const { gameId, pitcherId } = req.query;
        const gameData = await mlbService.getLiveGameData(gameId as string);

        // Extract and format pitch data
        const pitches = gameData.liveData.plays.allPlays
            .filter((play: any) => play.matchup.pitcher.id === pitcherId)
            .flatMap((play: any) => play.playEvents
                .filter((event: any) => event.isPitch)
                .map((event: any) => ({
                    x: event.pitchData.coordinates.x,
                    y: event.pitchData.coordinates.y,
                    type: event.details.type.code,
                    result: event.details.description,
                    speed: event.pitchData.startSpeed,
                    inning: play.about.inning,
                    count: {
                        balls: event.count.balls,
                        strikes: event.count.strikes
                    }
                }))
            );

        res.json(pitches);
    } catch (error) {
        console.error('Error fetching pitch data:', error);
        res.status(500).json({ error: 'Failed to fetch pitch data' });
    }
});

// Get pitching tendencies for heat map
router.get('/tendencies', async (req, res) => {
    try {
        const { pitcherId } = req.query;
        const stats = await mlbService.getPlayerStats(pitcherId as string);

        // Process pitch location data into heat map format
        const tendencies = processPitchLocations(stats);
        res.json(tendencies);
    } catch (error) {
        console.error('Error fetching tendencies:', error);
        res.status(500).json({ error: 'Failed to fetch tendencies' });
    }
});

// Get matchup-specific visualizations
router.get('/matchup', async (req, res) => {
    try {
        const { batterId, pitcherId } = req.query;
        const matchupStats = await mlbService.getMatchupStats(
            batterId as string,
            pitcherId as string
        );

        // Format data for visualizations
        const visualizations = {
            pitchLocations: formatPitchLocations(matchupStats),
            tendencies: formatTendencies(matchupStats),
            outcomes: formatOutcomes(matchupStats)
        };

        res.json(visualizations);
    } catch (error) {
        console.error('Error fetching matchup data:', error);
        res.status(500).json({ error: 'Failed to fetch matchup data' });
    }
});

// Helper functions for data processing
function processPitchLocations(stats: any) {
    // Convert pitch location data into heat map format
    const bins: { x: number; y: number; count: number }[] = [];
    // ... processing logic ...
    return bins;
}

function formatPitchLocations(matchupStats: any) {
    // Format pitch location data for PitchLocationMap
    return matchupStats.pitches?.map((pitch: any) => ({
        x: pitch.coordinates?.x,
        y: pitch.coordinates?.y,
        type: pitch.details?.type?.code,
        result: pitch.details?.result,
        speed: pitch.startSpeed
    })) || [];
}

function formatTendencies(matchupStats: any) {
    // Format pitch tendency data for HeatMap
    // ... processing logic ...
    return [];
}

function formatOutcomes(matchupStats: any) {
    // Format outcome data for charts
    // ... processing logic ...
    return [];
}

export default router; 