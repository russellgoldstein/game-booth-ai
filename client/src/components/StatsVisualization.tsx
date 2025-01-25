import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Paper, Typography } from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import PitchLocationMap from './visualizations/PitchLocationMap';
import HeatMapViz from './visualizations/HeatMap';

const StatsContainer = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    height: '300px'
}));

interface PitchLocation {
    x: number;
    y: number;
    type: string;
    result: string;
}

interface Props {
    data?: any;
    type?: 'chart' | 'heatmap' | 'pitchLocation';
}

export default function StatsVisualization({ data, type = 'chart' }: Props) {
    if (!data) return null;

    const renderVisualization = () => {
        switch (type) {
            case 'pitchLocation':
                return <PitchLocationMap pitches={data} />;
            case 'heatmap':
                return <HeatMapViz data={data} />;
            default:
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                );
        }
    };

    return (
        <StatsContainer>
            <Typography variant="h6" gutterBottom>
                Statistics Visualization
            </Typography>
            <Box sx={{ height: 'calc(100% - 40px)' }}>
                {renderVisualization()}
            </Box>
        </StatsContainer>
    );
}

// Additional visualization components will be added here 