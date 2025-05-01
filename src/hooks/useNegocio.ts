import { useState, useEffect } from 'react';
import { Faturamento, Despesa, IndicadoresNegocio } from '@/types/negocio';
import {
  adicionarFaturamento,
  adicionarDespesa,
  obterFaturamentos,
  obterDespesas,
  calcularIndicadores,
  excluirFaturamento,
  excluirDespesa,
} from '@/services/negocio';

export function useNegocio(clienteId: string) {
  const [faturamentos, setFaturamentos] = useState<Faturamento[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [indicadores, setIndicadores] = useState<IndicadoresNegocio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clienteId) {
      carregarDados();
    }
  }, [clienteId]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [faturamentosData, despesasData] = await Promise.all([
        obterFaturamentos(clienteId),
        obterDespesas(clienteId),
      ]);

      setFaturamentos(faturamentosData);
      setDespesas(despesasData);

      const indicadoresData = await calcularIndicadores(clienteId);
      setIndicadores(indicadoresData);
    } catch (err) {
      setError('Erro ao carregar dados do negócio');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionarFaturamento = async (faturamento: Omit<Faturamento, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await adicionarFaturamento({
        ...faturamento,
        userId: clienteId,
      });
      await carregarDados();
      return id;
    } catch (err) {
      setError('Erro ao adicionar faturamento');
      console.error(err);
      throw err;
    }
  };

  const handleAdicionarDespesa = async (despesa: Omit<Despesa, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await adicionarDespesa({
        ...despesa,
        userId: clienteId,
      });
      await carregarDados();
      return id;
    } catch (err) {
      setError('Erro ao adicionar despesa');
      console.error(err);
      throw err;
    }
  };

  const handleExcluirFaturamento = async (id: string) => {
    try {
      await excluirFaturamento(id, clienteId);
      await carregarDados();
    } catch (err) {
      setError('Erro ao excluir faturamento');
      console.error(err);
      throw err;
    }
  };

  const handleExcluirDespesa = async (id: string) => {
    try {
      await excluirDespesa(id, clienteId);
      await carregarDados();
    } catch (err) {
      setError('Erro ao excluir despesa');
      console.error(err);
      throw err;
    }
  };

  return {
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
  };
} 