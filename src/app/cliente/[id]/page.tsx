'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaUser, FaChartLine, FaBrain, FaClipboardList, FaStar, FaPortrait, FaArrowLeft, FaBusinessTime } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface Props {
  params: {
    id: string;
  };
}

interface Cliente {
  nome: string;
  email: string;
}

export default function ClientePage({ params }: Props) {
  const [cliente, setCliente] = useState<Cliente>({ nome: '', email: '' });
  const [activeModule, setActiveModule] = useState('retrato');
  const [showRetratoSubmenu, setShowRetratoSubmenu] = useState(false);

  // Buscar cliente pelo id no localStorage
  useEffect(() => {
    const data = localStorage.getItem('clientes');
    if (data) {
      const lista = JSON.parse(data);
      const encontrado = lista.find((c: any) => c.id === params.id);
      if (encontrado) {
        setCliente(encontrado);
      }
    }
  }, [params.id]);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="relative">
        {/* Cabeçalho */}
        <div className="bg-[#1e293b] shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link 
                href="/"
                className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <FaArrowLeft className="text-sm" />
                <span className="text-sm">Voltar para Lista de Clientes</span>
              </Link>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <h2 className="text-xl font-semibold text-white">{cliente.nome}</h2>
                  <p className="text-sm text-gray-400">{cliente.email}</p>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <FaUser className="text-xl text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navegação Principal */}
        <div className="bg-[#1e293b]/50 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-12">
              {/* Módulo Meu Retrato */}
              <Link
                href={`/cliente/${params.id}/eu-atual`}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeModule === 'retrato'
                    ? 'border-blue-400 text-white'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-white/50'
                }`}
                onClick={() => setActiveModule('retrato')}
              >
                <FaPortrait className="text-blue-400" />
                <span>MEU RETRATO</span>
              </Link>

              {/* Módulo Sonhos */}
              <Link
                href={`/cliente/${params.id}/sonhos`}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeModule === 'sonhos'
                    ? 'border-yellow-400 text-white'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-white/50'
                }`}
                onClick={() => setActiveModule('sonhos')}
              >
                <FaStar className="text-yellow-400" />
                <span>SONHOS</span>
              </Link>

              {/* Módulo Meu Negócio */}
              <Link
                href={`/cliente/${params.id}/meu-negocio`}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeModule === 'negocio'
                    ? 'border-green-400 text-white'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-white/50'
                }`}
                onClick={() => setActiveModule('negocio')}
              >
                <FaBusinessTime className="text-green-400" />
                <span>MEU NEGÓCIO</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Área de Conteúdo */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-[#1e293b] rounded-lg shadow-xl border border-white/5 p-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Bem-vindo ao Painel do Cliente</h3>
              <p className="text-gray-300">Selecione um dos módulos acima para começar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 