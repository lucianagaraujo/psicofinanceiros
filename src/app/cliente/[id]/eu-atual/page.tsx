'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { FaCreditCard, FaPlus, FaTrash, FaCheckCircle, FaHourglassHalf, FaExclamationTriangle, FaPiggyBank } from 'react-icons/fa';
import BackButton from '@/components/BackButton';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tab } from '@headlessui/react';
import Link from 'next/link';
import EuIdeal from '../eu-ideal/page';
import Compromissos from '../compromissos/page';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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

interface Commitment {
  id: string;
  type: 'FINANCIAL' | 'BEHAVIORAL';
  description: string;
  progressHistory: {
    date: Date;
    score: number;
    notes?: string;
  }[];
}

interface Props {
  params: {
    id: string;
  };
}

// Função para formatar valores monetários
const formatCurrency = (value: number | { expenses: number; income: number; balance: number }): string => {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value.balance);
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type Section = 'eu-atual' | 'eu-ideal' | 'compromissos';

export default function EuAtualPage() {
  const router = useRouter();
  const params = useParams();
  const [activeSection, setActiveSection] = useState<Section>('eu-atual');
  const [activeTab, setActiveTab] = useState('financeiro');
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

  // Estados para Comportamental (Eu Ideal)
  const [behavioralData, setBehavioralData] = useState({
    financialHabits: '',
    emotionalRelationship: '',
    financialGoals: '',
    financialEducation: '',
  });

  // Adicione esses estados para o Eu Ideal
  const [idealFinancialState, setIdealFinancialState] = useState({
    desiredIncome: {
      salary: 0,
      investments: 0,
      business: 0,
      other: 0
    },
    lifestyle: {
      housing: '',
      transportation: '',
      leisure: '',
      travel: ''
    },
    desiredAssets: {
      realEstate: 0,
      vehicles: 0,
      investments: 0,
      business: 0
    },
    investmentProfile: {
      riskTolerance: 'moderado',
      preferredInvestments: '',
      monthlyInvestmentGoal: 0,
      retirementAge: 0
    },
    financialGoals: [
      { description: '', targetDate: '', targetValue: 0 }
    ]
  });

  // Adicione esses estados
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [newCommitment, setNewCommitment] = useState<{
    type: 'FINANCIAL' | 'BEHAVIORAL';
    description: string;
  }>({
    type: 'FINANCIAL',
    description: '',
  });
  const [selectedCommitment, setSelectedCommitment] = useState<Commitment | null>(null);
  const [progressScore, setProgressScore] = useState(0);
  const [progressNotes, setProgressNotes] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [expandedCommitment, setExpandedCommitment] = useState<string | null>(null);

  // Estados para Eu Ideal
  const [financialData, setFinancialData] = useState({
    creditCardDebt: 0,
    monthlyDebt: 0,
    fixedExpenses: 0,
    variableExpenses: 0,
    livingCost: 0,
    income: 0,
    financialAssets: 0,
    nonFinancialAssets: 0,
    liabilities: 0,
  });

  const handleFinancialDataChange = (field: string, value: string) => {
    setFinancialData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

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

  const getFinanceChartData = () => {
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

  const getCreditCardChartData = () => ({
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

  const getCommitmentChartData = (commitment: Commitment) => {
    return {
      labels: commitment.progressHistory.map(progress => 
        format(progress.date, "dd/MM/yyyy")
      ),
      datasets: [
        {
          label: 'Evolução',
          data: commitment.progressHistory.map(progress => progress.score),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.1
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

  // Funções auxiliares para Patrimônio
  const getTotalDebts = () => debts.reduce((sum, debt) => sum + debt.value, 0);
  const getTotalAssets = () => assets.reduce((sum, asset) => sum + asset.value, 0);
  const getNetWorth = () => getTotalAssets() - getTotalDebts();

  // Corrigir atualização de data para newDebt
  const handleDebtDateChange = (value: string) => {
    setNewDebt({ ...newDebt, dueDate: new Date(value) });
  };

  // Adicione essas funções
  const addCommitment = () => {
    const commitment: Commitment = {
      id: Math.random().toString(36).substr(2, 9),
      ...newCommitment,
      progressHistory: [],
    };
    setCommitments([...commitments, commitment]);
    setNewCommitment({
      type: 'FINANCIAL',
      description: '',
    });
  };

  const deleteCommitment = (id: string) => {
    setCommitments(commitments.filter(commitment => commitment.id !== id));
    if (selectedCommitment?.id === id) {
      setSelectedCommitment(null);
    }
  };

  const addProgress = () => {
    if (!selectedCommitment) return;

    const updatedCommitment = {
      ...selectedCommitment,
      progressHistory: [
        ...selectedCommitment.progressHistory,
        {
          date: new Date(),
          score: progressScore,
          notes: progressNotes,
        },
      ],
    };

    if (progressScore >= 8 && selectedCommitment.progressHistory.length > 0 && 
        selectedCommitment.progressHistory[selectedCommitment.progressHistory.length - 1].score < 8) {
      setCelebrationMessage(
        `Parabéns! Você está progredindo muito bem em "${selectedCommitment.description}"!`
      );
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }

    setCommitments(
      commitments.map((c) => (c.id === selectedCommitment.id ? updatedCommitment : c))
    );
    setProgressScore(0);
    setProgressNotes('');
  };

  const getChartData = (commitment: Commitment) => {
    return {
      labels: commitment.progressHistory.map(progress => 
        format(progress.date, "dd/MM/yyyy")
      ),
      datasets: [
        {
          label: 'Evolução',
          data: commitment.progressHistory.map(progress => progress.score),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.1
        }
      ]
    };
  };

  const getChartOptions = () => {
    return {
      responsive: true,
      scales: {
        y: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 1
          }
        }
      }
    };
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href={`/cliente/${params.id}`}
            className="inline-flex items-center px-4 py-2 bg-[#1e293b] hover:bg-[#2d3a4f] border border-white/5 rounded-lg text-gray-300 transition-colors"
          >
            ← Voltar para o Dashboard
          </Link>
        </div>
        
        <div className="bg-[#1e293b]/80 backdrop-blur-sm rounded-xl shadow-2xl border border-white/5 p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Retrato Financeiro</h1>
              <p className="text-gray-300 mt-1">Visualize e gerencie sua situação financeira atual</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Navegação Principal */}
            <div className="flex space-x-2 bg-[#1e293b] rounded-lg p-1">
              <button
                onClick={() => setActiveSection('eu-atual')}
                className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === 'eu-atual'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Eu Atual
              </button>
              <button
                onClick={() => setActiveSection('eu-ideal')}
                className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === 'eu-ideal'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Eu Ideal
              </button>
              <button
                onClick={() => setActiveSection('compromissos')}
                className={`flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === 'compromissos'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Meus Compromissos
              </button>
            </div>

            {/* Conteúdo das Seções */}
            <div className="space-y-6">
              {activeSection === 'eu-atual' && (
                <div className="space-y-6">
                  {/* Subnavegação para Eu Atual */}
                  <div className="flex space-x-2 bg-[#1e293b] rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab('financeiro')}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === 'financeiro'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Financeiro
                    </button>
                    <button
                      onClick={() => setActiveTab('patrimonio')}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === 'patrimonio'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Patrimônio
                    </button>
                    <button
                      onClick={() => setActiveTab('comportamental')}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === 'comportamental'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Comportamental
                    </button>
                  </div>

                  {/* Conteúdo das tabs do Eu Atual */}
                  <div className="mt-6">
                    {activeTab === 'financeiro' && (
                      <div className="space-y-6">
                        {/* Cards superiores */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          {/* Card de Receitas */}
                          <div className="bg-[#1e293b] border border-green-500/20 rounded-xl p-6 transition-all duration-200 hover:scale-[1.02] hover:border-green-500/40">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-medium text-gray-200">Receitas Totais</h3>
                              <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                <FaPiggyBank className="h-4 w-4 text-green-500" />
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-white">
                              {formatCurrency(monthlyFinances[selectedMonth]?.fixedIncome.reduce((sum, inc) => sum + inc.value, 0) +
                                monthlyFinances[selectedMonth]?.variableIncome.reduce((sum, inc) => sum + inc.value, 0))}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              {monthlyFinances[selectedMonth]?.month}
                            </p>
                          </div>

                          {/* Card de Despesas */}
                          <div className="bg-[#1e293b] border border-red-500/20 rounded-xl p-6 transition-all duration-200 hover:scale-[1.02] hover:border-red-500/40">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-medium text-gray-200">Despesas Totais</h3>
                              <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                                <FaExclamationTriangle className="h-4 w-4 text-red-500" />
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-white">
                              {formatCurrency(monthlyFinances[selectedMonth]?.fixedExpenses.reduce((sum, exp) => sum + exp.value, 0) +
                                monthlyFinances[selectedMonth]?.variableExpenses.reduce((sum, exp) => sum + exp.value, 0))}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              {monthlyFinances[selectedMonth]?.month}
                            </p>
                          </div>

                          {/* Card de Cartão de Crédito */}
                          <div className="bg-[#1e293b] border border-yellow-500/20 rounded-xl p-6 transition-all duration-200 hover:scale-[1.02] hover:border-yellow-500/40">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-medium text-gray-200">Cartão de Crédito</h3>
                              <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                <FaCreditCard className="h-4 w-4 text-yellow-500" />
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-white">
                              {formatCurrency(monthlyFinances[selectedMonth]?.creditCard.total)}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              Limite: {formatCurrency(monthlyFinances[selectedMonth]?.creditCard.limit)}
                            </p>
                          </div>

                          {/* Card de Saldo */}
                          <div className="bg-[#1e293b] border border-blue-500/20 rounded-xl p-6 transition-all duration-200 hover:scale-[1.02] hover:border-blue-500/40">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-medium text-gray-200">Saldo</h3>
                              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <FaCheckCircle className="h-4 w-4 text-blue-500" />
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-white">
                              {formatCurrency(getMonthlyTotal(monthlyFinances[selectedMonth]))}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              {monthlyFinances[selectedMonth]?.month}
                            </p>
                          </div>
                        </div>

                        {/* Gráfico de Evolução Financeira */}
                        <div className="bg-[#1e293b] border border-white/5 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-white mb-4">Evolução Financeira</h3>
                          <div className="h-[300px]">
                            <Line data={getFinanceChartData()} options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                y: {
                                  beginAtZero: true,
                                  grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                  },
                                  ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                  }
                                },
                                x: {
                                  grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                  },
                                  ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                  }
                                }
                              },
                              plugins: {
                                legend: {
                                  labels: {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                  }
                                }
                              }
                            }} />
                          </div>
                        </div>

                        {/* Formulários de receitas e despesas */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                          {/* Adicionar Receita */}
                          <div className="bg-[#1e293b] border border-white/5 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Adicionar Receita</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Descrição</label>
                                <input
                                  type="text"
                                  className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                                  value={newIncome.description}
                                  onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Valor</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">R$</span>
                                  </div>
                                  <input
                                    type="number"
                                    className="pl-12 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                                    value={newIncome.value}
                                    onChange={(e) => setNewIncome({ ...newIncome, value: Number(e.target.value) })}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                                  checked={newIncome.isVariable}
                                  onChange={(e) => setNewIncome({ ...newIncome, isVariable: e.target.checked })}
                                />
                                <label className="ml-2 block text-sm text-gray-300">
                                  Receita Variável
                                </label>
                              </div>
                              <button
                                onClick={addIncome}
                                className="w-full bg-green-600 text-white rounded-md py-2 hover:bg-green-700 transition-colors"
                              >
                                Adicionar Receita
                              </button>
                            </div>
                          </div>

                          {/* Adicionar Despesa */}
                          <div className="bg-[#1e293b] border border-white/5 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Adicionar Despesa</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Descrição</label>
                                <input
                                  type="text"
                                  className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                                  value={newExpense.description}
                                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Valor</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">R$</span>
                                  </div>
                                  <input
                                    type="number"
                                    className="pl-12 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                                    value={newExpense.value}
                                    onChange={(e) => setNewExpense({ ...newExpense, value: Number(e.target.value) })}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                                  checked={newExpense.isVariable}
                                  onChange={(e) => setNewExpense({ ...newExpense, isVariable: e.target.checked })}
                                />
                                <label className="ml-2 block text-sm text-gray-300">
                                  Despesa Variável
                                </label>
                              </div>
                              <button
                                onClick={addExpense}
                                className="w-full bg-red-600 text-white rounded-md py-2 hover:bg-red-700 transition-colors"
                              >
                                Adicionar Despesa
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Lista de Receitas e Despesas */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                          {/* Lista de Receitas */}
                          <div className="bg-[#1e293b] border border-white/5 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Receitas</h3>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-300">Fixas</h4>
                                {monthlyFinances[selectedMonth].fixedIncome.map((income, index) => (
                                  <div key={index} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
                                    <span className="text-gray-300">{income.description}</span>
                                    <span className="text-green-400">{formatCurrency(income.value)}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-300">Variáveis</h4>
                                {monthlyFinances[selectedMonth].variableIncome.map((income, index) => (
                                  <div key={index} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
                                    <span className="text-gray-300">{income.description}</span>
                                    <span className="text-green-400">{formatCurrency(income.value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Lista de Despesas */}
                          <div className="bg-[#1e293b] border border-white/5 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Despesas</h3>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-300">Fixas</h4>
                                {monthlyFinances[selectedMonth].fixedExpenses.map((expense, index) => (
                                  <div key={index} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
                                    <span className="text-gray-300">{expense.description}</span>
                                    <span className="text-red-400">{formatCurrency(expense.value)}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-300">Variáveis</h4>
                                {monthlyFinances[selectedMonth].variableExpenses.map((expense, index) => (
                                  <div key={index} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
                                    <span className="text-gray-300">{expense.description}</span>
                                    <span className="text-red-400">{formatCurrency(expense.value)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'patrimonio' && (
                      <div className="space-y-6">
                        {/* Visão Geral do Patrimônio */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                          <div className="bg-[#1e293b] border border-red-500/20 rounded-xl p-6">
                            <h3 className="text-sm font-medium text-red-200">Total de Dívidas</h3>
                            <p className="mt-2 text-2xl font-semibold text-red-400">
                              {formatCurrency(getTotalDebts())}
                            </p>
                          </div>
                          <div className="bg-[#1e293b] border border-green-500/20 rounded-xl p-6">
                            <h3 className="text-sm font-medium text-green-200">Total de Ativos</h3>
                            <p className="mt-2 text-2xl font-semibold text-green-400">
                              {formatCurrency(getTotalAssets())}
                            </p>
                          </div>
                          <div className="bg-[#1e293b] border border-blue-500/20 rounded-xl p-6">
                            <h3 className="text-sm font-medium text-blue-200">Patrimônio Líquido</h3>
                            <p className="mt-2 text-2xl font-semibold text-blue-400">
                              {formatCurrency(getNetWorth())}
                            </p>
                          </div>
                        </div>

                        {/* Formulários */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                          {/* Adicionar Dívida */}
                          <div className="bg-[#1e293b] border border-white/5 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Adicionar Dívida</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Descrição</label>
                                <input
                                  type="text"
                                  className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                                  value={newDebt.description}
                                  onChange={(e) => setNewDebt({ ...newDebt, description: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Valor</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">R$</span>
                                  </div>
                                  <input
                                    type="number"
                                    className="pl-12 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                                    value={newDebt.value}
                                    onChange={(e) => setNewDebt({ ...newDebt, value: Number(e.target.value) })}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Taxa de Juros (%)</label>
                                <input
                                  type="number"
                                  className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                                  value={newDebt.interestRate}
                                  onChange={(e) => setNewDebt({ ...newDebt, interestRate: Number(e.target.value) })}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Data de Vencimento</label>
                                <input
                                  type="date"
                                  className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                                  value={newDebt.dueDate.toISOString().split('T')[0]}
                                  onChange={(e) => handleDebtDateChange(e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Tipo</label>
                                <select
                                  className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
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
                                <label className="block text-sm font-medium text-gray-300">Status</label>
                                <select
                                  className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                                  value={newDebt.status}
                                  onChange={(e) => setNewDebt({ ...newDebt, status: e.target.value as Debt['status'] })}
                                >
                                  <option value="ACTIVE">Ativa</option>
                                  <option value="NEGOTIATING">Em Negociação</option>
                                  <option value="PAID">Paga</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Observações</label>
                                <textarea
                                  className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                                  rows={3}
                                  value={newDebt.notes}
                                  onChange={(e) => setNewDebt({ ...newDebt, notes: e.target.value })}
                                />
                              </div>
                              <button
                                onClick={addDebt}
                                className="w-full bg-red-600 text-white rounded-md py-2 hover:bg-red-700 transition-colors"
                              >
                                Adicionar Dívida
                              </button>
                            </div>
                          </div>

                          {/* Adicionar Ativo */}
                          <div className="bg-[#1e293b] border border-white/5 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Adicionar Ativo</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Descrição</label>
                                <input
                                  type="text"
                                  className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                                  value={newAsset.description || ''}
                                  onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Valor</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">R$</span>
                                  </div>
                                  <input
                                    type="number"
                                    className="pl-12 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                                    value={newAsset.value || ''}
                                    onChange={(e) => setNewAsset({ ...newAsset, value: Number(e.target.value) })}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Tipo</label>
                                <select
                                  className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                                  value={newAsset.type}
                                  onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value as 'financial' | 'non-financial' })}
                                >
                                  <option value="financial">Financeiro</option>
                                  <option value="non-financial">Não Financeiro</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Categoria</label>
                                <input
                                  type="text"
                                  className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                                  value={newAsset.category || ''}
                                  onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300">Observações</label>
                                <textarea
                                  className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                                  rows={3}
                                  value={newAsset.notes || ''}
                                  onChange={(e) => setNewAsset({ ...newAsset, notes: e.target.value })}
                                />
                              </div>
                              <button
                                onClick={addAsset}
                                className="w-full bg-green-600 text-white rounded-md py-2 hover:bg-green-700 transition-colors"
                              >
                                Adicionar Ativo
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Lista de Dívidas e Ativos */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                          {/* Lista de Dívidas */}
                          <div className="bg-[#1e293b] border border-white/5 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Minhas Dívidas</h3>
                            <div className="space-y-3">
                              {debts.map((debt) => (
                                <div key={debt.id} className="bg-gray-800/50 p-4 rounded-lg">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-medium text-gray-200">{debt.description}</h4>
                                      <p className="text-sm text-gray-400">
                                        Vencimento: {format(debt.dueDate, 'dd/MM/yyyy')}
                                      </p>
                                      <p className="text-sm text-gray-400">
                                        Taxa: {debt.interestRate}%
                                      </p>
                                      {debt.notes && (
                                        <p className="text-sm text-gray-400 mt-1">{debt.notes}</p>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <p className="text-red-400 font-medium">
                                        {formatCurrency(debt.value)}
                                      </p>
                                      <button
                                        onClick={() => deleteDebt(debt.id)}
                                        className="mt-2 text-sm text-red-400 hover:text-red-300"
                                      >
                                        Excluir
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Lista de Ativos */}
                          <div className="bg-[#1e293b] border border-white/5 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Meus Ativos</h3>
                            <div className="space-y-3">
                              {assets.map((asset, index) => (
                                <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-medium text-gray-200">{asset.description}</h4>
                                      <p className="text-sm text-gray-400">
                                        Tipo: {asset.type === 'financial' ? 'Financeiro' : 'Não Financeiro'}
                                      </p>
                                      <p className="text-sm text-gray-400">
                                        Categoria: {asset.category}
                                      </p>
                                      {asset.notes && (
                                        <p className="text-sm text-gray-400 mt-1">{asset.notes}</p>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <p className="text-green-400 font-medium">
                                        {formatCurrency(asset.value)}
                                      </p>
                                      <button
                                        onClick={() => deleteAsset(index)}
                                        className="mt-2 text-sm text-red-400 hover:text-red-300"
                                      >
                                        Excluir
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'comportamental' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                          {/* Hábitos Financeiros */}
                          <div className="bg-[#1e293b] border border-white/5 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Hábitos Financeiros</h3>
                            <textarea
                              rows={4}
                              className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                              value={behavioralData.financialHabits}
                              onChange={(e) => setBehavioralData(prev => ({ ...prev, financialHabits: e.target.value }))}
                              placeholder="Descreva seus hábitos financeiros atuais..."
                            />
                          </div>

                          {/* Relação Emocional com Dinheiro */}
                          <div className="bg-[#1e293b] border border-white/5 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Relação Emocional com Dinheiro</h3>
                            <textarea
                              rows={4}
                              className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                              value={behavioralData.emotionalRelationship}
                              onChange={(e) => setBehavioralData(prev => ({ ...prev, emotionalRelationship: e.target.value }))}
                              placeholder="Como você se relaciona emocionalmente com o dinheiro..."
                            />
                          </div>

                          {/* Objetivos Financeiros */}
                          <div className="bg-[#1e293b] border border-white/5 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Objetivos Financeiros</h3>
                            <textarea
                              rows={4}
                              className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                              value={behavioralData.financialGoals}
                              onChange={(e) => setBehavioralData(prev => ({ ...prev, financialGoals: e.target.value }))}
                              placeholder="Quais são seus objetivos financeiros atuais..."
                            />
                          </div>

                          {/* Educação Financeira */}
                          <div className="bg-[#1e293b] border border-white/5 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Educação Financeira</h3>
                            <textarea
                              rows={4}
                              className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 px-3 py-2"
                              value={behavioralData.financialEducation}
                              onChange={(e) => setBehavioralData(prev => ({ ...prev, financialEducation: e.target.value }))}
                              placeholder="Qual seu nível atual de conhecimento financeiro..."
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSection === 'eu-ideal' && (
                <EuIdeal params={{ id: params.id as string }} />
              )}

              {activeSection === 'compromissos' && (
                <Compromissos params={{ id: params.id as string }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 