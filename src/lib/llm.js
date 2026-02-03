import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with the API key from environment (configured in next.config.mjs)
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export const generateWordList = async (input, type = 'text') => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = [];
    if (type === 'image') {
        // Input is base64 string (data:image/jpeg;base64,...)
        // We need to strip the header for the API if it exists, but Google's helper might need specific format.
        // Actually, for inlineData, we just need the base64 string and mimeType.

        const base64Data = input.split(',')[1] || input;
        // Default to jpeg if not specified, though usually the data URI has it.
        const mimeType = input.match(/:(.*?);/)?.[1] || 'image/jpeg';

        prompt = [
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            },
            `
            You are an expert vocabulary tutor. Analyze the image provided. 
            Identify up to 20 important, challenging, or useful English words visible in or relevant to this image.
            
            For each word, provide:
            1. The word itself.
            2. A simple definition in English.
            3. The main Korean meaning (definition).
            4. 2-3 short example sentences using the word.
            
            Return the result strictly as a JSON array of objects with keys: "word", "definition", "meaning", "examples" (array of strings).
            Do not include markdown formatting like \`\`\`json. Just the raw JSON.
            `
        ];
    } else {
        // Text input (e.g. from PDF)
        prompt = [
            `
            You are a vocabulary tutor. Extract up to 20 representative and challenging English words from the text below.
            For each word, provide:
            1. The word itself.
            2. A simple definition in English.
            3. The main Korean meaning (definition).
            4. 2-3 short example sentences using the word.
            
            Return the result strictly as a JSON array of objects with keys: "word", "definition", "meaning", "examples" (array of strings).
            Do not include markdown formatting like \`\`\`json. Just the raw JSON.
            
            Text:
            ${input.substring(0, 5000)}
          `
        ];
    }

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let textResult = response.text();

        // Cleanup markdown if present
        textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(textResult);
    } catch (error) {
        console.error("LLM Generation Error:", error);
        throw new Error("Failed to generate word list from Gemini.");
    }
};
