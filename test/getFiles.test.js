const assert = require('assert');
const getFiles = require("../modules/getFiles")

describe('getFiles.findFiles', () => {
    it('find MKVs when called', () => {
        let aBunchOfFiles = getFiles.findFiles("", ".mkv");
        assert.strictEqual(aBunchOfFiles.length, 1, "The count of files found is not correct.");
        assert.strictEqual(aBunchOfFiles[0], "Akame ga Kill!.S01E01.1080p.CR.WEB-DL.AAC.2.0.x264-KAN3D2M.mkv");
    });
    it('find ASSs when called', () => {
        let aBunchOfFiles = getFiles.findFiles("", ".ass");
        assert.strictEqual(aBunchOfFiles.length, 1, "The count of files found is not correct.");
        assert.strictEqual(aBunchOfFiles[0], "Akame ga Kill!.S01E01.1080p.CR.WEB-DL.AAC.2.0.x264-KAN3D2M.ara.ass");
    });
    it('find font files in a subdirectory when called', () => {
        let aBunchOfFiles = getFiles.findFiles("", [".ttf", ".otf"]);
        assert.strictEqual(aBunchOfFiles.length, 2, "The count of files found is not correct.");
        assert.strictEqual(aBunchOfFiles[0], "fontsXEWTR/AdobeArabic-Bold.otf");
        assert.strictEqual(aBunchOfFiles[1], "fontsXEWTR/arial.ttf");
    });
});