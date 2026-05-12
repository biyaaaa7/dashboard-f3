'use client';

import { useState } from 'react';
import Image from 'next/image';
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
        setError('Username atau PIN salah');
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in duration-500 px-4">
      <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(80,140,180,0.15)] rounded-3xl overflow-hidden">
        <div className="p-8">
          <div className="space-y-6 text-center mb-8">
            <div className="flex justify-center">
              <div className="bg-white p-3.5 rounded-2xl shadow-sm inline-flex items-center justify-center border border-white/40">
                <div className="relative w-44 h-14">
                  <Image
                    src="/logo_login.png"
                    alt="DNP Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-[#123047] uppercase">
                DNP PRODUCTION
              </h1>
              <p className="text-[#4f6b81] font-medium text-sm">
                Monitoring System
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-rose-500/10 border-rose-500/20 text-rose-500 py-3 px-4 rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs font-medium ml-2">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7b93a8] transition-colors group-focus-within:text-[#5cc8ff]" />
                <Input
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-12 h-12 bg-white/50 border-white/40 text-[#0f172a] placeholder:text-[#7b93a8] focus-visible:ring-1 focus-visible:ring-[#5cc8ff] focus-visible:border-[#5cc8ff] transition-all rounded-[16px] shadow-sm"
                  autoComplete="username"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#7b93a8] transition-colors group-focus-within:text-[#5cc8ff]" />
                <Input
                  id="pin"
                  type="password"
                  placeholder="Password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="pl-12 h-12 bg-white/50 border-white/40 text-[#0f172a] placeholder:text-[#7b93a8] focus-visible:ring-1 focus-visible:ring-[#5cc8ff] focus-visible:border-[#5cc8ff] transition-all rounded-[16px] shadow-sm"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-sm font-semibold bg-gradient-to-br from-[#5cc8ff] to-[#4da8ff] hover:opacity-90 text-white shadow-[0_4px_14px_rgba(92,200,255,0.4)] transition-all active:scale-[0.98] rounded-[16px] border-none"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
