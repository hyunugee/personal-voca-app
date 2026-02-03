'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const VocabularyContext = createContext();

export const VocabularyProvider = ({ children }) => {
    const [words, setWords] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('personal-voca-data');
        if (saved) {
            setWords(JSON.parse(saved));
        }
        setIsLoaded(true);
    }, []);

    // Save to LocalStorage whenever words change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('personal-voca-data', JSON.stringify(words));
        }
    }, [words, isLoaded]);

    const addWords = (newWords) => {
        const formattedWords = newWords.map(w => ({
            id: uuidv4(),
            ...w,
            status: 'learning', // 'learning', 'memorized'
            streak: 0, // Consecutive correct answers (Goal: 3)
            addedAt: new Date().toISOString()
        }));
        setWords(prev => [...formattedWords, ...prev]);
    };

    const updateWordProgress = (id, isCorrect) => {
        setWords(prev => prev.map(word => {
            if (word.id !== id) return word;

            if (isCorrect) {
                const newStreak = word.streak + 1;
                return {
                    ...word,
                    streak: newStreak,
                    status: newStreak >= 3 ? 'memorized' : 'learning'
                };
            } else {
                return {
                    ...word,
                    streak: 0 // Reset on failure
                };
            }
        }));
    };

    const getLearningWords = () => words.filter(w => w.status === 'learning');
    const getMemorizedWords = () => words.filter(w => w.status === 'memorized');

    return (
        <VocabularyContext.Provider value={{
            words,
            addWords,
            updateWordProgress,
            getLearningWords,
            getMemorizedWords
        }}>
            {children}
        </VocabularyContext.Provider>
    );
};

export const useVocabulary = () => useContext(VocabularyContext);
