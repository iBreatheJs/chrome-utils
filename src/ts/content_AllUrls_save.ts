import { ExtensionLogger } from "./logger";

let msg = "chrome utils extension: content_AllUrls script loadeddd"
console.log(msg);
let logger = new ExtensionLogger()
logger.log(msg)
var url = window.location.host //with let cant redeclare bc apparently its the same scope (the contentscripts) which makes no senese because they dont necesarily get injected both.
// console.log("url");
// console.log(url);

// todo maybe it should be only yt.. or just check url and then execute accordingly... outside of yt the localstorage cockie might not exist. eg duckduckgo



// content script is called for all frames!

/**
 * video stuff
 * 
 * base on 
 *  cls name
 *  evts
 *  localStorage
 * 
 * maybe chain: first evt, if not found -> observer, if timeout -> error
 */

/**
 * minimum desired video resolution
 */
const MIN_RES = 1440

var videoElement = document.querySelector('video') as HTMLVideoElement;

if (videoElement) {
    // set first time, if too late for evnt
    setResThruLS(videoElement)
    //video paused
    // moved to content_noYT bc pause overlay exists only on embedded vids


    // needs to be set in manifest for these evts to fire before its too late
    // "run_at": "document_start",
    videoElement.addEventListener('loadedmetadata', (evt) => {
        console.log("loaded meta data");
        console.log(evt);

        setResThruLS(evt.target as HTMLVideoElement)
    })
    // metadata loaded
    videoElement.addEventListener('loadeddata', function () {
        console.log("loaded data");
        // check if yt switched to low res
        // console.log("videoElement.paused")
        // console.log(videoElement.paused)
        // for some reason 4k vid once showed 0 videoHeight, thought it didnt load but then never again
        // all this needs to be checked when new video starts (history api)

    });

} else {
    // console.log("no video element found");
}


// todo theres also this event which could work as well:
window.addEventListener("yt-navigate-finish", () => {
    console.log("nav finished");
}, true);

function setResThruDom() {
    const RES_BTN_STRING = "quality"

    // try with clicking the btns:
    let settingsButton = document.getElementsByClassName("ytp-settings-button")[0] as HTMLDivElement
    settingsButton.click()
    let settingsMenu = document.getElementsByClassName("ytp-settings-menu")[0] as HTMLDivElement
    let settingsPanel = document.getElementsByClassName("ytp-panel-menu")[0] as HTMLDivElement

    console.log("settingsPanel");
    console.log(settingsPanel);

    for (const c of settingsPanel.childNodes as NodeListOf<HTMLDivElement>) {
        console.log("node");

        if (c.innerText.toLowerCase().indexOf(RES_BTN_STRING) !== -1) {
            console.log(c);
            let asdf = c.getElementsByClassName("ytp-menuitem-content")[0] as HTMLDivElement
            asdf.click()
            console.log("asdf");
            console.log(asdf);

            let qualityMenu = document.getElementsByClassName("ytp-quality-menu")[0] as HTMLDivElement
            console.log(("qualityMenu"));
            console.log((qualityMenu));

        }
    }
}

function setResThruLS(videoElement: HTMLVideoElement) {
    if (videoElement.videoHeight < MIN_RES) {
        console.log("res(" + videoElement.videoHeight + ") < " + MIN_RES + " ");
        let playerQuality: string = localStorage['yt-player-quality']

        let quality = JSON.parse(JSON.parse(playerQuality).data).quality

        if (quality < MIN_RES) {
            // localStorage['yt-player-quality'] = 
            let re = /(\\"quality\\":)(\d*)(,)/;
            let playerQualityMod = playerQuality.replace(re, `$1${String(MIN_RES)}$3`);
            localStorage['yt-player-quality'] = playerQualityMod
            console.log(playerQuality);
            console.log("playerQuality edited");
            console.log(playerQualityMod);
        } else {
            console.log("res in localStorage is set but not available for this video");

        }

        // "{"data":"{\"quality\":240,\"previousQuality\":1080}","expiration":1714522133692,"creation":1683418133692}"
        // "{\"data\":\"{\\\"quality\\\":1080,\\\"previousQuality\\\":480}\",\"expiration\":1714521228808,\"creation\":1683417228808}"
    } else {
        console.log("res is ok");

    }
}
