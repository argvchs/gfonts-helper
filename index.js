#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const CleanCSS = require("clean-css");
const https = require("https");
const reFile = /(https?|ftp|file):\/\/[-\w+&@#/%=~|?!:,.;]+[-\w+&@#/%=~|]/g;
const reDomain = /(https?|ftp|file):\/\/[-\w+&@#%=~|?!:,.;]+/g;
const options = {
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    },
};
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
function download(source, dest) {
    return new Promise((resolve, reject) => {
        https.get(source, options, res => {
            let dir = path.dirname(dest);
            try {
                fs.accessSync(dir);
            } catch {
                fs.mkdirSync(dir, { recursive: true });
            }
            let ws = fs.createWriteStream(dest);
            res.pipe(ws);
            ws.on("finish", () => {
                ws.close();
                resolve();
            });
            ws.on("error", err => {
                ws.close();
                reject(err);
            });
        });
    });
}
async function main() {
    let source, group;
    try {
        source = process.argv[2].replace(/http:/, "https:");
        group = +process.argv[3] || 20;
    } catch {
        return;
    }
    await download(source, "download.css");
    let style = fs.readFileSync("download.css").toString();
    let files = style.match(reFile);
    for (let i = 0; i < files.length; i += group) {
        console.log(i, "/", files.length);
        let promises = [];
        for (let file of files.slice(i, i + group))
            promises.push(download(file, file.replace(reDomain, "fonts")));
        await Promise.all(promises);
        await sleep(100);
    }
    let minify = new CleanCSS().minify(style.replace(reDomain, "fonts")).styles;
    fs.writeFileSync("fonts.min.css", minify);
    fs.unlinkSync("download.css");
}
main();
