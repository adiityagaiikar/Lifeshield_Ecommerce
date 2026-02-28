'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GlassInput from '@/components/ui/GlassInput';
import MagneticButton from '@/components/ui/MagneticButton';
import api from '@/lib/api';

interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    accessToken: string;
    refreshToken: string;
}

export default function AuthView({ mode }: { mode: 'login' | 'signup' }) {
    const router = useRouter();
    const isSignupMode = mode === 'signup';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setIsSubmitting(true);
            setError('');

            const endpoint = isSignupMode ? '/auth/register' : '/auth/login';
            const payload = isSignupMode ? { name, email, password } : { email, password };
            const { data } = await api.post<AuthResponse>(endpoint, payload);

            localStorage.setItem('lifeshield_access_token', data.accessToken);
            localStorage.setItem('lifeshield_refresh_token', data.refreshToken);
            localStorage.setItem(
                'lifeshield_user',
                JSON.stringify({
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                })
            );

            router.push('/dashboard');
        } catch {
            setError(isSignupMode ? 'Unable to sign up. Please verify details.' : 'Invalid email or password. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
            <div className="w-full max-w-md glass-panel rounded-lg p-8 md:p-10">
                <div className="mb-8">
                    <h1 className="text-4xl font-black tracking-tight text-white/90">
                        {isSignupMode ? 'CREATE ACCOUNT' : 'USER LOGIN'}
                    </h1>
                    <p className="text-tactical mt-3">
                        {isSignupMode ? 'REGISTER TO START SHOPPING AND TRACK ORDERS' : 'AUTHENTICATE TO ACCESS PERSONAL DEPLOYMENT DATA'}
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-2">
                        <Link href="/login" className={`text-center py-2 uppercase tracking-[0.2em] text-xs font-mono font-bold border rounded-2xl transition-all duration-300 ${!isSignupMode ? 'bg-indigo-600/20 hover:bg-indigo-500/30 border-indigo-500/50 text-indigo-300' : 'bg-white/[0.03] border-white/10 text-gray-400 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]'}`}>
                            LOGIN
                        </Link>
                        <Link href="/signup" className={`text-center py-2 uppercase tracking-[0.2em] text-xs font-mono font-bold border rounded-2xl transition-all duration-300 ${isSignupMode ? 'bg-indigo-600/20 hover:bg-indigo-500/30 border-indigo-500/50 text-indigo-300' : 'bg-white/[0.03] border-white/10 text-gray-400 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]'}`}>
                            SIGNUP
                        </Link>
                    </div>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {isSignupMode && (
                        <GlassInput
                            type="text"
                            placeholder="FULL NAME"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    )}
                    <GlassInput
                        type="email"
                        placeholder="EMAIL"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                    <GlassInput
                        type="password"
                        placeholder="PASSWORD"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />

                    {error && <p className="text-sm text-red-400 font-mono">{error}</p>}

                    <MagneticButton accent="emerald" className="w-full py-4">
                        {isSubmitting ? (isSignupMode ? 'CREATING ACCOUNT...' : 'AUTHENTICATING...') : (isSignupMode ? 'SIGN UP' : 'LOGIN')}
                    </MagneticButton>
                </form>
            </div>
        </div>
    );
}
