---
slug: remove-docker-resources
title: "How to Remove Docker Images, Containers, and Volumes"
description: "Looking to remove resources from your Docker instance? Look no further than our guide on how to remove Docker images, containers, and volumes."
keywords: ['docker remove image', 'docker remove container', 'docker remove volume']
tags: ['docker', 'container']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ['Nathaniel Stickman']
published: 2022-02-21
modified_by:
  name: Linode
external_resources:
- '[DigitalOcean: How To Remove Docker Images, Containers, and Volumes](https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes)'
- '[freeCodeCamp: How to Remove Images and Containers in Docker](https://www.freecodecamp.org/news/how-to-remove-images-in-docker/)'
- '[Linuxize: How To Remove Docker Containers, Images, Volumes, and Networks](https://linuxize.com/post/how-to-remove-docker-images-containers-volumes-and-networks/)'
- '[Docker Docs: docker image](https://docs.docker.com/engine/reference/commandline/image/)'
---

Docker containerization can make working with applications and services easier, however complex they may be. But you may want to periodically manage your accumulated Docker resources. Docker takes a conservative approach to "garbage collection," which can leave you with unused Docker resources sitting around, especially in development environments.

Learn in this guide how to clean up your Docker resources. Here, you can see how to remove images, containers, and volumes, as well as unused resources generally.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On **Debian** and **Ubuntu**, use the following command:

        ```command
        sudo apt update && sudo apt upgrade
        ```

    - On **AlmaLinux**, **CentOS** (8 or later), or **Fedora**, use the following command:

        ```command
        sudo dnf upgrade
        ```

1. Follow the steps in our [Installing and Using Docker](/docs/guides/installing-and-using-docker-on-ubuntu-and-debian/) guide to install, set up, and run a Docker instance. You can use the drop-down at the top of the page to select the Linux distribution matching your system.

    Additionally, this guide assumes that you are logged in as a non-root user within the `docker` user group. You can learn how to add a non-root user to this group in the guide above.

    Otherwise, if your user is not in the `docker` group, you need to begin each of the commands given throughout this guide with `sudo`.

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## How to Remove All Dangling or Unused Resources

To start, Docker provides means of removing unused resources wholesale.

Before going on, know that Docker distinguishes two kinds of unused images. First, *dangling* images, which are images that are neither tagged nor associated with a container. Second, *unused* images, which are images that are just not associated with a container.

With that in mind, here are the ways Docker has of removing unused and dangling resources:

- To remove all unused containers and networks and all dangling images, use the following command:

    ```command
    docker system prune
    ```

- To remove all unused images instead of just dangling ones, use the following command:

    ```command
    docker system prune -a
    ```

- To expand the above command to additionally remove all unused volumes, use the following command

    ```command
    docker system prune --volumes
    ```

## How to Remove Images

In this section, learn the commands for removing images, from individual images to unused images to all images.

It can be helpful here to get the list of images currently on your Docker instance. Especially so since some of these commands use image names and/or IDs. You can get a list of images using the following command:

```command
docker image ls -a
```

### Remove Images by Name

To remove an individual image based on its ID, use a command like the one below. Replace `feb5d9fea6a5` with the ID of the image you want to be removed using the following command:

```command
docker rmi feb5d9fea6a5
```

This command does not work for images associated with a container, even when that container has been stopped.

To remove an image that is associated with a container, you need to add the `-f` option for a forced deletion.

```command
docker rmi -f feb5d9fea6a5
```

You can also remove an image by its repository and tag names. This results in the image being untagged.

```command
docker rmi hello-world:latest
```

The command above does not in itself fully remove the image. To ensure that the image is fully removed, you need to remove all tags associated with it. So, if you have the above image tagged with `anotherTag` as well, you need to run the `rmi` command again for `hello-world:anotherTag`.

The `rmi` command can also take multiple arguments. This means that you can remove multiple images simultaneously based on their IDs or repositories and tags.

