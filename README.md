# GFonts-Helper

一个下载并压缩 Google Fonts 的工具。

# 1. 安装

```bash
pnpm add gfonts-helper -g
```

# 2. 使用

```bash
gfonts-helper <url> <split> <delay>
```

-   `<url>`

    需要下载的 Google Fonts API 的链接。

-   `<split>`

    分组下载的每组数量，因为如果全部下载最后可能会卡住，默认为 20。

-   `<delay>`

    分组下载两组之间的等待时间，默认为 100（毫秒）。

例如：

```bash
gfonts-helper 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100..900&display=swap'
```

运行完会生成 `fonts.min.css` 样式文件，和一个文件夹 `fonts/` 存储字体文件。
