import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { HeatmapRect } from '@visx/heatmap';
import { interpolateRdYlBu } from 'd3-scale-chromatic';

const HeatMapContainer = styled(Box)({
    position: 'relative',
});

interface BinData {
    x: number;
    y: number;
    count: number;
}

interface Props {
    width?: number;
    height?: number;
    data: BinData[];
    title?: string;
}

const HeatMapViz: React.FC<Props> = ({
    width = 300,
    height = 300,
    data,
    title = "Pitch Frequency Heat Map"
}) => {
    // Create bins for the heat map
    const binSize = 0.25; // feet
    const bins: number[][] = [];
    const xBins = Math.ceil((1.7) / binSize); // Strike zone width
    const yBins = Math.ceil((2) / binSize);   // Strike zone height

    // Initialize bins
    for (let i = 0; i < xBins; i++) {
        bins[i] = new Array(yBins).fill(0);
    }

    // Fill bins with pitch data
    data.forEach(pitch => {
        const xBin = Math.floor((pitch.x + 0.85) / binSize);
        const yBin = Math.floor((pitch.y - 1.5) / binSize);
        if (xBin >= 0 && xBin < xBins && yBin >= 0 && yBin < yBins) {
            bins[xBin][yBin] += pitch.count;
        }
    });

    // Find max value for color scaling
    const maxCount = Math.max(...bins.flat());

    const colorScale = scaleLinear({
        domain: [0, maxCount],
        range: [0, 1],
    });

    return (
        <HeatMapContainer>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <svg width={width} height={height}>
                <Group>
                    <HeatmapRect
                        data={bins}
                        xScale={scaleLinear({
                            domain: [-0.85, 0.85],
                            range: [0, width],
                        })}
                        yScale={scaleLinear({
                            domain: [1.5, 3.5],
                            range: [height, 0],
                        })}
                        colorScale={value => interpolateRdYlBu(1 - colorScale(value))}
                        binWidth={width / xBins}
                        binHeight={height / yBins}
                        gap={1}
                    />

                    {/* Strike zone outline */}
                    <rect
                        x={width * 0.2}
                        y={height * 0.2}
                        width={width * 0.6}
                        height={height * 0.6}
                        fill="none"
                        stroke="black"
                        strokeWidth={2}
                    />
                </Group>
            </svg>

            {/* Color scale legend */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mt: 2,
                gap: 1
            }}>
                <Typography variant="caption">
                    Less
                </Typography>
                <Box sx={{
                    width: 150,
                    height: 20,
                    background: 'linear-gradient(to right, #4575b4, #ffffbf, #d73027)'
                }} />
                <Typography variant="caption">
                    More
                </Typography>
            </Box>
        </HeatMapContainer>
    );
};

export default HeatMapViz; 