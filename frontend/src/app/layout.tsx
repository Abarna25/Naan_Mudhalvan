import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Naan Mudhalvan Automated Portfolio Compiler & Eligibility Engine',
  description: 'Automated student portfolio compilation, Explainable AI employability assessment, and career roadmaps aligned with Naan Mudhalvan initiative.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
