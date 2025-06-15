import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your App Name',
  description: 'Your app description',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            {/* Navigation content */}
          </nav>
        </header>
        <main>
          {children}
        </main>
        <footer>
          {/* Footer content */}
        </footer>
      </body>
    </html>
  );
}