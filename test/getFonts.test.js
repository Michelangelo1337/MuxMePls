const assert = require('assert');
const getFiles = require("../modules/getFiles")

function extractFontName(font) {
    const indexOfslash = font.indexOf("/") + 1
    const extract = font.slice(indexOfslash)
    return extract
  }

describe('extracting font name', () => {
    it('does it extract it right?', () => {
        assert.strictEqual(extractFontName("fontsXEWTR/arial.ttf"), "arial.ttf");
    });
});