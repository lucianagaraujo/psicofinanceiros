import React from 'react';
import { Dream } from '@/types/dreams';
import { Search, Filter } from 'lucide-react';

interface DreamCardsProps {
  dreams: Dream[];
  colors: Record<string, string>;
  onEditDream: (dream: Dream) => void;
  onViewDream: (dream: Dream) => void;
}

export default function DreamCards({ dreams, colors, onEditDream, onViewDream }: DreamCardsProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');

  const categories = Array.from(new Set(dreams.map(dream => dream.category)));

  const filteredDreams = dreams.filter(dream => {
    const matchesSearch = dream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dream.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || dream.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar sonhos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="">Todas categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDreams.map(dream => (
          <div
            key={dream.id}
            className="bg-gray-800/40 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-200"
          >
            <div
              className="h-1.5 rounded-t-lg"
              style={{ backgroundColor: colors[dream.category] }}
            />
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-white">{dream.title}</h3>
                <span
                  className="px-2.5 py-1 text-xs rounded-full font-medium"
                  style={{
                    backgroundColor: `${colors[dream.category]}20`,
                    color: colors[dream.category]
                  }}
                >
                  {dream.category}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{dream.description}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Progresso</span>
                  <span>{dream.progress}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${dream.progress}%`,
                      backgroundColor: colors[dream.category]
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-between gap-2">
                <button
                  onClick={() => onViewDream(dream)}
                  className="flex-1 px-3 py-2 text-sm text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors"
                >
                  Ver detalhes
                </button>
                <button
                  onClick={() => onEditDream(dream)}
                  className="flex-1 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-md transition-colors"
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 