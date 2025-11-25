import React from 'react';
import { type JapaneseWeatherSymbolInfo } from '../../types';

interface WeatherSymbolDiagramProps {
  info: JapaneseWeatherSymbolInfo;
}

const WeatherSymbolDiagram: React.FC<WeatherSymbolDiagramProps> = ({ info }) => {
  const { weather } = info;
  
  const baseStyle: React.SVGAttributes<SVGElement> = {
    stroke: "#39ff14",
    strokeWidth: "2",
    fill: "none",
    strokeLinejoin: "round",
    strokeLinecap: "round",
  };

  const fillStyle: React.SVGAttributes<SVGElement> = {
    ...baseStyle,
    fill: "#39ff14",
  };

  const renderWeatherSymbol = () => {
    switch (weather) {
      case 'kaisei':
        return <circle cx="0" cy="0" r="20" {...baseStyle} />;
      case 'hare':
        return (
          <g {...baseStyle}>
            <circle cx="0" cy="0" r="20" />
            <line x1="0" y1="-20" x2="0" y2="20" />
          </g>
        );
      case 'kumori':
        return (
          <g {...baseStyle}>
            <circle cx="0" cy="0" r="20" fill="#0a200a" />
            <circle cx="0" cy="0" r="10" {...fillStyle} />
          </g>
        );
      case 'ame':
        return <circle cx="0" cy="0" r="20" {...fillStyle} />;
      case 'yuki':
        return (
          <g {...baseStyle}>
            <circle cx="0" cy="0" r="20" />
            <line x1="-15" y1="0" x2="15" y2="0" />
            <line x1="-7.5" y1="-13" x2="7.5" y2="13" />
            <line x1="7.5" y1="-13" x2="-7.5" y2="13" />
          </g>
        );
      case 'kiri':
         return (
          <g {...baseStyle}>
             <circle cx="0" cy="0" r="20" fill="#0a200a" />
             <circle cx="0" cy="0" r="14" />
             <circle cx="0" cy="0" r="6" {...fillStyle} />
          </g>
        );
      case 'hyou':
        return (
            <g {...baseStyle}>
                <circle cx="0" cy="0" r="20" />
                <polygon points="0,-12 14,10 -14,10" {...fillStyle} />
            </g>
        );
      case 'arare':
        return (
            <g {...baseStyle}>
                <circle cx="0" cy="0" r="20" />
                <polygon points="0,-12 14,10 -14,10" />
            </g>
        );
      case 'kaminari':
        return (
            <g {...baseStyle}>
                <circle cx="0" cy="0" r="20" />
                <path d="M -20,0 A 20 20 0 0 1 20 0 Z" {...fillStyle} />
            </g>
        );
      case 'mizore':
        return (
            <g {...baseStyle}>
                <circle cx="0" cy="0" r="20" />
                <path d="M -20,0 A 20 20 0 0 1 20 0 Z" {...fillStyle} />
                <path d="M -12, -15 L -6, -5 M 6,-15 L 12,-5" />
            </g>
        );
      default:
        return null;
    }
  };

  return (
    <svg viewBox="-30 -30 60 60" className="w-24 h-24 mx-auto glow-primary" aria-labelledby="weatherTitle" role="img">
      <title id="weatherTitle">天気記号: {weather}</title>
      {renderWeatherSymbol()}
    </svg>
  );
};

export default WeatherSymbolDiagram;