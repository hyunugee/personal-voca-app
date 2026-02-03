import Tesseract from 'tesseract.js';

export const extractTextFromImage = async (imageFile) => {
    try {
        const { data: { text } } = await Tesseract.recognize(
            imageFile,
            'eng', // We can add 'kor' later if needed, but for English vocab 'eng' is primary
            { logger: m => console.log(m) }
        );
        return text;
    } catch (error) {
        console.error("OCR Error:", error);
        throw new Error("Failed to extract text from image.");
    }
};
