'use client';

import { useState, useRef } from 'react';
import { FaFilePdf } from 'react-icons/fa';

export default function PDFUploader({ onFileSelected }) {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            onFileSelected(file);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            {fileName ? (
                <div style={{ padding: '20px' }}>
                    <FaFilePdf size={40} color="var(--error)" style={{ marginBottom: '10px' }} />
                    <p style={{ fontWeight: '600' }}>{fileName}</p>
                    <button
                        onClick={() => { setFileName(null); onFileSelected(null); }}
                        style={{
                            marginTop: '10px',
                            background: 'transparent',
                            border: '1px solid var(--error)',
                            color: 'var(--error)',
                            padding: '5px 10px',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer'
                        }}
                    >
                        Remove
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current.click()}
                    style={{
                        border: '2px dashed var(--text-secondary)',
                        borderRadius: 'var(--radius-md)',
                        padding: '40px 20px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px',
                        color: 'var(--text-secondary)'
                    }}
                >
                    <FaFilePdf size={32} />
                    <p>Tap to upload PDF Document</p>
                </div>
            )}
        </div>
    );
}
