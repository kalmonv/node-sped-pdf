# node-sped-pdf

> 📄 Conversão simples e prática de XML (NFe/NFC-e) para PDF (DANFE), compatível com Node.js e Browser.

## 💡 Sobre

**node-sped-pdf** é uma biblioteca desenvolvida para facilitar a geração do Documento Auxiliar da Nota Fiscal Eletrônica (DANFE) a partir do XML da NFe (modelo 55) e NFC-e (modelo 65). O projeto permite geração rápida e eficiente, tanto em ambientes Node.js quanto diretamente no navegador.

<div align="center">

📣 **Participe da comunidade!**  
💬 Tire dúvidas, compartilhe experiências e colabore com outros desenvolvedores!

👉 [Grupo de Discussão no Google Groups](https://groups.google.com/g/node-sped-nfe)

![npm](https://img.shields.io/npm/dw/node-sped-pdf)

</div>

---

[🔎 Ver exemplo NFC-e PDF](https://github.com/kalmonv/node-sped-pdf/blob/main/exemplos/DANFCe.pdf)
&nbsp;&nbsp;
[📄 Ver exemplo NFe PDF](https://github.com/kalmonv/node-sped-pdf/blob/main/exemplos/DANFe.pdf)

## ⚙️ Instalação

```bash
npm install node-sped-pdf
```

## 🚀 Uso em Node.js

```javascript
import { DANFe, DANFCe } from 'node-sped-pdf';

DANFe({ xml: `XML DA NOTA FISCAL`, consulta: `XML DE CONSULTA`, logo: "http://localhost:5173/logo.jpg" }).then(res => {
  console.log(res)
});
```

## 🌐 Uso no Browser

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Exemplo node-sped-pdf</title>
</head>
<body>
    <textarea id="xmlInput"></textarea>
    <button onclick="gerarPDF()">Gerar PDF</button>
    <iframe id="pdfOutput" style="width:100%;height:90vh;"></iframe>

    <script type="module">
      // Browser
      import { DAV55, DANFe, DANFCe } from 'https://cdn.jsdelivr.net/npm/node-sped-pdf@latest/+esm';

      //Vite
      import { DANFe, DANFCe } from 'node-sped-pdf';

      window.gerarPDF = async function() {
        DANFe({ xml: `XML DA NOTA FISCAL`, consulta: `XML DE CONSULTA`, logo: "http://localhost:5173/logo.jpg" }).then(res => {
            const blob = new Blob([res], { type: 'application/pdf' }); // <- usa res direto
            const url = URL.createObjectURL(blob);
            document.querySelector("#meuIframe").src = url;
        });
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
| `consulta`  | XML de consulta de NFe/NFC-e| ❌ Não |

## 📄 Licença

Este projeto está sob a licença MIT.

## ❤️ Apoie o Projeto
Se esta biblioteca te ajuda no dia a dia e voce quiser apoiar a continuidade do projeto, voce pode contribuir via PIX:

`47506306000188`
