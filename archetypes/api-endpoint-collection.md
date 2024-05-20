---
title: "{{ replace (path.BaseName .File.Path) "-" " " | title }}"
slug: {{ path.BaseName .File.Path }}
---