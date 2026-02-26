import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';
import './globals.css';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-void-900 text-white min-h-screen relative`}
      >
        {/* Atmospheric Background Orbs */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="bg-orb-emerald w-[500px] h-[500px] top-[-10%] left-[-10%] mix-blend-screen opacity-50" />
          <div className="bg-orb-violet w-[600px] h-[600px] bottom-[-20%] right-[-10%] mix-blend-screen opacity-40" />
        </div>

        {/* Global Glass Navigation */}
        <nav className="fixed top-0 w-full z-50 glass-panel border-b border-t-0 border-white/5 px-6 py-4 flex justify-between items-center transition-all duration-300">
          <Link href="/" className="text-xl font-bold tracking-widest uppercase">LIFESHIELD</Link>
          <div className="flex gap-6 text-tactical items-center">
            <Link href="/products" className="hover:text-white cursor-pointer transition-colors">Catalog</Link>
            <Link href="/dashboard" className="hover:text-white cursor-pointer transition-colors">Intel</Link>
            <Link href="/login" className="hover:text-white cursor-pointer transition-colors">Login</Link>
            <Link href="/products" className="glass-panel px-4 py-2 rounded-sm cursor-pointer hover:shadow-glow-emerald transition-all">
              Deploy
            </Link>
          </div>
        </nav>

        {/* Page Content */}
        <main className="relative z-10 pt-24 px-6 md:px-12 lg:px-24">
          {children}
        </main>
      </body>
    </html>
  );
}
