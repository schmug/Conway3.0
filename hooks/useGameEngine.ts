import { useState, useEffect, useRef, useCallback } from 'react';
import { Grid, GameState, Pattern, Coordinate } from '../types';
import { createEmptyGrid, computeNextGeneration, countAliveCells, getGridHash } from '../utils/gameLogic';
import { MAX_PLACEMENTS, SIMULATION_SPEED_MS, getRandomPattern, getRandomColor } from '../constants';

export const useGameEngine = (rows: number, cols: number) => {
  const [gameState, setGameState] = useState<GameState>({
    grid: createEmptyGrid(rows, cols),
    generation: 0,
    score: 0,
    highScore: 0,
    patternsLeft: MAX_PLACEMENTS,
    isRunning: false,
    isStable: false,
    stabilizationGeneration: null,
  });

  const stateRef = useRef(gameState); // Ref to access latest state in loop
  stateRef.current = gameState;

  const historyRef = useRef<string[]>([]); // To detect stability
  const lastTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  // Sync grid with prop changes (handle resize or initial load)
  useEffect(() => {
    setGameState(prev => {
      // Only reset if dimensions actually differ to avoid unnecessary resets
      if (prev.grid.length === rows && prev.grid[0]?.length === cols) {
        return prev;
      }
      return {
        ...prev,
        grid: createEmptyGrid(rows, cols),
        generation: 0,
        score: 0,
        // Keep high score across resizes
        highScore: prev.highScore,
        patternsLeft: MAX_PLACEMENTS,
        isRunning: false,
        isStable: false,
        stabilizationGeneration: null,
      };
    });
    // Reset history on dimension change
    historyRef.current = [];
  }, [rows, cols]);

  // Initialize/Reset
  const resetGame = useCallback(() => {
    setGameState(prev => ({
      grid: createEmptyGrid(rows, cols),
      generation: 0,
      score: 0,
      highScore: prev.highScore,
      patternsLeft: MAX_PLACEMENTS,
      isRunning: false,
      isStable: false,
      stabilizationGeneration: null,
    }));
    historyRef.current = [];
  }, [rows, cols]);

  // Place Predefined Pattern Logic
  const placePattern = useCallback((cx: number, cy: number) => {
    if (stateRef.current.patternsLeft <= 0) return;

    const currentGrid = stateRef.current.grid;
    const currentRows = currentGrid.length;
    const currentCols = currentGrid[0]?.length || 0;

    if (currentRows === 0 || currentCols === 0) return;

    const pattern: Pattern = getRandomPattern();
    const color = getRandomColor();
    
    setGameState(prev => {
      // Create deep copy
      const newGrid = prev.grid.map(row => row.map(cell => ({ ...cell })));
      
      // Stamp pattern onto grid
      for(let py = 0; py < pattern.grid.length; py++) {
        for(let px = 0; px < pattern.grid[py].length; px++) {
          if (pattern.grid[py][px] === 1) {
            const gridY = (cy + py - pattern.offsetY + currentRows) % currentRows;
            const gridX = (cx + px - pattern.offsetX + currentCols) % currentCols;
            
            if (newGrid[gridY] && newGrid[gridY][gridX]) {
              newGrid[gridY][gridX] = {
                alive: true,
                color: color,
                id: Date.now()
              };
            }
          }
        }
      }

      return {
        ...prev,
        grid: newGrid,
        patternsLeft: prev.patternsLeft - 1,
        isRunning: true, // Auto-start on placement
        isStable: false,
        stabilizationGeneration: null,
        score: countAliveCells(newGrid)
      };
    });
    
    historyRef.current = [];
  }, []);

  // Place Custom Drawn Pattern
  const placeCustomPattern = useCallback((coords: Coordinate[]) => {
      if (stateRef.current.patternsLeft <= 0 || coords.length === 0) return;

      const currentGrid = stateRef.current.grid;
      const currentRows = currentGrid.length;
      const currentCols = currentGrid[0]?.length || 0;
      const color = getRandomColor();

      setGameState(prev => {
          const newGrid = prev.grid.map(row => row.map(cell => ({ ...cell })));
          
          coords.forEach(pt => {
             const gridX = (pt.x + currentCols) % currentCols; 
             const gridY = (pt.y + currentRows) % currentRows;
             if (newGrid[gridY] && newGrid[gridY][gridX]) {
                 newGrid[gridY][gridX] = {
                     alive: true,
                     color: color,
                     id: Date.now()
                 };
             }
          });

          return {
              ...prev,
              grid: newGrid,
              patternsLeft: prev.patternsLeft - 1,
              isRunning: true,
              isStable: false,
              stabilizationGeneration: null,
              score: countAliveCells(newGrid)
          };
      });
      historyRef.current = [];
  }, []);

  // Game Loop
  const tick = useCallback((time: number) => {
    if (!stateRef.current.isRunning || stateRef.current.isStable) {
      animationFrameRef.current = requestAnimationFrame(tick);
      return;
    }

    if (time - lastTimeRef.current >= SIMULATION_SPEED_MS) {
      lastTimeRef.current = time;

      const nextGrid = computeNextGeneration(stateRef.current.grid);
      const currentHash = getGridHash(nextGrid);
      const score = countAliveCells(nextGrid);
      
      // Stability check
      const history = historyRef.current;
      const isStable = history.includes(currentHash);
      if (history.length > 10) history.shift();
      history.push(currentHash);

      setGameState(prev => {
          // If we just became stable, record the generation
          const justStabilized = isStable && !prev.isStable;
          
          return {
            ...prev,
            grid: nextGrid,
            generation: prev.generation + 1,
            score,
            highScore: Math.max(prev.highScore, score),
            isStable: isStable,
            stabilizationGeneration: justStabilized ? prev.generation + 1 : prev.stabilizationGeneration,
            isRunning: !isStable 
          };
      });
    }

    animationFrameRef.current = requestAnimationFrame(tick);
  }, []);

  // Start Loop
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [tick]);

  const togglePause = () => {
    setGameState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  return {
    gameState,
    placePattern,
    placeCustomPattern,
    resetGame,
    togglePause,
  };
};