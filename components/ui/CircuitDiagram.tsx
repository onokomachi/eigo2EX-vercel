import React from 'react';
import { type CircuitDiagramInfo } from '../../types';

interface CircuitDiagramProps {
  info: CircuitDiagramInfo;
}

const CircuitDiagram: React.FC<CircuitDiagramProps> = ({ info }) => {
  const { layout, voltage, resistances, currents } = info;
  
  const textStyle: React.CSSProperties = {
    fontFamily: "'Orbitron', sans-serif",
    fill: '#39ff14',
    paintOrder: 'stroke',
    stroke: '#051005',
    strokeWidth: '2px',
    strokeLinecap: 'butt',
    strokeLinejoin: 'miter',
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

  const renderSeries = () => (
    <g>
      <path d="M 30 60 L 30 20 L 190 20 L 190 60 M 190 60 L 190 100 L 140 100 M 80 100 L 30 100 L 30 60" {...wireStyle} />
      {/* Resistor */}
      <g transform="translate(90 10)" {...componentStyle}>
        <rect x="0" y="0" width="40" height="20" />
        <text x="20" y="15" textAnchor="middle" style={textStyle} fontSize="10">{resistances[0]?.value || 'R'}Ω</text>
      </g>
    </g>
  );

  const renderParallel = () => (
    <g>
        {/* Main path */}
        <path d="M 30 60 L 30 20 L 60 20 M 160 20 L 190 20 L 190 60 M 190 60 L 190 100 L 140 100 M 80 100 L 30 100 L 30 60" {...wireStyle} />
        {/* Branch path */}
        <path d="M 60 20 L 60 45 L 160 45 L 160 20 M 60 20 L 60 -5 L 160 -5 L 160 20" {...wireStyle} />

        {/* Resistors */}
        <g transform="translate(90 -15)" {...componentStyle}>
          <rect x="0" y="0" width="40" height="20" />
          <text x="20" y="15" textAnchor="middle" style={textStyle} fontSize="10">{resistances[0]?.value || 'R1'}Ω</text>
          {resistances[0]?.label && <text x="20" y="-3" textAnchor="middle" style={textStyle} fontSize="8">{resistances[0].label}</text>}
        </g>
        <g transform="translate(90 35)" {...componentStyle}>
          <rect x="0" y="0" width="40" height="20" />
          <text x="20" y="15" textAnchor="middle" style={textStyle} fontSize="10">{resistances[1]?.value || 'R2'}Ω</text>
           {resistances[1]?.label && <text x="20" y="-3" textAnchor="middle" style={textStyle} fontSize="8">{resistances[1].label}</text>}
        </g>
    </g>
  );

  const totalCurrent = currents.find(c => c.point === 'total');

  return (
    <svg viewBox="0 0 220 120" className="w-full h-auto" aria-labelledby="circuitTitle" role="img">
      <title id="circuitTitle">電気回路図</title>
      
      {layout === 'series' ? renderSeries() : renderParallel()}
      
      {/* Ammeter */}
      <g transform="translate(175 60)" {...componentStyle}>
        <circle cx="0" cy="0" r="15" />
        <text x="0" y="5" textAnchor="middle" style={textStyle} fontSize="14">A</text>
      </g>
      {totalCurrent && <text x="175" y="50" textAnchor="middle" style={textStyle} fontSize="10">{totalCurrent.value}{typeof totalCurrent.value === 'number' ? 'A' : ''}</text>}
      
      {/* Power Source */}
      <g transform="translate(110 100)" stroke="#39ff14" strokeWidth="1.5">
        <line x1="0" y1="-12" x2="0" y2="12" />
        <line x1="-8" y1="-6" x2="8" y2="-6" />
      </g>
      <text x="110" y="118" textAnchor="middle" style={textStyle} fontSize="10">{voltage.value}V</text>

    </svg>
  );
};

export default CircuitDiagram;
