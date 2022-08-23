#!/usr/bin/env node
const fs = require("fs");
const CleanCSS = require("clean-css");
const https = require("https");
const regm = /(https?|ftp|file):\/\/[-\w+&@#/%=~|?!:,.;]+[-\w+&@#/%=~|]/g;
const regr = /(https?|ftp|file):\/\/[-\w+&@#/%=~|?!:,.;]+\//g;
var url = process.argv[2].replace(/http:/, "https:");
const options = {
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36",
    },
};
function download(url, dest) {
    let promise = new Promise((cb) => {
        https.get(url, options, (res) => {
            const writeStream = fs.createWriteStream(dest);
            res.pipe(writeStream);
            writeStream.on("finish", () => {
                writeStream.close();
                cb();
            });
            writeStream.on("error", (err) => {
                writeStream.close();
                console.error(err);
            });
        });
    });
    return promise;
}
async function main() {
    await download(url, "download.css");
    fs.readFile("download.css", "utf-8", async (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        if (!fs.existsSync("fonts"))
            fs.mkdir("fonts", {}, (err) => {
                if (err) console.log(err);
            });
        let files = data.match(regm);
        await Promise.all(
            files.map((url) => download(url, url.replace(regr, "fonts/")))
        );
        let file = data.replace(regr, "fonts/");
        let minified = new CleanCSS().minify(file).styles;
        fs.writeFile("fonts.min.css", minified, (err) => {
            if (err) console.error(err);
        });
    });
}

main();
