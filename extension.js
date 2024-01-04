const vscode = require('vscode');
const { stringifyJSON, convertToRelaxedJSON } = require('./src/conversion');

function activate(context) {
	const channel = vscode.window.createOutputChannel('ezJson');
	channel.appendLine('Extension activated.');

	let commandDisposable = vscode.commands.registerCommand('ezJSON.activateExtension', () => {
		console.log('ezJSON extension manually activated.');
	});

	let disposable = vscode.window.onDidChangeTextEditorSelection(event => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		const selection = editor.selection;
		const selectedText = editor.document.getText(selection);

		if (selectedText && (selectedText.startsWith('{') || selectedText.startsWith('[') || selectedText.startsWith('"'))) {
			const relaxedJSONOption = 'Convert to Relaxed JSON';
			const stringifyOption = 'Convert to Strict JSON';

			vscode.window.showInformationMessage(
				'Choose an action:',
				relaxedJSONOption,
				stringifyOption
			).then(option => {
				if (option === relaxedJSONOption) {
					let convertedText = convertToRelaxedJSON(selectedText, channel);
					if (typeof convertedText === 'string') {
						editor.edit(editBuilder => {
							//@ts-ignore
							editBuilder.replace(selection, convertedText);
						});
					} else {
						channel.appendLine(`Error: ${convertedText.error}, Message: ${convertedText.message}`);
					}
				} else if (option === stringifyOption) {
					let convertedText = stringifyJSON(selectedText, channel);
					if (typeof convertedText === 'string') {
						editor.edit(editBuilder => {
							// @ts-ignore
							editBuilder.replace(selection, convertedText);
						});
					} else {
						channel.appendLine(`Error: ${convertedText.error}, Message: ${convertedText.message}`);
					}
				}
			});
		}
	});

	context.subscriptions.push(commandDisposable, disposable);
}

exports.activate = activate;
