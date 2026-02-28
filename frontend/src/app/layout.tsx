import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Providers from './providers';
import SiteShell from '@/components/layout/SiteShell';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});

const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

export const metadata: Metadata = {
    title: 'LIFESHIELD – Preparedness Made Simple',
    description: 'Enterprise-grade emergency preparedness e-commerce platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative`}>
                <Providers>
                    <SiteShell>{children}</SiteShell>
                </Providers>
            </body>
        </html>
    );
}
