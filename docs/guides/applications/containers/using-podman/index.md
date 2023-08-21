---
slug: using-podman
description: "Podman has risen as a compelling alternative to Docker for deploying and managing containers. Podman stands out for its daemonless architecture, which gives it true rootless containers and heightened security. In this tutorial, find out all you need to get started installing and using Pdoman for running containers."
keywords: ['what is podman','podman docker','podman tutorial']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-26
modified_by:
  name: Nathaniel Stickman
title: "Install Podman for Running Containers"
title_meta: "How to Install Podman for Running Containers"
external_resources:
- '[Podman: Getting Started with Podman](https://podman.io/getting-started/)'
- '[Red Hat Developer: Podman Basics: Resources for Beginners and Experts](https://developers.redhat.com/articles/2022/05/02/podman-basics-resources-beginners-and-experts#)'
- '[Red Hat Developer: Podman and Buildah for Docker Users](https://developers.redhat.com/blog/2019/02/21/podman-and-buildah-for-docker-users#)'
- '[phoenixNAP: Install Podman on Ubuntu](https://phoenixnap.com/kb/install-podman-on-ubuntu)'
authors: ["Nathaniel Stickman"]
tags: ["saas"]
---

Podman is an open source containerization tool. Like Docker, Podman is a solution for creating, running, and managing containers. But Podman goes beyond Docker, using a secure daemonless process to run containers in rootless mode.

For more on what Podman is and how it compares to Docker, you can refer to our guide [Podman vs Docker](/docs/guides/podman-vs-docker/). The guide familiarizes you with the basics of Podman and Docker and compares and contrast the two tools.

In this tutorial, learn everything you need to install and start using Podman on your Linux system. By the end, you can run and manage containers using Podman.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/products/platform/get-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    -   **Debian or Ubuntu:**

            sudo apt update && sudo apt upgrade

    -   **AlmaLinux, CentOS Stream, Fedora, or Rocky Linux:**

            sudo dnf upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install Podman

1.  Podman is available through the default package managers on most Linux distributions.

    -   **AlmaLinux, CentOS Stream, Fedora, or Rocky Linux:**

            sudo dnf install podman

    -   **Debian or Ubuntu:**

            sudo apt install podman

        {{< note respectIndent=false >}}
Podman is only available through the APT package manager for Debian 11 or Ubuntu 20.10 and later.
{{< /note >}}

2.  Afterward, verify your installation by checking the installed Podman version:

        podman -v

    Your output may vary from what is shown here, but you are just looking to see that Podman installed successfully:

    {{< output >}}
podman version 4.1.1
{{< /output >}}

### Configuring Podman for Rootless Usage

Podman operates using root privileges by default - for instance, using the `sudo` preface for commands. However, Podman is also capable of running in rootless mode, an appealing feature when you want limited users to execute container actions securely.

Docker can allow you to run commands as a limited user, but the Docker daemon still runs as root. This is a potential security issue with Docker, one that may allow limited users to execute privileged commands through the Docker daemon.

Podman solves this with the option of a completely rootless setup, where containers operate in a non-root environment. Below you can find the steps to set up your Podman instance for rootless usage.

1.  Install the `slirp4netns` and `fuse-overlayfs` tools to support your rootless Podman operations.

    -   **AlmaLinux, CentOS Stream, Fedora, or Rocky Linux:**

            sudo dnf install slirp4netns fuse-overlayfs

    -   **Debian or Ubuntu:**

            sudo apt install slirp4netns fuse-overlayfs

2.  Add `subuids` and `subgids` ranges for your limited user. This example does so for the user `example-user`. It gives that user a sub-UID and sub-GID of `100000`, each with a range of `65535` IDs:

        sudo usermod --add-subuids 100000-165535 --add-subgids 100000-165535 example-user

With Podman installed, everything is ready for you to start running containers with it. These next sections walk you through the major features of Podman for finding container images and running and managing containers.

## Getting an Image

Podman offers a few methods for procuring container images, which you can follow along with below. These section also give you a couple of images to start with, and which are used in later sections for further examples.

### Searching for Images

Perhaps the most straightforward way to get started with a container is by finding an existing image in a registry. With Podman's `search` command, you can find matching images in any container registries you have set up.

