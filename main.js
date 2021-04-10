const getFiles = require("./modules/getFiles");
const getFontType = require("./modules/getFontMime");
const process = require("process");
const packageJson = require("./package.json");
const mkvMergeTools = require("./modules/mkvMergeTools");
const fs = require("fs");
const childProcess = require("child_process");
const chalk = require("chalk");
const path = process.argv[2];
const prompt = require("prompt-sync")();

// Defaults
const getMkvs = getFiles.findFiles(path, ".mkv");
const getAss = getFiles.findFiles(path, ".ass");
const getFonts = getFiles.findFiles(path, [".otf", ".ttf", ".OTF", ".TTF"]);

console.log(`\n=== MuxMePls ${packageJson.version} ===\n`);

if (getFonts.length <= 0) {
  console.log(chalk.red("[ERROR]") + " I did not find any Fonts, Skipping..");
  return;
}

if (getAss.length <= 0) {
  console.log(chalk.red("[ERROR] Subtitle Files not found. Skipping.."));
  return;
}

if (getMkvs.length <= 0) {
  console.log(chalk.red("[ERROR] Video Files not found. Skipping.."));
  return;
}

const mkvmerge = __dirname + "/bin/mkvmerge.exe";
if (path === undefined) {
  console.log(chalk.red("[ERROR]") + " Path is not defined");
  return;
}

// console.log("The target path is " + path);
process.chdir(path);

let relativeVideoTargetPath = "muxoutput";
let videoTargetPath = path + "/" + relativeVideoTargetPath;

if (fs.existsSync(videoTargetPath)) {
  console.log(
    chalk.yellow("[WARNING]") +
      ` The target folder ${videoTargetPath} does already exist. That is unusual...`
  );
}
if (!fs.existsSync(videoTargetPath)) {
  fs.mkdirSync(videoTargetPath);
}

// function extractFontName(font) {
//   const indexOfslash = font.indexOf("/") + 1
//   const extract = font.slice(indexOfslash)
//   return extract
// }

function getFontArguments(fonts) {
  let result = [];
  for (let i = 0; i < fonts.length; i++) {
    result.push(
      "--attachment-mime-type",
      getFontType.fontMime(fonts[i]),
      "--attach-file",
      fonts[i]
    );
  }
  return result;
}

const subtitleLanguageISO = prompt(
  `What subtitle language are you muxing? (Both ISO 639-2 language codes and ISO 639-1 country codes are allowed): `
);
const askForFansubTeam = prompt(`TL Team ? `);

for (let i = 0; i < getMkvs.length; i++) {
  let mkvmergeArguments = [];
  console.log(
    `\n${chalk.cyan("[Processing]")} ${chalk.green(`${getMkvs[i]}`)}\n`
  );
  mkvmergeArguments.push("--output");
  mkvmergeArguments.push(relativeVideoTargetPath + "/" + getMkvs[i]);
  mkvmergeArguments.push(
    "--language",
    "1:jpn",
    "--video-tracks",
    "0",
    "--audio-tracks",
    "1",
    `${getMkvs[i]}`,
    "--track-name",
    `0:${askForFansubTeam}`,
    "--language",
    `0:${subtitleLanguageISO}`,
    "--default-track",
    "0:yes",
    `${getAss[i]}`
  );
  mkvmergeArguments.push(...getFontArguments(getFonts));

  mkvMergeTools.saveFile(path + `/mkvmerge_${i}.json`, mkvmergeArguments);
  childProcess.execSync(mkvmerge + ` @mkvmerge_${i}.json`, {
    stdio: "inherit",
  });
  const jsonPath = path + `/mkvmerge_${i}.json`;
  try {
    fs.unlinkSync(jsonPath);
  } catch (err) {
    console.log(err);
  }
  console.log(
    `\n${chalk.green("[Processed]")} ${chalk.magenta(`${getMkvs[i]}`)}!\n`
  );
}

// 1. Negative Zeilen : mkvmerge bricht ab, JSON Datei von der vorherigem Video wird nicht gelöscht.
// 2. Compile Node.js to exe and linux
// 3. Make discovery of the correct audi and video IDs
