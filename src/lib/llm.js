import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateWordList = async (text, apiKey) => {
    if (!apiKey) {
        throw new Error("API Key is required");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    You are a vocabulary tutor. Extract up to 20 representative and challenging English words from the text below.
    For each word, provide:
    1. The word itself.
    2. A simple definition in English.
    3. The main Korean meaning (definition).
    4. 2-3 short example sentences using the word.
    
    Return the result strictly as a JSON array of objects with keys: "word", "definition", "meaning", "examples" (array of strings).
    Do not include markdown formatting like \`\`\`json. Just the raw JSON.
    
    Text:
    ${text.substring(0, 5000)} // Limiting text length for token safety
  `;

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
