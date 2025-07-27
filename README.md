npm start -- --path ./legacy-project --type php --filter controller --analyze

npm start -- --path ./legacy-project --type php --diagram



npm start -- --path "C:/Users/HP/Downloads/Hospital-Management-System-main" --type php --diagram --diagram-out "C:/Users/HP/Downloads/out-project"


npm start -- --path "C:\Users\HP\Downloads\php-monolith" --type php --diagram --diagram-out "C:/Users/HP/Downloads/out-project" --ai --filter view


npx ./ --path "C:/Users/HP/Downloads/Hospital-Management-System-main" --type php --diagram --diagram-out "C:/Users/HP/Downloads/out-project" --ai --filter view



                         ┌──────────────────────────┐
                         │        Developer          │
                         │ CLI (ai-migrate-cli)      │
                         │ Web UI (upload project)   │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │   Project Analyzer        │ ◄─────────────┐
                         │  (parser: .php, .cs, etc) │               │
                         └────────────┬─────────────┘               │
                                      │                              │
                                      ▼                              │
                   ┌────────────────────────────────────┐           │
                   │     Prompt Orchestration Engine     │           │
                   │  (LangChain, custom pipeline logic) │           │
                   └────────────┬────────────┬──────────┘           │
                                │            │                      │
                  ┌────────────▼───┐    ┌────▼────────┐             │
                  │ AI Service     │    │ Prompt Cache │             │
                  │ (OpenAI API)   │    │ + Token Store│             │
                  └─────┬──────────┘    └──────────────┘             │
                        │                                           │
                        ▼                                           │
        ┌──────────────────────────────┐                            │
        │    Analysis Results Store    │                            │
        │ - Detected architecture      │                            │
        │ - Integration points         │                            │
        │ - Migrated Node.js code      │                            │
        └──────┬───────────────────────┘                            │
               │                                                    │
               ▼                                                    │
       ┌───────────────────────────────┐                            │
       │    Visualization Generator    │                            │
       │ (Mermaid, React Flow, etc)    │                            │
       └────────────┬──────────────────┘                            │
                    ▼                                               │
             ┌────────────────┐                                     │
             │ Web UI Viewer  │◄────────────────────────────────────┘
             └────────────────┘


| Thành phần                      | Vai trò                                                                     |
| ------------------------------- | --------------------------------------------------------------------------- |
| **Developer Interface**         | CLI và/hoặc Web UI upload project                                           |
| **Project Analyzer**            | Dùng `ts-morph`, `php-parser`, hoặc `Roslyn` để parse mã nguồn và chia file |
| **Prompt Orchestration Engine** | Xây luồng prompt → detect → migrate → visualize                             |
| **AI Service**                  | Dùng GPT-4o hoặc Claude để phân tích, viết lại code, hiểu context           |
| **Prompt Cache**                | Lưu prompt/response để tránh lặp lại hoặc hỗ trợ debug                      |
| **Analysis Results Store**      | Lưu sơ đồ kiến trúc, tích hợp, mã đã migrate                                |
| **Visualization Generator**     | Tạo Mermaid, sequence diagram, sơ đồ tích hợp                               |
| **Web UI Viewer**               | Giao diện người dùng xem sơ đồ hoặc export project                          |

🗺️ Luồng hoạt động mẫu
Người dùng upload project qua CLI hoặc Web

Parser đọc mã, chia nhỏ theo controller/service/config

Mỗi phần được đưa vào Prompt phù hợp:

Detect loại tích hợp (REST, DB, queue…)

Tạo lại kiến trúc

Sinh code mới (Node.js)

Kết quả được lưu và tổng hợp lại thành sơ đồ

Trả về Web UI hoặc CLI console / folder code đã migrate

🧰 Bonus: Output cuối có thể là gì?
/out/migrated-code/ → Node.js TypeScript code

/out/architecture.md → mô tả hệ thống

/out/diagram.mmd → sơ đồ Mermaid

/out/integrations.json → REST/DB/Queue detected