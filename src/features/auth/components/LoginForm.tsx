'use client';

import { useState } from 'react';
import { useAuth } from '../auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle, Lock, User, MonitorCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';

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
    <Card className="w-full max-w-md bg-slate-900/90 border-white/20 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] text-slate-50 overflow-hidden border-t-blue-500/50 border-t-2">
      <CardHeader className="space-y-4 text-center pt-8 pb-6">
        <div className="flex justify-center mb-2">
          <div className="relative w-32 h-32">
            <Image 
              src="/logo_dnp.png" 
              alt="DNP Logo" 
              fill 
              className="object-contain"
              priority
            />
          </div>
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-white">DNP Monitoring Produksi</CardTitle>
          <CardDescription className="text-slate-400 font-medium">
            Sistem Pemantauan Hasil Produksi
          </CardDescription>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5 px-8">
          {error && (
            <Alert variant="destructive" className="bg-rose-500/10 border-rose-500/20 text-rose-400 py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-slate-300 text-sm font-semibold">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <Input 
                id="username" 
                placeholder="Username anda" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 h-11 bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                autoComplete="username"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="pin" className="text-slate-300 text-sm font-semibold">PIN</Label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <Input 
                id="pin" 
                type="password"
                placeholder="****"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="pl-10 h-11 bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                autoComplete="current-password"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-8 pb-10 pt-4">
          <Button 
            type="submit" 
            className="w-full h-11 text-md font-bold bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "MASUK KE SISTEM"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
