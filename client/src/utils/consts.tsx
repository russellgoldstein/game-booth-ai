import { Box, Text } from '@mantine/core';
import { FangraphsPitchingStats, PlayerSeason, Position } from '../../../shared/types/types';
import { PlayerName } from '../components/global/players/PlayerName';
import { FangraphsBattingStats } from '../../../shared/types/types';
interface BaseRow {
  playerSeason?: PlayerSeason;
}


interface HitterRow extends BaseRow {
  atBats: number;
  runs: number;
  hits: number;
  singles: number;
  doubles: number;
  triples: number;
  homeruns: number;
  rbi: number;
  walks: number;
  strikeouts: number;
  position: Position;
}

interface PitcherRow extends BaseRow {
  outs: number;
  hits: number;
  runs: number;
  walks: number;
  strikeouts: number;
}

// Update the function signatures and return types
export const getBoxScoreHitterColumns = () => [
  {
    accessor: 'name',
    title: 'Name',
    render: (row: HitterRow) => (
      <PlayerName player={row.playerSeason?.player} />
    ),
  },
  { accessor: 'position', title: 'Pos', render: (row: HitterRow) => <Text>{row.position}</Text> },
  { accessor: 'atBats', title: 'AB', render: (row: HitterRow) => <Box ta="right"><Text>{row.atBats}</Text></Box> },
  { accessor: 'runs', title: 'R', render: (row: HitterRow) => <Box ta="right"><Text>{row.runs}</Text></Box> },
  { accessor: 'hits', title: 'H', render: (row: HitterRow) => <Box ta="right"><Text>{row.hits}</Text></Box> },
  { accessor: 'singles', title: '1B', render: (row: HitterRow) => <Box ta="right"><Text>{row.singles}</Text></Box> },
  { accessor: 'doubles', title: '2B', render: (row: HitterRow) => <Box ta="right"><Text>{row.doubles}</Text></Box> },
  { accessor: 'triples', title: '3B', render: (row: HitterRow) => <Box ta="right"><Text>{row.triples}</Text></Box> },
  { accessor: 'homeruns', title: 'HR', render: (row: HitterRow) => <Box ta="right"><Text>{row.homeruns}</Text></Box> },
  { accessor: 'rbi', title: 'RBI', render: (row: HitterRow) => <Box ta="right"><Text>{row.rbi}</Text></Box> },
  { accessor: 'walks', title: 'BB', render: (row: HitterRow) => <Box ta="right"><Text>{row.walks}</Text></Box> },
  { accessor: 'strikeouts', title: 'SO', render: (row: HitterRow) => <Box ta="right"><Text>{row.strikeouts}</Text></Box> },
];

export const getBoxScorePitcherColumns = () => [
  {
    accessor: 'name',
    title: 'Name',
    render: (row: PitcherRow) => (
      <PlayerName player={row.playerSeason?.player} />
    ),
  },
  {
    accessor: 'ip',
    title: 'IP',
    render: (row: PitcherRow) => {
      const remainder = row.outs % 3;
      const innings = Math.floor(row.outs / 3);
      return <Text align="right">{`${innings.toFixed(0)}.${remainder}`}</Text>;
    },
  },
  { accessor: 'hits', title: 'H', render: (row: PitcherRow) => <Box ta="right"><Text>{row.hits}</Text></Box> },
  { accessor: 'runs', title: 'R', render: (row: PitcherRow) => <Box ta="right"><Text>{row.runs}</Text></Box> },
  { accessor: 'walks', title: 'BB', render: (row: PitcherRow) => <Box ta="right"><Text>{row.walks}</Text></Box> },
  { accessor: 'strikeouts', title: 'SO', render: (row: PitcherRow) => <Box ta="right"><Text>{row.strikeouts}</Text></Box> },
];

