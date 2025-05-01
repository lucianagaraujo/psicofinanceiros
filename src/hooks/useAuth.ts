import { useState, useEffect } from 'react';

interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>({
    uid: 'user1',
    email: 'usuario@exemplo.com',
    displayName: 'Usuário Teste',
  });
  const [loading, setLoading] = useState(false);

  return {
    user,
    loading,
  };
} 