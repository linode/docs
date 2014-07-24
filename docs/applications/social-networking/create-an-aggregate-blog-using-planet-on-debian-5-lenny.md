---
author:
  name: Linode
  email: skleinman@linode.com
description: 'The Planet feed aggregator provides an overview of a community by collecting all feeds produced by a community.'
keywords: 'planet,blogs,aggregator,feed,rss'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/social-networking/planet/debian-5-lenny/']
modified: Friday, October 4th, 2013
modified_by:
  name: Linode
published: 'Wednesday, April 7th, 2010'
title: 'Create an Aggregate Blog using Planet on Debian 5 (Lenny)'
deprecated: true
---

The Planet Feed Aggregator takes a collection of RSS feeds and generates what its founders call a "River of News" feed that combines posts from all sources into a single coherent stream. Thus, this software is useful for providing a simple and consolidated overview of ongoing output from selected blogs. Written and configured in Python and run regularly using cron, Planet is easy to configure and use.

Before beginning to follow this guide, we assume that you have completed the [getting started](/docs/getting-started/) guide. If you are new to Linux systems administration you may wish to consider the guides in our [using Linux](/docs/using-linux/) series, particularly the [administration basics](/docs/using-linux/administration-basics) guide. Beyond this, Planet requires a web server to provide access to the resources it creates, but this document does not depend on specific [web server software](/docs/web-servers/) software.

Installing Software
-------------------

Before we begin the installation of the Planet software, perform the following commands to make sure the system's package repository is up to date and all of the latest packages have been installed:

    apt-get update
    apt-get upgrade

Install the Planet software by issuing the following command:

    apt-get install planet

This will install the Apache HTTP server as a dependency. Congratulations, we can now begin the configuration of Planet.

Configure Planet
----------------

### Basic Planet Configuration

For the purposes of example, this document assumes that your web server is configured to use `/srv/www/bucknell.net/public_html` as the public document root for the domain `bucknell.net`.

Copy the default configuration file to the `/srv/www/bucknell.net` directory:

    cp /etc/planet.conf /srv/www/bucknell.net

Now edit the file, making sure to modify the following values to conform to the needs of your deployment. Consider the following example:

{: .file-excerpt }
planet.conf
:   ~~~
    name=Bucknell link=http://bucknell.net

    owner_name=squire <owner_email=squire@bucknell.net>

    cache_dir = /srv/www/bucknell.net/planet_cache

    output_dir = /srv/www/bucknell.net/public_html

    items_perpage = 40 days_per_page = 0

    template_files = /srv/www/bucknell.net/planet_templates/index.html.tmpl /srv/www/bucknell.net/planet_templates/atom.xml.tmpl /srv/www/bucknell.net/planet_templates/rss20.xml.tmpl /srv/www/bucknell.net/planet_templates/rss10.xml.tmpl /srv/www/bucknell.net/planet_templates/opml.xml.tmpl /srv/www/bucknell.net/planet_templates/foafroll.xml.tmpl

    [/srv/www/bucknell.net/planet_templates/rss10.xml.tmpl] items_per_page = 30
    ~~~

These settings establish the name and some background information regarding the site. The `output_dir` determines where Planet will build the site, and should point to a publicly accessible directory equivalent to or beneath the "document root" of your web server. The `items_perpage` and `days_per_page` limit the number of posts displayed on all Planet-generated pages. `items_per_page` trims the number of posts included in the feed to not surpass the threshold set. `days_per_page` sets a hard limit for the number of days of oldest possible post that can be displayed.

The remaining settings control the behavior and use of templates. Issue the following commands to copy the default templates and other support files into a site specific configuration:

    mkdir -p /srv/www/bucknell.net/planet_cache/
    mkdir -p /srv/www/bucknell.net/planet_templates/
    cp /var/lib/planet/templates/* /srv/www/bucknell.net/planet_templates/
    cp -R /var/lib/planet/www/images/ /srv/www/bucknell.net/public_html/
    cp /usr/share/doc/planet/examples/planet.* /srv/www/bucknell.net/public_html/

If you want to override any of the default values like the encoding or the value of `items_per_page` as seen above, simply create an item block beginning with the full path to the template and specify the values beneath. If you need planet to generate an additional template, simply add the full path to the template to the end of the `template_files` list.

### Configuring Aggregation

At the end of your `planet.conf` file, add entries that resemble the following for each feed that you would like to collect in the Planet you're building

{: .file-excerpt }
planet.conf
:   ~~~
    [<http://library.linode.com/feeds/linode-library.xml>]
    name = Linode Library
    ~~~

If you want to take advantage of Planet's support for per-feed "faces" or avatars to identify each feed with a distinct logo or image, consider the following examples:

{: .file-excerpt }
planet.conf
:   ~~~
    [DEFAULT] facewidth = 64 faceheight = 64

    [<http://library.linode.com/feeds/linode-library.xml>] name = Linode Library face = lin-lib-avatar.png
    ~~~

You can specify default "width" and "height" in the `[DEFAULT]` stanza, but these values can be overridden for feed-specific settings. All "faces" should be stored in an `images/` directory beneath the output directory. In the case of this example, deposit images into `/srv/www/bucknell.net/public_html/images/`.

Once you have completed your modifications to `planet.conf` run Planet for the first time by issuing the following command:

    planetplanet /srv/www/bucknell.net/planet.conf

The Planet software will only poll the source feeds when the above command is used. Otherwise, all files generated by Planet are static. By maintaining multiple `planet.conf` files and specifying distinct output directories, it's possible to generate multiple Planet-based websites on a single server.

Running Planet
--------------

While you can run Planet without incident using the above method, we recommend running planet regularly using a "cronjob." Edit your crontab file with the following command:

    crontab -e

Insert the following job into the crontab:

{: .file-excerpt }
crontab
:   ~~~
    */10* * * * planetplanet /srv/www/bucknell.net/planet.conf
    ~~~

Save the crontab. Your Planet generated site will refresh every 10 minutes. Congratulations!

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The Planet's Project's Home Page](http://www.planetplanet.org)
- [Using Cron to Schedule Tasks](/docs/linux-tools/utilities/cron)



