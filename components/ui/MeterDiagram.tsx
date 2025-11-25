import React from 'react';
import { type MeterDiagramInfo } from '../../types';

interface MeterDiagramProps {
  info: MeterDiagramInfo;
}

const MeterDiagram: React.FC<MeterDiagramProps> = ({ info }) => {
  const { meterType, unit, maxValue, value } = info;

  const angleRange = 270;
  const startAngle = -135;
  const angle = startAngle + (value / maxValue) * angleRange;
  
  const textStyle: React.CSSProperties = {
    fontFamily: "'Orbitron', sans-serif",
    fill: '#39ff14',
    textAnchor: 'middle',
  };

  const numTicks = 5;
  const ticks = Array.from({ length: numTicks + 1 }, (_, i) => {
    const tickValue = (maxValue / numTicks) * i;
    const tickAngle = startAngle + (i / numTicks) * angleRange;
    return {
      value: tickValue,
      angle: tickAngle,
    };
  });

  return (
    <svg viewBox="-100 -100 200 120" className="w-full h-auto" aria-labelledby="meterTitle" role="img">
      <title id="meterTitle">{meterType === 'ammeter' ? '電流計' : '電圧計'}の図</title>
      
      <path d="M -90 0 A 90 90 0 0 1 90 0 L 95 -10 L 95 -80 L -95 -80 L -95 -10 Z" fill="#0a200a" stroke="#39ff14" strokeWidth="2" className="glow-primary"/>
      <rect x="-85" y="-75" width="170" height="70" fill="#051005" />

      {ticks.map((tick, index) => (
        <g key={index} transform={`rotate(${tick.angle})`}>
          <line x1="0" y1="-70" x2="0" y2="-65" stroke="#39ff14" strokeWidth="1.5" />
          <text
            x="0"
            y="-50"
            transform={`rotate(${-tick.angle})`}
            style={{...textStyle, fontSize: '10px'}}
          >
            {tick.value}
          </text>
        </g>
      ))}

      <g transform={`rotate(${angle})`}>
        <polygon points="0,0 -3,-60 3,-60" fill="#ff4d4d" stroke="red" strokeWidth="0.5" />
      </g>
      <circle cx="0" cy="0" r="5" fill="#39ff14" />

      <text x="0" y="-15" style={{...textStyle, fontSize: '24px' }}>
        {meterType === 'ammeter' ? 'A' : 'V'}
      </text>
      <text x="0" y="15" style={{...textStyle, fontSize: '10px' }}>
        ({unit})
      </text>
    </svg>
  );
};

export default MeterDiagram;
