'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import ImageCapture from '@/components/Input/ImageCapture';
import PDFUploader from '@/components/Input/PDFUploader';
import { extractTextFromImage } from '@/lib/ocr';
import { extractTextFromPDF } from '@/lib/pdf';
import { generateWordList } from '@/lib/llm';
import { useVocabulary } from '@/context/VocabularyContext';

export default function AddPage() {
    const router = useRouter();
    const { addWords } = useVocabulary();

    const [activeTab, setActiveTab] = useState('image'); // 'image' or 'pdf'
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedText, setExtractedText] = useState('');

    const [apiKey, setApiKey] = useState('');
    const [generatedWords, setGeneratedWords] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleProcess = async (file) => {
        if (!file) return;
        setIsProcessing(true);
        setExtractedText('');

        try {
            let text = '';
            if (activeTab === 'image') {
                text = await extractTextFromImage(file);
            } else {
                text = await extractTextFromPDF(file);
            }
            setExtractedText(text);
        } catch (error) {
            alert('Failed to process file: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleGenerate = async () => {
        if (!apiKey) return alert('Please enter an API Key');
        setIsGenerating(true);
        try {
            const words = await generateWordList(extractedText, apiKey);
            setGeneratedWords(words);
        } catch (error) {
            alert('Generation failed: ' + error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (generatedWords.length === 0) return;
        addWords(generatedWords);
        alert('Words saved to your vocabulary!');
        router.push('/');
    };

    return (
        <main className="container">
            <header style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '30px',
                paddingTop: '20px'
            }}>
                <Link href="/" style={{ fontSize: '1.2rem' }}><FaArrowLeft /></Link>
                <h1 style={{ fontSize: '1.5rem' }}>Add New Material</h1>
            </header>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                    onClick={() => setActiveTab('image')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: activeTab === 'image' ? 'var(--primary)' : 'var(--bg-secondary)',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Camera / Image
                </button>
                <button
                    onClick={() => setActiveTab('pdf')}
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: activeTab === 'pdf' ? 'var(--primary)' : 'var(--bg-secondary)',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    PDF Document
                </button>
            </div>

            {activeTab === 'image' ? (
                <ImageCapture onImageSelected={handleProcess} />
            ) : (
                <PDFUploader onFileSelected={handleProcess} />
            )}

            {isProcessing && (
                <div style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-accent)' }}>
                    <p>Processing...</p>
                </div>
            )}

            {extractedText && (
                <div className="glass-panel" style={{ marginTop: '30px', padding: '20px' }}>
                    <h3 style={{ marginBottom: '10px' }}>Extracted Text</h3>
                    <p style={{
                        whiteSpace: 'pre-wrap',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        maxHeight: '150px',
                        overflowY: 'auto',
                        marginBottom: '20px',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        paddingBottom: '10px'
                    }}>
                        {extractedText}
                    </p>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Gemini API Key</label>
                        <input
                            type="password"
                            placeholder="Paste your API Key here"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(0,0,0,0.3)',
                                color: 'white'
                            }}
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                            Key is not saved permanently in this demo.
                        </p>
                    </div>

                    <button
                        className="btn-primary"
                        style={{ width: '100%' }}
                        onClick={handleGenerate}
                        disabled={!apiKey || isGenerating}
                    >
                        {isGenerating ? 'Analyzing with AI...' : 'Generate Word List'}
                    </button>
                </div>
            )}

            {generatedWords.length > 0 && (
                <div style={{ marginTop: '30px' }}>
                    <h2 className="title-gradient" style={{ marginBottom: '20px' }}>Generated Words</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {generatedWords.map((item, idx) => (
                            <div key={idx} className="glass-panel" style={{ padding: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-accent)' }}>{item.word}</h3>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.meaning}</span>
                                </div>
                                <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>{item.definition}</p>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '10px', borderLeft: '2px solid var(--primary)' }}>
                                    {item.examples.map((ex, i) => (
                                        <p key={i} style={{ marginBottom: '3px' }}>• {ex}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn-primary" style={{ marginTop: '20px', width: '100%' }} onClick={handleSave}>
                        Save to My Vocabulary
                    </button>
                </div>
            )}
        </main>
    );
}
