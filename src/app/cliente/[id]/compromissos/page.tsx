'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import BackButton from '@/components/BackButton';
import Link from 'next/link';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

export default function Compromissos({ params }: Props) {
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

    // Verifica se atingiu a meta (progresso >= 8)
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
          <h1 className="text-2xl font-bold text-white mb-4">Compromissos</h1>
          <p className="text-gray-300">Conteúdo da página de Compromissos...</p>
        </div>

        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md text-center">
              <h3 className="text-2xl font-bold text-green-600 mb-4">🎉 Celebração!</h3>
              <p className="text-gray-700">{celebrationMessage}</p>
              <button
                onClick={() => setShowCelebration(false)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Novo Compromisso</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <select
                  id="type"
                  name="type"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newCommitment.type}
                  onChange={(e) =>
                    setNewCommitment({
                      ...newCommitment,
                      type: e.target.value as 'FINANCIAL' | 'BEHAVIORAL',
                    })
                  }
                >
                  <option value="FINANCIAL">Financeiro</option>
                  <option value="BEHAVIORAL">Comportamental</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={newCommitment.description}
                  onChange={(e) => setNewCommitment({ ...newCommitment, description: e.target.value })}
                  placeholder="Ex: Caminhar todos os dias por 30 minutos"
                />
              </div>

              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={addCommitment}
              >
                Adicionar Compromisso
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Registrar Evolução</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="commitment" className="block text-sm font-medium text-gray-700">
                  Compromisso
                </label>
                <select
                  id="commitment"
                  name="commitment"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={selectedCommitment?.id || ''}
                  onChange={(e) => {
                    const commitment = commitments.find((c) => c.id === e.target.value);
                    setSelectedCommitment(commitment || null);
                  }}
                >
                  <option value="">Selecione um compromisso</option>
                  {commitments.map((commitment) => (
                    <option key={commitment.id} value={commitment.id}>
                      {commitment.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="progressScore" className="block text-sm font-medium text-gray-700">
                  Evolução (1-10)
                </label>
                <input
                  type="number"
                  id="progressScore"
                  name="progressScore"
                  min="1"
                  max="10"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={progressScore}
                  onChange={(e) => setProgressScore(parseInt(e.target.value))}
                />
              </div>

              <div>
                <label htmlFor="progressNotes" className="block text-sm font-medium text-gray-700">
                  Observações
                </label>
                <textarea
                  id="progressNotes"
                  name="progressNotes"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                  placeholder="Como você se sentiu em relação ao seu compromisso?"
                />
              </div>

              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={addProgress}
                disabled={!selectedCommitment}
              >
                Registrar Evolução
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Histórico de Compromissos</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {commitments.map((commitment) => (
                <li key={commitment.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {commitment.description}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Tipo: {commitment.type === 'FINANCIAL' ? 'Financeiro' : 'Comportamental'}
                        </p>
                        {commitment.progressHistory.length > 0 && (
                          <p className="mt-1 text-sm text-gray-500">
                            Última evolução: {commitment.progressHistory[commitment.progressHistory.length - 1].score}/10
                          </p>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                        <button
                          onClick={() => setExpandedCommitment(expandedCommitment === commitment.id ? null : commitment.id)}
                          className="inline-flex items-center p-1 border border-transparent rounded-full text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          title={expandedCommitment === commitment.id ? "Recolher" : "Expandir"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteCommitment(commitment.id)}
                          className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          title="Excluir compromisso"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {expandedCommitment === commitment.id && commitment.progressHistory.length > 0 && (
                      <div className="mt-4">
                        <div className="h-64">
                          <Line data={getChartData(commitment)} options={getChartOptions()} />
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-900">Histórico de Evolução</h4>
                          <ul className="mt-2 space-y-2">
                            {commitment.progressHistory.map((progress, index) => (
                              <li key={index} className="text-sm text-gray-500">
                                {format(progress.date, "dd/MM/yyyy")} - Nota: {progress.score}/10
                                {progress.notes && (
                                  <span className="ml-2 text-gray-400">({progress.notes})</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 