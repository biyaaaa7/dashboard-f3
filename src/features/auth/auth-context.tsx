'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { AuthContextType } from './types';
import { getUsers } from '@/lib/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage on mount
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, pin: string) => {
    // Simulate API call
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const users = getUsers();
        const foundUser = users.find(u => u.username === username);
        
        // Validate against stored PIN, fallback to 1234 if no pin defined
        const validPin = foundUser?.pin || '1234';
        
        if (foundUser && pin === validPin) {
          setUser(foundUser);
          setIsAuthenticated(true);
          localStorage.setItem('auth_user', JSON.stringify(foundUser));
          
          // Redirect based on role
          if (foundUser.role === 'operator') {
            router.push('/operator');
          } else if (foundUser.role === 'manager') {
            router.push('/manager');
          } else if (foundUser.role === 'admin') {
            router.push('/admin');
          }
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500); // 500ms delay to simulate network
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_user');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
