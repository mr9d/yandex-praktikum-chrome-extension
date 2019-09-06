function getListOfTabsNames() {
    const result = [];
    const tabHeaders = document.querySelectorAll('.slider__visible-layer .tab__text');
    tabHeaders.forEach(tabHeader => {
        result.push(tabHeader.innerHTML);
    });
    return result;
}

function getTabsCount() {
    return getListOfTabsNames().length;
}

function getTabName(index) {
    const tabHeaders = document.querySelectorAll('.slider__visible-layer .tab__text');
    return tabHeaders[index].innerHTML;
}

function createDownloadButton() {
    const downloadButton = document.createElement("button");
    downloadButton.innerHTML = "&#9660;";
    downloadButton.classList.add("downloadButton")
    return downloadButton;
}

function areButtonsThere() {
    return document.getElementsByClassName("downloadButton").length > 0;
}

function trainerIsReady() {
    return getTabsCount() > 0;
}

function waitForTrainerToLoad(callback) {
    const interval = setInterval(function () {
        if (trainerIsReady()) {
            clearInterval(interval);
            if (callback) {
                callback();
            }
        }
    }, 100);
}

function addDownloadButtons() {
    if(areButtonsThere()) {
        return;
    }
    const tabs = document.querySelectorAll('.slider__visible-layer .tab');
    tabs.forEach((tab, index) => {
        const downloadButton = createDownloadButton();
        downloadButton.addEventListener("click", function (event) {
            event.stopPropagation();
            setTimeout(function () {
                downloadTabContent(index);
            }, 1000);
        });
        tab.appendChild(downloadButton);
    });
}

function initTabCodeParsing(index) {
    const scriptElement1 = document.createElement('script');
    scriptElement1.classList.add('injectScript');
    scriptElement1.innerHTML = 'tabIndex = ' + index;
    document.body.appendChild(scriptElement1);

    const scriptElement2 = document.createElement('script');
    scriptElement2.classList.add('injectScript');
    scriptElement2.setAttribute('src', chrome.runtime.getURL('trainer-get-tabs-code.js'));
    document.body.appendChild(scriptElement2);
}

function initAllTabsCodeParsing() {
    const scriptElement2 = document.createElement('script');
    scriptElement2.classList.add('injectScript');
    scriptElement2.setAttribute('src', chrome.runtime.getURL('trainer-get-tabs-code.js'));
    document.body.appendChild(scriptElement2);
}

function getParsedTabCodeElement(index) {
    const tabCodeElements = document.getElementsByClassName("tab-code-" + index);
    if (tabCodeElements.length > 0) {
        return tabCodeElements[0];
    } else {
        return null;
    }
}

function tabCodeReady(index) {
    return getParsedTabCodeElement(index) !== null;
}

function allTabsCodeReady(tabsCount) {
    for (var index = 0; index < tabsCount; index++) {
        if (tabCodeReady(index) === false) {
            return false;
        }
    }
    return true;
}

function waitForTabCodeParsing(index, callback) {
    const interval = setInterval(function () {
        if (tabCodeReady(index)) {
            clearInterval(interval);
            if (callback) {
                callback();
            }
        }
    }, 100);
}

function waitForAllTabsCodeParsing(tabsCount, callback) {
    const interval = setInterval(function () {
        if (allTabsCodeReady(tabsCount)) {
            clearInterval(interval);
            if (callback) {
                callback();
            }
        }
    }, 100);
}

function cleanUpParsedCode(index) {
    document.querySelectorAll(".tab-code-" + index).forEach(e => e.remove());
}

function downloadTab(tabCode, tabName) {
    chrome.runtime.sendMessage({
        ext: "Praktikum",
        action: "download",
        tabCode: tabCode,
        tabName: tabName
    });
}

function downloadTabsAsArchive(allTabsData) {
    chrome.runtime.sendMessage({
        ext: "Praktikum",
        action: "downloadTabsAsArchive",
        tabsData: allTabsData
    });
}

function getAllTabsData(tabsCount) {
    const allTabsData = [];
    for (var index = 0; index < tabsCount; index++) {
        allTabsData.push({
            tabCode: getParsedTabCodeElement(index).innerText,
            tabName: getTabName(index)
        });
    }
    return allTabsData;
}

function downloadTabContent(index) {
    initTabCodeParsing(index);
    waitForTabCodeParsing(index, function () {
        const tabCode = getParsedTabCodeElement(index).innerText;
        const tabName = getTabName(index);
        downloadTab(tabCode, tabName);
        cleanUpParsedCode(index);
    });
}

function downloadAllTabsContent() {
    const tabsCount = getTabsCount();
    initAllTabsCodeParsing();
    waitForAllTabsCodeParsing(tabsCount, function () {
        const allTabsData = getAllTabsData(tabsCount);
        downloadTabsAsArchive(allTabsData);
    });

    return { message: "OK" };
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.ext !== "Praktikum") {
        return;
    }
    if (request.action === "downloadAllTabsContent") {
        sendResponse(downloadAllTabsContent());
        return;
    }
});

waitForTrainerToLoad(addDownloadButtons);

const pageContentNode = document.getElementsByClassName("page__content")[0];
const observer = new MutationObserver(function(mutationsList, observer){
    waitForTrainerToLoad(addDownloadButtons);
});
observer.observe(pageContentNode, {childList: true});
