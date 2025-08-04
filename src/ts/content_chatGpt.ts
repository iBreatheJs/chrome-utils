import { findLatex } from "./tex/chatGptTex";

console.log("loading chrome utils (chatGpt)")

let btn = document.createElement("button")
btn.innerHTML = "analyse with chrome utils"
document.body.appendChild(btn)
console.log(btn);

btn.onclick = findLatex
