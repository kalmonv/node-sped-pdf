import { PDFDocument, StandardFonts, rgb, PDFFont } from "pdf-lib"
import { XMLParser } from "fast-xml-parser"
import JsBarcode from "jsbarcode"
import canvas from "canvas"

interface XmlData {
    [key: string]: any; // permite outras tags sem erro
}

const DAV55 = async (data: { xml: XmlData, logo?: any | null, imgDemo?: string | null, orcamento?: boolean } = { xml: {} as XmlData }) => {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@",
        parseTagValue: false,       // Evita conversão automática de valores
    });

    var PDF: {
        doc: any;
        pages: any;
        width: number;
        height: number;
        mtBlock: number;
        barCode: string | null;
    } = {
        doc: await PDFDocument.create(),
        pages: [],
        width: 0,
        height: 0,
        mtBlock: 0,
        barCode: null
    }, isBrowser = typeof window !== 'undefined',
        xml = data.xml,
        logo = data.logo,
        imgDemo = data.imgDemo,
        orcamento = data.orcamento || false;

    //Configuração do PDF
    PDF.pages.push(PDF.doc.addPage());
    PDF.width = (PDF.pages[0]).getWidth();
    PDF.height = (PDF.pages[0]).getHeight();

    // ------------------------   FUNÇOES ------------------------------

    async function addRet(page: any, x: number, y: number, w: number, h: number) {
        page.drawRectangle({
            x: x + 4,
            y: (PDF.height - h) - (y + 4),
            width: (x + w + 8) >= PDF.width ? (PDF.width - x) - 8 : w,
            height: h,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1
        });
    }

    //Linha trajada horizontal
    async function addLTH(page: any, x: number, y: number, h: number) {
        const startX = Math.max(x, 4);
        const endX = Math.min(x + h, PDF.width - 4);
        const fixedY = PDF.height - y - 4;

        page.drawLine({
            start: { x: startX, y: fixedY },
            end: { x: endX, y: fixedY },
            color: rgb(0, 0, 0),
            thickness: 1,
            dashArray: [5, 3],
        });
    }

    //Linha trajada vertical
    async function addLTV(page: any, x: number, y: number, w: number) {
        const fixedX = Math.max(4, Math.min(x, PDF.width - 4));
        const startY = Math.max(PDF.height - y - 4, 4);
        const endY = Math.max(PDF.height - (y + w) - 4, 4);

        page.drawLine({
            start: { x: fixedX, y: startY },
            end: { x: fixedX, y: endY },
            color: rgb(0, 0, 0),
            thickness: 1,
            dashArray: [5, 3],
        });
    }

    async function addTXT({
        page,
        text,
        x,
        y,
        maxWidth,
        fontStyle = 'normal',
        size = 7,
        lineHeight,
        align = 'left',
        cacl = false,
        opacity = 1
    }: {
        page: any;
        text: string;
        x: number;
        y: number;
        opacity?: number;
        maxWidth: number;
        fontStyle?: 'normal' | 'negrito' | 'italic';
        size?: number;
        lineHeight?: number;
        align?: 'left' | 'center' | 'right';
        cacl?: boolean;
    }): Promise<number> {
        let font: PDFFont;

        switch (fontStyle) {
            case 'negrito':
                font = await PDF.doc.embedFont(StandardFonts.TimesRomanBold);
                break;
            case 'italic':
                font = await PDF.doc.embedFont(StandardFonts.TimesRomanItalic);
                break;
            default:
                font = await PDF.doc.embedFont(StandardFonts.TimesRoman);
        }

        // Garante que maxWidth não ultrapasse a largura da página
        if (maxWidth + x > PDF.width) maxWidth = PDF.width - x - 2;

        // Define altura da linha baseada no tamanho da fonte, se não especificada
        const effectiveLineHeight = lineHeight ?? size * .9;

        const lines = wrapText(`${text}`, maxWidth, font, size);
        if (cacl) return lines.length;

        lines.forEach((line, index) => {
            const textWidth = font.widthOfTextAtSize(line, size);
            let drawX = x + 4;

            if (align === 'center') {
                drawX = x + (maxWidth - textWidth) / 2;
            } else if (align === 'right') {
                drawX = x + maxWidth - textWidth;
            }

            page.drawText(line, {
                x: drawX,
                y: ((PDF.height - effectiveLineHeight) - (y + 4)) - index * effectiveLineHeight,
                size,
                font,
                opacity: opacity || 1
            });
        });
        return lines.length;
    }


    function wrapText(text: string, maxWidth: number, font: PDFFont, fontSize: number): string[] {
        const words = text.split(' ');
        const lines: string[] = [];
        let line = '';

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const testLine = line + word + ' ';
            const testWidth = font.widthOfTextAtSize(testLine, fontSize);

            if (testWidth > maxWidth && line !== '') {
                lines.push(line.trim());
                line = word + ' ';
            } else {
                line = testLine;
            }
        }
        if (line.trim() !== '') {
            lines.push(line.trim());
        }
        return lines;
    }


    function embCNPJCPF(valor: string) {
        // Remove tudo que não for número
        const numeros = (valor || "").replace(/\D/g, '');

        if (numeros.length === 11) {
            // Formata CPF: 000.000.000-00
            return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (numeros.length === 14) {
            // Formata CNPJ: 00.000.000/0000-00
            return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        } else {
            return valor;
        }
    }

    // ----------------- FIM FUNÇÕES -----------------------



    // --------------------- blocos ------------------------\

    async function gerarBlocos() {
        //await bloco0()
        await bloco1()
        //await bloco2()
        if (xml.tagDetPag.length > 0)
            await bloco3();
        await bloco4()
        //await bloco5()
        let fim = await bloco6()
        await bloco7()
        await bloco8()

        while (!fim) {
            PDF.mtBlock = 0; //Resetar
            PDF.pages.push(PDF.doc.addPage());
            await bloco1()
            fim = await bloco6();
        }

        for (const [i, page] of PDF.pages.entries()) {
            addTXT({ page, size: 8, text: `Folha ${i + 1}/${PDF.pages.length}`, x: 235, y: 80, maxWidth: PDF.width * 0.19, align: "center", fontStyle: "italic" });
            if (orcamento)
                addTXT({ page, size: 60, text: `ORÇAMENTO`, x: 0, y: PDF.height * 0.60, maxWidth: PDF.width, align: "center", fontStyle: "negrito", opacity: 0.3 });
        }
    }



    async function bloco1(page = PDF.pages[(PDF.pages.length - 1)]) {
        addRet(page, 0, PDF.mtBlock, PDF.width, 132);
        addRet(page, 0, PDF.mtBlock, PDF.width, 92);
        addRet(page, 0, PDF.mtBlock, PDF.width, 112);
        addRet(page, PDF.width * 0.401, PDF.mtBlock + 0, PDF.width, 92);
        addRet(page, PDF.width * 0.53, PDF.mtBlock + 38, 16, 20);
        addRet(page, PDF.width * 0.57, PDF.mtBlock + 0, PDF.width, 92);
        //addRet(page, PDF.width * 0.57, PDF.mtBlock + 47, PDF.width, 23);
        //addRet(page, PDF.width * 0.57, PDF.mtBlock + 70, PDF.width, 22);
        addRet(page, PDF.width * 0.57, PDF.mtBlock + 92, PDF.width, 20);
        addRet(page, PDF.width * 0.745, PDF.mtBlock + 112, PDF.width, 20);
        addRet(page, PDF.width * 0.497, PDF.mtBlock + 112, PDF.width, 20);
        addRet(page, PDF.width * 0.25, PDF.mtBlock + 112, PDF.width, 20);

        addTXT({ page, text: "IDENTIFICAÇÃO DO EMITENTE", x: 0, y: PDF.mtBlock + 2, maxWidth: PDF.width * 0.4, align: "center" });
        addTXT({ page, text: "IDENTIFICAÇÃO DO DESTINATARIO", x: PDF.width * 0.6, y: PDF.mtBlock + 2, maxWidth: PDF.width * 0.4, align: "center" });

        let mt = 0;
        if (typeof logo !== "undefined") {
            await addIMG({ page, img: logo, x: PDF.width * 0.18, y: PDF.mtBlock + 14, h: 37, w: 37 });
            mt += 12;
        }

        //Redimencionar nome.
        let sizeNome = 12;
        while (await addTXT({ page, size: sizeNome, text: `${xml.tagEmit?.xNome}`, x: 1, y: PDF.mtBlock + 35 + mt, maxWidth: PDF.width * 0.4, align: "center", fontStyle: "negrito", cacl: true }) >= 2) {
            sizeNome--;
        }
        addTXT({ page, size: sizeNome, text: `${xml.tagEmit?.xNome}`, x: 1, y: PDF.mtBlock + 35 + mt, maxWidth: PDF.width * 0.4, align: "center", fontStyle: "negrito" });


        addTXT({ page, size: 9, text: `CNPJ/CPF ${embCNPJCPF(xml.tagEmit?.CPF || xml.tagEmit?.CNPJ)}`, x: 0, y: PDF.mtBlock + 46 + mt, maxWidth: PDF.width * 0.42, align: "center" });
        addTXT({ page, size: 9, text: `${xml.tagEmit?.xBairro || ""} - ${xml.tagEmit?.CEP || ""}, ${xml.tagEmit?.xLgr || ""}, N°${xml.tagEmit?.nro || ""}`, x: 0, y: PDF.mtBlock + 55 + mt, maxWidth: PDF.width * 0.42, align: "center" });
        addTXT({ page, size: 9, text: `${xml.tagEmit?.xMun || ""} - ${xml.tagEmit?.UF || ""} Fone: ${xml.tagEmit?.fone || ""}`, x: 0, y: PDF.mtBlock + 65 + mt, maxWidth: PDF.width * 0.42, align: "center" });

        // ----- Destinatario
        if (xml.tagDest) {
            sizeNome = 12;
            while (await addTXT({ page, size: sizeNome, text: `${xml.tagDest?.xNome}`, x: PDF.width * 0.58, y: PDF.mtBlock + 35 + mt, maxWidth: PDF.width * 0.4, align: "center", fontStyle: "negrito", cacl: true }) >= 2) {
                sizeNome--;
            }
            addTXT({ page, size: sizeNome, text: `${xml.tagDest?.xNome}`, x: PDF.width * 0.58, y: PDF.mtBlock + 35 + mt, maxWidth: PDF.width * 0.4, align: "center", fontStyle: "negrito" });

            addTXT({ page, size: 9, text: `CNPJ/CPF ${embCNPJCPF(xml.tagDest?.CPF || xml.tagDest?.CNPJ)}`, x: PDF.width * 0.58, y: PDF.mtBlock + 46 + mt, maxWidth: PDF.width * 0.42, align: "center" });

            addTXT({ page, size: 9, text: `${xml.tagDest?.xMun || ""} - ${xml.tagDest?.UF || ""}, ${xml.tagDest?.xBairro || ""} - ${xml.tagDest?.CEP || ""}, ${xml.tagDest?.xLgr || ""}, N°${xml.tagDest?.nro || ""}`, x: PDF.width * 0.58, y: PDF.mtBlock + 55 + mt, maxWidth: PDF.width * 0.42, align: "center" });
            addTXT({ page, size: 9, text: ``, x: PDF.width * 0.6, y: PDF.mtBlock + 65 + mt, maxWidth: PDF.width * 0.42, align: "center" });
        } else {

        }



        addTXT({ page, size: 16, text: "CUPOM", x: PDF.width * 0.393, y: PDF.mtBlock + 3, maxWidth: PDF.width * 0.2, align: "center", fontStyle: "negrito" });
        addTXT({ page, size: 8, text: "Documento NÃO Fiscal", x: PDF.width * 0.4, y: PDF.mtBlock + 19, maxWidth: PDF.width * 0.18, align: "center" });
        addTXT({ page, size: 8, text: "0 - ENTRADA", x: PDF.width * 0.415, y: PDF.mtBlock + 42, maxWidth: PDF.width * 0.19, align: "left" });
        addTXT({ page, size: 8, text: "1 - SAÍDA", x: PDF.width * 0.415, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.19, align: "left" });
        addTXT({ page, size: 20, text: xml.tagIde.tpNF, x: PDF.width * 0.534, y: PDF.mtBlock + 37, maxWidth: PDF.width * 0.19, align: "left" });
        addTXT({ page, size: 10, text: `Codigo º. ${xml.tagIde.nNF.padStart(9, '0')}`, x: PDF.width * 0.4, y: PDF.mtBlock + 63, maxWidth: PDF.width * 0.19, align: "center", fontStyle: "negrito" });

        addTXT({ page, text: "NATUREZA DA OPERAÇÃO", x: 3, y: PDF.mtBlock + 92, maxWidth: PDF.width * 0.29 });
        addTXT({ page, size: 10, text: xml.tagIde.natOp, x: 3, y: PDF.mtBlock + 101, maxWidth: PDF.width * 0.58, align: "center", fontStyle: "negrito" });

        addTXT({ page, text: "INSCRIÇÃO ESTADUAL", x: 3, y: PDF.mtBlock + 112, maxWidth: PDF.width * 0.29 });
        addTXT({ page, size: 10, text: xml.tagEmit.IE || "", x: 3, y: PDF.mtBlock + 121, maxWidth: PDF.width * 0.25, align: "center", fontStyle: "negrito" });

        addTXT({ page, text: "INSCRIÇÃO MUNICIPAL", x: PDF.width * 0.255, y: PDF.mtBlock + 112, maxWidth: PDF.width * 0.29 });
        addTXT({ page, size: 10, text: xml.tagEmit.IM || "", x: PDF.width * 0.355, y: PDF.mtBlock + 121, maxWidth: PDF.width * 0.05, align: "center", fontStyle: "negrito" });

        addTXT({ page, text: "INSCRIÇÃO ESTADUAL DO SUBST. TRIBUT.", x: PDF.width * 0.5, y: PDF.mtBlock + 112, maxWidth: PDF.width * 0.29 });
        addTXT({ page, size: 10, text: xml.tagEmit.IEST || "", x: PDF.width * 0.6, y: PDF.mtBlock + 121, maxWidth: PDF.width * 0.05, align: "center", fontStyle: "negrito" });

        addTXT({ page, text: "CNPJ/CPF", x: PDF.width * 0.75, y: PDF.mtBlock + 112, maxWidth: PDF.width * 0.29 });
        addTXT({ page, size: 10, text: embCNPJCPF(xml.tagEmit.CNPJ || xml.tagEmit.CPF), x: PDF.width * 0.845, y: PDF.mtBlock + 121, maxWidth: PDF.width * 0.05, align: "center", fontStyle: "negrito" });

        PDF.mtBlock += 133;
    }

    async function barCode(): Promise<Buffer | string> {
        if (PDF.barCode != null) return PDF.barCode;
        const isNode = typeof window === 'undefined';
        if (isNode) {
            // --- NODE.JS ---
            const { createCanvas } = await import('canvas');
            const canvas = createCanvas(400, 100);
            JsBarcode(canvas, xml.NFe.infNFe["@Id"], {
                format: 'CODE128',
                displayValue: false,
                fontSize: 18,
            });

            PDF.barCode = canvas.toDataURL('image/png');
            // Retorna base64 (imagem PNG)
            return PDF.barCode;
        } else {
            // --- BROWSER ---
            return new Promise((resolve, reject) => {
                try {
                    const canvas = document.createElement('canvas');
                    JsBarcode(canvas, xml.NFe.infNFe["@Id"], {
                        format: 'CODE128',
                        displayValue: false,
                        fontSize: 18,
                    });


                    PDF.barCode = canvas.toDataURL('image/png')
                    resolve(PDF.barCode);
                } catch (err) {
                    reject(err);
                }
            });
        }
    }

    async function bloco2(page = PDF.pages[(PDF.pages.length - 1)]) {
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

        addTXT({ page, text: "DESTINATÁRIO / REMETENTE", x: 3, y: PDF.mtBlock + 2, maxWidth: PDF.width * 0.4, fontStyle: "negrito" });

        addTXT({ page, text: "NOME / RAZÃO SOCIAL", x: 3, y: PDF.mtBlock + 10, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.xNome, x: 3, y: PDF.mtBlock + 20, maxWidth: PDF.width * 0.58, fontStyle: "negrito" });

        addTXT({ page, text: "CNPJ/CPF", x: PDF.width * 0.61, y: PDF.mtBlock + 10, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.CNPJ || xml.NFe.infNFe.dest.CPF, x: PDF.width * 0.51, y: PDF.mtBlock + 20, maxWidth: PDF.width * 0.42, align: "center", fontStyle: "negrito" });

        addTXT({ page, text: "DATA DA EMISSÃO", x: PDF.width * 0.83, y: PDF.mtBlock + 10, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: new Date(xml.tagIde.dhEmi).toLocaleDateString('pt-BR'), x: PDF.width * 0.83, y: PDF.mtBlock + 20, maxWidth: PDF.width * 0.42, align: "center", fontStyle: "negrito" });

        addTXT({ page, text: "ENDEREÇO", x: 2, y: PDF.mtBlock + 31, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: `${xml.NFe.infNFe.dest.enderDest.xLgr}, N° ${xml.NFe.infNFe.dest.enderDest.nro}`, x: 3, y: PDF.mtBlock + 40, maxWidth: PDF.width * 0.42, align: "left", fontStyle: "negrito" });

        addTXT({ page, text: "BAIRRO/DISTRITO", x: PDF.width * 0.47, y: PDF.mtBlock + 31, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.enderDest.xBairro, x: PDF.width * 0.47, y: PDF.mtBlock + 40, maxWidth: PDF.width * 0.21, align: "center", fontStyle: "negrito" });

        addTXT({ page, text: "CEP", x: PDF.width * 0.67, y: PDF.mtBlock + 31, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.enderDest.CEP.replace(/^(\d{5})(\d{3})$/, "$1-$2"), x: PDF.width * 0.67, y: PDF.mtBlock + 40, maxWidth: PDF.width * 0.17, align: "center", fontStyle: "negrito" });

        addTXT({ page, text: "DATA DA SAÍDA/ENTRDA", x: PDF.width * 0.83, y: PDF.mtBlock + 31, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: new Date(xml.tagIde.dhEmi).toLocaleDateString('pt-BR'), x: PDF.width * 0.83, y: PDF.mtBlock + 40, maxWidth: PDF.width * 0.17, align: "center", fontStyle: "negrito" });

        addTXT({ page, text: "MUNICIPIO", x: 2, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.enderDest.xMun, x: 3, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.42, align: "left", fontStyle: "negrito" });

        addTXT({ page, text: "UF", x: PDF.width * 0.47, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.enderDest.UF, x: PDF.width * 0.473, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.21, align: "left", fontStyle: "negrito" });

        addTXT({ page, text: "FONE/FAX", x: PDF.width * 0.505, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.enderDest.fone || "", x: PDF.width * 0.505, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.17, align: "center", fontStyle: "negrito" });

        addTXT({ page, text: "INSCRIÇÃO ESTADUAL", x: PDF.width * 0.67, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: xml.NFe.infNFe.dest.IE || "", x: PDF.width * 0.67, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.17, align: "center", fontStyle: "negrito" });

        addTXT({ page, text: "HORA DA SAÍDA/ENTRDA", x: PDF.width * 0.83, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: new Date(xml.tagIde.dhEmi).toLocaleTimeString('pt-BR'), x: PDF.width * 0.83, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.17, align: "center", fontStyle: "negrito" });

        PDF.mtBlock += 73;
    }

    async function bloco3(page = PDF.pages[(PDF.pages.length - 1)]) {
        addTXT({ page, text: "PAGAMENTO", x: 3, y: PDF.mtBlock, maxWidth: PDF.width * 0.25, fontStyle: "negrito" });

        const pagamentos = Array.isArray(xml.tagDetPag) ? xml.tagDetPag : [xml.tagDetPag];
        const formaPagto: any = {
            "01": "Dinheiro", "02": "Cheque", "03": "Cartão de Crédito", "04": "Cartão de Débito", "05": "Crédito Loja",
            "10": "Vale Alimentação", "11": "Vale Refeição", "12": "Vale Presente", "13": "Vale Combustível",
            "15": "Boleto Bancário", "16": "Depósito Bancário", "17": "PIX", "18": "Transferência", "19": "Fidelidade",
            "90": "Sem pagamento", "99": "Outros"
        };

        let offset = 0;

        for (const pag of pagamentos) {
            const forma = formaPagto[pag.tPag] || `Código ${pag.tPag}`;
            const valor = parseFloat(pag.vPag).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            addRet(page, 0, PDF.mtBlock + 7 + offset, PDF.width * 0.25, 20);
            addTXT({ page, text: "FORMA", x: 3, y: PDF.mtBlock + 8 + offset, maxWidth: PDF.width * 0.25 });
            addTXT({ page, text: forma, x: 3, y: PDF.mtBlock + 18 + offset, maxWidth: PDF.width * 0.25 });
            addTXT({ page, text: forma, x: 3, y: PDF.mtBlock + 8 + offset, maxWidth: PDF.width * 0.245, align: "right", fontStyle: "negrito" });
            addTXT({ page, text: valor, x: 3, y: PDF.mtBlock + 18 + offset, maxWidth: PDF.width * 0.245, align: "right", fontStyle: "negrito" });

            offset += 22;
        }

        PDF.mtBlock += offset + 6;
    }


    async function bloco4(page = PDF.pages[(PDF.pages.length - 1)]) {
        const ICMS: any = {
            vProd: "Valor Produtos",
            vFrete: "Valor Frete",
            vSeg: "Valor Seguro",
            vDesc: "Valor Desconto",
            vOutro: "Outras Desp. Acess.",
            vNF: "Valor Total NF-e"
        };

        addTXT({ page, text: "TOTAIS", x: 3, y: PDF.mtBlock, maxWidth: PDF.width * 0.25, fontStyle: "negrito" });

        let nextY = PDF.mtBlock + 8, nextX = 0, limitY = (PDF.width - 8);

        for (const key of Object.keys(ICMS)) {
            const valor = xml?.vTotal?.[key] || 0;
            const texto = valor ? parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "0,00";

            await addRet(page, (limitY * 0.111) * nextX, nextY, limitY * 0.111, 20);
            addTXT({ page, text: ICMS[key], x: 2 + (limitY * 0.111) * nextX, y: nextY + 1, maxWidth: limitY * 0.111 });
            addTXT({ page, size: 10, text: texto.replace("R$", ""), x: (limitY * 0.111) * nextX, y: nextY + 9, maxWidth: limitY * 0.111, align: "right", fontStyle: "negrito" });

            nextX++;
            if (nextX >= 9) {
                nextX = 0;
                nextY += 20;
            }
        }
        PDF.mtBlock += 30;
    }



    async function bloco6(page = PDF.pages[(PDF.pages.length - 1)]) {
        let hBlock = PDF.height - PDF.mtBlock - (PDF.pages.length == 1 ? 75 : 18);
        xml.tagProd = Array.isArray(xml.tagProd) ? xml.tagProd : [xml.tagProd];
        addTXT({ page, text: "DADOS DOS PRODUTOS / SERVIÇOS", x: 3, y: PDF.mtBlock, maxWidth: PDF.width, fontStyle: "negrito" });

        // Cabeçalho da tabela
        addRet(page, 0, PDF.mtBlock + 8, PDF.width, hBlock);
        addRet(page, 0, PDF.mtBlock + 8, PDF.width, 15);
        const colunas = [0.1, 0.49, 0.57, 0.64, 0.7, 0.775, 0.85, 0.925];
        for (const x of colunas) addLTV(page, PDF.width * x, PDF.mtBlock + 8, hBlock);

        // Títulos
        addTXT({ page, text: "CÓDIGO PRODUTO", x: PDF.width * 0.003, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.09, align: "center" });
        addTXT({ page, text: "DESCRIÇÃO DO PRODUTO / SERVIÇO", x: PDF.width * 0.1, y: PDF.mtBlock + 12, maxWidth: PDF.width * 0.24, align: "center" });
        addTXT({ page, text: "NCM/SH", x: PDF.width * 0.5, y: PDF.mtBlock + 12, maxWidth: PDF.width * 0.06, align: "center" });
        //addTXT({ page, text: "O/CSOSN", x: PDF.width * 0.4, y: PDF.mtBlock + 12, maxWidth: PDF.width * 0.06, align: "center" });
        addTXT({ page, text: "CFOP", x: PDF.width * 0.59, y: PDF.mtBlock + 12, maxWidth: PDF.width * 0.025, align: "center" });
        addTXT({ page, text: "UN", x: PDF.width * 0.66, y: PDF.mtBlock + 12, maxWidth: PDF.width * 0.025, align: "center" });
        addTXT({ page, text: "QUANT.", x: PDF.width * 0.7, y: PDF.mtBlock + 12, maxWidth: PDF.width * 0.07, align: "center" });
        addTXT({ page, text: "VALOR UNIT", x: PDF.width * 0.775, y: PDF.mtBlock + 8.5, maxWidth: PDF.width * 0.07, align: "center" });
        addTXT({ page, text: "VALOR DESC", x: PDF.width * 0.85, y: PDF.mtBlock + 8.5, maxWidth: PDF.width * 0.07, align: "center" });
        addTXT({ page, text: "VALOR TOTAL", x: PDF.width * 0.925, y: PDF.mtBlock + 8.5, maxWidth: PDF.width * 0.07, align: "center" });

        // Iterar pelos produtos
        let line = 24,
            lLimite = Math.floor(hBlock / 7), //7 tamanho da fonte
            lIndex = 0;
        for (const [iDet, prod] of xml.tagProd.entries()) {
            //Descobrir quantas linhas vamos usar.
            lIndex += await addTXT({ page, text: prod.xProd, x: 0, y: 0, maxWidth: PDF.width * 0.39, align: "center", cacl: true });
            if (lIndex >= lLimite) {
                xml.tagProd.splice(0, iDet);
                PDF.mtBlock += hBlock + 12;
                return false;
            }


            const fmt = (v: any) => parseFloat(v || "0.00").toLocaleString('pt-BR', { minimumFractionDigits: 2 });

            const xProdH = await addTXT({ page, text: prod.xProd, x: PDF.width * 0.096, y: PDF.mtBlock + line, maxWidth: PDF.width * 0.39, align: "left" });
            const y = PDF.mtBlock + line + ((xProdH - 1) * 2.7);

            addTXT({ page, text: prod.cEAN || "", x: 0, y, maxWidth: PDF.width * 0.1, align: "center" });
            addTXT({ page, text: prod.NCM || "", x: PDF.width * 0.5, y, maxWidth: PDF.width * 0.061, align: "center" });
            //addTXT({ page, text: "", x: PDF.width * 0.398, y, maxWidth: PDF.width * 0.061, align: "center" });
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



    async function bloco7(page = PDF.pages[(PDF.pages.length - 1)]) {
        addTXT({ page, text: "DADOS ADICIONAIS", x: 3, y: PDF.mtBlock, maxWidth: PDF.width, fontStyle: "negrito" });
        addRet(page, 0, PDF.mtBlock + 8, PDF.width, 40);
        addRet(page, 0, PDF.mtBlock + 8, PDF.width * 0.65, 40);

        addTXT({ page, text: "INFORMAÇÕES COMPLEMENTARES", x: 3, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.5, align: "left", fontStyle: "negrito" });
        addTXT({ page, text: "RESERVADO AO FISCO", x: PDF.width * 0.652, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.5, align: "left", fontStyle: "negrito" });

        if (await addTXT({ page, text: xml.taginfAdic?.infAdFisco || "", x: 3, y: PDF.mtBlock + 14, maxWidth: PDF.width * 0.65, align: "left", cacl: true }) >= 5) {
            addTXT({ page, text: xml.taginfAdic?.infAdFisco.slice(0, 400) + "..." || "", x: 3, y: PDF.mtBlock + 14, maxWidth: PDF.width * 0.65, align: "left" })
        } else {
            addTXT({ page, text: xml.taginfAdic?.infAdFisco || "", x: 3, y: PDF.mtBlock + 14, maxWidth: PDF.width * 0.65, align: "left" })
        };

        if (await addTXT({ page, text: xml.taginfAdic?.infCpl || "", x: PDF.width * 0.652, y: PDF.mtBlock + 14, maxWidth: PDF.width * 0.65, align: "left", cacl: true }) >= 5) {
            addTXT({ page, text: xml.taginfAdic?.infCpl.slice(0, 200) + "..." || "", x: PDF.width * 0.652, y: PDF.mtBlock + 14, maxWidth: PDF.width * 0.65, align: "left" })
        } else {
            addTXT({ page, text: xml.taginfAdic?.infCpl || "", x: PDF.width * 0.652, y: PDF.mtBlock + 14, maxWidth: PDF.width * 0.65, align: "left" })
        };
        PDF.mtBlock += 40;
    }

    async function bloco8(page = PDF.pages[(PDF.pages.length - 1)]) {
        const agora = new Date();
        const dataFormatada = agora.toLocaleDateString('pt-BR');
        const horaFormatada = agora.toLocaleTimeString('pt-BR');
        const textoEsquerda = `Impresso em ${dataFormatada} às ${horaFormatada}  Guara PDV - https://guaradev.com`;

        addTXT({ page, text: textoEsquerda, x: 3, y: PDF.mtBlock + 8, maxWidth: PDF.width, align: "left" });
        addTXT({ page, text: "Powered by @node-sped-pdf", x: 3, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.989, align: "right", fontStyle: "italic" });
    }


    async function addIMG({
        page,
        img,
        x,
        y,
        h,
        w,
    }: {
        page: any;
        img: string;
        x: number;
        y: number;
        h: number;
        w: number;
    }) {
        if (typeof img != undefined) {
            if (img.includes('http') || img.includes("wwww"))
                img = await fetch(img || "").then(response => response.blob()).then(blob => blob2base64(blob));

            const bytes = Uint8Array.from(atob(img.split(',')[1]), c => c.charCodeAt(0));

            // Detecta o tipo (png ou jpg?)
            const isPng = img?.startsWith('data:image/png');

            // Embed imagem
            const image = isPng
                ? await PDF.doc.embedPng(bytes)
                : await PDF.doc.embedJpg(bytes);

            await page.drawImage(image, {
                x: x,
                y: PDF.height - y - h, // Corrige porque pdf-lib desenha do canto inferior da imagem
                width: w,
                height: h,
            });
        }
    }


    async function blob2base64(blobOrBuffer: any): Promise<any> {
        const isBrowser = typeof window !== 'undefined' && typeof window.FileReader !== 'undefined';
        if (isBrowser) {
            // Navegador
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(blobOrBuffer);
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
            });
        } else {
            // Node.js
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
                return buffer.toString('base64');
            } catch (err) {
                throw new Error(`Falha ao converter: ${err}`);
            }
        }
    }


    async function blocoDEMO(page = PDF.pages[(PDF.pages.length - 1)]) {
        imgDemo = await fetch(imgDemo || "").then(response => response.blob()).then(blob => blob2base64(blob));

        // Decodifica Base64 e embeleza no PDF
        const base64Data = imgDemo?.split(',')[1] as ""; // tira "data:image/png;base64," se tiver
        const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        // Detecta o tipo (png ou jpg?)
        const isPng = imgDemo?.startsWith('data:image/png');

        // Embed imagem
        const image = isPng
            ? await PDF.doc.embedPng(bytes)
            : await PDF.doc.embedJpg(bytes);

        page.drawImage(image, {
            x: 0,
            y: 0, // Corrige porque pdf-lib desenha do canto inferior da imagem
            width: PDF.width,
            height: PDF.height,
        });
    }

    // --------------------- FIM blocos ------------------------

    return new Promise(async (resolve, reject) => {
        await gerarBlocos();
        resolve(await PDF.doc.save());
    });
}

export { DAV55 }