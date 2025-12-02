import { Pattern } from './types';

export const CELL_SIZE = 8;
export const MAX_PLACEMENTS = 10;
export const SIMULATION_SPEED_MS = 50; // Delay between frames

// Neon/Vibrant Colors for patterns
export const PATTERN_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f43f5e', // Rose
];

export const getRandomColor = () => PATTERN_COLORS[Math.floor(Math.random() * PATTERN_COLORS.length)];

// Predefined Patterns
export const PATTERNS: Pattern[] = [
  {
    name: 'Glider',
    grid: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1]
    ],
    offsetX: 1,
    offsetY: 1
  },
  {
    name: 'Lightweight Spaceship',
    grid: [
      [0, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [0, 0, 0, 0, 1],
      [1, 0, 0, 1, 0]
    ],
    offsetX: 2,
    offsetY: 2
  },
  {
    name: 'Middleweight Spaceship',
    grid: [
        [0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [0, 0, 0, 0, 1],
        [1, 0, 0, 1, 0]
    ],
    offsetX: 2,
    offsetY: 2
  },
  {
    name: 'R-Pentomino',
    grid: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 0]
    ],
    offsetX: 1,
    offsetY: 1
  },
  {
    name: 'Diehard',
    grid: [
      [0, 0, 0, 0, 0, 0, 1, 0],
      [1, 1, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 1, 1]
    ],
    offsetX: 4,
    offsetY: 1
  },
  {
    name: 'Acorn',
    grid: [
      [0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [1, 1, 0, 0, 1, 1, 1]
    ],
    offsetX: 3,
    offsetY: 1
  },
  {
      name: 'Blinker',
      grid: [
          [1, 1, 1]
      ],
      offsetX: 1,
      offsetY: 0
  },
  {
      name: 'Toad',
      grid: [
          [0, 1, 1, 1],
          [1, 1, 1, 0]
      ],
      offsetX: 2,
      offsetY: 1
  },
  {
      name: 'Beacon',
      grid: [
          [1, 1, 0, 0],
          [1, 1, 0, 0],
          [0, 0, 1, 1],
          [0, 0, 1, 1]
      ],
      offsetX: 2,
      offsetY: 2
  },
  {
      name: 'Pulsar',
      grid: [
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]
      ],
      offsetX: 6,
      offsetY: 6
  }
];

export const getRandomPattern = (): Pattern => {
  return PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
};