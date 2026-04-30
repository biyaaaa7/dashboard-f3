'use client';

import { useState } from 'react';
import { useAuth } from '../auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, Lock, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !pin) {
      setError('Username dan PIN harus diisi');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(username, pin);
      if (!success) {
        setError('Username atau PIN salah. (Default: admin/1234, operator1/1234, manager1/1234)');
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-md shadow-2xl text-slate-50">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Lock className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Digital Logbook</CardTitle>
        <CardDescription className="text-slate-400">
          Masuk ke sistem pencatatan produksi
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-rose-500/10 border-rose-500/20 text-rose-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-slate-300">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <Input 
                id="username" 
                placeholder="operator1 atau manager1" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 h-12 bg-slate-900/50 border-white/10 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                autoComplete="username"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="pin" className="text-slate-300">PIN</Label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <Input 
                id="pin" 
                type="password"
                placeholder="1234"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="pl-10 h-12 bg-slate-900/50 border-white/10 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                autoComplete="current-password"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full h-12 text-md font-medium bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 border-0 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Masuk ke Sistem"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
