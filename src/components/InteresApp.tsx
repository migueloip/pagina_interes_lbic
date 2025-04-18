import React, { useState } from 'react';
import InteresCalculator, { CalculationResult } from './InteresCalculator';
import ResultTable from './ResultTable';
import ResultChartSimple from './ResultChartSimple';
import logoLiceo from '../assets/Logo liceo.png';
import logoEspecialidad from '../assets/logo_especialidad.png';

const InteresApp: React.FC = () => {
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [showSummary, setShowSummary] = useState<boolean>(true);
  const [showTable, setShowTable] = useState<boolean>(false);

  const handleCalculate = (data: CalculationResult[]) => {
    setResults(data);
  };

  const renderSummary = () => {
    if (results.length === 0) return null;

    const initialBalance = results[0].balance - results[0].interest - results[0].deposit;
    const finalBalance = results[results.length - 1].balance;
    const totalInterest = results.reduce((sum, row) => sum + row.interest, 0);
    const totalDeposits = results.reduce((sum, row) => sum + row.deposit, 0);
    const gain = finalBalance - initialBalance - totalDeposits;

    return (
      <div className="summary-container">
        <h3>Resumen</h3>
        <div className="summary-stats">
          <div className="stat-card">
            <span className="stat-label">Capital Inicial</span>
            <span className="stat-value">{initialBalance.toFixed(2)} $</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Aportaciones Totales</span>
            <span className="stat-value">{totalDeposits.toFixed(2)} $</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Intereses Ganados</span>
            <span className="stat-value">{totalInterest.toFixed(2)} $</span>
          </div>
          <div className="stat-card highlight">
            <span className="stat-label">Balance Final</span>
            <span className="stat-value">{finalBalance.toFixed(2)} $</span>
          </div>
          <div className="stat-card highlight">
            <span className="stat-label">Ganancia Total</span>
            <span className="stat-value">{gain.toFixed(2)} $</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <img src={logoLiceo} alt="Logo del Liceo" className="school-logo" />
          <img src={logoEspecialidad} alt="Logo de Especialidad" className="specialty-logo" />
        </div>
        <h1>Calculadora de Intereses L.B.I.C</h1>
        <p className="app-description">
          Calcula y visualiza tus ahorros con interés compuesto. 
          Puedes añadir aportaciones periódicas y elegir diferentes tipos de interés.
        </p>
      </header>
      
      <div className="main-content">
        <div className="left-column">
          <InteresCalculator onCalculate={handleCalculate} />
          
          {results.length > 0 && (
            <div className="results-section">
              {showSummary && renderSummary()}
              
              <div className="results-actions">
                <button 
                  className="toggle-button"
                  onClick={() => setShowTable(!showTable)}
                >
                  <span className="button-icon">{showTable ? '📊' : '📈'}</span>
                  {showTable ? 'Ocultar Tabla' : 'Mostrar Tabla'}
                </button>
                <button 
                  className="toggle-button"
                  onClick={() => setShowSummary(!showSummary)}
                >
                  <span className="button-icon">{showSummary ? '📋' : '📝'}</span>
                  {showSummary ? 'Ocultar Resumen' : 'Mostrar Resumen'}
                </button>
              </div>
              
              {showTable && (
                <div className="table-wrapper">
                  <ResultTable results={results} />
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="right-column">
          {results.length > 0 ? (
            <ResultChartSimple results={results} />
          ) : (
            <div className="placeholder-chart">
              <h3>Gráfico de Balance</h3>
              <p>Completa los datos y calcula para ver la gráfica de resultados</p>
              <div className="chart-placeholder-icon">📊</div>
            </div>
          )}
        </div>
      </div>
      
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logos">
            <img src={logoLiceo} alt="Logo del Liceo" className="footer-logo" />
            <img src={logoEspecialidad} alt="Logo de Especialidad" className="footer-logo" />
          </div>
          <div className="footer-info">
            <p>Proyecto creado por:</p>
            <p className="author">Miguel Angel Figueroa Muñoz</p>
            <p>4°G Especialidad de Programación</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InteresApp; 