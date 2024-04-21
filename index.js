import * as fs from "node:fs";
import * as path from "node:path";
import * as stream from "node:stream";
import CleanCSS from "clean-css";
let reg1 = /(https?|ftp|file):\/\/[-\w+&@#/%=~|?!:,.;]+[-\w+&@#/%=~|]/g;
let reg2 = /(https?|ftp|file):\/\/[-\w+&@#%=~|?!:,.;]+/g;
let useragent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";
let options = { headers: { "User-Agent": useragent } };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function download(url, file) {
    let dir = path.dirname(file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    let response = await fetch(url, options);
    await stream.promises.finished(
        stream.Readable.fromWeb(response.body).pipe(fs.createWriteStream(file))
    );
}
let url = process.argv[2];
let split = parseInt(process.argv[3]) || 20;
let delay = parseInt(process.argv[4]) || 100;
await download(url, "cache.css");
let style = fs.readFileSync("cache.css").toString();
let urls = style.match(reg1);
for (let i = 0; i < urls.length; i += split) {
    console.log(i, "/", urls.length, "(" + ((i / urls.length) * 100).toFixed(2) + "%)");
    let slice = urls.slice(i, i + split);
    await Promise.all(slice.map((url) => download(url, url.replace(reg2, "fonts"))));
    await sleep(delay);
}
console.log(urls.length, "/", urls.length, "(100.00%)");
let minified = new CleanCSS().minify(style.replace(reg2, "fonts")).styles;
fs.writeFileSync("fonts.min.css", minified);
fs.unlinkSync("cache.css");
