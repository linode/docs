---
title: Testing Placeholder
description: This is a test page used in both manual and automatic tests. Do not delete. It will not be listed anywhere.
---


## Placeholders in paragraph

* Replace {{< placeholder "example.com" >}} with your domain name.
* Here is a placeholder in inline code `nmap --top-ports 5 {{< placeholder "192.0.1.17" >}}`, how does that look?

## Placeholders in code block

```
server {
listen  80;
listen [::]:80;
server_name {{< placeholder "example.com" >}};
```