import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cheese by Dr McGi',
  description: 'Enter the Dairy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
