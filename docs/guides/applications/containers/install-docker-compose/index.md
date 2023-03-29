---
slug: install-docker-compose
description: 'Shortguide for installing Docker Compose'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ["docker", "docker compose", "container"]
tags: ["container","docker"]
modified: 2012-11-29
modified_by:
  name: Sam Foo
title: "Install Docker Compose"
published: 2018-01-08
headless: true
aliases: ['/applications/containers/install-docker-compose/']
authors: ["Jared Kobos"]
---

<!--- Installation instructions for Docker Compose -->

1. Download the latest version of Docker Compose. Check the [releases](https://github.com/docker/compose/releases) page and replace `1.25.4` in the command below with the version tagged as **Latest release**:

    ```command
    sudo curl -L https://github.com/docker/compose/releases/download/v1.25.4/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
    ```

1. Set file permissions:

    ```command
    sudo chmod +x /usr/local/bin/docker-compose
    ```