```command
docker rmi feb5d9fea6a5 dfce7257b7ba
```

### Remove Unused Images

Images that are not tagged and are not associated with at least one container are called *dangling* images. You can get a list of these images using the following command:

```command
docker image ls --filter dangling=true
```

Rather than deleting these images individually, you can do so with a single command:

```command
docker image prune
```

Images that are not associated with a container but may or may not be tagged are considered *unused* rather than dangling. You can extend the command above to remove these images as well using the following command:

```command
docker image prune -a
```

### Remove All Images

Docker does not have a built-in command for removing all images. Instead, you can use the `$` command-line operator to feed Docker a list of images using the following command:

```command
docker rmi $(docker image ls -q)
```

Here, the `$` operator resolves the command `docker image ls` to provide a list of images to the `rmi` command. The `-q` option tells Docker to give a list of image IDs only.

## How to Remove Containers

This section shows you how to remove containers from your Docker instance. It gives you commands for removing containers by ID or name, for removing stopped containers, and even for removing all containers for your instance.

Throughout, you may find it helpful to be able to get a list of your Docker containers, especially when working with container IDs and names. Use the following command to do so:

```command
docker ps
```

The above command does not, however, include stopped containers. To get a list that includes stopped containers, use the following command:

```command
docker ps -a
```

### Remove Containers by Name

Individual containers can be removed either by ID or by name. To remove a container based on its ID, use a command like this one, replacing `8e7fc32ab606` with the container's actual ID.

```command
docker rm 8e7fc32ab606
```

The same command can be used to remove a container based on its name. In this example, replace `reverent_hugle` with the name of the container you are removing.

```command
docker rm reverent_hugle
```

As with the `docker rmi` command covered in the image section above, this command supports multiple arguments.

```command
docker rm 8e7fc32ab606 f56b33a151f2
```

### Remove Stopped Containers

Docker comes with a convenient command for removing all stopped containers using the following command:

```command
docker container prune
```

On the other hand, Docker does not have a ready command for just removing exited containers. Like with removing all images above, you need to use the `$` command-line operator to fetch a list of containers and feed it to Docker.

```command
docker rm $(docker ps --filter status=exited -q)
```

In fact, you can use this construct to remove any set of containers based on a given set of filter conditions.

### Remove All Containers

You can remove all containers using the same method as above, with the `$` command-line operator using the following command:

```command
docker rm $(docker ps -a -q)
```

The `$` resolves the `docker ps` command into a list fed into the `rm` command. Recall from above that the `-a` option makes the `ps` command show all containers, even stopped ones. The `-q` option causes the list to be IDs only, which is necessary for the `rm` command's parsing.

## How to Remove Volumes

In this section, see how you can remove Docker volumes, whether individually, as groups, or in total.

To keep track of your volumes, and to fetch volume names, use this command. It gives you a list of your current Docker volumes.

```command
docker volume ls
```

### Remove Volumes by Name

Named volumes can be removed individually using the volume name, as in:

```command
docker volume rm example-volume
```

Many volumes are named in the process of their creation. However, you may run into some situations where you have unnamed volumes. See the section further below for steps to remove these unnamed volumes.

### Remove Dangling Volumes

In contrast to images, volumes are considered dangling simply when they are not referenced by any container. You can get a list of current dangling volumes using the following command:

```command
docker volume ls --filter dangling=true
```

Then, to remove these unused volumes, use the command below:

```command
docker volume prune
```

### Remove Unnamed Volumes

Some volumes do not have names. Instead, they are managed through their associated containers.

These unnamed volumes can be removed when you remove their associated containers. This is accomplished using the command shown above for removing a container by ID/name. Just add the `-v` option to remove associated unnamed volumes along with the container.

```command
docker rm -v reverent_hugle
```

## Conclusion

In this guide, you have everything you need to delete unused and unwanted resources from your Docker instance. Using these tools, you can more effectively manage your Docker resources and keep dangling resources from piling up.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
