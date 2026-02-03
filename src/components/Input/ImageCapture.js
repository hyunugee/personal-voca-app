'use client';

import { useState, useRef } from 'react';
import { FaCamera, FaImage } from 'react-icons/fa';

export default function ImageCapture({ onImageSelected }) {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            onImageSelected(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <input
                type="file"
                accept="image/*"
                capture="environment" // Hints mobile to use rear camera
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            {preview ? (
                <div style={{ position: 'relative', marginBottom: '15px' }}>
                    <img
                        src={preview}
                        alt="Preview"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '300px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    />
                    <button
                        onClick={() => { setPreview(null); onImageSelected(null); }}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer'
                        }}
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <div
                    onClick={triggerFileInput}
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
                    <div style={{ fontSize: '2rem', display: 'flex', gap: '15px' }}>
                        <FaCamera /> <FaImage />
                    </div>
                    <p>Tap to take photo or upload</p>
                </div>
            )}
        </div>
    );
}
