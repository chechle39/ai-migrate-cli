const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "dist/index.js");
const shebang = "#!/usr/bin/env node\n";

// Đọc nội dung file
let content = fs.readFileSync(filePath, "utf8");

// Nếu chưa có shebang thì thêm vào
if (!content.startsWith(shebang)) {
  content = shebang + content;
  fs.writeFileSync(filePath, content, "utf8");
  console.log("✅ Shebang added to index.js");
}
