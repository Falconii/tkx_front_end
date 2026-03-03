const path = require("path");
const fse = require("fs-extra");

// Pasta de origem (build Angular)
const sourceDir = path.join(__dirname, "docs\\browser");

// Pasta de destino principal
const destinationBase = "C:\\Repositorios\\Marcos\\tkx_aplicativo";

// Timestamp formatado
const now = new Date();
const timestamp = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, "0")}_${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}_${String(now.getMinutes()).padStart(2, "0")}`;
const backupDir = path.join(destinationBase, `docs_${timestamp}`);

// Copiar pasta
fse
  .copy(sourceDir, backupDir)
  .then(() => console.log(`✅ Backup criado em: ${backupDir}`))
  .catch((err) => console.error("❌ Erro ao copiar:", err));
