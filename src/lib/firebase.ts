// Mock temporário para desenvolvimento
export const timestamp = () => new Date().toISOString();

// Tipos de dados
export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SonhoData {
  id?: string;
  userId: string;
  titulo: string;
  descricao: string;
  valor: number;
  dataAlvo: string;
  status: 'pendente' | 'em_andamento' | 'concluido';
  createdAt: string;
  updatedAt: string;
}

export interface PatrimonioData {
  id?: string;
  userId: string;
  tipo: 'ativo' | 'passivo';
  nome: string;
  valor: number;
  descricao?: string;
  createdAt: string;
  updatedAt: string;
} 