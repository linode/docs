---
slug: using-buildah-oci-images
description: "Buildah is a powerful open-source tool for creating containers and container images. Whether you want to create containers for Dockerfiles and Containerfiles or entirely from scratch, Buildah provides a robust set of features to carry you through. Learn all about Buildah and how to get started using it in this tutorial."
keywords: ['buildah run','what is buildah','install buildah']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-26
modified_by:
  name: Nathaniel Stickman
title: "Use Buildah to Build OCI Container Images"
title_meta: "How to Use Buildah to Build OCI Container Images"
external_resources:
- '[GitHub - Buildah: Buildah Tutorial](https://github.com/containers/buildah/blob/main/docs/tutorials/01-intro.md)'
- '[Red Hat: Building with Buildah - Dockerfiles, Command Line, or Scripts](https://www.redhat.com/sysadmin/building-buildah)'
- '[Red Hat Developer: Best Practices for Running Buildah in a Container](https://developers.redhat.com/blog/2019/08/14/best-practices-for-running-buildah-in-a-container#)'
- '[Computing for Geeks: How To Build OCI & Docker Container Images With Buildah](https://computingforgeeks.com/how-to-build-oci-docker-container-images-with-buildah/)'
authors: ["Nathaniel Stickman"]
tags: ["saas"]
---

Buildah is an open source containerization tool capable of creating images from scratch, Dockerfiles, or Containerfiles. It also follows the Open Container Initiative (OCI) specifications, making Buildah images both versatile and open.

Learn how to install and start using Buildah in this tutorial. Below, find steps for creating containers and rendering those containers to images.

## Before You Begin

