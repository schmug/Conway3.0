import { Grid, Cell, Coordinate } from '../types';
import { getRandomColor } from '../constants';

// Initialize an empty grid
export const createEmptyGrid = (rows: number, cols: number): Grid => {
  const grid: Grid = [];
  for (let y = 0; y < rows; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < cols; x++) {
      row.push({ alive: false, color: '#000000', id: 0 });
    }
    grid.push(row);
  }
  return grid;
};

// Helper: Hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Helper: RGB to Hex
const componentToHex = (c: number) => {
  const hex = Math.floor(c).toString(16);
  return hex.length === 1 ? "0" + hex : hex;
};

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

// Blend multiple hex colors
const blendColors = (colors: string[]): string => {
    if (colors.length === 0) return '#ffffff';
    if (colors.length === 1) return colors[0];

    let r = 0, g = 0, b = 0;
    colors.forEach(hex => {
        const rgb = hexToRgb(hex);
        r += rgb.r;
        g += rgb.g;
        b += rgb.b;
    });

    return rgbToHex(r / colors.length, g / colors.length, b / colors.length);
};

// Count alive neighbors
const countNeighbors = (grid: Grid, x: number, y: number, rows: number, cols: number) => {
  let count = 0;
  // Get neighbors' colors to determine inheritance
  const neighborColors: string[] = [];

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      
      const nx = (x + dx + cols) % cols; // Wrap around (Toroidal)
      const ny = (y + dy + rows) % rows;
      
      if (grid[ny][nx].alive) {
        count++;
        neighborColors.push(grid[ny][nx].color);
      }
    }
  }
  return { count, neighborColors };
};

// Main Game of Life Step
export const computeNextGeneration = (currentGrid: Grid): Grid => {
  const rows = currentGrid.length;
  const cols = currentGrid[0].length;
  const newGrid = createEmptyGrid(rows, cols);

  // 1. Standard Life Rules & Color Inheritance
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = currentGrid[y][x];
      const { count, neighborColors } = countNeighbors(currentGrid, x, y, rows, cols);

      if (cell.alive) {
        // Survival
        if (count === 2 || count === 3) {
          newGrid[y][x] = { ...cell };
        } 
        // Else dies (underpopulation or overpopulation)
      } else {
        // Birth
        if (count === 3) {
          // New Inherit Logic: Blend all parent colors? Or dominant?
          // Previous logic was dominant. 
          // New logic per request: Blend on collision.
          // However, birth isn't strictly a "collision" of blobs, it's reproduction.
          // Standard GoL color logic usually takes the dominant parent or blends all parents.
          // Let's blend all 3 parents for smoother transitions.
          
          const blendedColor = blendColors(neighborColors);
          newGrid[y][x] = { alive: true, color: blendedColor, id: 0 }; 
        }
      }
    }
  }

  // 2. Collision Detection (Connected Components)
  // Logic: Find all connected groups. If a group has mixed colors (significantly different), blend them.
  const visited = new Set<string>();
  const toKey = (x: number, y: number) => `${x},${y}`;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (newGrid[y][x].alive && !visited.has(toKey(x, y))) {
        // Start BFS for this component
        const component: Coordinate[] = [];
        const colorsInComponent = new Set<string>();
        const queue: Coordinate[] = [{ x, y }];
        visited.add(toKey(x, y));

        while (queue.length > 0) {
          const curr = queue.shift()!;
          component.push(curr);
          colorsInComponent.add(newGrid[curr.y][curr.x].color);

          // Check neighbors for connectivity
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const nx = (curr.x + dx + cols) % cols;
              const ny = (curr.y + dy + rows) % rows;
              
              if (newGrid[ny][nx].alive && !visited.has(toKey(nx, ny))) {
                visited.add(toKey(nx, ny));
                queue.push({ x: nx, y: ny });
              }
            }
          }
        }

        // Check for collision (more than 1 distinct color in the blob)
        // Optimization: Only re-blend if Set size > 1
        if (colorsInComponent.size > 1) {
           const distinctColors = Array.from(colorsInComponent);
           const newCollisionColor = blendColors(distinctColors);
           
           component.forEach(c => {
             newGrid[c.y][c.x].color = newCollisionColor;
           });
        }
      }
    }
  }

  return newGrid;
};

// Calculate Hash to detect stability (simple string representation of live cell coordinates)
export const getGridHash = (grid: Grid): string => {
  let hash = "";
  const rows = grid.length;
  const cols = grid[0].length;
  for(let y=0; y<rows; y++) {
      for(let x=0; x<cols; x++) {
          if(grid[y][x].alive) hash += `${x},${y}|`;
      }
  }
  return hash;
};

export const countAliveCells = (grid: Grid): number => {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell.alive) count++;
    }
  }
  return count;
};