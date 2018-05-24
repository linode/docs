---
author:
  name: Nathan Melehan
  email: nmelehan@linode.com
keywords: ["Docker", "Docker Compose", "WordPress"]
description: This guide explains how to set up WordPress with Docker Compose.
og_description: This guide explains how to set up WordPress with Docker Compose.
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-05-24
title: Install WordPress with Docker Compose
external_resources:
  - '[library/wordpress - Docker Hub](https://hub.docker.com/_/wordpress/)'
  - '[Overview of Docker Compose | Docker Documentation](https://docs.docker.com/compose/overview/)'
  - '[Quickstart: Compose and Wordpress | Docker Documentation](https://docs.docker.com/compose/wordpress/)'
---

## What Are Docker and Docker Compose?

*Docker* is a system that provides pre-configured, self-contained packages for applications you want to run, like WordPress. When deployed, these packages are referred to as *containers*. Docker also allows you to create your own containers with any custom software you'd like. You can create multiple identical copies of a container, which means that if you ever want to reinstall your software on your existing Linode or deploy it on a new Linode, you don't need to re-configure everything again.

*Docker Compose* is a complementary system which helps you link together individual Docker containers so that they can work together. This guide will walk through the deployment of a WordPress container and a MySQL container that WordPress will use to store its data. Docker Compose will facilitate the networking between them.

## Why Use Docker to Run WordPress?

Containers for WordPress and MySQL are available from [Docker Hub](https://hub.docker.com/) in the form of *images*. A Docker image is a static snapshot of a container, and they are used to create new container instances. Docker Hub is an official repository where individuals and organizations can upload Docker images for public consumption. 

The WordPress and MySQL images have been uploaded to Docker Hub by their respective organizations, and using them offers the following benefits:

- The configuration of the software has been done for you, which means that you don't need to follow a step-by-step process for each application to install it on your system.
- Updating your software is as simple as downloading the latest images from Docker Hub.
- Images and containers are self-contained, which means that they are easy to clean up if you decide to stop or remove them.

## Setting Up Docker Compose and WordPress

### Installation

1. Follow the [Before You Begin](/docs/applications/containers/how-to-use-docker-compose/#before-you-begin) section of the [How to Use Docker Compose](/docs/applications/containers/how-to-use-docker-compose/#before-you-begin) guide to install Docker and Docker Compose, then return to this guide.

2. Create a new directory in your home folder called `my_wordpress` and move into it:

    ```
mkdir ~/my_wordpress/
cd ~/my_wordpress/
    ```

3. Create a file called docker-compose.yml in this folder and add the following contents to it. Be sure to set your database passwords for the `WORDPRESS_DB_PASSWORD`, `MYSQL_ROOT_PASSWORD`, and `MYSQL_PASSWORD` environment options. The password entered for `WORDPRESS_DB_PASSWORD` and `MYSQL_PASSWORD` should be the same.

    {{< file "docker-compose.yml" yaml >}}
version: '3.3'

services:
   wordpress:
     depends_on:
       - db
     image: wordpress:latest
     volumes:
       - wordpress_files:/var/www/html
     ports:
       - "80:80"
     restart: always
     environment:
       WORDPRESS_DB_HOST: db:3306
       WORDPRESS_DB_USER: wordpress
       WORDPRESS_DB_PASSWORD: my_wordpress_db_password

   db:
     image: mysql:5.7
     volumes:
       - db_data:/var/lib/mysql
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: my_db_root_password
       MYSQL_DATABASE: wordpress
       MYSQL_USER: wordpress
       MYSQL_PASSWORD: my_wordpress_db_password
volumes:
    wordpress_files:
    db_data:

{{< /file >}}

4. From the `my_wordpress` directory, run the following command to start your Docker containers:

    ```
    docker-compose up -d
    ```

5. The Docker containers will take a minute or two to start up WordPress and MySQL. Afterwards, you can visit your Linode's IP address in your web browser, and you should be directed to the WordPress setup form:

    ![WordPress setup screen in the web browser](/docs/assets/docker-compose-wordpress-wizard.png "WordPress setup screen in the web browser")

### Finishing Touches

You can optionally set up a domain for your new WordPress site. Our [DNS Manager Overview](https://linode.com/docs/networking/dns/dns-manager-overview/) guide includes instructions for associating your domain with your Linode's IP address.

Once you set up your DNS records, you should also replace your IP address with your domain in the WordPress Settings screen:

![WordPress settings screen in the web browser](/docs/assets/docker-compose-wordpress-settings-screen.png "WordPress settings screen in the web browser")

### Usage and Maintenance

To run your WordPress application, run these commands which tell Docker Compose to start its containers:

```
cd ~/my_wordpress/
docker-compose up -d
```

You do not need to manually start your containers if you reboot your Linode, as the option `restart: always` was assigned to our services in our `docker-compose.yml` file. This option tells Docker Compose to automatically start your services when the server starts. This is a nice benefit as well, because you don't need to worry about logging into your server if you ever resize it to a different plan or if your Linode's host requires maintenance.

To stop your WordPress application, run these commands:

```
cd ~/my_wordpress/
docker-compose down
```

When a Docker container is stopped, it is also removed, and this is how Docker is designed to work. However, your WordPress files and database data will be preserved, as the docker-compose.yml file was configured to create persistent named volumes for that data.

If you want to remove this data and start over with your WordPress site, you can add the `--volumes` flag to the previous command. **This will permanently delete the WordPress data you've set up so far:**

```
docker-compose down --volumes
```

## Next Steps

More extensive documentation on Docker is available in the [Containers](/docs/applications/containers/) section of the Linode Guides & Tutorials site.