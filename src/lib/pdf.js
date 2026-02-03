export const extractTextFromPDF = async (file) => {
    if (typeof window === 'undefined') return ''; // Ensure client-side only

    try {
        // Dynamic import to prevent server-side build errors (DOMMatrix, canvas)
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');

        // Configure worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';

        // Iterate through all pages
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }

        return fullText;
    } catch (error) {
        console.error("PDF Extraction Error:", error);
        throw new Error("Failed to extract text from PDF.");
    }
};