1.  Familiarize yourself with our [Getting Started with Linode](/docs/products/platform/get-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1.  This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1.  Update your system.

    -   **AlmaLinux**, **CentOS Stream**, **Fedora**, or **Rocky Linux**:

            sudo dnf upgrade

    -   **Ubuntu**:

            sudo apt update && sudo apt upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Is Buildah?

[Buildah](https://buildah.io/) is an open source tool for building container images that are compliant with the OCI.

The OCI seeks to create an open standard for containerization. To that end, it defines specifications for container runtimes and images. Another goal of the OCI is to help secure and streamline operating system virtualization.

Buildah provides powerful tools to create and maintain OCI-compliant images. You may be familiar with Dockerfiles, one of the most common formats for container images. Buildah fully supports them, and can create images directly from them.

But Buildah can also craft container images from scratch. Buildah allows you to use the command line to build up the container from a complete blank slate, giving it only the contents you need. Buildah can then render and export an OCI container image from your work.

### Buildah vs Docker

Overall, Buildah is similar in functionality to Docker. So what sets it apart? Why use Buildah instead of Docker?

One of Buildah's primary advantages is it avoids the security risks of the Docker daemon. The Docker daemon runs on a socket with root-level access, and this has the potential to introduce security risks. Buildah avoids this risk by running without a daemon, allowing containers to be truly rootless.

With Buildah, the user also has the ability to create container images from scratch. Buildah can mount an empty container and let the user add only what they need. This feature can be extraordinarily useful when you need a lightweight image.

Buildah also gives the user precise control of images, and specifically image layers. For those wanting more capabilities in their containerization tools, Buildah tends to offer what they need.

However, Buildah is not as useful when it comes to running and deploying container images. It can run them, but lacks some of the features to be found in other tools. Instead, Buildah puts the vast majority of its emphasis on creating containers and building container images.

For that reason, users often build their OCI images in Buildah and run them using Podman, a tool for running and managing containers. You can learn more about Podman in our guide [Podman vs Docker: Comparing the Two Containerization Tools](/docs/guides/podman-vs-docker/).

## How to Install Buildah

1.  Install Buildah using your distribution's package manager.

    -   **AlmaLinux**, **CentOS Stream** (8 or later), **Fedora**, or **Rocky Linux**:

            sudo dnf install buildah

    -   **Ubuntu** (20.10 or later):

            sudo apt install buildah

2.  Verify your installation by checking the installed Buildah version using the command below:

        buildah -v

    Your output may vary from what is shown here, but you are just looking to see that Buildah installed successfully:

    {{< output >}}
buildah version 1.26.1 (image-spec 1.0.2-dev, runtime-spec 1.0.2-dev)
{{< /output >}}

### Configuring Buildah for Rootless Usage

By default, Buildah commands are executed with root privileges, prefaced with the `sudo` command. However, one of the most appealing features of Buildah is its ability to run containers in rootless mode. This lets limited users work securely with Buildah.

While Docker also allows you to run commands as a limited user, the Docker daemon still runs as root. This is a potential security issue with Docker, one that may allow limited users to execute privileged commands through the daemon.

Buildah's rootless mode solves this because it runs containers completely in a non-root environment, without a root daemon. Find the steps needed to set up your Buildah instance for rootless usage below.

1.  Install the `slirp4netns` and `fuse-overlayfs` tools to support your rootless Buildah operations.

    -   **AlmaLinux**, **CentOS Stream**, **Fedora**, or **Rocky Linux**:

            sudo dnf install slirp4netns fuse-overlayfs

    -   **Ubuntu**:

            sudo apt install slirp4netns fuse-overlayfs

2.  Add `subuids` and `subgids` ranges for your limited user. This example does so for the user `example_user`. It gives that user a sub-UID and sub-GID of `100000`, each with a range of `65535` IDs:

        sudo usermod --add-subuids 100000-165535 --add-subgids 100000-165535 example_user

## How to Use Buildah

Buildah is primarily used for creating container images. Like Docker, Buildah can construct containers from Dockerfiles, but Buildah stands out for also allowing you to craft images from scratch.

The next two sections show you how to build container images using each of these methods.

### Creating an Image from a Dockerfile

Dockerfiles provide an approachable way to create containers with Buildah, especially for users already familiar with Docker or Dockerfiles.

Buildah is fully capable of interpreting Dockerfile script, making it straightforward to build your Docker container images with Buildah.

This guide uses an example Dockerfile provided in one of the official Buildah tutorials. This Dockerfile results in a container with the latest version of Fedora and the Apache HTTP server (`httpd`). It also "exposes" the HTTP server via port `80`.

1.  Create a new file named `Dockerfile` in your user's home directory:

        nano Dockerfile

1.  Fill it with the following contents:

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

1.  Press **CTRL+X** to exit, **Y** to save, and **Enter** to quit `nano`.

    Assuming you are still in the directory where this Dockerfile is located (your user's home directory), you can immediately build the container's image.

1.  This example names the new image `fedora-http-server`:

        buildah build -t fedora-http-server

    The output should look like the following:

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

    Now you can now run the image with Podman, a tool for working with containers which is often used as a compliment to Buildah.

1.  First, install Podman:

    -   **AlmaLinux**, **CentOS Stream**, **Fedora**, or **Rocky Linux**:

            sudo dnf install podman

    -   **Ubuntu**:

            sudo apt install podman

1.  In the command below, the `-p` option "publishes" a given port, here routing the container's port `80` to the local machine's port `8080`. The `--rm` option automatically removes the container when it has finished running, a fitting solution for a quick test like this.

        podman run -p 8080:80 --rm fedora-http-server

1.  Now you can open another Terminal session on the machine where the image is running, and use a cURL command to verify the default page is being served on port `8080`:

        curl localhost:8080

    You should see the raw HTML of the Fedora HTTP Server test page as output:

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

1.  When done, stop the container, but first, determine your container's ID or name:

        podman ps

    You should see an out put like this:

    {{< output >}}
CONTAINER ID  IMAGE                                COMMAND               CREATED        STATUS            PORTS                 NAMES
daadb647b880  localhost/fedora-http-server:latest  /usr/sbin/httpd -...  8 seconds ago  Up 8 seconds ago  0.0.0.0:8080->80/tcp  suspicious_goodall
{{< /output >}}

1.  Now stop the container. Replace `container-name-or-id` with your container name or ID:

        podman stop container-name-or-id

    Since we set this example container to automatically remove when done with the `--rm` flag, stopping it also removes it.

1.  You can now logout, close the second Terminal session, and return to the original Terminal:

        exit

Learn more about Podman in our guide [How to Install Podman for Running Containers](/docs/guides/using-podman/).

You can also learn more about crafting Dockerfiles in our guide [How to Use a Dockerfile to Build a Docker Image](/docs/guides/how-to-use-dockerfiles/). This guide also includes links to further tutorials with more in-depth coverage of Dockerfiles.

### Creating an Image from Scratch

As noted above, Buildah stands out for its ability to create container images from scratch. This section walks you through an example of how you can do just that.

{{< note >}}
Buildah's commands for working with containers can involve a few keywords, so often these commands are executed using environment variables. So, for instance, to create a new container with Fedora, you may see something like:

    fedoracontainer=$(buildah from fedora)

Learn more about how environment variables work in our guide [How to Use and Set Environment Variables](/docs/guides/how-to-set-linux-environment-variables/).
{{< /note >}}

The example container that follows starts with an empty container. It then adds Bash and some other core utilities to that container to demonstrate how you can add programs to create a minimal container image.

{{< note >}}
This section assumes you want to run Buildah in rootless mode, being its major draw versus Docker. Unfortunately, the Ubuntu package manager, APT, presents issues with installing packages onto a non-root container. So the instructions that follow are for RHEL-derived distributions such as AlmaLinux, CentOS Stream, Fedora, and Rocky Linux.

If you want to run Buildah under Ubuntu in regular root mode, simply preface each `buildah` command that follows with `sudo`.
{{< /note >}}

For rootless operation, you need to execute the `unshare` command first. This command puts you in a shell within the user namespace. The next several steps presume your are in the user namespace shell until noted, otherwise the `buildah mount` command below will fail.

1.  Enter the user namespace shell:

        buildah unshare

1.  Create a blank container using Buildah's `scratch` base:

        scratchcontainer=$(buildah from scratch)

1.  Mount the container as a virtual file system:

        scratchmnt=$(buildah mount $scratchcontainer)

1.  Install Bash and `coreutils` to the empty container.

    -   **AlmaLinux**, **CentOS Stream**, **Fedora**, or **Rocky Linux**:

        Replace the value `36` below with the version of your RHEL-derived distribution:

            dnf install --installroot $scratchmnt --releasever 36 bash coreutils --setopt install_weak_deps=false

    -   **Debian** or **Ubuntu**:

        Replace the value `bullseye` below with the codename of your Debian-based distribution:

            sudo apt install debootstrap
            sudo debootstrap bullseye $scratchmnt

1.  You can now test Bash on the container. The following command puts you in a Bash shell within the container:

        buildah run $scratchcontainer bash

1.  You can then exit the Bash shell using:

        exit

1.  You can now safely operate the container from outside of the user namespace shell initiated with `unshare`:

        exit

    From here on out, we replace `$scratchcontainer` with the container's name, which should be `working-container`. However, if you have more than one container, the container's name may differ. You can verify the container name via the `buildah containers` command.

1.  Now let's recreate the test script file. From your user's home directory, create the `script-files` folder and the `example-script.sh` file in the `script-files` folder:

        mkdir script-files
        nano script-files/example-script.sh

    Give it the following contents:

    {{< file "script-files/example-script.sh" >}}
#!/bin/bash
echo "This is an example script."
{{< /file >}}

    When done, press **CTRL+X** to exit, **Y** to save, and **Enter** to quit.

1.  The command below copies that file to the container's `/usr/bin` directory:

        buildah copy working-container ~/script-files/example-script.sh /usr/bin

1.  Verify the file's delivery by running the `ls` command on the container for the `/usr/bin` directory:

        buildah run working-container ls /usr/bin

    Your `example-script.sh` file should be among the listed files:

    {{< output >}}
[...]
example-script.sh
[...]
{{< /output >}}

1.  For a working example of how to execute scripts on a Buildah container, give this file executable permissions:

        buildah run working-container chmod +x /usr/bin/example-script.sh

1.  You can now run the script via the `run` command:

        buildah run working-container /usr/bin/example-script.sh

    Your output should be identical to the following:

    {{< output >}}
This is an example script.
{{< /output >}}

1.  Once you are satisfied with the container, you can commit the change to an image:

        buildah commit working-container bash-core-image

    Your output should look something like this:

    {{< output >}}
Getting image source signatures
Copying blob a0282af9505e done
Copying config 9ea7958840 done
Writing manifest to image destination
Storing signatures
9ea79588405b48ff7b0572438a81a888c2eb25d95e6526b75b1020108ac11c10
{{< /output >}}

1.  You can now unmount and remove the container:

        buildah unmount working-container
        buildah rm working-container

### Managing Images and Containers

Buildah is oriented towards creating container images, but it does have a few features for reviewing available containers and images. Here's a brief list of the associated commands for these features.

-   To see a list of images built with your Buildah instance, run the following command:

        buildah images

    If you followed along for the sections above on creating Buildah images, you may have an image listing like this:

    {{< output >}}
REPOSITORY                  TAG      IMAGE ID       CREATED              SIZE
localhost/fedora-http-server        latest   c313b363840d   8 minutes ago    314 MB
localhost/bash-core-image           latest   9ea79588405b   20 minutes ago   108 MB
registry.fedoraproject.org/fedora   latest   3a66698e6040   2 months ago     169 MB    {{< /output >}}

-   To list containers currently running under Buildah, use the following command:

        buildah containers

    Should you use this command while the container is still running from the section above on building an image from scratch, you may get an output like:

    {{< output >}}
CONTAINER ID  BUILDER  IMAGE ID     IMAGE NAME                       CONTAINER NAME
68a1cc02025d     *                  scratch                          working-container
    {{< /output >}}

-   You can get the details of a particular image using a command like the following one, replacing `9ea79588405b` with your image's ID. You can get your image's ID when the image is built or from the `buildah images` command show above:

        buildah inspect 9ea79588405b

    The image details actually consist of the JSON document that fully represents the image's contents. All container images are just that: JSON documents with the instructions for building their corresponding containers.

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

Buildah gives you a simple yet robust tool for crafting container images. It's more than just an alternative to Docker. Buildah is a containerization tool for securely creating open containers and container images. With this tutorial, you have everything you need to get started building your own images and using Buildah to the utmost.
