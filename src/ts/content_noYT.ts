console.log("chrome utils extension: content_noYT script loaded");
var url = window.location.host
console.log("url");
console.log(url);

/**
 * minimum desired video resolution
 */


// function videoPaused(video: HTMLVideoElement) {

// }
// //todo: fix this loading bs i just need this to work rn. bc this overlay is getting me mad
// // var videoElement = document.querySelector('video') as HTMLVideoElement;
// var videoElem = () => document.getElementsByTagName("video")[0]

// //tried to move that out n fix it fast but sth is fkd here idk. need to fix that shit when i have time
// getDynamicElement(videoElem).then(vid => {
//     //video paused
//     vid.addEventListener('pause', function (event) {
//         console.log("pauseeeee");

//         // remove anoying recommendations pause overlay:
//         // let ytPauseOverlay = videoElement.ownerDocument.getElementById("ytp-pause-overlay") as HTMLDivElement
//         let el = () => document.getElementsByClassName("ytp-pause-overlay")[0] as HTMLDivElement

//         getDynamicElement(el).then(ytPauseOverlay => {
//             ytPauseOverlay.style.display = "none"
//         }).catch(err => {
//             console.log(err)
//         })
//     });

//     videoPaused(vid)
// }).catch(err => {
//     console.log(err)
// })

if (videoElement) {
    console.log("found vid element in noYt script");



    // needs to be set in manifest for these evts to fire before its too late
    // "run_at": "document_start",
    videoElement.addEventListener('loadedmetadata', (evt) => {
        console.log("loaded meta data noyt");
        console.log(evt);

        setResThruLS(evt.target as HTMLVideoElement)
    })
    // metadata loaded
    videoElement.addEventListener('loadeddata', function () {
        console.log("loaded data noyt");
        // check if yt switched to low res
        // console.log("videoElement.paused")
        // console.log(videoElement.paused)
        // for some reason 4k vid once showed 0 videoHeight, thought it didnt load but then never again
        // all this needs to be checked when new video starts (history api)

    });

} else {
    console.log("no video element found");
}


function getDynamicElement<T>(condition: () => T) {
    return new Promise<T>((resolve, reject) => {
        let cond = condition()
        if (cond) {
            return resolve(cond)
        }

        console.log("wait for dom");
        const observer = new MutationObserver((mutations, obs) => {

            let el = condition()
            // console.log(el);

            // console.log(videoElement.ownerDocument.getElementById("ytp-pause-overlay"));
            // console.log(document.getElementsByClassName("ytp-pause-overlay"));


            if (condition()) {
                obs.disconnect();

                resolve(el)
            }
        });

        const timeout = 5000
        console.log("setting time out");
        setTimeout(() => {
            observer.disconnect();
            console.log("rej");

            reject("condition was not met within " + timeout / 1000 + "s. disconnecting mutation observer.. condition: " + condition)
        }, timeout);

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    })
}
