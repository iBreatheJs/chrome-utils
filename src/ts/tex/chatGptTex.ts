let katexCnt = 0

export function findLatex() {
    console.log("chrome utils: find katex")
    let katexFoundCnt = 0
    /**
     * used to have `katex-display` but sometimes it is not present. happend when chatGpt corrected itself and wrote the answer again but within the same answer
     * using katex adds btn to every inline katex tho which is probably too much
     */
    let katexCls = "katex"
    let katexSpans = document.getElementsByClassName("katex")
    for (let span of katexSpans) {
        let annotationList = span.getElementsByTagName("annotation")

        // katex is supposed to have one annotation including the latex
        if (annotationList.length != 1) {
            console.warn("found class 'katex' more or less than 1 annotation")
            continue
        }
        let annotation = annotationList[0]

        // break loop if btn was already added
        if (span.getElementsByClassName("katex-copy-btn").length) continue

        // btn to copy katex
        let btn = document.createElement("button")
        btn.innerHTML = "copy"
        btn.classList.add("katex-copy-btn")
        span.appendChild(btn)
        btn.onclick = () => { navigator.clipboard.writeText("$" + annotation.innerHTML + "$") }

        katexFoundCnt++
    }
    katexCnt += katexFoundCnt
    console.log("Added copy button to " + katexFoundCnt + " newly found katex formulas. Total cpy btns: " + katexCnt)
}