/**
 * different ways to trigger the extensions features  
 * try to avoid slowing down browsing in general by unnecessary actions performed by extensions  
 * 
 * - analyse document on requrest
 * 
 */



/**
 * also a decent approach is to check the doc on click and try to find eg. the nearest element with some class
 */
function handleEquationClick(event: Event) {
    event.stopPropagation();
    if (!event.target) {
        console.warn("event has no target")
        return
    }
    const equation = (event.target as HTMLElement).closest(".mwe-math-element")

    if (equation) {
        // Wikipedia nicely packs a single <math> element inside each .mwe-math-element classes
        const mathElement = equation.querySelector("math");
        const tex = mathElement?.getAttribute('alttext');
        if (!tex) return
        console.log(tex);

        // Do something with the joined alt text here, e.g., display it in an alert:
        navigator.clipboard.writeText(tex)
            .then(() => {
                // Copying succeeded
                console.log("TeX copied to clipboard");
            })
            .catch(err => {
                // Copying failed, handle the error
                console.error("Failed to copy TeX :", err);
            });
    } else {
        console.log("Clicked element is not within an .mwe-math-element");
    }
}

// // Attach the event listener to all descendants of .ltx_Math which are not themselves descendants of .ltx_equation
document.querySelectorAll(".mwe-math-element *").forEach(element => {
    element.addEventListener("click", handleEquationClick);
});