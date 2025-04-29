'use client';

import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Debt {
  description: string;
  value: number;
  interestRate: number;
  dueDate: string;
  type: 'credit' | 'loan' | 'other';
  status: 'active' | 'paid';
  notes?: string;
}

interface Asset {
  description: string;
  value: number;
  type: 'financial' | 'non-financial';
  category: string;
  notes?: string;
}

export default function MeuPatrimonio() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [newDebt, setNewDebt] = useState<Partial<Debt>>({
    type: 'credit',
    status: 'active'
  });
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    type: 'financial'
  });

  const addDebt = () => {
    if (newDebt.description && newDebt.value) {
      setDebts([...debts, newDebt as Debt]);
      setNewDebt({
        type: 'credit',
        status: 'active'
      });
    }
  };

  const addAsset = () => {
    if (newAsset.description && newAsset.value) {
      setAssets([...assets, newAsset as Asset]);
      setNewAsset({
        type: 'financial'
      });
    }
  };

  const deleteDebt = (index: number) => {
    const updatedDebts = [...debts];
    updatedDebts.splice(index, 1);
    setDebts(updatedDebts);
  };

  const deleteAsset = (index: number) => {
    const updatedAssets = [...assets];
    updatedAssets.splice(index, 1);
    setAssets(updatedAssets);
  };

  const getTotalDebts = () => {
    return debts.reduce((sum, debt) => sum + debt.value, 0);
  };

  const getTotalAssets = () => {
    return assets.reduce((sum, asset) => sum + asset.value, 0);
  };

  const getNetWorth = () => {
    return getTotalAssets() - getTotalDebts();
  };

  const getChartData = () => {
    const totalDebts = getTotalDebts();
    const totalAssets = getTotalAssets();
    const netWorth = getNetWorth();

    return {
      labels: ['Dívidas', 'Ativos', 'Patrimônio Líquido'],
      datasets: [
        {
          data: [totalDebts, totalAssets, netWorth],
          backgroundColor: [
            'rgba(239, 68, 68, 0.5)',
            'rgba(34, 197, 94, 0.5)',
            'rgba(59, 130, 246, 0.5)'
          ],
          borderColor: [
            'rgb(239, 68, 68)',
            'rgb(34, 197, 94)',
            'rgb(59, 130, 246)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">MEU PATRIMÔNIO</h1>
        <p className="mt-2 text-sm text-gray-700">
          Visão geral do seu patrimônio, incluindo dívidas e ativos
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Visão Geral */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Visão Geral</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-red-800">Total de Dívidas</h3>
                <p className="mt-1 text-2xl font-semibold text-red-600">
                  R$ {getTotalDebts().toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-800">Total de Ativos</h3>
                <p className="mt-1 text-2xl font-semibold text-green-600">
                  R$ {getTotalAssets().toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800">Patrimônio Líquido</h3>
                <p className="mt-1 text-2xl font-semibold text-blue-600">
                  R$ {getNetWorth().toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Distribuição do Patrimônio</h2>
            <div className="h-64">
              <Pie
                data={getChartData()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Formulários */}
        <div className="space-y-6">
          {/* Adicionar Dívida */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Adicionar Dívida</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newDebt.description || ''}
                  onChange={(e) => setNewDebt({ ...newDebt, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valor</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newDebt.value || ''}
                  onChange={(e) => setNewDebt({ ...newDebt, value: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Taxa de Juros (%)</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newDebt.interestRate || ''}
                  onChange={(e) => setNewDebt({ ...newDebt, interestRate: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data de Vencimento</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newDebt.dueDate || ''}
                  onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newDebt.type}
                  onChange={(e) => setNewDebt({ ...newDebt, type: e.target.value as Debt['type'] })}
                >
                  <option value="credit">Cartão de Crédito</option>
                  <option value="loan">Empréstimo</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newDebt.status}
                  onChange={(e) => setNewDebt({ ...newDebt, status: e.target.value as Debt['status'] })}
                >
                  <option value="active">Ativa</option>
                  <option value="paid">Paga</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Observações</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  rows={3}
                  value={newDebt.notes || ''}
                  onChange={(e) => setNewDebt({ ...newDebt, notes: e.target.value })}
                />
              </div>
              <button
                onClick={addDebt}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Adicionar Dívida
              </button>
            </div>
          </div>

          {/* Adicionar Ativo */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Adicionar Ativo</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newAsset.description || ''}
                  onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valor</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newAsset.value || ''}
                  onChange={(e) => setNewAsset({ ...newAsset, value: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newAsset.type}
                  onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value as Asset['type'] })}
                >
                  <option value="financial">Financeiro</option>
                  <option value="non-financial">Não Financeiro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoria</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newAsset.category || ''}
                  onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Observações</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  rows={3}
                  value={newAsset.notes || ''}
                  onChange={(e) => setNewAsset({ ...newAsset, notes: e.target.value })}
                />
              </div>
              <button
                onClick={addAsset}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Adicionar Ativo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Dívidas e Ativos */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Lista de Dívidas */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Minhas Dívidas</h2>
          <div className="space-y-4">
            {debts.map((debt, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{debt.description}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Tipo: {debt.type === 'credit' ? 'Cartão de Crédito' : debt.type === 'loan' ? 'Empréstimo' : 'Outro'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {debt.status === 'active' ? 'Ativa' : 'Paga'}
                    </p>
                    {debt.interestRate && (
                      <p className="text-sm text-gray-500">
                        Taxa de Juros: {debt.interestRate}%
                      </p>
                    )}
                    {debt.dueDate && (
                      <p className="text-sm text-gray-500">
                        Vencimento: {new Date(debt.dueDate).toLocaleDateString()}
                      </p>
                    )}
                    {debt.notes && (
                      <p className="mt-2 text-sm text-gray-500">{debt.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      R$ {debt.value.toFixed(2)}
                    </p>
                    <button
                      onClick={() => deleteDebt(index)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
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
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Meus Ativos</h2>
          <div className="space-y-4">
            {assets.map((asset, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{asset.description}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Tipo: {asset.type === 'financial' ? 'Financeiro' : 'Não Financeiro'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Categoria: {asset.category}
                    </p>
                    {asset.notes && (
                      <p className="mt-2 text-sm text-gray-500">{asset.notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      R$ {asset.value.toFixed(2)}
                    </p>
                    <button
                      onClick={() => deleteAsset(index)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
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
  );
} 