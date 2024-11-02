import { join } from 'lodash-es';
import { timeToMilliseconds } from './timeToMilliseconds';

export interface SubtitleBlock {
  index: number;
  start: number;
  end: number;
  text: string;
}

export const toSubtext = (srtContent: string): string => {
  const blocks = toBlocks(srtContent);
  const lines: string[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const { start, end, text } = blocks[i];
    lines.push(`${start} ${end} ${text}`);
  }

  return join(lines, '\n');
};

export const toBlocks = (srtContent: string): SubtitleBlock[] => {
  const blocks: SubtitleBlock[] = [];

  const subtitleChunks = srtContent.split(/\n\s*\n/);
  subtitleChunks.forEach((chunk) => {
    const lines = chunk.trim().split('\n');
    if (lines.length >= 3) {
      const index = parseInt(lines[0], 10);
      const [startTime, endTime] = lines[1].split(' --> ').map((s) => s.trim());
      const text = lines
        .slice(2)
        .map((s) => s.trim())
        .join('<br />');
      blocks.push({ index, start: timeToMilliseconds(startTime), end: timeToMilliseconds(endTime), text });
    }
  });

  return blocks;
};
