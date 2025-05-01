import { Faturamento, Despesa, IndicadoresNegocio } from '@/types/negocio';

// Dados mockados temporários
const faturamentosMock: Faturamento[] = [
  {
    id: '1',
    userId: 'cliente1',
    valor: 10000,
    data: '2024-04-01',
    descricao: 'Venda de produtos',
    createdAt: '2024-04-01',
    updatedAt: '2024-04-01',
  },
  {
    id: '2',
    userId: 'cliente1',
    valor: 15000,
    data: '2024-04-15',
    descricao: 'Venda de serviços',
    createdAt: '2024-04-15',
    updatedAt: '2024-04-15',
  },
];

const despesasMock: Despesa[] = [
  {
    id: '1',
    userId: 'cliente1',
    valor: 5000,
    data: '2024-04-01',
    tipo: 'operacional',
    descricao: 'Aluguel',
    createdAt: '2024-04-01',
    updatedAt: '2024-04-01',
  },
  {
    id: '2',
    userId: 'cliente1',
    valor: 2000,
    data: '2024-04-10',
    tipo: 'extra',
    descricao: 'Manutenção',
    createdAt: '2024-04-10',
    updatedAt: '2024-04-10',
  },
];

// Funções utilitárias para localStorage
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}

function setLocal<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

const FATURAMENTOS_KEY = 'faturamentos';
const DESPESAS_KEY = 'despesas';

export async function adicionarFaturamento(faturamento: Omit<Faturamento, 'id' | 'createdAt' | 'updatedAt'>) {
  const faturamentos: Faturamento[] = getLocal(FATURAMENTOS_KEY, []);
  const novoFaturamento: Faturamento = {
    ...faturamento,
    id: Math.random().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  faturamentos.push(novoFaturamento);
  setLocal(FATURAMENTOS_KEY, faturamentos);
  return novoFaturamento.id;
}

export async function adicionarDespesa(despesa: Omit<Despesa, 'id' | 'createdAt' | 'updatedAt'>) {
  const despesas: Despesa[] = getLocal(DESPESAS_KEY, []);
  const novaDespesa: Despesa = {
    ...despesa,
    id: Math.random().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  despesas.push(novaDespesa);
  setLocal(DESPESAS_KEY, despesas);
  return novaDespesa.id;
}

export async function obterFaturamentos(userId: string) {
  const faturamentos: Faturamento[] = getLocal(FATURAMENTOS_KEY, []);
  return faturamentos.filter(f => f.userId === userId);
}

export async function obterDespesas(userId: string) {
  const despesas: Despesa[] = getLocal(DESPESAS_KEY, []);
  return despesas.filter(d => d.userId === userId);
}

export async function calcularIndicadores(userId: string): Promise<IndicadoresNegocio> {
  const faturamentos = await obterFaturamentos(userId);
  const despesas = await obterDespesas(userId);

  const faturamentoMensal = faturamentos.reduce((acc, curr) => acc + curr.valor, 0);
  const despesasOperacionais = despesas
    .filter(d => d.tipo === 'operacional')
    .reduce((acc, curr) => acc + curr.valor, 0);
  const despesasExtras = despesas
    .filter(d => d.tipo === 'extra')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const lucroLiquido = faturamentoMensal - despesasOperacionais - despesasExtras;
  const margemLucro = faturamentoMensal > 0 ? (lucroLiquido / faturamentoMensal) * 100 : 0;

  let saudeFinanceira: 'saudavel' | 'alerta' | 'critico' = 'saudavel';
  if (margemLucro < 10) {
    saudeFinanceira = 'critico';
  } else if (margemLucro < 20) {
    saudeFinanceira = 'alerta';
  }

  return {
    faturamentoMensal,
    despesasOperacionais,
    despesasExtras,
    lucroLiquido,
    margemLucro,
    saudeFinanceira,
    variacaoMensal: 0, // Implementar cálculo real
  };
}

export async function excluirFaturamento(id: string, userId: string) {
  let faturamentos: Faturamento[] = getLocal(FATURAMENTOS_KEY, []);
  faturamentos = faturamentos.filter(f => !(f.id === id && f.userId === userId));
  setLocal(FATURAMENTOS_KEY, faturamentos);
}

export async function excluirDespesa(id: string, userId: string) {
  let despesas: Despesa[] = getLocal(DESPESAS_KEY, []);
  despesas = despesas.filter(d => !(d.id === id && d.userId === userId));
  setLocal(DESPESAS_KEY, despesas);
} 