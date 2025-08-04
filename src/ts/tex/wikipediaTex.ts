let katexCnt = 0

export function findLatex() {
    console.log("chrome utils: find katex")
    let katexFoundCnt = 0
    /**
     * used to have `katex-display` but sometimes it is not present. happend when chatGpt corrected itself and wrote the answer again but within the same answer
     * using katex adds btn to every inline katex tho which is probably too much
     */
    let mathElementClass = "mwe-math-element"
    let texSpans = document.getElementsByClassName(mathElementClass)
    console.log("texSpans");
    console.log(texSpans);



    for (let span of texSpans) {
        let mathElements = span.getElementsByTagName("math")
        if (mathElements.length != 1) {
            console.error("wikipedia page with unexpected dom structure. length of math elements in span != 1")
        }
        let mathEl = mathElements[0]
        const tex = mathEl.getAttribute('alttext');
        if (!tex) {
            console.warn("mathEl has no `alttext`")
            return
        }

        // btn to copy tex
        let btn = document.createElement("button")
        btn.innerHTML = "copy"
        btn.classList.add("katex-copy-btn")
        span.appendChild(btn)
        btn.onclick = () => {
            navigator.clipboard.writeText("$" + tex + "$")
                .then(() => {
                    console.log("TeX copied");
                })
                .catch(err => {
                    // Copying failed, handle the error
                    console.error("Failed to copy TeX :", err);
                });
        }

        katexFoundCnt++
    }
    katexCnt += katexFoundCnt
    console.log("Added copy button to " + katexFoundCnt + " newly found katex formulas. Total cpy btns: " + katexCnt)
}

