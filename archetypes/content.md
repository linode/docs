---
slug: {{ path.Base .File.Dir }}
title: "{{ replace (path.Base .File.Dir) "-" " " | title }}"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Akamai"]
contributors: ["Akamai"]
published: {{ now.Format "2006-01-02" }}
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

When writing content, please reference the [Linode Writer's Formatting Guide](https://www.linode.com/docs/guides/linode-writers-formatting-guide/). This provides formatting guidelines for YAML front matter, Markdown, and our custom shortcodes (like [command](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#commands), [file](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#files), [notes](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#note-shortcode), and [tabs](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#tabs)).

## Before You Begin

In this section, list out any prerequisites necessary for the reader to complete the guide, including: services or products to be created beforehand, hardware and plan requirements, or software that needs to be preinstalled.

See: [Linode Writer's Formatting Guide: Before You Begin](http://www.linode.com/docs/guides/linode-writers-formatting-guide/#before-you-begin)