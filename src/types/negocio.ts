export interface Faturamento {
  id?: string;
  userId: string;
  valor: number;
  data: string;
  descricao: string;
  createdAt: string;
  updatedAt: string;
}

export interface Despesa {
  id?: string;
  userId: string;
  valor: number;
  data: string;
  tipo: 'operacional' | 'extra';
  descricao: string;
  categoria?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsolidadoMensal {
  id?: string;
  userId: string;
  mes: string;
  faturamentoTotal: number;
  despesasOperacionais: number;
  despesasExtras: number;
  lucroLiquido: number;
  margemLucro: number;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

export interface IndicadoresNegocio {
  faturamentoMensal: number;
  despesasOperacionais: number;
  despesasExtras: number;
  lucroLiquido: number;
  variacaoMensal: number;
  margemLucro: number;
  saudeFinanceira: 'saudavel' | 'alerta' | 'critico';
} 