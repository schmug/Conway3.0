import React from 'react';
import { Play, Pause, RotateCcw, MousePointer2, Trophy, Activity, PenTool, ExternalLink, Hexagon } from 'lucide-react';
import { GameState } from '../types';

interface SidebarProps {
  gameState: GameState;
  onReset: () => void;
  onTogglePause: () => void;
  onSetMode: (mode: 'stamp' | 'draw') => void;
  currentMode: 'stamp' | 'draw';
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  gameState, 
  onReset, 
  onTogglePause, 
  onSetMode,
  currentMode
}) => {
  return (
    <div className="w-full md:w-80 h-auto md:h-full bg-slate-800 border-t md:border-t-0 md:border-l border-slate-700 flex flex-row md:flex-col p-3 md:p-6 shadow-2xl z-10 shrink-0 gap-4 md:gap-0 items-center md:items-stretch overflow-x-auto md:overflow-visible">
      <div className="hidden md:block">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-2">
          Chromatic Life
        </h1>
        <p className="text-xs text-slate-400 mb-6 font-mono">
          B3/S23 • Collision Blend
        </p>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-row md:grid md:grid-cols-2 gap-2 md:gap-3 mb-0 md:mb-6 shrink-0">
        <div className="bg-slate-700/50 p-2 md:p-3 rounded-lg border border-slate-600 min-w-[80px]">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Activity size={14} />
            <span className="text-[10px] md:text-xs uppercase tracking-wider hidden md:inline">Score</span>
          </div>
          <div className="text-lg md:text-2xl font-bold text-white">{gameState.score}</div>
        </div>
        <div className="bg-slate-700/50 p-2 md:p-3 rounded-lg border border-slate-600 min-w-[80px]">
          <div className="flex items-center gap-2 text-yellow-500 mb-1">
            <Trophy size={14} />
            <span className="text-[10px] md:text-xs uppercase tracking-wider text-slate-400 hidden md:inline">High</span>
          </div>
          <div className="text-lg md:text-2xl font-bold text-yellow-400">{gameState.highScore}</div>
        </div>
      </div>

      <div className="hidden md:block bg-slate-700/30 p-4 rounded-xl border border-slate-600 mb-8">
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-300 font-medium">Patterns Left</span>
            <span className="text-sm font-bold text-cyan-400">{gameState.patternsLeft}/10</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
                className="bg-cyan-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${(gameState.patternsLeft / 10) * 100}%` }}
            ></div>
        </div>
      </div>
      
      {/* Mobile Pattern Counter */}
      <div className="md:hidden flex flex-col items-center justify-center shrink-0">
         <div className="text-xs text-slate-400 font-bold uppercase">Left</div>
         <div className={`text-xl font-bold ${gameState.patternsLeft > 0 ? 'text-cyan-400' : 'text-slate-500'}`}>{gameState.patternsLeft}</div>
      </div>

      {/* Tool Selection */}
      <div className="flex-1 md:flex-none md:mb-6 flex justify-center md:block">
          <label className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2 hidden md:block">Placement Tool</label>
          <div className="flex md:grid md:grid-cols-2 gap-2 p-1 bg-slate-900 rounded-lg">
              <button
                onClick={() => onSetMode('stamp')}
                disabled={gameState.patternsLeft === 0}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-bold transition-all ${
                    currentMode === 'stamp' && gameState.patternsLeft > 0
                        ? 'bg-slate-700 text-cyan-400 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-300'
                } ${gameState.patternsLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Stamp Pattern"
              >
                  <Hexagon size={18} />
                  <span className="hidden md:inline">Preset</span>
              </button>
              <button
                onClick={() => onSetMode('draw')}
                disabled={gameState.patternsLeft === 0}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-bold transition-all ${
                    currentMode === 'draw' && gameState.patternsLeft > 0
                        ? 'bg-slate-700 text-cyan-400 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-300'
                } ${gameState.patternsLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Draw Pattern"
              >
                  <PenTool size={18} />
                  <span className="hidden md:inline">Draw</span>
              </button>
          </div>
      </div>

      {/* Controls */}
      <div className="space-y-3 md:mb-8 shrink-0">
        <div className="flex md:grid md:grid-cols-2 gap-2 md:gap-3">
          <button
            onClick={onTogglePause}
            className={`flex items-center justify-center gap-2 py-2 md:py-3 px-3 md:px-4 rounded-lg font-bold transition-colors ${
              gameState.isRunning 
                ? 'bg-amber-500 hover:bg-amber-400 text-white' 
                : 'bg-green-500 hover:bg-green-400 text-white'
            }`}
          >
            {gameState.isRunning ? <Pause size={18} /> : <Play size={18} />}
            <span className="hidden md:inline">{gameState.isRunning ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center justify-center gap-2 py-2 md:py-3 px-3 md:px-4 rounded-lg font-bold bg-slate-600 hover:bg-slate-500 text-white transition-colors"
          >
            <RotateCcw size={18} />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Status Messages */}
      <div className="hidden md:block flex-1 space-y-3">
        {gameState.isStable && gameState.score > 0 && (
          <div className="p-4 bg-purple-900/50 border border-purple-500/50 rounded-lg animate-pulse">
            <h3 className="font-bold text-purple-200 mb-1">Simulation Stabilized</h3>
            <p className="text-sm text-purple-300">
                Stabilized at Gen: <span className="font-mono font-bold">{gameState.stabilizationGeneration}</span>
            </p>
          </div>
        )}
        
        {gameState.patternsLeft === 0 && !gameState.isStable && (
            <div className="p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-200">Out of patterns! Watch the evolution settle.</p>
            </div>
        )}
      </div>

      {/* Footer / Info */}
      <div className="hidden md:block mt-auto pt-6 border-t border-slate-700">
        <a 
            href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400 transition-colors"
        >
            <ExternalLink size={12} />
            Learn about Conway's Game of Life
        </a>
      </div>
    </div>
  );
};