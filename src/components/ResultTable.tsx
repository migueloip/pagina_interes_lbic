import React from 'react';
import { CalculationResult } from './InteresCalculator';

interface ResultTableProps {
  results: CalculationResult[];
}

const ResultTable: React.FC<ResultTableProps> = ({ results }) => {
  if (results.length === 0) {
    return <p>No hay resultados para mostrar. Por favor, calcula primero.</p>;
  }

  return (
    <div className="results-table-container">
      <h3>Resultados</h3>
      <table className="results-table">
        <thead>
          <tr>
            <th>Mes</th>
            <th>Interés Ganado</th>
            <th>Depósito</th>
            <th>Balance Total</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row) => (
            <tr key={row.month}>
              <td>{row.month}</td>
              <td>{row.interest.toFixed(2)} $</td>
              <td>{row.deposit.toFixed(2)} $</td>
              <td>{row.balance.toFixed(2)} $</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable; 