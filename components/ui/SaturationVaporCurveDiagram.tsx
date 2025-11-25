import React from 'react';
import { type SaturationVaporCurveInfo } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, Label } from 'recharts';

interface SaturationVaporCurveDiagramProps {
  info: SaturationVaporCurveInfo;
}

const SaturationVaporCurveDiagram: React.FC<SaturationVaporCurveDiagramProps> = ({ info }) => {
  const { curvePoints, currentPoint } = info;
  
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={curvePoints} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis 
          type="number" 
          dataKey="temp" 
          name="気温" 
          unit="℃" 
          domain={[0, Math.max(...curvePoints.map(p => p.temp))]} 
          tick={{ fill: '#9ca3af', fontSize: 12 }}
        >
           <Label value="気温 (°C)" offset={-15} position="insideBottom" fill="#e0e0e0" />
        </XAxis>
        <YAxis 
          type="number" 
          dataKey="amount" 
          name="水蒸気量" 
          unit="g/m³" 
          domain={[0, Math.max(...curvePoints.map(p => p.amount)) + 5]}
          tick={{ fill: '#9ca3af', fontSize: 12 }}
        >
           <Label value="水蒸気量 (g/m³)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: '#e0e0e0' }} />
        </YAxis>
        <Tooltip
          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #39ff14' }}
          labelStyle={{ color: '#39ff14' }}
          formatter={(value: number, name: string) => [`${value} g/m³`, name]}
          labelFormatter={(label) => `気温: ${label}°C`}
        />
        <Line type="monotone" dataKey="amount" stroke="#39ff14" name="飽和水蒸気量" dot={false} strokeWidth={2} />
        <ReferenceDot x={currentPoint.temp} y={currentPoint.amount} r={5} fill="#ff4d4d" stroke="white" ifOverflow="visible">
            <Label value="A" position="right" fill="#ff4d4d" fontSize="14" fontWeight="bold" />
        </ReferenceDot>
        {info.dewPointTemp &&
             <ReferenceDot x={info.dewPointTemp} y={currentPoint.amount} r={5} fill="cyan" stroke="white" ifOverflow="visible">
                <Label value="露点" position="bottom" fill="cyan" fontSize="12" />
             </ReferenceDot>
        }
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SaturationVaporCurveDiagram;