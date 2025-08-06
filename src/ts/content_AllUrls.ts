import { ExtensionLogger } from "./logger";
import { setYtRes } from "./yt/yt";

let msg = "chrome utils extension: content_AllUrls script loadeddd"
console.log(msg);
let logger = new ExtensionLogger()
// logger.log(msg)

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


var videoElement = document.querySelector('video') as HTMLVideoElement;

if (videoElement) setYtRes(videoElement)
