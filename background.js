chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { hostEquals: 'praktikum.yandex.ru', pathPrefix: '/trainer/' }
                    })
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.ext !== "Praktikum") {
        return;
    }
    if (request.action === "download") {
        sendResponse(download(request.tabCode, request.tabName));
        return;
    }
    if (request.action === "downloadTabsAsArchive") {
        sendResponse(await downloadTabsAsArchive(request.tabsData));
        return;
    }
});

function download(tabCode, tabName) {
    const blob = new Blob([tabCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
        url: url,
        filename: tabName
    });
    return { message: "OK" };
}

function getArchiveFilename() {
    return "praktikum" + Date.now() + ".zip";
}

function addScreenshot(zip, callback) {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, function (imageData) {
        var imageSplit = imageData.split(',');
        zip.file("screenshot.png", imageSplit[1], {base64: true});
        if (callback) {
            callback(zip);
        }
    });
}

async function downloadTabsAsArchive(tabsData) {
    const zip = new JSZip();
    tabsData.forEach(tab => {
        zip.file(tab.tabName, tab.tabCode);
    });
    addScreenshot(zip, async function () {
        const blob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(blob);
        chrome.downloads.download({
            url: url,
            filename: getArchiveFilename()
        });
    });

    return { message: "OK" };
}