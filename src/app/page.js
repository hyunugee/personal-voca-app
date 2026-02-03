'use client';

import Link from 'next/link';
import { useVocabulary } from '@/context/VocabularyContext';

export default function Home() {
  const { getLearningWords, getMemorizedWords } = useVocabulary();

  const learningCount = getLearningWords ? getLearningWords().length : 0;
  const memorizedCount = getMemorizedWords ? getMemorizedWords().length : 0;
  const totalCount = learningCount + memorizedCount;

  return (
    <main className="container">
      <header style={{ marginTop: '40px', marginBottom: '40px' }}>
        <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
          Personal Voca
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Master your own words with AI.
        </p>
      </header>

      <section style={{ display: 'grid', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h2 style={{ marginBottom: '10px' }}>Progress</h2>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{memorizedCount}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Memorized</p>
            </div>
            <div>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-accent)' }}>{learningCount}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Learning</p>
            </div>
          </div>
        </div>

        <Link href="/add" className="btn-primary" style={{ textDecoration: 'none' }}>
          + Add New Words
        </Link>

        {learningCount > 0 && (
          <button className="glass-panel" style={{
            padding: '15px',
            width: '100%',
            color: 'var(--text-primary)',
            textAlign: 'left',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            📖 Start Review ({learningCount} words)
          </button>
        )}
      </section>
    </main>
  );
}
