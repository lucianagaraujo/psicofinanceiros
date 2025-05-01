'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaUserPlus, FaUsers, FaArrowRight, FaSearch, FaChartLine, FaBrain, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MeuNegocioCard } from '@/components/MeuNegocioCard';
import { useParams } from 'next/navigation';

interface Cliente {
  id: string;
  nome: string;
  email: string;
}

export default function Home() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [novoCliente, setNovoCliente] = useState({ nome: '', email: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const params = useParams();

  // Carregar clientes do localStorage ao iniciar
  useEffect(() => {
    const data = localStorage.getItem('clientes');
    if (data) setClientes(JSON.parse(data));
  }, []);

  // Salvar clientes no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('clientes', JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    const data = localStorage.getItem('clientes');
    if (data) {
      const lista = JSON.parse(data);
      const encontrado = lista.find((c: any) => c.id === params.id);
      if (encontrado) {
        setNovoCliente(encontrado);
      }
    }
  }, [params.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substr(2, 9);
    setClientes([...clientes, { ...novoCliente, id }]);
    setNovoCliente({ nome: '', email: '' });
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Sistema de Mentoria PsicoFinanceiros</h1>
          <p className="text-xl text-gray-300">Gerencie seus clientes e acompanhe sua evolução financeira</p>
        </motion.div>

        {/* Cards de recursos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 p-8"
          >
            <FaChartLine className="text-3xl text-blue-400 mb-4 mx-auto animate-float" />
            <h3 className="text-white font-semibold mb-2">Análise Financeira</h3>
            <p className="text-gray-300">Acompanhamento detalhado da situação financeira</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 p-8"
          >
            <FaBrain className="text-3xl text-purple-400 mb-4 mx-auto animate-float animation-delay-2000" />
            <h3 className="text-white font-semibold mb-2">Mentoria Especializada</h3>
            <p className="text-gray-300">Orientação profissional personalizada</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 p-8"
          >
            <FaHeart className="text-3xl text-pink-400 mb-4 mx-auto animate-float animation-delay-4000" />
            <h3 className="text-white font-semibold mb-2">Acompanhamento Personalizado</h3>
            <p className="text-gray-300">Suporte individual para cada cliente</p>
          </motion.div>

          <MeuNegocioCard />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulário de Cadastro */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 p-8"
          >
            <div className="flex items-center mb-8">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <FaUserPlus className="text-2xl text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white ml-4">Cadastrar Novo Cliente</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="nome"
                  value={novoCliente.nome}
                  onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o nome do cliente"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={novoCliente.email}
                  onChange={(e) => setNovoCliente({ ...novoCliente, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o email do cliente"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
              >
                <FaUserPlus className="mr-2" />
                Cadastrar Cliente
              </motion.button>
            </form>
          </motion.div>

          {/* Lista de Clientes */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <FaUsers className="text-2xl text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white ml-4">Meus Clientes</h2>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="overflow-hidden">
              <ul className="divide-y divide-white/10">
                {filteredClientes.length === 0 ? (
                  <motion.li 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="py-8"
                  >
                    <div className="text-center">
                      <FaUsers className="mx-auto h-12 w-12 text-gray-400 animate-float" />
                      <h3 className="mt-2 text-sm font-medium text-white">Nenhum cliente cadastrado</h3>
                      <p className="mt-1 text-sm text-gray-400">Comece cadastrando um novo cliente.</p>
                    </div>
                  </motion.li>
                ) : (
                  filteredClientes.map((cliente, index) => (
                    <motion.li 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      key={cliente.id} 
                      className="group"
                    >
                      <Link href={`/cliente/${cliente.id}`} className="block hover:bg-white/5 transition-colors rounded-xl">
                        <div className="flex items-center justify-between px-4 py-4">
                          <div className="min-w-0 flex-1">
                            <p className="text-lg font-semibold text-white truncate">
                              {cliente.nome}
                            </p>
                            <p className="text-sm text-gray-400 truncate">
                              {cliente.email}
                            </p>
                          </div>
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="ml-4 flex-shrink-0"
                          >
                            <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                              Ver Perfil
                              <FaArrowRight className="ml-2" />
                            </span>
                          </motion.div>
                        </div>
                      </Link>
                    </motion.li>
                  ))
                )}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
