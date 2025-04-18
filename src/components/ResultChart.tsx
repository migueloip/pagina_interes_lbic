import React, { useEffect, useRef } from 'react';
import { CalculationResult } from './InteresCalculator';

interface ResultChartProps {
  results: CalculationResult[];
}

const ResultChart: React.FC<ResultChartProps> = ({ results }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (results.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Preparar datos
    const months = results.map(r => r.month);
    const balances = results.map(r => r.balance);
    const maxBalance = Math.max(...balances);
    const minBalance = Math.min(0, ...balances);

    // Configurar espacio para gráfico
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Dibujar ejes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.strokeStyle = '#333';
    ctx.stroke();

    // Dibujar línea de balance
    ctx.beginPath();
    const xStep = chartWidth / (months.length - 1 || 1);
    const yScale = chartHeight / (maxBalance - minBalance || 1);

    results.forEach((result, index) => {
      const x = padding + index * xStep;
      const y = canvas.height - padding - (result.balance - minBalance) * yScale;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dibujar puntos
    results.forEach((result, index) => {
      const x = padding + index * xStep;
      const y = canvas.height - padding - (result.balance - minBalance) * yScale;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#2563EB';
      ctx.fill();
    });

    // Dibujar etiquetas de eje X (meses)
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // Solo mostrar etiquetas en algunos meses para evitar aglomeración
    const labelStep = Math.max(1, Math.floor(months.length / 10));
    
    months.forEach((month, index) => {
      if (index % labelStep === 0 || index === months.length - 1) {
        const x = padding + index * xStep;
        ctx.fillText(`${month}`, x, canvas.height - padding + 20);
      }
    });

    // Dibujar etiquetas de eje Y (balance)
    ctx.textAlign = 'right';
    const yStep = chartHeight / 5;
    
    for (let i = 0; i <= 5; i++) {
      const y = canvas.height - padding - i * yStep;
      const value = minBalance + (maxBalance - minBalance) * (i / 5);
      ctx.fillText(`${value.toFixed(0)}€`, padding - 10, y + 5);
    }

  }, [results]);

  return (
    <div className="chart-container">
      <h3>Gráfico de Balance</h3>
      <canvas ref={canvasRef} width={600} height={400} />
    </div>
  );
};

export default ResultChart; 