import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function verifyEliteChain() {
    const results = [];
    // Discovered available models in this environment
    const chain = ["gemini-2.0-flash", "gemini-flash-latest", "gemini-2.5-flash"];

    console.log("Verifying NEW Elite AI Fallback Chain...");

    for (const m of chain) {
        try {
            console.log(`Checking ${m}...`);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Respond with 'AI ACTIVE'");
            const text = result.response.text();
            results.push(`Model ${m}: SUCCESS (${text.trim()})`);
        } catch (e: any) {
            results.push(`Model ${m}: FAIL - ${e.message}`);
        }
    }

    fs.writeFileSync("elite_verification.txt", results.join("\n"));
    console.log(results.join("\n"));
}

verifyEliteChain();
