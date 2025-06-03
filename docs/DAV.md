# Algumas funções estão ainda em implementação

| Aonde | Motivo            |
|-------|-------------------|
| 🔴    | Não implementado  |
| 🟢    | Implementado      |

### 🔴 function DAV65(xml:object, logo:image, orcamento:boolean)
Documento Auxiliar de Venda modelo 65 - Impressora termica.


### 🔴 function DAV55(xml:object, logo:image, orcamento:boolean) || TESTE
Documento Auxiliar de Venda modelo 55 - Folha A4.

```javascript
import { DAV55 }  from './node_modules/node-sped-pdf/src/index.js';

const exemplo = {
    "tagProd": [
        {
            "CodBarras": 27354,
            "cEAN": null,
            "xProd": "OLA",
            "vUnCom": 5,
            "vDesc": null,
            "uCom": "UNID",
            "NCM": 5102,
            "vFrete": null,
            "xCat": null,
            "xDescricao": null,
            "label": "OLA",
            "value": 27354,
            "input": "a",
            "vDesc2": 0,
            "qCom": 1
        }
    ],
    "tagIde": {
        "cUF": "51",
        "cNF": "00002023",
        "natOp": "VENDA",
        "mod": "55",
        "serie": "0",
        "nNF": "248",
        "dhEmi": "",
        "tpNF": "1",
        "idDest": "1",
        "cMunFG": "5106257",
        "tpImp": "1",
        "tpEmis": "1",
        "cDV": "1",
        "tpAmb": "2",
        "finNFe": "1",
        "indFinal": 1,
        "indPres": "1",
        "indIntermed": "0",
        "procEmi": "0",
        "verProc": "4.13"
    },
    "taginfAdic": {
        "infAdFisco": null,
        "infCpl": null
    },
    "tagrefNFe": "",
    "tagDest": {
        "CPF": "00000000000",
        "xNome": "KALMON VALADAO TAVARES",
        "indIEDest": 9,
        "xLgr": "AV PARA",
        "nro": "138",
        "xBairro": "UNIAO",
        "cMun": 5106257,
        "xMun": "NOVA XAVANTINA",
        "UF": "MT",
        "CEP": 78690000,
        "cPais": 1058,
        "xPais": "BRASIL"
    },
    "tagEnderDest": null,
    "tagDetPag": [],
    "tagTroco": 0,
    "tagTransp": {
        "modFrete": "9"
    },
    "sistema": {
        "caixa": null,
        "email": "kalmonvaladao@gmail.com"
    },
    "vTotal": {
        "vNF": 5,
        "vDesc": 0,
        "vProd": 5,
        "vFrete": 0
    },
    "tagEmit": {
        "CodEmpresa": 5,
        "CNPJ_CPF": "47506306000188",
        "xNome": "GUARA DEV",
        "xFant": "47.506.306 KALMON VALADAO TAVARES",
        "IE": "139551956",
        "CNAE": null,
        "IM": null,
        "IEST": null,
        "CRT": 1,
        "xLgr": "Av Para",
        "nro": "138",
        "xCpl": null,
        "xBairro": "Uniao",
        "CEP": 78690000,
        "xPais": "BRASIL",
        "cPais": 1058,
        "UF": "MT",
        "cUF": 51,
        "xMun": "Nova Xavantina",
        "cMun": 5106257,
        "cMunFG": 5106257,
        "fone": null,
        "Email": "KALMONVALADAO@GMAIL.COM",
        "tokenIBPT": null,
        "CSC": null,
        "CSCid": null,
        "PFX_senha": "kalmon99",
        "PFX_validade": null,
        "CNPJ": "47506306000188"
    }
}

DAV55({
    xml: exemplo,
    logo: "http://localhost:5173/logo.jpg",
    orcamento:true //Adicionar a marca d'água de ORÇAMENTO.
    }).then(res => {
    const blob = new Blob([res], { type: 'application/pdf' }); // <- usa res direto
    const url = URL.createObjectURL(blob);
    document.querySelector("#meuIframe").src = url;
});
```