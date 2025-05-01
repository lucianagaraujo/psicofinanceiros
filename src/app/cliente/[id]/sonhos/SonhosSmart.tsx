'use client';

import React, { useState, useEffect } from 'react';
import { Dream, Milestone } from '@/types/dreams';
import { calculateProgress } from '@/utils/dreamUtils';
import { formatDate } from '@/utils/dateUtils';
import DreamCard from './components/DreamCard';
import DreamDetailModal from './components/DreamDetailModal';
import Timeline from './components/Timeline';
import Dashboard from './components/Dashboard';
import DreamForm from './components/DreamForm';
import { UserCircle, Clock, FileText, PlusCircle, Filter, AlertCircle, Check } from 'lucide-react';

// Cores da marca
const COLORS = { 
  RED: '#B54369', 
  PURPLE: '#4D44AB', 
  BLUE: '#1B67B2', 
  BLACK: '#202020', 
  GREEN: '#568C1C', 
  ORANGE: '#C77F1A',
  pessoal: '#4D44AB',
  profissional: '#1B67B2',
  familia: '#568C1C',
};

// Dados de exemplo para demonstração
const initialDreams: Dream[] = [
  {
    id: '1',
    title: 'Comprar casa própria',
    category: 'pessoal',
    description: 'Adquirir um imóvel próprio com 3 quartos e área de lazer',
    startDate: '2025-05-01',
    endDate: '2027-12-31',
    milestones: [
      { id: '1-1', date: '2025-08-01', description: 'Economizar entrada de 20%', completed: true },
      { id: '1-2', date: '2026-02-01', description: 'Pesquisar imóveis e definir bairro', completed: false },
      { id: '1-3', date: '2026-08-01', description: 'Iniciar processo de financiamento', completed: false },
      { id: '1-4', date: '2027-12-31', description: 'Finalizar compra e mudança', completed: false }
    ],
    progress: 25
  },
  {
    id: '2',
    title: 'Promoção para gerência',
    category: 'profissional',
    description: 'Conseguir promoção para cargo de gerência na empresa',
    startDate: '2025-01-01',
    endDate: '2026-06-30',
    milestones: [
      { id: '2-1', date: '2025-03-01', description: 'Completar curso de liderança', completed: true },
      { id: '2-2', date: '2025-06-01', description: 'Liderar projeto importante', completed: true },
      { id: '2-3', date: '2025-12-01', description: 'Obter certificação profissional', completed: false },
      { id: '2-4', date: '2026-06-30', description: 'Entrevista para promoção', completed: false }
    ],
    progress: 50
  },
  {
    id: '3',
    title: 'Viagem em família',
    category: 'familia',
    description: 'Realizar viagem internacional em família',
    startDate: '2025-01-15',
    endDate: '2025-12-31',
    milestones: [
      { id: '3-1', date: '2025-03-15', description: 'Decidir destino e período', completed: true },
      { id: '3-2', date: '2025-06-15', description: 'Comprar passagens e reservar hospedagem', completed: false },
      { id: '3-3', date: '2025-09-15', description: 'Preparar documentação e planejamento', completed: false },
      { id: '3-4', date: '2025-12-31', description: 'Realizar a viagem', completed: false }
    ],
    progress: 25
  }
];

const SonhosSmart: React.FC = () => {
  // Estados
  const [dreams, setDreams] = useState<Dream[]>(initialDreams);
  const [filteredDreams, setFilteredDreams] = useState<Dream[]>(initialDreams);
  const [currentView, setCurrentView] = useState<string>('meus_sonhos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [editingDream, setEditingDream] = useState<Dream | null>(null);
  const [viewingDream, setViewingDream] = useState<Dream | null>(null);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [showTimeline, setShowTimeline] = useState(false);

  // Efeito para filtragem
  useEffect(() => {
    let filtered = dreams;
    if (searchTerm) {
      filtered = filtered.filter(dream => 
        dream.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        dream.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== 'todos') {
      filtered = filtered.filter(dream => dream.category === categoryFilter);
    }
    setFilteredDreams(filtered);
  }, [dreams, searchTerm, categoryFilter]);

  // Funções para manipulação de dados
  const handleMeusSonhosView = () => setCurrentView('meus_sonhos');
  const handleViewDream = (dream: Dream) => setViewingDream(dream);
  const handleCloseViewDream = () => setViewingDream(null);
  const handleAddDream = () => { setEditingDream(null); setCurrentView('form'); };
  const handleEditDream = (dream: Dream) => { setEditingDream(dream); setCurrentView('form'); };
  const handleDeleteDream = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este sonho?')) {
      setDreams(dreams.filter(dream => dream.id !== id));
      displayNotification('Sonho excluído com sucesso!');
    }
  };
  const handleToggleMilestoneStatus = (dreamId: string, milestoneId: string) => {
    setDreams(dreams.map(dream => {
      if (dream.id === dreamId) {
        const updatedMilestones = dream.milestones.map((milestone: Milestone) => 
          milestone.id === milestoneId 
            ? {...milestone, completed: !milestone.completed} 
            : milestone
        );
        const updatedDream = {
          ...dream,
          milestones: updatedMilestones,
          progress: calculateProgress(updatedMilestones)
        };
        if (viewingDream && viewingDream.id === dreamId) {
          setViewingDream(updatedDream);
        }
        return updatedDream;
      }
      return dream;
    }));
    displayNotification('Marco atualizado com sucesso!');
  };
  const handleSubmitDream = (dreamData: Dream) => {
    if (editingDream) {
      setDreams(dreams.map(dream => 
        dream.id === dreamData.id ? {...dreamData, progress: calculateProgress(dreamData.milestones)} : dream
      ));
      displayNotification('Sonho atualizado com sucesso!');
    } else {
      const newDream = {
        ...dreamData,
        id: Date.now().toString(),
        progress: calculateProgress(dreamData.milestones)
      };
      setDreams([...dreams, newDream]);
      displayNotification('Novo sonho adicionado com sucesso!');
    }
    setCurrentView('meus_sonhos');
  };
  const displayNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };
  const saveAsPDF = () => {
    displayNotification('Funcionalidade de salvar como PDF será implementada em breve!');
  };

  return (
    <div className="flex justify-center min-h-screen antialiased relative bg-gray-50 text-gray-900">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8 mt-8">
          <h1 className="text-2xl font-bold text-gray-800">Meus Sonhos</h1>
          <button
            onClick={() => setShowTimeline((prev) => !prev)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {showTimeline ? 'Ver Dashboard' : 'Ver Linha do Tempo'}
          </button>
        </div>
        {showTimeline ? (
          <Timeline
            dreams={filteredDreams}
            onToggleMilestone={handleToggleMilestoneStatus}
            colors={COLORS}
          />
        ) : (
          <Dashboard
            dreams={filteredDreams}
            colors={COLORS}
            onTimelineClick={() => setShowTimeline(true)}
          />
        )}
      </div>
    </div>
  );
};

export default SonhosSmart; 