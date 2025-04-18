import { useState, useEffect } from 'react';

interface InteresCalculatorProps {
  onCalculate: (data: CalculationResult[]) => void;
}

export interface CalculationResult {
  month: number;
  balance: number;
  interest: number;
  deposit: number;
}

const InteresCalculator: React.FC<InteresCalculatorProps> = ({ onCalculate }) => {
  const [capital, setCapital] = useState<number>(1000);
  const [rate, setRate] = useState<number>(5);
  const [months, setMonths] = useState<number>(12);
  const [interestType, setInterestType] = useState<string>("mensual");
  const [periodicDeposit, setPeriodicDeposit] = useState<number>(0);
  const [depositFrequency, setDepositFrequency] = useState<string>("mensual");

  const handleCalculate = () => {
    const results: CalculationResult[] = [];
    let balance = capital;
    
    // Convertir tasa según tipo de interés
    let monthlyRate = rate / 100;
    if (interestType === "anual") monthlyRate = monthlyRate / 12;
    if (interestType === "trimestral") monthlyRate = monthlyRate / 3;
    if (interestType === "diario") monthlyRate = monthlyRate * 30;

    for (let month = 1; month <= months; month++) {
      // Calcular interés del mes
      const monthlyInterest = balance * monthlyRate;
      
      // Determinar si hay depósito este mes
      let deposit = 0;
      if (depositFrequency === "mensual" || 
         (depositFrequency === "trimestral" && month % 3 === 0) ||
         (depositFrequency === "anual" && month % 12 === 0)) {
        deposit = periodicDeposit;
      }
      
      // Actualizar balance
      balance += monthlyInterest + deposit;
      
      // Guardar resultados
      results.push({
        month,
        balance,
        interest: monthlyInterest,
        deposit
      });
    }
    
    onCalculate(results);
  };

  return (
    <div className="calculator-container">
      <h2>Calculadora de Intereses</h2>
      
      <div className="input-group">
        <label className="input-label">
          Capital inicial ($):
          <input 
            type="number" 
            value={capital} 
            onChange={(e) => setCapital(Number(e.target.value))}
            min="0"
            className="form-input"
          />
        </label>
      </div>
      
      <div className="input-group interest-rate-row">
        <label className="rate-label">
          Tasa de interés (%):
          <input 
            type="number" 
            value={rate} 
            onChange={(e) => setRate(Number(e.target.value))}
            min="0"
            step="0.01"
            className="rate-input"
          />
        </label>
        
        <label className="type-label">
          Tipo de interés:
          <select 
            value={interestType} 
            onChange={(e) => setInterestType(e.target.value)}
            className="type-select"
          >
            <option value="diario">Diario</option>
            <option value="mensual">Mensual</option>
            <option value="trimestral">Trimestral</option>
            <option value="anual">Anual</option>
          </select>
        </label>
      </div>
      
      <div className="input-group">
        <label className="input-label">
          Aportación periódica ($):
          <input 
            type="number" 
            value={periodicDeposit} 
            onChange={(e) => setPeriodicDeposit(Number(e.target.value))}
            min="0"
            className="form-input"
          />
        </label>
        
        <label className="input-label">
          Frecuencia de aportación:
          <select 
            value={depositFrequency} 
            onChange={(e) => setDepositFrequency(e.target.value)}
            className="form-select"
          >
            <option value="mensual">Mensual</option>
            <option value="trimestral">Trimestral</option>
            <option value="anual">Anual</option>
          </select>
        </label>
      </div>
      
      <div className="input-group">
        <label className="input-label">
          Duración (meses):
          <input 
            type="number" 
            value={months} 
            onChange={(e) => setMonths(Number(e.target.value))}
            min="1"
            className="form-input"
          />
        </label>
      </div>
      
      <button onClick={handleCalculate}>Calcular</button>
    </div>
  );
};

export default InteresCalculator; 