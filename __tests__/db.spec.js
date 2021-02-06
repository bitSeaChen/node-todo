const db = require("../db");
const fs = require("fs");
jest.mock("fs");

describe("db", () => {
	it('should be read', async function () {
		const obj = [{title: "testTitle", done: true}];
		expect(db.read instanceof Function).toBe(true);
		fs.setReadMock("/testPath", null, JSON.stringify(obj));
		const list = await db.read("/testPath");
		expect(list).toStrictEqual(obj);
	});
	
	it('should be write', async function () {
		let faceFile = null;
		fs.setWriteMock("/testPath", (path, data, callback) => {
			faceFile = data;
			callback(null);
		});
		const list = [{title: "testTitleName", done: false}];
		await db.write(list, "/testPath");
		expect(faceFile).toBe(JSON.stringify(list));
	});
});
