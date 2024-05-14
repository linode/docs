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

## Placeholders in command block in note

{{< note >}}
If the server's SSH port is something other than 22, it needs to be specified in the SSH command. To do this, use the `-p` option as shown in the command below. Replace {{< placeholder "PORT_NUMBER" >}} with the port number that the remote SSH server is using.

```command
ssh {{< placeholder "USERNAME" >}}@{{< placeholder "IP_ADDRESS" >}} -p {{< placeholder "PORT_NUMBER" >}}
```
{{< /note >}}