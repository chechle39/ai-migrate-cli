import { ClassifiedFile, ProjectFile } from "./types";

export function classifyFiles(files: ProjectFile[], type: "php" | "dotnet"): ClassifiedFile[] {
  return files.map(file => {
    let fileType = "other";

    let lowerCase = file.path.toLocaleLowerCase();
    console.log('lowerCase', lowerCase)
    if (type === "php") {
      if (file.path.includes("controller")) fileType = "controller";
      else if (lowerCase.includes("model")) fileType = "model";
      else if (lowerCase.includes("route")) fileType = "routing";
      else if (lowerCase.includes("view")) fileType = "view";
      else if (lowerCase.includes("database")) fileType = "database";

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
