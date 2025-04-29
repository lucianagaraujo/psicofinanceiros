'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import FinancialGoals from '@/components/FinancialGoals';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function EuIdeal() {
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

  const [behavioralData, setBehavioralData] = useState({
    financialHabits: '',
    emotionalRelationship: '',
    financialGoals: '',
    financialEducation: '',
  });

  const handleFinancialDataChange = (field: string, value: string) => {
    setFinancialData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-3xl font-bold text-gray-900">Meu Estado Ideal</h1>
        <p className="mt-2 text-sm text-gray-700">
          Defina seus objetivos financeiros e comportamentais para o futuro.
        </p>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-blue-700'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Financeiro
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-blue-700'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Comportamental
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-6">
          <Tab.Panel className="rounded-xl bg-white p-6 shadow">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Dívidas e Despesas</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="creditCardDebt" className="block text-sm font-medium text-gray-700">
                      Dívida no Cartão de Crédito
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">R$</span>
                      </div>
                      <input
                        type="number"
                        name="creditCardDebt"
                        id="creditCardDebt"
                        className="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={financialData.creditCardDebt}
                        onChange={(e) => handleFinancialDataChange('creditCardDebt', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="monthlyDebt" className="block text-sm font-medium text-gray-700">
                      Dívidas Mensais
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">R$</span>
                      </div>
                      <input
                        type="number"
                        name="monthlyDebt"
                        id="monthlyDebt"
                        className="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={financialData.monthlyDebt}
                        onChange={(e) => handleFinancialDataChange('monthlyDebt', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Receitas e Ativos</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="income" className="block text-sm font-medium text-gray-700">
                      Receita Mensal
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">R$</span>
                      </div>
                      <input
                        type="number"
                        name="income"
                        id="income"
                        className="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={financialData.income}
                        onChange={(e) => handleFinancialDataChange('income', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="financialAssets" className="block text-sm font-medium text-gray-700">
                      Ativos Financeiros
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">R$</span>
                      </div>
                      <input
                        type="number"
                        name="financialAssets"
                        id="financialAssets"
                        className="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={financialData.financialAssets}
                        onChange={(e) => handleFinancialDataChange('financialAssets', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Despesas</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fixedExpenses" className="block text-sm font-medium text-gray-700">
                      Despesas Fixas
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">R$</span>
                      </div>
                      <input
                        type="number"
                        name="fixedExpenses"
                        id="fixedExpenses"
                        className="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={financialData.fixedExpenses}
                        onChange={(e) => handleFinancialDataChange('fixedExpenses', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="variableExpenses" className="block text-sm font-medium text-gray-700">
                      Despesas Variáveis
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">R$</span>
                      </div>
                      <input
                        type="number"
                        name="variableExpenses"
                        id="variableExpenses"
                        className="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={financialData.variableExpenses}
                        onChange={(e) => handleFinancialDataChange('variableExpenses', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <FinancialGoals data={financialData} />
            </div>
          </Tab.Panel>

          <Tab.Panel className="rounded-xl bg-white p-6 shadow">
            <div className="space-y-6">
              <div>
                <label htmlFor="financialHabits" className="block text-sm font-medium text-gray-700">
                  Hábitos Financeiros Desejados
                </label>
                <textarea
                  id="financialHabits"
                  name="financialHabits"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={behavioralData.financialHabits}
                  onChange={(e) => setBehavioralData({ ...behavioralData, financialHabits: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="emotionalRelationship" className="block text-sm font-medium text-gray-700">
                  Relação Emocional Ideal com o Dinheiro
                </label>
                <textarea
                  id="emotionalRelationship"
                  name="emotionalRelationship"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={behavioralData.emotionalRelationship}
                  onChange={(e) => setBehavioralData({ ...behavioralData, emotionalRelationship: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="financialGoals" className="block text-sm font-medium text-gray-700">
                  Objetivos Financeiros de Longo Prazo
                </label>
                <textarea
                  id="financialGoals"
                  name="financialGoals"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={behavioralData.financialGoals}
                  onChange={(e) => setBehavioralData({ ...behavioralData, financialGoals: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="financialEducation" className="block text-sm font-medium text-gray-700">
                  Nível de Educação Financeira Desejado
                </label>
                <textarea
                  id="financialEducation"
                  name="financialEducation"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={behavioralData.financialEducation}
                  onChange={(e) => setBehavioralData({ ...behavioralData, financialEducation: e.target.value })}
                />
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <div className="mt-6">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Salvar Estado Ideal
        </button>
      </div>
    </div>
  );
} 