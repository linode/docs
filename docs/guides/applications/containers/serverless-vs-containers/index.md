---
slug: serverless-vs-containers
title: "Serverless vs Containers: Choose Which One to Use"
description: 'What are the similarities and differences between serverless and containers? What should developers consider when choosing one?'
keywords: ['serverless vs. containers','serverless computing','serverless applications','containers','microservices','serverless architecture','serverless web applications','backend services']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["John Mueller"]
published: 2023-05-02
modified_by:
  name: Linode
---

Getting as much done in as little time, and with as little overhead as possible is an essential element of modern development. The end result needs to be easy to deploy, maintain, and debug. Plus, it all has to run in the cloud. That’s asking a lot, but both serverless applications and containers offer solutions. They’re both designed to replace virtual machines that require much more work on the organization’s part. Of the two, containers are a more robust solution that include everything needed to run an application, usually as a set of microservices. Meanwhile, serverless applications are less complex solutions that focus on application code that relies on services provided by a vendor API. There isn’t a right or wrong choice with either technology, simply the choice that benefits an organization most, as this guide explains.

## What Is Serverless?

Serverless applications are hosted on a vendor system, where the functions used to create them respond to events. With *serverless*, the developer focuses on the code, the application, and not the server or hardware. The infrastructure, such as backend services and libraries, are generally provided by the vendor. Therefore the developer is only looking at the application code, and not its dependencies.

A serverless application provides functionality like automatic scaling, provisioning, built-in service integration, automated configuration, and high-availability. All without any additional effort on the developer’s part. Because of the manner of hosting, serverless applications can save an organization a huge amount of money on dependency costs.

A serverless application can provide traditional desktop support, backend services, and serverless web applications. When compared to a microservice, the serverless application represents a method of running an application, while a microservice represents a method of designing an application. Additionally, serverless applications, unlike microservices, don’t run continuously, do require an event to begin execution, and individual functions perform exactly one task. A microservice can run continuously over a long period of time, and can support more than one task or function. The advantage of using a serverless application over a microservice is that the serverless application waits for an event, runs, and then stops. The costs of running a serverless application is therefore less than a microservice in situations where an application is expected to receive frequent usage spikes.

### What is Serverless Used For?

Serverless applications are perfect for mobile and web application startups because of their low startup costs and ability to handle lightweight applications. They are often employed in these use cases:

-   Situations where the traffic is unpredictable
-   Internet of Things (IoT) applications
-   Any application that sees constant and significant changes
-   Applications where it’s possible to break tasks down into single functions and then compose these functions together to create a Packaged Business Capability (PBC)

### Considering the Serverless Application Process

