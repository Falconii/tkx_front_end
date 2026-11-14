/*
  Servidor Node SÓ do front (Railway).
  Serve o build do Angular (docs/browser) e devolve o index.html para as rotas do Angular
  (/eventos, /mobile ...), para a página poder ser atualizada em qualquer rota.

    build:  npm run build_railway
    start:  node server.js        (a porta vem da variável PORT do Railway)
*/
const express = require("express");
const path = require("path");
const fs = require("fs");

const PASTA = path.join(__dirname, "docs", "browser");
const INDEX = path.join(PASTA, "index.html");
const PORTA = process.env.PORT || 4200;

if (!fs.existsSync(INDEX)) {
  console.error(`Build do Angular não encontrado em ${PASTA}. Rode "npm run build_railway" antes.`);
  process.exit(1);
}

const app = express();
app.disable("x-powered-by");

// arquivos com hash no nome (main-XXXX.js, chunk-XXXX.js) podem ficar em cache; o index.html nunca
app.use(
  express.static(PASTA, {
    index: false,
    setHeaders: (res, arquivo) => {
      if (arquivo.endsWith("index.html")) {
        res.setHeader("Cache-Control", "no-cache");
      } else if (/-[A-Z0-9]{8}\.(js|css)$/.test(arquivo)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  }),
);

// correção das rotas do Angular
app.use((req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(INDEX);
});

app.listen(PORTA, () => console.log(`Front TKX no ar na porta ${PORTA}`));
