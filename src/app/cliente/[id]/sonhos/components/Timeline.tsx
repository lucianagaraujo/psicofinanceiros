import React from 'react';
import { Dream } from '@/types/dreams';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, Clock } from 'lucide-react';

interface TimelineProps {
  dreams: Dream[];
  onToggleMilestone: (dreamId: string, milestoneId: string) => void;
  colors: Record<string, string>;
}

const Timeline: React.FC<TimelineProps> = ({ dreams, onToggleMilestone, colors }) => {
  const sortedDreams = [...dreams].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div className="p-4 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-8">Linha do Tempo dos Sonhos</h2>
      
      <div className="relative">
        {/* Linha vertical central */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>

        {sortedDreams.map((dream, index) => (
          <div key={dream.id} className={`mb-12 flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
            {/* Conteúdo do sonho */}
            <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
              <div className="bg-[#1e293b]/80 backdrop-blur-sm rounded-xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white">{dream.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      colors[dream.category]
                        ? `bg-${colors[dream.category].replace('#', '')}/10 text-${colors[dream.category].replace('#', '')}`
                        : 'bg-gray-500/10 text-gray-400'
                    }`}
                  >
                    {dream.category}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-6">{dream.description}</p>
                <div className="space-y-4">
                  {dream.milestones.map(milestone => (
                    <div
                      key={milestone.id}
                      className="flex items-center justify-between p-3 bg-[#2d3a4f] rounded-lg border border-white/5"
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
                          <p className="text-xs text-gray-400">{format(new Date(milestone.date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Círculo central */}
            <div className="w-2/12 flex justify-center relative">
              <div
                className={`w-4 h-4 rounded-full border-4 ${
                  dream.progress === 100
                    ? 'bg-green-500 border-green-500'
                    : dream.progress > 0
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-gray-500 border-gray-500'
                } absolute top-6 transform -translate-x-1/2`}
              />
            </div>

            {/* Data */}
            <div className={`w-5/12 flex ${index % 2 === 0 ? 'pl-8' : 'pr-8'} items-center`}>
              <div className="bg-[#1e293b]/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/5">
                <p className="text-sm font-medium text-gray-300">{format(new Date(dream.startDate), 'dd/MM/yyyy', { locale: ptBR })}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline; 