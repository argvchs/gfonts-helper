# GFonts-Helper

A tool to download and compress Google Fonts.

## 1. Install

Input command:

```bash
npm i -g gfonts-helper
```

## 2. Usage

```bash
gfonts-helper <url>
```

e.g.:

```bash
gfonts-helper "https://fonts.googleapis.com/css2?family=Roboto&display=swap"
```

You can also use abbr.:

```bash
gfhelper <url>
```

After running, it will generate `download.css` `fonts.min.css` 2 files and a folder `fonts`.

You need to import `fonts.min.css` to use in the website.
