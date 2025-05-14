var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// src/libs/danfe.ts
import PDFDocument from "@react-pdf/pdfkit";
import { XMLParser } from "fast-xml-parser";
var _pdf, _nextBloco, _xml, _xmlRes, _logo, _imgDemo, _isBrowser, _danfe_instances, gerarBlocos_fn, demo_fn, bloco0_fn, bloco1_fn, formtPTBR_fn, bloco2_fn, bloco3_fn, traduzirFormaPagamento_fn, bloco4_fn, traduzirTipoFrete_fn, bloco5_fn, bloco6_fn, bloco7_fn, _pdfWidth, _pdfHeight, _pdfMargin, _pdfOpc, _mtIndex, _pagIndex, _pagQtd, base64IMG_fn, addBase64IMG_fn, blob2base64_fn, addRetangulo_fn, addLinhaHT_fn, addLinhaH_fn, addLinhaV_fn, addLinhaVT_fn, addTXT_fn;
var danfe = class {
  constructor(data = {}) {
    __privateAdd(this, _danfe_instances);
    __privateAdd(this, _pdf);
    __privateAdd(this, _nextBloco, 0);
    __privateAdd(this, _xml, {});
    __privateAdd(this, _xmlRes, null);
    __privateAdd(this, _logo, null);
    __privateAdd(this, _imgDemo, null);
    __privateAdd(this, _isBrowser, false);
    // ---------------- FUNCOES ----------------
    __privateAdd(this, _pdfWidth, 595.28);
    __privateAdd(this, _pdfHeight, 841.89);
    __privateAdd(this, _pdfMargin, 5);
    __privateAdd(this, _pdfOpc, {
      borda: "black",
      txt: "black",
      lineWidth: 1,
      ltraj: "#4b5563"
    });
    __privateAdd(this, _mtIndex, 0);
    //Margem do topo para proximo bloco
    __privateAdd(this, _pagIndex, 1);
    __privateAdd(this, _pagQtd, 1);
    __privateSet(this, _isBrowser, typeof window !== "undefined");
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@",
      parseTagValue: false
      // Evita conversão automática de valores
    });
    let tXml = data.xml ? parser.parse(data.xml) : {};
    if (typeof tXml.nfeProc != "undefined") {
      tXml = tXml.nfeProc;
    }
    __privateSet(this, _xml, tXml);
    console.log(tXml);
    __privateSet(this, _xmlRes, data.xmlRes || null);
    __privateSet(this, _logo, data.logo || null);
    __privateSet(this, _imgDemo, data.imgDemo || null);
    __privateSet(this, _pdf, new PDFDocument({
      bufferPages: true,
      margin: 0,
      size: [
        __privateGet(this, _pdfWidth),
        __privateGet(this, _pdfHeight)
      ],
      info: {
        Author: "Kalmon Valadao Tavares",
        Title: "DANFE",
        Creator: "Guara DEV",
        Producer: "http://github.com/brasil-js/danfe"
      }
    }));
  }
  async getPDF() {
    return new Promise(async (resolve, reject) => {
      if (__privateGet(this, _isBrowser)) {
        const stream = __privateGet(this, _pdf).pipe(window.blobStream());
        await __privateMethod(this, _danfe_instances, gerarBlocos_fn).call(this);
        if (__privateGet(this, _imgDemo) != null) __privateMethod(this, _danfe_instances, demo_fn).call(this);
        __privateGet(this, _pdf).end();
        stream.on("finish", () => {
          const blob = stream.toBlob("application/pdf");
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result;
            const base64 = result.slice(result.indexOf(",") + 1);
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } else {
        const { PassThrough } = await import("stream");
        const stream = new PassThrough();
        const chunks = [];
        await __privateMethod(this, _danfe_instances, gerarBlocos_fn).call(this);
        if (__privateGet(this, _imgDemo) != null) await __privateMethod(this, _danfe_instances, demo_fn).call(this);
        __privateGet(this, _pdf).pipe(stream);
        __privateGet(this, _pdf).end();
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => {
          const buffer = Buffer.concat(chunks);
          const base64 = buffer.toString("base64");
          resolve(base64);
        });
        stream.on("error", reject);
      }
    });
  }
};
_pdf = new WeakMap();
_nextBloco = new WeakMap();
_xml = new WeakMap();
_xmlRes = new WeakMap();
_logo = new WeakMap();
_imgDemo = new WeakMap();
_isBrowser = new WeakMap();
_danfe_instances = new WeakSet();
gerarBlocos_fn = async function() {
  await __privateMethod(this, _danfe_instances, bloco0_fn).call(this);
  await __privateMethod(this, _danfe_instances, bloco1_fn).call(this);
  await __privateMethod(this, _danfe_instances, bloco2_fn).call(this);
  await __privateMethod(this, _danfe_instances, bloco3_fn).call(this);
  await __privateMethod(this, _danfe_instances, bloco4_fn).call(this);
  await __privateMethod(this, _danfe_instances, bloco5_fn).call(this);
  await __privateMethod(this, _danfe_instances, bloco6_fn).call(this);
};
demo_fn = function() {
  __privateGet(this, _pdf).image(__privateGet(this, _imgDemo), 0, 0, { width: __privateGet(this, _pdfWidth) }).text("", 0, 0);
};
//Recibo
bloco0_fn = function() {
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: 0, t: __privateGet(this, _pdfHeight) * 0.03, w: __privateGet(this, _pdfWidth) * 0.805, h: __privateGet(this, _pdfHeight) * 0.03 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "left", txt: "IDENTIFICA\xC7\xC3O E ASSINATURA DO RECEBEDOR", l: __privateGet(this, _pdfWidth) * 0.18, t: 28, w: __privateGet(this, _pdfWidth) * 0.5 });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: 0, t: 0, w: __privateGet(this, _pdfWidth) * 0.805, h: __privateGet(this, _pdfHeight) * 0.06 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "justify", l: 2, t: 3, w: __privateGet(this, _pdfWidth) * 0.78, txt: `RECEBEMOS DE ${__privateGet(this, _xml).NFe.infNFe.emit.xNome} OS PRODUTOS E/OU SERVI\xC7OS CONSTANTES DA NOTA FISCAL ELETR\xD4NICA INDICADA ABAIXO. EMISS\xC3O: ${new Date(__privateGet(this, _xml).NFe.infNFe.ide.dhEmi).toLocaleString().split(",")[0]} VALOR TOTAL: R$ ${__privateGet(this, _xml).NFe.infNFe.total.ICMSTot.vNF} DESTINAT\xC1RIO: ${__privateGet(this, _xml).NFe.infNFe.dest.xNome} - ${__privateGet(this, _xml).NFe.infNFe.dest.enderDest.xLgr}, N\xB0${__privateGet(this, _xml).NFe.infNFe.dest.enderDest.nro}, Bairro ${__privateGet(this, _xml).NFe.infNFe.dest.enderDest.xBairro}, ${__privateGet(this, _xml).NFe.infNFe.dest.enderDest.xMun}}-${__privateGet(this, _xml).NFe.infNFe.dest.enderDest.UF}` });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: 0, t: __privateGet(this, _pdfHeight) * 0.03, w: __privateGet(this, _pdfWidth) * 0.175, h: __privateGet(this, _pdfHeight) * 0.03 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "left", txt: "DATA DE RECEBIMENTO", l: 2, t: 28, w: __privateGet(this, _pdfWidth) * 0.17 });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: 0, t: 0, w: __privateGet(this, _pdfWidth), h: __privateGet(this, _pdfHeight) * 0.06 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "center", font: "bold", txt: "NF-e", l: __privateGet(this, _pdfWidth) * 0.81, t: 6, size: 15, w: __privateGet(this, _pdfWidth) * 0.18 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "center", font: "bold", txt: `N\xBA.  ${__privateGet(this, _xml).NFe.infNFe.ide.nNF.padStart(9, "0").slice(0, 3)}.${__privateGet(this, _xml).NFe.infNFe.ide.nNF.padStart(9, "0").slice(3, 6)}.${__privateGet(this, _xml).NFe.infNFe.ide.nNF.padStart(9, "0").slice(6, 9)}`, l: __privateGet(this, _pdfWidth) * 0.81, t: 22, size: 12, w: __privateGet(this, _pdfWidth) * 0.18 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "center", font: "bold", txt: `S\xE9rie ${__privateGet(this, _xml).NFe.infNFe.ide.serie}`, l: __privateGet(this, _pdfWidth) * 0.81, t: 34, size: 12, w: __privateGet(this, _pdfWidth) * 0.18 });
  __privateMethod(this, _danfe_instances, addLinhaHT_fn).call(this, { t: __privateGet(this, _pdfHeight) * 0.07, ls: 0, le: __privateGet(this, _pdfWidth) });
  __privateSet(this, _mtIndex, __privateGet(this, _mtIndex) + __privateGet(this, _pdfHeight) * 0.071);
};
bloco1_fn = async function() {
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: 0, t: 0, w: __privateGet(this, _pdfWidth) * 0.41, h: __privateGet(this, _pdfHeight) * 0.108 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    font: "italic",
    txt: "IDENTIFICA\xC7\xC3O DO EMITENTE",
    l: 0,
    t: 3,
    w: __privateGet(this, _pdfWidth) * 0.4
  });
  let mtLogo = 0;
  if (__privateGet(this, _logo) != null) {
    if (__privateGet(this, _logo).includes("http")) {
      __privateSet(this, _logo, await fetch(__privateGet(this, _logo)).then((response) => response.blob()).then((blob) => __privateMethod(this, _danfe_instances, blob2base64_fn).call(this, blob)));
    }
    __privateMethod(this, _danfe_instances, addBase64IMG_fn).call(this, { l: 3, t: 8, w: __privateGet(this, _pdfWidth) * 0.41, h: __privateGet(this, _pdfHeight) * 0.108, base64: __privateGet(this, _logo) });
    mtLogo = 28;
  }
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    font: "bold",
    txt: __privateGet(this, _xml).NFe.infNFe.emit.xNome,
    l: 0,
    t: 34 + mtLogo,
    w: __privateGet(this, _pdfWidth) * 0.4,
    size: 12
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: `${__privateGet(this, _xml).NFe.infNFe.emit.enderEmit.xLgr}, N\xB0${__privateGet(this, _xml).NFe.infNFe.emit.enderEmit.nro}, ${__privateGet(this, _xml).NFe.infNFe.emit.enderEmit.xBairro}, CEP ${__privateGet(this, _xml).NFe.infNFe.emit.enderEmit.CEP}`,
    l: 0,
    t: 44 + mtLogo,
    w: __privateGet(this, _pdfWidth) * 0.4,
    size: 10
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: `${__privateGet(this, _xml).NFe.infNFe.emit.enderEmit.xMun} - ${__privateGet(this, _xml).NFe.infNFe.emit.enderEmit.UF}, Fone ${__privateGet(this, _xml).NFe.infNFe.emit.enderEmit.fone}`,
    l: 0,
    t: 54 + mtLogo,
    w: __privateGet(this, _pdfWidth) * 0.4,
    size: 10
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.41, t: 0, w: __privateGet(this, _pdfWidth) * 0.168, h: __privateGet(this, _pdfHeight) * 0.108 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    font: "bold",
    txt: "DANFE",
    l: __privateGet(this, _pdfWidth) * 0.41,
    t: 8,
    w: __privateGet(this, _pdfWidth) * 0.167,
    size: 12
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "Documento Auxiliar da Nota Fiscal Eletr\xF4nica",
    l: __privateGet(this, _pdfWidth) * 0.41,
    t: 20,
    w: __privateGet(this, _pdfWidth) * 0.167
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "0 - ENTRADA\n1 - SA\xCDDA",
    l: __privateGet(this, _pdfWidth) * 0.42,
    t: 39,
    w: __privateGet(this, _pdfWidth) * 0.169,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    font: "bold",
    txt: `N\xBA. ${__privateGet(this, _xml).NFe.infNFe.ide.nNF}`,
    l: __privateGet(this, _pdfWidth) * 0.41,
    t: 61,
    w: __privateGet(this, _pdfWidth) * 0.167,
    size: 11
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    font: "bold",
    txt: `S\xE9rie ${__privateGet(this, _xml).NFe.infNFe.ide.serie}`,
    l: __privateGet(this, _pdfWidth) * 0.41,
    t: 71,
    w: __privateGet(this, _pdfWidth) * 0.167,
    size: 11
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    font: "italic",
    txt: `Folha ${__privateGet(this, _pagIndex)}/${__privateGet(this, _pagQtd)}`,
    l: __privateGet(this, _pdfWidth) * 0.41,
    t: 81,
    w: __privateGet(this, _pdfWidth) * 0.167,
    size: 8
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.54, t: __privateGet(this, _pdfHeight) * 0.045, w: __privateGet(this, _pdfWidth) * 0.023, h: __privateGet(this, _pdfHeight) * 0.023 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    font: "bold",
    txt: "1",
    l: __privateGet(this, _pdfWidth) * 0.54,
    t: __privateGet(this, _pdfHeight) * 0.05,
    w: __privateGet(this, _pdfWidth) * 0.023,
    size: 15
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.578, t: 0, w: __privateGet(this, _pdfWidth), h: __privateGet(this, _pdfHeight) * 0.054 });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.578, t: __privateGet(this, _pdfHeight) * 0.054, w: __privateGet(this, _pdfWidth), h: __privateGet(this, _pdfHeight) * 0.027 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "IDENTIFICA\xC7\xC3O DO EMITENTE",
    l: __privateGet(this, _pdfWidth) * 0.582,
    t: __privateGet(this, _pdfHeight) * 0.056
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe["@Id"].replace("NFe", "").match(/.{1,4}/g).join(" "),
    l: __privateGet(this, _pdfWidth) * 0.582,
    t: __privateGet(this, _pdfHeight) * 0.071,
    w: __privateGet(this, _pdfWidth),
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.578, t: __privateGet(this, _pdfHeight) * 0.0808, w: __privateGet(this, _pdfWidth), h: __privateGet(this, _pdfHeight) * 0.027 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "Consulta de autenticidade no portal nacional da NF-e",
    l: __privateGet(this, _pdfWidth) * 0.582,
    t: __privateGet(this, _pdfHeight) * 0.084,
    w: __privateGet(this, _pdfWidth),
    size: 9
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "www.nfe.fazenda.gov.br/portal ou no site da Sefaz Autorizadora",
    l: __privateGet(this, _pdfWidth) * 0.582,
    t: __privateGet(this, _pdfHeight) * 0.097,
    w: __privateGet(this, _pdfWidth),
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: 0, t: __privateGet(this, _pdfHeight) * 0.108, w: __privateGet(this, _pdfWidth) * 0.578, h: __privateGet(this, _pdfHeight) * 0.023 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "NATUREZA DA OPERA\xC7\xC3O",
    l: 3,
    t: __privateGet(this, _pdfHeight) * 0.11,
    w: __privateGet(this, _pdfWidth) * 0.56
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.ide.natOp,
    l: 3,
    t: __privateGet(this, _pdfHeight) * 0.121,
    w: __privateGet(this, _pdfWidth) * 0.56,
    font: "bold",
    size: 10
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.578, t: __privateGet(this, _pdfHeight) * 0.108, w: __privateGet(this, _pdfWidth) * 0.578, h: __privateGet(this, _pdfHeight) * 0.023 });
  if (typeof __privateGet(this, _xml).protNFe != "undefined") {
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
      aling: "center",
      txt: "PROTOCOLO DE AUTORIZA\xC7\xC3O DE USO",
      l: __privateGet(this, _pdfWidth) * 0.58,
      t: __privateGet(this, _pdfHeight) * 0.11
    });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
      font: "bold",
      aling: "center",
      txt: `${__privateGet(this, _xml).protNFe.nProt} - ${__privateMethod(this, _danfe_instances, formtPTBR_fn).call(this, __privateGet(this, _xml).protNFe.dhRecbto)}`,
      l: __privateGet(this, _pdfWidth) * 0.582,
      t: __privateGet(this, _pdfHeight) * 0.122,
      w: __privateGet(this, _pdfWidth),
      size: 9
    });
  }
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: 0, t: __privateGet(this, _pdfHeight) * 0.131, w: __privateGet(this, _pdfWidth) * 0.256, h: __privateGet(this, _pdfHeight) * 0.023 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "INSCRI\xC7\xC3O ESTADUAL",
    l: 2,
    t: __privateGet(this, _pdfHeight) * 0.133
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.emit.IE || "",
    l: 0,
    t: __privateGet(this, _pdfHeight) * 0.145,
    w: __privateGet(this, _pdfWidth) * 0.24,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.256, t: __privateGet(this, _pdfHeight) * 0.131, w: __privateGet(this, _pdfWidth) * 0.249, h: __privateGet(this, _pdfHeight) * 0.023 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "INSCRI\xC7\xC3O MUNICIPAL",
    l: __privateGet(this, _pdfWidth) * 0.259,
    t: __privateGet(this, _pdfHeight) * 0.133
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.emit.IM || "",
    l: __privateGet(this, _pdfWidth) * 0.259,
    t: __privateGet(this, _pdfHeight) * 0.145,
    w: __privateGet(this, _pdfWidth) * 0.24,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.505, t: __privateGet(this, _pdfHeight) * 0.131, w: __privateGet(this, _pdfWidth) * 0.578, h: __privateGet(this, _pdfHeight) * 0.023 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "INSCRI\xC7\xC3O ESTADUAL DO SUBST. TRIBUT",
    l: __privateGet(this, _pdfWidth) * 0.507,
    t: __privateGet(this, _pdfHeight) * 0.133
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.emit.I_EST || "",
    l: __privateGet(this, _pdfWidth) * 0.507,
    t: __privateGet(this, _pdfHeight) * 0.145,
    w: __privateGet(this, _pdfWidth) * 0.24,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.753, t: __privateGet(this, _pdfHeight) * 0.131, w: __privateGet(this, _pdfWidth) * 0.578, h: __privateGet(this, _pdfHeight) * 0.023 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "CNPJ / CPF",
    l: __privateGet(this, _pdfWidth) * 0.755,
    t: __privateGet(this, _pdfHeight) * 0.133
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.emit.CPF || __privateGet(this, _xml).NFe.infNFe.emit.CNPJ,
    l: __privateGet(this, _pdfWidth) * 0.755,
    t: __privateGet(this, _pdfHeight) * 0.145,
    w: __privateGet(this, _pdfWidth),
    size: 9
  });
  __privateSet(this, _mtIndex, __privateGet(this, _mtIndex) + __privateGet(this, _pdfHeight) * 0.16);
};
formtPTBR_fn = function(dataIso) {
  const data = new Date(dataIso);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, "0");
  const minutos = String(data.getMinutes()).padStart(2, "0");
  const segundos = String(data.getSeconds()).padStart(2, "0");
  return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
};
bloco2_fn = function() {
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "left",
    txt: "DESTINAT\xC1RIO / REMETENTE",
    l: 0,
    t: 1,
    size: 8
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: 0, t: 8, w: __privateGet(this, _pdfWidth) * 0.61, h: __privateGet(this, _pdfHeight) * 0.023 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "NOME / RAZ\xC3O SOCIAL",
    l: 2,
    t: 10
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "left",
    txt: __privateGet(this, _xml).NFe.infNFe.dest.xNome,
    l: 2,
    t: __privateGet(this, _pdfHeight) * 0.023,
    w: __privateGet(this, _pdfWidth) * 0.61,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.61, t: 8, w: __privateGet(this, _pdfWidth) * 0.225, h: __privateGet(this, _pdfHeight) * 0.023 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "CNPJ / CPF",
    l: __privateGet(this, _pdfWidth) * 0.61,
    t: 10
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.dest.CPF || __privateGet(this, _xml).NFe.infNFe.dest.CNPJ,
    l: __privateGet(this, _pdfWidth) * 0.61,
    t: __privateGet(this, _pdfHeight) * 0.023,
    w: __privateGet(this, _pdfWidth) * 0.225,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.835, t: 8, w: __privateGet(this, _pdfWidth) * 0.225, h: __privateGet(this, _pdfHeight) * 0.023 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "DATA DA EMISS\xC3O",
    l: __privateGet(this, _pdfWidth) * 0.835,
    t: 10
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateMethod(this, _danfe_instances, formtPTBR_fn).call(this, __privateGet(this, _xml).NFe.infNFe.ide.dhEmi).split(" ")[0],
    l: __privateGet(this, _pdfWidth) * 0.835,
    t: __privateGet(this, _pdfHeight) * 0.023,
    w: __privateGet(this, _pdfWidth) * 0.15,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: 0, t: 27.5, w: __privateGet(this, _pdfWidth) * 0.47, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "ENDERE\xC7O",
    l: 2,
    t: 29
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "left",
    txt: __privateGet(this, _xml).NFe.infNFe.dest.enderDest.xLgr,
    l: 2,
    t: 39,
    w: __privateGet(this, _pdfWidth) * 0.45,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.47, t: 27.5, w: __privateGet(this, _pdfWidth) * 0.205, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "BAIRRO / DISTRITO",
    l: __privateGet(this, _pdfWidth) * 0.472,
    t: 29
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.dest.enderDest.xBairro,
    l: __privateGet(this, _pdfWidth) * 0.472,
    t: 39,
    w: __privateGet(this, _pdfWidth) * 0.2,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.675, t: 27.5, w: __privateGet(this, _pdfWidth) * 0.16, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "CEP",
    l: __privateGet(this, _pdfWidth) * 0.677,
    t: 29
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.dest.enderDest.CEP,
    l: __privateGet(this, _pdfWidth) * 0.677,
    t: 39,
    w: __privateGet(this, _pdfWidth) * 0.16,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.835, t: 27.5, w: __privateGet(this, _pdfWidth) * 0.225, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "DATA DA SA\xCDDA/ENTRADA",
    l: __privateGet(this, _pdfWidth) * 0.837,
    t: 29
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateMethod(this, _danfe_instances, formtPTBR_fn).call(this, __privateGet(this, _xml).NFe.infNFe.ide.dhEmi).split(" ")[0],
    l: __privateGet(this, _pdfWidth) * 0.837,
    t: 39,
    w: __privateGet(this, _pdfWidth) * 0.16,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: 0, t: 46.5, w: __privateGet(this, _pdfWidth) * 0.47, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "MUNICIPIO",
    l: 2,
    t: 48.5
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "left",
    txt: __privateGet(this, _xml).NFe.infNFe.dest.enderDest.xMun,
    l: 2,
    t: 58.5,
    w: __privateGet(this, _pdfWidth) * 0.45,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.47, t: 46.5, w: __privateGet(this, _pdfWidth) * 0.04, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "UF",
    l: __privateGet(this, _pdfWidth) * 0.472,
    t: 48.5
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.dest.enderDest.UF,
    l: __privateGet(this, _pdfWidth) * 0.47,
    t: 58.5,
    w: __privateGet(this, _pdfWidth) * 0.04,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.51, t: 46.5, w: __privateGet(this, _pdfWidth) * 0.165, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "FONE / FAX",
    l: __privateGet(this, _pdfWidth) * 0.512,
    t: 48.5
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.dest.enderDest.fone || "",
    l: __privateGet(this, _pdfWidth) * 0.512,
    t: 58.5,
    w: __privateGet(this, _pdfWidth) * 0.165,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.675, t: 46.5, w: __privateGet(this, _pdfWidth) * 0.16, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "INSCRI\xC7\xC3O ESTADUAL",
    l: __privateGet(this, _pdfWidth) * 0.677,
    t: 48.5
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.dest.IE || "",
    l: __privateGet(this, _pdfWidth) * 0.677,
    t: 58.5,
    w: __privateGet(this, _pdfWidth) * 0.16,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.835, t: 46.5, w: __privateGet(this, _pdfWidth) * 0.1565, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "HORA DA SA\xCDDA/ENTRADA",
    l: __privateGet(this, _pdfWidth) * 0.834,
    t: 48.5
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateMethod(this, _danfe_instances, formtPTBR_fn).call(this, __privateGet(this, _xml).NFe.infNFe.ide.dhEmi).split(" ")[1],
    l: __privateGet(this, _pdfWidth) * 0.834,
    t: 58.5,
    w: __privateGet(this, _pdfWidth) * 0.1565,
    size: 9
  });
  __privateSet(this, _mtIndex, __privateGet(this, _mtIndex) + 69);
};
bloco3_fn = function(leftM = 2, addDesc = true) {
  if (addDesc) {
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
      font: "bold",
      aling: "left",
      txt: "PAGAMENTO",
      l: 0,
      t: 1,
      size: 8
    });
  }
  const pagamentos = __privateGet(this, _xml)?.NFe?.infNFe?.pag?.detPag ?? [];
  const detPag = Array.isArray(pagamentos) ? pagamentos : [pagamentos];
  let top = 8;
  for (const pag of detPag) {
    const formaPagamento = __privateMethod(this, _danfe_instances, traduzirFormaPagamento_fn).call(this, pag.tPag);
    const valorPagamento = parseFloat(pag.vPag).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
    __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: leftM, t: top, w: __privateGet(this, _pdfWidth) * 0.25, h: 19 });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
      aling: "left",
      txt: "Forma:",
      l: leftM,
      t: top + 1
    });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
      aling: "right",
      txt: formaPagamento,
      l: leftM,
      t: top + 1,
      w: __privateGet(this, _pdfWidth) * 0.24,
      size: 9
    });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
      aling: "left",
      txt: "Valor:",
      l: leftM,
      t: top + 10,
      w: __privateGet(this, _pdfWidth) * 0.25,
      size: 9
    });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
      aling: "right",
      txt: valorPagamento,
      l: leftM,
      t: top + 10,
      w: __privateGet(this, _pdfWidth) * 0.24,
      size: 9
    });
    top += 30;
  }
  __privateSet(this, _mtIndex, __privateGet(this, _mtIndex) + top);
};
traduzirFormaPagamento_fn = function(tPag) {
  const formasPagamento = {
    "01": "Dinheiro",
    "02": "Cheque",
    "03": "Cart\xE3o Cr\xE9dito",
    "04": "Cart\xE3o D\xE9bito",
    "05": "Cr\xE9dito Loja",
    "10": "Vale Alimenta\xE7\xE3o",
    "11": "Vale Refei\xE7\xE3o",
    "12": "Vale Presente",
    "13": "Vale Combust\xEDvel",
    "14": "Duplicata",
    "15": "Boleto",
    "16": "Dep\xF3sito",
    "17": "PIX Din\xE2mico",
    "18": "Transfer\xEAncia",
    "19": "Fidelidade",
    "20": "PIX Est\xE1tico",
    "21": "Cr\xE9dito Loja",
    "22": "Falha Eletr\xF4nico",
    "90": "Sem Pagamento",
    "99": "Outros"
  };
  return formasPagamento[tPag] || "Desconhecido";
};
bloco4_fn = function() {
  const ICMS = {
    vBC: "Base Calc. ICMS",
    vICMS: "Valor ICMS",
    vICMSDeson: "ICMS Desonerado",
    vFCP: "Valor FCP",
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
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "left",
    txt: " C\xC1LCULO DO IMPOSTO",
    l: 0,
    t: 1,
    size: 8
  });
  let top = 0, left = 0;
  Object.keys(ICMS).forEach((key, index) => {
    __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: 0 + left, t: 8 + top, w: __privateGet(this, _pdfWidth) * 0.11, h: 19 });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
      aling: "left",
      txt: ICMS[key],
      l: 2 + left,
      t: 9 + top,
      w: __privateGet(this, _pdfWidth) * 0.11
    });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
      font: "bold",
      aling: "right",
      txt: `R$ ${__privateGet(this, _xml).NFe.infNFe.total.ICMSTot[key]}`,
      l: 0 + left,
      t: 19 + top,
      w: (__privateGet(this, _pdfWidth) - __privateGet(this, _pdfMargin)) * 0.105 - (left > 0 ? 0 : 5),
      size: 9
    });
    left += __privateGet(this, _pdfWidth) * 0.11;
    if ((1 + index) % 9 === 0) {
      top += 19;
      left = 0;
    }
  });
  __privateSet(this, _mtIndex, __privateGet(this, _mtIndex) + (30 + top));
};
traduzirTipoFrete_fn = function(codigo) {
  const tiposFrete = {
    "0": "Frete por Conta do Remetente (CIF)",
    "1": "Frete por Conta do Destinat\xE1rio (FOB)",
    "2": "Frete por Conta de Terceiros",
    "3": "Transporte Pr\xF3prio Remetente",
    "4": "Transporte Pr\xF3prio Destinat\xE1rio",
    "9": "Sem Transporte"
  };
  return tiposFrete[String(codigo)] ?? "Tipo de Frete Desconhecido";
};
bloco5_fn = function() {
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "left",
    txt: "TRANSPORTADOR / VOLUMES TRANSPORTADOS",
    l: 0,
    t: 1,
    size: 8
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: 0, t: 8, w: __privateGet(this, _pdfWidth) * 0.29, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "NOME / RAZ\xC3O SOCIAL",
    l: 2,
    t: 9
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.transp.CPF || __privateGet(this, _xml).NFe.infNFe.transp.CNPJ || "",
    l: 2,
    t: 19,
    w: __privateGet(this, _pdfWidth) * 0.29,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.29, t: 8, w: __privateGet(this, _pdfWidth) * 0.15, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "FRETE",
    l: __privateGet(this, _pdfWidth) * 0.293,
    t: 9
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: `${__privateGet(this, _xml).NFe.infNFe.transp.modFrete} - ${__privateMethod(this, _danfe_instances, traduzirTipoFrete_fn).call(this, __privateGet(this, _xml).NFe.infNFe.transp.modFrete)}`,
    l: __privateGet(this, _pdfWidth) * 0.293,
    t: 19,
    w: __privateGet(this, _pdfWidth) * 0.15,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.44, t: 8, w: __privateGet(this, _pdfWidth) * 0.15, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "C\xD3DIGO ANTT",
    l: __privateGet(this, _pdfWidth) * 0.442,
    t: 9
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.transp?.veicTransp?.RNTC || "",
    l: __privateGet(this, _pdfWidth) * 0.44,
    t: 19,
    w: __privateGet(this, _pdfWidth) * 0.15,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.59, t: 8, w: __privateGet(this, _pdfWidth) * 0.15, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "PLACA DO VE\xCDCULO",
    l: __privateGet(this, _pdfWidth) * 0.592,
    t: 9
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.transp?.veicTransp?.placa || "",
    l: __privateGet(this, _pdfWidth) * 0.59,
    t: 19,
    w: __privateGet(this, _pdfWidth) * 0.15,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.74, t: 8, w: __privateGet(this, _pdfWidth) * 0.04, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "UF",
    l: __privateGet(this, _pdfWidth) * 0.742,
    t: 9
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.transp?.veicTransp?.UF || "",
    l: __privateGet(this, _pdfWidth) * 0.742,
    t: 19,
    w: __privateGet(this, _pdfWidth) * 0.04,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.78, t: 8, w: __privateGet(this, _pdfWidth) * 0.22, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "CNPJ / CPF",
    l: __privateGet(this, _pdfWidth) * 0.782,
    t: 9
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.transp?.transporta?.CNPJ || __privateGet(this, _xml).NFe.infNFe.transp?.transporta?.CPF || "",
    l: __privateGet(this, _pdfWidth) * 0.78,
    t: 19,
    w: __privateGet(this, _pdfWidth) * 0.22,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: 0, t: 27, w: __privateGet(this, _pdfWidth) * 0.44, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "ENDERE\xC7O",
    l: 2,
    t: 28
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.transp?.transporta?.xEnder || "",
    l: 2,
    t: 38,
    w: __privateGet(this, _pdfWidth) * 0.44,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.44, t: 27, w: __privateGet(this, _pdfWidth) * 0.3, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "MUNIC\xCDPIO",
    l: __privateGet(this, _pdfWidth) * 0.442,
    t: 28
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.transp?.transporta?.xMun || "",
    l: __privateGet(this, _pdfWidth) * 0.44,
    t: 38,
    w: __privateGet(this, _pdfWidth) * 0.3,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.74, t: 27, w: __privateGet(this, _pdfWidth) * 0.04, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "UF",
    l: __privateGet(this, _pdfWidth) * 0.742,
    t: 28
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.transp?.transporta?.UF || "",
    l: __privateGet(this, _pdfWidth) * 0.742,
    t: 38,
    w: __privateGet(this, _pdfWidth) * 0.04,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.78, t: 27, w: __privateGet(this, _pdfWidth) * 0.22, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: " INSCRI\xC7\xC3O ESTADUAL",
    l: __privateGet(this, _pdfWidth) * 0.782,
    t: 28
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.transp?.transporta?.IE || "",
    l: __privateGet(this, _pdfWidth) * 0.78,
    t: 38,
    w: __privateGet(this, _pdfWidth) * 0.22,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: 0, t: 46, w: __privateGet(this, _pdfWidth) * 0.11, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "QUANTIDADE",
    l: 2,
    t: 47
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.transp?.vol?.qVol || "",
    l: 2,
    t: 57,
    w: __privateGet(this, _pdfWidth) * 0.11,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.11, t: 46, w: __privateGet(this, _pdfWidth) * 0.17, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "ESP\xC9CIE",
    l: __privateGet(this, _pdfWidth) * 0.112,
    t: 47
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.transp?.vol?.esp || "",
    l: __privateGet(this, _pdfWidth) * 0.112,
    t: 57,
    w: __privateGet(this, _pdfWidth) * 0.17,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.28, t: 46, w: __privateGet(this, _pdfWidth) * 0.16, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "MARCA",
    l: __privateGet(this, _pdfWidth) * 0.282,
    t: 47
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.transp?.vol?.marca || "",
    l: __privateGet(this, _pdfWidth) * 0.28,
    t: 57,
    w: __privateGet(this, _pdfWidth) * 0.16,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.44, t: 46, w: __privateGet(this, _pdfWidth) * 0.17, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "NUMERA\xC7\xC3O",
    l: __privateGet(this, _pdfWidth) * 0.442,
    t: 47
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.transp?.vol?.nVol || "",
    l: __privateGet(this, _pdfWidth) * 0.44,
    t: 57,
    w: __privateGet(this, _pdfWidth) * 0.16,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.61, t: 46, w: __privateGet(this, _pdfWidth) * 0.19, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "PESO BRUTO",
    l: __privateGet(this, _pdfWidth) * 0.612,
    t: 47
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.transp?.vol?.pesoB || "",
    l: __privateGet(this, _pdfWidth) * 0.61,
    t: 57,
    w: __privateGet(this, _pdfWidth) * 0.16,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.8, t: 46, w: __privateGet(this, _pdfWidth) * 0.2, h: 19 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "PESO L\xCDQUIDO",
    l: __privateGet(this, _pdfWidth) * 0.802,
    t: 47
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.transp?.vol?.pesoL || "",
    l: __privateGet(this, _pdfWidth) * 0.8,
    t: 57,
    w: __privateGet(this, _pdfWidth) * 0.2,
    size: 9
  });
  __privateSet(this, _mtIndex, __privateGet(this, _mtIndex) + 68);
};
bloco6_fn = function() {
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "left",
    txt: "DADOS DOS PRODUTOS / SERVI\xC7OS",
    l: 0,
    t: 1,
    size: 8
  });
  let tabH = 0;
  if (__privateGet(this, _pagQtd) <= 1) {
    tabH = 10 + __privateGet(this, _pdfHeight) - __privateGet(this, _mtIndex) - 75;
  } else {
    tabH = 10 + __privateGet(this, _pdfHeight) - __privateGet(this, _mtIndex);
  }
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: 0, t: 9, w: __privateGet(this, _pdfWidth), h: tabH });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "C\xD3D. PRODUTO",
    l: 0,
    t: 15,
    w: __privateGet(this, _pdfWidth) * 0.1
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "DESCRI\xC7\xC3O DO PRODUTO / SERVI\xC7O",
    l: __privateGet(this, _pdfWidth) * 0.1,
    t: 15,
    w: __privateGet(this, _pdfWidth) * 0.25
  });
  __privateMethod(this, _danfe_instances, addLinhaVT_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.1, ts: 15, te: tabH + 15 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "NCM/SH",
    l: __privateGet(this, _pdfWidth) * 0.35,
    t: 15,
    w: __privateGet(this, _pdfWidth) * 0.05
  });
  __privateMethod(this, _danfe_instances, addLinhaVT_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.35, ts: 15, te: tabH + 15 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "O/CSOSN",
    l: __privateGet(this, _pdfWidth) * 0.4,
    t: 15,
    w: __privateGet(this, _pdfWidth) * 0.05
  });
  __privateMethod(this, _danfe_instances, addLinhaVT_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.4, ts: 15, te: tabH + 15 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "CFOP",
    l: __privateGet(this, _pdfWidth) * 0.45,
    t: 15,
    w: __privateGet(this, _pdfWidth) * 0.04
  });
  __privateMethod(this, _danfe_instances, addLinhaVT_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.45, ts: 15, te: tabH + 15 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "UN",
    l: __privateGet(this, _pdfWidth) * 0.49,
    t: 15,
    w: __privateGet(this, _pdfWidth) * 0.03
  });
  __privateMethod(this, _danfe_instances, addLinhaVT_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.49, ts: 15, te: tabH + 15 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "QUANT",
    l: __privateGet(this, _pdfWidth) * 0.52,
    t: 15,
    w: __privateGet(this, _pdfWidth) * 0.07
  });
  __privateMethod(this, _danfe_instances, addLinhaVT_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.52, ts: 15, te: tabH + 15 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "QUANT",
    l: __privateGet(this, _pdfWidth) * 0.59,
    t: 15,
    w: __privateGet(this, _pdfWidth) * 0.06
  });
  __privateMethod(this, _danfe_instances, addLinhaVT_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.59, ts: 15, te: tabH + 15 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "V. TOTAL",
    l: __privateGet(this, _pdfWidth) * 0.65,
    t: 15,
    w: __privateGet(this, _pdfWidth) * 0.06
  });
  __privateMethod(this, _danfe_instances, addLinhaVT_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.65, ts: 15, te: tabH + 15 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "V. DESC.",
    l: __privateGet(this, _pdfWidth) * 0.71,
    t: 15,
    w: __privateGet(this, _pdfWidth) * 0.06
  });
  __privateMethod(this, _danfe_instances, addLinhaVT_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.71, ts: 15, te: tabH + 15 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "B.C\xC1LC ICMS",
    l: __privateGet(this, _pdfWidth) * 0.77,
    t: 15,
    w: __privateGet(this, _pdfWidth) * 0.04
  });
  __privateMethod(this, _danfe_instances, addLinhaVT_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.77, ts: 15, te: tabH + 15 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "V. ICMS",
    l: __privateGet(this, _pdfWidth) * 0.81,
    t: 15,
    w: __privateGet(this, _pdfWidth) * 0.06
  });
  __privateMethod(this, _danfe_instances, addLinhaVT_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.81, ts: 15, te: tabH + 15 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "V. IPI",
    l: __privateGet(this, _pdfWidth) * 0.87,
    t: 15,
    w: __privateGet(this, _pdfWidth) * 0.04
  });
  __privateMethod(this, _danfe_instances, addLinhaVT_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.87, ts: 15, te: tabH + 15 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "ALIQ. ICM",
    l: __privateGet(this, _pdfWidth) * 0.91,
    t: 15,
    w: __privateGet(this, _pdfWidth) * 0.04
  });
  __privateMethod(this, _danfe_instances, addLinhaVT_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.91, ts: 15, te: tabH + 15 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "center",
    txt: "ALIQ. ICM",
    l: __privateGet(this, _pdfWidth) * 0.95,
    t: 15,
    w: __privateGet(this, _pdfWidth) * 0.04
  });
  __privateMethod(this, _danfe_instances, addLinhaVT_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.95, ts: 15, te: tabH + 15 });
  __privateMethod(this, _danfe_instances, addLinhaHT_fn).call(this, { t: 32, ls: 0, le: __privateGet(this, _pdfWidth) });
  let produtos = Array.isArray(__privateGet(this, _xml).NFe.infNFe.det) ? __privateGet(this, _xml).NFe.infNFe.det : [{ prod: __privateGet(this, _xml).NFe.infNFe.det.prod }];
  let nextProd = 30;
  produtos.forEach((el) => {
    const prod = el.prod;
    const imposto = el.imposto || {};
    const csosn = imposto.ICMS?.CSOSN || imposto.ICMS?.CST || "";
    const baseICMS = imposto.ICMS?.vBC ?? "0.00";
    const valorICMS = imposto.ICMS?.vICMS ?? "0.00";
    const valorIPI = imposto.IPI?.IPITrib?.vIPI ?? "0.00";
    const aliqICMS = imposto.ICMS?.pICMS ?? "0.00";
    const aliqIPI = imposto.IPI?.IPITrib?.pIPI ?? "0.00";
    const desconto = prod.vDesc ?? "0.00";
    const nLinha = prod.xProd.length <= 38 ? 1 : Math.ceil((prod.xProd.length - 38) / 18);
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "center", txt: prod.cEAN ?? "", l: 0, t: nextProd + (nLinha - 1) * 4, w: __privateGet(this, _pdfWidth) * 0.1 });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "left", txt: prod.xProd ?? "", l: __privateGet(this, _pdfWidth) * 0.106, t: nextProd, w: __privateGet(this, _pdfWidth) * 0.25 });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "center", txt: prod.NCM ?? "", l: __privateGet(this, _pdfWidth) * 0.35, t: nextProd + (nLinha - 1) * 4, w: __privateGet(this, _pdfWidth) * 0.05 });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "center", txt: csosn, l: __privateGet(this, _pdfWidth) * 0.4, t: nextProd + (nLinha - 1) * 4, w: __privateGet(this, _pdfWidth) * 0.05 });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "center", txt: prod.CFOP ?? "", l: __privateGet(this, _pdfWidth) * 0.45, t: nextProd + (nLinha - 1) * 4, w: __privateGet(this, _pdfWidth) * 0.04 });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "center", txt: prod.uCom ?? "", l: __privateGet(this, _pdfWidth) * 0.49, t: nextProd + (nLinha - 1) * 4, w: __privateGet(this, _pdfWidth) * 0.03 });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "center", txt: prod.qCom ?? "", l: __privateGet(this, _pdfWidth) * 0.52, t: nextProd + (nLinha - 1) * 4, w: __privateGet(this, _pdfWidth) * 0.07 });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "center", txt: (parseFloat(prod.vUnCom) || 0).toFixed(2), l: __privateGet(this, _pdfWidth) * 0.59, t: nextProd + (nLinha - 1) * 4, w: __privateGet(this, _pdfWidth) * 0.06 });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "center", txt: (parseFloat(prod.vProd) || 0).toFixed(2), l: __privateGet(this, _pdfWidth) * 0.65, t: nextProd + (nLinha - 1) * 4, w: __privateGet(this, _pdfWidth) * 0.06 });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "center", txt: (parseFloat(desconto) || 0).toFixed(2), l: __privateGet(this, _pdfWidth) * 0.71, t: nextProd + (nLinha - 1) * 4, w: __privateGet(this, _pdfWidth) * 0.06 });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "center", txt: (parseFloat(baseICMS) || 0).toFixed(2), l: __privateGet(this, _pdfWidth) * 0.77, t: nextProd + (nLinha - 1) * 4, w: __privateGet(this, _pdfWidth) * 0.04 });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "center", txt: (parseFloat(valorICMS) || 0).toFixed(2), l: __privateGet(this, _pdfWidth) * 0.81, t: nextProd + (nLinha - 1) * 4, w: __privateGet(this, _pdfWidth) * 0.06 });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "center", txt: (parseFloat(valorIPI) || 0).toFixed(2), l: __privateGet(this, _pdfWidth) * 0.87, t: nextProd + (nLinha - 1) * 4, w: __privateGet(this, _pdfWidth) * 0.04 });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "center", txt: (parseFloat(aliqICMS) || 0).toFixed(2) + "%", l: __privateGet(this, _pdfWidth) * 0.91, t: nextProd + (nLinha - 1) * 4, w: __privateGet(this, _pdfWidth) * 0.04 });
    __privateMethod(this, _danfe_instances, addTXT_fn).call(this, { aling: "center", txt: (parseFloat(aliqIPI) || 0).toFixed(2) + "%", l: __privateGet(this, _pdfWidth) * 0.95, t: nextProd + (nLinha - 1) * 4, w: __privateGet(this, _pdfWidth) * 0.04 });
    nextProd += 8 * nLinha;
  });
  __privateSet(this, _mtIndex, __privateGet(this, _mtIndex) + (tabH + 12));
  console.log(__privateGet(this, _mtIndex));
  __privateMethod(this, _danfe_instances, bloco7_fn).call(this);
};
//Limite maximo 787
bloco7_fn = function() {
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "left",
    txt: "DADOS ADICIONAIS",
    l: 0,
    t: 1,
    size: 8
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: 0, t: 9, w: __privateGet(this, _pdfWidth) * 0.65, h: 28 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "INFORMA\xC7\xD5ES COMPLEMENTARES",
    l: 2,
    t: 11
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.infAdic?.infCpl,
    l: 0,
    t: 9,
    w: __privateGet(this, _pdfWidth) * 0.2,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addRetangulo_fn).call(this, { l: __privateGet(this, _pdfWidth) * 0.65, t: 9, w: __privateGet(this, _pdfWidth) * 0.36, h: 28 });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "PESO L\xCDQUIDO",
    l: __privateGet(this, _pdfWidth) * 0.652,
    t: 11
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    font: "bold",
    aling: "center",
    txt: __privateGet(this, _xml).NFe.infNFe.transp?.vol?.pesoL,
    l: __privateGet(this, _pdfWidth) * 0.65,
    t: 9,
    w: __privateGet(this, _pdfWidth) * 0.36,
    size: 9
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "left",
    txt: "Impresso em 19/02/2025 as 08:58:52",
    l: 0,
    t: 39
  });
  __privateMethod(this, _danfe_instances, addTXT_fn).call(this, {
    aling: "right",
    txt: "Gerado em www.fsist.com.br",
    l: 0,
    t: 39,
    w: __privateGet(this, _pdfWidth) - __privateGet(this, _pdfMargin) * 2
  });
};
_pdfWidth = new WeakMap();
_pdfHeight = new WeakMap();
_pdfMargin = new WeakMap();
_pdfOpc = new WeakMap();
_mtIndex = new WeakMap();
_pagIndex = new WeakMap();
_pagQtd = new WeakMap();
base64IMG_fn = function() {
  return new Promise((resolve, reject) => {
    if (__privateGet(this, _logo) != null) {
      if (__privateGet(this, _isBrowser)) {
        if (__privateGet(this, _logo)) {
          fetch(__privateGet(this, _logo)).then((response) => response.blob()).then((blob) => __privateMethod(this, _danfe_instances, blob2base64_fn).call(this, blob)).catch(reject);
        } else {
          reject(new Error("Logo n\xE3o foi definido."));
        }
      } else {
        reject(new Error("M\xE9todo n\xE3o suportado no ambiente Node.js"));
      }
    } else {
      resolve(false);
    }
  });
};
addBase64IMG_fn = function(data = { l: 0, t: 0, w: 0, h: 0, base64: "" }, mtIndex = __privateGet(this, _mtIndex)) {
  __privateGet(this, _pdf).image(
    data.base64,
    data.l <= __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfMargin) + data.l : data.l,
    (data.t <= __privateGet(this, _pdfMargin) ? data.t + __privateGet(this, _pdfMargin) : data.t + __privateGet(this, _pdfMargin)) + mtIndex,
    { fit: [data.w, 50], align: "center", valign: "center" }
  );
};
blob2base64_fn = function(blob) {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};
addRetangulo_fn = function(data = { l: 0, t: 0, w: 0, h: 0 }, mtIndex = __privateGet(this, _mtIndex)) {
  __privateGet(this, _pdf).lineWidth(__privateGet(this, _pdfOpc).lineWidth).moveTo(data.l <= __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfMargin) : data.l, data.t + mtIndex + __privateGet(this, _pdfMargin)).lineTo(data.l + data.w >= __privateGet(this, _pdfWidth) ? __privateGet(this, _pdfWidth) - __privateGet(this, _pdfMargin) : data.l + data.w, data.t + mtIndex + __privateGet(this, _pdfMargin)).lineTo(data.l + data.w >= __privateGet(this, _pdfWidth) ? __privateGet(this, _pdfWidth) - __privateGet(this, _pdfMargin) : data.l + data.w, data.t + mtIndex + __privateGet(this, _pdfMargin) + data.h).lineTo(data.l <= __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfMargin) : data.l, data.t + mtIndex + __privateGet(this, _pdfMargin) + data.h).lineTo(data.l <= __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfMargin) : data.l, data.t + mtIndex + __privateGet(this, _pdfMargin) - __privateGet(this, _pdfOpc).lineWidth * 0.3).stroke();
};
//Linha trajada
addLinhaHT_fn = function(data = { t: 0, ls: 0, le: 0 }, mtIndex = __privateGet(this, _mtIndex)) {
  data.t = (data.t <= __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfMargin) : data.t) + mtIndex;
  data.t = data.t >= __privateGet(this, _pdfHeight) - __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfHeight) - __privateGet(this, _pdfMargin) : data.t;
  if (data.ls > data.le) {
    let temp = data.ls;
    data.ls = data.le;
    data.le = temp;
  }
  data.ls = data.ls <= __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfMargin) : data.ls;
  data.le = data.le >= __privateGet(this, _pdfWidth) - __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfWidth) - __privateGet(this, _pdfMargin) : data.le;
  __privateGet(this, _pdf).moveTo(data.ls, data.t).lineTo(data.le, data.t).dash(3, { space: 5 }).stroke(__privateGet(this, _pdfOpc).ltraj);
  __privateGet(this, _pdf).undash();
};
//Linha Horizontal
addLinhaH_fn = function(data = { t: 0, ls: 0, le: 0 }, mtIndex = __privateGet(this, _mtIndex)) {
  data.t = (data.t <= __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfMargin) : data.t) + mtIndex;
  data.t = data.t >= __privateGet(this, _pdfHeight) - __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfHeight) - __privateGet(this, _pdfMargin) : data.t;
  if (data.ls > data.le) {
    let temp = data.ls;
    data.ls = data.le;
    data.le = temp;
  }
  data.ls = data.ls <= __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfMargin) : data.ls;
  data.le = data.le >= __privateGet(this, _pdfWidth) - __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfWidth) - __privateGet(this, _pdfMargin) : data.le;
  __privateGet(this, _pdf).moveTo(data.ls, data.t).lineTo(data.le, data.t).stroke(__privateGet(this, _pdfOpc).borda);
};
//Linha vertical
addLinhaV_fn = function(data = { l: 0, ts: 0, te: 0 }, mtIndex = __privateGet(this, _mtIndex)) {
  data.l = data.l <= __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfMargin) : data.l;
  data.l = data.l >= __privateGet(this, _pdfWidth) - __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfWidth) - __privateGet(this, _pdfMargin) : data.l;
  if (data.ts > data.te) {
    let temp = data.ts;
    data.ts = data.te;
    data.te = temp;
  }
  data.ts = (data.ts <= __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfMargin) : data.ts) + mtIndex;
  data.te = (data.te >= __privateGet(this, _pdfWidth) - __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfWidth) - __privateGet(this, _pdfMargin) : data.te) + mtIndex;
  __privateGet(this, _pdf).moveTo(data.l, data.ts).lineTo(data.l, data.te).stroke(__privateGet(this, _pdfOpc).borda);
};
addLinhaVT_fn = function(data = { l: 0, ts: 0, te: 0 }, mtIndex = __privateGet(this, _mtIndex)) {
  data.l = data.l <= __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfMargin) : data.l;
  data.l = data.l >= __privateGet(this, _pdfWidth) - __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfWidth) - __privateGet(this, _pdfMargin) : data.l;
  if (data.ts > data.te) {
    let temp = data.ts;
    data.ts = data.te;
    data.te = temp;
  }
  data.ts = (data.ts <= __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfMargin) : data.ts) + mtIndex;
  data.te = (data.te >= __privateGet(this, _pdfWidth) - __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfWidth) - __privateGet(this, _pdfMargin) : data.te) + mtIndex;
  __privateGet(this, _pdf).moveTo(data.l, data.ts).lineTo(data.l, data.te).dash(3, { space: 5 }).stroke(__privateGet(this, _pdfOpc).ltraj);
};
//Adicionar texto
addTXT_fn = function(data, mtIndex = __privateGet(this, _mtIndex)) {
  let font = "";
  switch (data.font) {
    case "italic":
      font = "Times-Italic";
      break;
    case "bold":
      font = "Times-Bold";
      break;
    default:
      font = "Times-Roman";
      break;
  }
  __privateGet(this, _pdf).font(font).fillColor(__privateGet(this, _pdfOpc).txt).fontSize(data.size || 7).text(
    data.txt,
    data.l <= __privateGet(this, _pdfMargin) ? __privateGet(this, _pdfMargin) + data.l : data.l,
    (data.t <= __privateGet(this, _pdfMargin) ? data.t + __privateGet(this, _pdfMargin) : data.t + __privateGet(this, _pdfMargin)) + mtIndex,
    {
      width: (data.w && data.w >= __privateGet(this, _pdfWidth) ? data.w - data.l : data.w) ?? __privateGet(this, _pdfWidth) - data.l,
      align: data.aling || "center"
    }
  );
};
export {
  danfe
};
//# sourceMappingURL=index.js.map