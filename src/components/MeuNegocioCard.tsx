'use client';

import Link from 'next/link';
import { FaChartLine, FaBusinessTime } from 'react-icons/fa';
import { motion } from 'framer-motion';

export function MeuNegocioCard() {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 p-8"
    >
      <div className="flex items-center mb-8">
        <div className="bg-green-500/20 p-3 rounded-lg">
          <FaBusinessTime className="text-2xl text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white ml-4">Meu Negócio</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div className="flex items-center">
            <FaChartLine className="text-green-400 mr-2" />
            <span className="text-white">Análise Financeira</span>
          </div>
          <Link 
            href="/meu-negocio"
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            Acessar <FaChartLine className="inline ml-1" />
          </Link>
        </div>
        
        <p className="text-gray-300 text-sm">
          Acompanhe o desempenho do seu negócio, visualize indicadores financeiros e tome decisões estratégicas.
        </p>
      </div>
    </motion.div>
  );
} 