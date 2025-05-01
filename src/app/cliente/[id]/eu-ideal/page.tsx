'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import FinancialGoals from '@/components/FinancialGoals';
import Link from 'next/link';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  params: {
    id: string;
  };
}

export default function EuIdeal({ params }: Props) {
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
    <div className="min-h-screen bg-[#0f172a] text-gray-100">
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
              <h1 className="text-2xl font-bold text-white">Eu Ideal</h1>
              <p className="text-gray-300 mt-1">Defina seus objetivos e metas financeiras</p>
            </div>
          </div>

          <Tab.Group>
            <Tab.List className="flex space-x-4 bg-gray-800/50 p-1 rounded-lg backdrop-blur-lg border border-white/10 mb-6">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'flex-1 px-4 py-2 rounded-md transition-all duration-200',
                    selected
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  )
                }
              >
                Financeiro
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'flex-1 px-4 py-2 rounded-md transition-all duration-200',
                    selected
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  )
                }
              >
                Comportamental
              </Tab>
            </Tab.List>

            <Tab.Panels>
              <Tab.Panel className="bg-gray-800/40 backdrop-blur-sm rounded-lg border border-white/10 p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Dívidas e Despesas</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="creditCardDebt" className="block text-sm font-medium text-gray-300">
                          Dívida no Cartão de Crédito
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400">R$</span>
                          </div>
                          <input
                            type="number"
                            name="creditCardDebt"
                            id="creditCardDebt"
                            className="pl-12 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={financialData.creditCardDebt}
                            onChange={(e) => handleFinancialDataChange('creditCardDebt', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="monthlyDebt" className="block text-sm font-medium text-gray-300">
                          Dívidas Mensais
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400">R$</span>
                          </div>
                          <input
                            type="number"
                            name="monthlyDebt"
                            id="monthlyDebt"
                            className="pl-12 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={financialData.monthlyDebt}
                            onChange={(e) => handleFinancialDataChange('monthlyDebt', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Receitas e Ativos</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="income" className="block text-sm font-medium text-gray-300">
                          Receita Mensal
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400">R$</span>
                          </div>
                          <input
                            type="number"
                            name="income"
                            id="income"
                            className="pl-12 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={financialData.income}
                            onChange={(e) => handleFinancialDataChange('income', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="financialAssets" className="block text-sm font-medium text-gray-300">
                          Ativos Financeiros
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400">R$</span>
                          </div>
                          <input
                            type="number"
                            name="financialAssets"
                            id="financialAssets"
                            className="pl-12 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={financialData.financialAssets}
                            onChange={(e) => handleFinancialDataChange('financialAssets', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Despesas</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="fixedExpenses" className="block text-sm font-medium text-gray-300">
                          Despesas Fixas
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400">R$</span>
                          </div>
                          <input
                            type="number"
                            name="fixedExpenses"
                            id="fixedExpenses"
                            className="pl-12 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={financialData.fixedExpenses}
                            onChange={(e) => handleFinancialDataChange('fixedExpenses', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="variableExpenses" className="block text-sm font-medium text-gray-300">
                          Despesas Variáveis
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400">R$</span>
                          </div>
                          <input
                            type="number"
                            name="variableExpenses"
                            id="variableExpenses"
                            className="pl-12 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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

              <Tab.Panel className="bg-gray-800/40 backdrop-blur-sm rounded-lg border border-white/10 p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Análise Comportamental</h3>
                  <div>
                    <label htmlFor="financialHabits" className="block text-sm font-medium text-gray-300">
                      Hábitos Financeiros Desejados
                    </label>
                    <textarea
                      id="financialHabits"
                      name="financialHabits"
                      rows={3}
                      className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      value={behavioralData.financialHabits}
                      onChange={(e) => setBehavioralData({ ...behavioralData, financialHabits: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="emotionalRelationship" className="block text-sm font-medium text-gray-300">
                      Relação Emocional Ideal com o Dinheiro
                    </label>
                    <textarea
                      id="emotionalRelationship"
                      name="emotionalRelationship"
                      rows={3}
                      className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      value={behavioralData.emotionalRelationship}
                      onChange={(e) => setBehavioralData({ ...behavioralData, emotionalRelationship: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="financialGoals" className="block text-sm font-medium text-gray-300">
                      Objetivos Financeiros de Longo Prazo
                    </label>
                    <textarea
                      id="financialGoals"
                      name="financialGoals"
                      rows={3}
                      className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      value={behavioralData.financialGoals}
                      onChange={(e) => setBehavioralData({ ...behavioralData, financialGoals: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="financialEducation" className="block text-sm font-medium text-gray-300">
                      Nível de Educação Financeira Desejado
                    </label>
                    <textarea
                      id="financialEducation"
                      name="financialEducation"
                      rows={3}
                      className="mt-1 block w-full bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      value={behavioralData.financialEducation}
                      onChange={(e) => setBehavioralData({ ...behavioralData, financialEducation: e.target.value })}
                    />
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Salvar Estado Ideal
          </button>
        </div>
      </div>
    </div>
  );
} 