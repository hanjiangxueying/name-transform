import * as vscode from 'vscode';
const humps = require('humps');

const COMMAND_LABELS = {
	snake: 'snake',          		   // 蛇形
	camelCase: 'camelCase',            // 小驼峰
	upperCamelCase: 'upperCamelCase',  // 大驼峰
	kebab: 'kebab',                  // 中划线
	constant: 'constant',               // 常量
	lowercase: 'lowercase',             // 小写
	uppercase: 'uppercase',             // 大写
	reverse: 'reverse',                 // 倒序
}

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "name transform" is now active!');

	for (const label in COMMAND_LABELS) {
		let res = vscode.commands.registerCommand(`name-transform.${label}`, function () {
			replaceFun(label)
		})
		context.subscriptions.push(res)
	}
}

function transformFun(label: string, text: string | undefined) :string {
	let resultString: string = '';
	label === 'snake' && (resultString = humps.decamelize(text));
	label === 'camelCase' && (resultString = humps.camelize(text));
	label === 'upperCamelCase' && (resultString = humps.pascalize(text));
	label === 'kebab' && (resultString = humps.decamelize(text, { separator: '-' }));
	label === 'constant' && (resultString = (humps.decamelize(text, { separator: '_' })?.toUpperCase()));
	label === 'uppercase' && (resultString = text?.toUpperCase() || '');
	label === 'lowercase' && (resultString = text?.toLocaleLowerCase() || '');
	label === 'reverse' && (resultString = text?.split('').reverse().join('') || '');
	return resultString;
}

function replaceFun (label: string) {
	const editor: (vscode.TextEditor | undefined) = vscode.window.activeTextEditor;
	const selection:(vscode.Selection | undefined | any) = editor?.selection;
	const text = editor?.document.getText(selection)
	editor?.edit(eb => {
		// 文本替换
		eb.replace(selection, transformFun(label, text))
	})
}

// This method is called when your extension is deactivated
export function deactivate() {}
module.exports = {
	activate,
	deactivate
}