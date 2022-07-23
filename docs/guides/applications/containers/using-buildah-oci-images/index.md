---
slug: using-buildah-oci-images
author:
  name: Linode Community
  email: docs@linode.com
description: "Two to three sentences describing your guide."
og_description: "Two to three sentences describing your guide when shared on social media."
keywords: ['buildah run','what is buildah','install buildah']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-17
modified_by:
  name: Nathaniel Stickman
title: "How to Use Buildah to Build OCI Container Images"
h1_title: "How to Use Buildah to Build OCI Container Images"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[GitHub - Buildah: Buildah Tutorial](https://github.com/containers/buildah/blob/main/docs/tutorials/01-intro.md)'
- '[Red Hat: Building with Buildah - Dockerfiles, Command Line, or Scripts](https://www.redhat.com/sysadmin/building-buildah)'
- '[Red Hat Developer: Best Practices for Running Buildah in a Container](https://developers.redhat.com/blog/2019/08/14/best-practices-for-running-buildah-in-a-container#)'
- '[Computing for Geeks: How To Build OCI & Docker Container Images With Buildah](https://computingforgeeks.com/how-to-build-oci-docker-container-images-with-buildah/)'
---

Buildah is an open-source containerization tool, capable of creating images from scratch or from Dockerfiles. And it follows the Open Container Initiative specifications, making Buildah images versatile and open.

In this tutorial, learn more about Buildah and how to install and start using it. Find steps for creating containers using Dockerfiles and from scratch, and how to render those containers to images.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On Debian and Ubuntu, you can do this with:

            sudo apt update && sudo apt upgrade

    - On AlmaLinux, CentOS (8 or later), or Fedora, use:

            sudo dnf upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## What Is Buildah?

[Buildah](https://buildah.io/) is an open-source tool for building container images that are compliant with the Open Container Initiative (OCI).

The OCI has sought to create an open standard for containerization. To that end, it has defined specifications for container runtimes and images. The open standard also has the goal of helping to secure and make more consistent the operation of operating system virtualization.

Buildah gives you powerful means of creating and maintaining OCI-compliant images. You may be familiar with Dockerfiles, one of the most common formats for container images. Buildah fully supports them and can create images directly from them.

But Buildah can also craft container images from scratch. Buildah allows you to use typical command-line commands for setting up a system to build out the contents of a container. By the end, Buildah can render and export an OCI container from your work on the container file system.

### Buildah vs Docker

Overall, Buildah is similar in functionality to Docker. So what sets it apart? Why use Buildah instead of Docker?

One of Buildah's primary advantages is that it avoids the security risks of the Docker daemon. The Docker daemon runs on a socket with root-level access, and this has the potential to introduce security risks. In fact, the OCI is at least in part a response to this security risk in the Docker daemon.

Buildah, implementing OCI standards, avoids this risk.

With Buildah, the user also has the ability to create container images from scratch. Buildah can mount an empty container and lets the user add only what they need. This feature can be extraordinarily useful when you need a lightweight image.

Buildah also gives the user fine-grain control of images, and specifically image layers. For those looking for more capabilities in their containerization tools, Buildah tends to offer what they need.

However, Buildah is not as useful when it comes to running container images. It can run them, but lacks some of the features to be found in other tools.

For that reason, users often build their OCI images in Buildah and run them using Podman, a tool for running and managing containers.

## How to Install Buildah

You can install Buildah using your Linux distribution's package manager. On RHEL-based Linux distributions, like CentOS and Fedora, you can use:

    sudo dnf install buildah

Buildah is also available through the APT package manager for Debian and Ubuntu, but only with Debian 11 or later and Ubuntu 20.10 or later. On those distributions, you can use:

    sudo apt install buildah

Afterward, you can verify your installation by checking the installed Buildah version using the command below. Your output may vary from what is shown here, but you are just looking to see that Buildah installed successfully:

    buildah -v

{{< output >}}
buildah version 1.26.1 (image-spec 1.0.2-dev, runtime-spec 1.0.2-dev)
{{< /output >}}

### Configuring Buildah for Rootless Usage

By default, Buildah commands are executed with root-user privileges — with the `sudo` preface, for instance. But one appealing feature of Buildah is its ability to run containers and operate in rootless mode. This lets limited users work securely with Buildah.

Docker can allow you to run commands as a limited user, but the Docker daemon still runs as root. This has been found to be a potential security issue with Docker, one that may allow limited users to execute privileged commands through the Docker daemon.

Buildah's rootless mode solves this because it runs containers completely in a non-root environment, without a root daemon. Below, you can see the steps you can take to set up your Buildah instance for rootless usage.

1. Install the `slirp4netns` and `fuse-overlayfs` tools to support your rootless Buildah operations. On RHEL distributions, you can install these tools using:

        sudo dnf install slirp4netns fuse-overlayfs

    On Debian and Ubuntu distributions, you can install these tools using `apt` instead of `dnf` in the above command.

1. Add `subuids` and `subgids` ranges for your limited user. This example does so for the user `example-user`. It gives that user a sub-UID and sub-GID of `100000`, each with a range of `65535` IDs:

        sudo usermod --add-subuids 100000-165535 --add-subgids 100000-165535 example-user

## How to Use Buildah

Buildah is primarily used for creating container images. Like Docker, Buildah can construct containers from Dockerfiles, but Buildah stands out for also allowing you to craft images from scratch.

The next two sections show you how to build container images using each of these methods.

### Creating an Image from a Dockerfile

Dockerfiles provide an approachable way to create containers with Buildah, especially for users familiar with Docker or with existing Dockerfiles.

Buildah is fully capable of interpreting Dockerfile script, making it straightforward to build your Docker container images with Buildah.

This guide uses the example Dockerfile you can see below, provided in one of the official Buildah tutorials. This Dockerfile results in a container with the latest version of Fedora and the Apache HTTP server (`httpd`). It also "exposes" the HTTP server via port `80`.

{{< file "Dockerfile" >}}
# Base on the most recently released Fedora
FROM fedora:latest
MAINTAINER ipbabble email buildahboy@redhat.com # not a real email

# Install updates and httpd
RUN echo "Updating all fedora packages"; dnf -y update; dnf -y clean all
RUN echo "Installing httpd"; dnf -y install httpd && dnf -y clean all

# Expose the default httpd port 80
EXPOSE 80

# Run the httpd
CMD ["/usr/sbin/httpd", "-DFOREGROUND"]
{{< /file >}}

Assuming you are working in the directory where this Dockerfile is located, you can immediately build the container's image using a command like the following. This example names the new image `fedora-http-server`:

    buildah build -t fedora-http-server

{{< output >}}
STEP 1/6: FROM fedora:latest
Resolved "fedora" as an alias (/etc/containers/registries.conf.d/000-shortnames.conf)
Trying to pull registry.fedoraproject.org/fedora:latest...
Getting image source signatures
Copying blob 75f075168a24 done
Copying config 3a66698e60 done
Writing manifest to image destination
Storing signatures
STEP 2/6: MAINTAINER ipbabble email buildahboy@redhat.com # not a real email
STEP 3/6: RUN echo "Updating all fedora packages"; dnf -y update; dnf -y clean all
[...]
{{< /output >}}

And that is it. You can now run the image with a tool like Podman, a tool for working with containers and often used as a compliment to Buildah:

    podman run -p 8080:80 --rm fedora-http-server

The `-p` option "publishes" a given port, here routing the container's port `80` to the local machine's port `8080`. The `--rm` option automatically removes the container when it has finished running, a fitting solution for a quick test like this.

Now you can, on the machine where the image is running, use a cURL command to verify that the default page is being served on port `8080`:

    curl localhost:8080

{{< output >}}
<!doctype html>
<html>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <title>Test Page for the HTTP Server on Fedora</title>
    <style type="text/css">
      /*<![CDATA[*/

      html {
        height: 100%;
        width: 100%;
      }
        body {
[...]
{{< /output >}}

Learn more about Podman in our guide [How to Install Podman for Running Containers](/docs/guides/using-podman-for-containers/).

You can also learn more about crafting Dockerfiles in our guide [How to Use a Dockerfile to Build a Docker Image](/docs/guides/how-to-use-dockerfiles/). This guide also includes links to further tutorials with more in-depth coverage of Dockerfiles.

### Creating an Image from Scratch

As noted above, Buildah stands out for its ability to create container images from scratch. This section walks you through an example of how you can do just that.

The example container that follows starts with an empty container. It then adds Bash and some other core utilities to that container to demonstrate how you can add programs to create a minimal container image.

{{< note >}}
Buildah's commands for working with containers can involve a few keywords, so often these commands are executed using environment variables. So, for instance, to create a new container with Fedora, you may see something like:

    fedoracontainer=$(buildah from fedora)

{{< /note >}}

1. If you are running Buildah in rootless mode, you need to execute `unshare` command before any further commands. This command puts you in a shell within the user namespace. Otherwise, the `buildah mount` command below would not work:

        buildah unshare

    You can exit the user namespace shell at any time using the `exit` command.

1. Create a blank container. This uses Buildah's `scratch` base to initiate a new container:

        scratchcontainer=$(buildah from scratch)

1. Mount the container as a virtual file system:

        scratchmnt=$(buildah mount $scratchcontainer)

1. Install Bash and `coreutils` to the empty container. Replace the `releasever` value below with the version of your RHEL or Fedora distribution:

        dnf install --installroot $scratchmnt --releasever 35 bash coreutils --setopt install_weak_deps=false

1. You can now test Bash on the container. The following command should put you in a Bash shell within the container:

        buildah run $scratchcontainer bash

    You can then exit the shell using:

        exit

1. From here out, you can operate the container from outside of the user namespace initiated with `unshare`. To do so, `exit` the namespace, and replace `$scratchcontainer` in the commands below with `working-container`.

   However, if you have more than one container, the container's name may differ. You can find the container name via the `buildah containers` command.

1. Copy over any files you want on the container.

    This example copies a `example-script.sh` file from the `script-files` subdirectory of the current user's home directory. For a later example showing how to execute a script file on a Buildah container, give this file the following contents:

    {{< file "script-files/example-script.sh" >}}
#!/bin/bash
echo "This is an example script."
    {{< /file >}}

    Then the command below copies that file to the container, storing it in the container's `/usr/bin` directory:

        buildah copy $scratchcontainer ~/script-files/example-script.sh /usr/bin

    You can verify the file's delivery by running the `ls` command on the container for the `/usr/bin` directory:

        buildah run $scratchcontainer ls /usr/bin

    {{< output >}}
[...]
example-script.sh
[...]
    {{< /output >}}

1. Once you are satisfied with the container, you can commit the change to an image:

        buildah commit $scratchcontainer bash-core-image

    {{< output >}}
Getting image source signatures
Copying blob a0282af9505e done
Copying config 9ea7958840 done
Writing manifest to image destination
Storing signatures
9ea79588405b48ff7b0572438a81a888c2eb25d95e6526b75b1020108ac11c10
    {{< /output >}}

1. You can now unmount and remove the container:

        buildah unmount $scratchcontainer
        buildah rm $scratchcontainer

### Managing Images and Containers

Buildah is oriented around creating container images, but it has a few features for reviewing available containers and images. Here is a brief list of the associated commands for these features.

- To see a list of images built with your Buildah instance, run the following command:

        buildah images

    If you followed along for the sections above on creating Buildah images, you may have an image listing like this:

    {{< output >}}
REPOSITORY                  TAG      IMAGE ID       CREATED              SIZE
localhost/fedora-http-server        latest   c313b363840d   8 minutes ago    314 MB
localhost/bash-core-image           latest   9ea79588405b   20 minutes ago   108 MB
registry.fedoraproject.org/fedora   latest   3a66698e6040   2 months ago     169 MB    {{< /output >}}

- To list containers currently running under Buildah, use the following command:

        buildah containers

    Should you use this command while the container is still running from the section above on building an image from scratch, you may get an output like:

    {{< output >}}
CONTAINER ID  BUILDER  IMAGE ID     IMAGE NAME                       CONTAINER NAME
68a1cc02025d     *                  scratch                          working-container
    {{< /output >}}

- You can get the details of a particular image using a command like the following one, replacing `9ea79588405b` with your image's ID. You can get your image's ID when the image is built or from the `buildah images` command show above:

        buildah inspect 9ea79588405b

    The image details actually consist of the JSON document that fully represents the image's contents. All container images are just that — JSON documents with the instructions for building their corresponding containers.

    Here is an example of the first portion of a container image JSON resulting from the section above on creating an image from scratch:

    {{< output >}}
{
    "Type": "buildah 0.0.1",
    "FromImage": "localhost/bash-core-image:latest",
    "FromImageID": "9ea79588405b48ff7b0572438a81a888c2eb25d95e6526b75b1020108ac11c10",
    "FromImageDigest": "sha256:beee0e0603e62647addab15341f1a52361a9684934d8d6ecbe1571fabd083dca",
    "Config": "{\"created\":\"2022-07-20T17:34:55.16639723Z\",\"architecture\":\"amd64\",\"os\":\"linux\",\"config\":{\"Labels\":{\"io.buildah.version\":\"1.26.1\"}},\"rootfs\":{\"type\":\"layers\",\"diff_ids\":[\"sha256:a0282af9505ed0545c7fb82e1408e1b130cad13a9c3393870c7c4a0d5cf06a62\"]},\"history\":[{\"created\":\"2022-07-20T17:34:55.72288433Z\",\"created_by\":\"/bin/sh\"}]}",
    "Manifest": "{\"schemaVersion\":2,\"mediaType\":\"application/vnd.oci.image.manifest.v1+json\",\"config\":{\"mediaType\":\"application/vnd.oci.image.config.v1+json\",\"digest\":\"sha256:9ea79588405b48ff7b0572438a81a888c2eb25d95e6526b75b1020108ac11c10\",\"size\":324},\"layers\":[{\"mediaType\":\"application/vnd.oci.image.layer.v1.tar\",\"digest\":\"sha256:a0282af9505ed0545c7fb82e1408e1b130cad13a9c3393870c7c4a0d5cf06a62\",\"size\":108421632}],\"annotations\":{\"org.opencontainers.image.base.digest\":\"\",\"org.opencontainers.image.base.name\":\"\"}}",
    "Container": "",
    "ContainerID": "",
    "MountPoint": "",
    "ProcessLabel": "",
    "MountLabel": "",
    "ImageAnnotations": {
        "org.opencontainers.image.base.digest": "",
        "org.opencontainers.image.base.name": ""
    },
[...]
    {{< /output >}}

## Conclusion

Buildah gives you a clean and deep tool for crafting container images — more than just an alternative to Docker, but a containerization tool for secure and open container images. And with this tutorial you have everything you need to get started building your own images and using Buildah to the utmost.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
