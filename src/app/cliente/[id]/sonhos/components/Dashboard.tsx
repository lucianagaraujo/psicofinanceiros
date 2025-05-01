import React from 'react';
import { Dream } from '@/types/dreams';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, Check, Clock, UserCircle, Eye, Edit } from 'lucide-react';

interface DashboardProps {
  dreams: Dream[];
  colors: Record<string, string>;
  onTimelineClick: () => void;
  onEditDream: (dream: Dream) => void;
  onViewDream: (dream: Dream) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ dreams, colors, onTimelineClick, onEditDream, onViewDream }) => {
  // Preparar dados para o gráfico de categorias
  const categoryData = dreams.reduce((acc, dream) => {
    acc[dream.category] = (acc[dream.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryData).map(([category, count]) => ({
    category,
    count
  }));

  // Calcular estatísticas
  const totalDreams = dreams.length;
  const completedDreams = dreams.filter(dream => dream.progress === 100).length;
  const inProgressDreams = dreams.filter(dream => dream.progress > 0 && dream.progress < 100).length;
  const notStartedDreams = dreams.filter(dream => dream.progress === 0).length;

  return (
    <div className="animate-fadeIn space-y-8">
      <h2 className="text-2xl font-bold text-white mb-8">Dashboard</h2>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1e293b]/80 backdrop-blur-sm rounded-xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total de Sonhos</h3>
            <Award className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">{totalDreams}</p>
        </div>

        <div className="bg-[#1e293b]/80 backdrop-blur-sm rounded-xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Concluídos</h3>
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">{completedDreams}</p>
        </div>

        <div className="bg-[#1e293b]/80 backdrop-blur-sm rounded-xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Em Progresso</h3>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white">{inProgressDreams}</p>
        </div>

        <div className="bg-[#1e293b]/80 backdrop-blur-sm rounded-xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Não Iniciados</h3>
            <UserCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-white">{notStartedDreams}</p>
        </div>
      </div>

      {/* Gráfico de categorias */}
      <div className="bg-[#1e293b]/80 backdrop-blur-sm rounded-xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300">
        <h3 className="text-lg font-semibold text-white mb-6">Sonhos por Categoria</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="category"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
                itemStyle={{ color: '#e2e8f0' }}
                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
              />
              <Bar
                dataKey="count"
                radius={[8, 8, 0, 0]}
                fill="url(#colorGradient)"
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lista de sonhos recentes */}
      <div className="bg-[#1e293b]/80 backdrop-blur-sm rounded-xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Sonhos Recentes</h3>
          <button
            onClick={onTimelineClick}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            Ver linha do tempo
          </button>
        </div>
        <div className="space-y-4">
          {dreams.slice(0, 5).map(dream => (
            <div
              key={dream.id}
              className="flex items-center justify-between p-4 bg-[#2d3a4f] rounded-lg border border-white/5 hover:border-white/10 transition-all duration-300"
            >
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1">{dream.title}</h4>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      colors[dream.category]
                        ? `bg-${colors[dream.category].replace('#', '')}/10 text-${colors[dream.category].replace('#', '')}`
                        : 'bg-gray-500/10 text-gray-400'
                    }`}
                  >
                    {dream.category}
                  </span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-400">{dream.startDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${dream.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-blue-400">{dream.progress}%</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewDream(dream)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => onEditDream(dream)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 