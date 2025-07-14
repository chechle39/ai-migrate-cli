// src/diagram/analyzeArchitecture.ts
import fs from "fs";
import path from "path";
import { OpenAI } from "openai";
import { ClassifiedFile } from "./types";
import { cleanMermaidText } from "./cleanMermaidText";
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeArchitecture(
  files: ClassifiedFile[],
  outFile: string = "architecture.mmd",
  outputDir = "."
) {
  const diagrams: string[] = [];
  const diagrams2: string[] = [];


  for (const file of files) {
    const content = fs.readFileSync(file.path, "utf-8");

    const prompt = `You're a software architect.
Analyze the following ${file.type} file and extract a high-level architecture flow (route → controller → model → db) if applicable.
Please output the result in Mermaid.js format (graph TD or sequenceDiagram).

FILE: ${path.basename(file.path)}

\`\`\`
${content.slice(0, 5000)}  // avoid token limit
\`\`\`
`;

    try {
      console.log('process.env.OPENAI_API_KEY', process.env.OPENAI_API_KEY)
      const res = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a software architect who generates architecture diagrams from source code." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
      });

      const output = res.choices[0].message.content || "";
      console.log(`📌 Analyzed: ${file.path}`);
      diagrams.push(output.trim());
      const cleaned = cleanMermaidText(output);
      diagrams2.push(`%% ${file.path}\n${cleaned}`);

    } catch (err) {
      console.error(`❌ Failed to analyze ${file.path}`, err);
    }
  }

  // Gộp lại toàn bộ sơ đồ
  const finalDiagram = diagrams
    .map((d, i) => `%% Diagram ${i + 1}\n${d}`)
    .join("\n\n");
  const finalDiagram2 = diagrams2
    // .map((d, i) => `%% Diagram ${i + 1}\n${d}`)
    .join("\n\n");

  // fs.writeFileSync('architectureexplain.mmd', finalDiagram, "utf-8");
  // fs.writeFileSync(outFile, finalDiagram2, "utf-8");



  const fullPath = path.join(outputDir, outFile);
  const fullPath2 = path.join(outputDir, 'architectureexplain.mmd');
  fs.writeFileSync(fullPath2, diagrams.join("\n\n"), "utf-8");
  fs.writeFileSync(fullPath, diagrams2.join("\n\n"), "utf-8");
  console.log(`✅ Mermaid diagram saved to ${outFile}`);
}
