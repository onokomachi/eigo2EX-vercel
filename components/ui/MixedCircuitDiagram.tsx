import React from 'react';
import { type MixedCircuitDiagramInfo } from '../../types';

interface MixedCircuitDiagramProps {
  info: MixedCircuitDiagramInfo;
}

const MixedCircuitDiagram: React.FC<MixedCircuitDiagramProps> = ({ info }) => {
  const { voltage, resistances } = info;
  
  const textStyle: React.CSSProperties = {
    fontFamily: "'Orbitron', sans-serif",
    fill: '#39ff14',
    paintOrder: 'stroke',
    stroke: '#051005',
    strokeWidth: '2px',
    strokeLinecap: 'butt',
    strokeLinejoin: 'miter',
    textAnchor: 'middle',
  };

  const wireStyle: React.SVGProps<SVGPathElement> = {
    stroke: "#39ff14",
    strokeWidth: "2",
    fill: "none",
    strokeLinejoin: "round",
    strokeLinecap: "round",
    className: "glow-primary",
  };
  
  const componentStyle: React.SVGProps<SVGGElement> = {
    stroke: "#39ff14",
    fill: "#0a200a",
    strokeWidth: "1.5",
  };

  const R1 = resistances.r1;
  const R2 = resistances.r2;
  const R3 = resistances.r3;

  return (
    <svg viewBox="0 0 280 140" className="w-full h-auto" aria-labelledby="circuitTitle" role="img">
      <title id="circuitTitle">混合電気回路図</title>
      
      {/* Wires */}
      <path d="M 20 70 L 20 20 L 90 20 M 20 70 L 20 120 L 100 120 M 180 120 L 260 120 L 260 70 L 260 20 L 190 20" {...wireStyle} />
      
      {/* R1 in series */}
      <g transform="translate(90 20)">
        <path d="M 0 -10 L 0 10 L 40 10 L 40 -10 Z" {...wireStyle} />
        <g transform="translate(0, -10)" {...componentStyle}>
          <rect x="0" y="0" width="40" height="20" />
          <text x="20" y="15" style={textStyle} fontSize="10">{R1.value}Ω</text>
          {R1.label && <text x="20" y="-3" style={textStyle} fontSize="8">{R1.label}</text>}
        </g>
      </g>
      <path d="M 130 20 L 140 20" {...wireStyle} />

      {/* Parallel part */}
      <path d="M 140 20 L 140 -10 L 190 -10 L 190 20 M 140 20 L 140 50 L 190 50 L 190 20" {...wireStyle} />
      
      {/* R2 */}
       <g transform="translate(140, -10)">
        <g transform="translate(0, -10)" {...componentStyle}>
          <rect x="0" y="0" width="50" height="20" />
          <text x="25" y="15" style={textStyle} fontSize="10">{R2.value}Ω</text>
          {R2.label && <text x="25" y="-3" style={textStyle} fontSize="8">{R2.label}</text>}
        </g>
      </g>

      {/* R3 */}
      <g transform="translate(140, 50)">
        <g transform="translate(0, -10)" {...componentStyle}>
          <rect x="0" y="0" width="50" height="20" />
          <text x="25" y="15" style={textStyle} fontSize="10">{R3.value}Ω</text>
          {R3.label && <text x="25" y="32" style={textStyle} fontSize="8">{R3.label}</text>}
        </g>
      </g>

      {/* Power Source */}
      <g transform="translate(140 120)" stroke="#39ff14" strokeWidth="1.5">
        <line x1="0" y1="-12" x2="0" y2="12" />
        <line x1="-8" y1="-6" x2="8" y2="-6" />
      </g>
      <text x="140" y="138" style={textStyle} fontSize="10">{voltage.value}V</text>

    </svg>
  );
};

export default MixedCircuitDiagram;