As with most application development, there is a process to follow in order to architect a serverless application. It doesn’t matter whether the resulting software represents backend services, frontend services, or both. This process is inherently different from working with monolithic applications, microservices, [Packaged Business Capabilities (PBCs)](https://www.elasticpath.com/blog/what-is-the-difference-between-PBCs-and-microservices), container applications, or any number of other software development patterns. The idea is to break a software requirement down into smaller pieces until it’s possible to describe a particular piece very simply. Here’s how:

1.  Define individual services that perform a specific task.
1.  Define individual functions (elements that perform one and only one task) to make up the services.
1.  Define events that fire the functions, remembering that serverless applications work around the idea that a function starts, performs a task, and then stops.
1.  Create configuration files that describe each function.
1.  Create a configuration provider file that describes how the function is to interact with the framework that supports the serverless application.
1.  Create a service configuration that describes the provider file, function files, and any plugins that make up the service.

## What Are Containers?

Containers differ from serverless applications because a container has everything needed to run the application, such as libraries, system settings, and other dependencies. This additional content over a serverless application means that the developer needs to be concerned about the application code and everything that goes with it. Consequently, there is more work for the developer. However, containers have some serious benefits over serverless applications, one of which is a lack of vendor lock-in. For instance, a [Docker](https://www.docker.com/) container application can run on any system that supports Docker. Just like containers used for shipping, container applications are standardized. They can be moved anywhere, on any system, without regard to the underlying hardware, or operating system details.

A container is focused on just one application, unlike a virtual machine, which imitates an entire computer, operating system, and all. A container is simpler and less resource intensive. Given an application of equal complexity, it’s possible to run more containers on a physical piece of hardware than virtual machines. On the other hand, a virtual machine can run multiple applications. A major difference between containers and virtual machines is that containers share a single kernel (operating system) on a physical machine. Meanwhile, virtual machines each have their own kernel. Consequently, all container applications running on a physical device must be compatible with the one kernel. Using a virtual machine offers the opportunity to use the particular kernel that works best with the applications in question.

### What Are Containers Used For?

Containers are often used for the following purposes:

-   Deploying API endpoints
-   Deploying repetitive jobs and tasks
-   Providing devops support for Continuous Integration and Continuous Deployment (CI/CD)
-   Hosting background processing applications
-   Handling event-driven processing
-   Running microservices
-   Moving large legacy applications to the cloud

### Considering the Container Application Process

As with serverless applications, there is a common process used to create container applications of all sorts. Generally, this process follows these steps:

1.  [Break an existing monolithic application down into microservices](https://martinfowler.com/articles/break-monolith-into-microservices.html) as necessary.
1.  Create a new container image based on an existing image template.
1.  Add code, resources, and other application files to the image using host commands.
1.  Configure the image’s startup commands using host commands.
1.  Build and run the image from within the container (rather than externally as normal).
1.  Deploy the image using the host server’s instance service.

## What Are Similarities Between Serverless and Containers?

Serverless applications and containers embrace similar strategies of breaking solutions down into smaller, more manageable pieces. They also have the same goals of reducing costs, development time, and maintenance time, while creating a more flexible environment.

## What Are the Key Differences Between Serverless and Containers?

In addition to the differences already mentioned, it’s possible to compare them in specific ways. Most notably, the two technologies have differences in the manner they use physical machines, scale, keep costs low, and manage deployment details.

### Physical Machines

A serverless application can live on multiple physical machines, while container applications always reside on just one physical machine. The ability to live on multiple machines gives serverless applications a resource availability advantage without a lot of extra work on the developer’s part. However, techniques like load balancing can be used to divide the load between multiple instances of a container application on multiple physical systems. The end result is seemingly the same, but the container application requires more configuration and implementation.

### Scalability

Serverless applications have an advantage when it comes to scalability because they automatically scale. The hosting vendor provides as little or as much computing power as needed to handle a particular load at a given time. When working with container applications, a developer needs to allocate enough containers to handle the anticipated load. If the load exceeds expectations, the application begins to run slowly, negatively impacting customers. When the load is less than expected, an organization wastes money on unused resources. It’s entirely possible to find cloud providers that have automatic scaling at the virtual machine level. While this can help mitigate the container disadvantage to some degree, this is *configurable* by the developer, but not *managed* by them.

### Cost

Serverless applications run only when they need to, which means they cost less to operate than containers when viewed directly. However, a problem occurs when considering the cost of application latency. Because a container is always running, it provides an immediate response to any request. If a serverless application needs to be loaded from outside the cache, there is additional time to consider before the task completes. Time is money. Consequently, even for loads where the requests are consistent, container applications may actually cost less because they’re more responsive.

### Deployment Time

The time to deploy applications has consistently gotten shorter. What used to take months using physical systems and minutes using virtual machines, now takes seconds using containers, and milliseconds using serverless applications. A serverless application developer generally has a deployment time advantage because there are no underlying system dependencies to configure and serverless applications are smaller.

### Maintenance

Serverless applications require less direct maintenance than containers because the hosting service addresses all of the maintenance needs. In an ideal situation, this means a serverless application developer has a significant advantage in time because the container developer must address low-level maintenance. However, the serverless application scenario can also experience problems. For example, unexpected or unwanted updates pushed by a vendor who has an interest in keeping everything up-to-date. Because a container developer has direct control over the underlying details, maintenance can be performed at a time most beneficial to the container application. This potentially saves time in the long term.

### Testing

Application testing is challenging when working with a serverless application because of how it runs. An event triggers the function, which performs the task and immediately shuts down. A developer is often forced to use application logs to locate the source of a problem. Container applications run continuously and in the same manner no matter where they run. In this case, the developer often has standardized tools to use in the debugging process. Many IDEs, such as [IntelliJ IDEA](https://www.jetbrains.com/help/idea/debug-a-java-application-using-a-dockerfile.html), are set up to debug container applications.

## What Factors Should Developers Use to Choose Which One to Use?

Serverless applications offer reduced deployment time, fewer maintenance requirements, and cost less when working with a load that can suddenly spike. They’re an optimal choice for startups that have smaller, less complex applications to manage without special underlying support needs.

Container applications offer reduced costs for consistent loads and a great deal more in application configuration flexibility. They’re an optimal choice when moving a legacy application from local servers to the cloud.

## Conclusion

Serverless applications and containers both have advantages and disadvantages. Sometimes the best option is not to make a choice, but rather to use the technology that fits a specific need. Parts of a solution can run as serverless applications and other parts can run as containers. Of course, this combined option has drawbacks, too. Not the least of which is having to manage two different technologies for a single solution. This increases complexity and potentially reduces both reliability and security.