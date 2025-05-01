'use client';

import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Timeline from './components/Timeline';
import DreamForm from './components/DreamForm';
import DreamDetailModal from './components/DreamDetailModal';
import DreamCards from './components/DreamCards';
import TabNavigation from './components/TabNavigation';
import { Dream } from '@/types/dreams';
import { Plus } from 'lucide-react';
import Link from 'next/link';

// Dados de exemplo - substitua por dados reais da sua API
const mockDreams: Dream[] = [
  {
    id: '1',
    title: 'Comprar Casa Própria',
    category: 'Imóveis',
    description: 'Adquirir um apartamento de 2 quartos',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    progress: 25,
    milestones: [
      {
        id: 'm1',
        description: 'Juntar entrada',
        date: '2024-06-30',
        completed: false
      },
      {
        id: 'm2',
        description: 'Pesquisar imóveis',
        date: '2024-03-15',
        completed: true
      }
    ]
  },
  {
    id: '2',
    title: 'Viagem Internacional',
    category: 'Viagens',
    description: 'Conhecer Portugal',
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    progress: 50,
    milestones: [
      {
        id: 'm3',
        description: 'Comprar passagens',
        date: '2024-05-01',
        completed: true
      },
      {
        id: 'm4',
        description: 'Reservar hotel',
        date: '2024-06-01',
        completed: false
      }
    ]
  }
];

const categoryColors: Record<string, string> = {
  'Imóveis': '#4F46E5',
  'Viagens': '#10B981',
  'Educação': '#F59E0B',
  'Investimentos': '#3B82F6',
  'Carreira': '#8B5CF6',
  'Saúde': '#EC4899'
};

interface Props {
  params: {
    id: string;
  };
}

export default function Sonhos({ params }: Props) {
  const [activeTab, setActiveTab] = useState<'cards' | 'timeline' | 'dashboard'>('cards');
  const [dreams, setDreams] = useState<Dream[]>(mockDreams);
  const [showDreamForm, setShowDreamForm] = useState(false);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleToggleMilestone = (dreamId: string, milestoneId: string) => {
    setDreams(prevDreams => 
      prevDreams.map(dream => {
        if (dream.id === dreamId) {
          return {
            ...dream,
            milestones: dream.milestones.map(milestone => {
              if (milestone.id === milestoneId) {
                return { ...milestone, completed: !milestone.completed };
              }
              return milestone;
            })
          };
        }
        return dream;
      })
    );
  };

  const handleDreamSubmit = (dream: Dream) => {
    if (dream.id) {
      // Editar sonho existente
      setDreams(prevDreams =>
        prevDreams.map(d => d.id === dream.id ? dream : d)
      );
    } else {
      // Adicionar novo sonho
      const newDream = {
        ...dream,
        id: Date.now().toString(),
        progress: 0
      };
      setDreams(prevDreams => [...prevDreams, newDream]);
    }
    setShowDreamForm(false);
  };

  const handleEditDream = (dream: Dream) => {
    setSelectedDream(dream);
    setShowDreamForm(true);
  };

  const handleViewDreamDetails = (dream: Dream) => {
    setSelectedDream(dream);
    setShowDetailModal(true);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'cards':
        return (
          <DreamCards
            dreams={dreams}
            colors={categoryColors}
            onEditDream={handleEditDream}
            onViewDream={handleViewDreamDetails}
          />
        );
      case 'timeline':
        return (
          <Timeline
            dreams={dreams}
            onToggleMilestone={handleToggleMilestone}
            colors={categoryColors}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            dreams={dreams}
            colors={categoryColors}
            onTimelineClick={() => setActiveTab('timeline')}
            onEditDream={handleEditDream}
            onViewDream={handleViewDreamDetails}
          />
        );
      default:
        return null;
    }
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Meus Sonhos</h1>
              <p className="text-gray-400">Gerencie e acompanhe seus objetivos de vida</p>
            </div>
            <button
              onClick={() => setShowDreamForm(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Sonho
            </button>
          </div>

          <div className="mb-8">
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={[
                { id: 'cards', label: 'Cartões' },
                { id: 'timeline', label: 'Linha do Tempo' },
                { id: 'dashboard', label: 'Dashboard' }
              ]}
            />
          </div>

          <div className="mt-8">
            {renderActiveTab()}
          </div>
        </div>

        {showDreamForm && (
          <DreamForm
            dream={selectedDream}
            onSubmit={handleDreamSubmit}
            onClose={() => {
              setShowDreamForm(false);
              setSelectedDream(null);
            }}
            categoryColors={categoryColors}
          />
        )}

        {showDetailModal && selectedDream && (
          <DreamDetailModal
            dream={selectedDream}
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedDream(null);
            }}
            onEdit={() => {
              setShowDetailModal(false);
              setShowDreamForm(true);
            }}
            onToggleMilestone={handleToggleMilestone}
            colors={categoryColors}
          />
        )}
      </div>
    </div>
  );
} 