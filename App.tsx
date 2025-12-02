import React, { useState, useEffect, useRef } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { Sidebar } from './components/Sidebar';
import { useGameEngine } from './hooks/useGameEngine';
import { CELL_SIZE } from './constants';
import { Coordinate } from './types';

function App() {
  const [gridSize, setGridSize] = useState({ rows: 0, cols: 0 });
  const [placementMode, setPlacementMode] = useState<'stamp' | 'draw'>('stamp');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
        if (!containerRef.current) return;
        const { clientWidth, clientHeight } = containerRef.current;
        // Ensure we have at least some dimensions
        if (clientWidth === 0 || clientHeight === 0) return;

        const cols = Math.floor(clientWidth / CELL_SIZE);
        const rows = Math.floor(clientHeight / CELL_SIZE);
        setGridSize({ rows, cols });
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    
    // Initial calculation
    updateSize();

    return () => observer.disconnect();
  }, []);

  const hasDimensions = gridSize.rows > 0;
  
  const { gameState, placePattern, placeCustomPattern, resetGame, togglePause } = useGameEngine(
    hasDimensions ? gridSize.rows : 10, 
    hasDimensions ? gridSize.cols : 10
  );

  const canPlace = gameState.patternsLeft > 0;

  const handleGridClick = (x: number, y: number) => {
    if (canPlace && placementMode === 'stamp') {
      placePattern(x, y);
    }
  };
  
  const handleDrawComplete = (coords: Coordinate[]) => {
      if (canPlace && placementMode === 'draw') {
          placeCustomPattern(coords);
      }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-slate-900 text-white overflow-hidden">
      <div ref={containerRef} className="flex-1 relative order-1 md:order-none overflow-hidden min-h-0">
        {hasDimensions && (
          <GameCanvas 
              grid={gameState.grid} 
              onGridClick={handleGridClick} 
              onDrawComplete={handleDrawComplete}
              mode={placementMode}
              canPlace={canPlace}
          />
        )}
      </div>

      <Sidebar 
        gameState={gameState}
        onReset={resetGame}
        onTogglePause={togglePause}
        onSetMode={setPlacementMode}
        currentMode={placementMode}
      />
    </div>
  );
}

export default App;