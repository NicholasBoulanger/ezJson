const vscode = require('vscode');
const JSON5 = require('json5');

function stringifyJSON(selectedText, channel) {
    try {
        const parsed = JSON5.parse(selectedText);
        return JSON.stringify(parsed, null, 2);
        // const stringified = JSON.stringify(selectedText, null, 2)
        // return JSON.parse(stringified)
    } catch (error) {
        return { error: 'Invalid JSON', message: error.message };
    }
}

function convertToRelaxedJSON(selectedText, channel) {
    let cleanedText = selectedText.toString().trim().replace(/(\r\n|\n|\r)/gm, "");
    channel.appendLine(`selectedText: ${selectedText}`)
    channel.appendLine(`cleanedText: ${cleanedText}`)
    try {
        const parsed = JSON.parse(cleanedText);
        channel.appendLine(`parsed ${parsed}`)
        return JSON5.stringify(parsed, null, 2);
        // return parsed
    } catch (error) {
        return { error: 'Invalid JSON', message: error.message + 'dirty' + selectedText + 'clean' + cleanedText };
    }
}

module.exports = {
    stringifyJSON,
    convertToRelaxedJSON
};
