import { PDFDocument, StandardFonts, rgb, PDFFont } from "pdf-lib"
import { XMLParser } from "fast-xml-parser"



const DANFe = async (data: { xml?: string, xmlRes?: Record<string, any> | null, logo?: any | null, imgDemo?: string | null } = {}) => {
    var PDF: {
        doc: any;
        pages: any;
        width: number;
        height: number;
        mtBlock: number;
    } = {
        doc: await PDFDocument.create(),
        pages: [],
        width: 0,
        height: 0,
        mtBlock: 0,
    }, isBrowser = typeof window !== 'undefined',
        xml = data.xml,
        xmlRes = data.xmlRes,
        logo = data.logo,
        imgDemo = data.imgDemo;
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@",
        parseTagValue: false,       // Evita conversão automática de valores
    });

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
        await bloco3()
        await bloco4()
        if (imgDemo != null) await blocoDEMO();
    }

    function blob2base64(blob: any): Promise<any> {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise(resolve => {
            reader.onloadend = () => {
                resolve(reader.result);
            };
        });
    }

    async function bloco0(page = PDF.pages[(PDF.pages.length - 1)]) {
        addRet(page, 0, PDF.mtBlock + 0, PDF.width, 50);
        addRet(page, 0, PDF.mtBlock + 0, PDF.width * 0.8, 25);
        addRet(page, 0, PDF.mtBlock + 0, PDF.width * 0.8, 25);
        addRet(page, 0, PDF.mtBlock + 25, PDF.width * 0.8, 25);
        addRet(page, PDF.width * 0.17, PDF.mtBlock + 25, PDF.width * 0.63, 25);

        addTXT({ page, text: "RECEBEMOS DE 47.506.306 KALMON VALADAO TAVARES OS PRODUTOS E/OU SERVIÇOS CONSTANTES DA NOTA FISCAL ELETRÔNICA INDICADA ABAIXO. EMISSÃO: 25/04/2025 VALOR TOTAL: R$ 596,00 DESTINATÁRIO: NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL - AV PARA, 138 UNIAO NOVA XAVANTINA-MT", x: 2, y: PDF.mtBlock + 2, maxWidth: PDF.width * 0.78 });
        addTXT({ page, text: "DATA DE RECEBIMENTO", x: 2, y: PDF.mtBlock + 25, maxWidth: PDF.width * 0.78 });
        addTXT({ page, text: "DATA DE RECEBIMENTO", x: PDF.width * 0.173, y: PDF.mtBlock + 25, maxWidth: PDF.width });
        addTXT({ page, size: 18, text: "NFe", x: PDF.width * 0.8, y: PDF.mtBlock, maxWidth: PDF.width * 0.8, align: "center" });

        addTXT({ page, size: 11, text: "Nº. 000.000.384", x: PDF.width * 0.8, y: PDF.mtBlock + 20, maxWidth: PDF.width * 0.8, align: "center" });
        addTXT({ page, size: 11, text: "Série 000", x: PDF.width * 0.8, y: PDF.mtBlock + 30, maxWidth: PDF.width * 0.8, align: "center" });
        addLTH(page, 0, PDF.mtBlock + 56, PDF.width);
        PDF.mtBlock += 60;
    }

    async function bloco1(page = PDF.pages[(PDF.pages.length - 1)]) {
        addRet(page, 0, PDF.mtBlock, PDF.width, 132);
        addRet(page, 0, PDF.mtBlock, PDF.width, 92);
        addRet(page, 0, PDF.mtBlock, PDF.width, 112);
        //addRet(page, PDF.width * 0.401, PDF.mtBlock + 0, PDF.width, 112);
        addRet(page, PDF.width * 0.53, PDF.mtBlock + 38, 16, 20);
        addRet(page, PDF.width * 0.57, PDF.mtBlock + 0, PDF.width, 47);
        addRet(page, PDF.width * 0.57, PDF.mtBlock + 47, PDF.width, 23);
        addRet(page, PDF.width * 0.57, PDF.mtBlock + 70, PDF.width, 22);
        addRet(page, PDF.width * 0.57, PDF.mtBlock + 92, PDF.width, 20);
        addRet(page, PDF.width * 0.745, PDF.mtBlock + 112, PDF.width, 20);
        addRet(page, PDF.width * 0.497, PDF.mtBlock + 112, PDF.width, 20);
        addRet(page, PDF.width * 0.25, PDF.mtBlock + 112, PDF.width, 20);

        addTXT({ page, text: "IDENTIFICAÇÃO DO EMITENTE", x: 0, y: PDF.mtBlock + 2, maxWidth: PDF.width * 0.4, align: "center" });

        //!FALTA ADICIONAR LOGO
        addTXT({ page, size: 12, text: "47.506.306 KALMON VALADAO TAVARES", x: 0, y: PDF.mtBlock + 45, maxWidth: PDF.width * 0.4, align: "center" });
        addTXT({ page, size: 9, text: "AV PARA, N°138", x: 0, y: PDF.mtBlock + 58, maxWidth: PDF.width * 0.42, align: "center" });
        addTXT({ page, size: 9, text: "UNIÃO - 78690-000", x: 0, y: PDF.mtBlock + 66, maxWidth: PDF.width * 0.42, align: "center" });
        addTXT({ page, size: 9, text: "Nova Xavantina - MT Fone/Fax: 66981352912", x: 0, y: PDF.mtBlock + 74, maxWidth: PDF.width * 0.42, align: "center" });


        addTXT({ page, size: 16, text: "DANFE", x: PDF.width * 0.393, y: PDF.mtBlock + 3, maxWidth: PDF.width * 0.2, align: "center" });
        addTXT({ page, size: 8, text: "Documento Auxiliar da Nota Fiscal Eletrônica", x: PDF.width * 0.4, y: PDF.mtBlock + 19, maxWidth: PDF.width * 0.18, align: "center" });
        addTXT({ page, size: 8, text: "0 - ENTRADA", x: PDF.width * 0.415, y: PDF.mtBlock + 42, maxWidth: PDF.width * 0.19, align: "left" });
        addTXT({ page, size: 8, text: "1 - SAÍDA", x: PDF.width * 0.415, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.19, align: "left" });
        addTXT({ page, size: 20, text: "1", x: PDF.width * 0.534, y: PDF.mtBlock + 37, maxWidth: PDF.width * 0.19, align: "left" });
        addTXT({ page, size: 10, text: "Nº. 000.000.264", x: PDF.width * 0.4, y: PDF.mtBlock + 63, maxWidth: PDF.width * 0.19, align: "center" });
        addTXT({ page, size: 10, text: "Série 000", x: PDF.width * 0.398, y: PDF.mtBlock + 72, maxWidth: PDF.width * 0.19, align: "center" });
        addTXT({ page, size: 8, text: "Série 000", x: PDF.width * 0.398, y: PDF.mtBlock + 82, maxWidth: PDF.width * 0.19, align: "center" });


        addTXT({ page, text: "CHAVE DE ACESSO", x: PDF.width * 0.575, y: PDF.mtBlock + 47, maxWidth: PDF.width * 0.19 });
        addTXT({ page, size: 8, text: "5125 0547 5063 0600 0188 5500 0000 0002 6410 0002 0233", x: PDF.width * 0.595, y: PDF.mtBlock + 58, maxWidth: PDF.width * 0.39, align: "center" });
        addTXT({ page, size: 8, text: "Consulta de autenticidade no portal nacional da NF-e", x: PDF.width * 0.595, y: PDF.mtBlock + 70, maxWidth: PDF.width * 0.39, align: "center" });
        addTXT({ page, size: 8, text: " www.nfe.fazenda.gov.br/portal ou no site da Sefaz Autorizadora", x: PDF.width * 0.595, y: PDF.mtBlock + 81, maxWidth: PDF.width * 0.39, align: "center" });
        addTXT({ page, text: "PROTOCOLO DE AUTORIZAÇÃO DE USO", x: PDF.width * 0.575, y: PDF.mtBlock + 92, maxWidth: PDF.width * 0.29 });
        addTXT({ page, size: 10, text: "151250037548938  -  05/05/2025 15:17:16", x: PDF.width * 0.595, y: PDF.mtBlock + 101, maxWidth: PDF.width * 0.39, align: "center" });
        addTXT({ page, text: "NATUREZA DA OPERAÇÃO", x: 3, y: PDF.mtBlock + 92, maxWidth: PDF.width * 0.29 });
        addTXT({ page, size: 10, text: "VENDA", x: 3, y: PDF.mtBlock + 101, maxWidth: PDF.width * 0.58, align: "center" });

        addTXT({ page, text: "INSCRIÇÃO ESTADUAL", x: 3, y: PDF.mtBlock + 112, maxWidth: PDF.width * 0.29 });
        addTXT({ page, size: 10, text: " 139551956", x: 3, y: PDF.mtBlock + 121, maxWidth: PDF.width * 0.25, align: "center" });

        addTXT({ page, text: " INSCRIÇÃO MUNICIPAL", x: PDF.width * 0.255, y: PDF.mtBlock + 112, maxWidth: PDF.width * 0.29 });
        addTXT({ page, size: 10, text: "xxxxxx", x: PDF.width * 0.355, y: PDF.mtBlock + 121, maxWidth: PDF.width * 0.05, align: "center" });

        addTXT({ page, text: "INSCRIÇÃO ESTADUAL DO SUBST. TRIBUT.", x: PDF.width * 0.5, y: PDF.mtBlock + 112, maxWidth: PDF.width * 0.29 });
        addTXT({ page, size: 10, text: "xxxxx", x: PDF.width * 0.6, y: PDF.mtBlock + 121, maxWidth: PDF.width * 0.05, align: "center" });

        addTXT({ page, text: "CNPJ/CPF", x: PDF.width * 0.75, y: PDF.mtBlock + 112, maxWidth: PDF.width * 0.29 });
        addTXT({ page, size: 10, text: "47.506.306/0001-88666", x: PDF.width * 0.845, y: PDF.mtBlock + 121, maxWidth: PDF.width * 0.05, align: "center" });
        PDF.mtBlock += 133;
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
        //addRet(page, 0, PDF.mtBlock + 30, PDF.width, 20);
        addTXT({ page, text: "DESTINATÁRIO / REMETENTE", x: 3, y: PDF.mtBlock + 2, maxWidth: PDF.width * 0.4 });


        addTXT({ page, text: "NOME / RAZÃO SOCIAL", x: 3, y: PDF.mtBlock + 10, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: "NOVA XAVANTINA CAMARA MUNICIPAL", x: 3, y: PDF.mtBlock + 20, maxWidth: PDF.width * 0.42 });

        addTXT({ page, text: "CNPJ/CPF", x: PDF.width * 0.61, y: PDF.mtBlock + 10, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: "15.372.402/0001-94", x: PDF.width * 0.51, y: PDF.mtBlock + 20, maxWidth: PDF.width * 0.42, align: "center" });


        addTXT({ page, text: "DATA DA EMISSÃO", x: PDF.width * 0.83, y: PDF.mtBlock + 10, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: "23/05/2025", x: PDF.width * 0.83, y: PDF.mtBlock + 20, maxWidth: PDF.width * 0.42, align: "center" });

        addTXT({ page, text: "DATA DA EMISSÃO", x: 2, y: PDF.mtBlock + 31, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: "AV PARA, N° 138", x: 3, y: PDF.mtBlock + 40, maxWidth: PDF.width * 0.42, align: "left" });

        addTXT({ page, text: "BAIRRO", x: PDF.width * 0.47, y: PDF.mtBlock + 31, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: "UNIÃO", x: PDF.width * 0.47, y: PDF.mtBlock + 40, maxWidth: PDF.width * 0.21, align: "center" });

        addTXT({ page, text: "CEP", x: PDF.width * 0.67, y: PDF.mtBlock + 31, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: "78690-000", x: PDF.width * 0.67, y: PDF.mtBlock + 40, maxWidth: PDF.width * 0.17, align: "center" });

        addTXT({ page, text: "DATA DA SAÍDA/ENTRDA", x: PDF.width * 0.83, y: PDF.mtBlock + 31, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: "78690-000", x: PDF.width * 0.83, y: PDF.mtBlock + 40, maxWidth: PDF.width * 0.17, align: "center" });

        addTXT({ page, text: "MUNICIPIO", x: 2, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: "NOVA XAVANTINA", x: 3, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.42, align: "left" });

        addTXT({ page, text: "UF", x: PDF.width * 0.47, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: "MT", x: PDF.width * 0.473, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.21, align: "left" });


        addTXT({ page, text: "BAIRRO", x: PDF.width * 0.505, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: "UNIÃO", x: PDF.width * 0.505, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.17, align: "center" });


        addTXT({ page, text: "INSCRIÇÃO ESTADUAL", x: PDF.width * 0.67, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: "UNIÃO", x: PDF.width * 0.67, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.17, align: "center" });

        addTXT({ page, text: "DATA DA SAÍDA/ENTRDA", x: PDF.width * 0.83, y: PDF.mtBlock + 50, maxWidth: PDF.width * 0.4 });
        addTXT({ page, size: 9, text: "78690-000", x: PDF.width * 0.83, y: PDF.mtBlock + 60, maxWidth: PDF.width * 0.17, align: "center" });
        PDF.mtBlock += 73;
    }

    async function bloco3(page = PDF.pages[(PDF.pages.length - 1)]) {
        addTXT({ page, text: "PAGAMENTO", x: 3, y: PDF.mtBlock, maxWidth: PDF.width * 0.25 });
        addRet(page, 0, PDF.mtBlock + 7, PDF.width * 0.25, 20);
        addTXT({ page, text: "FORMA", x: 3, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.25 });
        addTXT({ page, text: "DINHEIRO", x: 3, y: PDF.mtBlock + 18, maxWidth: PDF.width * 0.25 });

        addTXT({ page, text: "Dinheiro", x: 3, y: PDF.mtBlock + 8, maxWidth: PDF.width * 0.245, align: "right" });
        addTXT({ page, text: "R$ 600,00", x: 3, y: PDF.mtBlock + 18, maxWidth: PDF.width * 0.245, align: "right" });
        PDF.mtBlock += 28;
    }

    async function bloco4(page = PDF.pages[(PDF.pages.length - 1)]) {
        const ICMS: any = {
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
        addTXT({ page, text: "PAGAMENTO", x: 3, y: PDF.mtBlock, maxWidth: PDF.width * 0.25 });
        let nextY = PDF.mtBlock + 8,
            nextX = 0,
            limitY = (PDF.width-8);
        for (const key of Object.keys(ICMS)) {
            await addRet(page, (limitY * 0.111) * nextX, nextY, limitY * 0.111, 20);
            addTXT({ page, text: ICMS[key], x: 2 + (limitY * 0.111) * nextX, y: nextY + 1, maxWidth: limitY * 0.111 });
            addTXT({ page, size: 10, text: "0,00", x: (limitY * 0.111) * nextX, y: nextY+9, maxWidth: limitY * 0.111, align: "right" });
            nextX++;
            if (nextX >= 9) {
                nextX = 0;
                nextY += 20;
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
        if (isBrowser) {
            // 📦 Browser
            await gerarBlocos();

            resolve(PDF.doc.save())
        } else {
            // 🧱 Node.js
            const { PassThrough } = await import('stream');
            const stream = new PassThrough();
            const chunks: Uint8Array[] = [];

            await gerarBlocos();


            PDF.doc.pipe(stream);
            PDF.doc.end(); // Aqui fecha o PDF

            stream.on('data', chunk => chunks.push(chunk));
            stream.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const base64 = buffer.toString('base64');
                resolve(base64);
            });
            stream.on('error', reject);
        }
    });
}

export { DANFe }