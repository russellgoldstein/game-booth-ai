import axios from 'axios';

const BASE_URL = 'http://localhost:3030/api';

export interface PitchData {
    x: number;
    y: number;
    type: string;
    result: string;
    speed: number;
    inning: number;
    count: { balls: number; strikes: number };
}

class MLBService {
    async getPitchData(gameId: string, pitcherId: string) {
        try {
            const response = await axios.get(`${BASE_URL}/stats/pitches`, {
                params: { gameId, pitcherId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching pitch data:', error);
            throw error;
        }
    }

    async getPitchingTendencies(pitcherId: string) {
        try {
            const response = await axios.get(`${BASE_URL}/stats/tendencies`, {
                params: { pitcherId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching pitching tendencies:', error);
            throw error;
        }
    }

    async getMatchupVisualizations(batterId: string, pitcherId: string) {
        try {
            const response = await axios.get(`${BASE_URL}/stats/matchup`, {
                params: { batterId, pitcherId }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching matchup data:', error);
            throw error;
        }
    }
}

export default new MLBService(); 