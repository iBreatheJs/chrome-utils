console.log("popup script")
// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor") as HTMLElement;

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});
// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  console.log("popup clicked change color")
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.id) throw "Asdf"

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: setPageBackgroundColor,
  });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  console.log("set bg color")
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}