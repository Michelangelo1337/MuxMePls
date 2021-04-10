function fontMime(fontFile) {
  if (fontFile.match(/\.otf$/) || fontFile.match(/\.OTF$/)) {
    return "application/vnd.ms-opentype";
  }
  if (fontFile.match(/\.ttf$/) || fontFile.match(/\.TTF$/)) {
    return "application/x-truetype-font";
  }
  return "application/octet-stream";
}

exports.fontMime = fontMime;
