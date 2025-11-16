// src/libs/danfe.ts
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { XMLParser } from "fast-xml-parser";
import JsBarcode from "jsbarcode";
var DANFe = async (data = {}) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@",
    parseTagValue: false
    // Evita conversão automática de valores
  });
  var PDF = {
    doc: await PDFDocument.create(),
    pages: [],
    width: 0,
    height: 0,
    mtBlock: 0,
    barCode: null
  }, isBrowser = typeof window !== "undefined", xml = parser.parse(data.xml || ""), consulta = typeof data.consulta != "undefined" ? parser.parse(data.consulta) : {}, logo = data.logo, imgDemo = data.imgDemo, protNFe = null;
  if (typeof consulta?.retConsSitNFe?.procEventoNFe != "undefined")
    consulta.retConsSitNFe.procEventoNFe = Array.isArray(consulta.retConsSitNFe.procEventoNFe) ? consulta.retConsSitNFe.procEventoNFe : [consulta.retConsSitNFe.procEventoNFe];
  if (xml.nfeProc) {
    xml = xml.nfeProc;
  }
  PDF.pages.push(PDF.doc.addPage());
  PDF.width = PDF.pages[0].getWidth();
  PDF.height = PDF.pages[0].getHeight();
  async function addRet(page, x, y, w, h) {
    page.drawRectangle({
      x: x + 4,
      y: PDF.height - h - (y + 4),
      width: x + w + 8 >= PDF.width ? PDF.width - x - 8 : w,
      height: h,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1
    });
  }
  async function addLTH(page, x, y, h) {
    const startX = Math.max(x, 4);
    const endX = Math.min(x + h, PDF.width - 4);
    const fixedY = PDF.height - y - 4;
    page.drawLine({
      start: { x: startX, y: fixedY },
      end: { x: endX, y: fixedY },
      color: rgb(0, 0, 0),
      thickness: 1,
      dashArray: [5, 3]
    });
  }
  async function addLTV(page, x, y, w) {
    const fixedX = Math.max(4, Math.min(x, PDF.width - 4));
    const startY = Math.max(PDF.height - y - 4, 4);
    const endY = Math.max(PDF.height - (y + w) - 4, 4);
    page.drawLine({
      start: { x: fixedX, y: startY },
      end: { x: fixedX, y: endY },
      color: rgb(0, 0, 0),
      thickness: 1,
      dashArray: [5, 3]
    });
  }
  async function addTXT({
    page,
    text,
    x,
    y,
    maxWidth,
    fontStyle = "normal",
    size = 7,
    lineHeight,
    align = "left",
    cacl = false,
    opacity = 1
  }) {
    let font;
    switch (fontStyle) {
      case "negrito":
        font = await PDF.doc.embedFont(StandardFonts.TimesRomanBold);
        break;
      case "italic":
        font = await PDF.doc.embedFont(StandardFonts.TimesRomanItalic);
        break;
      default:
        font = await PDF.doc.embedFont(StandardFonts.TimesRoman);
    }
    if (maxWidth + x > PDF.width) maxWidth = PDF.width - x - 5;
    const effectiveLineHeight = lineHeight ?? size * 0.9;
    const lines = wrapText(text, maxWidth, font, size);
    if (cacl) return lines.length;
    lines.forEach((line, index) => {
      const textWidth = font.widthOfTextAtSize(line, size);
      let drawX = x + 4;
      if (align === "center") {
        drawX = x + (maxWidth - textWidth) / 2;
      } else if (align === "right") {
        drawX = x + maxWidth - textWidth;
      }
      page.drawText(line, {
        x: drawX,
        y: PDF.height - effectiveLineHeight - (y + 4) - index * effectiveLineHeight,
        size,
        font,
        opacity: opacity || 1
      });
    });
    return lines.length;
  }
  function wrapText(text, maxWidth, font, fontSize) {
    text = (text ?? "").toString();
    const words = text.split(" ");
    const lines = [];
    let line = "";
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = line + word + " ";
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxWidth && line !== "") {
        lines.push(line.trim());
        line = word + " ";
      } else {
        line = testLine;
      }
    }
    if (line.trim() !== "") {
      lines.push(line.trim());
    }
    return lines;
  }
  function embCNPJCPF(valor) {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length === 11) {
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (numeros.length === 14) {
      return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    } else {
      return valor;
    }
  }
  function getResumoPagamentosParentese() {
    const abrev = {
      "01": "Dinheiro",
      "02": "Cheque",
      "03": "C.Cred",
      "04": "C.Deb",
      "05": "Cr\xE9dito",
      "10": "V.Aliment",
      "11": "V.Refei",
      "12": "V.Presente",
      "13": "V.Comb",
      "14": "Dup",
      "15": "Boleto",
      "17": "Pix",
      "18": "Transf.",
      "19": "Fidelidade",
      "99": "Outros"
    };
    const partes = [];
    const pagNode = xml?.NFe?.infNFe?.pag;
    if (pagNode && typeof pagNode.detPag !== "undefined") {
      const dets = Array.isArray(pagNode.detPag) ? pagNode.detPag : [pagNode.detPag];
      const itens = dets.filter((d) => d && d.tPag !== "90" && !Number.isNaN(parseFloat(d?.vPag || "0")) && parseFloat(d?.vPag || "0") !== 0).map((d) => {
        const cod = (d?.tPag ?? "").toString().padStart(2, "0");
        const label = abrev[cod] || `Cod ${cod}`;
        const valor = parseFloat(d?.vPag || "0");
        return { label, valor };
      });
      const agg = {};
      for (const it of itens) {
        agg[it.label] = (agg[it.label] || 0) + it.valor;
      }
      const partesPag = Object.keys(agg).map((k) => `${k} ${agg[k].toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      if (partesPag.length > 0) partes.push(partesPag.join("; "));
    }
    const cobr = xml?.NFe?.infNFe?.cobr;
    if (cobr && typeof cobr.dup !== "undefined") {
      const dups = Array.isArray(cobr.dup) ? cobr.dup : [cobr.dup];
      const qtd = dups.length;
      const total = dups.reduce((s, d) => s + parseFloat(d?.vDup || "0"), 0);
      if (qtd > 0 && !Number.isNaN(total)) {
        partes.push(`Bol/Dup: ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${qtd}x)`);
      }
    }
    return partes.length > 0 ? ` (${partes.join("; ")})` : "";
  }
  async function gerarBlocos() {
    await bloco0();
    await bloco1();
    await bloco2();
    await bloco3();
    await bloco4();
    await bloco5();
    let fim = await bloco6();
    await bloco7();
    await bloco8();
    while (!fim) {
      PDF.mtBlock = 0;
      PDF.pages.push(PDF.doc.addPage());
      await bloco1();
      fim = await bloco6();
    }
    for (const [i, page] of PDF.pages.entries()) {
      addTXT({ page, size: 8, text: `Folha ${i + 1}/${PDF.pages.length}`, x: 235, y: i == 0 ? 142 : 82, maxWidth: PDF.width * 0.19, align: "center", fontStyle: "italic" });
      if (xml.NFe.infNFe.ide.tpAmb == "2") {
        addTXT({ page, size: 30, text: `NFe EMITIDA EM HOMOLOGA\xC7\xC3O SEM VALOR FISCAL`, x: 0, y: PDF.height * 0.5, maxWidth: PDF.width, align: "center", opacity: 0.5, fontStyle: "negrito" });
      }
      if (typeof consulta?.retConsSitNFe?.procEventoNFe != "undefined") {
        for (const event of consulta.retConsSitNFe.procEventoNFe) {
          if (event.retEvento.infEvento.tpEvento == "110111") {
            addTXT({ page, size: 50, text: `CANCELADA`, x: 0, y: PDF.height * 0.6, maxWidth: PDF.width, align: "center", fontStyle: "negrito" });
          }
        }
      }
    }
  }
  async function bloco0(page = PDF.pages[PDF.pages.length - 1]) {
    const resumoPg = getResumoPagamentosParentese();
    const textoReceb = `RECEBEMOS DE ${xml.NFe.infNFe.emit.xNome} OS PRODUTOS E/OU SERVI\xC7OS CONSTANTES DA NOTA FISCAL ELETR\xD4NICA INDICADA ABAIXO. EMISS\xC3O: ${new Date(xml.NFe.infNFe.ide.dhEmi).toLocaleDateString("pt-BR")} VALOR TOTAL: ${parseFloat(xml.NFe.infNFe.total.ICMSTot.vNF).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}${resumoPg}  DESTINAT\xC1RIO: NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL - ${xml.NFe.infNFe.dest.enderDest.xLgr}, ${xml.NFe.infNFe.dest.enderDest.nro} ${xml.NFe.infNFe.dest.enderDest.xBairro} ${xml.NFe.infNFe.dest.enderDest.xMun}-${xml.NFe.infNFe.dest.enderDest.UF}`;
    const linhas = await addTXT({ page, text: textoReceb, x: 2, y: PDF.mtBlock + 2, maxWidth: PDF.width * 0.78, cacl: true });
    const lineH = 7 * 0.9;
    const extraLines = Math.max(0, Math.min(3, linhas) - 2);
    const hReceb = 25 + Math.ceil(extraLines * lineH);
    const hTotal = 50 + (hReceb - 25);
    addRet(page, 0, PDF.mtBlock + 0, PDF.width, hTotal);
    addRet(page, 0, PDF.mtBlock + 0, PDF.width * 0.8, hReceb);
    addRet(page, 0, PDF.mtBlock + 0, PDF.width * 0.8, hReceb);
    addRet(page, 0, PDF.mtBlock + hReceb, PDF.width * 0.8, 25);
    addRet(page, PDF.width * 0.17, PDF.mtBlock + hReceb, PDF.width * 0.63, 25);
    addTXT({ page, text: textoReceb, x: 2, y: PDF.mtBlock + 2, maxWidth: PDF.width * 0.78 });
    addTXT({ page, text: "DATA DE RECEBIMENTO", x: 2, y: PDF.mtBlock + hReceb, maxWidth: PDF.width * 0.78 });
    addTXT({ page, text: "ASSINATURA DO RECEBEDOR", x: PDF.width * 0.173, y: PDF.mtBlock + hReceb, maxWidth: PDF.width });
    addTXT({ page, size: 18, text: "NFe", x: PDF.width * 0.8, y: PDF.mtBlock, maxWidth: PDF.width * 0.8, align: "center", fontStyle: "negrito" });
    addTXT({ page, size: 11, text: `N\xBA. ${xml.NFe.infNFe.ide.nNF.padStart(9, "0")}`, x: PDF.width * 0.8, y: PDF.mtBlock + 20, maxWidth: PDF.width * 0.8, align: "center", fontStyle: "negrito" });
    addTXT({ page, size: 11, text: `S\xE9rie ${xml.NFe.infNFe.ide.serie.padStart(3, "0")}`, x: PDF.width * 0.8, y: PDF.mtBlock + 30, maxWidth: PDF.width * 0.8, align: "center", fontStyle: "negrito" });
    addLTH(page, 0, PDF.mtBlock + (hTotal + 6), PDF.width);
    PDF.mtBlock += hTotal + 10;
  }
  async function bloco1(page = PDF.pages[PDF.pages.length - 1]) {
    addRet(page, 0, PDF.mtBlock, PDF.width, 132);
    addRet(page, 0, PDF.mtBlock, PDF.width, 92);
    addRet(page, 0, PDF.mtBlock, PDF.width, 112);
    addRet(page, PDF.width * 0.401, PDF.mtBlock + 0, PDF.width, 92);
    addRet(page, PDF.width * 0.53, PDF.mtBlock + 38, 16, 20);
    addRet(page, PDF.width * 0.57, PDF.mtBlock + 0, PDF.width, 47);
    addRet(page, PDF.width * 0.57, PDF.mtBlock + 47, PDF.width, 23);
    addRet(page, PDF.width * 0.57, PDF.mtBlock + 70, PDF.width, 22);
    addRet(page, PDF.width * 0.57, PDF.mtBlock + 92, PDF.width, 20);
    addRet(page, PDF.width * 0.745, PDF.mtBlock + 112, PDF.width, 20);
    addRet(page, PDF.width * 0.497, PDF.mtBlock + 112, PDF.width, 20);
    addRet(page, PDF.width * 0.25, PDF.mtBlock + 112, PDF.width, 20);
    addTXT({ page, text: "IDENTIFICA\xC7\xC3O DO EMITENTE", x: 0, y: PDF.mtBlock + 2, maxWidth: PDF.width * 0.4, align: "center" });
    let mt = 0;
    if (typeof logo !== "undefined") {
      await addIMG({ page, img: logo, x: PDF.width * 0.18, y: PDF.mtBlock + 14, h: 37, w: 37 });
      mt += 12;
    }
    let sizeNome = 12;
    while (await addTXT({ page, size: sizeNome, text: `${xml.NFe.infNFe.emit.xNome}`, x: 1, y: PDF.mtBlock + 35 + mt, maxWidth: PDF.width * 0.4, align: "center", fontStyle: "negrito", cacl: true }) >= 2) {
      sizeNome--;
    }
    addTXT({ page, size: sizeNome, text: `${xml.NFe.infNFe.emit.xNome}`, x: 1, y: PDF.mtBlock + 35 + mt, maxWidth: PDF.width * 0.4, align: "center", fontStyle: "negrito" });
    addTXT({ page, size: 9, text: `${xml.NFe.infNFe.emit.enderEmit.xLgr}, N\xB0${xml.NFe.infNFe.emit.enderEmit.nro}`, x: 0, y: PDF.mtBlock + 45 + mt, maxWidth: PDF.width * 0.42, align: "center" });
    addTXT({ page, size: 9, text: `${xml.NFe.infNFe.emit.enderEmit.xBairro} - ${xml.NFe.infNFe.emit.enderEmit.CEP}`, x: 0, y: PDF.mtBlock + 55 + mt, maxWidth: PDF.width * 0.42, align: "center" });
    addTXT({ page, size: 9, text: `${xml.NFe.infNFe.emit.enderEmit.xMun} - ${xml.NFe.infNFe.emit.enderEmit.UF} Fone: ${xml.NFe.infNFe.emit.enderEmit?.fone || ""}`, x: 0, y: PDF.mtBlock + 65 + mt, maxWidth: PDF.width * 0.42, align: "center" });
    addTXT({ page, size: 16, text: "DANFE", x: PDF.width * 0.393, y: PDF.mtBlock + 3, maxWidth: PDF.width * 0.2, align: "center", fontStyle: "negrito" });
    addTXT({ page, size: 8, text: "Documento Auxiliar da Nota Fiscal Eletr\xF4nica", x: PDF.width * 0.4, y: PDF.mtBlock + 19, maxWidth: PDF.width * 0.18, align: "center" });
    addTXT({ page, size: 8, text: "0 - ENTRADA", x: PDF.width * 0.415, y: PDF.mtBlock + 42, maxWidth: PDF.width * 0.19, align: "left" });
    addTXT({ page, size: 8, text: "1 - SA\xCDDA", x: PDF.width * 0.415, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.19, align: "left" });
    addTXT({ page, size: 20, text: xml.NFe.infNFe.ide.tpNF, x: PDF.width * 0.534, y: PDF.mtBlock + 37, maxWidth: PDF.width * 0.19, align: "left" });
    addTXT({ page, size: 10, text: `N\xBA. ${xml.NFe.infNFe.ide.nNF.padStart(9, "0")}`, x: PDF.width * 0.4, y: PDF.mtBlock + 63, maxWidth: PDF.width * 0.19, align: "center", fontStyle: "negrito" });
    addTXT({ page, size: 10, text: `S\xE9rie ${xml.NFe.infNFe.ide.serie.padStart(3, "0")}`, x: PDF.width * 0.398, y: PDF.mtBlock + 72, maxWidth: PDF.width * 0.19, align: "center", fontStyle: "negrito" });
    await addIMG({ page, img: await barCode(), x: PDF.width * 0.595, y: PDF.mtBlock + 6, w: PDF.width * 0.39, h: 44 });
    addTXT({ page, text: "CHAVE DE ACESSO", x: PDF.width * 0.575, y: PDF.mtBlock + 47, maxWidth: PDF.width * 0.19 });
    addTXT({ page, size: 8, text: xml.NFe.infNFe["@Id"].replace("NFe", "").replace(/(\d{4})(?=\d)/g, "$1 "), x: PDF.width * 0.595, y: PDF.mtBlock + 58, maxWidth: PDF.width * 0.39, align: "center", fontStyle: "negrito" });
    addTXT({ page, size: 8, text: "Consulta de autenticidade no portal nacional da NF-e", x: PDF.width * 0.595, y: PDF.mtBlock + 70, maxWidth: PDF.width * 0.39, align: "center" });
    addTXT({ page, size: 8, text: " www.nfe.fazenda.gov.br/portal ou no site da Sefaz Autorizadora", x: PDF.width * 0.595, y: PDF.mtBlock + 81, maxWidth: PDF.width * 0.39, align: "center" });
    addTXT({ page, text: "PROTOCOLO DE AUTORIZA\xC7\xC3O DE USO", x: PDF.width * 0.575, y: PDF.mtBlock + 92, maxWidth: PDF.width * 0.29 });
    addTXT({ page, size: 10, text: `${xml.protNFe?.infProt?.nProt || ""} - ${xml.protNFe?.infProt?.dhRecbto ? new Date(xml.protNFe.infProt.dhRecbto).toLocaleString("pt-BR") : ""}`, x: PDF.width * 0.595, y: PDF.mtBlock + 101, maxWidth: PDF.width * 0.39, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "NATUREZA DA OPERA\xC7\xC3O", x: 3, y: PDF.mtBlock + 92, maxWidth: PDF.width * 0.29 });
    addTXT({ page, size: 10, text: xml.NFe.infNFe.ide.natOp, x: 3, y: PDF.mtBlock + 101, maxWidth: PDF.width * 0.58, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "INSCRI\xC7\xC3O ESTADUAL", x: 3, y: PDF.mtBlock + 112, maxWidth: PDF.width * 0.29 });
    addTXT({ page, size: 10, text: xml.NFe.infNFe.emit.IE || "", x: 3, y: PDF.mtBlock + 121, maxWidth: PDF.width * 0.25, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "INSCRI\xC7\xC3O MUNICIPAL", x: PDF.width * 0.255, y: PDF.mtBlock + 112, maxWidth: PDF.width * 0.29 });
    addTXT({ page, size: 10, text: xml.NFe.infNFe.emit.IM || "", x: PDF.width * 0.355, y: PDF.mtBlock + 121, maxWidth: PDF.width * 0.05, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "INSCRI\xC7\xC3O ESTADUAL DO SUBST. TRIBUT.", x: PDF.width * 0.5, y: PDF.mtBlock + 112, maxWidth: PDF.width * 0.29 });
    addTXT({ page, size: 10, text: xml.NFe.infNFe.emit.IEST || "", x: PDF.width * 0.6, y: PDF.mtBlock + 121, maxWidth: PDF.width * 0.05, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "CNPJ/CPF", x: PDF.width * 0.75, y: PDF.mtBlock + 112, maxWidth: PDF.width * 0.29 });
    addTXT({ page, size: 10, text: embCNPJCPF(xml.NFe.infNFe.emit?.CNPJ || xml.NFe.infNFe.emit?.CPF || ""), x: PDF.width * 0.845, y: PDF.mtBlock + 121, maxWidth: PDF.width * 0.05, align: "center", fontStyle: "negrito" });
    PDF.mtBlock += 133;
  }
  async function barCode() {
    if (PDF.barCode != null) return PDF.barCode;
    const isNode = typeof window === "undefined";
    if (isNode) {
      const { createCanvas } = await import("canvas");
      const canvas = createCanvas(400, 100);
      JsBarcode(canvas, xml.NFe.infNFe["@Id"], {
        format: "CODE128",
        displayValue: false,
        fontSize: 18
      });
      PDF.barCode = canvas.toDataURL("image/png");
      return PDF.barCode;
    } else {
      return new Promise((resolve, reject) => {
        try {
          const canvas = document.createElement("canvas");
          JsBarcode(canvas, xml.NFe.infNFe["@Id"], {
            format: "CODE128",
            displayValue: false,
            fontSize: 18
          });
          PDF.barCode = canvas.toDataURL("image/png");
          resolve(PDF.barCode);
        } catch (err) {
          reject(err);
        }
      });
    }
  }
  async function bloco2(page = PDF.pages[PDF.pages.length - 1]) {
    addRet(page, 0, PDF.mtBlock + 10, PDF.width * 0.603, 20);
    addRet(page, PDF.width * 0.603, PDF.mtBlock + 10, PDF.width * 0.222, 20);
    addRet(page, PDF.width * 0.825, PDF.mtBlock + 10, PDF.width * 0.2, 20);
    addRet(page, PDF.width * 0.665, PDF.mtBlock + 30, PDF.width, 20);
    addRet(page, PDF.width * 0.825, PDF.mtBlock + 50, PDF.width * 0.2, 20);
    addRet(page, PDF.width * 0.665, PDF.mtBlock + 30, PDF.width * 0.16, 40);
    addRet(page, PDF.width * 0.503, PDF.mtBlock + 50, PDF.width * 0.162, 20);
    addRet(page, PDF.width * 0.465, PDF.mtBlock + 50, PDF.width * 0.038, 20);
    addRet(page, PDF.width * 0, PDF.mtBlock + 50, PDF.width * 0.465, 20);
    addRet(page, PDF.width * 0, PDF.mtBlock + 30, PDF.width * 0.465, 20);
    addTXT({ page, text: "DESTINAT\xC1RIO / REMETENTE", x: 3, y: PDF.mtBlock + 2, maxWidth: PDF.width * 0.4, fontStyle: "negrito" });
    addTXT({ page, text: "NOME / RAZ\xC3O SOCIAL", x: 3, y: PDF.mtBlock + 10, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.xNome, x: 3, y: PDF.mtBlock + 20, maxWidth: PDF.width * 0.58, fontStyle: "negrito" });
    addTXT({ page, text: "CNPJ/CPF", x: PDF.width * 0.61, y: PDF.mtBlock + 10, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: embCNPJCPF(xml.NFe.infNFe.dest?.CNPJ || xml.NFe.infNFe.dest?.CPF || ""), x: PDF.width * 0.51, y: PDF.mtBlock + 20, maxWidth: PDF.width * 0.42, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "DATA DA EMISS\xC3O", x: PDF.width * 0.83, y: PDF.mtBlock + 10, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: new Date(xml.NFe.infNFe.ide.dhEmi).toLocaleDateString("pt-BR"), x: PDF.width * 0.83, y: PDF.mtBlock + 20, maxWidth: PDF.width * 0.42, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "ENDERE\xC7O", x: 2, y: PDF.mtBlock + 31, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: `${xml.NFe.infNFe.dest.enderDest.xLgr}, N\xB0 ${xml.NFe.infNFe.dest.enderDest.nro}`, x: 3, y: PDF.mtBlock + 40, maxWidth: PDF.width * 0.42, align: "left", fontStyle: "negrito" });
    addTXT({ page, text: "BAIRRO/DISTRITO", x: PDF.width * 0.47, y: PDF.mtBlock + 31, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.enderDest?.xBairro || "", x: PDF.width * 0.47, y: PDF.mtBlock + 40, maxWidth: PDF.width * 0.21, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "CEP", x: PDF.width * 0.67, y: PDF.mtBlock + 31, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: (xml.NFe.infNFe?.dest?.enderDest?.CEP || "").replace(/^(\d{5})(\d{3})$/, "$1-$2"), x: PDF.width * 0.67, y: PDF.mtBlock + 40, maxWidth: PDF.width * 0.17, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "DATA DA SA\xCDDA/ENTRDA", x: PDF.width * 0.83, y: PDF.mtBlock + 31, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: new Date(xml.NFe.infNFe.ide.dhEmi).toLocaleDateString("pt-BR"), x: PDF.width * 0.83, y: PDF.mtBlock + 40, maxWidth: PDF.width * 0.17, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "MUNICIPIO", x: 2, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: xml.NFe.infNFe.dest?.enderDest?.xMun || "", x: 3, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.42, align: "left", fontStyle: "negrito" });
    addTXT({ page, text: "UF", x: PDF.width * 0.47, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.enderDest?.UF || "", x: PDF.width * 0.473, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.21, align: "left", fontStyle: "negrito" });
    addTXT({ page, text: "FONE/FAX", x: PDF.width * 0.505, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.enderDest?.fone || "", x: PDF.width * 0.505, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.17, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "INSCRI\xC7\xC3O ESTADUAL", x: PDF.width * 0.67, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.IE || "", x: PDF.width * 0.67, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.17, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "HORA DA SA\xCDDA/ENTRDA", x: PDF.width * 0.83, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: new Date(xml.NFe.infNFe.ide.dhEmi).toLocaleTimeString("pt-BR"), x: PDF.width * 0.83, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.17, align: "center", fontStyle: "negrito" });
    PDF.mtBlock += 72;
  }
  async function bloco3(page = PDF.pages[PDF.pages.length - 1]) {
    const pagNode = xml?.NFe?.infNFe?.pag;
    let renderedPayments = false;
    if (pagNode && typeof pagNode.detPag !== "undefined") {
      const dets = Array.isArray(pagNode.detPag) ? pagNode.detPag : [pagNode.detPag];
      const pagamentos = dets.filter((d) => {
        const val = parseFloat(d?.vPag || "0");
        return d && d.tPag !== "90" && !Number.isNaN(val) && val !== 0;
      });
      if (pagamentos.length > 0) {
        addTXT({ page, text: "FORMAS DE PAGAMENTO", x: 3, y: PDF.mtBlock, maxWidth: PDF.width, fontStyle: "negrito" });
        const startY = PDF.mtBlock + 8;
        const rowHeight = 20;
        const groupsPerRow = 4;
        const usableWidth = PDF.width - 8;
        const groupWidth = usableWidth / groupsPerRow;
        const mapa = {
          "01": "Dinheiro",
          "02": "Cheque",
          "03": "Cart\xE3o de Cr\xE9dito",
          "04": "Cart\xE3o de D\xE9bito",
          "05": "Cr\xE9dito Loja",
          "10": "Vale Alimenta\xE7\xE3o",
          "11": "Vale Refei\xE7\xE3o",
          "12": "Vale Presente",
          "13": "Vale Combust\xEDvel",
          "14": "Duplicata Mercantil",
          "15": "Boleto Banc\xE1rio",
          "17": "PIX",
          "18": "Transfer\xEAncia banc\xE1ria, TED, DOC",
          "19": "Programa de fidelidade",
          "99": "Outros"
        };
        const totalRows = Math.ceil(pagamentos.length / groupsPerRow);
        const totalHeight = totalRows * rowHeight;
        addRet(page, 0, startY, PDF.width, totalHeight);
        let row = 0;
        pagamentos.forEach((p, idx) => {
          const col = idx % groupsPerRow;
          if (idx > 0 && col === 0) row++;
          const baseX = groupWidth * col;
          const y = startY + row * rowHeight;
          const codigo = (p?.tPag ?? "").toString().padStart(2, "0");
          const desc = mapa[codigo] || `C\xF3digo ${codigo} (desconhecido)`;
          const valor = parseFloat(p?.vPag || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          addRet(page, baseX, y, groupWidth, rowHeight);
          addTXT({ page, text: desc, x: baseX + 2, y: y + 2, maxWidth: groupWidth - 6, align: "left" });
          addTXT({ page, text: valor, x: baseX + 2, y: y + 11, maxWidth: groupWidth - 6, align: "right", fontStyle: "negrito" });
        });
        if (typeof pagNode.vTroco !== "undefined") {
          PDF.mtBlock += totalHeight + 6;
          const troco = parseFloat(pagNode.vTroco || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          await addLTH(page, 0, PDF.mtBlock + 2, PDF.width);
          addTXT({ page, text: `Troco: ${troco}`, x: 0, y: PDF.mtBlock + 9, maxWidth: PDF.width, align: "center", fontStyle: "negrito" });
          await addLTH(page, 0, PDF.mtBlock + 18, PDF.width);
          PDF.mtBlock += 22;
        } else {
          PDF.mtBlock += totalHeight + 10;
        }
        renderedPayments = true;
      }
    }
    let IndexX = 0, contL = 0;
    if (xml.NFe.infNFe.cobr != void 0) {
      addTXT({ page, text: "FATURA / DUPLICATA", x: 3, y: PDF.mtBlock, maxWidth: PDF.width * 0.25, fontStyle: "negrito" });
      if (Array.isArray(xml.NFe.infNFe.cobr.dup) && xml.NFe.infNFe.cobr.dup.length > 14) {
        addRet(page, PDF.width * IndexX, PDF.mtBlock + 8 + contL * 22, PDF.width, 20);
        addTXT({ page, text: `Existem mais de 14 duplicatas registradas, portanto n\xE3o ser\xE3o exibidas, confira diretamente pelo XML.`, x: 3, y: PDF.mtBlock + 13, maxWidth: PDF.width, align: "center" });
        IndexX += 0.25;
      } else {
        const cobrDup = Array.isArray(xml.NFe.infNFe.cobr.dup) ? xml.NFe.infNFe.cobr.dup : [xml.NFe.infNFe.cobr.dup];
        for (const [index, dup] of cobrDup.entries()) {
          addRet(page, PDF.width * IndexX, PDF.mtBlock + 8 + contL * 22, PDF.width * 0.1428, 20);
          addTXT({ page, text: "Num.", x: PDF.width * IndexX + 1, y: PDF.mtBlock + 8 + contL * 22, maxWidth: PDF.width * 0.1458 });
          addTXT({ page, text: dup.nDup, x: PDF.width * IndexX + 1, y: PDF.mtBlock + 8 + contL * 22, maxWidth: PDF.width * 0.1458, align: "right", fontStyle: "negrito" });
          addTXT({ page, text: "Venc.", x: PDF.width * IndexX + 1, y: PDF.mtBlock + 14 + contL * 22, maxWidth: PDF.width * 0.1458 });
          addTXT({ page, text: new Date(dup.dVenc).toLocaleDateString("pt-BR"), x: PDF.width * IndexX + 1, y: PDF.mtBlock + 14 + contL * 22, maxWidth: PDF.width * 0.1458, align: "right", fontStyle: "negrito" });
          addTXT({ page, text: "Valor", x: PDF.width * IndexX + 1, y: PDF.mtBlock + 20 + contL * 22, maxWidth: PDF.width * 0.1458 });
          addTXT({ page, text: dup.vDup, x: PDF.width * IndexX + 1, y: PDF.mtBlock + 20 + contL * 22, maxWidth: PDF.width * 0.1458, align: "right", fontStyle: "negrito" });
          if (index + 1 < cobrDup.length) {
            if (IndexX + 0.1458 >= 1) {
              IndexX = 0;
              contL++;
            } else {
              IndexX += 0.146;
            }
          }
        }
      }
      PDF.mtBlock += (contL + 1) * 22 + 7;
    } else {
      if (!renderedPayments) {
      }
    }
  }
  async function bloco4(page = PDF.pages[PDF.pages.length - 1]) {
    const ICMS = {
      vBC: "Base Calc. ICMS",
      vICMS: "Valor ICMS",
      vICMSDeson: "ICMS Desonerado",
      vBCST: "Base Calc. ICMS ST",
      vST: "ICMS Subst. Trib.",
      vFCPST: "Valor FCP ST",
      vFCPSTRet: "FCP Retido ST",
      vProd: "Valor Produtos",
      vFrete: "Valor Frete",
      vSeg: "Valor Seguro",
      vDesc: "Valor Desconto",
      vII: "Valor Imp. Import.",
      vIPI: "Valor IPI",
      vIPIDevol: "IPI Devolvido",
      vPIS: "Valor PIS",
      vCOFINS: "Valor COFINS",
      vOutro: "Outras Desp. Acess.",
      vNF: "Valor Total NF-e"
    };
    addTXT({ page, text: "TOTAIS", x: 3, y: PDF.mtBlock, maxWidth: PDF.width * 0.25, fontStyle: "negrito" });
    let nextY = PDF.mtBlock + 8, nextX = 0, limitY = PDF.width - 8;
    for (const key of Object.keys(ICMS)) {
      const valor = xml.NFe.infNFe.total.ICMSTot[key];
      const texto = valor ? parseFloat(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "0,00";
      await addRet(page, limitY * 0.111 * nextX, nextY, limitY * 0.111, 20);
      addTXT({ page, text: ICMS[key], x: 2 + limitY * 0.111 * nextX, y: nextY + 1, maxWidth: limitY * 0.111 });
      addTXT({ page, size: 10, text: texto.replace("R$", ""), x: limitY * 0.111 * nextX, y: nextY + 9, maxWidth: limitY * 0.111, align: "right", fontStyle: "negrito" });
      nextX++;
      if (nextX >= 9) {
        nextX = 0;
        nextY += 20;
      }
    }
    PDF.mtBlock += nextY - PDF.mtBlock + 3;
  }
  async function bloco5(page = PDF.pages[PDF.pages.length - 1]) {
    const transp = xml.NFe.infNFe.transp || {};
    const vol = Array.isArray(transp.vol) ? transp.vol[0] : transp.vol || {};
    const modFreteMap = {
      "0": "0-Emitente",
      "1": "1-Destinat\xE1rio",
      "2": "2-Terceiros",
      "3": "3-Pr\xF3prio por conta do remetente",
      "4": "4-Pr\xF3prio por conta do destinat\xE1rio",
      "9": "9-Sem Transporte"
    };
    addTXT({ page, text: "TRANSPORTADOR / VOLUMES TRANSPORTADOS", x: 3, y: PDF.mtBlock, maxWidth: PDF.width, fontStyle: "negrito" });
    addRet(page, 0, PDF.mtBlock + 8, PDF.width * 0.29, 20);
    addRet(page, PDF.width * 0.29, PDF.mtBlock + 8, PDF.width * 0.15, 20);
    addRet(page, PDF.width * 0.44, PDF.mtBlock + 8, PDF.width * 0.14, 20);
    addRet(page, PDF.width * 0.58, PDF.mtBlock + 8, PDF.width * 0.15, 20);
    addRet(page, PDF.width * 0.73, PDF.mtBlock + 8, PDF.width * 0.04, 20);
    addRet(page, PDF.width * 0.77, PDF.mtBlock + 8, PDF.width, 20);
    addRet(page, PDF.width * 0.77, PDF.mtBlock + 28, PDF.width, 20);
    addRet(page, PDF.width * 0.8, PDF.mtBlock + 48, PDF.width, 20);
    addRet(page, PDF.width * 0.6, PDF.mtBlock + 48, PDF.width, 20);
    addRet(page, PDF.width * 0.44, PDF.mtBlock + 48, PDF.width, 20);
    addRet(page, PDF.width * 0.27, PDF.mtBlock + 48, PDF.width, 20);
    addRet(page, PDF.width * 0.1, PDF.mtBlock + 48, PDF.width, 20);
    addRet(page, 0, PDF.mtBlock + 48, PDF.width, 20);
    addRet(page, 0, PDF.mtBlock + 28, PDF.width * 0.44, 20);
    addRet(page, 0, PDF.mtBlock + 28, PDF.width * 0.73, 20);
    addTXT({ page, text: "NOME / RAZ\xC3O SOCIAL", x: 3, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.29 });
    addTXT({ page, text: transp.transporta?.xNome || "", x: 3, y: PDF.mtBlock + 18, maxWidth: PDF.width * 0.29, fontStyle: "negrito" });
    addTXT({ page, text: "FRETE", x: PDF.width * 0.293, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.15 });
    addTXT({ page, text: modFreteMap[transp.modFrete] || `C\xF3digo ${transp.modFrete || ""}`, x: PDF.width * 0.293, y: PDF.mtBlock + 18, maxWidth: PDF.width * 0.15, fontStyle: "negrito" });
    addTXT({ page, text: "C\xD3DIGO ANTT", x: PDF.width * 0.443, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.15 });
    addTXT({ page, text: transp.veicTransp?.RNTC || "", x: PDF.width * 0.443, y: PDF.mtBlock + 18, maxWidth: PDF.width * 0.15, fontStyle: "negrito" });
    addTXT({ page, text: "PLACA DO VE\xCDCULO", x: PDF.width * 0.583, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.15 });
    addTXT({ page, text: transp.veicTransp?.placa || "", x: PDF.width * 0.583, y: PDF.mtBlock + 18, maxWidth: PDF.width * 0.15, fontStyle: "negrito" });
    addTXT({ page, text: "UF", x: PDF.width * 0.733, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.15 });
    addTXT({ page, text: transp.veicTransp?.UF || "", x: PDF.width * 0.733, y: PDF.mtBlock + 18, maxWidth: PDF.width * 0.15, fontStyle: "negrito" });
    addTXT({ page, text: "CNPJ/CPF", x: PDF.width * 0.773, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.15 });
    addTXT({ page, text: embCNPJCPF(transp.transporta?.CNPJ || transp.transporta?.CPF || ""), x: PDF.width * 0.773, y: PDF.mtBlock + 18, maxWidth: PDF.width * 0.15, fontStyle: "negrito" });
    addTXT({ page, text: "ENDERE\xC7O", x: 3, y: PDF.mtBlock + 29, maxWidth: PDF.width * 0.29 });
    addTXT({ page, text: transp.transporta?.xEnder || "", x: 3, y: PDF.mtBlock + 39, maxWidth: PDF.width * 0.29, fontStyle: "negrito" });
    addTXT({ page, text: "MUNIC\xCDPIO", x: PDF.width * 0.443, y: PDF.mtBlock + 29, maxWidth: PDF.width * 0.29 });
    addTXT({ page, text: transp.transporta?.xMun || "", x: PDF.width * 0.443, y: PDF.mtBlock + 39, maxWidth: PDF.width * 0.29, fontStyle: "negrito" });
    addTXT({ page, text: "UF", x: PDF.width * 0.733, y: PDF.mtBlock + 29, maxWidth: PDF.width * 0.29 });
    addTXT({ page, text: transp.transporta?.UF || "", x: PDF.width * 0.733, y: PDF.mtBlock + 39, maxWidth: PDF.width * 0.29, fontStyle: "negrito" });
    addTXT({ page, text: "INSCRI\xC7\xC3O ESTADUAL", x: PDF.width * 0.773, y: PDF.mtBlock + 29, maxWidth: PDF.width * 0.29 });
    addTXT({ page, text: transp.transporta?.IE || "", x: PDF.width * 0.773, y: PDF.mtBlock + 39, maxWidth: PDF.width * 0.29, fontStyle: "negrito" });
    addTXT({ page, text: "QUANTIDADE", x: 3, y: PDF.mtBlock + 49, maxWidth: PDF.width * 0.29 });
    addTXT({ page, text: vol.qVol || "", x: 3, y: PDF.mtBlock + 59, maxWidth: PDF.width * 0.29, fontStyle: "negrito" });
    addTXT({ page, text: "ESP\xC9CIE", x: PDF.width * 0.102, y: PDF.mtBlock + 49, maxWidth: PDF.width * 0.29 });
    addTXT({ page, text: vol.esp || "", x: PDF.width * 0.102, y: PDF.mtBlock + 59, maxWidth: PDF.width * 0.29, fontStyle: "negrito" });
    addTXT({ page, text: "MARCA", x: PDF.width * 0.273, y: PDF.mtBlock + 49, maxWidth: PDF.width * 0.29 });
    addTXT({ page, text: vol.marca || "", x: PDF.width * 0.273, y: PDF.mtBlock + 59, maxWidth: PDF.width * 0.29, fontStyle: "negrito" });
    addTXT({ page, text: "NUMERA\xC7\xC3O", x: PDF.width * 0.443, y: PDF.mtBlock + 49, maxWidth: PDF.width * 0.29 });
    addTXT({ page, text: vol.nVol || "", x: PDF.width * 0.443, y: PDF.mtBlock + 59, maxWidth: PDF.width * 0.29, fontStyle: "negrito" });
    addTXT({ page, text: "PESO BRUTO", x: PDF.width * 0.603, y: PDF.mtBlock + 49, maxWidth: PDF.width * 0.29 });
    addTXT({ page, text: vol.pesoB || "", x: PDF.width * 0.603, y: PDF.mtBlock + 59, maxWidth: PDF.width * 0.29, fontStyle: "negrito" });
    addTXT({ page, text: "PESO L\xCDQUIDO", x: PDF.width * 0.803, y: PDF.mtBlock + 49, maxWidth: PDF.width * 0.29 });
    addTXT({ page, text: vol.pesoL || "", x: PDF.width * 0.803, y: PDF.mtBlock + 59, maxWidth: PDF.width * 0.29, fontStyle: "negrito" });
    PDF.mtBlock += 70;
  }
  async function bloco6(page = PDF.pages[PDF.pages.length - 1]) {
    xml.NFe.infNFe.det = Array.isArray(xml.NFe.infNFe.det) ? xml.NFe.infNFe.det : [xml.NFe.infNFe.det];
    addTXT({ page, text: "DADOS DOS PRODUTOS / SERVI\xC7OS", x: 3, y: PDF.mtBlock, maxWidth: PDF.width, fontStyle: "negrito" });
    let blockH;
    if (PDF.pages.length == 1) {
      blockH = PDF.height - PDF.mtBlock - 72;
    } else {
      blockH = PDF.height - PDF.mtBlock - 18;
    }
    addRet(page, 0, PDF.mtBlock + 8, PDF.width, blockH);
    addRet(page, 0, PDF.mtBlock + 8, PDF.width, 15);
    const colunas = [0.1, 0.34, 0.403, 0.453, 0.488, 0.525, 0.6, 0.655, 0.712, 0.76, 0.815, 0.875, 0.92, 0.957];
    for (const x of colunas) addLTV(page, PDF.width * x, PDF.mtBlock + 8, blockH);
    addTXT({ page, text: "C\xD3DIGO PRODUTO", x: PDF.width * 3e-3, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.09, align: "center" });
    addTXT({ page, text: "DESCRI\xC7\xC3O DO PRODUTO / SERVI\xC7O", x: PDF.width * 0.1, y: PDF.mtBlock + 12, maxWidth: PDF.width * 0.24, align: "center" });
    addTXT({ page, text: "NCM/SH", x: PDF.width * 0.34, y: PDF.mtBlock + 12, maxWidth: PDF.width * 0.06, align: "center" });
    addTXT({ page, text: "O/CSOSN", x: PDF.width * 0.4, y: PDF.mtBlock + 12, maxWidth: PDF.width * 0.06, align: "center" });
    addTXT({ page, text: "CFOP", x: PDF.width * 0.46, y: PDF.mtBlock + 12, maxWidth: PDF.width * 0.025, align: "center" });
    addTXT({ page, text: "UN", x: PDF.width * 0.495, y: PDF.mtBlock + 12, maxWidth: PDF.width * 0.025, align: "center" });
    addTXT({ page, text: "QUANT.", x: PDF.width * 0.525, y: PDF.mtBlock + 12, maxWidth: PDF.width * 0.07, align: "center" });
    addTXT({ page, text: "VALOR UNIT", x: PDF.width * 0.592, y: PDF.mtBlock + 8.5, maxWidth: PDF.width * 0.07, align: "center" });
    addTXT({ page, text: "VALOR TOTAL", x: PDF.width * 0.65, y: PDF.mtBlock + 8.5, maxWidth: PDF.width * 0.07, align: "center" });
    addTXT({ page, text: "VALOR DESC", x: PDF.width * 0.7, y: PDF.mtBlock + 8.5, maxWidth: PDF.width * 0.07, align: "center" });
    addTXT({ page, text: "B.C\xC1LC ICMS", x: PDF.width * 0.75, y: PDF.mtBlock + 8.5, maxWidth: PDF.width * 0.07, align: "center" });
    addTXT({ page, text: "VALOR ICMS", x: PDF.width * 0.81, y: PDF.mtBlock + 8.5, maxWidth: PDF.width * 0.07, align: "center" });
    addTXT({ page, text: "VALOR IPI", x: PDF.width * 0.862, y: PDF.mtBlock + 8.5, maxWidth: PDF.width * 0.07, align: "center" });
    addTXT({ page, text: "AL\xCDQ. ICMS", x: PDF.width * 0.924, y: PDF.mtBlock + 8.5, maxWidth: PDF.width * 0.03, align: "center" });
    addTXT({ page, text: "AL\xCDQ. IPI", x: PDF.width * 0.961, y: PDF.mtBlock + 8.5, maxWidth: PDF.width * 0.03, align: "center" });
    let line = 23, lLimite = blockH / 7.1, lIndex = 0;
    for (const [iDet, det] of xml.NFe.infNFe.det.entries()) {
      let prod = det.prod;
      prod.xProd = prod.xProd.split("\n").join(" ");
      lIndex += await addTXT({ page, text: prod.xProd, x: 0, y: 0, maxWidth: PDF.width * 0.237, align: "center", cacl: true });
      if (lIndex >= lLimite) {
        xml.NFe.infNFe.det.splice(0, iDet);
        PDF.mtBlock += blockH + 10;
        return false;
      }
      const imposto = det.imposto || {};
      const ICMS = imposto.ICMS?.ICMSSN102 || imposto.ICMS?.ICMS00 || {};
      const IPI = imposto.IPI?.IPITrib || {};
      const fmt = (v) => parseFloat(v || "0.00").toLocaleString("pt-BR", { minimumFractionDigits: 2 });
      const xProdH = await addTXT({ page, text: prod.xProd, x: PDF.width * 0.096, y: PDF.mtBlock + line, maxWidth: PDF.width * 0.237, align: "left" });
      const y = PDF.mtBlock + line + (xProdH - 1) * 2.7;
      addTXT({ page, text: prod.cProd, x: 0, y, maxWidth: PDF.width * 0.1, align: "center" });
      addTXT({ page, text: prod.NCM, x: PDF.width * 0.34, y, maxWidth: PDF.width * 0.061, align: "center" });
      addTXT({ page, text: ICMS.CSOSN || ICMS.CST || "", x: PDF.width * 0.398, y, maxWidth: PDF.width * 0.061, align: "center" });
      addTXT({ page, text: prod.CFOP, x: PDF.width * 0.44, y, maxWidth: PDF.width * 0.061, align: "center" });
      addTXT({ page, text: prod.uCom, x: PDF.width * 0.476, y, maxWidth: PDF.width * 0.061, align: "center" });
      addTXT({ page, text: fmt(prod.qCom), x: PDF.width * 0.533, y, maxWidth: PDF.width * 0.061, align: "center" });
      addTXT({ page, text: fmt(prod.vUnCom), x: PDF.width * 0.597, y, maxWidth: PDF.width * 0.061, align: "center" });
      addTXT({ page, text: fmt(prod.vProd), x: PDF.width * 0.655, y, maxWidth: PDF.width * 0.061, align: "center" });
      addTXT({ page, text: fmt(prod.vDesc), x: PDF.width * 0.705, y, maxWidth: PDF.width * 0.061, align: "center" });
      addTXT({ page, text: fmt(prod.vBC), x: PDF.width * 0.756, y, maxWidth: PDF.width * 0.061, align: "center" });
      addTXT({ page, text: fmt(prod.vICMS), x: PDF.width * 0.816, y, maxWidth: PDF.width * 0.061, align: "center" });
      addTXT({ page, text: fmt(prod.vIPI), x: PDF.width * 0.868, y, maxWidth: PDF.width * 0.061, align: "center" });
      addTXT({ page, text: fmt(ICMS.pICMS), x: PDF.width * 0.908, y, maxWidth: PDF.width * 0.061, align: "center" });
      addTXT({ page, text: fmt(IPI.pIPI), x: PDF.width * 0.954, y, maxWidth: PDF.width * 0.061, align: "center" });
      line += xProdH * 6.9;
    }
    PDF.mtBlock += blockH + 10;
    return true;
  }
  async function bloco7(page = PDF.pages[PDF.pages.length - 1]) {
    addTXT({ page, text: "DADOS ADICIONAIS", x: 3, y: PDF.mtBlock, maxWidth: PDF.width, fontStyle: "negrito" });
    addRet(page, 0, PDF.mtBlock + 8, PDF.width, 40);
    addRet(page, 0, PDF.mtBlock + 8, PDF.width * 0.65, 40);
    addTXT({ page, text: "INFORMA\xC7\xD5ES COMPLEMENTARES", x: 3, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.5, align: "left", fontStyle: "negrito" });
    addTXT({ page, text: "RESERVADO AO FISCO", x: PDF.width * 0.652, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.5, align: "left", fontStyle: "negrito" });
    if (await addTXT({ page, text: xml.NFe.infNFe.infAdic?.infCpl || "", x: 3, y: PDF.mtBlock + 14, maxWidth: PDF.width * 0.65, align: "left", cacl: true }) >= 5) {
      addTXT({ page, text: xml.NFe.infNFe.infAdic?.infCpl.slice(0, 600) || "", x: 3, y: PDF.mtBlock + 14, maxWidth: PDF.width * 0.65, align: "left" });
    } else {
      addTXT({ page, text: xml.NFe.infNFe.infAdic?.infCpl || "", x: 3, y: PDF.mtBlock + 14, maxWidth: PDF.width * 0.65, align: "left" });
    }
    ;
    PDF.mtBlock += 40;
  }
  async function bloco8(page = PDF.pages[PDF.pages.length - 1]) {
    const agora = /* @__PURE__ */ new Date();
    const dataFormatada = agora.toLocaleDateString("pt-BR");
    const horaFormatada = agora.toLocaleTimeString("pt-BR");
    const textoEsquerda = `Impresso em ${dataFormatada} \xE0s ${horaFormatada}. ${xml.NFe.infNFe?.infRespTec?.xContato || ""}`;
    addTXT({ page, text: textoEsquerda, x: 3, y: PDF.mtBlock + 8, maxWidth: PDF.width, align: "left" });
    addTXT({ page, text: "Powered by @node-sped-pdf", x: 3, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.985, align: "right", fontStyle: "italic" });
  }
  async function addIMG({
    page,
    img,
    x,
    y,
    h,
    w
  }) {
    if (typeof img != void 0) {
      if (img.includes("http") || img.includes("wwww"))
        img = await fetch(img || "").then((response) => response.blob()).then((blob) => blob2base64(blob));
      const bytes = Uint8Array.from(atob(img.split(",")[1]), (c) => c.charCodeAt(0));
      const isPng = img?.startsWith("data:image/png");
      const image = isPng ? await PDF.doc.embedPng(bytes) : await PDF.doc.embedJpg(bytes);
      await page.drawImage(image, {
        x,
        y: PDF.height - y - h,
        // Corrige porque pdf-lib desenha do canto inferior da imagem
        width: w,
        height: h
      });
    }
  }
  async function blob2base64(blobOrBuffer) {
    const isBrowser2 = typeof window !== "undefined" && typeof window.FileReader !== "undefined";
    if (isBrowser2) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blobOrBuffer);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
      });
    } else {
      try {
        let buffer;
        if (blobOrBuffer instanceof Blob) {
          const arrayBuffer = await blobOrBuffer.arrayBuffer();
          buffer = Buffer.from(arrayBuffer);
        } else if (Buffer.isBuffer(blobOrBuffer)) {
          buffer = blobOrBuffer;
        } else {
          buffer = Buffer.from(blobOrBuffer);
        }
        return buffer.toString("base64");
      } catch (err) {
        throw new Error(`Falha ao converter: ${err}`);
      }
    }
  }
  async function blocoDEMO(page = PDF.pages[PDF.pages.length - 1]) {
    imgDemo = await fetch(imgDemo || "").then((response) => response.blob()).then((blob) => blob2base64(blob));
    const base64Data = imgDemo?.split(",")[1];
    const bytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const isPng = imgDemo?.startsWith("data:image/png");
    const image = isPng ? await PDF.doc.embedPng(bytes) : await PDF.doc.embedJpg(bytes);
    page.drawImage(image, {
      x: 0,
      y: 0,
      // Corrige porque pdf-lib desenha do canto inferior da imagem
      width: PDF.width,
      height: PDF.height
    });
  }
  return new Promise(async (resolve, reject) => {
    await gerarBlocos();
    resolve(await PDF.doc.save());
  });
};

// src/libs/danfce.ts
import { PDFDocument as PDFDocument2, StandardFonts as StandardFonts2, rgb as rgb2 } from "pdf-lib";
import { XMLParser as XMLParser2 } from "fast-xml-parser";
import qrcode from "qrcode";
var DANFCe = async (data = {}) => {
  const parser = new XMLParser2({
    ignoreAttributes: false,
    attributeNamePrefix: "@",
    parseTagValue: false
    // Evita conversão automática de valores
  });
  var PDF = {
    doc: await PDFDocument2.create(),
    pages: [],
    width: 0,
    height: 0,
    mtBlock: 0,
    barCode: null
  }, isBrowser = typeof window !== "undefined", xml = parser.parse(data.xml || ""), xmlRes = data.xmlRes, logo = data.logo, imgDemo = data.imgDemo, extras = data.extras || [];
  PDF.pages.push(PDF.doc.addPage([
    230,
    await bloco0(null) + await bloco1(null) + await bloco2(null) + await bloco3(null) + await bloco4(null)
  ]));
  PDF.width = PDF.pages[0].getWidth();
  PDF.height = PDF.pages[0].getHeight();
  async function addRet(page, x, y, w, h) {
    page.drawRectangle({
      x: x + 4,
      y: PDF.height - h - (y + 4),
      width: x + w + 8 >= PDF.width ? PDF.width - x - 8 : w,
      height: h,
      borderColor: rgb2(0, 0, 0),
      borderWidth: 1
    });
  }
  async function addLTH(page, x, y, h) {
    const startX = Math.max(x, 4);
    const endX = Math.min(x + h, PDF.width - 4);
    const fixedY = PDF.height - y - 4;
    page.drawLine({
      start: { x: startX, y: fixedY },
      end: { x: endX, y: fixedY },
      color: rgb2(0, 0, 0),
      thickness: 1,
      dashArray: [5, 3]
    });
  }
  async function addLTV(page, x, y, w) {
    const fixedX = Math.max(4, Math.min(x, PDF.width - 4));
    const startY = Math.max(PDF.height - y - 4, 4);
    const endY = Math.max(PDF.height - (y + w) - 4, 4);
    page.drawLine({
      start: { x: fixedX, y: startY },
      end: { x: fixedX, y: endY },
      color: rgb2(0, 0, 0),
      thickness: 1,
      dashArray: [5, 3]
    });
  }
  async function addTXT({
    page,
    text,
    x,
    y,
    maxWidth,
    fontStyle = "normal",
    size = 7,
    lineHeight,
    align = "left",
    cacl = false
  }) {
    let font;
    switch (fontStyle) {
      case "negrito":
        font = await PDF.doc.embedFont(StandardFonts2.TimesRomanBold);
        break;
      case "italic":
        font = await PDF.doc.embedFont(StandardFonts2.TimesRomanItalic);
        break;
      default:
        font = await PDF.doc.embedFont(StandardFonts2.TimesRoman);
    }
    if (maxWidth + x > PDF.width) maxWidth = PDF.width - x - 2;
    const effectiveLineHeight = lineHeight ?? size * 0.9;
    const lines = wrapText(text, maxWidth, font, size);
    if (cacl) return lines.length;
    lines.forEach((line, index) => {
      const textWidth = font.widthOfTextAtSize(line, size);
      let drawX = x + 4;
      if (align === "center") {
        drawX = x + (maxWidth - textWidth) / 2;
      } else if (align === "right") {
        drawX = x + maxWidth - textWidth;
      }
      page.drawText(line, {
        x: drawX,
        y: PDF.height - effectiveLineHeight - (y + 4) - index * effectiveLineHeight,
        size,
        font
      });
    });
    return lines.length;
  }
  function wrapText(text, maxWidth, font, fontSize) {
    const words = text.split(" ");
    const lines = [];
    let line = "";
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = line + word + " ";
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxWidth && line !== "") {
        lines.push(line.trim());
        line = word + " ";
      } else {
        line = testLine;
      }
    }
    if (line.trim() !== "") {
      lines.push(line.trim());
    }
    return lines;
  }
  async function gerarBlocos() {
    await bloco0();
    await bloco1();
    await bloco2();
    await bloco3();
    await bloco4();
  }
  async function bloco0(page = PDF.pages[PDF.pages.length - 1]) {
    if (!page) return 74;
    let me = 0;
    if (typeof logo !== "undefined") {
      await addIMG({ page, img: logo, x: 3, y: PDF.mtBlock + 3, h: 60, w: 60 });
      me += 62;
    }
    const emit = xml?.NFe?.infNFe?.emit || {};
    const enderEmit = emit.enderEmit || {};
    let line = await addTXT({
      page,
      text: `${emit.xNome || "Emitente desconhecido"}`,
      x: 1 + me,
      y: PDF.mtBlock + 5,
      maxWidth: PDF.width,
      align: "center",
      fontStyle: "negrito"
    });
    PDF.mtBlock = (line - 1) * 2.7 + 10;
    await addTXT({
      page,
      text: `CNPJ: ${emit.CNPJ || "N/D"} - I.E.: ${emit.IE || "N/D"}`,
      x: 1 + me,
      y: PDF.mtBlock + 5,
      maxWidth: PDF.width,
      align: "center"
    });
    await addTXT({
      page,
      text: `${enderEmit.xLgr || "Logradouro desconhecido"}, N\xB0${enderEmit.nro || "S/N"}`,
      x: 0 + me,
      y: PDF.mtBlock + 13,
      maxWidth: PDF.width,
      align: "center"
    });
    await addTXT({
      page,
      text: `${enderEmit.xBairro || "Bairro N/D"} - ${enderEmit.CEP || "CEP N/D"}`,
      x: 0 + me,
      y: PDF.mtBlock + 20,
      maxWidth: PDF.width,
      align: "center"
    });
    await addTXT({
      page,
      text: `${enderEmit.xMun || "Cidade N/D"} - ${enderEmit.UF || "UF"} Fone: ${enderEmit.fone || "N/D"}`,
      x: 0 + me,
      y: PDF.mtBlock + 27,
      maxWidth: PDF.width,
      align: "center"
    });
    addLTH(page, 0, PDF.mtBlock + 55, PDF.width);
    await addTXT({
      page,
      text: `DOCUMENTO AUXILIAR DA NOTA FISCAL DE CONSUMIDOR ELETR\xD4NICA`,
      x: 0,
      y: PDF.mtBlock + 57,
      maxWidth: PDF.width,
      align: "center",
      fontStyle: "negrito"
    });
    addLTH(page, 0, PDF.mtBlock + 72, PDF.width);
    PDF.mtBlock += 74;
    return 1;
  }
  async function bloco1(page = PDF.pages[PDF.pages.length - 1]) {
    const produtos = Array.isArray(xml?.NFe?.infNFe?.det) ? xml.NFe.infNFe.det : xml?.NFe?.infNFe?.det ? [xml.NFe.infNFe.det] : [];
    if (page == null) {
      let lIndex = 0;
      for (const det of produtos) {
        const prod = det?.prod || {};
        const text = prod.xProd || "";
        const wrappedLines = wrapText(
          text,
          230 * 0.42,
          await PDF.doc.embedFont(StandardFonts2.TimesRoman),
          7
        );
        lIndex += wrappedLines.length;
      }
      return 24 + lIndex * 10;
    } else {
      let line = 7, lIndex = 0;
      addTXT({ page, text: `CODIGO | DESCRI\xC7\xC3O`, x: PDF.width * 0, y: PDF.mtBlock, maxWidth: PDF.width * 0.5, align: "left" });
      addTXT({ page, text: `QTDE | UN | VL. UNIT | VL. TOTAL`, x: 0, y: PDF.mtBlock, maxWidth: PDF.width * 0.98, align: "right" });
      for (const det of produtos) {
        const prod = det?.prod || {};
        const fmt = (v) => parseFloat(v || "0.00").toLocaleString("pt-BR", {
          minimumFractionDigits: 2
        });
        const xProd = `${prod.cProd} | ${prod.xProd}`;
        const xProdH = await addTXT({
          page,
          text: xProd,
          x: 0,
          y: PDF.mtBlock + line,
          maxWidth: PDF.width * 0.5,
          align: "left"
        });
        const y = PDF.mtBlock + line + (xProdH - 1) * 2.7;
        addTXT({
          page,
          text: `${fmt(prod.qCom)} | ${prod.uCom || "UN"} | ${fmt(prod.vUnCom)} | ${fmt(prod.vProd)}`,
          x: 0,
          y,
          maxWidth: PDF.width * 0.98,
          align: "right"
        });
        line += xProdH * 6.9;
        lIndex += xProdH;
      }
      addLTH(page, 0, 7 + PDF.mtBlock + lIndex * 10, PDF.width);
      PDF.mtBlock += 8 + lIndex * 10;
      return 1;
    }
  }
  async function bloco2(page = PDF.pages[PDF.pages.length - 1]) {
    if (!page) {
      const pag2 = xml?.NFe?.infNFe?.pag || {};
      const detPag2 = Array.isArray(pag2.detPag) ? pag2.detPag : [pag2.detPag];
      return 40 + detPag2.length * 7;
    }
    ;
    const total = xml?.NFe?.infNFe?.total?.ICMSTot || {};
    const pag = xml?.NFe?.infNFe?.pag || {};
    const detPag = Array.isArray(pag.detPag) ? pag.detPag : [pag.detPag];
    const vTroco = parseFloat(pag.vTroco || "0.00");
    const qtdItens = Array.isArray(xml?.NFe?.infNFe?.det) ? xml.NFe.infNFe.det.length : xml?.NFe?.infNFe?.det ? 1 : 0;
    const fmt = (v) => parseFloat(v || "0.00").toLocaleString("pt-BR", { minimumFractionDigits: 2 });
    await addTXT({ page, text: `Qtde. Total de Itens`, x: 0, y: PDF.mtBlock, maxWidth: PDF.width, align: "left" });
    await addTXT({ page, text: `${qtdItens}`, x: 0, y: PDF.mtBlock, maxWidth: PDF.width - 3, align: "right" });
    await addTXT({ page, text: `Valor Total R$`, x: 0, y: PDF.mtBlock + 7, maxWidth: PDF.width, align: "left" });
    await addTXT({ page, text: `${fmt(total.vProd)}`, x: 0, y: PDF.mtBlock + 7, maxWidth: PDF.width - 3, align: "right" });
    await addTXT({ page, text: `Valor a Pagar R$`, x: 0, y: PDF.mtBlock + 14, maxWidth: PDF.width, align: "left" });
    await addTXT({ page, text: `${fmt(total.vNF)}`, x: 0, y: PDF.mtBlock + 14, maxWidth: PDF.width - 3, align: "right" });
    await addTXT({ page, text: `FORMAS PAGAMENTOS`, x: 0, y: PDF.mtBlock + 21, maxWidth: PDF.width, align: "left", fontStyle: "negrito" });
    await addTXT({ page, text: `VALOR PAGO`, x: 0, y: PDF.mtBlock + 21, maxWidth: PDF.width - 3, align: "right", fontStyle: "negrito" });
    let linhaY = PDF.mtBlock + 28;
    const tPagMap = {
      "01": "Dinheiro",
      "02": "Cheque",
      "03": "Cart\xE3o de Cr\xE9dito",
      "04": "Cart\xE3o de D\xE9bito",
      "05": "Cr\xE9dito Loja",
      "10": "Vale Alimenta\xE7\xE3o",
      "11": "Vale Refei\xE7\xE3o",
      "12": "Vale Presente",
      "13": "Vale Combust\xEDvel",
      "15": "Boleto Banc\xE1rio",
      "16": "Dep\xF3sito Banc\xE1rio",
      "17": "Pagamento Instant\xE2neo (PIX)",
      "18": "Transfer\xEAncia banc\xE1ria, Carteira Digital",
      "19": "Programa de fidelidade",
      "90": "Sem pagamento",
      "99": "Outros"
    };
    for (const pagItem of detPag) {
      if (!pagItem) continue;
      const forma = tPagMap[pagItem.tPag] || "Forma desconhecida";
      const valor = fmt(pagItem.vPag);
      await addTXT({ page, text: forma.toUpperCase(), x: 0, y: linhaY, maxWidth: PDF.width, align: "left" });
      await addTXT({ page, text: valor, x: 0, y: linhaY, maxWidth: PDF.width - 3, align: "right" });
      linhaY += 7;
    }
    await addTXT({ page, text: `TROCO`, x: 0, y: linhaY, maxWidth: PDF.width, align: "left" });
    await addTXT({ page, text: `${fmt(vTroco)}`, x: 0, y: linhaY, maxWidth: PDF.width - 3, align: "right" });
    addLTH(page, 0, linhaY + 8, PDF.width);
    PDF.mtBlock = linhaY + 9;
    return 1;
  }
  async function bloco3(page = PDF.pages[PDF.pages.length - 1]) {
    if (!page) {
      let marg = 0;
      const dest2 = xml?.NFe?.infNFe.dest || {};
      if (Object.keys(dest2).length > 0) {
        marg += 7;
        if (typeof dest2.enderDest != null) {
          marg += 7;
        }
      }
      return 195 + marg;
    }
    ;
    const infNFe = xml?.NFe?.infNFe || {};
    const supl = xml?.NFe?.infNFeSupl || {};
    const ide = infNFe.ide || {};
    const dest = infNFe.dest || {};
    const dhEmi = ide.dhEmi ? new Date(ide.dhEmi) : /* @__PURE__ */ new Date();
    const dataFormatada = dhEmi.toLocaleDateString("pt-BR");
    const horaFormatada = dhEmi.toLocaleTimeString("pt-BR");
    const chave = infNFe["@Id"]?.replace("NFe", "") || "00000000000000000000000000000000000000000000";
    const chaveFormatada = chave.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    const protocolo = infNFe.procEmi === "0" ? "Protocolo n\xE3o informado" : "Protocolo de Autoriza\xE7\xE3o 000000000000000";
    const dataAut = `Data de Autoriza\xE7\xE3o ${dataFormatada} ${horaFormatada}`;
    const serie = ide.serie || "0";
    const nNF = ide.nNF || "0";
    const cpf = dest?.CPF ? `CPF: ${dest.CPF}` : "N\xC3O INFORMADO";
    const nomeDest = dest?.xNome || null;
    const enderDest = dest?.enderDest || null;
    const endereco = enderDest ? `${enderDest.xLgr || ""}, ${enderDest.nro || "S/N"}, ${enderDest.xBairro || ""}, ${enderDest.xMun || ""}`.toUpperCase() : null;
    const qrCode = supl.qrCode || "http://www.sefaz.mt.gov.br/nfce/consultanfce";
    await addTXT({ page, text: `Consulte pela Chave de Acesso em`, x: 0, y: PDF.mtBlock, maxWidth: PDF.width, align: "center", fontStyle: "negrito" });
    await addTXT({ page, text: `www.sefaz.mt.gov.br/nfce/consulta`, x: 0, y: PDF.mtBlock + 7, maxWidth: PDF.width, align: "center" });
    await addTXT({ page, text: chaveFormatada, x: 0, y: PDF.mtBlock + 14, maxWidth: PDF.width, align: "center" });
    await addTXT({ page, text: `CONSUMIDOR - ${cpf}`, x: 0, y: PDF.mtBlock + 21, maxWidth: PDF.width, align: "center", fontStyle: "negrito" });
    PDF.mtBlock += 21;
    if (nomeDest) {
      await addTXT({ page, text: nomeDest, x: 0, y: PDF.mtBlock + 28, maxWidth: PDF.width, align: "center", fontStyle: "negrito" });
      PDF.mtBlock += 7;
    }
    if (endereco) {
      await addTXT({ page, text: endereco, x: 0, y: PDF.mtBlock + 7, maxWidth: PDF.width, align: "center", fontStyle: "negrito" });
      PDF.mtBlock += 7;
    }
    await addTXT({
      page,
      text: `NFC-e n. ${nNF} Serie ${serie} Hs ${dataFormatada} ${horaFormatada}`,
      x: 0,
      y: PDF.mtBlock + 7,
      maxWidth: PDF.width,
      align: "center",
      fontStyle: "negrito"
    });
    const qrCodeDataURL = await qrcode.toDataURL(qrCode);
    await addIMG({
      page,
      img: qrCodeDataURL,
      x: PDF.width / 2 - 75,
      y: PDF.mtBlock + 25,
      w: 150,
      h: 150
    });
    await addTXT({ page, text: protocolo, x: 0, y: PDF.mtBlock + 14, maxWidth: PDF.width, align: "center", fontStyle: "negrito" });
    await addTXT({ page, text: dataAut, x: 0, y: PDF.mtBlock + 21, maxWidth: PDF.width, align: "center", fontStyle: "negrito" });
    await addTXT({
      page,
      text: `Tributos Totais incidentes (Lei Federal 12.741/2012) - Total R$ 0,00 0,00% - Federal 0,00% - Estadual 0,00% - Municipal 0,00%`,
      x: 0,
      y: PDF.mtBlock + 161,
      maxWidth: PDF.width - 3,
      align: "center"
    });
    PDF.mtBlock += 169;
    return 1;
  }
  async function bloco4(page = PDF.pages[PDF.pages.length - 1]) {
    if (page == null) {
      let marg = 0;
      if (typeof extras != "undefined") {
        marg = extras?.length / 2;
        marg = Math.round(marg);
      }
      return marg * 7;
    } else {
      addLTH(page, 0, 7 + PDF.mtBlock, PDF.width);
      return 1;
    }
  }
  async function addIMG({
    page,
    img,
    x,
    y,
    h,
    w
  }) {
    if (typeof img != void 0) {
      if (img.includes("http") || img.includes("wwww"))
        img = await fetch(img || "").then((response) => response.blob()).then((blob) => blob2base64(blob));
      const bytes = Uint8Array.from(atob(img.split(",")[1]), (c) => c.charCodeAt(0));
      const isPng = img?.startsWith("data:image/png");
      const image = isPng ? await PDF.doc.embedPng(bytes) : await PDF.doc.embedJpg(bytes);
      await page.drawImage(image, {
        x,
        y: PDF.height - y - h,
        // Corrige porque pdf-lib desenha do canto inferior da imagem
        width: w,
        height: h
      });
    }
  }
  function blob2base64(blobOrBuffer) {
    return new Promise((resolve, reject) => {
      const isBrowser2 = typeof window !== "undefined" && typeof window.FileReader !== "undefined";
      if (isBrowser2) {
        const reader = new FileReader();
        reader.readAsDataURL(blobOrBuffer);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
      } else {
        try {
          const buffer = Buffer.isBuffer(blobOrBuffer) ? blobOrBuffer : Buffer.from(blobOrBuffer);
          const base64 = `data:application/octet-stream;base64,${buffer.toString("base64")}`;
          resolve(base64);
        } catch (err) {
          reject(err);
        }
      }
    });
  }
  async function blocoDEMO(page = PDF.pages[PDF.pages.length - 1]) {
    imgDemo = await fetch(imgDemo || "").then((response) => response.blob()).then((blob) => blob2base64(blob));
    const base64Data = imgDemo?.split(",")[1];
    const bytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const isPng = imgDemo?.startsWith("data:image/png");
    const image = isPng ? await PDF.doc.embedPng(bytes) : await PDF.doc.embedJpg(bytes);
    page.drawImage(image, {
      x: 0,
      y: 0,
      // Corrige porque pdf-lib desenha do canto inferior da imagem
      width: PDF.width,
      height: PDF.height
    });
  }
  return new Promise(async (resolve, reject) => {
    await gerarBlocos();
    resolve(await PDF.doc.save());
  });
};

// src/libs/dav55.ts
import { PDFDocument as PDFDocument3, StandardFonts as StandardFonts3, rgb as rgb3 } from "pdf-lib";
import { XMLParser as XMLParser3 } from "fast-xml-parser";
import JsBarcode2 from "jsbarcode";
var DAV55 = async (data = { xml: {} }) => {
  const parser = new XMLParser3({
    ignoreAttributes: false,
    attributeNamePrefix: "@",
    parseTagValue: false
    // Evita conversão automática de valores
  });
  var PDF = {
    doc: await PDFDocument3.create(),
    pages: [],
    width: 0,
    height: 0,
    mtBlock: 0,
    barCode: null
  }, isBrowser = typeof window !== "undefined", xml = data.xml, logo = data.logo, imgDemo = data.imgDemo, orcamento = data.orcamento || false;
  PDF.pages.push(PDF.doc.addPage());
  PDF.width = PDF.pages[0].getWidth();
  PDF.height = PDF.pages[0].getHeight();
  async function addRet(page, x, y, w, h) {
    page.drawRectangle({
      x: x + 4,
      y: PDF.height - h - (y + 4),
      width: x + w + 8 >= PDF.width ? PDF.width - x - 8 : w,
      height: h,
      borderColor: rgb3(0, 0, 0),
      borderWidth: 1
    });
  }
  async function addLTH(page, x, y, h) {
    const startX = Math.max(x, 4);
    const endX = Math.min(x + h, PDF.width - 4);
    const fixedY = PDF.height - y - 4;
    page.drawLine({
      start: { x: startX, y: fixedY },
      end: { x: endX, y: fixedY },
      color: rgb3(0, 0, 0),
      thickness: 1,
      dashArray: [5, 3]
    });
  }
  async function addLTV(page, x, y, w) {
    const fixedX = Math.max(4, Math.min(x, PDF.width - 4));
    const startY = Math.max(PDF.height - y - 4, 4);
    const endY = Math.max(PDF.height - (y + w) - 4, 4);
    page.drawLine({
      start: { x: fixedX, y: startY },
      end: { x: fixedX, y: endY },
      color: rgb3(0, 0, 0),
      thickness: 1,
      dashArray: [5, 3]
    });
  }
  async function addTXT({
    page,
    text,
    x,
    y,
    maxWidth,
    fontStyle = "normal",
    size = 7,
    lineHeight,
    align = "left",
    cacl = false,
    opacity = 1
  }) {
    let font;
    switch (fontStyle) {
      case "negrito":
        font = await PDF.doc.embedFont(StandardFonts3.TimesRomanBold);
        break;
      case "italic":
        font = await PDF.doc.embedFont(StandardFonts3.TimesRomanItalic);
        break;
      default:
        font = await PDF.doc.embedFont(StandardFonts3.TimesRoman);
    }
    if (maxWidth + x > PDF.width) maxWidth = PDF.width - x - 2;
    const effectiveLineHeight = lineHeight ?? size * 0.9;
    const lines = wrapText(`${text}`, maxWidth, font, size);
    if (cacl) return lines.length;
    lines.forEach((line, index) => {
      const textWidth = font.widthOfTextAtSize(line, size);
      let drawX = x + 4;
      if (align === "center") {
        drawX = x + (maxWidth - textWidth) / 2;
      } else if (align === "right") {
        drawX = x + maxWidth - textWidth;
      }
      page.drawText(line, {
        x: drawX,
        y: PDF.height - effectiveLineHeight - (y + 4) - index * effectiveLineHeight,
        size,
        font,
        opacity: opacity || 1
      });
    });
    return lines.length;
  }
  function wrapText(text, maxWidth, font, fontSize) {
    const words = text.split(" ");
    const lines = [];
    let line = "";
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = line + word + " ";
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth > maxWidth && line !== "") {
        lines.push(line.trim());
        line = word + " ";
      } else {
        line = testLine;
      }
    }
    if (line.trim() !== "") {
      lines.push(line.trim());
    }
    return lines;
  }
  function embCNPJCPF(valor) {
    const numeros = (valor || "").replace(/\D/g, "");
    if (numeros.length === 11) {
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (numeros.length === 14) {
      return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    } else {
      return valor;
    }
  }
  async function gerarBlocos() {
    await bloco1();
    if (xml.tagDetPag.length > 0)
      await bloco3();
    await bloco4();
    let fim = await bloco6();
    await bloco7();
    await bloco8();
    while (!fim) {
      PDF.mtBlock = 0;
      PDF.pages.push(PDF.doc.addPage());
      await bloco1();
      fim = await bloco6();
    }
    for (const [i, page] of PDF.pages.entries()) {
      addTXT({ page, size: 8, text: `Folha ${i + 1}/${PDF.pages.length}`, x: 235, y: 80, maxWidth: PDF.width * 0.19, align: "center", fontStyle: "italic" });
      if (orcamento)
        addTXT({ page, size: 60, text: `OR\xC7AMENTO`, x: 0, y: PDF.height * 0.6, maxWidth: PDF.width, align: "center", fontStyle: "negrito", opacity: 0.3 });
    }
  }
  async function bloco1(page = PDF.pages[PDF.pages.length - 1]) {
    addRet(page, 0, PDF.mtBlock, PDF.width, 132);
    addRet(page, 0, PDF.mtBlock, PDF.width, 92);
    addRet(page, 0, PDF.mtBlock, PDF.width, 112);
    addRet(page, PDF.width * 0.401, PDF.mtBlock + 0, PDF.width, 92);
    addRet(page, PDF.width * 0.53, PDF.mtBlock + 38, 16, 20);
    addRet(page, PDF.width * 0.57, PDF.mtBlock + 0, PDF.width, 92);
    addRet(page, PDF.width * 0.57, PDF.mtBlock + 92, PDF.width, 20);
    addRet(page, PDF.width * 0.745, PDF.mtBlock + 112, PDF.width, 20);
    addRet(page, PDF.width * 0.497, PDF.mtBlock + 112, PDF.width, 20);
    addRet(page, PDF.width * 0.25, PDF.mtBlock + 112, PDF.width, 20);
    addTXT({ page, text: "IDENTIFICA\xC7\xC3O DO EMITENTE", x: 0, y: PDF.mtBlock + 2, maxWidth: PDF.width * 0.4, align: "center" });
    addTXT({ page, text: "IDENTIFICA\xC7\xC3O DO DESTINATARIO", x: PDF.width * 0.6, y: PDF.mtBlock + 2, maxWidth: PDF.width * 0.4, align: "center" });
    let mt = 0;
    if (typeof logo !== "undefined") {
      await addIMG({ page, img: logo, x: PDF.width * 0.18, y: PDF.mtBlock + 14, h: 37, w: 37 });
      mt += 12;
    }
    let sizeNome = 12;
    while (await addTXT({ page, size: sizeNome, text: `${xml.tagEmit?.xNome}`, x: 1, y: PDF.mtBlock + 35 + mt, maxWidth: PDF.width * 0.4, align: "center", fontStyle: "negrito", cacl: true }) >= 2) {
      sizeNome--;
    }
    addTXT({ page, size: sizeNome, text: `${xml.tagEmit?.xNome}`, x: 1, y: PDF.mtBlock + 35 + mt, maxWidth: PDF.width * 0.4, align: "center", fontStyle: "negrito" });
    addTXT({ page, size: 9, text: `CNPJ/CPF ${embCNPJCPF(xml.tagEmit?.CPF || xml.tagEmit?.CNPJ)}`, x: 0, y: PDF.mtBlock + 46 + mt, maxWidth: PDF.width * 0.42, align: "center" });
    addTXT({ page, size: 9, text: `${xml.tagEmit?.xBairro || ""} - ${xml.tagEmit?.CEP || ""}, ${xml.tagEmit?.xLgr || ""}, N\xB0${xml.tagEmit?.nro || ""}`, x: 0, y: PDF.mtBlock + 55 + mt, maxWidth: PDF.width * 0.42, align: "center" });
    addTXT({ page, size: 9, text: `${xml.tagEmit?.xMun || ""} - ${xml.tagEmit?.UF || ""} Fone: ${xml.tagEmit?.fone || ""}`, x: 0, y: PDF.mtBlock + 65 + mt, maxWidth: PDF.width * 0.42, align: "center" });
    if (xml.tagDest) {
      sizeNome = 12;
      while (await addTXT({ page, size: sizeNome, text: `${xml.tagDest?.xNome}`, x: PDF.width * 0.58, y: PDF.mtBlock + 35 + mt, maxWidth: PDF.width * 0.4, align: "center", fontStyle: "negrito", cacl: true }) >= 2) {
        sizeNome--;
      }
      addTXT({ page, size: sizeNome, text: `${xml.tagDest?.xNome}`, x: PDF.width * 0.58, y: PDF.mtBlock + 35 + mt, maxWidth: PDF.width * 0.4, align: "center", fontStyle: "negrito" });
      addTXT({ page, size: 9, text: `CNPJ/CPF ${embCNPJCPF(xml.tagDest?.CPF || xml.tagDest?.CNPJ)}`, x: PDF.width * 0.58, y: PDF.mtBlock + 46 + mt, maxWidth: PDF.width * 0.42, align: "center" });
      addTXT({ page, size: 9, text: `${xml.tagDest?.xMun || ""} - ${xml.tagDest?.UF || ""}, ${xml.tagDest?.xBairro || ""} - ${xml.tagDest?.CEP || ""}, ${xml.tagDest?.xLgr || ""}, N\xB0${xml.tagDest?.nro || ""}`, x: PDF.width * 0.58, y: PDF.mtBlock + 55 + mt, maxWidth: PDF.width * 0.42, align: "center" });
      addTXT({ page, size: 9, text: ``, x: PDF.width * 0.6, y: PDF.mtBlock + 65 + mt, maxWidth: PDF.width * 0.42, align: "center" });
    } else {
    }
    addTXT({ page, size: 16, text: "CUPOM", x: PDF.width * 0.393, y: PDF.mtBlock + 3, maxWidth: PDF.width * 0.2, align: "center", fontStyle: "negrito" });
    addTXT({ page, size: 8, text: "Documento N\xC3O Fiscal", x: PDF.width * 0.4, y: PDF.mtBlock + 19, maxWidth: PDF.width * 0.18, align: "center" });
    addTXT({ page, size: 8, text: "0 - ENTRADA", x: PDF.width * 0.415, y: PDF.mtBlock + 42, maxWidth: PDF.width * 0.19, align: "left" });
    addTXT({ page, size: 8, text: "1 - SA\xCDDA", x: PDF.width * 0.415, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.19, align: "left" });
    addTXT({ page, size: 20, text: xml.tagIde.tpNF, x: PDF.width * 0.534, y: PDF.mtBlock + 37, maxWidth: PDF.width * 0.19, align: "left" });
    addTXT({ page, size: 10, text: `Codigo \xBA. ${xml.tagIde.nNF.padStart(9, "0")}`, x: PDF.width * 0.4, y: PDF.mtBlock + 63, maxWidth: PDF.width * 0.19, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "NATUREZA DA OPERA\xC7\xC3O", x: 3, y: PDF.mtBlock + 92, maxWidth: PDF.width * 0.29 });
    addTXT({ page, size: 10, text: xml.tagIde.natOp, x: 3, y: PDF.mtBlock + 101, maxWidth: PDF.width * 0.58, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "INSCRI\xC7\xC3O ESTADUAL", x: 3, y: PDF.mtBlock + 112, maxWidth: PDF.width * 0.29 });
    addTXT({ page, size: 10, text: xml.tagEmit.IE || "", x: 3, y: PDF.mtBlock + 121, maxWidth: PDF.width * 0.25, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "INSCRI\xC7\xC3O MUNICIPAL", x: PDF.width * 0.255, y: PDF.mtBlock + 112, maxWidth: PDF.width * 0.29 });
    addTXT({ page, size: 10, text: xml.tagEmit.IM || "", x: PDF.width * 0.355, y: PDF.mtBlock + 121, maxWidth: PDF.width * 0.05, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "INSCRI\xC7\xC3O ESTADUAL DO SUBST. TRIBUT.", x: PDF.width * 0.5, y: PDF.mtBlock + 112, maxWidth: PDF.width * 0.29 });
    addTXT({ page, size: 10, text: xml.tagEmit.IEST || "", x: PDF.width * 0.6, y: PDF.mtBlock + 121, maxWidth: PDF.width * 0.05, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "CNPJ/CPF", x: PDF.width * 0.75, y: PDF.mtBlock + 112, maxWidth: PDF.width * 0.29 });
    addTXT({ page, size: 10, text: embCNPJCPF(xml.tagEmit.CNPJ || xml.tagEmit.CPF), x: PDF.width * 0.845, y: PDF.mtBlock + 121, maxWidth: PDF.width * 0.05, align: "center", fontStyle: "negrito" });
    PDF.mtBlock += 133;
  }
  async function barCode() {
    if (PDF.barCode != null) return PDF.barCode;
    const isNode = typeof window === "undefined";
    if (isNode) {
      const { createCanvas } = await import("canvas");
      const canvas = createCanvas(400, 100);
      JsBarcode2(canvas, xml.NFe.infNFe["@Id"], {
        format: "CODE128",
        displayValue: false,
        fontSize: 18
      });
      PDF.barCode = canvas.toDataURL("image/png");
      return PDF.barCode;
    } else {
      return new Promise((resolve, reject) => {
        try {
          const canvas = document.createElement("canvas");
          JsBarcode2(canvas, xml.NFe.infNFe["@Id"], {
            format: "CODE128",
            displayValue: false,
            fontSize: 18
          });
          PDF.barCode = canvas.toDataURL("image/png");
          resolve(PDF.barCode);
        } catch (err) {
          reject(err);
        }
      });
    }
  }
  async function bloco2(page = PDF.pages[PDF.pages.length - 1]) {
    addRet(page, 0, PDF.mtBlock + 10, PDF.width * 0.603, 20);
    addRet(page, PDF.width * 0.603, PDF.mtBlock + 10, PDF.width * 0.222, 20);
    addRet(page, PDF.width * 0.825, PDF.mtBlock + 10, PDF.width * 0.2, 20);
    addRet(page, PDF.width * 0.665, PDF.mtBlock + 30, PDF.width, 20);
    addRet(page, PDF.width * 0.825, PDF.mtBlock + 50, PDF.width * 0.2, 20);
    addRet(page, PDF.width * 0.665, PDF.mtBlock + 30, PDF.width * 0.16, 40);
    addRet(page, PDF.width * 0.503, PDF.mtBlock + 50, PDF.width * 0.162, 20);
    addRet(page, PDF.width * 0.465, PDF.mtBlock + 50, PDF.width * 0.038, 20);
    addRet(page, PDF.width * 0, PDF.mtBlock + 50, PDF.width * 0.465, 20);
    addRet(page, PDF.width * 0, PDF.mtBlock + 30, PDF.width * 0.465, 20);
    addTXT({ page, text: "DESTINAT\xC1RIO / REMETENTE", x: 3, y: PDF.mtBlock + 2, maxWidth: PDF.width * 0.4, fontStyle: "negrito" });
    addTXT({ page, text: "NOME / RAZ\xC3O SOCIAL", x: 3, y: PDF.mtBlock + 10, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.xNome, x: 3, y: PDF.mtBlock + 20, maxWidth: PDF.width * 0.58, fontStyle: "negrito" });
    addTXT({ page, text: "CNPJ/CPF", x: PDF.width * 0.61, y: PDF.mtBlock + 10, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.CNPJ || xml.NFe.infNFe.dest.CPF, x: PDF.width * 0.51, y: PDF.mtBlock + 20, maxWidth: PDF.width * 0.42, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "DATA DA EMISS\xC3O", x: PDF.width * 0.83, y: PDF.mtBlock + 10, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: new Date(xml.tagIde.dhEmi).toLocaleDateString("pt-BR"), x: PDF.width * 0.83, y: PDF.mtBlock + 20, maxWidth: PDF.width * 0.42, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "ENDERE\xC7O", x: 2, y: PDF.mtBlock + 31, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: `${xml.NFe.infNFe.dest.enderDest.xLgr}, N\xB0 ${xml.NFe.infNFe.dest.enderDest.nro}`, x: 3, y: PDF.mtBlock + 40, maxWidth: PDF.width * 0.42, align: "left", fontStyle: "negrito" });
    addTXT({ page, text: "BAIRRO/DISTRITO", x: PDF.width * 0.47, y: PDF.mtBlock + 31, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.enderDest.xBairro, x: PDF.width * 0.47, y: PDF.mtBlock + 40, maxWidth: PDF.width * 0.21, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "CEP", x: PDF.width * 0.67, y: PDF.mtBlock + 31, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.enderDest.CEP.replace(/^(\d{5})(\d{3})$/, "$1-$2"), x: PDF.width * 0.67, y: PDF.mtBlock + 40, maxWidth: PDF.width * 0.17, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "DATA DA SA\xCDDA/ENTRDA", x: PDF.width * 0.83, y: PDF.mtBlock + 31, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: new Date(xml.tagIde.dhEmi).toLocaleDateString("pt-BR"), x: PDF.width * 0.83, y: PDF.mtBlock + 40, maxWidth: PDF.width * 0.17, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "MUNICIPIO", x: 2, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.enderDest.xMun, x: 3, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.42, align: "left", fontStyle: "negrito" });
    addTXT({ page, text: "UF", x: PDF.width * 0.47, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.enderDest.UF, x: PDF.width * 0.473, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.21, align: "left", fontStyle: "negrito" });
    addTXT({ page, text: "FONE/FAX", x: PDF.width * 0.505, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.enderDest.fone || "", x: PDF.width * 0.505, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.17, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "INSCRI\xC7\xC3O ESTADUAL", x: PDF.width * 0.67, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.IE || "", x: PDF.width * 0.67, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.17, align: "center", fontStyle: "negrito" });
    addTXT({ page, text: "HORA DA SA\xCDDA/ENTRDA", x: PDF.width * 0.83, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
    addTXT({ page, size: 9, text: new Date(xml.tagIde.dhEmi).toLocaleTimeString("pt-BR"), x: PDF.width * 0.83, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.17, align: "center", fontStyle: "negrito" });
    PDF.mtBlock += 73;
  }
  async function bloco3(page = PDF.pages[PDF.pages.length - 1]) {
    addTXT({ page, text: "PAGAMENTO", x: 3, y: PDF.mtBlock, maxWidth: PDF.width * 0.25, fontStyle: "negrito" });
    const pagamentos = Array.isArray(xml.tagDetPag) ? xml.tagDetPag : [xml.tagDetPag];
    const formaPagto = {
      "01": "Dinheiro",
      "02": "Cheque",
      "03": "Cart\xE3o de Cr\xE9dito",
      "04": "Cart\xE3o de D\xE9bito",
      "05": "Cr\xE9dito Loja",
      "10": "Vale Alimenta\xE7\xE3o",
      "11": "Vale Refei\xE7\xE3o",
      "12": "Vale Presente",
      "13": "Vale Combust\xEDvel",
      "15": "Boleto Banc\xE1rio",
      "16": "Dep\xF3sito Banc\xE1rio",
      "17": "PIX",
      "18": "Transfer\xEAncia",
      "19": "Fidelidade",
      "90": "Sem pagamento",
      "99": "Outros"
    };
    let offset = 0;
    for (const pag of pagamentos) {
      const forma = formaPagto[pag.tPag] || `C\xF3digo ${pag.tPag}`;
      const valor = parseFloat(pag.vPag).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      addRet(page, 0, PDF.mtBlock + 7 + offset, PDF.width * 0.25, 20);
      addTXT({ page, text: "FORMA", x: 3, y: PDF.mtBlock + 8 + offset, maxWidth: PDF.width * 0.25 });
      addTXT({ page, text: forma, x: 3, y: PDF.mtBlock + 18 + offset, maxWidth: PDF.width * 0.25 });
      addTXT({ page, text: forma, x: 3, y: PDF.mtBlock + 8 + offset, maxWidth: PDF.width * 0.245, align: "right", fontStyle: "negrito" });
      addTXT({ page, text: valor, x: 3, y: PDF.mtBlock + 18 + offset, maxWidth: PDF.width * 0.245, align: "right", fontStyle: "negrito" });
      offset += 22;
    }
    PDF.mtBlock += offset + 6;
  }
  async function bloco4(page = PDF.pages[PDF.pages.length - 1]) {
    const ICMS = {
      vProd: "Valor Produtos",
      vFrete: "Valor Frete",
      vSeg: "Valor Seguro",
      vDesc: "Valor Desconto",
      vOutro: "Outras Desp. Acess.",
      vNF: "Valor Total NF-e"
    };
    addTXT({ page, text: "TOTAIS", x: 3, y: PDF.mtBlock, maxWidth: PDF.width * 0.25, fontStyle: "negrito" });
    let nextY = PDF.mtBlock + 8, nextX = 0, limitY = PDF.width - 8;
    for (const key of Object.keys(ICMS)) {
      const valor = xml?.vTotal?.[key] || 0;
      const texto = valor ? parseFloat(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "0,00";
      await addRet(page, limitY * 0.111 * nextX, nextY, limitY * 0.111, 20);
      addTXT({ page, text: ICMS[key], x: 2 + limitY * 0.111 * nextX, y: nextY + 1, maxWidth: limitY * 0.111 });
      addTXT({ page, size: 10, text: texto.replace("R$", ""), x: limitY * 0.111 * nextX, y: nextY + 9, maxWidth: limitY * 0.111, align: "right", fontStyle: "negrito" });
      nextX++;
      if (nextX >= 9) {
        nextX = 0;
        nextY += 20;
      }
    }
    PDF.mtBlock += 30;
  }
  async function bloco6(page = PDF.pages[PDF.pages.length - 1]) {
    let hBlock = PDF.height - PDF.mtBlock - (PDF.pages.length == 1 ? 75 : 18);
    xml.tagProd = Array.isArray(xml.tagProd) ? xml.tagProd : [xml.tagProd];
    addTXT({ page, text: "DADOS DOS PRODUTOS / SERVI\xC7OS", x: 3, y: PDF.mtBlock, maxWidth: PDF.width, fontStyle: "negrito" });
    addRet(page, 0, PDF.mtBlock + 8, PDF.width, hBlock);
    addRet(page, 0, PDF.mtBlock + 8, PDF.width, 15);
    const colunas = [0.1, 0.49, 0.57, 0.64, 0.7, 0.775, 0.85, 0.925];
    for (const x of colunas) addLTV(page, PDF.width * x, PDF.mtBlock + 8, hBlock);
    addTXT({ page, text: "C\xD3DIGO PRODUTO", x: PDF.width * 3e-3, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.09, align: "center" });
    addTXT({ page, text: "DESCRI\xC7\xC3O DO PRODUTO / SERVI\xC7O", x: PDF.width * 0.1, y: PDF.mtBlock + 12, maxWidth: PDF.width * 0.24, align: "center" });
    addTXT({ page, text: "NCM/SH", x: PDF.width * 0.5, y: PDF.mtBlock + 12, maxWidth: PDF.width * 0.06, align: "center" });
    addTXT({ page, text: "CFOP", x: PDF.width * 0.59, y: PDF.mtBlock + 12, maxWidth: PDF.width * 0.025, align: "center" });
    addTXT({ page, text: "UN", x: PDF.width * 0.66, y: PDF.mtBlock + 12, maxWidth: PDF.width * 0.025, align: "center" });
    addTXT({ page, text: "QUANT.", x: PDF.width * 0.7, y: PDF.mtBlock + 12, maxWidth: PDF.width * 0.07, align: "center" });
    addTXT({ page, text: "VALOR UNIT", x: PDF.width * 0.775, y: PDF.mtBlock + 8.5, maxWidth: PDF.width * 0.07, align: "center" });
    addTXT({ page, text: "VALOR DESC", x: PDF.width * 0.85, y: PDF.mtBlock + 8.5, maxWidth: PDF.width * 0.07, align: "center" });
    addTXT({ page, text: "VALOR TOTAL", x: PDF.width * 0.925, y: PDF.mtBlock + 8.5, maxWidth: PDF.width * 0.07, align: "center" });
    let line = 24, lLimite = Math.floor(hBlock / 7), lIndex = 0;
    for (const [iDet, prod] of xml.tagProd.entries()) {
      lIndex += await addTXT({ page, text: prod.xProd, x: 0, y: 0, maxWidth: PDF.width * 0.39, align: "center", cacl: true });
      if (lIndex >= lLimite) {
        xml.tagProd.splice(0, iDet);
        PDF.mtBlock += hBlock + 12;
        return false;
      }
      const fmt = (v) => parseFloat(v || "0.00").toLocaleString("pt-BR", { minimumFractionDigits: 2 });
      const xProdH = await addTXT({ page, text: prod.xProd, x: PDF.width * 0.096, y: PDF.mtBlock + line, maxWidth: PDF.width * 0.39, align: "left" });
      const y = PDF.mtBlock + line + (xProdH - 1) * 2.7;
      addTXT({ page, text: prod.cEAN || "", x: 0, y, maxWidth: PDF.width * 0.1, align: "center" });
      addTXT({ page, text: prod.NCM || "", x: PDF.width * 0.5, y, maxWidth: PDF.width * 0.061, align: "center" });
      addTXT({ page, text: prod.CFOP || "", x: PDF.width * 0.575, y, maxWidth: PDF.width * 0.061, align: "center" });
      addTXT({ page, text: prod.uCom || "", x: PDF.width * 0.64, y, maxWidth: PDF.width * 0.061, align: "center" });
      addTXT({ page, text: fmt(prod.qCom), x: PDF.width * 0.71, y, maxWidth: PDF.width * 0.061, align: "center" });
      addTXT({ page, text: fmt(prod.vUnCom), x: PDF.width * 0.783, y, maxWidth: PDF.width * 0.061, align: "center" });
      addTXT({ page, text: fmt(prod.vDesc || 0), x: PDF.width * 0.86, y, maxWidth: PDF.width * 0.061, align: "center" });
      addTXT({ page, text: fmt(prod.vProd), x: PDF.width * 0.93, y, maxWidth: PDF.width * 0.061, align: "center" });
      line += xProdH * 6.9;
    }
    PDF.mtBlock += hBlock + 12;
    return true;
  }
  async function bloco7(page = PDF.pages[PDF.pages.length - 1]) {
    addTXT({ page, text: "DADOS ADICIONAIS", x: 3, y: PDF.mtBlock, maxWidth: PDF.width, fontStyle: "negrito" });
    addRet(page, 0, PDF.mtBlock + 8, PDF.width, 40);
    addRet(page, 0, PDF.mtBlock + 8, PDF.width * 0.65, 40);
    addTXT({ page, text: "INFORMA\xC7\xD5ES COMPLEMENTARES", x: 3, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.5, align: "left", fontStyle: "negrito" });
    addTXT({ page, text: "RESERVADO AO FISCO", x: PDF.width * 0.652, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.5, align: "left", fontStyle: "negrito" });
    if (await addTXT({ page, text: xml.taginfAdic?.infAdFisco || "", x: 3, y: PDF.mtBlock + 14, maxWidth: PDF.width * 0.65, align: "left", cacl: true }) >= 5) {
      addTXT({ page, text: xml.taginfAdic?.infAdFisco.slice(0, 400) + "..." || "", x: 3, y: PDF.mtBlock + 14, maxWidth: PDF.width * 0.65, align: "left" });
    } else {
      addTXT({ page, text: xml.taginfAdic?.infAdFisco || "", x: 3, y: PDF.mtBlock + 14, maxWidth: PDF.width * 0.65, align: "left" });
    }
    ;
    if (await addTXT({ page, text: xml.taginfAdic?.infCpl || "", x: PDF.width * 0.652, y: PDF.mtBlock + 14, maxWidth: PDF.width * 0.65, align: "left", cacl: true }) >= 5) {
      addTXT({ page, text: xml.taginfAdic?.infCpl.slice(0, 200) + "..." || "", x: PDF.width * 0.652, y: PDF.mtBlock + 14, maxWidth: PDF.width * 0.65, align: "left" });
    } else {
      addTXT({ page, text: xml.taginfAdic?.infCpl || "", x: PDF.width * 0.652, y: PDF.mtBlock + 14, maxWidth: PDF.width * 0.65, align: "left" });
    }
    ;
    PDF.mtBlock += 40;
  }
  async function bloco8(page = PDF.pages[PDF.pages.length - 1]) {
    const agora = /* @__PURE__ */ new Date();
    const dataFormatada = agora.toLocaleDateString("pt-BR");
    const horaFormatada = agora.toLocaleTimeString("pt-BR");
    const textoEsquerda = `Impresso em ${dataFormatada} \xE0s ${horaFormatada}.`;
    addTXT({ page, text: textoEsquerda, x: 3, y: PDF.mtBlock + 8, maxWidth: PDF.width, align: "left" });
    addTXT({ page, text: "Powered by @node-sped-pdf", x: 3, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.989, align: "right", fontStyle: "italic" });
  }
  async function addIMG({
    page,
    img,
    x,
    y,
    h,
    w
  }) {
    if (typeof img != void 0) {
      if (img.includes("http") || img.includes("wwww"))
        img = await fetch(img || "").then((response) => response.blob()).then((blob) => blob2base64(blob));
      const bytes = Uint8Array.from(atob(img.split(",")[1]), (c) => c.charCodeAt(0));
      const isPng = img?.startsWith("data:image/png");
      const image = isPng ? await PDF.doc.embedPng(bytes) : await PDF.doc.embedJpg(bytes);
      await page.drawImage(image, {
        x,
        y: PDF.height - y - h,
        // Corrige porque pdf-lib desenha do canto inferior da imagem
        width: w,
        height: h
      });
    }
  }
  async function blob2base64(blobOrBuffer) {
    const isBrowser2 = typeof window !== "undefined" && typeof window.FileReader !== "undefined";
    if (isBrowser2) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blobOrBuffer);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
      });
    } else {
      try {
        let buffer;
        if (blobOrBuffer instanceof Blob) {
          const arrayBuffer = await blobOrBuffer.arrayBuffer();
          buffer = Buffer.from(arrayBuffer);
        } else if (Buffer.isBuffer(blobOrBuffer)) {
          buffer = blobOrBuffer;
        } else {
          buffer = Buffer.from(blobOrBuffer);
        }
        return buffer.toString("base64");
      } catch (err) {
        throw new Error(`Falha ao converter: ${err}`);
      }
    }
  }
  async function blocoDEMO(page = PDF.pages[PDF.pages.length - 1]) {
    imgDemo = await fetch(imgDemo || "").then((response) => response.blob()).then((blob) => blob2base64(blob));
    const base64Data = imgDemo?.split(",")[1];
    const bytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const isPng = imgDemo?.startsWith("data:image/png");
    const image = isPng ? await PDF.doc.embedPng(bytes) : await PDF.doc.embedJpg(bytes);
    page.drawImage(image, {
      x: 0,
      y: 0,
      // Corrige porque pdf-lib desenha do canto inferior da imagem
      width: PDF.width,
      height: PDF.height
    });
  }
  return new Promise(async (resolve, reject) => {
    await gerarBlocos();
    resolve(await PDF.doc.save());
  });
};
export {
  DANFCe,
  DANFe,
  DAV55
};
//# sourceMappingURL=index.js.map