import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface FinancialGoalsProps {
  data: {
    income: number;
    fixedExpenses: number;
    variableExpenses: number;
    creditCardDebt: number;
    monthlyDebt: number;
    financialAssets: number;
    nonFinancialAssets: number;
    liabilities: number;
  };
}

export default function FinancialGoals({ data }: FinancialGoalsProps) {
  const [goals, setGoals] = useState({
    monthlyBalance: 0,
    savingsRate: 0,
    debtToIncomeRatio: 0,
    netWorth: 0,
    financialIndependence: 0,
  });

  const [progress, setProgress] = useState({
    monthlyBalance: 0,
    savingsRate: 0,
    debtToIncomeRatio: 0,
    netWorth: 0,
    financialIndependence: 0,
  });

  useEffect(() => {
    // Calcula os objetivos baseados nos dados atuais
    const totalExpenses = data.fixedExpenses + data.variableExpenses + data.monthlyDebt;
    const monthlyBalance = data.income - totalExpenses;
    const savingsRate = (monthlyBalance / data.income) * 100;
    const debtToIncomeRatio = ((data.creditCardDebt + data.monthlyDebt) / data.income) * 100;
    const netWorth = (data.financialAssets + data.nonFinancialAssets) - data.liabilities;
    
    // Define objetivos mais ambiciosos
    const idealGoals = {
      monthlyBalance: monthlyBalance * 1.5, // 50% a mais que o atual
      savingsRate: Math.max(savingsRate + 10, 30), // Aumenta 10% ou mínimo de 30%
      debtToIncomeRatio: Math.max(debtToIncomeRatio - 20, 20), // Reduz 20% ou máximo de 20%
      netWorth: netWorth * 1.3, // 30% a mais que o atual
      financialIndependence: data.income * 25, // 25x a renda anual (regra dos 4%)
    };
    
    // Calcula o progresso atual em relação aos objetivos
    const currentProgress = {
      monthlyBalance: (monthlyBalance / idealGoals.monthlyBalance) * 100,
      savingsRate: (savingsRate / idealGoals.savingsRate) * 100,
      debtToIncomeRatio: Math.max(0, 100 - (debtToIncomeRatio / idealGoals.debtToIncomeRatio) * 100),
      netWorth: (netWorth / idealGoals.netWorth) * 100,
      financialIndependence: (netWorth / idealGoals.financialIndependence) * 100,
    };
    
    setGoals(idealGoals);
    setProgress(currentProgress);
  }, [data]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const goalData = [
    { name: 'Saldo Mensal', value: progress.monthlyBalance, goal: goals.monthlyBalance },
    { name: 'Taxa de Poupança', value: progress.savingsRate, goal: goals.savingsRate },
    { name: 'Redução de Dívidas', value: progress.debtToIncomeRatio, goal: goals.debtToIncomeRatio },
    { name: 'Patrimônio Líquido', value: progress.netWorth, goal: goals.netWorth },
    { name: 'Independência Financeira', value: progress.financialIndependence, goal: goals.financialIndependence },
  ];

  const pieData = goalData.map(item => ({
    name: item.name,
    value: item.value,
  }));

  // Função personalizada para formatar o valor no Tooltip
  const formatTooltipValue = (value: any) => {
    if (typeof value === 'number') {
      return `${value.toFixed(1)}%`;
    }
    return value;
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Seu Caminho para o Sucesso Financeiro</h2>
        <p className="text-blue-100">
          Visualize seus objetivos e acompanhe seu progresso em direção à sua vida financeira ideal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Seus Objetivos Financeiros</h3>
          <div className="space-y-4">
            {goalData.map((item, index) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  <span className="text-sm font-medium text-gray-700">{item.value.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, item.value)}%`, 
                      backgroundColor: COLORS[index % COLORS.length] 
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  Meta: {item.name === 'Saldo Mensal' || item.name === 'Patrimônio Líquido' || item.name === 'Independência Financeira' 
                    ? `R$ ${item.goal.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}` 
                    : `${item.goal.toFixed(1)}%`}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Visão Geral do Progresso</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={formatTooltipValue} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Dicas para Alcançar seus Objetivos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Aumente sua Poupança</h4>
            <p className="text-sm text-blue-700">
              Tente aumentar sua taxa de poupança gradualmente, começando com 1% a mais por mês.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Reduza Dívidas</h4>
            <p className="text-sm text-green-700">
              Priorize o pagamento de dívidas com juros mais altos e considere a consolidação.
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">Invista Regularmente</h4>
            <p className="text-sm text-purple-700">
              Crie um hábito de investir uma parte fixa da sua renda todos os meses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 