---
author:
  name: Bob Strecansky
  email: bob.strecansky@gmail.com
description: 'This guide describes how to effectively use Docker in production.'
keywords: 'docker,production,compose,deployment'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: Monday, October 23rd, 2017
modified: Wednesday, November 8th, 2017
modified_by:
  name Bob Strecansky
title: 'How to Use Docker Effectively in Production'
contributor:
  name: Bob Strecansky
  link: https://twitter.com/bobstrecansky
  external_resources:
- '[Docker](https://www.docker.com/)'
---

{: .note}
> The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Disclaimer

This guide uses well-tested packages for Production (Ubuntu 16.04 LTS for the Docker Host, Docker Community Edition as the Docker package, and Ubuntu 16.04 LTS for the base container).  Integrators may need to tweak this to fit their production usage; however, using packages that get distributed often for the base operating system and docker containers is helpful in a myriad of ways - namely these package choices are well supported from a security perspective, they tend to work together with relative ease, and it is much easier to troubleshoot with packages that the linux community is familiar with.

##Initial Steps

1.  Install Docker using the [Linode Docker Installation Guide](https://www.linode.com/docs/applications/containers/how-to-install-docker-and-pull-images-for-container-deployment) on the hosts that you're planning on running Docker on.  It is prudent that you use a consistent docker version across the nodes that are going to run your Docker containers (the guide listed above uses Docker CE (Community Edition) which is a good choice from a stability perspective).

2.  Determine a base Docker image strategy that you'd like to use for your web application or site.  If you determine that you'd like to use the latest Ubuntu LTS version, then follow along below with Using the Latest Ubuntu LTS Image.  If you want to make sure that you have a deployment that maintains the same OS underneath, you can use the Creating a Private Docker Registry section below.  This decision is a tradeoff - If the website or web application you are developing is unlikely to stop functioning with an OS upgrade, then it's advantageous to utilize an image that is maintained by Ubuntu, both from a performance and a security perspective.  If you decide that you'd like to maintain your own underlying operating system, make sure you often update the base image that you choose so that you get the latest (security patched) versions of OS level packages.

3.  Validate that you're running the current LTS kernel on your platform, this will ensure that you have as few driver issues as possible.  At the time of writing, Ubuntu 16.04 is using ai4.10.0-37-generic #41~16.04.1-Ubuntu SMP kernel.  You can find this with:

`uname -a`

## Using the Latest Ubuntu LTS Image:

`docker pull ubuntu`

## Creating a Private Docker Registry:

Create a [Private Docker Registry](https://docs.docker.com/registry/deploying/) in order to maintain your own private docker container images.  You'll want to configure a registry to create a baseline docker image.  This can be helpful in the future when you build docker containers based off of your base image.

## Removing Old Docker Images

Determining a process to clean old Docker images is important for system health, as the old containers tend to take up lots of disk space with no utilization.  Sometimes a simple cron running the bash statement below is sufficient:

`docker images -q -a | xargs --no-run-if-empty docker rmi`

You can also prune docker images using the `docker image prune` command.  You can also use the filter command to determine a timeframe for removal.  A common practice is to prune images that are greater than a day old:

` docker image prune -a --filter "until=24h"`

Full details can be found [here](https://docs.docker.com/engine/admin/pruning/)

## Only Use Official Repositories

You should only use official Docker Repositories to create your base images, regardless of whether or not your going to utilize your own base image.  You can peruse through the official repositories in the [Docker Repository Hub](https://hub.docker.com/explore/)

## Creating a New Dockerfile

Dockerfiles are the defacto way to automate installation and configuration of a docker image and it's dependencies.  You can read more about Dockerfiles in the [How To Use Dockerfiles](https://www.linode.com/docs/applications/containers/how-to-use-dockerfiles) Linode article.  Docker has also written a [Best Practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/#sort-multi-line-arguments) article on Dockerfile best practices.  When you create a new Dockerfile, it is advantageous to utilize the base image that you created in the initial steps of this guide.  Doing so lets your organization upgrade the base image, which in turn can help to build new containers using the new base image strategy.  [Labels](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/#label) can also be helpful in organization, licensing, automation, etcetera.  Having a common labeling strategy can help to organize your containers in a meaningful way, both from an organizational and automation perspective.

## Building Your Dockerfile

To build a Dockerfile you can designate a build filepath and add tags:

`docker build -f /path/to/a/Dockerfile -t mycompany/myapp:latest .`

Adding tags should be part of your Docker release process.  Many companies use git hashes as the tag of their Docker images, in order to be able to quickly reference which git commit is related to a particluar Docker container.  Docker tagging should not be a burden - it should be a methodology to help your company determine the best manner for knowing what is exactly in your production Docker images.

## Limiting Access to Filesystems

If you determine that your container can run without writing any state to a shared volume, you can run the container with read only access:

`docker run --read-only mycompany/myapp:latest`

To perform this same action with a shared volume:

`docker run -v /my/data:/data:ro`

## Limiting Container Resources

Define maximum amounts of memory:

`-m 4g or --memory=4g # Designate a maximum of 4GB for the given container`

Define maximum amounts of CPU:

`-cpus=1.5 # Designate a maximum of 1.5 CPUs for the given container`

Many more CPU and Memory contstraints can be found on the [Resource Constraints Page](https://docs.docker.com/engine/admin/resource_constraints/)

## Data Management

Using [Shared Volumes](https://docs.docker.com/engine/admin/volumes/volumes/) in Docker if multiple services need to share the same data is a sane practice.

Create a volume:

`docker volume create ubuntu-volume`

List a volume:

`docker volume ls`

Inspect a volume:

`docker volume inspect ubuntu-volume`

Remove a volume:

`docker volume rm ubuntu-volume`

## Runtime Metrics

The `docker stats` command returns a designated container's runtime stats.  It will report back CPU / Memory, and network I/O metrics.

`CONTAINER  CPU %  MEM USAGE / LIMIT      MEM %  NET I/O           BLOCK I/O           PIDS
ubuntu      0.01%  6.324 MiB / 15.63 GiB  0.04%  8.44 kB / 936 B   30.2 MB / 805 MB    3`

If you'd like to have more realtime metrics, you can [Collect Docker Metrics with Prometheus](https://docs.docker.com/engine/admin/prometheus/)

## Loggging

Logs should be treated as event streams.  Logs provide visibility into the behavior of a running application.  Having a stream of aggregated, time-ordered events can help with visibilty and troubleshooting of a running process.  Logging to STDOUT allows developers to stream the results in the foreground and observe the running application's behavior.  This stream also can be sent other places, such as a log indexing system such as the [ELK Stack](https://www.elastic.co/webinars/introduction-elk-stack) or [Splunk](https://www.splunk.com/)

Docker by default uses the [JSON File logging driver](https://docs.docker.com/engine/admin/logging/json-file/)  There are many other avaiable [logging drivers for Docker](https://docs.docker.com/engine/admin/logging/overview/#supported-logging-drivers) if you have another preference.  The JSON file logging driver is a sane choice, as it gives a consistent methodology for delivering logs.

## Restarting Containers

Docker containers can be configured to have different states after exit or a Docker daemon restart.
The full list of restart policies can be found [here](https://docs.docker.com/engine/admin/start-containers-automatically/#use-a-restart-policy)

## Docker Security

[Docker Bench for Security](https://github.com/docker/docker-bench-security) is a sane set of scripts to check for best practices around deploying Docker containers in production.

[Clair](https://github.com/coreos/clair) can provide vulnerability static analysis for containers.

[Hadolint](https://github.com/coreos/clair) can help provide proper linting for Dockerfiles.

Make sure to never give containers more privileges than they need.  Don't run containers in priviledged mode, and make sure that containers don't use excess privileges that they don't need.  You can use the `--cap-drop` and `cap-add` switches within your docker invocation to add or drop Linux capabilities.  You can also make sure to not grand extended privilieges to a container and allow you to access particular devices within a container.   More information can be found at the [runtime privilege and linux capabilities](https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities) documentation.

## The Container Commmandments:
Containers should:
1.  be ephemeral (stopped and destroyed and a new one built and put into place with an absolute minimum setup and configuration)
2.  be disposable
3.  be able to be started up as quickly as possible
4.  be as small as possible
5.  shut down gracefully when a SIGTERM is received
6.  typically not maintain state (Databases and Key-Value store should be containerized with great hesitation)
7.  have all of the dependencies that are needed for the container runtime available locally
8.  have one responsibility and one process
9.  log to STDOUT.  This uniformity allows the docker daemon to grab the stream easily
10. contain a restart pattern that is suitable for the application
