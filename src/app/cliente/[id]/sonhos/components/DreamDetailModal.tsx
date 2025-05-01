import React from 'react';
import { Dream } from '@/types/dreams';
import { X, Calendar, Check, AlertCircle } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import { Dialog } from '@/components/ui/dialog';

interface DreamDetailModalProps {
  dream: Dream;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (dream: Dream) => void;
  onToggleMilestone: (dreamId: string, milestoneId: string) => void;
  colors: Record<string, string>;
}

const DreamDetailModal: React.FC<DreamDetailModalProps> = ({
  dream,
  isOpen,
  onClose,
  onEdit,
  onToggleMilestone,
  colors
}) => {
  const handleToggleMilestone = (milestoneId: string) => {
    onToggleMilestone(dream.id, milestoneId);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e293b] rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{dream.title}</h2>
              <span
                className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                  colors[dream.category]
                    ? `bg-${colors[dream.category].replace('#', '')}/10 text-${colors[dream.category].replace('#', '')}`
                    : 'bg-gray-500/10 text-gray-400'
                }`}
              >
                {dream.category}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-400 hover:text-white transition-colors" />
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-gray-400 text-base">{dream.description}</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-white">Período</h3>
                <div className="text-sm text-gray-400">
                  {formatDate(dream.startDate)} - {formatDate(dream.endDate)}
                </div>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${dream.progress}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-400">
                Progresso: <span className="font-semibold text-blue-400">{dream.progress}%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Marcos</h3>
                <div className="text-sm text-gray-400">
                  {dream.milestones.filter(m => m.completed).length} de {dream.milestones.length} completos
                </div>
              </div>
              <div className="space-y-4">
                {dream.milestones.map(milestone => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between p-4 bg-[#2d3a4f] rounded-lg border border-white/5"
                  >
                    <div className="flex items-center">
                      <button
                        onClick={() => onToggleMilestone(dream.id, milestone.id)}
                        className={`w-5 h-5 rounded border ${
                          milestone.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-500 hover:border-gray-400'
                        } mr-3 flex items-center justify-center transition-colors`}
                      >
                        {milestone.completed && (
                          <Check size={12} className="text-white" />
                        )}
                      </button>
                      <div>
                        <p className="text-sm font-medium text-gray-200">{milestone.description}</p>
                        <p className="text-xs text-gray-400">{formatDate(milestone.date)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/5 transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={() => onEdit(dream)}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Editar Sonho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamDetailModal; 