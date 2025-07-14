// src/diagram/exportImage.ts
import { execSync } from "child_process";
import path from "path";

export async function exportMermaidToImages(
  inputPath: string = "architecture.mmd"
) {
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const pngOut = `${baseName}.png`;
  const svgOut = `${baseName}.svg`;

  try {
    console.log("🛠️ Exporting Mermaid to PNG...");
    execSync(`npx mmdc -i ${inputPath} -o ${pngOut} -b white`, {
      stdio: "inherit",
    });

    console.log("🛠️ Exporting Mermaid to SVG...");
    execSync(`npx mmdc -i ${inputPath} -o ${svgOut} -b transparent`, {
      stdio: "inherit",
    });

    console.log(`✅ Exported:`);
    console.log(`   📄 PNG: ${path.resolve(pngOut)}`);
    console.log(`   📄 SVG: ${path.resolve(svgOut)}`);
  } catch (err) {
    console.error("❌ Error exporting Mermaid diagram:", err);
  }
}
