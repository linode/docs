---
slug: understanding-docker-volumes
author:
  name: Linode Community
  email: docs@linode.com
description: 'An explanation of Docker volumes, their use, and how to mount volumes and host system directories within a container using CentOS 7 on a Linode for the example.'
keywords: ["docker", "volume", "docker volume", "docker volumes", "docker container", "docker containers", "docker volume", "docker volumes"]
tags: ["volume","docker"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-17
modified_by:
  name: Linode
title: "Understanding Docker Volumes"
h1_title: "Understanding Docker Volumes."
contributor:
external_resources:
- '[Use volumes at Docker Docs](https://docs.docker.com/storage/volumes/)'
- '[Troubleshoot volume errors at Docker Docs](https://docs.docker.com/storage/troubleshooting_volume_errors/)'
---
Docker uses Docker Volumes to create data persistence when working in Docker Containers. Think of them as an external hard drive to the basic computer system a Docker Container will provide. The Docker Volume will not increase the Docker Image size, as it's separate from the image itself. And, as the Docker Volume is stored on the host and independent of a container or image, it can be mounted in different containers as necessary.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and have a Linode (or other systems) running Docker.

2.  This guide assumes you are comfortable with the *command-line interface* (CLI) on a Unix-like system and working with programs through it.

3.  This guide assumes you have created Docker Images and containers to connect a volume to.

4.  Update your system with the package manager it uses.

## How to Create a Docker Volume

To start understanding Docker Volumes, you'll need a volume to work on.

1.  At the command prompt, create a volume by entering the following command (this example will create a Docker volume with the name “example_volume”):

        docker volume create example volume
    The output will list the name of the volume and take you back to the command prompt:
{{< output >}}
[mumbly@linode ~]$ docker volume create example_volume
example_volume
[mumbly@linode ~]$
{{< /output >}}

2.  Verify the volume has been created by entering the following command:

        docker volume list
    The output should look like this:
{{< output >}}
[mumbly@linode ~]$ docker volume list
DRIVER    VOLUME NAME
local     example_volume
[mumbly@linode ~]$
{{< /output >}}

### Inspecting a Docker Volume

If you want to look at more details about a volume, you can use the `docker volume inspect` command:

        docker volume inspect example_volume

The output will look something like this:

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

## How to Mount a Docker Volume to a Docker Container

For a container's data to persist, you need to have a Docker Volume mounted, which happens using the `--mount flag` in the `docker run` command. Such as:

    docker run --mount source=[volume_name],destination=[path_in_container] [docker_image]

Using our example volume with an Ubuntu image, we could enter this example command:

    docker run -it --name=example --mount source=example_volume,destination=/example_volume ubuntu

This command runs the image, mounts the volume, and logs the user in as root on the Ubuntu image. Once in as root, you can verify the "example_volume" is mounted with just `ls`. The output for all of this should look something like this:

{{< output >}}
[mumbly@linode ~]$ docker run -it --name=example --mount source=example_volume,destination=/example_volume ubuntu
root@b64eb2eafcdf:/# ls
bin   dev  example_volume  lib    lib64   media  opt   root  sbin  sys  usr
boot  etc  home            lib32  libx32  mnt    proc  run   srv   tmp  var
root@b64eb2eafcdf:/#
{{< /output >}}

## How to Copy and Share Files Between Containers

Docker Volumes also allow sharing between containers.

To share a file between containers:

1.  Enter the following command to mount the volume:

        docker run -it --name=example --mount source=example_volume,destination=/example_volume ubuntu

2.  Change the directory to the `example_data` directory:

        cd example_data

3.  Create a test file in the volume by entering the following `touch` command:

        touch example_file.txt

4.  Then exit from this container:

        exit

5.  We need a second container, so run an image (we'll use the Debian image in the example) and attach the volume to it by entering the following:

        docker run -it --name=example_2 --mount source=example_volume,destination=/example_volume debian

8.  Then, in the "example_2" container, enter:

        change directoriescd example_volume

9.  Enter `ls` to see the file:

        ls

## How to Mount a Directory from the Host System in a Container

Say you want to mount a directory from your host system as a volume within the container. If you go to the directory you want (for this example we'll use the user's home directory), you just need to enter: `docker run -v "$(pwd)":` with the name of the volume and the name of the Docker Image following. So, to mount the user's home directory with the name "external" in an example Ubuntu container:

1.  Go to your home directory in the terminal.

2.  Enter the following command:

        docker run --rm -it -v $(pwd):/external ubuntu

3.  The CLI will switch to the container's command prompt. Enter:

        ls
    The output should look like this:
    {{< output >}}
root@a838e1d52c4b:/# ls
bin  boot  dev  etc  external lib  lib32  lib64  libx32  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
root@a838e1d52c4b:/#
{{< /output >}}

Mounting directories within the container will then give you easy access from your host system.

## Further Reading

There's a great deal more to Docker Volumes than we can go into here, and everyone's use case will be different. However, two great places to review more about this are at Docker's Docs site itself:

-   '[Use volumes at Docker Docs](https://docs.docker.com/storage/volumes/)'

-   '[Troubleshoot volume errors at Docker Docs](https://docs.docker.com/storage/troubleshooting_volume_errors/)'