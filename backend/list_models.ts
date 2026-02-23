import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY || "";
    const results = [];

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    try {
        console.log(`Fetching available models from ${url}...`);
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            results.push(JSON.stringify(data, null, 2));
        } else {
            results.push(`FAIL: ${response.status} ${response.statusText} - ${JSON.stringify(data)}`);
        }
    } catch (e: any) {
        results.push(`ERROR: ${e.message}`);
    }

    fs.writeFileSync("available_models.json", results.join("\n"));
    console.log("Model list written to available_models.json");
}

listModels();
