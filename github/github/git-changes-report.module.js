import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Получаем __dirname в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // Определяем пути
  const commitTemplatePath = path.join(__dirname, "COMMIT_TEMPLATE.md");

  // Читаем шаблон коммита из файла
  const commitTemplate = fs.existsSync(commitTemplatePath)
      ? fs.readFileSync(commitTemplatePath, "utf-8").trim()
      : "Шаблон коммита отсутствует.";

  // Получаем статус изменённых файлов
  const status = execSync("git status --short", { encoding: "utf-8" }).trim();

  // Получаем детальный diff
  const diff = execSync("git diff", { encoding: "utf-8" }).trim();

  // Подсчитываем количество изменённых файлов
  const changedFilesCount = status.split("\n").filter(line => line.trim() !== "").length;

  // Формируем финальный текст в формате Markdown и выводим в консоль
  console.log(`
# Git Changes Report

## 📌 Изменённые файлы:
\`\`\`
${status || "Нет изменений"}
\`\`\`

## 📌 Разница (diff):
\`\`\`diff
${diff || "Нет изменений"}
\`\`\`

---

## 📜 Шаблон коммита
${commitTemplate}

---

\x1b[31m❗ Скрипт завершил работу по получению данных для коммита. Всего изменённых файлов: ${changedFilesCount}\x1b[0m
`);
} catch (error) {
  console.error("❌ Ошибка при выполнении Git-команд:", error.message);
}
