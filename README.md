# MuxMePls

![MIT License](https://img.shields.io/static/v1.svg?label=📜%20License&message=MIT&color=informational) ![](https://img.shields.io/npm/dw/muxmepls?color=blue&label=NPM&logo=npm&logoColor=red&style=flat-square) ![](https://img.shields.io/github/downloads/Michelangelo1337/MuxMePls/total?color=blue&label=github&logo=github&style=flat-square)

MuxMePls is a nodejs utility to mux ".ass" subtitles together with the fonts specified in a font folder into mkv container.

The "mkv" and "ass" files do not have to match. As long as both are in a ordered list, It will match them and merge them together with the fonts.

## Installation

You can download the compiled version from the release page [here](https://github.com/Michelangelo1337/MuxMePls/releases)

**mkvmerge needs to be in PATH in order for MuxMePls to work**

Or you can just clone the repoistory and install the modules

`git clone https://github.com/Michelangelo1337/MuxMePls.git` <br/>
`cd MuxMePls` <br/>
`npm i`

The repository already contains a shell script and a bash script for both linux and windows
once you add the repository to PATH you can use MuxMePls simply by opening a terminal and typing `MuxMePls.bat` for Windows **OR** `MuxMePls.sh` for Linux

## Usage

If you are using the compiled version after you added it to PATH: <br/>

`MuxMePls.exe "path/to/mkv/and/ass"`

If you cloned the repoistory and added it to PATH, just navigate to the folder that contains the files and run: `MuxMePls`

## Contributions

Software contributions are welcome. If you are not a dev, testing and reproting bugs can also be very helpful!

## Questions?

Please make an issue if you have questions, wish to request a feature, etc.
