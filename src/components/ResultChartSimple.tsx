import React, { useEffect, useState } from 'react';
import { CalculationResult } from './InteresCalculator';

interface ResultChartSimpleProps {
  results: CalculationResult[];
}

const ResultChartSimple: React.FC<ResultChartSimpleProps> = ({ results }) => {
  const [dimensions, setDimensions] = useState({ width: 600, height: 300 });

  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector('.right-column');
      if (container) {
        const width = container.clientWidth - 80; // Restar padding
        setDimensions({
          width: Math.max(300, width),
          height: 300
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (results.length === 0) {
    return <p>No hay datos para mostrar.</p>;
  }

  const maxBalance = Math.max(...results.map(r => r.balance));
  const chartHeight = dimensions.height;
  const chartWidth = dimensions.width;
  const barWidth = chartWidth / results.length;

  // Crear puntos para la línea quebrada
  const createPolylinePoints = () => {
    return results.map((result, index) => {
      const x = index * barWidth + barWidth / 2;
      const y = chartHeight - (result.balance / maxBalance) * chartHeight;
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="simple-chart-container">
      <h3>Evolución del Balance</h3>
      <div className="chart-wrapper" style={{ height: `${chartHeight}px`, width: '100%', position: 'relative' }}>
        {/* Eje Y - Valores */}
        <div className="y-axis" style={{ position: 'absolute', left: 0, top: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ textAlign: 'right', fontSize: '12px' }}>
              {((maxBalance / 4) * (4 - i)).toFixed(0)}$
            </div>
          ))}
        </div>

        {/* Líneas horizontales de guía */}
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            style={{ 
              position: 'absolute', 
              left: '35px', 
              right: 0, 
              top: `${(chartHeight / 4) * i}px`, 
              height: '1px', 
              backgroundColor: '#e2e8f0' 
            }}
          />
        ))}

        {/* Gráfico SVG */}
        <svg 
          width="100%" 
          height="100%" 
          style={{ position: 'absolute', left: '40px', top: 0, overflow: 'visible' }}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
        >
          {/* Línea de balance */}
          <polyline
            points={createPolylinePoints()}
            fill="none"
            stroke="#2563EB"
            strokeWidth="2"
          />
          
          {/* Puntos en cada mes */}
          {results.map((result, index) => {
            const x = index * barWidth + barWidth / 2;
            const y = chartHeight - (result.balance / maxBalance) * chartHeight;
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#2563EB"
                />
                {/* Mostrar etiquetas solo en algunos meses */}
                {(index % Math.max(1, Math.floor(results.length / 6)) === 0 || index === results.length - 1) && (
                  <text
                    x={x}
                    y={chartHeight + 15}
                    fontSize="11px"
                    textAnchor="middle"
                    fill="#475569"
                  >
                    {result.month}
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Área sombreada bajo la línea */}
          <polygon
            points={`${barWidth/2},${chartHeight} ${createPolylinePoints()} ${results.length * barWidth - barWidth/2},${chartHeight}`}
            fill="url(#gradientFill)"
            opacity="0.2"
          />
          
          {/* Definición de gradiente */}
          <defs>
            <linearGradient id="gradientFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="chart-info">
        <p><strong>Balance final:</strong> {results[results.length - 1].balance.toFixed(2)}$</p>
      </div>
    </div>
  );
};

export default ResultChartSimple; 