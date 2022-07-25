#!/usr/bin/env node
const fs = require("fs");
const CleanCSS = require("clean-css");
const download = require("download");
const regm = /(https?|ftp|file):\/\/[-\w+&@#/%=~|?!:,.;]+[-\w+&@#/%=~|]/g;
const regr = /(https?|ftp|file):\/\/[-\w+&@#/%=~|?!:,.;]+\//g;
var url = process.argv[2];
const options = {
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36",
    },
};
async function main() {
    fs.writeFileSync("download.css", await download(url, undefined, options));
    fs.readFile("download.css", "utf-8", async (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let files = data.match(regm);
        await Promise.all(files.map((url) => download(url, "fonts")));
        let file = data.replace(regr, "fonts/");
        let minified = new CleanCSS().minify(file).styles;
        fs.writeFile("fonts.min.css", minified, (err) => {
            if (err) console.error(err);
        });
    });
}
main();
