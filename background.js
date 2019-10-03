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
    if (request.action === "shareTabsWithCodepen") {
        sendResponse(await shareTabsWithCodepen(request.tabsData));
        return;
    }
});

function shareTabsWithCodepen(allTabsData){
    const data = {
        "title": "Praktikum", 
        "html": allTabsData.filter(tab=>tab.tabName == 'index.html')[0].tabCode,
        "css": allTabsData.filter(tab=>tab.tabName.match(/css$/))
            .map(tab => `\n\n/* file: ${tab.tabName}*/\n\n${tab.tabCode}`)
            .join(''),
        "js": allTabsData.filter(tab=>tab.tabName.match(/js$/))
            .map(tab => `\n\n/* file: ${tab.tabName}*/\n\n${tab.tabCode}`)
            .join(''),
    }

    const div = document.createElement("div");
    div.innerHTML = `
    <form class="share-with-codepen" action="https://codepen.io/pen/define" method="POST" target="_blank">
        <input type="hidden" name="data" value='${JSON.stringify(data).replace(/'/g, "&apos;")}'>
        <input type="submit" value="Create New Pen with Prefilled Data">
    </form>
    `;

    document.querySelector("body").appendChild(div);
    document.querySelector('.share-with-codepen').submit();
    div.parentNode.removeChild(div);
}

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