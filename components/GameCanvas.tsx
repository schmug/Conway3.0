import React, { useRef, useEffect, useState } from 'react';
import { Grid, Coordinate } from '../types';
import { CELL_SIZE } from '../constants';

interface GameCanvasProps {
  grid: Grid;
  onGridClick: (x: number, y: number) => void;
  onDrawComplete: (coords: Coordinate[]) => void;
  mode: 'stamp' | 'draw';
  canPlace: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ 
    grid, 
    onGridClick, 
    onDrawComplete, 
    mode, 
    canPlace 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // Drawing state
  const [isDragging, setIsDragging] = useState(false);
  const [drawnPixels, setDrawnPixels] = useState<Coordinate[]>([]);
  const currentDrawRef = useRef<Set<string>>(new Set());

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
        observer.observe(containerRef.current);
    }
    
    // Initial call
    handleResize();

    return () => observer.disconnect();
  }, []);

  // Render Grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    ctx.fillStyle = '#0f172a'; // bg-slate-900
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    const rows = grid.length;
    const cols = grid[0]?.length || 0;
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = grid[y][x];
        if (cell.alive) {
          ctx.fillStyle = cell.color;
          ctx.fillRect(
            x * CELL_SIZE + 1, 
            y * CELL_SIZE + 1, 
            CELL_SIZE - 1, 
            CELL_SIZE - 1
          );
        } else {
             ctx.fillStyle = '#1e293b'; // slightly lighter for grid lines
             ctx.fillRect(x * CELL_SIZE + (CELL_SIZE/2) - 0.5, y * CELL_SIZE + (CELL_SIZE/2) - 0.5, 1, 1);
        }
      }
    }

    // Render Preview Line if drawing
    if (isDragging && drawnPixels.length > 0) {
        ctx.fillStyle = '#ffffff';
        for (const p of drawnPixels) {
            ctx.fillRect(
                p.x * CELL_SIZE + 1,
                p.y * CELL_SIZE + 1,
                CELL_SIZE - 1,
                CELL_SIZE - 1
            );
        }
    }
  }, [grid, dimensions, drawnPixels, isDragging]);

  const getGridCoords = (e: React.MouseEvent) => {
      if (!canvasRef.current) return null;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return {
          x: Math.floor(x / CELL_SIZE),
          y: Math.floor(y / CELL_SIZE)
      };
  };

  const getGridCoordsFromTouch = (touch: React.Touch) => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    return {
        x: Math.floor(x / CELL_SIZE),
        y: Math.floor(y / CELL_SIZE)
    };
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
      if (!canPlace) return;
      const coords = getGridCoords(e);
      if (!coords) return;

      if (mode === 'draw') {
          setIsDragging(true);
          currentDrawRef.current = new Set();
          const key = `${coords.x},${coords.y}`;
          currentDrawRef.current.add(key);
          setDrawnPixels([coords]);
      }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (mode === 'draw' && isDragging) {
          const coords = getGridCoords(e);
          if (!coords) return;
          
          const key = `${coords.x},${coords.y}`;
          if (!currentDrawRef.current.has(key)) {
              currentDrawRef.current.add(key);
              setDrawnPixels(prev => [...prev, coords]);
          }
      }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
      const coords = getGridCoords(e);
      
      if (mode === 'stamp') {
          if (coords) onGridClick(coords.x, coords.y);
      } else if (mode === 'draw' && isDragging) {
          setIsDragging(false);
          onDrawComplete(drawnPixels);
          setDrawnPixels([]);
          currentDrawRef.current.clear();
      }
  };

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!canPlace) return;
    const touch = e.touches[0];
    const coords = getGridCoordsFromTouch(touch);
    if (!coords) return;

    if (mode === 'draw') {
        setIsDragging(true);
        currentDrawRef.current = new Set();
        const key = `${coords.x},${coords.y}`;
        currentDrawRef.current.add(key);
        setDrawnPixels([coords]);
    } else if (mode === 'stamp') {
       // For touch, we might want to trigger on End to avoid ghost clicks, 
       // but tapping is usually Start or End. Let's do nothing on Start for stamp, 
       // and handle it on End to prevent dragging while stamping.
       // Actually, easiest is to detect a 'tap'. 
       // For simplicity, stamp on start is fine if it doesn't drag.
       onGridClick(coords.x, coords.y);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (mode === 'draw' && isDragging) {
        const touch = e.touches[0];
        const coords = getGridCoordsFromTouch(touch);
        if (!coords) return;
        
        const key = `${coords.x},${coords.y}`;
        if (!currentDrawRef.current.has(key)) {
            currentDrawRef.current.add(key);
            setDrawnPixels(prev => [...prev, coords]);
        }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
      if (mode === 'draw' && isDragging) {
          setIsDragging(false);
          onDrawComplete(drawnPixels);
          setDrawnPixels([]);
          currentDrawRef.current.clear();
      }
  };

  return (
    <div ref={containerRef} className={`flex-1 relative h-full w-full overflow-hidden ${canPlace ? (mode === 'draw' ? 'cursor-crosshair' : 'cursor-pointer') : 'cursor-default'}`}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
            if (isDragging) {
                setIsDragging(false);
                setDrawnPixels([]);
                currentDrawRef.current.clear();
            }
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="block touch-none"
      />
      {canPlace && !isDragging && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
             <div className="bg-black/60 text-white px-4 py-2 rounded-full text-xs md:text-sm font-semibold backdrop-blur-sm border border-white/10 shadow-lg whitespace-nowrap">
                {mode === 'stamp' ? 'Tap/Click to Spawn' : 'Drag to Draw'}
             </div>
        </div>
      )}
    </div>
  );
};