// Update the remaining functions similarly
export const getDefaultHitterColumns = () => [
  {
    accessor: 'name',
    title: 'Name',
    render: (row: FangraphsBattingStats) => (
      <PlayerName player={row.playerSeason?.player} />
    ),
  },
  { accessor: 'G', title: 'G', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row?.G}</Text></Box> },
  { accessor: 'AB', title: 'AB', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row?.AB}</Text></Box> },
  { accessor: 'PA', title: 'PA', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row?.PA}</Text></Box> },
  { accessor: 'R', title: 'R', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row?.R}</Text></Box> },
  { accessor: 'H', title: 'H', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row?.H}</Text></Box> },
  { accessor: 'HR', title: 'HR', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row?.HR}</Text></Box> },
  { accessor: 'RBI', title: 'RBI', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row?.RBI}</Text></Box> },
  { accessor: 'SB', title: 'SB', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row?.SB}</Text></Box> },
  { accessor: 'CS', title: 'CS', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row?.CS}</Text></Box> },
  { accessor: 'BB', title: 'BB', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row?.BB}</Text></Box> },
  { accessor: 'SO', title: 'K', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row?.SO}</Text></Box> },
  { accessor: 'AVG', title: 'AVG', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row?.AVG?.toFixed(3).replace(/^0+/, '')}</Text></Box> },
  { accessor: 'OBP', title: 'OBP', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row?.OBP?.toFixed(3).replace(/^0+/, '')}</Text></Box> },
  { accessor: 'SLG', title: 'SLG', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row?.SLG?.toFixed(3).replace(/^0+/, '')}</Text></Box> },
  { accessor: 'OPS', title: 'OPS', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row?.OPS?.toFixed(3).replace(/^0+/, '')}</Text></Box> },
];

export const getAdvancedHitterColumns = () => [
  {
    accessor: 'name',
    title: 'Name',
    render: (row: FangraphsBattingStats) => (
      <PlayerName player={row.playerSeason?.player} />
    ),
  },
  { accessor: 'BB%', title: 'BB%', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row['BB%']?.toFixed(1)}%</Text></Box> },
  { accessor: 'K%', title: 'K%', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row['K%']?.toFixed(1)}%</Text></Box> },
  { accessor: 'LD%', title: 'LD%', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row['LD%']?.toFixed(1)}%</Text></Box> },
  { accessor: 'GB%', title: 'GB%', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row['GB%']?.toFixed(1)}%</Text></Box> },
  { accessor: 'FB%', title: 'FB%', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row['FB%']?.toFixed(1)}%</Text></Box> },
  { accessor: 'HR/FB', title: 'HR/FB%', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row['HR/FB']?.toFixed(1)}%</Text></Box> },
  { accessor: 'Soft%', title: 'Soft%', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row['Soft%']?.toFixed(1)}%</Text></Box> },
  { accessor: 'Med%', title: 'Med%', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row['Med%']?.toFixed(1)}%</Text></Box> },
  { accessor: 'Hard%', title: 'Hard%', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row['Hard%']?.toFixed(1)}%</Text></Box> },
  { accessor: 'wOBA', title: 'wOBA', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row.wOBA?.toFixed(3)}</Text></Box> },
  { accessor: 'wRC+', title: 'wRC+', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row['wRC+']}</Text></Box> },
  { accessor: 'WAR', title: 'WAR', render: (row: FangraphsBattingStats) => <Box ta="right"><Text>{row.WAR?.toFixed(1)}</Text></Box> },
];

export const getDefaultPitcherColumns = () => [
  {
    accessor: 'name',
    title: 'Name',
    render: (row: FangraphsPitchingStats) => (
      <PlayerName player={row.playerSeason?.player} />
    ),
  },
  { accessor: 'W', title: 'W', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row?.W}</Text></Box> },
  { accessor: 'L', title: 'L', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row?.L}</Text></Box> },
  { accessor: 'ERA', title: 'ERA', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row?.ERA?.toFixed(2)}</Text></Box> },
  { accessor: 'G', title: 'G', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row?.G}</Text></Box> },
  { accessor: 'GS', title: 'GS', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row?.GS}</Text></Box> },
  { accessor: 'SV', title: 'SV', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row?.SV}</Text></Box> },
  { accessor: 'IP', title: 'IP', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row?.IP?.toFixed(1)}</Text></Box> },
  { accessor: 'H', title: 'H', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row?.H}</Text></Box> },
  { accessor: 'R', title: 'R', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row?.R}</Text></Box> },
  { accessor: 'ER', title: 'ER', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row?.ER}</Text></Box> },
  { accessor: 'HR', title: 'HR', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row?.HR}</Text></Box> },
  { accessor: 'BB', title: 'BB', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row?.BB}</Text></Box> },
  { accessor: 'SO', title: 'K', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row?.SO}</Text></Box> },
  { accessor: 'WHIP', title: 'WHIP', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row?.WHIP?.toFixed(2)}</Text></Box> },
];

