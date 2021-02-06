const path = require('path');
const fs = jest.createMockFromModule('fs');
const _fs = jest.requireActual("fs");

Object.assign(fs, _fs);
const readMockHash = {};
const writeMockHash = {};

fs.setReadMock = (path, error, data) => {
	readMockHash[path] = [error, data];
};

fs.readFile = (path, options, callback) => {
	if (callback === undefined) {
		callback = options;
		options = {};
	}
	if (path in readMockHash) {
		callback(...readMockHash[path]);
	} else {
		_fs.readFile(path, options, callback);
	}
};

fs.setWriteMock = (path, fn) => {
	writeMockHash[path] = fn;
};

fs.writeFile = (path, data, callback) => {
	if (path in writeMockHash) {
		writeMockHash[path](path, data, callback);
	} else {
		_fs.writeFile(path, data, callback);
	}
};

module.exports = fs;
