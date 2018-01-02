<!--- Installation instructions for Docker Compose -->

1. Download the latest version of Docker Compose. Check the [releases](https://github.com/docker/compose/releases) page and replace `1.17.1` in the command below with the version tagged as **Latest release**:

        sudo curl -L https://github.com/docker/compose/releases/download/1.17.1/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

2. Set file permissions:

        sudo chmod +x /usr/local/bin/docker-compose
