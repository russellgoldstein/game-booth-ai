import { PlayResult } from '../../../shared/types/types';

export const hexToRGB = (h: string): string => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h.length === 4) {
    r = parseInt(`0x${h[1]}${h[1]}`);
    g = parseInt(`0x${h[2]}${h[2]}`);
    b = parseInt(`0x${h[3]}${h[3]}`);
  } else if (h.length === 7) {
    r = parseInt(`0x${h[1]}${h[2]}`);
    g = parseInt(`0x${h[3]}${h[4]}`);
    b = parseInt(`0x${h[5]}${h[6]}`);
  }
  return `${r},${g},${b}`;
};

export const formatValue = (value: number): string =>
  Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumSignificantDigits: 3,
    notation: 'compact',
  }).format(value);

export const formatThousands = (value: number): string =>
  Intl.NumberFormat('en-US', {
    maximumSignificantDigits: 3,
    notation: 'compact',
  }).format(value);

interface Hitter {
  name_first: string;
  name_last: string;
}

interface BattedBallOutcome {
  name: string;
}

export const formatPlayResultText = ({ playResult, hitter }: { playResult: PlayResult; hitter?: Hitter }): string => {
  if (!playResult || !playResult.paOutcome) return '';
  let resultText = hitter ? `${hitter.name_first} ${hitter.name_last} ` : '';
  switch (playResult?.paOutcome?.name) {
    case 'strikeout':
      resultText += 'struck out';
      break;
    case 'walk':
      resultText += 'walked';
      break;
    case 'homerun':
      resultText += 'homered';
      break;
    case 'single':
      resultText += `singled on a ${formatHitResult(playResult.battedBallOutcome as BattedBallOutcome)}`;
      break;
    case 'double':
      resultText += `doubled on a ${formatHitResult(playResult.battedBallOutcome as BattedBallOutcome)}`;
      break;
    case 'triple':
      resultText += `tripled on a ${formatHitResult(playResult.battedBallOutcome as BattedBallOutcome)}`;
      break;
    case 'out':
      switch (playResult.battedBallOutcome?.name) {
        case 'groundball':
          resultText += 'grounded out';
          break;
        case 'flyball':
          resultText += 'flied out';
          break;
        case 'lineDrive':
          resultText += 'lined out';
          break;
        default:
          resultText += 'made an out';
      }
      break;
    default:
      resultText += 'did something';
  }
  if (playResult.runnersScored && playResult.runnersScored.length > 0) {
    resultText += `. ${playResult.runnersScored.map((runner) => `${runner.first_name} ${runner.last_name}`).join(', ') || ''
      } scored`;
  }
  return resultText;
};

export const formatHitResult = (battedBallOutcome: BattedBallOutcome): string => {
  switch (battedBallOutcome.name) {
    case 'groundball':
      return 'groundball';
    case 'flyball':
      return 'fly ball';
    case 'lineDrive':
      return 'line drive';
    default:
      return 'hit';
  }
};

export const formatInningText = (inning: number, topOfInning: boolean): string => {
  return `${topOfInning ? 'Top' : 'Bottom'} ${inning}`;
};
