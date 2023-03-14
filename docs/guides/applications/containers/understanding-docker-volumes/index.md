---
slug: understanding-docker-volumes
description: 'An explanation of Docker volumes, their use, and how to mount volumes and host system directories within a container.'
keywords: ["docker", "volume", "docker volume", "docker volumes", "docker container", "docker containers", "docker volume", "docker volumes"]
tags: ["volume","docker"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-13
modified_by:
  name: Linode
title: "Understanding Docker Volumes"
external_resources:
- '[Use volumes at Docker Docs](https://docs.docker.com/storage/volumes/)'
- '[Troubleshoot volume errors at Docker Docs](https://docs.docker.com/storage/troubleshooting_volume_errors/)'
authors: ["Linode"]
---

Files (and other data) stored within a Docker container does not persist if the container is deleted. To overcome this, Docker *volumes* and *bind mounts* can be used. This guide discusses using [Docker volumes](https://docs.docker.com/storage/volumes/) as a way to store persistent data. Think of volumes as an external hard drive; if the internal hard drive is erased, the external hard drive still retain its own data. Volumes are stored on the host and independent of any container or image. They can be mounted to different containers as needed and, since volumes are separate from the image, they do not increase the image size.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  Install Docker on your system.

1.  This guide assumes you are comfortable using the Linux command-line. See [Using the terminal](/docs/guides/using-the-terminal/).

1.  This guide assumes you have a basic understanding of Docker. In addition, you should have already installed Docker on your server and deployed a Docker image. See [An Introduction to Docker
](/docs/guides/introduction-to-docker/).

## Creating a Docker Volume

To start understanding Docker Volumes, you'll need a volume to work on.

1.  Log in to your Linode (or other Linux server) through either [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/).

1.  Create a volume by entering the following command, replacing *example_volume* with the label for your volume.

        docker volume create example_volume

2.  Verify the volume has been created.

        docker volume list

    The output should look like this:
{{< output >}}
[mumbly@linode ~]$ docker volume list
DRIVER    VOLUME NAME
local     example_volume
[mumbly@linode ~]$
{{< /output >}}

## Inspecting a Docker Volume

If you want to look at more details about a volume, you can use the `docker volume inspect` command:

    docker volume inspect example_volume

The output should be similar to the following:

{{< output >}}
[mumbly@linode ~]$ docker volume inspect example_volume
[
    {
        "CreatedAt": "2021-05-19T15:27:27Z",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/example_volume/_data",
        "Name": "example_volume",
        "Options": {},
        "Scope": "local"
    }
]
[mumbly@linode ~]$
{{< /output >}}

## Mounting a Docker Volume to a Container

For a container's data to persist, you need to have a Docker Volume mounted using the `--mount flag` in the `docker run` command. Replace *[volume_name]* with the name of your volume, *[path]* with the absolute path you wish to mount the volume to within the container, and *[docker_image]* with the name of your image.

    docker run --mount source=[volume_name],destination=[path] [docker_image]


As an example, the following command mounts the volume named *example_volume* to the path `/example_volume` inside a container using the `ubuntu` image.

    docker run -it --name=example --mount source=example_volume,destination=/example_volume ubuntu

This command runs the image, mounts the volume, and logs the user in as root on the Ubuntu image. Once in as root, you can verify the "example_volume" is mounted with just `ls`. The output for all of this should look something like this:

{{< output >}}
[mumbly@linode ~]$ docker run -it --name=example --mount source=example_volume,destination=/example_volume ubuntu
root@b64eb2eafcdf:/# ls
bin   dev  example_volume  lib    lib64   media  opt   root  sbin  sys  usr
boot  etc  home            lib32  libx32  mnt    proc  run   srv   tmp  var
root@b64eb2eafcdf:/#
{{< /output >}}

## Copying and Sharing Files Between Containers

Docker Volumes also allow sharing between containers.

1.  Mount the volume according to the instructions within [Mounting a Docker Volume to a Container](#mounting-a-docker-volume-to-a-container). Here is the example used previously:

        docker run -it --name=example --mount source=example_volume,destination=/example_volume ubuntu

2.  Change the directory to the `example_data` directory.

        cd example_data

3.  Create a test file in the volume by entering the following `touch` command.

        touch example_file.txt

4.  Then exit the container.

        exit

5.  Now run another docker image with the same volume mounted. The `debian` image is used in the example below.

        docker run -it --name=example_2 --mount source=example_volume,destination=/example_volume debian

8. Within the new container (called "example_2" if using a command similar to the one above) container, navigate to the volume's directory.

        cd example_volume

9.  Enter `ls` to see the file.

        ls

## Mounting a Directory from Your Linode to a Container

Instead of creating a new volume, you can also mount a directory from your Linode (or other system) to a Docker container. This is accomplished through [bind mounts](https://docs.docker.com/storage/bind-mounts/) and is helpful when you want to store and access your a container's files directly from your system. Compared to volumes, bind mounts have limited functionality.


1.  Log in to your Linode (or other Linux server) through either [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/).

1.  Use the following command to run Docker, replacing *[local-directory]* with the absolute path to the directory within your Linode that you'd like to mount (use `$(pwd)` to mount the current directory). Then replace *[mount-directory]* with the absolute path on your container where you wish to access the local files and replace *[image]* with the Docker image you wish to use.

        docker run --rm -it -v [local-directory]:[mount-directory] [image]

3.  You are automatically logged in to the container. Navigate to your mount directory and view the files.

        ls

    You should see any files you have stored within the local directory.

## Further Reading

There's a great deal more to Docker Volumes than we can go into here, and everyone's use case will be different. However, two great places to review more about this are at Docker's Docs site itself:

-   [Use volumes at Docker Docs](https://docs.docker.com/storage/volumes/)

-   [Troubleshoot volume errors at Docker Docs](https://docs.docker.com/storage/troubleshooting_volume_errors/)