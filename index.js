#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const CleanCSS = require("clean-css");
const https = require("https");
const reg1 = /(https?|ftp|file):\/\/[-\w+&@#/%=~|?!:,.;]+[-\w+&@#/%=~|]/g;
const reg2 = /(https?|ftp|file):\/\/[-\w+&@#%=~|?!:,.;]+/g;
const options = {
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    },
};
const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));
const download = (source, dest) =>
    new Promise((resolve, reject) => {
        https.get(source, options, ret => {
            let dir = path.dirname(dest);
            try {
                fs.accessSync(dir);
            } catch {
                fs.mkdirSync(dir, { recursive: true });
            }
            let ws = fs.createWriteStream(dest);
            ret.pipe(ws);
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
(async () => {
    let source, group;
    try {
        source = process.argv[2].replace(/http:/, "https:");
        group = +process.argv[3] || 20;
    } catch {
        return;
    }
    await download(source, "download.css");
    let style = fs.readFileSync("download.css").toString();
    let files = style.match(reg1);
    for (let i = 0; i < files.length; i += group) {
        console.log(i, "/", files.length);
        let promises = [];
        for (let file of files.slice(i, i + group)) promises.push(download(file, file.replace(reg2, "fonts")));
        await Promise.all(promises);
        await sleep(100);
    }
    let minify = new CleanCSS().minify(style.replace(reg2, "fonts")).styles;
    fs.writeFileSync("fonts.min.css", minify);
    fs.unlinkSync("download.css");
})();
