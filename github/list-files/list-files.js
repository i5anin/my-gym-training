import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

// Получаем путь к текущему файлу и его директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Функция для рекурсивного обхода директорий
const readDirectory = async (dir) => {
  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);

      try {
        const stats = await fs.stat(filePath);

        if (stats.isDirectory()) {
          // Если это директория, рекурсивно обрабатываем её
          console.log(`📂 Обрабатываем директорию: ${filePath}`);
          await readDirectory(filePath);
        } else {
          const isTextFile = /\.(txt|md|js|ts|json|html|css|vue)$/i.test(file);

          if (isTextFile) {
            console.log(`📜 ${file}`);

            try {
              const content = await fs.readFile(filePath, "utf8");
              console.log("🔍 Содержимое:");
              console.log(content.substring(0, 5000)); // Ограничиваем вывод 5000 символами
              console.log("—".repeat(50));
            } catch (error) {
              console.error(`❌ Ошибка чтения файла ${file}:`, error.message);
            }
          } else {
            console.log(`📁 Пропускаем бинарный файл: ${file}`);
          }
        }
      } catch (error) {
        console.error(`❌ Ошибка получения информации о файле ${file}:`, error);
      }
    }
  } catch (err) {
    console.error("❌ Ошибка чтения директории:", err);
  }
};

// Читаем пути из файла
const readDirectoriesFromFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const directories = data
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean); // Разделяем по строкам и убираем пустые строки

    for (const dirOrFile of directories) {
      try {
        const stats = await fs.stat(dirOrFile);

        if (stats.isDirectory()) {
          console.log(`📂 Обрабатываем директорию: ${dirOrFile}`);
          await readDirectory(dirOrFile);
        } else if (stats.isFile()) {
          const isTextFile = /\.(txt|md|js|ts|json|html|css|vue)$/i.test(dirOrFile);

          if (isTextFile) {
            console.log(`📜 ${dirOrFile}`);

            try {
              const content = await fs.readFile(dirOrFile, "utf8");
              console.log("🔍 Содержимое:");
              console.log(content.substring(0, 5000)); // Ограничиваем вывод 5000 символами
              console.log("—".repeat(50));
            } catch (error) {
              console.error(`❌ Ошибка чтения файла ${dirOrFile}:`, error.message);
            }
          } else {
            console.log(`📁 Пропускаем бинарный файл: ${dirOrFile}`);
          }
        }
      } catch (error) {
        console.error("❌ Ошибка получения информации о пути:", error);
      }
    }
  } catch (err) {
    console.error("❌ Ошибка чтения файла с путями:", err);
  }
};

// Указываем путь к файлу с директориями и файлами
const directoriesFile = "dirs.txt";

// Читаем пути из файла
await readDirectoriesFromFile(directoriesFile);
