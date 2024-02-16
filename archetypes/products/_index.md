---
title: "{{ replace (path.Base .File.Dir) "-" " " | title }}"
title_meta:
description:
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: {{ .Date }}
    product_description:
modified: {{ now.Format "2006-01-02" }}
---