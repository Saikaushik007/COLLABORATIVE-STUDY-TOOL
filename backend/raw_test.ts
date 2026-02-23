import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function rawTest() {
    const key = process.env.GEMINI_API_KEY || "";
    const results = [];

    const versions = ["v1", "v1beta"];
    const models = ["gemini-1.5-flash", "gemini-pro"];

    console.log("Starting Raw HTTP API Testing...");

    for (const v of versions) {
        for (const m of models) {
            const url = `https://generativelanguage.googleapis.com/${v}/models/${m}:generateContent?key=${key}`;
            try {
                console.log(`Testing ${url}...`);
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: "test" }] }]
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    results.push(`SUCCESS: ${v}/${m}`);
                } else {
                    results.push(`FAIL: ${v}/${m} - ${response.status} ${response.statusText} - ${JSON.stringify(data)}`);
                }
            } catch (e: any) {
                results.push(`ERROR: ${v}/${m} - ${e.message}`);
            }
        }
    }

    fs.writeFileSync("raw_results.txt", results.join("\n"));
    console.log("Raw results written to raw_results.txt");
}

rawTest();
