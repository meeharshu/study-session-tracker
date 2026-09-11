import React, { useState, useMemo } from 'react';
import { useStudy } from '../../context/StudyContext';
import { getHeatmapData } from '../../utils/statistics';
import { formatDuration } from '../../utils/formatTime';

export default function StudyHeatmap() {
  const { state } = useStudy();
  const WEEKS = 16;
  const data = useMemo(() => getHeatmapData(state.sessions, WEEKS), [state.sessions]);

  const CELL_SIZE = 12;
  const CELL_GAP = 3;
  const CELL_TOTAL = CELL_SIZE + CELL_GAP;
  const ROWS = 7;
  
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  
  const handleMouseEnter = (index: number, e: React.MouseEvent<SVGRectElement>) => {
    setHoveredCell(index);
    const rect = e.currentTarget.getBoundingClientRect();
    const svgRect = e.currentTarget.closest('svg')?.getBoundingClientRect();
    if (svgRect) {
      setTooltipPos({
        x: rect.left - svgRect.left + rect.width / 2,
        y: rect.top - svgRect.top - 8,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  const months: { label: string; x: number }[] = [];
  for (let c = 0; c < WEEKS; c++) {
    const idx = c * 7;
    if (idx < data.length) {
      const d = new Date(data[idx].date);
      if (c === 0) {
        months.push({ label: d.toLocaleDateString('en-US', { month: 'short' }), x: c * CELL_TOTAL });
      } else {
        const prevD = new Date(data[(c - 1) * 7].date);
        if (d.getMonth() !== prevD.getMonth()) {
          months.push({ label: d.toLocaleDateString('en-US', { month: 'short' }), x: c * CELL_TOTAL });
        }
      }
    }
  }

  const svgWidth = WEEKS * CELL_TOTAL + 30;
  const svgHeight = ROWS * CELL_TOTAL + 20;

  return (
    <div className="relative w-full">
      <div className="font-label mb-4">STUDY ACTIVITY</div>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto overflow-visible"
        preserveAspectRatio="xMinYMin meet"
      >
        <g transform="translate(30, 20)">
          {months.map((m, i) => (
            <text key={i} x={m.x} y={-8} fontSize="10" fill="var(--text-tertiary)" className="font-sans">
              {m.label}
            </text>
          ))}
          
          <text x={-25} y={CELL_TOTAL * 1 - 4} fontSize="10" fill="var(--text-tertiary)" className="font-sans">Mon</text>
          <text x={-25} y={CELL_TOTAL * 3 - 4} fontSize="10" fill="var(--text-tertiary)" className="font-sans">Wed</text>
          <text x={-25} y={CELL_TOTAL * 5 - 4} fontSize="10" fill="var(--text-tertiary)" className="font-sans">Fri</text>

          {data.map((cell, i) => {
            const col = Math.floor(i / 7);
            const row = i % 7;
            const x = col * CELL_TOTAL;
            const y = row * CELL_TOTAL;
            
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx={2}
                fill={`var(--heatmap-${cell.level})`}
                onMouseEnter={(e) => handleMouseEnter(i, e)}
                onMouseLeave={handleMouseLeave}
                className="transition-colors duration-200"
              />
            );
          })}
        </g>
      </svg>
      
      {hoveredCell !== null && data[hoveredCell] && (
        <div
          className="heatmap-tooltip transition-opacity duration-200"
          style={{
            left: `${tooltipPos.x + 30}px`,
            top: `${tooltipPos.y + 20}px`,
            transform: 'translate(-50%, -100%)',
            opacity: 1,
            position: 'absolute'
          }}
        >
          <div className="font-medium text-[color:var(--text-primary)] mb-1">
            {new Date(data[hoveredCell].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div className="text-[color:var(--text-secondary)]">
            {formatDuration(data[hoveredCell].minutes)} · {data[hoveredCell].sessions} {data[hoveredCell].sessions === 1 ? 'session' : 'sessions'}
          </div>
        </div>
      )}
    </div>
  );
}
