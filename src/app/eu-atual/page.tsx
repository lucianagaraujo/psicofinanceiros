'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { FaCreditCard, FaPlus, FaTrash, FaCheckCircle, FaHourglassHalf, FaExclamationTriangle, FaPiggyBank } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyFinance {
  month: string;
  fixedExpenses: {
    description: string;
    value: number;
  }[];
  variableExpenses: {
    description: string;
    value: number;
  }[];
  fixedIncome: {
    description: string;
    value: number;
  }[];
  variableIncome: {
    description: string;
    value: number;
  }[];
  creditCard: {
    total: number;
    limit: number;
  };
}

interface Debt {
  id: string;
  description: string;
  value: number;
  interestRate: number;
  dueDate: Date;
  type: 'PERSONAL' | 'FAMILY' | 'BANK' | 'CREDIT_CARD' | 'OTHER';
  status: 'ACTIVE' | 'NEGOTIATING' | 'PAID';
  notes?: string;
}

export default function EuAtual() {
  const [activeTab, setActiveTab] = useState<'financeiro' | 'patrimonio' | 'comportamental'>('financeiro');
  const [monthlyFinances, setMonthlyFinances] = useState<MonthlyFinance[]>([
    {
      month: format(new Date(), 'MMMM/yyyy', { locale: ptBR }),
      fixedExpenses: [],
      variableExpenses: [],
      fixedIncome: [],
      variableIncome: [],
      creditCard: {
        total: 0,
        limit: 0
      }
    }
  ]);

  const [debts, setDebts] = useState<Debt[]>([]);
  const [newDebt, setNewDebt] = useState<Omit<Debt, 'id'>>({
    description: '',
    value: 0,
    interestRate: 0,
    dueDate: new Date(),
    type: 'PERSONAL',
    status: 'ACTIVE',
    notes: ''
  });

  const [selectedMonth, setSelectedMonth] = useState(0);
  const [newExpense, setNewExpense] = useState({ description: '', value: 0, isVariable: false });
  const [newIncome, setNewIncome] = useState({ description: '', value: 0, isVariable: false });
  const [newMonth, setNewMonth] = useState('');

  // Novo estado para evolução do cartão de crédito
  const [creditCardHistory, setCreditCardHistory] = useState<{ month: string; total: number; }[]>([
    { month: format(new Date(), 'MMMM/yyyy'), total: 0 }
  ]);
  const [newCardMonth, setNewCardMonth] = useState('');
  const [newCardTotal, setNewCardTotal] = useState(0);

  // Estados para patrimônio e dívidas (migrados da página de patrimônio)
  const [assets, setAssets] = useState<{
    description: string;
    value: number;
    type: 'financial' | 'non-financial';
    category: string;
    notes?: string;
  }[]>([]);
  const [newAsset, setNewAsset] = useState<Partial<{
    description: string;
    value: number;
    type: 'financial' | 'non-financial';
    category: string;
    notes?: string;
  }>>({ type: 'financial' });

  // Controle de expansão das dívidas
  const [expandedDebt, setExpandedDebt] = useState<string | null>(null);

  // Novo estado para simulação financeira
  const [expenseReduction, setExpenseReduction] = useState(0);
  const [incomeIncrease, setIncomeIncrease] = useState(0);
  const [reductionMode, setReductionMode] = useState<'general' | 'specific'>('general');
  const [specificReductions, setSpecificReductions] = useState<{[key: string]: number}>({});

  const addMonth = () => {
    if (newMonth) {
      setMonthlyFinances([...monthlyFinances, {
        month: newMonth,
        fixedExpenses: [],
        variableExpenses: [],
        fixedIncome: [],
        variableIncome: [],
        creditCard: {
          total: 0,
          limit: 0
        }
      }]);
      setNewMonth('');
    }
  };

  const addExpense = () => {
    const updatedFinances = [...monthlyFinances];
    if (newExpense.isVariable) {
      updatedFinances[selectedMonth].variableExpenses.push({
        description: newExpense.description,
        value: newExpense.value
      });
    } else {
      updatedFinances[selectedMonth].fixedExpenses.push({
        description: newExpense.description,
        value: newExpense.value
      });
    }
    setMonthlyFinances(updatedFinances);
    setNewExpense({ description: '', value: 0, isVariable: false });
  };

  const addIncome = () => {
    const updatedFinances = [...monthlyFinances];
    if (newIncome.isVariable) {
      updatedFinances[selectedMonth].variableIncome.push({
        description: newIncome.description,
        value: newIncome.value
      });
    } else {
      updatedFinances[selectedMonth].fixedIncome.push({
        description: newIncome.description,
        value: newIncome.value
      });
    }
    setMonthlyFinances(updatedFinances);
    setNewIncome({ description: '', value: 0, isVariable: false });
  };

  const addDebt = () => {
    const debt: Debt = {
      ...newDebt,
      id: Math.random().toString(36).substr(2, 9)
    };
    setDebts([...debts, debt]);
    setNewDebt({
      description: '',
      value: 0,
      interestRate: 0,
      dueDate: new Date(),
      type: 'PERSONAL',
      status: 'ACTIVE',
      notes: ''
    });
  };

  const deleteDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const deleteMonth = (index: number) => {
    if (monthlyFinances.length > 1) {
      const updatedFinances = [...monthlyFinances];
      updatedFinances.splice(index, 1);
      setMonthlyFinances(updatedFinances);
      
      // Ajustar o mês selecionado se necessário
      if (selectedMonth >= updatedFinances.length) {
        setSelectedMonth(updatedFinances.length - 1);
      }
    }
  };

  const getMonthlyTotal = (month: MonthlyFinance) => {
    const totalFixedExpenses = month.fixedExpenses.reduce((sum, exp) => sum + exp.value, 0);
    const totalVariableExpenses = month.variableExpenses.reduce((sum, exp) => sum + exp.value, 0);
    const totalFixedIncome = month.fixedIncome.reduce((sum, inc) => sum + inc.value, 0);
    const totalVariableIncome = month.variableIncome.reduce((sum, inc) => sum + inc.value, 0);
    return {
      expenses: totalFixedExpenses + totalVariableExpenses,
      income: totalFixedIncome + totalVariableIncome,
      balance: (totalFixedIncome + totalVariableIncome) - (totalFixedExpenses + totalVariableExpenses)
    };
  };

  const getChartData = () => {
    return {
      labels: monthlyFinances.map(finance => finance.month),
      datasets: [
        {
          label: 'Despesas',
          data: monthlyFinances.map(finance => getMonthlyTotal(finance).expenses),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
        },
        {
          label: 'Receitas',
          data: monthlyFinances.map(finance => getMonthlyTotal(finance).income),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
        },
        {
          label: 'Saldo',
          data: monthlyFinances.map(finance => getMonthlyTotal(finance).balance),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
        }
      ]
    };
  };

  const getFinancialStatus = () => {
    const currentMonth = monthlyFinances[selectedMonth];
    const total = getMonthlyTotal(currentMonth);
    const expensesPercentage = (total.expenses / total.income) * 100;

    if (expensesPercentage > 100) {
      return {
        status: 'danger',
        message: `Seus gastos estão ${(expensesPercentage - 100).toFixed(1)}% acima da sua renda. Recomendamos reduzir gastos em R$ ${(total.expenses - total.income).toFixed(2)} para equilibrar seu orçamento.`
      };
    } else if (expensesPercentage > 80) {
      return {
        status: 'warning',
        message: 'Seus gastos estão próximos da sua renda. Fique atento para não ultrapassar seu orçamento.'
      };
    } else {
      return {
        status: 'success',
        message: 'Parabéns! Você está mantendo seus gastos dentro da sua renda. Continue assim!'
      };
    }
  };

  const financialStatus = getFinancialStatus();

  const addCardMonth = () => {
    if (newCardMonth) {
      setCreditCardHistory([...creditCardHistory, { month: newCardMonth, total: newCardTotal }]);
      setNewCardMonth('');
      setNewCardTotal(0);
    }
  };

  const updateCardTotal = (index: number, value: number) => {
    const updated = [...creditCardHistory];
    updated[index].total = value;
    setCreditCardHistory(updated);
  };

  const deleteCardMonth = (index: number) => {
    if (creditCardHistory.length > 1) {
      const updated = [...creditCardHistory];
      updated.splice(index, 1);
      setCreditCardHistory(updated);
    }
  };

  const getCardChartData = () => ({
    labels: creditCardHistory.map(item => item.month),
    datasets: [
      {
        label: 'Fatura do Cartão',
        data: creditCardHistory.map(item => item.total),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      }
    ]
  });

  const addAsset = () => {
    if (newAsset.description && newAsset.value) {
      setAssets([...assets, newAsset as any]);
      setNewAsset({ type: 'financial' });
    }
  };
  const deleteAsset = (index: number) => {
    const updatedAssets = [...assets];
    updatedAssets.splice(index, 1);
    setAssets(updatedAssets);
  };

  // Função para calcular o total de despesas com reduções específicas
  const calculateReducedExpenses = () => {
    if (reductionMode === 'general') {
      return getMonthlyTotal(monthlyFinances[selectedMonth]).expenses * (1 - expenseReduction/100);
    } else {
      let total = 0;
      // Calcular despesas fixas com reduções específicas
      monthlyFinances[selectedMonth].fixedExpenses.forEach(expense => {
        const reduction = specificReductions[expense.description] || 0;
        total += expense.value * (1 - reduction/100);
      });
      // Calcular despesas variáveis com reduções específicas
      monthlyFinances[selectedMonth].variableExpenses.forEach(expense => {
        const reduction = specificReductions[expense.description] || 0;
        total += expense.value * (1 - reduction/100);
      });
      return total;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">EU ATUAL</h1>
        <p className="mt-2 text-sm text-gray-700">
          Análise financeira mensal e acompanhamento de gastos
        </p>
      </div>

      {/* Abas */}
      <div className="flex mb-8">
        <button
          className={`flex-1 py-2 rounded-l-lg border ${activeTab === 'financeiro' ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-gray-100 text-gray-500'}`}
          onClick={() => setActiveTab('financeiro')}
        >
          Financeiro
        </button>
        <button
          className={`flex-1 py-2 border-t border-b ${activeTab === 'patrimonio' ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-gray-100 text-gray-500'}`}
          onClick={() => setActiveTab('patrimonio')}
        >
          Patrimônio e Dívidas
        </button>
        <button
          className={`flex-1 py-2 rounded-r-lg border ${activeTab === 'comportamental' ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-gray-100 text-gray-500'}`}
          onClick={() => setActiveTab('comportamental')}
        >
          Comportamental
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'financeiro' && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Análise Mensal */}
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Análise Mensal</h2>
              
              <div className="mb-4">
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    placeholder="Novo mês (ex: Janeiro/2024)"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={newMonth}
                    onChange={(e) => setNewMonth(e.target.value)}
                  />
                  <button
                    onClick={addMonth}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Adicionar Mês
                  </button>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione o Mês
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                >
                  {monthlyFinances.map((finance, index) => (
                    <option key={index} value={index}>
                      {finance.month}
                    </option>
                  ))}
                </select>
                
                {monthlyFinances.length > 1 && (
                  <button
                    onClick={() => deleteMonth(selectedMonth)}
                    className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Excluir Mês
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Despesas */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Despesas</h3>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Descrição"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Valor"
                      className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={newExpense.value}
                      onChange={(e) => setNewExpense({ ...newExpense, value: parseFloat(e.target.value) })}
                    />
                    <select
                      className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={newExpense.isVariable.toString()}
                      onChange={(e) => setNewExpense({ ...newExpense, isVariable: e.target.value === 'true' })}
                    >
                      <option value="false">Fixa</option>
                      <option value="true">Variável</option>
                    </select>
                    <button
                      onClick={addExpense}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      Adicionar
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Despesas Fixas</h4>
                      <ul className="space-y-2">
                        {monthlyFinances[selectedMonth].fixedExpenses.map((expense, index) => (
                          <li key={index} className="flex justify-between text-sm">
                            <span>{expense.description}</span>
                            <span className="text-red-600">R$ {expense.value.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Despesas Variáveis</h4>
                      <ul className="space-y-2">
                        {monthlyFinances[selectedMonth].variableExpenses.map((expense, index) => (
                          <li key={index} className="flex justify-between text-sm">
                            <span>{expense.description}</span>
                            <span className="text-red-600">R$ {expense.value.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Receitas */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Receitas</h3>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Descrição"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={newIncome.description}
                      onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Valor"
                      className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={newIncome.value}
                      onChange={(e) => setNewIncome({ ...newIncome, value: parseFloat(e.target.value) })}
                    />
                    <select
                      className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={newIncome.isVariable.toString()}
                      onChange={(e) => setNewIncome({ ...newIncome, isVariable: e.target.value === 'true' })}
                    >
                      <option value="false">Fixa</option>
                      <option value="true">Variável</option>
                    </select>
                    <button
                      onClick={addIncome}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      Adicionar
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Receitas Fixas</h4>
                      <ul className="space-y-2">
                        {monthlyFinances[selectedMonth].fixedIncome.map((income, index) => (
                          <li key={index} className="flex justify-between text-sm">
                            <span>{income.description}</span>
                            <span className="text-green-600">R$ {income.value.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Receitas Variáveis</h4>
                      <ul className="space-y-2">
                        {monthlyFinances[selectedMonth].variableIncome.map((income, index) => (
                          <li key={index} className="flex justify-between text-sm">
                            <span>{income.description}</span>
                            <span className="text-green-600">R$ {income.value.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Resumo do Mês */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Resumo do Mês</h3>
                  <div className="space-y-1">
                    <p className="flex justify-between text-sm">
                      <span>Total Despesas:</span>
                      <span className="text-red-600">R$ {getMonthlyTotal(monthlyFinances[selectedMonth]).expenses.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between text-sm">
                      <span>Total Receitas:</span>
                      <span className="text-green-600">R$ {getMonthlyTotal(monthlyFinances[selectedMonth]).income.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between text-sm font-medium">
                      <span>Saldo:</span>
                      <span className={getMonthlyTotal(monthlyFinances[selectedMonth]).balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                        R$ {getMonthlyTotal(monthlyFinances[selectedMonth]).balance.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico de Evolução */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Evolução Financeira</h2>
              <div className="h-64">
                <Line
                  data={getChartData()}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Status Financeiro */}
          <div className="space-y-6">
            <div className={`bg-white shadow rounded-lg p-6 border-l-4 ${
              financialStatus.status === 'success' ? 'border-green-500' :
              financialStatus.status === 'warning' ? 'border-yellow-500' :
              'border-red-500'
            }`}>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Status Financeiro</h2>
              <p className={`text-sm ${
                financialStatus.status === 'success' ? 'text-green-600' :
                financialStatus.status === 'warning' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {financialStatus.message}
              </p>
            </div>

            {/* Simulador de Melhoria Financeira */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Simulador de Melhoria Financeira</h2>
              
              {/* Modo de Redução */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modo de Redução de Despesas
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setReductionMode('general')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      reductionMode === 'general'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Redução Geral
                  </button>
                  <button
                    onClick={() => setReductionMode('specific')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      reductionMode === 'specific'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Redução por Categoria
                  </button>
                </div>
              </div>

              {/* Redução de Despesas */}
              {reductionMode === 'general' ? (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Redução Geral de Despesas (%)
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={expenseReduction}
                      onChange={(e) => setExpenseReduction(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="absolute -top-7 left-0 w-full">
                      <span 
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                        style={{ left: `${expenseReduction * 2}%`, position: 'absolute', transform: 'translateX(-50%)' }}
                      >
                        {expenseReduction}%
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Redução por Categoria de Despesa
                  </label>
                  <div className="space-y-4">
                    {/* Despesas Fixas */}
                    {monthlyFinances[selectedMonth].fixedExpenses.map((expense, index) => (
                      <div key={`fixed-${index}`} className="flex items-center space-x-4">
                        <span className="w-1/3 text-sm">{expense.description}</span>
                        <div className="relative flex-1">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={specificReductions[expense.description] || 0}
                            onChange={(e) => setSpecificReductions({
                              ...specificReductions,
                              [expense.description]: parseInt(e.target.value)
                            })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                          <span className="absolute right-0 -top-6 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                            {specificReductions[expense.description] || 0}%
                          </span>
                        </div>
                        <span className="w-24 text-sm text-right">
                          R$ {(expense.value * (1 - (specificReductions[expense.description] || 0)/100)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    
                    {/* Despesas Variáveis */}
                    {monthlyFinances[selectedMonth].variableExpenses.map((expense, index) => (
                      <div key={`variable-${index}`} className="flex items-center space-x-4">
                        <span className="w-1/3 text-sm">{expense.description}</span>
                        <div className="relative flex-1">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={specificReductions[expense.description] || 0}
                            onChange={(e) => setSpecificReductions({
                              ...specificReductions,
                              [expense.description]: parseInt(e.target.value)
                            })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                          <span className="absolute right-0 -top-6 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                            {specificReductions[expense.description] || 0}%
                          </span>
                        </div>
                        <span className="w-24 text-sm text-right">
                          R$ {(expense.value * (1 - (specificReductions[expense.description] || 0)/100)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Aumento de Renda */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aumento de Renda (%)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={incomeIncrease}
                    onChange={(e) => setIncomeIncrease(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="absolute -top-7 left-0 w-full">
                    <span 
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                      style={{ left: `${incomeIncrease}%`, position: 'absolute', transform: 'translateX(-50%)' }}
                    >
                      {incomeIncrease}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Resultado da Simulação */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-3">Resultado da Simulação</h3>
                <div className="space-y-2">
                  <p className="text-sm flex justify-between">
                    <span>Despesas Simuladas:</span>
                    <span className="text-blue-700 font-medium">
                      R$ {calculateReducedExpenses().toFixed(2)}
                    </span>
                  </p>
                  <p className="text-sm flex justify-between">
                    <span>Renda Simulada:</span>
                    <span className="text-blue-700 font-medium">
                      R$ {(getMonthlyTotal(monthlyFinances[selectedMonth]).income * (1 + incomeIncrease/100)).toFixed(2)}
                    </span>
                  </p>
                  <p className="text-sm flex justify-between font-medium">
                    <span>Saldo Simulado:</span>
                    <span className={
                      getMonthlyTotal(monthlyFinances[selectedMonth]).income * (1 + incomeIncrease/100) -
                      calculateReducedExpenses() >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }>
                      R$ {(
                        getMonthlyTotal(monthlyFinances[selectedMonth]).income * (1 + incomeIncrease/100) -
                        calculateReducedExpenses()
                      ).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'patrimonio' && (
        <div className="space-y-10">
          {/* Resumo Patrimonial */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
            <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center border border-green-100">
              <span className="text-green-500 text-2xl mb-1"><FaPiggyBank /></span>
              <span className="text-gray-500 text-sm">Total de Ativos</span>
              <span className="text-2xl font-bold text-green-700">R$ {assets.reduce((sum, a) => sum + (a.value || 0), 0).toLocaleString('pt-BR', {minimumFractionDigits:2})}</span>
            </div>
            <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center border border-red-100">
              <span className="text-red-500 text-2xl mb-1"><FaExclamationTriangle /></span>
              <span className="text-gray-500 text-sm">Total de Dívidas</span>
              <span className="text-2xl font-bold text-red-700">R$ {debts.reduce((sum, d) => sum + (d.value || 0), 0).toLocaleString('pt-BR', {minimumFractionDigits:2})}</span>
            </div>
            <div className={`bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center border ${assets.reduce((sum, a) => sum + (a.value || 0), 0) - debts.reduce((sum, d) => sum + (d.value || 0), 0) >= 0 ? 'border-blue-100' : 'border-red-200'}`}>
              <span className={`text-2xl mb-1 ${assets.reduce((sum, a) => sum + (a.value || 0), 0) - debts.reduce((sum, d) => sum + (d.value || 0), 0) >= 0 ? 'text-blue-500' : 'text-red-500'}`}><FaCheckCircle /></span>
              <span className="text-gray-500 text-sm">Patrimônio Líquido</span>
              <span className={`text-2xl font-bold ${assets.reduce((sum, a) => sum + (a.value || 0), 0) - debts.reduce((sum, d) => sum + (d.value || 0), 0) >= 0 ? 'text-blue-700' : 'text-red-700'}`}>R$ {(assets.reduce((sum, a) => sum + (a.value || 0), 0) - debts.reduce((sum, d) => sum + (d.value || 0), 0)).toLocaleString('pt-BR', {minimumFractionDigits:2})}</span>
              <span className="text-xs text-gray-400 mt-1">Ativos - Dívidas</span>
            </div>
          </div>

          {/* Cartão de Crédito */}
          <div className="bg-white shadow-lg rounded-2xl p-8 border border-blue-100">
            <div className="flex items-center mb-6">
              <FaCreditCard className="text-blue-500 text-2xl mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Evolução do Cartão de Crédito</h2>
            </div>
            <div className="mb-6 flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
              <input
                type="text"
                placeholder="Mês (ex: Janeiro/2024)"
                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                value={newCardMonth}
                onChange={(e) => setNewCardMonth(e.target.value)}
              />
              <input
                type="number"
                placeholder="Valor da Fatura"
                className="w-40 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                value={newCardTotal}
                onChange={(e) => setNewCardTotal(parseFloat(e.target.value))}
              />
              <button
                onClick={addCardMonth}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow"
              >
                <FaPlus className="mr-2" />Adicionar
              </button>
            </div>
            <ul className="flex flex-wrap gap-3 mb-6">
              {creditCardHistory.map((item, index) => (
                <li key={index} className="flex items-center bg-blue-50 rounded-lg px-4 py-2 shadow border border-blue-100">
                  <span className="font-medium text-blue-700 mr-2">{item.month}</span>
                  <input
                    type="number"
                    className="w-24 rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-2 py-1 mr-2"
                    value={item.total}
                    onChange={(e) => updateCardTotal(index, parseFloat(e.target.value))}
                  />
                  {creditCardHistory.length > 1 && (
                    <button
                      onClick={() => deleteCardMonth(index)}
                      className="text-red-500 hover:text-red-700"
                      title="Excluir mês"
                    >
                      <FaTrash />
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <div className="h-64">
              <Line
                data={getCardChartData()}
                options={{
                  responsive: true,
                  scales: {
                    y: { beginAtZero: true }
                  }
                }}
              />
            </div>
          </div>

          {/* Formulário e Lista de Dívidas (embelezado) */}
          <div className="bg-white shadow-lg rounded-2xl p-8 border border-red-100">
            <div className="flex items-center mb-6">
              <FaExclamationTriangle className="text-red-500 text-2xl mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Adicionar Dívida</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição</label>
                <input
                  type="text"
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                  value={newDebt.description}
                  onChange={(e) => setNewDebt({ ...newDebt, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Valor</label>
                <input
                  type="number"
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                  value={newDebt.value}
                  onChange={(e) => setNewDebt({ ...newDebt, value: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Taxa de Juros (%)</label>
                <input
                  type="number"
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                  value={newDebt.interestRate}
                  onChange={(e) => setNewDebt({ ...newDebt, interestRate: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Vencimento</label>
                <input
                  type="date"
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                  value={format(newDebt.dueDate, 'yyyy-MM-dd')}
                  onChange={(e) => setNewDebt({ ...newDebt, dueDate: new Date(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo</label>
                <select
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                  value={newDebt.type}
                  onChange={(e) => setNewDebt({ ...newDebt, type: e.target.value as Debt['type'] })}
                >
                  <option value="PERSONAL">Pessoal</option>
                  <option value="FAMILY">Familiar</option>
                  <option value="BANK">Banco</option>
                  <option value="CREDIT_CARD">Cartão de Crédito</option>
                  <option value="OTHER">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                  value={newDebt.status}
                  onChange={(e) => setNewDebt({ ...newDebt, status: e.target.value as Debt['status'] })}
                >
                  <option value="ACTIVE">Ativa</option>
                  <option value="NEGOTIATING">Em Negociação</option>
                  <option value="PAID">Paga</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Observações</label>
                <textarea
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                  rows={2}
                  value={newDebt.notes}
                  onChange={(e) => setNewDebt({ ...newDebt, notes: e.target.value })}
                />
              </div>
            </div>
            <button
              onClick={addDebt}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-lg font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700 shadow mb-8"
            >
              <FaPlus className="mr-2" />Adicionar Dívida
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4 mt-8 flex items-center"><FaExclamationTriangle className="mr-2 text-red-400" />Minhas Dívidas</h2>
            <ul className="space-y-4">
              {debts.length === 0 && (
                <li className="text-center text-gray-400 italic">Nenhuma dívida cadastrada.</li>
              )}
              {debts.map((debt) => (
                <li
                  key={debt.id}
                  className={`transition-all duration-300 border-l-4 rounded-xl shadow px-4 py-3 bg-white cursor-pointer ${
                    debt.status === 'ACTIVE' ? 'border-yellow-400' :
                    debt.status === 'NEGOTIATING' ? 'border-blue-400' :
                    'border-green-400'
                  }`}
                  onClick={() => setExpandedDebt(expandedDebt === debt.id ? null : debt.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg flex items-center">
                      {debt.status === 'ACTIVE' && <FaExclamationTriangle className="text-yellow-400 mr-2" />}
                      {debt.status === 'NEGOTIATING' && <FaHourglassHalf className="text-blue-400 mr-2" />}
                      {debt.status === 'PAID' && <FaCheckCircle className="text-green-400 mr-2" />}
                      {debt.description}
                    </span>
                    <span className="text-sm font-semibold">
                      {debt.status === 'ACTIVE' ? 'Ativa' : debt.status === 'NEGOTIATING' ? 'Em Negociação' : 'Paga'}
                    </span>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${expandedDebt === debt.id ? 'max-h-96 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="text-gray-700 text-base space-y-1">
                      <div>Valor: <span className="text-red-600">R$ {debt.value.toFixed(2)}</span></div>
                      <div>Juros: {debt.interestRate}%</div>
                      <div>Vencimento: {debt.dueDate instanceof Date ? debt.dueDate.toLocaleDateString() : debt.dueDate}</div>
                      {debt.notes && <div>Observações: {debt.notes}</div>}
                      <div>Tipo: {debt.type === 'PERSONAL' ? 'Pessoal' : debt.type === 'FAMILY' ? 'Familiar' : debt.type === 'BANK' ? 'Banco' : debt.type === 'CREDIT_CARD' ? 'Cartão de Crédito' : 'Outro'}</div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteDebt(debt.id); }}
                        className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        <FaTrash className="mr-1" />Excluir Dívida
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Patrimônio */}
          <div className="bg-white shadow-lg rounded-2xl p-8 border border-green-100">
            <div className="flex items-center mb-6">
              <FaPiggyBank className="text-green-500 text-2xl mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Meus Ativos</h2>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0 mb-6">
              <input
                type="text"
                placeholder="Descrição"
                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2"
                value={newAsset.description || ''}
                onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
              />
              <input
                type="number"
                placeholder="Valor"
                className="w-40 rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2"
                value={newAsset.value || ''}
                onChange={(e) => setNewAsset({ ...newAsset, value: parseFloat(e.target.value) })}
              />
              <select
                className="w-40 rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2"
                value={newAsset.type}
                onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value as 'financial' | 'non-financial' })}
              >
                <option value="financial">Financeiro</option>
                <option value="non-financial">Não Financeiro</option>
              </select>
              <input
                type="text"
                placeholder="Categoria"
                className="w-40 rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2"
                value={newAsset.category || ''}
                onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
              />
              <button
                onClick={addAsset}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 shadow"
              >
                <FaPlus className="mr-2" />Adicionar
              </button>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assets.length === 0 && (
                <li className="text-center text-gray-400 italic col-span-2">Nenhum ativo cadastrado.</li>
              )}
              {assets.map((asset, index) => (
                <li key={index} className="flex justify-between items-center border rounded-xl shadow px-4 py-3 bg-green-50">
                  <div>
                    <span className="font-semibold text-lg">{asset.description}</span> <span className="text-gray-500">({asset.type === 'financial' ? 'Financeiro' : 'Não Financeiro'})</span>
                    <span className="ml-2 text-gray-400">{asset.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-700 font-bold text-lg">R$ {asset.value?.toFixed(2)}</span>
                    <button
                      onClick={() => deleteAsset(index)}
                      className="text-red-500 hover:text-red-700"
                      title="Excluir ativo"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {activeTab === 'comportamental' && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          <p>Espaço reservado para acompanhamento comportamental.</p>
        </div>
      )}
    </div>
  );
} 