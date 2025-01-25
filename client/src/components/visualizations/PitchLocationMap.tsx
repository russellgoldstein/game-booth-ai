import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { Circle } from '@visx/shape';

const StrikeZone = styled('rect')({
    fill: 'none',
    stroke: '#000',
    strokeWidth: 2,
});

interface PitchData {
    x: number;
    y: number;
    type: string;
    result: string;
    speed?: number;
}

interface Props {
    width?: number;
    height?: number;
    pitches: PitchData[];
}

const STRIKE_ZONE = {
    top: 3.5,    // feet
    bottom: 1.5,  // feet
    left: -0.85,  // feet
    right: 0.85,  // feet
};

const PitchLocationMap: React.FC<Props> = ({
    width = 300,
    height = 300,
    pitches
}) => {
    // Create scales for x and y coordinates
    const xScale = scaleLinear({
        domain: [STRIKE_ZONE.left - 1, STRIKE_ZONE.right + 1],
        range: [0, width],
    });

    const yScale = scaleLinear({
        domain: [0, STRIKE_ZONE.top + 1],
        range: [height, 0],
    });

    // Color mapping for pitch types
    const pitchColors: { [key: string]: string } = {
        'FF': '#ff0000', // Four-seam Fastball
        'SI': '#00ff00', // Sinker
        'CH': '#0000ff', // Changeup
        'SL': '#ffff00', // Slider
        'CU': '#ff00ff', // Curveball
        // Add more pitch types as needed
    };

    return (
        <Box sx={{ position: 'relative' }}>
            <Typography variant="h6" gutterBottom>
                Pitch Location Map
            </Typography>
            <svg width={width} height={height}>
                <Group>
                    {/* Strike zone */}
                    <StrikeZone
                        x={xScale(STRIKE_ZONE.left)}
                        y={yScale(STRIKE_ZONE.top)}
                        width={xScale(STRIKE_ZONE.right) - xScale(STRIKE_ZONE.left)}
                        height={yScale(STRIKE_ZONE.bottom) - yScale(STRIKE_ZONE.top)}
                    />

                    {/* Pitch locations */}
                    {pitches.map((pitch, i) => (
                        <Circle
                            key={i}
                            cx={xScale(pitch.x)}
                            cy={yScale(pitch.y)}
                            r={5}
                            fill={pitchColors[pitch.type] || '#999'}
                            opacity={0.7}
                            title={`${pitch.type} - ${pitch.result}`}
                        />
                    ))}
                </Group>
            </svg>

            {/* Legend */}
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                mt: 2
            }}>
                {Object.entries(pitchColors).map(([type, color]) => (
                    <Box
                        key={type}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                        }}
                    >
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: color
                            }}
                        />
                        <Typography variant="caption">
                            {type}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default PitchLocationMap; 