'use client';

import { VocabularyProvider } from '@/context/VocabularyContext';

export function Providers({ children }) {
    return (
        <VocabularyProvider>
            {children}
        </VocabularyProvider>
    );
}
