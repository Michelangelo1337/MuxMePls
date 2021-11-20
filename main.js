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
const os = require("os");

if (path === undefined) {
  console.log(chalk.red("[ERROR]") + " Path is not defined");
  return;
}

// Defaults
const getMkvs = getFiles.findFiles(path, [".mkv", ".mp4"]);
const getAss = getFiles.findFiles(path, ".ass");
const getFonts = getFiles.findFiles(path, [".otf", ".ttf", ".OTF", ".TTF"]);
console.log(`\n=== MuxMePls ${packageJson.version} ===\n`);

if (getMkvs.length <= 0 && getAss.length <= 0 && getFonts.length <= 0) {
  console.log(
    chalk.red("[ERROR] No video, subtitle and font files were found..")
  );
  return;
}

if (getFonts.length <= 0) {
  console.log(`${chalk.yellow("[WARNING] I did not find any Fonts!!")}\n`);
}

if (getAss.length <= 0) {
  console.log(chalk.red("[ERROR] Subtitle Files not found. Skipping.."));
  return;
}

if (getMkvs.length <= 0) {
  console.log(chalk.red("[ERROR] Video Files not found. Skipping.."));
  return;
}

function executeMkvMerge() {
  if (os.type() === "Linux") {
    return "mkvmerge";
  }
  if (os.type() === "Windows_NT") {
    return "mkvmerge.exe";
  }
}

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

let askForAnimeName, askForFormat, askIfWishToRename, fileBotFormat;
const subtitleLanguageISO = prompt(
  chalk.cyan("[PROMPT] ") +
    "What subtitle language are you muxing? (Both ISO 639-2 language codes and ISO 639-1 country codes are allowed): "
);
const askForFansubTeam = prompt(chalk.cyan("[PROMPT] ") + `TL Team ? `);
askIfWishToRename = prompt(
  chalk.cyan("[PROMPT] ") +
    "Do you wish to rename the files with filebot? (y/n) "
);
const renameFiles = function () {
  if (askIfWishToRename === "n") {
    return false;
  } else if (askIfWishToRename === "y") {
    askForAnimeName = prompt(
      chalk.cyan("[PROMPT] ") + "What's the anime name ? "
    );
    askForFormat = prompt(
      chalk.cyan("[PROMPT] ") +
        "Do you wish to specify an output foramt for Filebot? (y/n) "
    );
    if (askForFormat === "y") {
      fileBotFormat = prompt(
        chalk.cyan("[PROMPT] ") + "Please paste your own format here : "
      );
    } else {
      console.log(
        ` ${chalk.blueBright(
          "[LOG] "
        )} "Alright, I will use filebot's default foramt" `
      );
    }
  }
};

renameFiles();
for (let i = 0; i < getMkvs.length; i++) {
  let mkvmergeArguments = [];
  let finalOutPut = relativeVideoTargetPath + "/" + getMkvs[i];
  console.log(
    `\n${chalk.cyan("[Processing]")} ${chalk.green(`${getMkvs[i]}`)}\n`
  );
  mkvmergeArguments.push("--output");
  mkvmergeArguments.push(`${finalOutPut}`);
  mkvmergeArguments.push(
    "--language",
    "1:jpn",
    "--video-tracks",
    "0",
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

  try {
    childProcess.execSync(executeMkvMerge() + ` @mkvmerge_${i}.json`, {
      stdio: "inherit",
    });
  } catch (err) {
    console.log(chalk.red("[ERROR]") + ": " + err.message);
  }

  // {n.space('.')}.{'S'+s.pad(2)}E{e.pad(2)}.{t.space('.')}.{vf}.{ac}.{channels}.{vc}
  if (askIfWishToRename === "y") {
    childProcess.execSync(
      "filebot " +
        `-rename "${finalOutPut}" --db "TheTVDB" -non-strict --q "${askForAnimeName}" --format ${
          askForFormat === "y" ? `"${fileBotFormat}"` : `"{n} - {s00e00} - {t}"`
        }`,
      {
        stdio: "inherit",
      }
    );
  }
  const jsonPath = path + `/mkvmerge_${i}.json`;
  try {
    fs.unlinkSync(jsonPath);
  } catch (err) {
    console.log(err);
  }
  console.log(
    `\n${chalk.green("[Processed]")} ${chalk.magenta(`${getMkvs[i]}`)}!\n`
  );
  console.log(
    "========================================================================================================="
  );
}