{{< note >}}
Podman may come with some registries configured by default. However, on some systems, it may first be necessary to configure these registries manually. You can do this by opening the `/etc/containers/registries.conf` file with your preferred text editor and adding a line like the following to the end:

    unqualified-search-registries=['registry.access.redhat.com', 'registry.fedoraproject.org', 'docker.io', 'quay.io']

You can replace the registries listed here with ones that you would like to look for container images on.

Podman's GitHub also has a `registries.conf` file [here](https://raw.githubusercontent.com/containers/podman/main/test/registries.conf) that you can use as an initial reference.
{{< /note >}}

This example searches for images matching the term `buildah`:

    podman search buildah

Keep in mind that your matches may differ depending on the registries your Podman instance is configured with:

{{< output >}}
NAME                                                            DESCRIPTION
registry.access.redhat.com/ubi8/buildah                         Containerized version of Buildah
registry.access.redhat.com/ubi9/buildah                         rhcc_registry.access.redhat.com_ubi9/buildah
registry.redhat.io/rhel8/buildah                                Containerized version of Buildah
registry.redhat.io/rhel9/buildah                                rhcc_registry.access.redhat.com_rhel9/builda...
[...]
{{< /output >}}

### Downloading an Image

After searching the registries, you can use Podman to download, or pull, a particular image. This can be accomplished with Podman's `pull` command followed by the name of the container image:

    podman pull buildah

As the search output shows, there may be multiple registries matching a given container image:

{{< output >}}
Resolved "buildah" as an alias (/etc/containers/registries.conf.d/shortnames.conf)
Trying to pull quay.io/buildah/stable:latest...
Getting image source signatures
[...]
{{< /output >}}

But you can also be more specific. You can specify the entire image name, with the registry path, to pull from a specific location.

For instance, this next example pulls the Buildah image from the `docker.io` registry:

    podman pull docker.io/buildah/buildah

As you can see, it skipped the part where it resolves the shortname alias and pulls the Buildah image directly from the specified source:

{{< output >}}
Trying to pull docker.io/buildah/buildah:latest...
Getting image source signatures
[...]
{{< /output >}}

### Building an Image

Like Docker, Podman also gives you the ability to create a container image from a file. Typically, this build process uses the Dockerfile format, though Podman supports the Containerfile format as well.

You can learn more about crafting Dockerfiles in our guide [How to Use a Dockerfile to Build a Docker Image](/docs/guides/how-to-use-dockerfiles/). This guide also includes links to further tutorials with more in-depth coverage of Dockerfiles.

But for now, as an example to see Podman's build capabilities in action, you can use the following Dockerfile:

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

Place these contents in a file named `Dockerfile`. Then, working from the same directory the file is stored in, you can use the following Podman command to build an image from the file:

    podman build -t fedora-http-server .

The `-t` option allows you to give the image a tag, or name - `fedora-http-server` in this case. The `.` at the end of the command specifies the directory in which the Dockerfile can be found, where a `.` represents the current directory.

