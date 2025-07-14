import fs from "fs";
import path from "path";
import { execSync } from "child_process";

export async function splitAndExportMermaidDiagrams(
  inputPath: string = "architecture.mmd",
  outputDir: string = "diagrams"
) {
  console.log('outputDir', outputDir);
  const content = fs.readFileSync(inputPath, "utf-8");

  // Tách theo %% comment
  const blocks = content.split(/^%%\s+/gm).filter(Boolean);
  console.log('blocks', blocks)

  // Tạo thư mục chứa ảnh
  fs.mkdirSync(outputDir, { recursive: true });

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();

    // Bỏ qua nếu không có diagram thực
    if (!/(graph\s|sequenceDiagram|classDiagram)/.test(block)) continue;

    // Lấy tên gợi ý từ comment đầu tiên
    const nameMatch = block.match(/^([^\n\r]+)/);
    const rawName = nameMatch ? nameMatch[1].trim() : `diagram_${i}`;
    const safeName = rawName
      .replace(/[^\w\d-_]/g, "_")
      .toLowerCase()
      .slice(0, 50);

    const fileName = rawName.split("\\").pop(); // "add-doctor.php"
    const baseFile = path.join(outputDir, `${fileName?.split('.')[0]}` || `diagram_${i}`);
    const mmdFile = `${baseFile}.mmd`;
    const pngFile = `${fileName?.split('.')[0]}.png`;
    const cleanedBlock = block
      .split("\n")
      .filter((line, i) => {
        if (i === 0) {
          return;
        }
        return line;
      })
      .join("\n");

    console.log('cleanedBlock',)
    fs.writeFileSync(mmdFile, cleanedBlock, "utf-8");

    try {

      // Đường dẫn thư mục image
      const imageDir = path.join(outputDir, "image");

      // Tạo thư mục nếu chưa có
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }


      execSync(`npx mmdc -i ${mmdFile} -o ${imageDir}/${pngFile} -b white`, {
        stdio: "inherit",
      });

      // execSync(`npx mmdc -i ${mmdFile} -o ${svgFile} -b transparent`, {
      //   stdio: "inherit",
      // });
      console.log(`✅ Exported ${fileName}.png / .svg`);
    } catch (err) {
      console.error(`❌ Failed to export diagram: ${fileName}`, err);
    }
  }

  console.log(`🎉 All diagrams exported to: ${path.resolve(outputDir)}`);
}
