'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown, DollarSign, AlertCircle, CheckCircle, ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import { useNegocio } from '@/hooks/useNegocio';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { Faturamento, Despesa } from '@/types/negocio';
import { LineChart, BarChart } from '@/components/charts';
import { toast } from 'sonner';
import Link from 'next/link';

export default function MeuNegocioPage() {
  const params = useParams();
  const router = useRouter();
  const clienteId = params.id as string;
  const [activeTab, setActiveTab] = useState('faturamento');
  const [faturamentoForm, setFaturamentoForm] = useState({
    valor: '',
    data: '',
    descricao: '',
  });
  const [despesaForm, setDespesaForm] = useState({
    valor: '',
    data: '',
    descricao: '',
    tipo: 'operacional' as 'operacional' | 'extra',
  });

  const { user } = useAuth();
  const {
    faturamentos,
    despesas,
    indicadores,
    loading,
    error,
    handleAdicionarFaturamento,
    handleAdicionarDespesa,
    handleExcluirFaturamento,
    handleExcluirDespesa,
    carregarDados,
  } = useNegocio(clienteId);

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });

  function isWithinRange(dateStr: string, start: string, end: string) {
    const d = new Date(dateStr);
    return d >= new Date(start) && d <= new Date(end);
  }

  const faturamentosPeriodo = faturamentos.filter(f => isWithinRange(f.data, startDate, endDate));
  const despesasPeriodo = despesas.filter(d => isWithinRange(d.data, startDate, endDate));
  const despesasOperacionaisPeriodo = despesasPeriodo.filter(d => d.tipo === 'operacional');
  const despesasExtrasPeriodo = despesasPeriodo.filter(d => d.tipo === 'extra');

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  const handleSubmitFaturamento = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleAdicionarFaturamento({
        valor: parseFloat(faturamentoForm.valor),
        data: faturamentoForm.data,
        descricao: faturamentoForm.descricao,
        userId: clienteId,
      });
      toast.success('Faturamento adicionado com sucesso!');
      setFaturamentoForm({ valor: '', data: '', descricao: '' });
      if (faturamentoForm.data < startDate) setStartDate(faturamentoForm.data);
      if (faturamentoForm.data > endDate) setEndDate(faturamentoForm.data);
      await carregarDados();
    } catch (err) {
      console.error('Erro ao adicionar faturamento:', err);
      toast.error('Erro ao adicionar faturamento. Tente novamente.');
    }
  };

  const handleSubmitDespesa = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleAdicionarDespesa({
        valor: parseFloat(despesaForm.valor),
        data: despesaForm.data,
        descricao: despesaForm.descricao,
        tipo: despesaForm.tipo,
        userId: clienteId,
      });
      toast.success('Despesa adicionada com sucesso!');
      setDespesaForm({ valor: '', data: '', descricao: '', tipo: 'operacional' });
      if (despesaForm.data < startDate) setStartDate(despesaForm.data);
      if (despesaForm.data > endDate) setEndDate(despesaForm.data);
      await carregarDados();
    } catch (err) {
      console.error('Erro ao adicionar despesa:', err);
      toast.error('Erro ao adicionar despesa. Tente novamente.');
    }
  };

  // Função para feedback de saúde financeira
  function getSaudeFinanceira() {
    const lucroLiquido = faturamentosPeriodo.reduce((acc, f) => acc + f.valor, 0) -
                        despesasPeriodo.reduce((acc, d) => acc + d.valor, 0);
    const faturamentoTotal = faturamentosPeriodo.reduce((acc, f) => acc + f.valor, 0);
    const margemLucro = faturamentoTotal > 0 ? lucroLiquido / faturamentoTotal : 0;

    if (!faturamentosPeriodo.length && !despesasPeriodo.length) {
      return { 
        status: 'Sem dados', 
        cor: 'bg-gray-100 text-gray-600', 
        icon: AlertCircle,
        message: 'Comece cadastrando seu primeiro faturamento ou despesa!'
      };
    }
    if (lucroLiquido > 0 && margemLucro > 0.2) {
      return { 
        status: 'Saudável', 
        cor: 'bg-green-100 text-green-800', 
        icon: CheckCircle,
        message: `Lucro líquido positivo com margem de ${(margemLucro * 100).toFixed(1)}%`
      };
    }
    if (lucroLiquido > 0) {
      return { 
        status: 'Atenção', 
        cor: 'bg-yellow-100 text-yellow-800', 
        icon: AlertCircle,
        message: `Lucro positivo, mas margem baixa de ${(margemLucro * 100).toFixed(1)}%`
      };
    }
    return { 
      status: 'Crítico', 
      cor: 'bg-red-100 text-red-800', 
      icon: AlertCircle,
      message: lucroLiquido === 0 ? 'Sem movimentação no período' : 'Prejuízo no período'
    };
  }

  const saude = getSaudeFinanceira();

  // Dados para gráficos no formato Chart.js
  const chartLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const faturamentoDataset = faturamentos.length
    ? faturamentos.map(f => f.valor)
    : chartLabels.map(() => 0);
  const despesasOperacionaisDataset = chartLabels.map((_, i) =>
    despesas.filter(d => d.tipo === 'operacional')[i]?.valor || 0
  );
  const despesasExtrasDataset = chartLabels.map((_, i) =>
    despesas.filter(d => d.tipo === 'extra')[i]?.valor || 0
  );

  const dataLineChart = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Faturamento',
        data: faturamentoDataset,
        borderColor: 'rgb(34,197,94)', // verde
        backgroundColor: 'rgba(34,197,94,0.2)',
      },
    ],
  };

  const dataBarChart = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Despesas Operacionais',
        data: despesasOperacionaisDataset,
        backgroundColor: 'rgba(59,130,246,0.7)', // azul
      },
      {
        label: 'Despesas Extras',
        data: despesasExtrasDataset,
        backgroundColor: 'rgba(253,224,71,0.7)', // amarelo
      },
    ],
  };

  // Função para excluir faturamento com feedback
  const excluirFaturamento = async (id: string) => {
    if (!id) return;
    await handleExcluirFaturamento(id);
    toast.success('Faturamento excluído com sucesso!');
  };

  // Função para excluir despesa com feedback
  const excluirDespesa = async (id: string) => {
    if (!id) return;
    await handleExcluirDespesa(id);
    toast.success('Despesa excluída com sucesso!');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* BOTÃO VOLTAR */}
        <div className="mb-8">
          <Link
            href={`/cliente/${clienteId}`}
            className="inline-flex items-center px-4 py-2 bg-[#1e293b] hover:bg-[#2d3a4f] border border-white/5 rounded-lg text-gray-300 transition-colors"
          >
            ← Voltar para o Dashboard
          </Link>
        </div>

        <div className="bg-[#1e293b]/80 backdrop-blur-sm rounded-xl shadow-2xl border border-white/5 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Meu Negócio</h1>
              <p className="text-gray-400">Gerencie suas finanças e acompanhe o desempenho</p>
            </div>
          </div>

          {/* CARDS DE MÉTRICAS */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-[#2d3a4f] rounded-xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Faturamento Mensal</h3>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-2">
                {formatCurrency(faturamentosPeriodo.reduce((acc, f) => acc + f.valor, 0))}
              </p>
              <p className="text-sm text-gray-400">
                {faturamentosPeriodo.length === 0 ? 'Clique para adicionar faturamento' : 
                `${indicadores?.variacaoMensal || 0}% em relação ao mês anterior`}
              </p>
            </div>

            <div className="bg-[#2d3a4f] rounded-xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Despesas Operacionais</h3>
                <TrendingDown className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-2">
                {formatCurrency(despesasOperacionaisPeriodo.reduce((acc, d) => acc + d.valor, 0))}
              </p>
              <p className="text-sm text-gray-400">
                Despesas essenciais do negócio
              </p>
            </div>

            <div className="bg-[#2d3a4f] rounded-xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Despesas Extras</h3>
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-2">
                {formatCurrency(despesasExtrasPeriodo.reduce((acc, d) => acc + d.valor, 0))}
              </p>
              <p className="text-sm text-gray-400">
                Despesas não operacionais
              </p>
            </div>

            <div className="bg-[#2d3a4f] rounded-xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Saúde Financeira</h3>
                <saude.icon className={`w-8 h-8 ${
                  saude.status === 'Saudável' ? 'text-green-400' :
                  saude.status === 'Atenção' ? 'text-yellow-400' :
                  'text-red-400'
                }`} />
              </div>
              <p className="text-3xl font-bold text-white mb-2">{saude.status}</p>
              <p className="text-sm text-gray-400">{saude.message}</p>
            </div>
          </div>

          {/* FILTRO DE PERÍODO */}
          <div className="flex gap-4 mb-8">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-[#2d3a4f] border-white/5 text-gray-100"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-[#2d3a4f] border-white/5 text-gray-100"
            />
          </div>

          {/* TABS E CONTEÚDO */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-[#2d3a4f] p-1 rounded-xl">
              <TabsTrigger
                value="faturamento"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 rounded-lg"
              >
                Faturamento
              </TabsTrigger>
              <TabsTrigger
                value="despesas"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-400 rounded-lg"
              >
                Despesas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="faturamento" className="space-y-8">
              {/* FORMULÁRIO DE FATURAMENTO */}
              <form onSubmit={handleSubmitFaturamento} className="bg-[#2d3a4f] rounded-xl border border-white/5 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    type="number"
                    placeholder="Valor"
                    value={faturamentoForm.valor}
                    onChange={(e) => setFaturamentoForm(prev => ({ ...prev, valor: e.target.value }))}
                    className="bg-[#1e293b] border-white/5 text-gray-100"
                    required
                  />
                  <Input
                    type="date"
                    value={faturamentoForm.data}
                    onChange={(e) => setFaturamentoForm(prev => ({ ...prev, data: e.target.value }))}
                    className="bg-[#1e293b] border-white/5 text-gray-100"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Descrição"
                    value={faturamentoForm.descricao}
                    onChange={(e) => setFaturamentoForm(prev => ({ ...prev, descricao: e.target.value }))}
                    className="bg-[#1e293b] border-white/5 text-gray-100"
                    required
                  />
                </div>
                <Button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Faturamento
                </Button>
              </form>

              {/* LISTA DE FATURAMENTOS */}
              <div className="space-y-4">
                {faturamentosPeriodo.map((f) => (
                  <div key={f.id} className="bg-[#2d3a4f] rounded-lg border border-white/5 p-4 flex items-center justify-between hover:border-white/10 transition-all duration-300">
                    <div>
                      <p className="font-medium text-white">{formatCurrency(f.valor)}</p>
                      <p className="text-sm text-gray-400">{f.descricao}</p>
                      <p className="text-xs text-gray-500">{f.data}</p>
                    </div>
                    <button
                      onClick={() => f.id && excluirFaturamento(f.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="despesas" className="space-y-8">
              {/* FORMULÁRIO DE DESPESAS */}
              <form onSubmit={handleSubmitDespesa} className="bg-[#2d3a4f] rounded-xl border border-white/5 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    type="number"
                    placeholder="Valor"
                    value={despesaForm.valor}
                    onChange={(e) => setDespesaForm(prev => ({ ...prev, valor: e.target.value }))}
                    className="bg-[#1e293b] border-white/5 text-gray-100"
                    required
                  />
                  <Input
                    type="date"
                    value={despesaForm.data}
                    onChange={(e) => setDespesaForm(prev => ({ ...prev, data: e.target.value }))}
                    className="bg-[#1e293b] border-white/5 text-gray-100"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Descrição"
                    value={despesaForm.descricao}
                    onChange={(e) => setDespesaForm(prev => ({ ...prev, descricao: e.target.value }))}
                    className="bg-[#1e293b] border-white/5 text-gray-100"
                    required
                  />
                  <select
                    value={despesaForm.tipo}
                    onChange={(e) => setDespesaForm(prev => ({ ...prev, tipo: e.target.value as 'operacional' | 'extra' }))}
                    className="bg-[#1e293b] border border-white/5 rounded-lg text-gray-100 px-3 py-2"
                    required
                  >
                    <option value="operacional">Operacional</option>
                    <option value="extra">Extra</option>
                  </select>
                </div>
                <Button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Despesa
                </Button>
              </form>

              {/* LISTA DE DESPESAS */}
              <div className="space-y-4">
                {despesasPeriodo.map((d) => (
                  <div key={d.id} className="bg-[#2d3a4f] rounded-lg border border-white/5 p-4 flex items-center justify-between hover:border-white/10 transition-all duration-300">
                    <div>
                      <p className="font-medium text-white">{formatCurrency(d.valor)}</p>
                      <p className="text-sm text-gray-400">{d.descricao}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          d.tipo === 'operacional' ? 'bg-blue-400/10 text-blue-400' : 'bg-yellow-400/10 text-yellow-400'
                        }`}>
                          {d.tipo === 'operacional' ? 'Operacional' : 'Extra'}
                        </span>
                        <span className="text-xs text-gray-500">{d.data}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => d.id && excluirDespesa(d.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* GRÁFICOS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="bg-[#2d3a4f] rounded-xl border border-white/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Evolução do Faturamento</h3>
              <div className="h-[300px]">
                <LineChart data={dataLineChart} />
              </div>
            </div>
            <div className="bg-[#2d3a4f] rounded-xl border border-white/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Despesas por Tipo</h3>
              <div className="h-[300px]">
                <BarChart data={dataBarChart} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 