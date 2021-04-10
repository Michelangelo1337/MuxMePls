const assert = require('assert');
const getFiles = require("../modules/getFiles")

describe('getFiles.hasFileExtension', () => {
    it('bob.mkv ends with .mkv', () => {
        assert.strictEqual(getFiles.hasFileExtension("bob.mkv", [".txt"]), false);
    });
    it('bob.mkv ends with .txt or .mkv', () => {
        assert.strictEqual(getFiles.hasFileExtension("bob.mkv", [".txt", ".mkv"]), true);
    });
});