# Yandex Praktikum Chrome extension

## About

Google Chrome browser extension for the [Yandex Praktikum](https://practicum.com/) trainer. This extension grants the ability to download tabs content from the code editor and share it with [CodePen](https://codepen.io/). This ability was highly requested by students to:

- save code examples for future reference,
- share code examples with a mentor,
- share code examples with the support team to report a bug.

The first version took about 3 days to implement. Later it was improved by the Yandex Praktikum mentors community.

## Current status

The support of this extension is now the Yandex Praktikum development team's responsibility. 

The version represented here is final publis version. The actual version is located in the private Yandex Praktikum repository.

## Setup

To set up the extension to your Google Chrome, perform the following steps:

1. `git clone` the repository.
2. Open <chrome://extensions/> in your Google Chrome.
3. Switch “developer mode” on.
4. Click the “Load unpacked” button.
5. Select cloned repo location.
6. Restart the browser.

The extension should appear on <https://praktikum.yandex.ru/trainer/> and <https://practicum.yandex.com/trainer/> tabs.

## How to use

### Download tab content

After the installation of the extension, the download button will appear in the top right corner of each tab. Just click it and the download will start.

### Download all tabs

Click the extension icon and click the “Download all tabs” button in the popup. The download will start soon. An archive will include all tabs' content and a screenshot of the current tab.

### Share with Codepen

Click the extension icon and click the “Share with codepen” button in the popup. You will be redirected to [codepen.io](https://codepen.io/) with your code in the proper tabs.

## Used technologies

- HTML5, CSS3, JavaScript ES6
- Google Chrome Extension API ([documentation](https://developer.chrome.com/docs/extensions/reference/))
- [Codepen](https://codepen.io/)
