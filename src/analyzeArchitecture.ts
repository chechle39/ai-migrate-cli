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
  const diagrams3: string[] = [];


  for (const file of files) {
    const content = fs.readFileSync(file.path, "utf-8");
    const shortContent = content.slice(0, 5000); // avoid token limit

    const architecturePrompt = `You're a software architect.
Analyze the following ${file.type} file and extract a high-level architecture flow (route → controller → model → db) if applicable.
Please output the result in Mermaid.js format (graph TD or sequenceDiagram).

FILE: ${path.basename(file.path)}

\`\`\`
${shortContent}
\`\`\``;

    const integrationPrompt = `Analyze the following code and detect integration points:
- REST APIs (incoming/outgoing)
- Database operations (queries, ORM, raw SQL)
- Queues/pubsub (e.g. Kafka, RabbitMQ)
- External services (Stripe, Firebase, etc.)

Output a summary of:
1. Integration type (REST, DB, etc.)
2. Direction (incoming / outgoing)
3. Target (what service/db is it integrating with)

\`\`\`
${shortContent}
\`\`\``;

    try {
      const [archRes, integrationRes] = await Promise.all([
        openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are a software architect who generates architecture diagrams from source code." },
            { role: "user", content: architecturePrompt }
          ],
          temperature: 0.3,
        }),
        openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are an expert in software integration analysis." },
            { role: "user", content: integrationPrompt }
          ],
          temperature: 0.3,
        })
      ]);

      const archOutput = archRes.choices[0].message.content || "";
      const integrationOutput = integrationRes.choices[0].message.content || "";
      console.log('integrationOutput', integrationOutput);

      console.log(`📌 Analyzed: ${file.path}`);
      diagrams.push(archOutput.trim());

      const cleaned = cleanMermaidText(archOutput);
      diagrams2.push(`%% ${file.path}\n${cleaned}`);
      diagrams3.push(integrationOutput.trim());
    } catch (err) {
      console.error(`❌ Failed to analyze ${file.path}`, err);
    }
  }

  const finalDiagram = diagrams.map((d, i) => `%% Diagram ${i + 1}\n${d}`).join("\n\n");
  const finalDiagram2 = diagrams2.join("\n\n");

  const fullPath = path.join(outputDir, outFile);
  const fullPath2 = path.join(outputDir, 'architectureexplain.mmd');
  const fullPath3 = path.join(outputDir, 'integrationPoint.txt');
  fs.writeFileSync(fullPath2, diagrams.join("\n\n"), "utf-8");
  fs.writeFileSync(fullPath, diagrams2.join("\n\n"), "utf-8");
  fs.writeFileSync(fullPath3, diagrams3.join("\n\n"), "utf-8");
  console.log(`✅ Mermaid diagram saved to ${outFile}`);
}
