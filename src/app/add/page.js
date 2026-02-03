'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import ImageCapture from '@/components/Input/ImageCapture';
import PDFUploader from '@/components/Input/PDFUploader';

import { extractTextFromPDF } from '@/lib/pdf';
import { generateWordList } from '@/lib/llm';
import { useVocabulary } from '@/context/VocabularyContext';

export default function AddPage() {
    const router = useRouter();
    const { addWords } = useVocabulary();

    const [activeTab, setActiveTab] = useState('image'); // 'image' or 'pdf'
    const [isProcessing, setIsProcessing] = useState(false);

    // For PDF: text content | For Image: base64 string
    const [extractedText, setExtractedText] = useState('');
    const [imageBase64, setImageBase64] = useState(null);

    const [generatedWords, setGeneratedWords] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleProcess = async (file) => {
        if (!file) {
            setExtractedText('');
            setImageBase64(null);
            return;
        }

        setIsProcessing(true);
        setExtractedText('');
        setImageBase64(null);
        setGeneratedWords([]);

        try {
            if (activeTab === 'image') {
                // Convert image to Base64 for Gemini Vision
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageBase64(reader.result);
                    setIsProcessing(false);
                };
                reader.readAsDataURL(file);
            } else {
                // Determine if PDF or something else
                const text = await extractTextFromPDF(file);
                setExtractedText(text);
                setIsProcessing(false);
            }
        } catch (error) {
            alert('Failed to process file: ' + error.message);
            setIsProcessing(false);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            let result;
            if (activeTab === 'image') {
                if (!imageBase64) return alert("No image loaded");
                result = await generateWordList(imageBase64, 'image');
            } else {
                if (!extractedText) return alert("No text extracted from PDF");
                result = await generateWordList(extractedText, 'text');
            }
            setGeneratedWords(result);
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
                    onClick={() => { setActiveTab('image'); setGeneratedWords([]); }}
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
                    onClick={() => { setActiveTab('pdf'); setGeneratedWords([]); }}
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

            {/* Content Preview & Action Area */}
            {((activeTab === 'image' && imageBase64) || (activeTab === 'pdf' && extractedText)) && (
                <div className="glass-panel" style={{ marginTop: '30px', padding: '20px' }}>

                    {activeTab === 'pdf' && (
                        <>
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
                        </>
                    )}

                    {activeTab === 'image' && (
                        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-accent)' }}>✅ Image ready for AI analysis</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Gemini Vision will extract words directly from the image.</p>
                        </div>
                    )}

                    <button
                        className="btn-primary"
                        style={{ width: '100%' }}
                        onClick={handleGenerate}
                        disabled={isGenerating}
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
