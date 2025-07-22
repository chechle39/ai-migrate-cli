
// src/index.ts
import { Command } from "commander";
import path from "path";
import { scanProject } from "./scanner";
import { classifyFiles } from "./classifier";
import { analyzeArchitecture } from "./analyzeArchitecture";
import { splitAndExportMermaidDiagrams } from "./splitAndExport";
import fs from "fs";
const program = new Command();

program
    .name("legacy-migrator")
    .description("CLI to analyze legacy PHP/.NET projects")
    .version("1.0.0")
    .requiredOption("-p, --path <path>", "Path to the legacy project")
    .requiredOption("-t, --type <type>", "Project type: php or dotnet")
    .option("-f, --filter <type>", "Filter by file type (controller, model, view, etc.)")
    .option("-g, --group-by <key>", "Group output by key (e.g., type)")
    .option("--diagram", "Generate architecture diagram using OpenAI")
    .option('--diagram-out <output>', 'Output folder for diagrams')
    .option('--ai', 'use ai')
    .parse(process.argv);

const options = program.opts();

const projectPath = path.resolve(options.path);
const projectType = options.type.toLowerCase();
const filterType = options.filter?.toLowerCase();

if (!["php", "dotnet"].includes(projectType)) {
    console.error("❌ Invalid project type. Use 'php' or 'dotnet'.");
    process.exit(1);
}
function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
    return arr.reduce((acc, item) => {
        const groupKey = String(item[key]);
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(item);
        return acc;
    }, {} as Record<string, T[]>);
}


(async () => {
    const files = await scanProject(projectPath);
    let results = classifyFiles(files, projectType as "php" | "dotnet");
    if (filterType) {
        results = results.filter(file => file.type === filterType);
    }
    if (options.diagram) {
        const diagramFile = "architecture.mmd";
        console.log('options', options)
        const outputFolder = options.diagramOut || "diagrams";
        const architecture = path.join(outputFolder, "architecture");

        if (options.ai) {
            // Đường dẫn thư mục image

            // Tạo thư mục nếu chưa có
            if (!fs.existsSync(architecture)) {
                fs.mkdirSync(architecture, { recursive: true });
            }
            console.log('architecture', architecture)
            await analyzeArchitecture(results, "architecture.mmd", architecture);
        }
        const s = `${architecture}/${diagramFile}`
        await splitAndExportMermaidDiagrams(s, outputFolder);
    }
    if (options.groupBy === "type") {
        const grouped = groupBy(results, "type");

        for (const type in grouped) {
            console.log(`\n=== ${type.toUpperCase()} ===`);
            console.table(grouped[type].map(f => ({
                path: f.path,
                extension: f.extension
            })));
        }
    } else {
        // console.table(results);
    }
})();
