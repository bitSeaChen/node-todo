const program = require("commander");
const api = require("./index");
const pkg = require("./package.json");

if (process.argv.length === 2) {
	api.showAll();
} else {
	program
		.version(pkg.version)
		.command("add")
		.description("add a task")
		.action(async (...args) => {
			const words = args[1].args.join(" ");
			await api.add(words);
		});
	
	program
		.command("add")
		.description("add a task")
		.action((x) => {
			console.log("x", x);
		});
	
	program
		.command("clear")
		.description("clear all task")
		.action(async () => {
			await api.clear();
		});
	
	program.parse(process.argv);
}






























