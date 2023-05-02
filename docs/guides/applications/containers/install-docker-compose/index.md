---
slug: install-docker-compose
description: 'Shortguide for installing Docker Compose'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ["docker", "docker compose", "container"]
tags: ["container", "docker"]
modified: 2012-11-29
modified_by:
  name: Sam Foo
title: "How to Install Docker Compose"
authors: ["Jared Kobos"]
published: 2018-01-08
headless: true
aliases: ['/applications/containers/install-docker-compose/']
authors: ["Jared Kobos"]
---

<!--- Installation instructions for Docker Compose -->

Docker Compose is available in plugin and standalone variants. However, Docker's official documentation prioritizes the plugin. Further, the plugin has a straightforward installation and works well with past Docker Compose commands.

These steps thus show how to install the Docker Compose plugin. If you are interested in installing the standalone Docker Compose application, follow Docker's [official installation guide](https://docs.docker.com/compose/install/other/#on-linux).

{{< note >}}
Many tutorials retain the Docker Compose standalone command format, which looks like the following:

```command
docker-compose [command]
```

Be sure to replace this with the plugin's command format when using this installation method. This typically just means replacing the hyphen with a space, as in:

```command
docker compose [command]
```

{{< /note >}}

1. Enable the Docker repository for your system's package manager. The repository is typically already enabled after you have installed the Docker engine. Follow our relevant guide on installing Docker to enable the repository on your system.

1. Update your package manager, and install the Docker Compose plugin.

    - On **Debian** and **Ubuntu** systems, use the following commands:

    ```command
    sudo apt update
    sudo apt install docker-compose-plugin
    ```

    - On **CentOS**, **Fedora**, and other RPM-based distributions, use the following commands:

    ```command
    sudo yum update
    sudo yum install docker-compose-plugin
    ```
