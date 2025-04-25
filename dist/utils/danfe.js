var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _danfe_instances, _danfe_pdf, _danfe_nextBloco, _danfe_xml, _danfe_xmlRes, _danfe_logo, _danfe_imgDemo, _danfe_demo, _danfe_bloco0, _danfe_bloco1, _danfe_bloco2, _danfe_bloco3, _danfe_bloco4, _danfe_bloco5, _danfe_bloco6, _danfe_bloco7, _danfe_pdfWidth, _danfe_pdfHeight, _danfe_pdfMargin, _danfe_pdfOpc, _danfe_mtIndex, _danfe_pagIndex, _danfe_pagQtd, _danfe_readImg, _danfe_blob2base64, _danfe_addRetangulo, _danfe_addLinhaHT, _danfe_addLinhaH, _danfe_addLinhaV, _danfe_addLinhaVT, _danfe_addTXT;
import { XMLParser } from "fast-xml-parser";
import PDFDocument from "pdfkit";
import blobStream from "blob-stream";
function makePDF(tipo, data = { xml: "", xmlRes: "", logo: "" }) {
    return new Promise((resolv, reject) => {
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@",
            parseTagValue: false, // Evita conversão automática de valores
        });
        let xmlObj = parser.parse(data.xml);
        switch (tipo) {
            case "danfe":
                console.log(xmlObj);
                const danfeInstance = new danfe({ xml: xmlObj, xmlRes: (typeof data.xmlRes != "undefined" ? parser.parse(data.xmlRes) : null) });
                danfeInstance.getPDF().then(resolv).catch(reject); // ou `.build()` ou `.render()`, depende da sua classe
            default:
                reject(`Tipo de PDF não suportado: ${tipo}`);
        }
    });
}
class danfe {
    constructor(data = {}) {
        _danfe_instances.add(this);
        _danfe_pdf.set(this, void 0);
        _danfe_nextBloco.set(this, 0);
        _danfe_xml.set(this, {});
        _danfe_xmlRes.set(this, null);
        _danfe_logo.set(this, null);
        _danfe_imgDemo.set(this, null);
        // ---------------- FUNCOES ----------------
        _danfe_pdfWidth.set(this, 595.28);
        _danfe_pdfHeight.set(this, 841.89);
        _danfe_pdfMargin.set(this, 5);
        _danfe_pdfOpc.set(this, {
            borda: "black",
            txt: "black",
            lineWidth: 1,
            ltraj: "#4b5563"
        });
        _danfe_mtIndex.set(this, 0); //Margem do topo para proximo bloco
        _danfe_pagIndex.set(this, 1);
        _danfe_pagQtd.set(this, 1);
        __classPrivateFieldSet(this, _danfe_xml, data.xml || {}, "f");
        __classPrivateFieldSet(this, _danfe_xmlRes, data.xmlRes || null, "f");
        __classPrivateFieldSet(this, _danfe_logo, data.logo || null, "f");
        __classPrivateFieldSet(this, _danfe_imgDemo, data.imgDemo || null, "f");
        __classPrivateFieldSet(this, _danfe_pdf, new PDFDocument({
            bufferPages: true,
            margin: 0,
            size: [
                __classPrivateFieldGet(this, _danfe_pdfWidth, "f"),
                __classPrivateFieldGet(this, _danfe_pdfHeight, "f")
            ],
            info: {
                Author: "Kalmon Valadao Tavares",
                Title: "DANFE",
                Creator: "Guara DEV",
                Producer: "http://github.com/brasil-js/danfe"
            }
        }), "f");
    }
    getPDF() {
        return new Promise((resolve, reject) => {
            try {
                const stream = __classPrivateFieldGet(this, _danfe_pdf, "f").pipe(blobStream());
                __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_bloco0).call(this);
                __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_bloco1).call(this);
                __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_bloco2).call(this);
                __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_bloco3).call(this);
                __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_bloco4).call(this);
                __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_bloco5).call(this);
                __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_bloco6).call(this);
                if (__classPrivateFieldGet(this, _danfe_imgDemo, "f") != null)
                    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_demo).call(this);
                __classPrivateFieldGet(this, _danfe_pdf, "f").end();
                stream.on('finish', () => {
                    resolve(stream.toBlobURL('application/pdf'));
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
_danfe_pdf = new WeakMap(), _danfe_nextBloco = new WeakMap(), _danfe_xml = new WeakMap(), _danfe_xmlRes = new WeakMap(), _danfe_logo = new WeakMap(), _danfe_imgDemo = new WeakMap(), _danfe_pdfWidth = new WeakMap(), _danfe_pdfHeight = new WeakMap(), _danfe_pdfMargin = new WeakMap(), _danfe_pdfOpc = new WeakMap(), _danfe_mtIndex = new WeakMap(), _danfe_pagIndex = new WeakMap(), _danfe_pagQtd = new WeakMap(), _danfe_instances = new WeakSet(), _danfe_demo = function _danfe_demo() {
    __classPrivateFieldGet(this, _danfe_pdf, "f").image(__classPrivateFieldGet(this, _danfe_imgDemo, "f"), 0, 0, { width: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") }).text("", 0, 0);
}, _danfe_bloco0 = function _danfe_bloco0() {
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: 0, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.03, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.805, h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.03 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, { aling: 'left', txt: "IDENTIFICAÇÃO E ASSINATURA DO RECEBEDOR", l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.18, t: 28, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.5 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: 0, t: 0, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.805, h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.06 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, { aling: 'justify', l: 2, t: 3, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.78, txt: `RECEBEMOS DE ${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.emit.xNome} OS PRODUTOS E/OU SERVIÇOS CONSTANTES DA NOTA FISCAL ELETRÔNICA INDICADA ABAIXO. EMISSÃO: ${new Date(__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.ide.dhEmi).toLocaleString().split(",")[0]} VALOR TOTAL: R$ ${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.total.ICMSTot.vNF} DESTINATÁRIO: ${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.dest.xNome} - ${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.dest.enderDest.xLgr}, N°${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.dest.enderDest.nro}, Bairro ${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.dest.enderDest.xBairro}, ${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.dest.enderDest.xMun}}-${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.dest.enderDest.UF}` });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: 0, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.03, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.175, h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.03 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, { aling: 'left', txt: "DATA DE RECEBIMENTO", l: 2, t: 28, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.17 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: 0, t: 0, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f"), h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.06 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, { aling: 'center', font: "bold", txt: "NF-e", l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.81, t: 6, size: 15, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.18 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, { aling: 'center', font: "bold", txt: `Nº.  ${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.ide.nNF.padStart(9, "0").slice(0, 3)}.${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.ide.nNF.padStart(9, "0").slice(3, 6)}.${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.ide.nNF.padStart(9, "0").slice(6, 9)}`, l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.81, t: 22, size: 12, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.18 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, { aling: 'center', font: "bold", txt: `Série ${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.ide.serie}`, l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.81, t: 34, size: 12, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.18 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addLinhaHT).call(this, { t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.07, ls: 0, le: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") });
    __classPrivateFieldSet(this, _danfe_mtIndex, __classPrivateFieldGet(this, _danfe_mtIndex, "f") + __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.071, "f");
}, _danfe_bloco1 = async function _danfe_bloco1() {
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: 0, t: 0, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.41, h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.108 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', font: "italic", txt: "IDENTIFICAÇÃO DO EMITENTE",
        l: 0, t: 3, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.4
    });
    let mtLogo = 0;
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', font: "bold", txt: __classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.emit.xNome,
        l: 0, t: 34 + mtLogo, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.4, size: 12
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: `${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.emit.enderEmit.xLgr}, N°${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.emit.enderEmit.nro}, ${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.emit.enderEmit.xBairro}, CEP ${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.emit.enderEmit.CEP}`,
        l: 0, t: 44 + mtLogo, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.4, size: 10
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: `${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.emit.enderEmit.xMun} - ${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.emit.enderEmit.UF}, Fone ${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.emit.enderEmit.fone}`,
        l: 0, t: 54 + mtLogo, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.4, size: 10
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.41, t: 0, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.168, h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.108 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', font: "bold", txt: "DANFE",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.41, t: 8, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.167, size: 12
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "Documento Auxiliar da Nota Fiscal Eletrônica",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.41, t: 20, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.167
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "0 - ENTRADA\n1 - SAÍDA",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.42, t: 39, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.169, size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', font: "bold", txt: `Nº. ${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.ide.nNF}`,
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.41, t: 61, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.167, size: 11
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', font: "bold", txt: `Série ${__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.ide.serie}`,
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.41, t: 71, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.167, size: 11
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', font: 'italic', txt: `Folha ${__classPrivateFieldGet(this, _danfe_pagIndex, "f")}/${__classPrivateFieldGet(this, _danfe_pagQtd, "f")}`,
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.41, t: 81, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.167, size: 8
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.54, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.045, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.023, h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.023 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', font: "bold", txt: "1",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.54, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.05, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.023, size: 15
    });
    //Codigo de barras
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.578, t: 0, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f"), h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.054 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.578, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.054, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f"), h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.027 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "IDENTIFICAÇÃO DO EMITENTE",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.582, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.056
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "5124 1047 5063 0600 0188 5500 0000 0002 4710 0002 0235",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.582, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.071,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f"),
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.578, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.0808, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f"), h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.027 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "Consulta de autenticidade no portal nacional da NF-e",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.582, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.084,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f"),
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "www.nfe.fazenda.gov.br/portal ou no site da Sefaz Autorizadora",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.582, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.097,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f"),
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: 0, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.108, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.578, h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.023 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "NATUREZA DA OPERAÇÃO",
        l: 3, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.11
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "VENDA",
        l: 3, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.121, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.56,
        font: "bold", size: 10
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.578, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.108, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.578, h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.023 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "PROTOCOLO DE AUTORIZAÇÃO DE USO",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.58, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.11
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "1512500663278923 - 14/01/2025 13:50:32",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.582, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.122,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f"),
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: 0, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.131, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.256, h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.023 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "INSCRIÇÃO ESTADUAL",
        l: 2, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.133
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "XX.XXX.XXX/XXX-XX",
        l: 0, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.145,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.24,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.256, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.131, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.249, h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.023 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "INSCRIÇÃO MUNICIPAL",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.259, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.133
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "XX.XXX.XXX/XXX-XX",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.259, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.145,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.24,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.505, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.131, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.578, h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.023 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "INSCRIÇÃO ESTADUAL DO SUBST. TRIBUT",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.507, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.133
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "XX.XXX.XXX/XXX-XX",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.507, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.145,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.24,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.753, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.131, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.578, h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.023 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "CNPJ / CPF",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.755, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.133
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "XX.XXX.XXX/XXX-XX",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.755, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.145,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f"),
        size: 9
    });
    __classPrivateFieldSet(this, _danfe_mtIndex, __classPrivateFieldGet(this, _danfe_mtIndex, "f") + __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.16, "f");
}, _danfe_bloco2 = function _danfe_bloco2() {
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'left', txt: "DESTINATÁRIO / REMETENTE",
        l: 0, t: 1,
        size: 8
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: 0, t: 8, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.61, h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.023 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "NOME / RAZÃO SOCIAL",
        l: 2, t: 10
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'left', txt: "ADELMO CARLOS CIQUEIRA SILVA",
        l: 2, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.023,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.61,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.61, t: 8, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.225, h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.023 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "CNPJ / CPF",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.61, t: 10
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "040.799.071-25",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.61, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.023,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.225,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.835, t: 8, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.225, h: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.023 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "DATA DA EMISSÃO",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.835, t: 10
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "10/10/2024",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.835, t: __classPrivateFieldGet(this, _danfe_pdfHeight, "f") * 0.023,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.15,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: 0, t: 27.5, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.47, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "ENDEREÇO",
        l: 2, t: 29
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'left', txt: "RUA DAS SAMAMBAIAS, 144",
        l: 2, t: 39,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.45,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.47, t: 27.5, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.205, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "BAIRRO / DISTRITO",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.472, t: 29
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "PARQUE ELDORADO",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.472, t: 39,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.2,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.675, t: 27.5, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.16, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "BAIRRO / DISTRITO",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.677, t: 29
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "78850-000",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.677, t: 39,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.16,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.835, t: 27.5, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.225, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "DATA DA SAÍDA/ENTRADA",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.837, t: 29
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "10/10/2024",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.837, t: 39,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.16,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: 0, t: 46.5, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.47, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "ENDEREÇO",
        l: 2, t: 48.5
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'left', txt: "RUA DAS SAMAMBAIAS, 144",
        l: 2, t: 58.5,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.45,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.47, t: 46.5, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.04, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "UF",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.472, t: 48.5
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "MT",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.47, t: 58.5,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.04,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.510, t: 46.5, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.165, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "FONE / FAX",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.512, t: 48.5
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "MT",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.512, t: 58.5,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.165,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.675, t: 46.5, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.16, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "INSCRIÇÃO ESTADUAL",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.677, t: 48.5
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "MT",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.677, t: 58.5,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.16,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.835, t: 46.5, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.1565, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: " HORA DA SAÍDA/ENTRADA",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.834, t: 48.5
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "MT",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.834, t: 58.5,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.1565,
        size: 9
    });
    __classPrivateFieldSet(this, _danfe_mtIndex, __classPrivateFieldGet(this, _danfe_mtIndex, "f") + 69, "f");
}, _danfe_bloco3 = function _danfe_bloco3(leftM = 2, addDesc = true) {
    if (addDesc)
        __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
            font: "bold",
            aling: 'left', txt: "PAGAMENTO",
            l: 0, t: 1,
            size: 8
        });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: leftM, t: 8, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.25, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "Forma:",
        l: leftM, t: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'right', txt: "Pagamento Instantâneo (PIX)",
        l: leftM, t: 9,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.24,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "Valor:",
        l: leftM, t: 18,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.25,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'right', txt: "R$ 5.000,00",
        l: leftM, t: 18,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.24,
        size: 9
    });
    __classPrivateFieldSet(this, _danfe_mtIndex, __classPrivateFieldGet(this, _danfe_mtIndex, "f") + 30, "f");
}, _danfe_bloco4 = function _danfe_bloco4() {
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
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'left', txt: " CÁLCULO DO IMPOSTO",
        l: 0, t: 1,
        size: 8
    });
    let top = 0, left = 0;
    Object.keys(ICMS).forEach((key, index) => {
        __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: 0 + left, t: 8 + top, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.11, h: 19 });
        __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
            aling: 'left', txt: ICMS[key],
            l: 2 + left, t: 9 + top, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.11
        });
        __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
            font: "bold",
            aling: 'right', txt: "R$ 0.00",
            l: 0 + left, t: 19 + top,
            w: ((__classPrivateFieldGet(this, _danfe_pdfWidth, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) * 0.105) - (left > 0 ? 0 : 5),
            size: 9
        });
        left += __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.11;
        if ((1 + index) % 9 === 0) {
            top += 19;
            left = 0;
        }
    });
    __classPrivateFieldSet(this, _danfe_mtIndex, __classPrivateFieldGet(this, _danfe_mtIndex, "f") + (30 + top), "f");
}, _danfe_bloco5 = function _danfe_bloco5() {
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'left', txt: "TRANSPORTADOR / VOLUMES TRANSPORTADOS",
        l: 0, t: 1,
        size: 8
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: 0, t: 8, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.29, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "NOME / RAZÃO SOCIAL",
        l: 2, t: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "",
        l: 2, t: 19,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.29,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.29, t: 8, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.15, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "FRETE",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.293, t: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "9-Sem Transporte",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.293, t: 19,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.15,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.44, t: 8, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.15, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "CÓDIGO ANTT",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.442, t: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.44, t: 19,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.15,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.59, t: 8, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.15, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "PLACA DO VEÍCULO",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.592, t: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.59, t: 19,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.15,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.74, t: 8, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.04, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "UF",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.742, t: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.742, t: 19,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.04,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.78, t: 8, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.22, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "CNPJ / CPF",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.782, t: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.78, t: 19,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.22,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: 0, t: 27, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.44, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "ENDEREÇO",
        l: 2, t: 28
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "",
        l: 2, t: 38,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.44,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.44, t: 27, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.30, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "MUNICÍPIO",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.442, t: 28
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.44, t: 38,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.30,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.74, t: 27, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.04, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "UF",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.742, t: 28
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.742, t: 38,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.04,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.78, t: 27, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.22, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: " INSCRIÇÃO ESTADUAL",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.782, t: 28
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.78, t: 38,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.22,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: 0, t: 46, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.11, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "QUANTIDADE",
        l: 2, t: 47
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "",
        l: 2, t: 57,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.11,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.11, t: 46, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.17, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "ESPÉCIE",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.112, t: 47
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.112, t: 57,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.17,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.28, t: 46, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.16, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "MARCA",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.282, t: 47
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.28, t: 57,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.16,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.44, t: 46, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.17, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "NUMERAÇÃO",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.442, t: 47
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.44, t: 57,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.16,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.61, t: 46, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.19, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "PESO BRUTO",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.612, t: 47
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.61, t: 57,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.16,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.80, t: 46, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.20, h: 19 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "PESO LÍQUIDO",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.802, t: 47
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.80, t: 57,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.2,
        size: 9
    });
    __classPrivateFieldSet(this, _danfe_mtIndex, __classPrivateFieldGet(this, _danfe_mtIndex, "f") + 68, "f");
}, _danfe_bloco6 = function _danfe_bloco6() {
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'left', txt: "DADOS DOS PRODUTOS / SERVIÇOS",
        l: 0, t: 1,
        size: 8
    });
    let tabH = 0;
    if (__classPrivateFieldGet(this, _danfe_pagQtd, "f") <= 1) { // Adicionar margem final
        tabH = (10 + __classPrivateFieldGet(this, _danfe_pdfHeight, "f") - __classPrivateFieldGet(this, _danfe_mtIndex, "f")) - 75;
    }
    else {
        tabH = (10 + __classPrivateFieldGet(this, _danfe_pdfHeight, "f") - __classPrivateFieldGet(this, _danfe_mtIndex, "f"));
    }
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: 0, t: 9, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f"), h: tabH });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "CÓD. PRODUTO",
        l: 0, t: 12,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.10,
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "DESCRIÇÃO DO PRODUTO / SERVIÇO",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.10, t: 12,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.25,
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addLinhaVT).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.10, ts: 15, te: tabH + 15 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "NCM/SH",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.35, t: 12,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.05,
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addLinhaVT).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.35, ts: 15, te: tabH + 15 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "O/CSOSN",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.40, t: 12,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.05,
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addLinhaVT).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.40, ts: 15, te: tabH + 15 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "CFOP",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.45, t: 12,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.04,
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addLinhaVT).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.45, ts: 15, te: tabH + 15 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "UN",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.49, t: 12,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.03,
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addLinhaVT).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.49, ts: 15, te: tabH + 15 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "QUANT",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.52, t: 12,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.07,
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addLinhaVT).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.52, ts: 15, te: tabH + 15 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "QUANT",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.59, t: 12,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.06,
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addLinhaVT).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.59, ts: 15, te: tabH + 15 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "V. TOTAL",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.65, t: 12,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.06,
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addLinhaVT).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.65, ts: 15, te: tabH + 15 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "V. DESC.",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.71, t: 12,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.06,
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addLinhaVT).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.71, ts: 15, te: tabH + 15 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "B.CÁLC ICMS",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.77, t: 12,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.04,
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addLinhaVT).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.77, ts: 15, te: tabH + 15 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "V. ICMS",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.81, t: 12,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.06,
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addLinhaVT).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.81, ts: 15, te: tabH + 15 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "V. IPI",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.87, t: 12,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.04,
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addLinhaVT).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.87, ts: 15, te: tabH + 15 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "ALIQ. ICM",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.91, t: 12,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.04,
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addLinhaVT).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.91, ts: 15, te: tabH + 15 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'center', txt: "ALIQ. ICM",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.95, t: 12,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.04,
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addLinhaVT).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.95, ts: 15, te: tabH + 15 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addLinhaHT).call(this, { t: 32, ls: 0, le: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") });
    let nextProd = 32;
    if (Array.isArray(__classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.det)) {
        __classPrivateFieldGet(this, _danfe_xml, "f").NFe.infNFe.det.forEach((el) => {
            __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
                aling: 'center', txt: el.prod.cEAN,
                l: 0, t: nextProd,
                w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.10,
            });
            __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
                aling: 'center', txt: el.prod.xProd,
                l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.10, t: nextProd,
                w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.25,
            });
            __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
                aling: 'center', txt: el.prod.NCM,
                l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.35, t: nextProd,
                w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.05,
            });
            __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
                aling: 'center', txt: "O/CSOSN",
                l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.40, t: nextProd,
                w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.05,
            });
            __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
                aling: 'center', txt: el.prod.CFOP,
                l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.45, t: nextProd,
                w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.04,
            });
            __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
                aling: 'center', txt: el.prod.uCom,
                l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.49, t: nextProd,
                w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.03,
            });
            __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
                aling: 'center', txt: el.prod.qCom,
                l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.52, t: nextProd,
                w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.07,
            });
            __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
                aling: 'center', txt: (1 * el.prod.vUnCom).toFixed(2),
                l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.59, t: nextProd,
                w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.06,
            });
            __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
                aling: 'center', txt: el.prod.vProd,
                l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.65, t: nextProd,
                w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.06,
            });
            __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
                aling: 'center', txt: el.prod.vDesc,
                l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.71, t: nextProd,
                w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.06,
            });
            __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
                aling: 'center', txt: "B.CÁLC ICMS",
                l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.77, t: nextProd,
                w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.04,
            });
            __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
                aling: 'center', txt: "V. ICMS",
                l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.81, t: nextProd,
                w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.06,
            });
            __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
                aling: 'center', txt: "V. IPI",
                l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.87, t: nextProd,
                w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.04,
            });
            __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
                aling: 'center', txt: "ALIQ. ICM",
                l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.91, t: nextProd,
                w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.04,
            });
            __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
                aling: 'center', txt: "ALIQ. ICM",
                l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.95, t: nextProd,
                w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.04,
            });
            //xProd utilizou 2 linhas!
            while (el.prod.xProd.length > 28) {
                nextProd += 9;
                el.prod.xProd = el.prod.xProd.slice(0, 28);
                console.log("nexct!");
            }
            nextProd += 9;
        });
    }
    __classPrivateFieldSet(this, _danfe_mtIndex, __classPrivateFieldGet(this, _danfe_mtIndex, "f") + (tabH + 12), "f");
    console.log(__classPrivateFieldGet(this, _danfe_mtIndex, "f"));
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_bloco7).call(this);
}, _danfe_bloco7 = function _danfe_bloco7() {
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'left', txt: "DADOS ADICIONAIS",
        l: 0, t: 1,
        size: 8
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: 0, t: 9, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.65, h: 28 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "PESO LÍQUIDO",
        l: 2, t: 11
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "",
        l: 0, t: 9,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.2,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addRetangulo).call(this, { l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.65, t: 9, w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.36, h: 28 });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "PESO LÍQUIDO",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.652, t: 11
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        font: "bold",
        aling: 'center', txt: "",
        l: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.65, t: 9,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") * 0.36,
        size: 9
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'left', txt: "Impresso em 19/02/2025 as 08:58:52",
        l: 0, t: 39
    });
    __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_addTXT).call(this, {
        aling: 'right', txt: "Gerado em www.fsist.com.br",
        l: 0, t: 39,
        w: __classPrivateFieldGet(this, _danfe_pdfWidth, "f") - (__classPrivateFieldGet(this, _danfe_pdfMargin, "f") * 2)
    });
}, _danfe_readImg = function _danfe_readImg() {
    return new Promise((resolve, reject) => {
        if (typeof require === "undefined") {
            if (__classPrivateFieldGet(this, _danfe_logo, "f")) {
                fetch(__classPrivateFieldGet(this, _danfe_logo, "f"))
                    .then(response => response.blob())
                    .then(blob => __classPrivateFieldGet(this, _danfe_instances, "m", _danfe_blob2base64).call(this, blob))
                    .then(resolve)
                    .catch(reject);
            }
            else {
                reject(new Error("Logo não foi definido."));
            }
        }
        else {
            reject(new Error("Método não suportado no ambiente Node.js"));
        }
    });
}, _danfe_blob2base64 = function _danfe_blob2base64(blob) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise(resolve => {
        reader.onloadend = () => {
            resolve(reader.result);
        };
    });
}, _danfe_addRetangulo = function _danfe_addRetangulo(data = { l: 0, t: 0, w: 0, h: 0 }, mtIndex = __classPrivateFieldGet(this, _danfe_mtIndex, "f")) {
    __classPrivateFieldGet(this, _danfe_pdf, "f").lineWidth(__classPrivateFieldGet(this, _danfe_pdfOpc, "f").lineWidth)
        .moveTo(data.l <= __classPrivateFieldGet(this, _danfe_pdfMargin, "f") ? __classPrivateFieldGet(this, _danfe_pdfMargin, "f") : data.l, data.t + mtIndex + __classPrivateFieldGet(this, _danfe_pdfMargin, "f"))
        .lineTo((data.l + data.w) >= __classPrivateFieldGet(this, _danfe_pdfWidth, "f") ? __classPrivateFieldGet(this, _danfe_pdfWidth, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f") : (data.l + data.w), data.t + mtIndex + __classPrivateFieldGet(this, _danfe_pdfMargin, "f"))
        .lineTo((data.l + data.w) >= __classPrivateFieldGet(this, _danfe_pdfWidth, "f") ? __classPrivateFieldGet(this, _danfe_pdfWidth, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f") : (data.l + data.w), data.t + mtIndex + __classPrivateFieldGet(this, _danfe_pdfMargin, "f") + data.h)
        .lineTo(data.l <= __classPrivateFieldGet(this, _danfe_pdfMargin, "f") ? __classPrivateFieldGet(this, _danfe_pdfMargin, "f") : data.l, data.t + mtIndex + __classPrivateFieldGet(this, _danfe_pdfMargin, "f") + data.h)
        .lineTo(data.l <= __classPrivateFieldGet(this, _danfe_pdfMargin, "f") ? __classPrivateFieldGet(this, _danfe_pdfMargin, "f") : data.l, data.t + mtIndex + __classPrivateFieldGet(this, _danfe_pdfMargin, "f") - (__classPrivateFieldGet(this, _danfe_pdfOpc, "f").lineWidth * .3))
        .stroke();
}, _danfe_addLinhaHT = function _danfe_addLinhaHT(data = { t: 0, ls: 0, le: 0 }, mtIndex = __classPrivateFieldGet(this, _danfe_mtIndex, "f")) {
    data.t = (data.t <= __classPrivateFieldGet(this, _danfe_pdfMargin, "f") ? __classPrivateFieldGet(this, _danfe_pdfMargin, "f") : data.t) + mtIndex;
    data.t = (data.t >= (__classPrivateFieldGet(this, _danfe_pdfHeight, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) ? (__classPrivateFieldGet(this, _danfe_pdfHeight, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) : data.t); //Bloqueo de estouro Final
    if (data.ls > data.le) { //Corrigir ordem
        let temp = data.ls;
        data.ls = data.le;
        data.le = temp;
    }
    data.ls = (data.ls <= __classPrivateFieldGet(this, _danfe_pdfMargin, "f") ? __classPrivateFieldGet(this, _danfe_pdfMargin, "f") : data.ls); //Bloqueo de estouro inicial
    data.le = (data.le >= (__classPrivateFieldGet(this, _danfe_pdfWidth, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) ? (__classPrivateFieldGet(this, _danfe_pdfWidth, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) : data.le); //Bloqueo de estouro Final
    __classPrivateFieldGet(this, _danfe_pdf, "f").moveTo(data.ls, data.t).lineTo(data.le, data.t).dash(3, { space: 5 }).stroke(__classPrivateFieldGet(this, _danfe_pdfOpc, "f").ltraj);
    __classPrivateFieldGet(this, _danfe_pdf, "f").undash();
}, _danfe_addLinhaH = function _danfe_addLinhaH(data = { t: 0, ls: 0, le: 0 }, mtIndex = __classPrivateFieldGet(this, _danfe_mtIndex, "f")) {
    data.t = (data.t <= __classPrivateFieldGet(this, _danfe_pdfMargin, "f") ? __classPrivateFieldGet(this, _danfe_pdfMargin, "f") : data.t) + mtIndex;
    data.t = (data.t >= (__classPrivateFieldGet(this, _danfe_pdfHeight, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) ? (__classPrivateFieldGet(this, _danfe_pdfHeight, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) : data.t); //Bloqueo de estouro Final
    if (data.ls > data.le) { //Corrigir ordem
        let temp = data.ls;
        data.ls = data.le;
        data.le = temp;
    }
    data.ls = (data.ls <= __classPrivateFieldGet(this, _danfe_pdfMargin, "f") ? __classPrivateFieldGet(this, _danfe_pdfMargin, "f") : data.ls); //Bloqueo de estouro inicial
    data.le = (data.le >= (__classPrivateFieldGet(this, _danfe_pdfWidth, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) ? (__classPrivateFieldGet(this, _danfe_pdfWidth, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) : data.le); //Bloqueo de estouro Final
    __classPrivateFieldGet(this, _danfe_pdf, "f").moveTo(data.ls, data.t).lineTo(data.le, data.t).stroke(__classPrivateFieldGet(this, _danfe_pdfOpc, "f").borda);
}, _danfe_addLinhaV = function _danfe_addLinhaV(data = { l: 0, ts: 0, te: 0 }, mtIndex = __classPrivateFieldGet(this, _danfe_mtIndex, "f")) {
    data.l = (data.l <= __classPrivateFieldGet(this, _danfe_pdfMargin, "f") ? __classPrivateFieldGet(this, _danfe_pdfMargin, "f") : data.l);
    data.l = (data.l >= (__classPrivateFieldGet(this, _danfe_pdfWidth, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) ? (__classPrivateFieldGet(this, _danfe_pdfWidth, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) : data.l); //Bloqueo de estouro Final
    if (data.ts > data.te) { //Corrigir ordem
        let temp = data.ts;
        data.ts = data.te;
        data.te = temp;
    }
    data.ts = (data.ts <= __classPrivateFieldGet(this, _danfe_pdfMargin, "f") ? __classPrivateFieldGet(this, _danfe_pdfMargin, "f") : data.ts) + mtIndex; //Bloqueo de estouro inicial
    data.te = (data.te >= (__classPrivateFieldGet(this, _danfe_pdfWidth, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) ? (__classPrivateFieldGet(this, _danfe_pdfWidth, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) : data.te) + mtIndex; //Bloqueo de estouro Final
    __classPrivateFieldGet(this, _danfe_pdf, "f").moveTo(data.l, data.ts).lineTo(data.l, data.te).stroke(__classPrivateFieldGet(this, _danfe_pdfOpc, "f").borda);
}, _danfe_addLinhaVT = function _danfe_addLinhaVT(data = { l: 0, ts: 0, te: 0 }, mtIndex = __classPrivateFieldGet(this, _danfe_mtIndex, "f")) {
    data.l = (data.l <= __classPrivateFieldGet(this, _danfe_pdfMargin, "f") ? __classPrivateFieldGet(this, _danfe_pdfMargin, "f") : data.l);
    data.l = (data.l >= (__classPrivateFieldGet(this, _danfe_pdfWidth, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) ? (__classPrivateFieldGet(this, _danfe_pdfWidth, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) : data.l); //Bloqueo de estouro Final
    if (data.ts > data.te) { //Corrigir ordem
        let temp = data.ts;
        data.ts = data.te;
        data.te = temp;
    }
    data.ts = (data.ts <= __classPrivateFieldGet(this, _danfe_pdfMargin, "f") ? __classPrivateFieldGet(this, _danfe_pdfMargin, "f") : data.ts) + mtIndex; //Bloqueo de estouro inicial
    data.te = (data.te >= (__classPrivateFieldGet(this, _danfe_pdfWidth, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) ? (__classPrivateFieldGet(this, _danfe_pdfWidth, "f") - __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) : data.te) + mtIndex; //Bloqueo de estouro Final
    __classPrivateFieldGet(this, _danfe_pdf, "f").moveTo(data.l, data.ts).lineTo(data.l, data.te).dash(3, { space: 5 }).stroke(__classPrivateFieldGet(this, _danfe_pdfOpc, "f").ltraj);
}, _danfe_addTXT = function _danfe_addTXT(data, mtIndex = __classPrivateFieldGet(this, _danfe_mtIndex, "f")) {
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
    __classPrivateFieldGet(this, _danfe_pdf, "f").font(font)
        .fillColor(__classPrivateFieldGet(this, _danfe_pdfOpc, "f").txt)
        .fontSize(data.size || 7)
        .text(data.txt, (data.l <= __classPrivateFieldGet(this, _danfe_pdfMargin, "f") ? __classPrivateFieldGet(this, _danfe_pdfMargin, "f") + data.l : data.l), (data.t <= __classPrivateFieldGet(this, _danfe_pdfMargin, "f") ? (data.t + __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) : data.t + __classPrivateFieldGet(this, _danfe_pdfMargin, "f")) + mtIndex, {
        width: (data.w && data.w >= __classPrivateFieldGet(this, _danfe_pdfWidth, "f") ? data.w - data.l : data.w) ?? (__classPrivateFieldGet(this, _danfe_pdfWidth, "f") - data.l),
        align: data.aling || 'center'
    });
};
export { danfe };
