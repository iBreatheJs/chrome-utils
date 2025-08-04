import { findLatex } from "./tex/wikipediaTex";

console.log("loading chrome utils (wikipedia)")
// todo: run this shit when on page load
// todo: fix manifest, unsafe url, used wildcard because of diffrent langs
let btn = document.createElement("button")
btn.innerHTML = "analyse with chrome utils"
document.body.appendChild(btn)
console.log(btn);

btn.onclick = findLatex
