'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import GlassInput from '@/components/ui/GlassInput';
import MagneticButton from '@/components/ui/MagneticButton';
import api from '@/lib/api';

interface LoginResponse {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    accessToken: string;
    refreshToken: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setIsSubmitting(true);
            setError('');

            const { data } = await api.post<LoginResponse>('/auth/login', {
                email,
                password,
            });

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
            setError('Invalid email or password. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
            <div className="w-full max-w-md glass-panel rounded-lg p-8 md:p-10">
                <div className="mb-8">
                    <h1 className="text-4xl font-black tracking-tight">USER LOGIN</h1>
                    <p className="text-tactical mt-3">AUTHENTICATE TO ACCESS PERSONAL DEPLOYMENT DATA</p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
                        {isSubmitting ? 'AUTHENTICATING...' : 'LOGIN'}
                    </MagneticButton>
                </form>
            </div>
        </div>
    );
}
