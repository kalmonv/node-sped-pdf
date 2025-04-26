import PDFDocument from "@react-pdf/pdfkit"
import { XMLParser } from "fast-xml-parser"

class danfe {
    #pdf: any;
    #nextBloco = 0;
    #xml: Record<string, any> = {};
    #xmlRes: Record<string, any> | null = null;
    #logo: any = null;
    #imgDemo: string | null = null;
    #isBrowser: boolean = false;

    constructor(data: { xml?: string, xmlRes?: Record<string, any> | null, logo?: any | null, imgDemo?: string | null } = {}) {
        this.#isBrowser = typeof window !== 'undefined';
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@",
            parseTagValue: false,       // Evita conversão automática de valores
        });
        let tXml = data.xml ? parser.parse(data.xml) : {};
        if (typeof tXml.nfeProc != 'undefined') { //NFe com manifesto
            tXml = tXml.nfeProc;
        }

        this.#xml = tXml;
        console.log(tXml)
        this.#xmlRes = data.xmlRes || null;
        this.#logo = data.logo || null;
        this.#imgDemo = data.imgDemo || null;

        this.#pdf = new PDFDocument({
            bufferPages: true,
            margin: 0,
            size: [
                this.#pdfWidth,
                this.#pdfHeight
            ],
            info: {
                Author: "Kalmon Valadao Tavares",
                Title: "DANFE",
                Creator: "Guara DEV",
                Producer: "http://github.com/brasil-js/danfe"
            }
        });
    }

    getPDF(): Promise<string> {
        // Detecta se está rodando no browser ou Node
        return new Promise(async (resolve, reject) => {
            if (this.#isBrowser) {
                // 📦 Browser
                const stream = this.#pdf.pipe(window.blobStream());
                await this.#bloco0();
                await this.#bloco1();
                await this.#bloco2();
                await this.#bloco3();
                await this.#bloco4();
                await this.#bloco5();
                await this.#bloco6();

                if (this.#imgDemo != null) this.#demo();
                this.#pdf.end();

                stream.on('finish', () => {
                    const blob = stream.toBlob('application/pdf');
                    const reader = new FileReader();

                    reader.onloadend = () => {
                        const result = reader.result as string;
                        const base64 = result.slice(result.indexOf(',') + 1);
                        resolve(base64);
                    };

                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } else {
                // 🧱 Node.js
                const { PassThrough } = await import('stream');
                const stream = new PassThrough();
                const chunks: Uint8Array[] = [];

                stream.on('data', (chunk) => chunks.push(chunk));
                stream.on('end', () => {
                    const buffer = Buffer.concat(chunks);
                    resolve(buffer.toString('base64'));
                });

                this.#pdf.pipe(stream);
                await this.#bloco0();
                await this.#bloco1();
                await this.#bloco2();
                await this.#bloco3();
                await this.#bloco4();
                await this.#bloco5();
                await this.#bloco6();

                if (this.#imgDemo != null) this.#demo();
                this.#pdf.end();
            }
        });
    }

    #demo() {
        this.#pdf.image(this.#imgDemo as string, 0, 0, { width: this.#pdfWidth }).text("", 0, 0);
    }


    //Recibo
    #bloco0() {
        this.#addRetangulo({ l: 0, t: this.#pdfHeight * 0.03, w: this.#pdfWidth * 0.805, h: this.#pdfHeight * 0.03 });
        this.#addTXT({ aling: 'left', txt: "IDENTIFICAÇÃO E ASSINATURA DO RECEBEDOR", l: this.#pdfWidth * 0.18, t: 28, w: this.#pdfWidth * 0.5 });

        this.#addRetangulo({ l: 0, t: 0, w: this.#pdfWidth * 0.805, h: this.#pdfHeight * 0.06 });
        this.#addTXT({ aling: 'justify', l: 2, t: 3, w: this.#pdfWidth * 0.78, txt: `RECEBEMOS DE ${this.#xml.NFe.infNFe.emit.xNome} OS PRODUTOS E/OU SERVIÇOS CONSTANTES DA NOTA FISCAL ELETRÔNICA INDICADA ABAIXO. EMISSÃO: ${new Date(this.#xml.NFe.infNFe.ide.dhEmi).toLocaleString().split(",")[0]} VALOR TOTAL: R$ ${this.#xml.NFe.infNFe.total.ICMSTot.vNF} DESTINATÁRIO: ${this.#xml.NFe.infNFe.dest.xNome} - ${this.#xml.NFe.infNFe.dest.enderDest.xLgr}, N°${this.#xml.NFe.infNFe.dest.enderDest.nro}, Bairro ${this.#xml.NFe.infNFe.dest.enderDest.xBairro}, ${this.#xml.NFe.infNFe.dest.enderDest.xMun}}-${this.#xml.NFe.infNFe.dest.enderDest.UF}` });


        this.#addRetangulo({ l: 0, t: this.#pdfHeight * 0.03, w: this.#pdfWidth * 0.175, h: this.#pdfHeight * 0.03 });
        this.#addTXT({ aling: 'left', txt: "DATA DE RECEBIMENTO", l: 2, t: 28, w: this.#pdfWidth * 0.17 });

        this.#addRetangulo({ l: 0, t: 0, w: this.#pdfWidth, h: this.#pdfHeight * 0.06 });
        this.#addTXT({ aling: 'center', font: "bold", txt: "NF-e", l: this.#pdfWidth * 0.81, t: 6, size: 15, w: this.#pdfWidth * 0.18 });
        this.#addTXT({ aling: 'center', font: "bold", txt: `Nº.  ${this.#xml.NFe.infNFe.ide.nNF.padStart(9, "0").slice(0, 3)}.${this.#xml.NFe.infNFe.ide.nNF.padStart(9, "0").slice(3, 6)}.${this.#xml.NFe.infNFe.ide.nNF.padStart(9, "0").slice(6, 9)}`, l: this.#pdfWidth * 0.81, t: 22, size: 12, w: this.#pdfWidth * 0.18 });
        this.#addTXT({ aling: 'center', font: "bold", txt: `Série ${this.#xml.NFe.infNFe.ide.serie}`, l: this.#pdfWidth * 0.81, t: 34, size: 12, w: this.#pdfWidth * 0.18 });

        this.#addLinhaHT({ t: this.#pdfHeight * 0.07, ls: 0, le: this.#pdfWidth })
        this.#mtIndex += this.#pdfHeight * 0.071;
    }

    async #bloco1() {
        this.#addRetangulo({ l: 0, t: 0, w: this.#pdfWidth * 0.41, h: this.#pdfHeight * 0.108 });
        this.#addTXT({
            aling: 'center', font: "italic", txt: "IDENTIFICAÇÃO DO EMITENTE",
            l: 0, t: 3, w: this.#pdfWidth * 0.4
        });

        let mtLogo = 0;
        if (this.#logo != null) {
            if (this.#logo.includes("http")) {
                this.#logo = await fetch(this.#logo).then(response => response.blob()).then(blob => this.#blob2base64(blob));
            }
            this.#addBase64IMG({ l: 3, t: 8, w: this.#pdfWidth * 0.41, h: this.#pdfHeight * 0.108, base64: this.#logo });
            mtLogo = 28;
        }
        this.#addTXT({
            aling: 'center', font: "bold", txt: this.#xml.NFe.infNFe.emit.xNome,
            l: 0, t: 34 + mtLogo, w: this.#pdfWidth * 0.4, size: 12
        });
        this.#addTXT({
            aling: 'center', txt: `${this.#xml.NFe.infNFe.emit.enderEmit.xLgr}, N°${this.#xml.NFe.infNFe.emit.enderEmit.nro}, ${this.#xml.NFe.infNFe.emit.enderEmit.xBairro}, CEP ${this.#xml.NFe.infNFe.emit.enderEmit.CEP}`,
            l: 0, t: 44 + mtLogo, w: this.#pdfWidth * 0.4, size: 10
        });
        this.#addTXT({
            aling: 'center', txt: `${this.#xml.NFe.infNFe.emit.enderEmit.xMun} - ${this.#xml.NFe.infNFe.emit.enderEmit.UF}, Fone ${this.#xml.NFe.infNFe.emit.enderEmit.fone}`,
            l: 0, t: 54 + mtLogo, w: this.#pdfWidth * 0.4, size: 10
        });


        this.#addRetangulo({ l: this.#pdfWidth * 0.41, t: 0, w: this.#pdfWidth * 0.168, h: this.#pdfHeight * 0.108 });
        this.#addTXT({
            aling: 'center', font: "bold", txt: "DANFE",
            l: this.#pdfWidth * 0.41, t: 8, w: this.#pdfWidth * 0.167, size: 12
        });
        this.#addTXT({
            aling: 'center', txt: "Documento Auxiliar da Nota Fiscal Eletrônica",
            l: this.#pdfWidth * 0.41, t: 20, w: this.#pdfWidth * 0.167
        });
        this.#addTXT({
            aling: 'left', txt: "0 - ENTRADA\n1 - SAÍDA",
            l: this.#pdfWidth * 0.42, t: 39, w: this.#pdfWidth * 0.169, size: 9
        });
        this.#addTXT({
            aling: 'center', font: "bold", txt: `Nº. ${this.#xml.NFe.infNFe.ide.nNF}`,
            l: this.#pdfWidth * 0.41, t: 61, w: this.#pdfWidth * 0.167, size: 11
        });
        this.#addTXT({
            aling: 'center', font: "bold", txt: `Série ${this.#xml.NFe.infNFe.ide.serie}`,
            l: this.#pdfWidth * 0.41, t: 71, w: this.#pdfWidth * 0.167, size: 11
        });
        this.#addTXT({
            aling: 'center', font: 'italic', txt: `Folha ${this.#pagIndex}/${this.#pagQtd}`,
            l: this.#pdfWidth * 0.41, t: 81, w: this.#pdfWidth * 0.167, size: 8
        });

        this.#addRetangulo({ l: this.#pdfWidth * 0.54, t: this.#pdfHeight * 0.045, w: this.#pdfWidth * 0.023, h: this.#pdfHeight * 0.023 });
        this.#addTXT({
            aling: 'center', font: "bold", txt: "1",
            l: this.#pdfWidth * 0.54, t: this.#pdfHeight * 0.05, w: this.#pdfWidth * 0.023, size: 15
        });

        //Codigo de barras
        this.#addRetangulo({ l: this.#pdfWidth * 0.578, t: 0, w: this.#pdfWidth, h: this.#pdfHeight * 0.054 });


        this.#addRetangulo({ l: this.#pdfWidth * 0.578, t: this.#pdfHeight * 0.054, w: this.#pdfWidth, h: this.#pdfHeight * 0.027 });
        this.#addTXT({
            aling: 'center', txt: "IDENTIFICAÇÃO DO EMITENTE",
            l: this.#pdfWidth * 0.582, t: this.#pdfHeight * 0.056
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: this.#xml.NFe.infNFe['@Id'].replace("NFe", "").match(/.{1,4}/g).join(' '),
            l: this.#pdfWidth * 0.582, t: this.#pdfHeight * 0.071,
            w: this.#pdfWidth,
            size: 9
        });


        this.#addRetangulo({ l: this.#pdfWidth * 0.578, t: this.#pdfHeight * 0.0808, w: this.#pdfWidth, h: this.#pdfHeight * 0.027 });
        this.#addTXT({
            aling: 'center', txt: "Consulta de autenticidade no portal nacional da NF-e",
            l: this.#pdfWidth * 0.582, t: this.#pdfHeight * 0.084,
            w: this.#pdfWidth,
            size: 9
        });
        this.#addTXT({
            aling: 'center', txt: "www.nfe.fazenda.gov.br/portal ou no site da Sefaz Autorizadora",
            l: this.#pdfWidth * 0.582, t: this.#pdfHeight * 0.097,
            w: this.#pdfWidth,
            size: 9
        });


        this.#addRetangulo({ l: 0, t: this.#pdfHeight * 0.108, w: this.#pdfWidth * 0.578, h: this.#pdfHeight * 0.023 });
        this.#addTXT({
            aling: 'center', txt: "NATUREZA DA OPERAÇÃO",
            l: 3, t: this.#pdfHeight * 0.11, w: this.#pdfWidth * 0.56,
        });
        this.#addTXT({
            aling: 'center', txt: this.#xml.NFe.infNFe.ide.natOp,
            l: 3, t: this.#pdfHeight * 0.121, w: this.#pdfWidth * 0.56,
            font: "bold", size: 10
        });


        this.#addRetangulo({ l: this.#pdfWidth * 0.578, t: this.#pdfHeight * 0.108, w: this.#pdfWidth * 0.578, h: this.#pdfHeight * 0.023 });
        if (typeof this.#xml.protNFe != "undefined") {
            this.#addTXT({
                aling: 'center', txt: "PROTOCOLO DE AUTORIZAÇÃO DE USO",
                l: this.#pdfWidth * 0.58, t: this.#pdfHeight * 0.11
            });
            this.#addTXT({
                font: "bold",
                aling: 'center', txt: `${this.#xml.protNFe.nProt} - ${this.#formtPTBR(this.#xml.protNFe.dhRecbto)}`,
                l: this.#pdfWidth * 0.582, t: this.#pdfHeight * 0.122,
                w: this.#pdfWidth,
                size: 9
            });
        }



        this.#addRetangulo({ l: 0, t: this.#pdfHeight * 0.131, w: this.#pdfWidth * 0.256, h: this.#pdfHeight * 0.023 });
        this.#addTXT({
            aling: 'left', txt: "INSCRIÇÃO ESTADUAL",
            l: 2, t: this.#pdfHeight * 0.133
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: this.#xml.NFe.infNFe.emit.IE || "",
            l: 0, t: this.#pdfHeight * 0.145,
            w: this.#pdfWidth * 0.24,
            size: 9
        });


        this.#addRetangulo({ l: this.#pdfWidth * 0.256, t: this.#pdfHeight * 0.131, w: this.#pdfWidth * 0.249, h: this.#pdfHeight * 0.023 });
        this.#addTXT({
            aling: 'left', txt: "INSCRIÇÃO MUNICIPAL",
            l: this.#pdfWidth * 0.259, t: this.#pdfHeight * 0.133
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: this.#xml.NFe.infNFe.emit.IM || "",
            l: this.#pdfWidth * 0.259, t: this.#pdfHeight * 0.145,
            w: this.#pdfWidth * 0.24,
            size: 9
        });

        this.#addRetangulo({ l: this.#pdfWidth * 0.505, t: this.#pdfHeight * 0.131, w: this.#pdfWidth * 0.578, h: this.#pdfHeight * 0.023 });
        this.#addTXT({
            aling: 'left', txt: "INSCRIÇÃO ESTADUAL DO SUBST. TRIBUT",
            l: this.#pdfWidth * 0.507, t: this.#pdfHeight * 0.133
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: this.#xml.NFe.infNFe.emit.I_EST || "",
            l: this.#pdfWidth * 0.507, t: this.#pdfHeight * 0.145,
            w: this.#pdfWidth * 0.24,
            size: 9
        });


        this.#addRetangulo({ l: this.#pdfWidth * 0.753, t: this.#pdfHeight * 0.131, w: this.#pdfWidth * 0.578, h: this.#pdfHeight * 0.023 });
        this.#addTXT({
            aling: 'center', txt: "CNPJ / CPF",
            l: this.#pdfWidth * 0.755, t: this.#pdfHeight * 0.133
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: this.#xml.NFe.infNFe.emit.CPF || this.#xml.NFe.infNFe.emit.CNPJ,
            l: this.#pdfWidth * 0.755, t: this.#pdfHeight * 0.145,
            w: this.#pdfWidth,
            size: 9
        });

        this.#mtIndex += this.#pdfHeight * 0.16;
    }

    #formtPTBR(dataIso: string) {
        const data = new Date(dataIso);

        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
        const ano = data.getFullYear();

        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        const segundos = String(data.getSeconds()).padStart(2, '0');

        return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
    }

    #bloco2() {
        this.#addTXT({
            font: "bold",
            aling: 'left', txt: "DESTINATÁRIO / REMETENTE",
            l: 0, t: 1,
            size: 8
        });

        this.#addRetangulo({ l: 0, t: 8, w: this.#pdfWidth * 0.61, h: this.#pdfHeight * 0.023 });
        this.#addTXT({
            aling: 'left', txt: "NOME / RAZÃO SOCIAL",
            l: 2, t: 10
        });
        this.#addTXT({
            font: "bold",
            aling: 'left', txt: this.#xml.NFe.infNFe.dest.xNome,
            l: 2, t: this.#pdfHeight * 0.023,
            w: this.#pdfWidth * 0.61,
            size: 9
        });


        this.#addRetangulo({ l: this.#pdfWidth * 0.61, t: 8, w: this.#pdfWidth * 0.225, h: this.#pdfHeight * 0.023 });
        this.#addTXT({
            aling: 'left', txt: "CNPJ / CPF",
            l: this.#pdfWidth * 0.61, t: 10
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: this.#xml.NFe.infNFe.dest.CPF || this.#xml.NFe.infNFe.dest.CNPJ,
            l: this.#pdfWidth * 0.61, t: this.#pdfHeight * 0.023,
            w: this.#pdfWidth * 0.225,
            size: 9
        });


        this.#addRetangulo({ l: this.#pdfWidth * 0.835, t: 8, w: this.#pdfWidth * 0.225, h: this.#pdfHeight * 0.023 });
        this.#addTXT({
            aling: 'left', txt: "DATA DA EMISSÃO",
            l: this.#pdfWidth * 0.835, t: 10
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: (this.#formtPTBR(this.#xml.NFe.infNFe.ide.dhEmi)).split(" ")[0],
            l: this.#pdfWidth * 0.835, t: this.#pdfHeight * 0.023,
            w: this.#pdfWidth * 0.15,
            size: 9
        });

        this.#addRetangulo({ l: 0, t: 27.5, w: this.#pdfWidth * 0.47, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "ENDEREÇO",
            l: 2, t: 29
        });
        this.#addTXT({
            font: "bold",
            aling: 'left', txt: this.#xml.NFe.infNFe.dest.enderDest.xLgr,
            l: 2, t: 39,
            w: this.#pdfWidth * 0.45,
            size: 9
        });


        this.#addRetangulo({ l: this.#pdfWidth * 0.47, t: 27.5, w: this.#pdfWidth * 0.205, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "BAIRRO / DISTRITO",
            l: this.#pdfWidth * 0.472, t: 29
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: this.#xml.NFe.infNFe.dest.enderDest.xBairro,
            l: this.#pdfWidth * 0.472, t: 39,
            w: this.#pdfWidth * 0.2,
            size: 9
        });


        this.#addRetangulo({ l: this.#pdfWidth * 0.675, t: 27.5, w: this.#pdfWidth * 0.16, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "CEP",
            l: this.#pdfWidth * 0.677, t: 29
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: this.#xml.NFe.infNFe.dest.enderDest.CEP,
            l: this.#pdfWidth * 0.677, t: 39,
            w: this.#pdfWidth * 0.16,
            size: 9
        });

        this.#addRetangulo({ l: this.#pdfWidth * 0.835, t: 27.5, w: this.#pdfWidth * 0.225, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "DATA DA SAÍDA/ENTRADA",
            l: this.#pdfWidth * 0.837, t: 29
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: ((this.#formtPTBR(this.#xml.NFe.infNFe.ide.dhEmi)).split(" ")[0]),
            l: this.#pdfWidth * 0.837, t: 39,
            w: this.#pdfWidth * 0.16,
            size: 9
        });


        this.#addRetangulo({ l: 0, t: 46.5, w: this.#pdfWidth * 0.47, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "MUNICIPIO",
            l: 2, t: 48.5
        });
        this.#addTXT({
            font: "bold",
            aling: 'left', txt: this.#xml.NFe.infNFe.dest.enderDest.xMun,
            l: 2, t: 58.5,
            w: this.#pdfWidth * 0.45,
            size: 9
        });


        this.#addRetangulo({ l: this.#pdfWidth * 0.47, t: 46.5, w: this.#pdfWidth * 0.04, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "UF",
            l: this.#pdfWidth * 0.472, t: 48.5
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: this.#xml.NFe.infNFe.dest.enderDest.UF,
            l: this.#pdfWidth * 0.47, t: 58.5,
            w: this.#pdfWidth * 0.04,
            size: 9
        });


        this.#addRetangulo({ l: this.#pdfWidth * 0.510, t: 46.5, w: this.#pdfWidth * 0.165, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "FONE / FAX",
            l: this.#pdfWidth * 0.512, t: 48.5
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: this.#xml.NFe.infNFe.dest.enderDest.fone || "",
            l: this.#pdfWidth * 0.512, t: 58.5,
            w: this.#pdfWidth * 0.165,
            size: 9
        });


        this.#addRetangulo({ l: this.#pdfWidth * 0.675, t: 46.5, w: this.#pdfWidth * 0.16, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "INSCRIÇÃO ESTADUAL",
            l: this.#pdfWidth * 0.677, t: 48.5
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: this.#xml.NFe.infNFe.dest.IE || "",
            l: this.#pdfWidth * 0.677, t: 58.5,
            w: this.#pdfWidth * 0.16,
            size: 9
        });

        this.#addRetangulo({ l: this.#pdfWidth * 0.835, t: 46.5, w: this.#pdfWidth * 0.1565, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "HORA DA SAÍDA/ENTRADA",
            l: this.#pdfWidth * 0.834, t: 48.5
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: ((this.#formtPTBR(this.#xml.NFe.infNFe.ide.dhEmi)).split(" ")[1]),
            l: this.#pdfWidth * 0.834, t: 58.5,
            w: this.#pdfWidth * 0.1565,
            size: 9
        });
        this.#mtIndex += 69;
    }

    #bloco3(leftM = 2, addDesc = true) {
        if (addDesc) {
            this.#addTXT({
                font: "bold",
                aling: 'left',
                txt: "PAGAMENTO",
                l: 0, t: 1,
                size: 8
            });
        }

        const pagamentos = this.#xml?.NFe?.infNFe?.pag?.detPag ?? [];
        const detPag = Array.isArray(pagamentos) ? pagamentos : [pagamentos];

        let top = 8; // posição vertical inicial

        for (const pag of detPag) {
            const formaPagamento = this.#traduzirFormaPagamento(pag.tPag);
            const valorPagamento = parseFloat(pag.vPag).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            this.#addRetangulo({ l: leftM, t: top, w: this.#pdfWidth * 0.25, h: 19 });

            this.#addTXT({
                aling: 'left',
                txt: "Forma:",
                l: leftM,
                t: top + 1
            });
            this.#addTXT({
                aling: 'right',
                txt: formaPagamento,
                l: leftM,
                t: top + 1,
                w: this.#pdfWidth * 0.24,
                size: 9
            });

            this.#addTXT({
                aling: 'left',
                txt: "Valor:",
                l: leftM,
                t: top + 10,
                w: this.#pdfWidth * 0.25,
                size: 9
            });
            this.#addTXT({
                aling: 'right',
                txt: valorPagamento,
                l: leftM,
                t: top + 10,
                w: this.#pdfWidth * 0.24,
                size: 9
            });

            top += 30; // pular espaço para o próximo pagamento
        }

        this.#mtIndex += top;
    }

    #traduzirFormaPagamento(tPag: string): string {
        const formasPagamento: { [key: string]: string } = {
            '01': 'Dinheiro',
            '02': 'Cheque',
            '03': 'Cartão Crédito',
            '04': 'Cartão Débito',
            '05': 'Crédito Loja',
            '10': 'Vale Alimentação',
            '11': 'Vale Refeição',
            '12': 'Vale Presente',
            '13': 'Vale Combustível',
            '14': 'Duplicata',
            '15': 'Boleto',
            '16': 'Depósito',
            '17': 'PIX Dinâmico',
            '18': 'Transferência',
            '19': 'Fidelidade',
            '20': 'PIX Estático',
            '21': 'Crédito Loja',
            '22': 'Falha Eletrônico',
            '90': 'Sem Pagamento',
            '99': 'Outros'
        };
        return formasPagamento[tPag] || 'Desconhecido';
    }

    #bloco4() {
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

        this.#addTXT({
            font: "bold",
            aling: 'left', txt: " CÁLCULO DO IMPOSTO",
            l: 0, t: 1,
            size: 8
        });

        let top = 0, left = 0;
        (Object.keys(ICMS) as Array<keyof typeof ICMS>).forEach((key, index) => {
            this.#addRetangulo({ l: 0 + left, t: 8 + top, w: this.#pdfWidth * 0.11, h: 19 });
            this.#addTXT({
                aling: 'left', txt: ICMS[key],
                l: 2 + left, t: 9 + top, w: this.#pdfWidth * 0.11
            });
            this.#addTXT({
                font: "bold",
                aling: 'right', txt: `R$ ${this.#xml.NFe.infNFe.total.ICMSTot[key]}`,
                l: 0 + left, t: 19 + top,
                w: ((this.#pdfWidth - this.#pdfMargin) * 0.105) - (left > 0 ? 0 : 5),
                size: 9
            });
            left += this.#pdfWidth * 0.11;
            if ((1 + index) % 9 === 0) {
                top += 19;
                left = 0;
            }
        });

        this.#mtIndex += 30 + top;
    }

    #traduzirTipoFrete(codigo: string): string {
        const tiposFrete: { [key: string]: string } = {
            '0': 'Frete por Conta do Remetente (CIF)',
            '1': 'Frete por Conta do Destinatário (FOB)',
            '2': 'Frete por Conta de Terceiros',
            '3': 'Transporte Próprio Remetente',
            '4': 'Transporte Próprio Destinatário',
            '9': 'Sem Transporte'
        };
        return tiposFrete[String(codigo)] ?? 'Tipo de Frete Desconhecido';
    }

    #bloco5() {
        this.#addTXT({
            font: "bold",
            aling: 'left', txt: "TRANSPORTADOR / VOLUMES TRANSPORTADOS",
            l: 0, t: 1,
            size: 8
        });

        this.#addRetangulo({ l: 0, t: 8, w: this.#pdfWidth * 0.29, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "NOME / RAZÃO SOCIAL",
            l: 2, t: 9
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: this.#xml.NFe.infNFe.transp.CPF || this.#xml.NFe.infNFe.transp.CNPJ || "",
            l: 2, t: 19,
            w: this.#pdfWidth * 0.29,
            size: 9
        });


        this.#addRetangulo({ l: this.#pdfWidth * 0.29, t: 8, w: this.#pdfWidth * 0.15, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "FRETE",
            l: this.#pdfWidth * 0.293, t: 9
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: `${this.#xml.NFe.infNFe.transp.modFrete} - ${this.#traduzirTipoFrete(this.#xml.NFe.infNFe.transp.modFrete)}`,
            l: this.#pdfWidth * 0.293, t: 19,
            w: this.#pdfWidth * 0.15,
            size: 9
        });

        this.#addRetangulo({ l: this.#pdfWidth * 0.44, t: 8, w: this.#pdfWidth * 0.15, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "CÓDIGO ANTT",
            l: this.#pdfWidth * 0.442, t: 9
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: (this.#xml.NFe.infNFe.transp?.veicTransp?.RNTC) || ""            ,
            l: this.#pdfWidth * 0.44, t: 19,
            w: this.#pdfWidth * 0.15,
            size: 9
        });

        this.#addRetangulo({ l: this.#pdfWidth * 0.59, t: 8, w: this.#pdfWidth * 0.15, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "PLACA DO VEÍCULO",
            l: this.#pdfWidth * 0.592, t: 9
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: (this.#xml.NFe.infNFe.transp?.veicTransp?.placa) || "",
            l: this.#pdfWidth * 0.59, t: 19,
            w: this.#pdfWidth * 0.15,
            size: 9
        });

        this.#addRetangulo({ l: this.#pdfWidth * 0.74, t: 8, w: this.#pdfWidth * 0.04, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "UF",
            l: this.#pdfWidth * 0.742, t: 9
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: (this.#xml.NFe.infNFe.transp?.veicTransp?.UF) || "",
            l: this.#pdfWidth * 0.742, t: 19,
            w: this.#pdfWidth * 0.04,
            size: 9
        });

        this.#addRetangulo({ l: this.#pdfWidth * 0.78, t: 8, w: this.#pdfWidth * 0.22, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "CNPJ / CPF",
            l: this.#pdfWidth * 0.782, t: 9
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: (this.#xml.NFe.infNFe.transp?.transporta?.CNPJ) || (this.#xml.NFe.infNFe.transp?.transporta?.CPF) || "",
            l: this.#pdfWidth * 0.78, t: 19,
            w: this.#pdfWidth * 0.22,
            size: 9
        });


        this.#addRetangulo({ l: 0, t: 27, w: this.#pdfWidth * 0.44, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "ENDEREÇO",
            l: 2, t: 28
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: (this.#xml.NFe.infNFe.transp?.transporta?.xEnder) || "",
            l: 2, t: 38,
            w: this.#pdfWidth * 0.44,
            size: 9
        });

        this.#addRetangulo({ l: this.#pdfWidth * 0.44, t: 27, w: this.#pdfWidth * 0.30, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "MUNICÍPIO",
            l: this.#pdfWidth * 0.442, t: 28
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: (this.#xml.NFe.infNFe.transp?.transporta?.xMun) || "",
            l: this.#pdfWidth * 0.44, t: 38,
            w: this.#pdfWidth * 0.30,
            size: 9
        });

        this.#addRetangulo({ l: this.#pdfWidth * 0.74, t: 27, w: this.#pdfWidth * 0.04, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "UF",
            l: this.#pdfWidth * 0.742, t: 28
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: (this.#xml.NFe.infNFe.transp?.transporta?.UF) || "",
            l: this.#pdfWidth * 0.742, t: 38,
            w: this.#pdfWidth * 0.04,
            size: 9
        });

        this.#addRetangulo({ l: this.#pdfWidth * 0.78, t: 27, w: this.#pdfWidth * 0.22, h: 19 });
        this.#addTXT({
            aling: 'left', txt: " INSCRIÇÃO ESTADUAL",
            l: this.#pdfWidth * 0.782, t: 28
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: (this.#xml.NFe.infNFe.transp?.transporta?.IE) || "",
            l: this.#pdfWidth * 0.78, t: 38,
            w: this.#pdfWidth * 0.22,
            size: 9
        });


        this.#addRetangulo({ l: 0, t: 46, w: this.#pdfWidth * 0.11, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "QUANTIDADE",
            l: 2, t: 47
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: (this.#xml.NFe.infNFe.transp?.vol?.qVol) || "",
            l: 2, t: 57,
            w: this.#pdfWidth * 0.11,
            size: 9
        });

        this.#addRetangulo({ l: this.#pdfWidth * 0.11, t: 46, w: this.#pdfWidth * 0.17, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "ESPÉCIE",
            l: this.#pdfWidth * 0.112, t: 47
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: (this.#xml.NFe.infNFe.transp?.vol?.esp) || "",
            l: this.#pdfWidth * 0.112, t: 57,
            w: this.#pdfWidth * 0.17,
            size: 9
        });



        this.#addRetangulo({ l: this.#pdfWidth * 0.28, t: 46, w: this.#pdfWidth * 0.16, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "MARCA",
            l: this.#pdfWidth * 0.282, t: 47
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: (this.#xml.NFe.infNFe.transp?.vol?.marca) || "",
            l: this.#pdfWidth * 0.28, t: 57,
            w: this.#pdfWidth * 0.16,
            size: 9
        });


        this.#addRetangulo({ l: this.#pdfWidth * 0.44, t: 46, w: this.#pdfWidth * 0.17, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "NUMERAÇÃO",
            l: this.#pdfWidth * 0.442, t: 47
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: (this.#xml.NFe.infNFe.transp?.vol?.nVol) || "",
            l: this.#pdfWidth * 0.44, t: 57,
            w: this.#pdfWidth * 0.16,
            size: 9
        });

        this.#addRetangulo({ l: this.#pdfWidth * 0.61, t: 46, w: this.#pdfWidth * 0.19, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "PESO BRUTO",
            l: this.#pdfWidth * 0.612, t: 47
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: (this.#xml.NFe.infNFe.transp?.vol?.pesoB) || "",
            l: this.#pdfWidth * 0.61, t: 57,
            w: this.#pdfWidth * 0.16,
            size: 9
        });


        this.#addRetangulo({ l: this.#pdfWidth * 0.80, t: 46, w: this.#pdfWidth * 0.20, h: 19 });
        this.#addTXT({
            aling: 'left', txt: "PESO LÍQUIDO",
            l: this.#pdfWidth * 0.802, t: 47
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: (this.#xml.NFe.infNFe.transp?.vol?.pesoL) || "",
            l: this.#pdfWidth * 0.80, t: 57,
            w: this.#pdfWidth * 0.2,
            size: 9
        });

        this.#mtIndex += 68;
    }

    #bloco6() {
        this.#addTXT({
            font: "bold",
            aling: 'left', txt: "DADOS DOS PRODUTOS / SERVIÇOS",
            l: 0, t: 1,
            size: 8
        });
        let tabH = 0;
        if (this.#pagQtd <= 1) { // Adicionar margem final
            tabH = (10 + this.#pdfHeight - this.#mtIndex) - 75;
        } else {
            tabH = (10 + this.#pdfHeight - this.#mtIndex);
        }
        this.#addRetangulo({ l: 0, t: 9, w: this.#pdfWidth, h: tabH });

        this.#addTXT({
            aling: 'center', txt: "CÓD. PRODUTO",
            l: 0, t: 12,
            w: this.#pdfWidth * 0.10,
        });

        this.#addTXT({
            aling: 'center', txt: "DESCRIÇÃO DO PRODUTO / SERVIÇO",
            l: this.#pdfWidth * 0.10, t: 12,
            w: this.#pdfWidth * 0.25,
        });
        this.#addLinhaVT({ l: this.#pdfWidth * 0.10, ts: 15, te: tabH + 15 });

        this.#addTXT({
            aling: 'center', txt: "NCM/SH",
            l: this.#pdfWidth * 0.35, t: 12,
            w: this.#pdfWidth * 0.05,
        });
        this.#addLinhaVT({ l: this.#pdfWidth * 0.35, ts: 15, te: tabH + 15 });

        this.#addTXT({
            aling: 'center', txt: "O/CSOSN",
            l: this.#pdfWidth * 0.40, t: 12,
            w: this.#pdfWidth * 0.05,
        });
        this.#addLinhaVT({ l: this.#pdfWidth * 0.40, ts: 15, te: tabH + 15 });

        this.#addTXT({
            aling: 'center', txt: "CFOP",
            l: this.#pdfWidth * 0.45, t: 12,
            w: this.#pdfWidth * 0.04,
        });
        this.#addLinhaVT({ l: this.#pdfWidth * 0.45, ts: 15, te: tabH + 15 });

        this.#addTXT({
            aling: 'center', txt: "UN",
            l: this.#pdfWidth * 0.49, t: 12,
            w: this.#pdfWidth * 0.03,
        });
        this.#addLinhaVT({ l: this.#pdfWidth * 0.49, ts: 15, te: tabH + 15 });


        this.#addTXT({
            aling: 'center', txt: "QUANT",
            l: this.#pdfWidth * 0.52, t: 12,
            w: this.#pdfWidth * 0.07,
        });
        this.#addLinhaVT({ l: this.#pdfWidth * 0.52, ts: 15, te: tabH + 15 });

        this.#addTXT({
            aling: 'center', txt: "QUANT",
            l: this.#pdfWidth * 0.59, t: 12,
            w: this.#pdfWidth * 0.06,
        });
        this.#addLinhaVT({ l: this.#pdfWidth * 0.59, ts: 15, te: tabH + 15 });

        this.#addTXT({
            aling: 'center', txt: "V. TOTAL",
            l: this.#pdfWidth * 0.65, t: 12,
            w: this.#pdfWidth * 0.06,
        });
        this.#addLinhaVT({ l: this.#pdfWidth * 0.65, ts: 15, te: tabH + 15 });

        this.#addTXT({
            aling: 'center', txt: "V. DESC.",
            l: this.#pdfWidth * 0.71, t: 12,
            w: this.#pdfWidth * 0.06,
        });
        this.#addLinhaVT({ l: this.#pdfWidth * 0.71, ts: 15, te: tabH + 15 });

        this.#addTXT({
            aling: 'center', txt: "B.CÁLC ICMS",
            l: this.#pdfWidth * 0.77, t: 12,
            w: this.#pdfWidth * 0.04,
        });
        this.#addLinhaVT({ l: this.#pdfWidth * 0.77, ts: 15, te: tabH + 15 });

        this.#addTXT({
            aling: 'center', txt: "V. ICMS",
            l: this.#pdfWidth * 0.81, t: 12,
            w: this.#pdfWidth * 0.06,
        });
        this.#addLinhaVT({ l: this.#pdfWidth * 0.81, ts: 15, te: tabH + 15 });

        this.#addTXT({
            aling: 'center', txt: "V. IPI",
            l: this.#pdfWidth * 0.87, t: 12,
            w: this.#pdfWidth * 0.04,
        });
        this.#addLinhaVT({ l: this.#pdfWidth * 0.87, ts: 15, te: tabH + 15 });

        this.#addTXT({
            aling: 'center', txt: "ALIQ. ICM",
            l: this.#pdfWidth * 0.91, t: 12,
            w: this.#pdfWidth * 0.04,
        });
        this.#addLinhaVT({ l: this.#pdfWidth * 0.91, ts: 15, te: tabH + 15 });

        this.#addTXT({
            aling: 'center', txt: "ALIQ. ICM",
            l: this.#pdfWidth * 0.95, t: 12,
            w: this.#pdfWidth * 0.04,
        });
        this.#addLinhaVT({ l: this.#pdfWidth * 0.95, ts: 15, te: tabH + 15 });
        this.#addLinhaHT({ t: 32, ls: 0, le: this.#pdfWidth });


        let produtos = Array.isArray(this.#xml.NFe.infNFe.det) ? this.#xml.NFe.infNFe.det : [{ prod: this.#xml.NFe.infNFe.det.prod }];
        let nextProd = 30;
        produtos.forEach((el: any) => {
            const prod = el.prod;
            const imposto = el.imposto || {};

            const csosn = imposto.ICMS?.CSOSN || imposto.ICMS?.CST || '';
            const baseICMS = imposto.ICMS?.vBC ?? '0.00';
            const valorICMS = imposto.ICMS?.vICMS ?? '0.00';
            const valorIPI = imposto.IPI?.IPITrib?.vIPI ?? '0.00';
            const aliqICMS = imposto.ICMS?.pICMS ?? '0.00';
            const aliqIPI = imposto.IPI?.IPITrib?.pIPI ?? '0.00';
            const desconto = prod.vDesc ?? '0.00';

            const nLinha = (prod.xProd.length <= 38 ? 1 : Math.ceil((prod.xProd.length - 38) / 18));

            this.#addTXT({ aling: 'center', txt: prod.cEAN ?? '', l: 0, t: nextProd+((nLinha-1)*4), w: this.#pdfWidth * 0.10 });
            this.#addTXT({ aling: 'left', txt: prod.xProd ?? '', l: this.#pdfWidth * 0.106, t: nextProd+((nLinha-1)*4), w: this.#pdfWidth * 0.25 });
            this.#addTXT({ aling: 'center', txt: prod.NCM ?? '', l: this.#pdfWidth * 0.35, t: nextProd+((nLinha-1)*4), w: this.#pdfWidth * 0.05 });
            this.#addTXT({ aling: 'center', txt: csosn, l: this.#pdfWidth * 0.40, t: nextProd+((nLinha-1)*4), w: this.#pdfWidth * 0.05 });
            this.#addTXT({ aling: 'center', txt: prod.CFOP ?? '', l: this.#pdfWidth * 0.45, t: nextProd+((nLinha-1)*4), w: this.#pdfWidth * 0.04 });
            this.#addTXT({ aling: 'center', txt: prod.uCom ?? '', l: this.#pdfWidth * 0.49, t: nextProd+((nLinha-1)*4), w: this.#pdfWidth * 0.03 });
            this.#addTXT({ aling: 'center', txt: prod.qCom ?? '', l: this.#pdfWidth * 0.52, t: nextProd+((nLinha-1)*4), w: this.#pdfWidth * 0.07 });
            this.#addTXT({ aling: 'center', txt: (parseFloat(prod.vUnCom) || 0).toFixed(2), l: this.#pdfWidth * 0.59, t: nextProd+((nLinha-1)*4), w: this.#pdfWidth * 0.06 });
            this.#addTXT({ aling: 'center', txt: (parseFloat(prod.vProd) || 0).toFixed(2), l: this.#pdfWidth * 0.65, t: nextProd+((nLinha-1)*4), w: this.#pdfWidth * 0.06 });
            this.#addTXT({ aling: 'center', txt: (parseFloat(desconto) || 0).toFixed(2), l: this.#pdfWidth * 0.71, t: nextProd+((nLinha-1)*4), w: this.#pdfWidth * 0.06 });
            this.#addTXT({ aling: 'center', txt: (parseFloat(baseICMS) || 0).toFixed(2), l: this.#pdfWidth * 0.77, t: nextProd+((nLinha-1)*4), w: this.#pdfWidth * 0.04 });
            this.#addTXT({ aling: 'center', txt: (parseFloat(valorICMS) || 0).toFixed(2), l: this.#pdfWidth * 0.81, t: nextProd+((nLinha-1)*4), w: this.#pdfWidth * 0.06 });
            this.#addTXT({ aling: 'center', txt: (parseFloat(valorIPI) || 0).toFixed(2), l: this.#pdfWidth * 0.87, t: nextProd+((nLinha-1)*4), w: this.#pdfWidth * 0.04 });
            this.#addTXT({ aling: 'center', txt: (parseFloat(aliqICMS) || 0).toFixed(2) + "%", l: this.#pdfWidth * 0.91, t: nextProd+((nLinha-1)*4), w: this.#pdfWidth * 0.04 });
            this.#addTXT({ aling: 'center', txt: (parseFloat(aliqIPI) || 0).toFixed(2) + "%", l: this.#pdfWidth * 0.95, t: nextProd+((nLinha-1)*4), w: this.#pdfWidth * 0.04 });

            nextProd += 8*nLinha;
        });

        this.#mtIndex += tabH + 12;
        console.log(this.#mtIndex);
        this.#bloco7();
    }

    //Limite maximo 787
    #bloco7() {
        this.#addTXT({
            font: "bold",
            aling: 'left', txt: "DADOS ADICIONAIS",
            l: 0, t: 1,
            size: 8
        });

        this.#addRetangulo({ l: 0, t: 9, w: this.#pdfWidth * 0.65, h: 28 });
        this.#addTXT({
            aling: 'left', txt: "PESO LÍQUIDO",
            l: 2, t: 11
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: "",
            l: 0, t: 9,
            w: this.#pdfWidth * 0.2,
            size: 9
        });

        this.#addRetangulo({ l: this.#pdfWidth * 0.65, t: 9, w: this.#pdfWidth * 0.36, h: 28 });
        this.#addTXT({
            aling: 'left', txt: "PESO LÍQUIDO",
            l: this.#pdfWidth * 0.652, t: 11
        });
        this.#addTXT({
            font: "bold",
            aling: 'center', txt: "",
            l: this.#pdfWidth * 0.65, t: 9,
            w: this.#pdfWidth * 0.36,
            size: 9
        });

        this.#addTXT({
            aling: 'left', txt: "Impresso em 19/02/2025 as 08:58:52",
            l: 0, t: 39
        });
        this.#addTXT({
            aling: 'right', txt: "Gerado em www.fsist.com.br",
            l: 0, t: 39,
            w: this.#pdfWidth - (this.#pdfMargin * 2)
        });
    }




    // ---------------- FUNCOES ----------------

    #pdfWidth: number = 595.28;
    #pdfHeight: number = 841.89;
    #pdfMargin: number = 5;
    #pdfOpc = {
        borda: "black",
        txt: "black",
        lineWidth: 1,
        ltraj: "#4b5563"
    }

    #mtIndex: number = 0; //Margem do topo para proximo bloco
    #pagIndex: number = 1;
    #pagQtd: number = 1;
    #base64IMG(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.#logo != null) {
                if (this.#isBrowser) {
                    if (this.#logo) {
                        fetch(this.#logo).then(response => response.blob()).then(blob => this.#blob2base64(blob)).catch(reject);
                    } else {
                        reject(new Error("Logo não foi definido."));
                    }
                } else {
                    reject(new Error("Método não suportado no ambiente Node.js"));
                }
            } else {
                resolve(false)
            }

        });
    }
    #addBase64IMG(data = { l: 0, t: 0, w: 0, h: 0, base64: "" }, mtIndex = this.#mtIndex) {
        this.#pdf.image(data.base64, (data.l <= this.#pdfMargin ? this.#pdfMargin + data.l : data.l),
            (data.t <= this.#pdfMargin ? (data.t + this.#pdfMargin) : data.t + this.#pdfMargin) + mtIndex, { fit: [data.w, 50], align: 'center', valign: 'center' })
    }
    #blob2base64(blob: any): Promise<any> {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise(resolve => {
            reader.onloadend = () => {
                resolve(reader.result);
            };
        });
    }
    #addRetangulo(data = { l: 0, t: 0, w: 0, h: 0 }, mtIndex = this.#mtIndex) {
        this.#pdf.lineWidth(this.#pdfOpc.lineWidth)
            .moveTo(data.l <= this.#pdfMargin ? this.#pdfMargin : data.l, data.t + mtIndex + this.#pdfMargin)
            .lineTo((data.l + data.w) >= this.#pdfWidth ? this.#pdfWidth - this.#pdfMargin : (data.l + data.w), data.t + mtIndex + this.#pdfMargin)
            .lineTo((data.l + data.w) >= this.#pdfWidth ? this.#pdfWidth - this.#pdfMargin : (data.l + data.w), data.t + mtIndex + this.#pdfMargin + data.h)
            .lineTo(data.l <= this.#pdfMargin ? this.#pdfMargin : data.l, data.t + mtIndex + this.#pdfMargin + data.h)
            .lineTo(data.l <= this.#pdfMargin ? this.#pdfMargin : data.l, data.t + mtIndex + this.#pdfMargin - (this.#pdfOpc.lineWidth * .3))
            .stroke();
    }

    //Linha trajada
    #addLinhaHT(data = { t: 0, ls: 0, le: 0 }, mtIndex = this.#mtIndex) {
        data.t = (data.t <= this.#pdfMargin ? this.#pdfMargin : data.t) + mtIndex
        data.t = (data.t >= (this.#pdfHeight - this.#pdfMargin) ? (this.#pdfHeight - this.#pdfMargin) : data.t) //Bloqueo de estouro Final
        if (data.ls > data.le) { //Corrigir ordem
            let temp = data.ls;
            data.ls = data.le;
            data.le = temp;
        }
        data.ls = (data.ls <= this.#pdfMargin ? this.#pdfMargin : data.ls) //Bloqueo de estouro inicial
        data.le = (data.le >= (this.#pdfWidth - this.#pdfMargin) ? (this.#pdfWidth - this.#pdfMargin) : data.le) //Bloqueo de estouro Final
        this.#pdf.moveTo(data.ls, data.t).lineTo(data.le, data.t).dash(3, { space: 5 }).stroke(this.#pdfOpc.ltraj);
        this.#pdf.undash();
    }

    //Linha Horizontal
    #addLinhaH(data = { t: 0, ls: 0, le: 0 }, mtIndex = this.#mtIndex) {
        data.t = (data.t <= this.#pdfMargin ? this.#pdfMargin : data.t) + mtIndex
        data.t = (data.t >= (this.#pdfHeight - this.#pdfMargin) ? (this.#pdfHeight - this.#pdfMargin) : data.t) //Bloqueo de estouro Final
        if (data.ls > data.le) { //Corrigir ordem
            let temp = data.ls;
            data.ls = data.le;
            data.le = temp;
        }
        data.ls = (data.ls <= this.#pdfMargin ? this.#pdfMargin : data.ls) //Bloqueo de estouro inicial
        data.le = (data.le >= (this.#pdfWidth - this.#pdfMargin) ? (this.#pdfWidth - this.#pdfMargin) : data.le) //Bloqueo de estouro Final
        this.#pdf.moveTo(data.ls, data.t).lineTo(data.le, data.t).stroke(this.#pdfOpc.borda);
    }

    //Linha vertical
    #addLinhaV(data = { l: 0, ts: 0, te: 0 }, mtIndex = this.#mtIndex) {
        data.l = (data.l <= this.#pdfMargin ? this.#pdfMargin : data.l);
        data.l = (data.l >= (this.#pdfWidth - this.#pdfMargin) ? (this.#pdfWidth - this.#pdfMargin) : data.l) //Bloqueo de estouro Final
        if (data.ts > data.te) { //Corrigir ordem
            let temp = data.ts;
            data.ts = data.te;
            data.te = temp;
        }
        data.ts = (data.ts <= this.#pdfMargin ? this.#pdfMargin : data.ts) + mtIndex //Bloqueo de estouro inicial
        data.te = (data.te >= (this.#pdfWidth - this.#pdfMargin) ? (this.#pdfWidth - this.#pdfMargin) : data.te) + mtIndex //Bloqueo de estouro Final
        this.#pdf.moveTo(data.l, data.ts).lineTo(data.l, data.te).stroke(this.#pdfOpc.borda);
    }

    #addLinhaVT(data = { l: 0, ts: 0, te: 0 }, mtIndex = this.#mtIndex) {
        data.l = (data.l <= this.#pdfMargin ? this.#pdfMargin : data.l);
        data.l = (data.l >= (this.#pdfWidth - this.#pdfMargin) ? (this.#pdfWidth - this.#pdfMargin) : data.l) //Bloqueo de estouro Final
        if (data.ts > data.te) { //Corrigir ordem
            let temp = data.ts;
            data.ts = data.te;
            data.te = temp;
        }
        data.ts = (data.ts <= this.#pdfMargin ? this.#pdfMargin : data.ts) + mtIndex //Bloqueo de estouro inicial
        data.te = (data.te >= (this.#pdfWidth - this.#pdfMargin) ? (this.#pdfWidth - this.#pdfMargin) : data.te) + mtIndex //Bloqueo de estouro Final
        this.#pdf.moveTo(data.l, data.ts).lineTo(data.l, data.te).dash(3, { space: 5 }).stroke(this.#pdfOpc.ltraj);
    }

    //Adicionar texto
    #addTXT(data: {
        l: number;
        t: number;
        txt: any;
        txtCor?: string;
        size?: number;
        w?: number;
        aling?: 'left' | 'center' | 'right' | 'justify';
        font?: 'bold' | 'italic' | 'normal';
    }, mtIndex = this.#mtIndex) {
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
        this.#pdf.font(font)
            .fillColor(this.#pdfOpc.txt)
            .fontSize(data.size || 7)
            .text(data.txt,
                (data.l <= this.#pdfMargin ? this.#pdfMargin + data.l : data.l),
                (data.t <= this.#pdfMargin ? (data.t + this.#pdfMargin) : data.t + this.#pdfMargin) + mtIndex,
                {
                    width: (data.w && data.w >= this.#pdfWidth ? data.w - data.l : data.w) ?? (this.#pdfWidth - data.l),
                    align: data.aling || 'center'
                }
            );
    }
}

export { danfe }