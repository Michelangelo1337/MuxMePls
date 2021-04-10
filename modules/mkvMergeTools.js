const fs = require("fs");
function saveFile(path, mkvArguments) {
  let content = JSON.stringify(mkvArguments, null, 2);
  fs.writeFileSync(path, content);
}

exports.saveFile = saveFile;