export const getAdvancedPitcherColumns = () => [
  {
    accessor: 'name',
    title: 'Name',
    render: (row: FangraphsPitchingStats) => (
      <PlayerName player={row.playerSeason?.player} />
    ),
  },
  { accessor: 'K/9', title: 'K/9', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row['K/9'].toFixed(2)}</Text></Box> },
  { accessor: 'BB/9', title: 'BB/9', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row['BB/9'].toFixed(2)}</Text></Box> },
  { accessor: 'K%', title: 'K%', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row['K%'].toFixed(1)}%</Text></Box> },
  { accessor: 'BB%', title: 'BB%', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row['BB%'].toFixed(1)}%</Text></Box> },
  { accessor: 'LD%', title: 'LD%', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row['LD%'].toFixed(1)}%</Text></Box> },
  { accessor: 'GB%', title: 'GB%', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row['GB%'].toFixed(1)}%</Text></Box> },
  { accessor: 'FB%', title: 'FB%', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row['FB%'].toFixed(1)}%</Text></Box> },
  { accessor: 'HR/FB', title: 'HR/FB%', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row['HR/FB'].toFixed(1)}%</Text></Box> },
  { accessor: 'Soft%', title: 'Soft%', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row['Soft%'].toFixed(1)}%</Text></Box> },
  { accessor: 'Med%', title: 'Med%', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row['Med%'].toFixed(1)}%</Text></Box> },
  { accessor: 'Hard%', title: 'Hard%', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row['Hard%'].toFixed(1)}%</Text></Box> },
  { accessor: 'FIP', title: 'FIP', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row.FIP.toFixed(2)}</Text></Box> },
  { accessor: 'xFIP', title: 'xFIP', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row.xFIP.toFixed(2)}</Text></Box> },
  { accessor: 'WAR', title: 'WAR', render: (row: FangraphsPitchingStats) => <Box ta="right"><Text>{row.WAR.toFixed(1)}</Text></Box> },
];

export const getSimPAColumns = () => [
  { accessor: 'AB', title: 'AB', render: (row: BaseRow) => <Box ta="right"><Text>{row.AB.toFixed(0)}</Text></Box> },
  { accessor: 'H', title: 'H', render: (row: BaseRow) => <Box ta="right"><Text>{row.H.toFixed(0)}</Text></Box> },
  { accessor: '1B', title: '1B', render: (row: BaseRow) => <Box ta="right"><Text>{row['1B'].toFixed(0)}</Text></Box> },
  { accessor: '2B', title: '2B', render: (row: BaseRow) => <Box ta="right"><Text>{row['2B'].toFixed(0)}</Text></Box> },
  { accessor: '3B', title: '3B', render: (row: BaseRow) => <Box ta="right"><Text>{row['3B'].toFixed(0)}</Text></Box> },
  { accessor: 'HR', title: 'HR', render: (row: BaseRow) => <Box ta="right"><Text>{row.HR.toFixed(0)}</Text></Box> },
  { accessor: 'BB', title: 'BB', render: (row: BaseRow) => <Box ta="right"><Text>{row.BB.toFixed(0)}</Text></Box> },
  { accessor: 'SO', title: 'K', render: (row: BaseRow) => <Box ta="right"><Text>{row.SO.toFixed(0)}</Text></Box> },
  { accessor: 'AVG', title: 'AVG', render: (row: BaseRow) => <Box ta="right"><Text>{row.AVG.toFixed(3)}</Text></Box> },
  { accessor: 'OBP', title: 'OBP', render: (row: BaseRow) => <Box ta="right"><Text>{row.OBP.toFixed(3)}</Text></Box> },
  { accessor: 'SLG', title: 'SLG', render: (row: BaseRow) => <Box ta="right"><Text>{row.SLG.toFixed(3)}</Text></Box> },
  { accessor: 'OPS', title: 'OPS', render: (row: BaseRow) => <Box ta="right"><Text>{row.OPS.toFixed(3)}</Text></Box> },
];