#!/usr/bin/env node
const fs = require("fs");
const CleanCSS = require("clean-css");
const https = require("https");
const sleep = ms => new Promise(res => setTimeout(res, ms));
const FILE = /(https?|ftp|file):\/\/[-\w+&@#/%=~|?!:,.;]+[-\w+&@#/%=~|]/g;
const DOMAIN = /(https?|ftp|file):\/\/[-\w+&@#%=~|?!:,.;]+/g;
let url = process.argv[2].replace(/http:/, "https:");
let group = parseInt(process.argv[3]) || 20;
const options = {
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT group.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
};
function getdir(url) {
    return url.split("/").slice(0, -1).join("/");
}
function download(url, path) {
    return new Promise(cb => {
        https.get(url, options, res => {
            let dir = getdir(path);
            if (dir)
                try {
                    fs.accessSync(dir);
                } catch {
                    fs.mkdirSync(dir, { recursive: true });
                }
            let writeStream = fs.createWriteStream(path);
            res.pipe(writeStream);
            writeStream.on("finish", () => {
                writeStream.close();
                cb();
            });
            writeStream.on("error", err => {
                writeStream.close();
                console.error(err);
            });
        });
    });
}
async function main() {
    await download(url, "download.css");
    fs.readFile("download.css", "utf-8", async (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let fonts = data.match(FILE);
        let count = 0;
        for (let i = 0; i < fonts.length; i += group) {
            let slice = fonts.slice(i, i + group);
            await Promise.all(slice.map(url => download(url, url.replace(DOMAIN, "fonts"), fonts)));
            count += group;
            console.log(count, fonts.length);
            await sleep(100);
        }
        let style = data.replace(DOMAIN, "fonts");
        let minified = new CleanCSS().minify(style).styles;
        fs.writeFile("fonts.min.css", minified, err => {
            if (err) console.error(err);
        });
    });
}

main();
