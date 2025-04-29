import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FinancialData {
  income: number;
  fixedExpenses: number;
  variableExpenses: number;
  creditCardDebt: number;
  monthlyDebt: number;
  financialAssets: number;
  nonFinancialAssets: number;
  liabilities: number;
}

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

interface FinancialAnalysisProps {
  data: FinancialData;
}

export default function FinancialAnalysis({ data }: FinancialAnalysisProps) {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [analysis, setAnalysis] = useState({
    totalExpenses: 0,
    monthlyBalance: 0,
    savingsRate: 0,
    debtToIncomeRatio: 0,
    netWorth: 0,
    feedback: '',
  });

  useEffect(() => {
    // Calcula totais
    const totalExpenses = data.fixedExpenses + data.variableExpenses + data.monthlyDebt;
    const monthlyBalance = data.income - totalExpenses;
    const savingsRate = (monthlyBalance / data.income) * 100;
    const debtToIncomeRatio = ((data.creditCardDebt + data.monthlyDebt) / data.income) * 100;
    const netWorth = (data.financialAssets + data.nonFinancialAssets) - data.liabilities;

    // Gera dados dos últimos 3 meses (simulado)
    const lastThreeMonths = Array.from({ length: 3 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        income: data.income,
        expenses: totalExpenses,
        balance: monthlyBalance,
      };
    }).reverse();

    // Gera feedback baseado nos indicadores
    let feedback = '';
    if (monthlyBalance < 0) {
      feedback = '⚠️ Você está com déficit mensal. Recomendamos revisar suas despesas.';
    } else if (savingsRate < 20) {
      feedback = '💡 Sua taxa de poupança está abaixo do recomendado (20%).';
    } else if (debtToIncomeRatio > 40) {
      feedback = '⚠️ Sua relação dívida/renda está alta. Considere reduzir suas dívidas.';
    } else {
      feedback = '✅ Sua situação financeira está equilibrada! Continue assim!';
    }

    setMonthlyData(lastThreeMonths);
    setAnalysis({
      totalExpenses,
      monthlyBalance,
      savingsRate,
      debtToIncomeRatio,
      netWorth,
      feedback,
    });
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Saldo Mensal</h3>
          <p className={`text-2xl font-bold ${analysis.monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {analysis.monthlyBalance.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Taxa de Poupança</h3>
          <p className="text-2xl font-bold text-blue-600">
            {analysis.savingsRate.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Dívida/Renda</h3>
          <p className="text-2xl font-bold text-blue-600">
            {analysis.debtToIncomeRatio.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Patrimônio Líquido</h3>
          <p className="text-2xl font-bold text-blue-600">
            R$ {analysis.netWorth.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Evolução dos Últimos 3 Meses</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#2563eb" name="Receita" />
              <Line type="monotone" dataKey="expenses" stroke="#dc2626" name="Despesas" />
              <Line type="monotone" dataKey="balance" stroke="#059669" name="Saldo" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Análise Financeira</h3>
        <p className="text-gray-700">{analysis.feedback}</p>
      </div>
    </div>
  );
} 