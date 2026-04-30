import { User } from '@/types';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (username: string, pin: string) => Promise<boolean>;
  logout: () => void;
}
