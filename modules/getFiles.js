const fs = require("fs");

function hasFileExtension(filename, arrayOfExtensions) {
  for (let i = 0; i < arrayOfExtensions.length; i++) {
    if (filename.endsWith(arrayOfExtensions[i])) {
      return true;
    }
  }

  return false;
}

function findFiles(path, extension) {
  let filterByExtensions = [extension];
  if (typeof(extension) !== "string") {
    filterByExtensions = extension;
  }

  let entries = fs.readdirSync(path);
  let result = [];

  entries.forEach(element => {
    // if the thing has a searched extension, then we want it in the results
    if (hasFileExtension(element, filterByExtensions)) {
      result.push(element);
    } 
    
    // if the thing is a directory, then we recurse
    const fullpath = `${path}/${element}`;
    if (fs.lstatSync(fullpath).isDirectory()) {
      // console.log(`  - recursing into ${fullpath}...`)
      let subDirEntries = findFiles(fullpath, extension);
      for (let i = 0; i < subDirEntries.length; i++) {
        result.push(`${element}/${subDirEntries[i]}`)
      }
    }
  });

  return result;
}

exports.findFiles = findFiles;
exports.hasFileExtension = hasFileExtension;
