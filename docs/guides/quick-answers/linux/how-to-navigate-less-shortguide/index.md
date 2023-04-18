---
slug: how-to-navigate-less-shortguide
description: 'Table of key commands used for navigating output with the less command.'
keywords: ["linux", "how to", "less", "key commands"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-09-05
modified_by:
  name: Nathan Melehan
published: 2018-09-05
title: Less Keyboard Navigation Commands
headless: true
tags: ["linux"]
aliases: ['/quick-answers/linux/how-to-navigate-less-shortguide/']
authors: ["Nathan Melehan"]
---

| Key command | Action |
| --------- | -------------- |
| `down arrow key`, `enter`, `e`, or `j` | Move down one line. |
| `up arrow key`, `y`, or `k` | Move up one line. |
| `space bar` | Move down one page. |
| `b` | Move up one page. |
| `right arrow key` | Scroll horizontally to the right. |
| `left arrow key` | Scroll horizontally to the left. |
| `g` | Go to the first line. |
| `G` | Go to the last line. |
| `10g` | Go to the 10th line. Enter a different number to go to other lines. |
| `50p` or `50%` | Go to the line half-way through the output. Enter a different number to go to other percentage positions. |
| `/search term` | Search forward from the current position for the `search term` string. |
| `?search term` | Search backward from the current position for the `search term` string. |
| `n` | When searching, go to the next occurrence. |
| `N` | When searching, go to the previous occurrence. |
| `m``<c>` | Set a *mark*, which saves your current position. Enter a single character in place of `<c>` to label the mark with that character. |
| `'``<c>` | Return to a mark, where `<c>` is the single character label for the mark. Note that `'` is the single-quote. |
| `q` | Quit `less` |