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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.ext !== "Praktikum") {
        return;
    }
    if (request.action === "download") {
        sendResponse(download(request.tabCode, request.tabName));
        return;
    }
    if (request.action === "downloadTabsAsArchive") {
        sendResponse(downloadTabsAsArchive(request.tabsData));
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

function downloadTabsAsArchive(tabsData) {
    const zip = new JSZip();
    tabsData.forEach(tab => {
        zip.file(tab.tabName, tab.tabCode);
    });
    zip.generateAsync({type:"blob"}).then(
        function(blob) {
            const url = URL.createObjectURL(blob);
            chrome.downloads.download({
                url: url,
                filename: getArchiveFilename()
            });
        }
    );
    return { message: "OK" };
}