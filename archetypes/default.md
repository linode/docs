---
slug: {{ path.Base .File.Dir }}
title: "{{ replace (path.Base .File.Dir) "-" " " | title }}"
date: {{ .Date }}
draft: true
---

