---
slug: comparing-nginx-and-apache-web-servers
description: "Having trouble deciding between Apache or NGINX? Read through our comparison, and you'll know everything you need to make the best choice possible."
keywords: ['apache','nginx','web server','open source','vs','comparison']
tags: ['apache','nginx','web server']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-15
image: ApacheVsNginx.jpg
modified_by:
  name: Nathaniel Stickman
title: "A Comparison of the NGINX and Apache Web Servers"
title_meta: "Comparing the NGINX and Apache Web Servers"
external_resources:
- '[Apache HTTP Server](https://httpd.apache.org/)'
- '[NGINX](https://nginx.org/)'

authors: ["Nathaniel Stickman"]
---

The [*Apache HTTP Server*](https://httpd.apache.org/) (usually called "Apache") and [*NGINX*](https://nginx.org/) (pronounced "engine-X") are the two most popular open-source web servers. So much so that it can often be unclear which one is the best to use. However, once you realize what sets each apart, you can easily make the best choice for your needs.

This guide compares the Apache and NGINX web servers to give you a sense of the strengths each one brings to the table. With that knowledge, it can help you make an informed decision about the best web server for your use case.

## Questions to Consider When Choosing Apache or NGINX

Before comparing Apache and NGINX, it is a good idea to understand what you need out of a web server. Both Apache and NGINX have advantages and disadvantages, and the one you select depends on what you want to do with it.

Here are some questions to think about going in:

- Does your web server primarily need to serve static content, dynamic content, or a combination?
- Is performance your concern?
- Is your application stack simple and more traditional or complex and more service-oriented?
- How much support do you want, both in terms of documentation and third-party integrations?

The following sections address each of these questions, and compare and contrast Apache and NGINX.

## Content Types

Apache can serve both static and dynamic content. It offers an extensive library of modules, which you can use to extend Apache. You can also use Apache modules to embed interpreters on your web server. For instance, if you want to process dynamic content using PHP, Apache's `mod_php` embeds a PHP interpreter on the webserver to handle the processing.

NGINX focuses on handling static content, and it hands off any dynamic content needs to external services. For NGINX, the goal is to serve static content and function as a proxy for anything else. So, NGINX routes requests for dynamic content to external interpreters for processing and then serves the interpreters' responses. This allows NGINX to focus on its strength —efficiently serving static content— while handing off anything else.

The takeaway here comes down to how you want to process dynamic content. On the one hand, if you want your solutions in one place, and your interpreter to handle dynamic content, Apache makes sense. On the other hand, if you want to use an independent service for dynamic processing, NGINX aligns better with your goals.

## Performance

Apache has been around a while, but it has continued to leverage its extensible design to keep up to date with how it handles requests. Currently, Apache supports three different request-handling models, each adopted to handle the growing emphasis on *concurrency*. Below are three modules you can use to handle a variety of request models:

1. The `mpm_prefork` module for assigning one thread per process. This one is often used when working with other modules or processes that do not support multiple threads (like `mod_php`).

1. The `mpm_worker` module for using "workers" that give each process multiple threads to work with.

1. The `mpm_event` module is optimized for keeping sessions alive.

NGINX, however, prioritizes performance at its core. Its event-driven architecture was designed with efficiency and concurrency in mind. The underlying mechanism allows each of its worker processes to handle massive numbers of simultaneous connections. And, as a result of its efficient design, NGINX is exceptional at making the most of the hardware it runs on.

Despite Apache's advances in **request handling**, NGINX exceeds its capabilities for maintaining multiple connections and **maximizing system resources**. Not to say that Apache does not perform well, but NGINX proves more efficient and generally better for handling demanding loads.

## Complexity

Apache simultaneously favors simplicity and flexibility. Most of the steps you need can be handled in one place. Apache's flexibility is a large part of what enables this. Its host of modules and third-party integrations make it readily **adaptable** to a variety of needs and system configurations. Moreover, you can implement directory-level configurations via `.htaccess` files, which makes Apache even more adaptable. With this ability, you can fully delegate web content to specific users while restricting access to Apache's main configuration files.

NGINX shines in fitting into more complicated, unconventional, or service-oriented setups. NGINX's emphasis on functioning as a proxy makes it ideal for services that operate independently. This is especially useful for two particular types of application services that have been on the rise in recent years: **microservices** and **containerized services**. For this reason, NGINX is especially popular for service-oriented applications and applications that use *Docker*.

Apache and NGINX are further differentiated by how they process request URIs. Apache, in an often more intuitive approach, generally maps requests to locations in the underlying file system. In other words, the request path corresponds to a specific location on the web server's configured root directory. If needed, Apache can parse URIs more abstractly, but that is not its preferred behavior. NGINX, on the other hand, tends to parse URIs more abstractly in support of its role as a proxy. Upon receiving a request, NGINX evaluates the URI to determine how to fulfill it — via an external service or with static content. NGINX only refers to the underlying file system when it is ready to fulfill a request.

## Support

Apache has a long history and a strong reputation. As such, its documentation base is mature and thorough and it has garnered extensive third-party support. Its extent of third-party integrations has also been encouraged by its modules being relatively easy to develop and use.

NGINX is newer, and so it lacks the degree of documentation and third-party support that Apache has gained. NGINX's third-party support is further challenged by the difficulty of its modules. Its core architecture makes modules complicated to develop. In terms of use, NGINX has to be recompiled to add or remove modules. Nevertheless, NGINX's popularity has continued to grow rapidly, especially with the intense interest in service-oriented applications. It's quick adoption has resulted in more documentation being available.

## Better Together

It is also entirely possible to use Apache and NGINX together to server your web content. Each has its advantages and disadvantages, as you can see above. So, the idea of using them together is to try to get the advantages of each.

Typically in such a setup, NGINX acts as the **static content server**. Any requests for dynamic content are routed through NGINX to Apache, which is set up with the appropriate module to process dynamic content needs.

## Conclusion

When deciding on a web server, take a look at the characteristics of each, and determine which one best fits your needs. If you are looking for simplicity and flexibility and a more traditional web application, look no further than Apache. If performance is paramount, or you want an efficient webserver to work with microservices or containerized services, go with NGINX. If you want the best of both, try using them in conjunction.

To learn how to install Apache on your Linux server, check out our guide for [How to Install Apache Web Server](/docs/guides/how-to-install-apache-web-server-debian-10/). You can use the drop-down menu at the top of the guide to select your desired Linux distribution.

To learn how to install NGINX on your Linux server, check out our guide for [How to Install NGINX](/docs/guides/how-to-install-nginx-debian-10/). Likewise, use the drop-down at the beginning of the guide to select your Linux distribution.
