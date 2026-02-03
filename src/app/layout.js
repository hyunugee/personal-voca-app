import { Providers } from '@/components/Providers';
import './globals.css';

export const metadata = {
  title: 'Personal Voca',
  description: 'Your AI-powered vocabulary assistant',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
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

