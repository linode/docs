---
author:
  name: Jared Kobos
  email: sfoo@linode.com
description: 'Shortguide for installing Docker Compose'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ["docker", "docker compose", "container"]
modified: 2018-06-29
modified_by:
  name: Sam Foo
title: "How to Install Docker Compose"
published: 2018-01-08
shortguide: true
---

<!--- Installation instructions for Docker Compose -->

1. Download the latest version of Docker Compose. Check the [releases](https://github.com/docker/compose/releases) page and replace `1.21.2` in the command below with the version tagged as **Latest release**:

        sudo curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

2. Set file permissions:

        sudo chmod +x /usr/local/bin/docker-compose
