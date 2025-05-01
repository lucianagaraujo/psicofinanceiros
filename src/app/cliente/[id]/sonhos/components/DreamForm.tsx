import React, { useState } from 'react';
import { Dream, Milestone } from '@/types/dreams';
import { Plus, X } from 'lucide-react';

interface DreamFormProps {
  dream: Dream | null;
  onSubmit: (dream: Dream) => void;
  onClose: () => void;
  categoryColors: Record<string, string>;
}

const DreamForm: React.FC<DreamFormProps> = ({ dream: initialData, onSubmit, onClose, categoryColors }) => {
  const [formData, setFormData] = useState<Dream>({
    id: initialData?.id || '',
    title: initialData?.title || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    milestones: initialData?.milestones || [],
    progress: initialData?.progress || 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          id: Date.now().toString(),
          description: '',
          date: '',
          completed: false
        }
      ]
    }));
  };

  const handleMilestoneChange = (index: number, field: 'description' | 'date', value: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => {
        if (i === index) {
          return {
            ...milestone,
            [field]: value
          };
        }
        return milestone;
      })
    }));
  };

  const handleRemoveMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e293b] rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">
              {initialData ? 'Editar Sonho' : 'Novo Sonho'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-400 hover:text-white transition-colors" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-[#2d3a4f] border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Digite o título do seu sonho"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoria
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-[#2d3a4f] border border-white/10 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {Object.keys(categoryColors).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 bg-[#2d3a4f] border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Descreva seu sonho em detalhes"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data de Início
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-[#2d3a4f] border border-white/10 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data Final
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-[#2d3a4f] border border-white/10 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-300">
                  Marcos
                </label>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                >
                  <Plus size={16} className="mr-1" />
                  Adicionar Marco
                </button>
              </div>
              <div className="space-y-4">
                {formData.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-[#2d3a4f] rounded-lg border border-white/5">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={milestone.description}
                        onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                        className="w-full p-2 bg-[#1e293b] border border-white/10 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 mb-2"
                        placeholder="Descrição do marco"
                        required
                      />
                      <input
                        type="date"
                        value={milestone.date}
                        onChange={(e) => handleMilestoneChange(index, 'date', e.target.value)}
                        className="w-full p-2 bg-[#1e293b] border border-white/10 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(index)}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X size={20} className="text-red-400 hover:text-red-300 transition-colors" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {initialData ? 'Salvar Alterações' : 'Criar Sonho'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DreamForm; 