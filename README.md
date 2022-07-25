# GFonts-Helper

一个下载并压缩 Google Fonts 的工具

## 1. 安装

输入命令

```bash
npm i -g gfonts-helper
```

## 2. 使用

```bash
gfonts-helper <url>
```

`<url>` 是 Google Fonts API 的网址，e.g.

```bash
gfonts-helper https://fonts.googleapis.com/css2?family=Roboto&display=swap
```

还可以换成缩写

```bash
gfhelper <url>
```

运行完生成 `download.css` `fonts.min.css` 两个文件和一个文件夹 `fonts`

要在网站中使用，导入 `fonts.min.css`即可

`download.css` 是下载文件，可以删除
