const db = require("./db");
const inquirer = require("inquirer");

module.exports.add = async (title) => {
	const list = await db.read();
	list.push({title, done: false});
	await db.write(list);
};

module.exports.clear = async () => {
	await db.clear();
};

function printTasks(list) {
	inquirer.prompt({
		type: 'list',
		name: 'index',
		message: "请选择你想要的任务",
		choices: [
			{name: "退出", value: "-1"},
			...list.map((item, index) => {
				return {name: `${item.done ? "[x]" : "[_]"} - ${index + 1} ${item.title}`, value: index.toString()};
			}),
			{name: "创建任务", value: "-2"}
		]
	}).then(answer => {
		const index = parseInt(answer.index);
		if (index >= 0) {
			askForAction(list, index);
		} else if (index === -2) {
			askForCreateTask(list);
		}
	});
}

function askForAction(list, index) {
	inquirer.prompt({
		type: "list", name: "action",
		message: "请选择操作",
		choices: [
			{name: "退出", value: "quit"},
			{name: "已完成", value: "markAsDone"},
			{name: "未完成", value: "markAsUnDone"},
			{name: "改标题", value: "updateTitle"},
			{name: "删除", value: "remove"}
		]
	}).then(answer => {
		const actions = {
			markAsDone,
			markAsUnDone,
			remove,
			updateTitle
		};
		actions[answer.action] && actions[answer.action](list, index);
	});
}

function markAsDone(list, index) {
	list[index].done = true;
	db.write(list);
}

function markAsUnDone(list, index) {
	list[index].done = false;
	db.write(list);
}

function updateTitle(list, index) {
	inquirer.prompt({
		type: "input",
		name: "title",
		message: "新的标题",
		default: list[index].title
	}).then(answer2 => {
		list[index].title = answer2.title;
		db.write(list);
	});
}

function remove(list, index) {
	list.slice(index, 1);
	db.write(list);
}

function askForCreateTask(list) {
	inquirer.prompt({
		type: "input",
		name: "title",
		message: "请输入标题"
	}).then(answer => {
		list.push({
			title: answer.title,
			done: false
		});
		db.write(list);
	});
}

module.exports.showAll = async () => {
	const list = await db.read();
	printTasks(list);
};