Keep reading onto the section below titled [Running a Container Image](/docs/guides/using-podman/#running-a-container-image) to see how you can run a container from an image built as shown above.

Podman's `build` command works much like Docker's, but is actually a subset of the build functionality within Buildah. In fact, Podman uses a portion of Buildah's source code to implement its build function.

Buildah offers more features and fine-grained control when it comes to building containers. For that reason, many see Podman and Buildah as complementary tools. Buildah provides a robust tool for crafting container images from both container files (e.g. Dockerfiles) and from scratch. Podman then excels at running and managing the resulting containers.

You can learn more about Buildah, including steps for setup and usage, in our guide [How to Use Buildah to Build OCI Container Images](/docs/guides/using-buildah-oci-images/).

### Listing Local Images

Once you have one or more images locally on your system, you can see them using Podman's `images` command. This gives you a list of images that have been created or downloaded onto your system:

    podman images

Following the two sections above — on downloading and then building container images — you could expect an output similar to:

{{< output >}}
REPOSITORY                         TAG         IMAGE ID      CREATED       SIZE
localhost/fedora-http-server       latest      f6f5a66c8a4d  2 hours ago   328 MB
quay.io/buildah/stable             latest      eef9e8be5fea  2 hours ago  358 MB
registry.fedoraproject.org/fedora  latest      3a66698e6040  2 hours ago  169 MB{{< /output >}}

## Running a Container Image

With images either downloaded or created, you can begin using Podman to run containers.

The process can be relatively straightforward with Podman's `run` command, which just takes the name of the image to run a container from.

Here is an example using the Buildah image downloaded above. This example runs the Buildah image, specifically executing the `buildah` command on the resulting container:

    podman run buildah buildah -v

The `-v` option is included to output the version of the application:

{{< output >}}
buildah version 1.26.2 (image-spec 1.0.2-dev, runtime-spec 1.0.2-dev)
{{< /output >}}

Containers' operations can get more complicated from there, and Podman has plenty of features to support a wide range of needs when it comes to running containers.

Take the `fedora-http-server` example created from a Dockerfile above. This example runs an HTTP server on the container's port `80`. The following command demonstrates how Podman lets you control how that container operates.

The command runs the container, which automatically starts up an HTTP server. The `-p` option given here publishes the container's port `80` to the local machine's port `8080`, while the `--rm` option automatically stops the container when it finishes running — a fitting solution for a quick test.

    podman run -p 8080:80 --rm fedora-http-server

Now, on the machine where the image is running, use a cURL command to verify that the default web page is being served on port `8080`:

    curl localhost:8080

You should see the HTML of the Fedora HTTP Server Test Page:

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

## Managing Containers and Images

Podman prioritizes effectively running and managing containers. As such, it comes with plenty of commands for keeping track of and operating your containers.

These next several sections walk through some of the most useful Podman operations, and can help you get the most out of your containers.

### Listing Containers

Often those working with containers may keep a container or two, sometimes several containers, running in the background.

To keep track of these containers, you can use Podman's `ps` command. This lists the currently running containers on your system.

For instance, if you are in the process of running the `fedora-http-server` container shown above, you can expect something like:

    podman ps

{{< output >}}
CONTAINER ID  IMAGE                                COMMAND               CREATED        STATUS            PORTS                 NAMES
daadb647b880  localhost/fedora-http-server:latest  /usr/sbin/httpd -...  8 seconds ago  Up 8 seconds ago  0.0.0.0:8080->80/tcp  suspicious_goodall
{{< /output >}}

And if you want to list all containers, not just the ones that are currently running, you can add the `-a` option to the command:

    podman ps -a

The output of this command also includes the `buildah` command executed using `podman run` further above:

{{< output >}}
CONTAINER ID  IMAGE                                COMMAND               CREATED             STATUS                     PORTS                 NAMES
db71818eda38  quay.io/buildah/stable:latest        buildah -v            12 minutes ago      Exited (0) 12 minutes ago                        exciting_kowalevski
daadb647b880  localhost/fedora-http-server:latest  /usr/sbin/httpd -...  About a minute ago  Up About a minute ago      0.0.0.0:8080->80/tcp  suspicious_goodall
{{< /output >}}

### Starting and Stopping Containers

Podman can individually control when to stop and start containers, using the `stop` and `start` commands, respectively. Each of these commands takes either the container ID or container name as an argument, both of which you can find using the `ps` command, as shown above.

For example, you can stop the `fedora-http-server` container above with:

    podman stop daadb647b880

Had this container been run without the `--rm` option, which automatically removes the container when it has stopped running, you could start the container back up simply with:

    podman start daadb647b880

For either command, you could substitute the container name for its ID, as so:

    podman stop suspicious_goodall

### Removing a Container

You can manually remove a container using Podman's `rm` command, which, like the `stop` and `start` commands, takes either a container ID or name as an argument.

    podman rm daadb647b880

### Creating an Image from a Container

Podman can render a container into an image using the `commit` command. This can be used to manually create an updated container image after components have been added to, removed from, or modified on a container.

Like other container-related commands, this command takes the container ID or name as an argument. It's also good practice to include an author name along with the commit, via the `--author` option:

    podman commit --author "Example User" daadb647b880

As noted in the section above on creating images with Podman, Buildah tends to offer more features and control when it comes to creating container images. But Podman is certainly capable in many cases and may be enough to fit your given needs.

## Conclusion

Podman offers not just a simple alternative to Docker, but a powerful containerization tool with the weight of secure, rootless operations. And, with this tutorial, you have what you need to start using Podman for running and managing your containers.

Keep learning about effective tools for working with containers through the links on Podman, Buildah, and Dockerfiles provided in the course of this tutorial. Continue sharpening your Podman knowledge through the links provided at the end of this tutorial.
