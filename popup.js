function sendMessageToActiveTab(message, callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, callback);
    });
}

document.getElementsByClassName("popup__link_download-all-tabs")[0]
    .addEventListener("click", function (event) {
        sendMessageToActiveTab({
            ext: "Praktikum",
            action: "downloadAllTabsContent"
        });
        event.preventDefault();
    });

document.querySelector(".popup__link_share-all-tabs")
    .addEventListener("click", function (event) {
        sendMessageToActiveTab({
            ext: "Praktikum",
            action: "shareAllTabsContent"
        });
        event.preventDefault();
    });
    