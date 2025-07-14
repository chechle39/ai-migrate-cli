export function cleanMermaidText(raw: string): string {
  const lines = raw
    .replace(/```mermaid/g, "")
    .replace(/```/g, "")
    .split("\n")
    .map(line => line.trim());

  const validStarters = ["graph", "sequenceDiagram", "classDiagram"];
  const diagramStartIndex = lines.findIndex(line =>
    validStarters.some(k => line.startsWith(k))
  );

  if (diagramStartIndex === -1) return "";

  const resultLines: string[] = [];
  let diagramStarted = false;

  for (let i = diagramStartIndex; i < lines.length; i++) {
    const line = lines[i];

    // Nếu là dòng Mermaid hợp lệ → giữ lại
    if (
      validStarters.some(k => line.startsWith(k)) ||
      /^[A-Za-z0-9_]+\s*(-->|-->>|->>|-\.->|==>|-.->)\s*[A-Za-z0-9_]+/.test(line) ||
      line === ""
    ) {
      diagramStarted = true;
      resultLines.push(line);
    }
    // Nếu đã bắt đầu diagram, mà gặp dòng tiếng Anh mô tả → dừng
    else if (diagramStarted && /^[A-Z][^:]*:/.test(line)) {
      // Ví dụ: "Note: …", "Explanation: …", "This diagram …"
      break;
    }
    // Nếu chưa bắt đầu mà gặp mô tả → bỏ qua
    else if (!diagramStarted) {
      continue;
    }
  }

  return resultLines.join("\n");
}
