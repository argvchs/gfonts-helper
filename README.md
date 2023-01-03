# GFonts-Helper

一个下载并压缩 Google Fonts 的工具

## 1. 安装

```bash
npm i -g gfonts-helper
```

## 2. 使用

```bash
gfonts-helper <url> <group>
```

`<url>` 是 Google Fonts API 的 URL

`<group>` 是分组下载的每组数量，因为一次下载可能最后会卡住，默认为 20

e.g.

```bash
gfonts-helper "https://fonts.googleapis.com/css2?family=Roboto&display=swap"
gfonts-helper "https://fonts.loli.net/css2?family=Roboto&display=swap"
gfonts-helper "https://fonts.geekzu.org/css2?family=Roboto&display=swap"
```

还可以换成缩写

```bash
gfhelper <url> <group>
```

运行完生成 `download.css` `fonts.min.css` 两个文件和 `fonts` 一个文件夹

导入 `fonts.min.css` 即可，`download.css` 是下载文件，可以删除
