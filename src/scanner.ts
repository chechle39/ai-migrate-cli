import fs from "fs";
import path from "path";
import { ProjectFile } from "./types";

export async function scanProject(dir: string): Promise<ProjectFile[]> {
  const files: ProjectFile[] = [];

  function walk(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        files.push({
          path: fullPath,
          extension: path.extname(fullPath).toLowerCase(),
        });
      }
    }
  }

  walk(dir);
  return files;
}
