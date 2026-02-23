import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Elite AI Logic: Use cutting-edge models discovered in the environment
const getEliteModel = () => {
    // Discovered available models in this environment: gemini-2.0-flash, gemini-2.5-flash, gemini-flash-latest
    return ["gemini-2.0-flash", "gemini-flash-latest", "gemini-2.5-flash"];
};

export const aiService = {
    async generateResponse(prompt: string, context?: string) {
        const models = getEliteModel();
        const errorLog: string[] = [];

        for (const modelName of models) {
            try {
                console.log(`AI_SERVICE_TRACE: Attempting ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const fullPrompt = context
                    ? `You are an expert Study Assistant. Use the following context to help the student:\n\nContext: ${context}\n\nStudent Question: ${prompt}`
                    : `You are an expert Study Assistant. Help the student with their question: ${prompt}`;

                const result = await model.generateContent(fullPrompt);
                const response = await result.response;
                return response.text();
            } catch (error: any) {
                const errorMsg = `[${modelName}] ${error.message}`;
                console.error(`AI_SERVICE_RETRY: ${errorMsg}`);
                errorLog.push(errorMsg);
            }
        }

        throw new Error(`AI_GEN_CRITICAL: All AI models failed. Trace:\n${errorLog.join("\n")}`);
    },

    async summarizeSession(messages: any[]) {
        const models = getEliteModel();
        const chatLog = messages.map(m => `${m.userName}: ${m.content}`).join("\n");
        const prompt = `You are a Study Session Summarizer. Based on the following chat log from a collaborative study session, provide a concise summary of the key topics discussed, any decisions made, and follow-up tasks. Use bullet points and professional formatting.\n\nChat Log:\n${chatLog}`;
        const errorLog: string[] = [];

        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return response.text();
            } catch (e: any) {
                errorLog.push(`[${modelName}] ${e.message}`);
                console.error(`AI_SERVICE_SUMMARY_FAIL: ${modelName} failed`);
            }
        }
        throw new Error(`AI_SUMMARY_CRITICAL: Summation failed. Failures: ${errorLog.join(", ")}`);
    },

    async generateQuiz(context: string) {
        const models = getEliteModel();
        const prompt = `You are a Quiz Generator. Based on the following study context (notes/chat), generate a quiz with 5 multiple-choice questions. Format the output as a JSON array of objects, where each object has: "question", "options" (array of 4 strings), and "correctAnswer" (the string value of the correct option).\n\nContext:\n${context}`;
        const errorLog: string[] = [];

        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                const jsonMatch = text.match(/\[[\s\S]*\]/);
                if (jsonMatch) return JSON.parse(jsonMatch[0]);
                return JSON.parse(text);
            } catch (e: any) {
                errorLog.push(`[${modelName}] ${e.message}`);
                console.error(`AI_SERVICE_QUIZ_FAIL: ${modelName} failed`);
            }
        }
        throw new Error(`AI_QUIZ_CRITICAL: Quiz generation failed. Failures: ${errorLog.join(", ")}`);
    }
};
