---
slug: create-an-aggregate-blog-using-planet-venus-on-ubuntu-12-04-precise-pangolin
title: "Aggregate Content Using Planet Venus on Ubuntu 12.04"
description: 'This guide will show you how to use The Planet feed aggregator to provide overviews of a community by collecting community feeds on Ubuntu 12.04 "Precise Pangolin".'
authors: ["Linode"]
contributors: ["Linode"]
published: 2012-10-22
modified: 2013-10-04
keywords: ["planet", "blogs", "aggregator", "feed", "rss"]
tags: ["ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/web-applications/social-networking/planet/ubuntu-12-04-precise-pangolin/','/applications/social-networking/create-an-aggregate-blog-using-planet-venus-on-ubuntu-12-04-precise-pangolin/']
external_resources:
    - '[Planet Venus GitHub Repo](https://github.com/rubys/venus)'
    - '[Using Cron to Schedule Tasks](/docs/guides/schedule-tasks-with-cron/)'
relations:
    platform:
        key: aggregate-blog-planet
        keywords:
            - distribution: Ubuntu 12.04
deprecated: true
---

The Planet (Venus) Feed Aggregator takes a collection of RSS feeds and generates what its founders call a "River of News" feed that combines posts from all sources into a single coherent stream. Thus, this software is useful for providing a simple and consolidated overview of ongoing output from selected blogs. Written and configured in Python and run regularly using cron, Planet Venus is an updated variant of the popular Planet software.

Before beginning to follow this guide, we assume that you have completed the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide. If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/guides/introduction-to-linux-concepts/), [beginner's guide](/docs/products/compute/compute-instances/faqs/) and [administration basics guide](/docs/guides/linux-system-administration-basics/). Beyond this, Planet requires a web server to provide access to the resources it creates, but this document does not depend on specific [web server software](/docs/web-servers/) software.

## Installing Software

Before we begin the installation of the Planet software, perform the following commands to make sure your system's package repository is up to date and all of the latest packages have been installed:

    apt-get update
    apt-get upgrade

Install the Planet and other required software by issuing the following command:

    apt-get install apache2 planet-venus

This will also install the Apache HTTP server if you have not already installed this software. Be sure to [configure a name-based virtual host](/docs/guides/how-to-install-a-lamp-stack-on-ubuntu-22-04/#configuring-a-virtual-host-for-your-domain-on-apache) if you haven't already. You may now begin the configuration of Planet Venus.

## Configure Planet

### Basic Planet Configuration

For the purposes of example, this document assumes that your web server is configured to use `/var/www/example.com/public_html` as the public document root for the domain `example.com`.

Copy the default configuration file to the `/var/www/example.com` directory:

    cp /usr/share/planet-venus/example/default.ini /var/www/example.com/planet.conf

Now edit the file, making sure to modify the following values to conform to the needs of your deployment. Consider the following example:

{{< file "planet.conf" >}}
# Example Planet Venus configuration file

# Documentation: <file:///usr/share/doc/planet-venus>
# Examples: <file:///usr/share/planet-venus/example>
# Filters: <file:///usr/share/planet-venus/filter>
# Themes: <file:///usr/share/planet-venus/theme>

# Global configuration

[Planet]

name = Planet example link = <http://example.com/>
owner_name = example Square
owner_email = <username@example.com>
output_theme = /var/www/example.com/planet-theme
cache_directory = /var/www/example.com/planet-cache
output_dir = /var/www/example.com/public_html
feed_timeout = 20
items_per_page = 60
log_level = DEBUG

{{< /file >}}


These settings establish the name and some background information regarding the site. All directories are declared relative to the location of the `planet.conf` file. The `output_dir` determines where Planet will build the site, and should point to a publicly accessible directory equivalent to or beneath the "document root" of your web server. The `items_per_page` option trims the number of posts included in the feed to not surpass the threshold set.

Issue the following command to copy the default theme directory to the `/var/www/example.com/theme`:

    cp -R /usr/share/planet-venus/theme/diveintomark /var/www/example.com/planet-theme

You can modify any of the files or copy different theme files from the `/usr/share/planet-venus/theme/default`.

### Configuring Aggregation

At the end of your `planet.conf` file, add entries that resemble the following for each feed that you would like to collect in the Planet you're building

{{< file "planet.conf" >}}
[<https://www.linode.com/docs/rss>]
name = Linode

{{< /file >}}


Once you have completed all modifications to `planet.conf`, run Planet for the first time by issuing the following command:

    planet /var/www/example.com/planet.conf

The Planet software will only poll the source feeds when the above command is used. Otherwise, all files generated by Planet are static. By maintaining multiple `planet.conf` files and specifying distinct output directories, it's possible to generate multiple Planet-based websites on a single server.

## Running Planet

While you can run Planet without incident using the above method, we recommend running planet regularly using a "cronjob." Edit your fcrontab file with the following command:

    fcrontab -e

Insert the following job into the crontab:

{{< file "fcrontab" >}}
*/10* * * * planet /var/www/example.com/planet.conf

{{< /file >}}


Save the crontab, and issue the following command to start `fcron` for the first time:

    /etc/init.d/fcron start

Your Planet generated site will refresh every 10 minutes. Congratulations!
