#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const CleanCSS = require("clean-css");
const https = require("https");

const URL = /(https?|ftp|file):\/\/[-\w+&@#/%=~|?!:,.;]+[-\w+&@#/%=~|]/g;
const DOMAIN = /(https?|ftp|file):\/\/[-\w+&@#%=~|?!:,.;]+/g;
const OPTIONS = {
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    },
};

let url = process.argv[2].replace(/http:/, "https:");
let group = +process.argv[3] || 20;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function download(url, file) {
    return new Promise((resolve, reject) => {
        https.get(url, OPTIONS, res => {
            let dir = path.dirname(file);
            try {
                fs.accessSync(dir);
            } catch {
                fs.mkdirSync(dir, { recursive: true });
            }
            let ws = fs.createWriteStream(file);
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
    await download(url, "download.css");
    let css = fs.readFileSync("download.css").toString();
    let urls = css.match(URL);
    for (let i = 0; i < urls.length; i += group) {
        console.log(i, "/", urls.length);
        let promises = [];
        for (let url of urls.slice(i, i + group))
            promises.push(download(url, url.replace(DOMAIN, "fonts")));
        await Promise.all(promises);
        await sleep(100);
    }
    let min = new CleanCSS().minify(css.replace(DOMAIN, "fonts")).styles;
    fs.writeFileSync("fonts.min.css", min);
    fs.unlinkSync("download.css");
}

main();
