---
slug: what-is-immutable-infrastructure
author:
  name: Linode
  email: docs@linode.com
description: 'This guide provides you with an overview of immutable server infrastructure, which is essentially infrastructure that never deviates from it''s source code.'
keywords: ['ci','automation','immutable', infrastructure]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-08-10
modified: 2018-08-10
modified_by:
  name: Linode
title: "Immutable Infrastructure"
contributor:
  name: Linode
audiences: ["intermediate"]
tags: ["automation"]
aliases: ['/development/ci/what-is-immutable-infrastructure/']
---

## What is Immutable Infrastructure?

Within a [Continuous Delivery](/docs/guides/introduction-ci-cd/#what-is-continuous-delivery) model it is crucial to automate a repeatable and reliable process for software deployment. The more you scale, the more complicated this task can become. You need granular control over all components of your stack across many servers and the ability to test how components will interact within their deployed environment.

An immutable server infrastructure provides a level of control and testability to maintain a healthy and stable environment for all components that never deviate from a source definition. The key guideline behind an immutable infrastructure is that you never modify a running server. If a change is required, you instead completely replace the server with a new instance that contains the update or change. The new server instance is created with an origin image that is built upon, or a restored image from a previously defined server state. You can version control and tag your images for easy rollback and distribution. The image contains all the application code, runtime dependencies and configuration--in essence, the state needed for the software to run as expected.

The immutable infrastructure approach to server management is a response to more traditional methods that rely on configuration management tools or one-off changes to maintain, update, and patch running server instances. With time, this method alone can lead to the slow drift of a server's state from its original definition which can become difficult and time consuming to manage and debug (creating what is known as a *snowflake server*). Configuration synchronization can keep servers up to date, but any element that is not controlled by the configuration management tool can potentially introduce a point of drift. An immutable server, as a concept, naturally developed as result of the *[Phoenix Server](https://martinfowler.com/bliki/PhoenixServer.html)* pattern. This pattern asserts that servers should be destroyed frequently and then rebuilt with a base image. The concept of immutability goes one step further and restricts a production server from ever being adjusted.

### Create an Immutable Server Image

The foundation of a successful immutable infrastructure is the server image. Below is a high-level outline of the steps involved in creating a *source of truth* production image that can be reliably deployed across many servers:

1. Create an origin image to boot a server instance on a Linode. This will include baseline components like the running Linux distribution and installed packages.

1. Use a configuration management tool, like [Chef](/docs/guides/beginners-guide-chef/) or [Jenkins](/docs/guides/automate-builds-with-jenkins-on-ubuntu/), to bring the server to the state needed to host your application code.

1. Create a new server image from the configured server instance.

1. Create a new test server instance with the new server image that includes all application code, configuration and dependencies.

1. Run predefined automated tests to test the new server image.

1. If the tests pass, deploy the new image to production.

1. Destroy the previous production server and archive the destroyed server image.

## Docker Containers and Immutable Infrastructure

Docker Containers were designed to be immutable. Docker comes with many utilities built in to help manage container images. If you change a container's image definition, then you have created a new image. A `docker commit` will create a new image while still leaving the original image unchanged. A `docker tag` command lets you easily tag your Docker image commit. Other useful metadata can be added to Docker images to help identify image inheritance.

Another benefit to using Docker containers to implement your immutable infrastructure, is that it helps manage data persistence or *stateful* components, like an application's database. Stateful components cannot simply be destroyed and redeployed using a server image. With a Docker container, you can take advantage of their [volumes](https://docs.docker.com/storage/volumes/) feature. The Docker volume will exist outside the lifecycle of a given container, allowing you to destroy a container at will and spin up a new one with the persisted data.

For more information on Docker, see our [An Introduction to Docker](/docs/guides/introduction-to-docker/) guide. You can also read [How to Deploy Microservices with Docker](/docs/guides/deploying-microservices-with-docker/) to learn about building large-scale applications with containers.

## Pros and Cons to an Immutable Infrastructure
There are many benefits to implementing an immutable infrastructure into your [CI/CD pipeline](/docs/guides/introduction-ci-cd/), however there are also some initial drawbacks that are important to understand. Your adoption of this pattern can depend on your current infrastructure, if one already exists, your team's expertise and your own desire to learn and implement new tooling. This information will help you determine if this is a model that makes sense for your project or organization.

**Pros**

- Rollbacks are simpler since old server images are version controlled.
- Changes to the server must be defined and automated providing more granular control over all server instances.
- You can ensure consistent development and test environments across your organization.
- It's easier to implement and test microservices for a large-scale application.
- Prevents snowflake servers.
- Portability, especially when using Docker containers.

**Cons**

- Higher initial overhead to learn new tooling and implement the infrastructure.
- Small quick fixes require a full redeploy.
- Possible increase in resource usage and cost depending on how often servers are destroyed and redeployed in a given time period.

## Common Tools

Immutable infrastructure is an idea that was popularized by [Chad Fowler in 2013](http://chadfowler.com/2013/06/23/immutable-deployments.html) when he pronounced, "Trash your servers and burn your code". Since then, many tools have been developed to make the Phoenix Pattern with an Immutable Infrastructure easier to implement.

Here are some popular tools:

- [Linode Images](/docs/products/tools/images/) allow you to take snapshots of your disks  or upload your own custom image files. You can then deploy them to any Linode under your account.
- [Packer](https://www.packer.io/guides/packer-on-cicd/) helps you create multiple machine images from a single source configuration.
- [Terraform](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/) is used to manage change within your deployment stack and maintain *Infrastructure as Code*.
- [Docker](https://docs.docker.com/) can be used to create and manage images and isolate application services.
- [Docker Swarm](/docs/guides/how-to-create-a-docker-swarm-manager-and-nodes-on-linode/) helps you scale up the power of Docker by creating a cluster of Docker hosts.
- [SaltStack](https://saltstack.com/) is a configuration management platform designed to control a number of *minion* servers from a single master server.
- [Linode Block Storage](/docs/products/storage/block-storage/) can easily store and persist date across Linodes.
- [Jenkins](/docs/guides/automate-builds-with-jenkins-on-ubuntu/) is an open-source automation server that allows you to build pipelines for build, testing, and deployment automation.
