import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata = {
  title: 'Personal Voca',
  description: 'Your AI-powered vocabulary assistant',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // user-scalable=0 maps to false
  themeColor: '#0f1115',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

