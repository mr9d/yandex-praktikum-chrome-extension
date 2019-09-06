function getCodeEditors() {
    const result = [];
    const codeEditors = document.querySelectorAll('.CodeMirror');
    codeEditors.forEach(editor => {
        result.push(editor.CodeMirror);
    });
    return result;
}

function getTabCode(editor) {
    return editor.getDoc().getValue();
}

function getTabIndex() {
    return window.tabIndex;
}

function saveTabCodeToHiddenDiv(tabCode, index) {
    const hiddenDiv = document.createElement('div');
    hiddenDiv.style.display = "none";
    hiddenDiv.classList.add("tab-code-" + index);
    hiddenDiv.appendChild(document.createTextNode(tabCode));
    document.body.appendChild(hiddenDiv);
}

function cleanUp() {
    window.tabIndex = undefined;
    document.querySelectorAll('.injectScript').forEach(e => e.remove());
}

function execute() {
    const index = getTabIndex();
    const codeEditors = getCodeEditors();
    if (index !== undefined) {
        const tabCode = getTabCode(codeEditors[index]);
        saveTabCodeToHiddenDiv(tabCode, index);
    } else {
        codeEditors.forEach((editor, index) => {
            const tabCode = getTabCode(editor);
            saveTabCodeToHiddenDiv(tabCode, index);
        });
    }
    cleanUp();
}

execute();