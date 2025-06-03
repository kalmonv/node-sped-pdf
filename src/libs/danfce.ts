import { PDFDocument, StandardFonts, rgb, PDFFont } from "pdf-lib"
import { XMLParser } from "fast-xml-parser"
import qrcode from 'qrcode';




const DANFCe = async (data: { xml?: string, xmlRes?: Record<string, any> | null, logo?: any | null, imgDemo?: string | null, extras?: Array<string> } = {}) => {
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
        xml = parser.parse(data.xml || ""),
        xmlRes = data.xmlRes,
        logo = data.logo,
        imgDemo = data.imgDemo,
        extras = data.extras || [];


    //Configuração do PDF
    PDF.pages.push(PDF.doc.addPage([230,
        await bloco0(null) +
        await bloco1(null) +
        await bloco2(null) +
        await bloco3(null) +
        await bloco4(null)
    ]));
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
        cacl = false
    }: {
        page: any;
        text: string;
        x: number;
        y: number;
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

        const lines = wrapText(text, maxWidth, font, size);
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

    // ----------------- FIM FUNÇÕES -----------------------



    // --------------------- blocos ------------------------\

    async function gerarBlocos() {
        await bloco0()
        await bloco1()
        await bloco2()
        await bloco3();
        await bloco4();
    }



    async function bloco0(page = PDF.pages[(PDF.pages.length - 1)]) {
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
            text: `${enderEmit.xLgr || "Logradouro desconhecido"}, N°${enderEmit.nro || "S/N"}`,
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
            text: `DOCUMENTO AUXILIAR DA NOTA FISCAL DE CONSUMIDOR ELETRÔNICA`,
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


    async function bloco1(page = PDF.pages[(PDF.pages.length - 1)]) {
        const produtos = Array.isArray(xml?.NFe?.infNFe?.det)
            ? xml.NFe.infNFe.det
            : xml?.NFe?.infNFe?.det
                ? [xml.NFe.infNFe.det]
                : [];

        if (page == null) {
            let lIndex = 0;
            for (const det of produtos) {
                const prod = det?.prod || {};
                const text = prod.xProd || "";
                const wrappedLines = wrapText(
                    text,
                    230 * 0.42,
                    await PDF.doc.embedFont(StandardFonts.TimesRoman),
                    7
                );
                lIndex += wrappedLines.length;
            }
            return 24 + lIndex * 10;
        } else {
            let line = 7,
                lIndex = 0;

            addTXT({ page, text: `CODIGO | DESCRIÇÃO`, x: PDF.width * 0.00, y: PDF.mtBlock, maxWidth: PDF.width * 0.5, align: "left" });
            //addTXT({ page, text: `DESCRICAO`, x: PDF.width * 0.17, y: PDF.mtBlock, maxWidth: PDF.width * 0.2, align: "center" });
            addTXT({ page, text: `QTDE | UN | VL. UNIT | VL. TOTAL`, x: 0, y: PDF.mtBlock, maxWidth: PDF.width * 0.98, align: "right" });

            for (const det of produtos) {
                const prod = det?.prod || {};
                const fmt = (v: any) =>
                    parseFloat(v || "0.00").toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                    });

                const xProd = `${prod.cProd} | ${prod.xProd}`;
                const xProdH = await addTXT({
                    page,
                    text: xProd,
                    x: 0,
                    y: PDF.mtBlock + line,
                    maxWidth: PDF.width * 0.5,
                    align: "left",
                });

                const y = PDF.mtBlock + line + (xProdH - 1) * 2.7;

                addTXT({
                    page,
                    text: `${fmt(prod.qCom)} | ${prod.uCom || "UN"} | ${fmt(prod.vUnCom)} | ${fmt(prod.vProd)}`,
                    x: 0,
                    y,
                    maxWidth: PDF.width * 0.98,
                    align: "right",
                });

                line += xProdH * 6.9;
                lIndex += xProdH;
            }

            addLTH(page, 0, 7 + PDF.mtBlock + lIndex * 10, PDF.width);
            PDF.mtBlock += 8 + lIndex * 10;
            return 1;
        }
    }


    async function bloco2(page = PDF.pages[(PDF.pages.length - 1)]) {
        if (!page) {
            const pag = xml?.NFe?.infNFe?.pag || {};
            const detPag = Array.isArray(pag.detPag) ? pag.detPag : [pag.detPag];
            return 40 + (detPag.length * 7)
        };

        const total = xml?.NFe?.infNFe?.total?.ICMSTot || {};
        const pag = xml?.NFe?.infNFe?.pag || {};
        const detPag = Array.isArray(pag.detPag) ? pag.detPag : [pag.detPag];
        const vTroco = parseFloat(pag.vTroco || "0.00");

        const qtdItens = Array.isArray(xml?.NFe?.infNFe?.det)
            ? xml.NFe.infNFe.det.length
            : xml?.NFe?.infNFe?.det ? 1 : 0;

        const fmt = (v: any) =>
            parseFloat(v || "0.00").toLocaleString("pt-BR", { minimumFractionDigits: 2 });

        await addTXT({ page, text: `Qtde. Total de Itens`, x: 0, y: PDF.mtBlock, maxWidth: PDF.width, align: "left" });
        await addTXT({ page, text: `${qtdItens}`, x: 0, y: PDF.mtBlock, maxWidth: PDF.width - 3, align: "right" });

        await addTXT({ page, text: `Valor Total R$`, x: 0, y: PDF.mtBlock + 7, maxWidth: PDF.width, align: "left" });
        await addTXT({ page, text: `${fmt(total.vProd)}`, x: 0, y: PDF.mtBlock + 7, maxWidth: PDF.width - 3, align: "right" });

        await addTXT({ page, text: `Valor a Pagar R$`, x: 0, y: PDF.mtBlock + 14, maxWidth: PDF.width, align: "left" });
        await addTXT({ page, text: `${fmt(total.vNF)}`, x: 0, y: PDF.mtBlock + 14, maxWidth: PDF.width - 3, align: "right" });

        await addTXT({ page, text: `FORMAS PAGAMENTOS`, x: 0, y: PDF.mtBlock + 21, maxWidth: PDF.width, align: "left", fontStyle: "negrito" });
        await addTXT({ page, text: `VALOR PAGO`, x: 0, y: PDF.mtBlock + 21, maxWidth: PDF.width - 3, align: "right", fontStyle: "negrito" });

        let linhaY = PDF.mtBlock + 28;
        const tPagMap: any = {
            "01": "Dinheiro",
            "02": "Cheque",
            "03": "Cartão de Crédito",
            "04": "Cartão de Débito",
            "05": "Crédito Loja",
            "10": "Vale Alimentação",
            "11": "Vale Refeição",
            "12": "Vale Presente",
            "13": "Vale Combustível",
            "15": "Boleto Bancário",
            "16": "Depósito Bancário",
            "17": "Pagamento Instantâneo (PIX)",
            "18": "Transferência bancária, Carteira Digital",
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


    async function bloco3(page = PDF.pages[(PDF.pages.length - 1)]) {
        if (!page) {
            let marg = 0;
            const dest = xml?.NFe?.infNFe.dest || {};
            if (Object.keys(dest).length > 0) { //Tem destinatario?
                marg += 7;
                if (typeof dest.enderDest != null) {
                    marg += 7;
                }
            }
            return 195 + marg;
        };

        const infNFe = xml?.NFe?.infNFe || {};
        const supl = xml?.NFe?.infNFeSupl || {};
        const ide = infNFe.ide || {};
        const dest = infNFe.dest || {};
        const dhEmi = ide.dhEmi ? new Date(ide.dhEmi) : new Date();
        const dataFormatada = dhEmi.toLocaleDateString("pt-BR");
        const horaFormatada = dhEmi.toLocaleTimeString("pt-BR");

        const chave = infNFe["@Id"]?.replace("NFe", "") || "00000000000000000000000000000000000000000000";
        const chaveFormatada = chave.replace(/(\d{4})(?=\d)/g, "$1 ").trim();

        const protocolo = infNFe.procEmi === "0" ? "Protocolo não informado" : "Protocolo de Autorização 000000000000000";
        const dataAut = `Data de Autorização ${dataFormatada} ${horaFormatada}`;
        const serie = ide.serie || "0";
        const nNF = ide.nNF || "0";

        const cpf = dest?.CPF ? `CPF: ${dest.CPF}` : "NÃO INFORMADO";
        const nomeDest = dest?.xNome || null;
        const enderDest = dest?.enderDest || null;
        const endereco = enderDest ? `${enderDest.xLgr || ""}, ${enderDest.nro || "S/N"}, ${enderDest.xBairro || ""}, ${enderDest.xMun || ""}`.toUpperCase() : null;

        const qrCode = supl.qrCode || 'http://www.sefaz.mt.gov.br/nfce/consultanfce';

        // Texto
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


        // QR Code
        const qrCodeDataURL = await qrcode.toDataURL(qrCode);
        await addIMG({
            page,
            img: qrCodeDataURL,
            x: (PDF.width / 2) - 75,
            y: PDF.mtBlock + 25,
            w: 150,
            h: 150
        });

        await addTXT({ page, text: protocolo, x: 0, y: PDF.mtBlock + 14, maxWidth: PDF.width, align: "center", fontStyle: "negrito" });
        await addTXT({ page, text: dataAut, x: 0, y: PDF.mtBlock + 21, maxWidth: PDF.width, align: "center", fontStyle: "negrito" });



        // Tributos (valor fictício neste exemplo, pode ser extraído se disponível)
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



    //Bloco de informações extras
    async function bloco4(page = PDF.pages[(PDF.pages.length - 1)]) {
        if (page == null) {
            let marg = 0;
            if (typeof extras != "undefined") {
                marg = extras?.length / 2
                marg = Math.round(marg)
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

    function blob2base64(blobOrBuffer: any): Promise<any> {
        return new Promise((resolve, reject) => {
            // Detecta se está no navegador
            const isBrowser = typeof window !== 'undefined' && typeof window.FileReader !== 'undefined';

            if (isBrowser) {
                const reader = new FileReader();
                reader.readAsDataURL(blobOrBuffer);
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = (err) => reject(err);
            } else {
                // Node.js (espera Buffer ou Uint8Array)
                try {
                    const buffer = Buffer.isBuffer(blobOrBuffer)
                        ? blobOrBuffer
                        : Buffer.from(blobOrBuffer);
                    const base64 = `data:application/octet-stream;base64,${buffer.toString('base64')}`;
                    resolve(base64);
                } catch (err) {
                    reject(err);
                }
            }
        });
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

export { DANFCe }