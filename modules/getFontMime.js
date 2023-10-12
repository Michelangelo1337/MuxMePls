function fontMime(fontFile) {
  if (fontFile.match(/\.otf$/) || fontFile.match(/\.OTF$/)) {
    return "font/otf";
  }
  if (fontFile.match(/\.ttf$/) || fontFile.match(/\.TTF$/)) {
    return "font/ttf";
  }
  return "application/octet-stream";
}

exports.fontMime = fontMime;
