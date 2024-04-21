# GFonts-Helper

一个下载并压缩 Google Fonts 的工具。

# 1. 安装

```bash
pnpm add gfonts-helper -g
```

# 2. 使用

```bash
gfonts-helper <source> <split>
```

`<source>` 是一个 Google Fonts API 的链接。

`<split>` 是分组下载的每组数量，因为全部下载可能最后会卡住，默认为 20。

e.g.

```bash
gfonts-helper 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&display=swap'
gfonts-helper 'https://fonts.loli.net/css2?family=Noto+Sans+SC:wght@100..900&display=swap'
gfonts-helper 'https://fonts.geekzu.org/css2?family=Noto+Sans+SC:wght@100..900&display=swap'
```

运行完会生成 `fonts.min.css` 样式文件，和一个文件夹 `fonts/` 存储字体文件。
