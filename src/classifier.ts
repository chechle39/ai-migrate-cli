import { ClassifiedFile, ProjectFile } from "./types";

export function classifyFiles(files: ProjectFile[], type: "php" | "dotnet"): ClassifiedFile[] {
  return files.map(file => {
    let fileType = "other";

    if (type === "php") {
      if (file.path.includes("Controller")) fileType = "controller";
      else if (file.path.includes("Model")) fileType = "model";
      else if (file.extension === ".php" || file.path.includes("view")) fileType = "view";
      else if (file.path.includes("routes")) fileType = "routing";
    }

    if (type === "dotnet") {
      if (file.path.includes("Controllers") && file.extension === ".cs") fileType = "controller";
      else if (file.path.includes("Models")) fileType = "model";
      else if (file.extension === ".cshtml") fileType = "view";
      else if (file.path.includes("Startup.cs")) fileType = "routing";
    }

    return {
      ...file,
      type: fileType,
    };
  });
}
