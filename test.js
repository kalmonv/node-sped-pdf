import { danfe } from './dist/index.js';
import fs from "fs";

let xml = fs.readFileSync("./exemplos/NFe.xml", { encoding: "utf8" });
console.log(xml)
let pdf = new danfe({ xml: xml });
pdf.getPDF().then(res => {
    fs.writeFileSync("./exemplos/NFe.pdf", Buffer.from(res, 'base64'));
})