import React from 'react';
import { Dream } from '@/types/dreams';
import { Calendar, Clock, Edit, Trash } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  pessoal: 'bg-blue-500/10 text-blue-400',
  profissional: 'bg-purple-500/10 text-purple-400',
  familia: 'bg-green-500/10 text-green-400',
};

interface DreamCardProps {
  dream: Dream;
  onView: (dream: Dream) => void;
  onEdit: (dream: Dream) => void;
  onDelete: (id: string) => void;
}

const DreamCard: React.FC<DreamCardProps> = ({ dream, onView, onEdit, onDelete }) => {
  return (
    <div
      className="bg-[#1e293b]/80 backdrop-blur-sm rounded-xl border border-white/5 p-6 hover:shadow-xl hover:border-white/10 hover:scale-[1.02] transition-all duration-300 ease-in-out animate-fadeIn flex flex-col justify-between min-h-[320px]"
      style={{ animation: 'fadeIn 0.7s' }}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-white">{dream.title}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(dream)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Editar sonho"
            >
              <Edit size={18} className="text-gray-400 hover:text-white transition-colors" />
            </button>
            <button
              onClick={() => onDelete(dream.id)}
              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
              aria-label="Excluir sonho"
            >
              <Trash size={18} className="text-red-400 hover:text-red-300 transition-colors" />
            </button>
          </div>
        </div>
        <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium mb-4 ${CATEGORY_COLORS[dream.category] || 'bg-gray-500/10 text-gray-400'}`}>
          {dream.category.charAt(0).toUpperCase() + dream.category.slice(1)}
        </span>
        <p className="text-gray-400 text-sm mb-6 line-clamp-2">{dream.description}</p>
        <div className="flex items-center text-sm text-gray-400 mb-3">
          <Calendar size={16} className="mr-2 text-gray-500" />
          <span>{dream.startDate} - {dream.endDate}</span>
        </div>
        <div className="flex items-center text-sm text-gray-400 mb-6">
          <Clock size={16} className="mr-2 text-gray-500" />
          <span>{dream.milestones.length} marcos</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden mb-3">
          <div
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-2.5 rounded-full transition-all duration-700"
            style={{ width: `${dream.progress}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-400">
          Progresso: <span className="font-semibold text-blue-400">{dream.progress}%</span>
        </div>
      </div>
      <button
        onClick={() => onView(dream)}
        className="mt-6 w-full bg-white/5 text-white py-2.5 px-4 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        Ver detalhes
      </button>
    </div>
  );
};

export default DreamCard; 