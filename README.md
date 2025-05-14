# node-sped-pdf

> 📄 Conversão simples e prática de XML (NFe/NFC-e) para PDF (DANFE), compatível com Node.js e Browser.

## 💡 Sobre

**node-sped-pdf** é uma biblioteca desenvolvida para facilitar a geração do Documento Auxiliar da Nota Fiscal Eletrônica (DANFE) a partir do XML da NFe (modelo 55) e NFC-e (modelo 65). O projeto permite geração rápida e eficiente, tanto em ambientes Node.js quanto diretamente no navegador.

## ⚙️ Instalação

```bash
npm install node-sped-pdf
```

## 🚀 Uso em Node.js

```javascript
import { danfe } from 'node-sped-pdf';
import fs from 'fs';

const xml = fs.readFileSync('./nota.xml', 'utf-8');

(async () => {
  const pdf = new danfe({ xml, logo: 'https://sua-logo.com/logo.png' });
  const result = await pdf.getPDF();

  fs.writeFileSync('nota.pdf', Buffer.from(result, 'base64'));
})();
```

## 🌐 Uso no Browser

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Exemplo node-sped-pdf</title>
    <script src="https://github.com/devongovett/blob-stream/releases/download/v0.1.3/blob-stream.js"></script>
    <script src="https://github.com/foliojs/pdfkit/releases/download/v0.16.0/pdfkit.standalone.js"></script>
</head>
<body>
    <textarea id="xmlInput"></textarea>
    <button onclick="gerarPDF()">Gerar PDF</button>
    <iframe id="pdfOutput" style="width:100%;height:90vh;"></iframe>

    <script type="module">
      import { danfe } from './node_modules/node-sped-pdf/src/index.js';

      window.gerarPDF = async function() {
        const xml = document.getElementById('xmlInput').value;
        const pdf = new danfe({ xml, logo: 'https://sua-logo.com/logo.png' });

        const res = await pdf.getPDF();
        const blob = new Blob([Uint8Array.from(atob(res), c => c.charCodeAt(0))], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        document.getElementById('pdfOutput').src = url;
      };
    </script>
</body>
</html>
```

## 🔖 Parâmetros

| Propriedade | Descrição | Obrigatório |
|-------------|-----------|-------------|
| `xml`       | XML da NFe/NFC-e. | ✅ Sim |
| `logo`      | URL da imagem da logo (HTTP) ou imagem em base64 para exibição no PDF. | ❌ Não |

## 📄 Licença

Este projeto está sob a licença MIT.

