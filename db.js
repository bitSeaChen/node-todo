const fs = require("fs");
const path = require("path");
const homedir = require("os").homedir();
const home = process.env.HOME || homedir;
const dbPath = path.join(home, ".todo");

const db = {
	read(read = dbPath) {
		return new Promise((resolve, reject) => {
			fs.readFile(read, {flag: "r+"}, (error, data) => {
				if (error) {
					return reject(error);
				}
				let list;
				try {
					list = JSON.parse(data.toString());
				} catch (error2) {
					list = [];
				}
				resolve(list);
			});
		});
	},
	write(list, path = dbPath) {
		return new Promise((resolve, reject) => {
			const str = JSON.stringify(list);
			fs.writeFile(path, str, (error) => {
				if (error) {
					return reject({result: false, msg: error});
				}
				resolve({result: true});
			});
		});
	},
	clear() {
		return new Promise(async (resolve, reject) => {
			await db.write([]);
		});
	}
};

module.exports = db;
