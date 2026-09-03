#!/usr/bin/env python3
"""
把 ThreeUI Sylva 落地页文案替换为 YunYu 个人内容。
直接修改 public/landing-pages/inner-green-3d.html。
"""
from pathlib import Path
import re

ROOT = Path("/Users/wangpenglong/projects/nextjs/PersonalSite-home")
HTML = ROOT / "public/landing-pages/inner-green-3d.html"

content = HTML.read_text(encoding="utf-8")

replacements = [
    # head
    ("<title>Sylva — Into the living world</title>",
     "<title>YunYu — 全栈工程师</title>"),
    ('<meta name="description" content="Restoring wild places through patient design, native planting, and a deeper kind of stewardship.">',
     '<meta name="description" content="YunYu 的个人站点 — 一名在 Web 开发领域深耕五年的全栈工程师，专注于 React 生态与 Node.js 后端。">'),

    # dock nav (保留视觉，改文字 + 跳转)
    ('<a class="dock-item is-active" data-dock data-spec data-burst href="#" style="--d:180ms">\n        <span class="glyph" aria-hidden="true">',
     '<a class="dock-item is-active" data-dock data-spec data-burst href="/" target="_top" style="--d:180ms">\n        <span class="glyph" aria-hidden="true">'),
    ('<span>Grove</span>', '<span>首页</span>'),
    ('<a class="dock-item" data-dock data-spec data-burst href="#" style="--d:230ms">\n        <span class="glyph" aria-hidden="true">',
     '<a class="dock-item" data-dock data-spec data-burst href="/creative" target="_top" style="--d:230ms">\n        <span class="glyph" aria-hidden="true">'),
    ('<span>Habitats</span>', '<span>作品</span>'),
    ('<a class="dock-item" data-dock data-spec data-burst href="#" style="--d:280ms">\n        <span class="glyph" aria-hidden="true">',
     '<a class="dock-item" data-dock data-spec data-burst href="/blog" target="_top" style="--d:280ms">\n        <span class="glyph" aria-hidden="true">'),
    ('<span>Journal</span>', '<span>笔记</span>'),
    ('<a class="dock-item dock-item--enter" data-dock data-spec data-burst href="#" style="--d:330ms">\n        <span class="glyph" aria-hidden="true">',
     '<a class="dock-item dock-item--enter" data-dock data-spec data-burst href="mailto:biliww997@gmail.com" target="_top" style="--d:330ms">\n        <span class="glyph" aria-hidden="true">'),
    ('<span>Enter</span>', '<span>联系</span>'),

    # ghost watermark
    ('<div class="ghost fade" style="--d:1150ms" aria-hidden="true">SYLVA</div>',
     '<div class="ghost fade" style="--d:1150ms" aria-hidden="true">YUNYU</div>'),

    # card about
    ('<p class="label">Our Ethos</p>', '<p class="label">关于我</p>'),
    ('<h2>Let the wild lead.</h2>', '<h2>以代码写诗，以架构作画</h2>'),

    # headline
    ('<span><i style="--d:260ms">Step into</i></span>',
     '<span><i style="--d:260ms">YunYu</i></span>'),
    ('<span><i style="--d:360ms">the living world</i></span>',
     '<span><i style="--d:360ms">全栈工程师</i></span>'),

    # lede
    ('<p class="lede mask" style="--d:480ms; --pd:14; --pr:1">We restore wild places through patient design, native planting, and a deeper kind of stewardship.</p>',
     '<p class="lede mask" style="--d:480ms; --pd:14; --pr:1">一名在 Web 开发领域深耕五年的全栈工程师，专注于 React 生态与 Node.js 后端，相信好的代码应该让人感到舒适。</p>'),

    # explore button
    ('<button class="liquid-button liquid-button--explore btn" type="button">',
     '<button class="liquid-button liquid-button--explore btn" type="button" onclick="top.location.href=\'/creative\'">'),
    ('<span class="lbl">Explore the work</span>', '<span class="lbl">查看作品</span>'),

    # play button
    ('<button class="liquid-button liquid-button--play btn" type="button" aria-label="Play the film">',
     '<button class="liquid-button liquid-button--play btn" type="button" aria-label="关于我" onclick="top.location.href=\'/\'">'),

    # stats
    ('<div><dt>Canopy restored</dt><dd>282 ha</dd></div>',
     '<div><dt>Web 开发经验</dt><dd>5 年+</dd></div>'),
    ('<div><dt>Native species</dt><dd>43 mapped</dd></div>',
     '<div><dt>主要技术栈</dt><dd>React / Next.js</dd></div>'),

    # card stove
    ('<p class="label">Field Note 07</p>', '<p class="label">精选项目</p>'),
    ('<h2>After the Rain</h2>', '<h2>微前端治理平台</h2>'),
    ('<button class="knob" aria-label="Open field note: After the Rain">',
     '<button class="knob" aria-label="查看项目：微前端治理平台" onclick="top.location.href=\'/creative\'">'),

    # scroll
    ('<a class="scroll mask" style="--d:1040ms; --pd:9" href="#">Discover<span class="track"></span></a>',
     '<a class="scroll mask" style="--d:1040ms; --pd:9" href="#about">向下探索<span class="track"></span></a>'),
]

for old, new in replacements:
    if old not in content:
        print(f"⚠️ 未匹配: {old[:60]!r}")
    content = content.replace(old, new)

# 在 </style> 前注入「仅首屏、无滚动」样式
content = content.replace(
    "</style>",
    """    /* PersonalSite: 仅保留首屏 hero，禁止滚动 */
    html, body {
      overflow: hidden !important;
      height: 100% !important;
    }
    .section, .scroll {
      display: none !important;
    }
</style>""",
    1,
)

# 在 </body> 前加定制注释
content = content.replace(
    "</body>",
    "<!-- 本文件由 ThreeUI Sylva 落地页修改而来：品牌文案已替换为 YunYu 个人内容，链接使用 target=\"_top\" 在同源父页面打开；首屏以下滚动区块已隐藏。 --></body>",
)

HTML.write_text(content, encoding="utf-8")
print("✅ 已定制 Sylva 落地页文案")
