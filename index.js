#!/usr/bin/env node

const fs = require("fs");
const CleanCSS = require("clean-css");
const https = require("https");

const FILE = /(https?|ftp|file):\/\/[-\w+&@#/%=~|?!:,.;]+[-\w+&@#/%=~|]/g;
const DOMAIN = /(https?|ftp|file):\/\/[-\w+&@#%=~|?!:,.;]+/g;
const OPTIONS = {
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    },
};

let url = process.argv[2].replace(/http:/, "https:");
let group = +process.argv[3] || 20;

function getdirectory(url) {
    return url.split("/").slice(0, -1).join("/");
}
function download(url, path) {
    return new Promise(resolve => {
        https.get(url, OPTIONS, res => {
            let dir = getdirectory(path);
            if (dir)
                try {
                    fs.accessSync(dir);
                } catch {
                    fs.mkdirSync(dir, { recursive: true });
                }
            let ws = fs.createWriteStream(path);
            res.pipe(ws);
            ws.on("finish", () => {
                ws.close();
                resolve();
            });
            ws.on("error", err => {
                ws.close();
                throw err;
            });
        });
    });
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    await download(url, "download.css");
    fs.readFile("download.css", "utf-8", async (err, data) => {
        if (err) throw err;
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
            if (err) throw err;
        });
    });
}

main();
