---
deprecated: true
author:
  name: Brett Kaplan
  email: docs@linode.com
description: 'Get detailed website statistics such as visitor counts, pageviews, user agents percentages, and much more using the open source Webalizer package on Centos 5.'
keywords: ["webalizer", "statistics", "analytics", "stats", "server monitoring", "centos"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/analytics/webalizer/centos-5/']
modified: 2011-12-02
modified_by:
  name: Lee Matos
published: 2010-04-17
title: Webalizer on Centos 5
external_resources:
 - '[Webalizer Homepage](http://www.mrunix.net/webalizer/)'
---

Webalizer is an industry standard statistics generation tool. It is useful to analyze traffic to your web server while still remaining lightweight enough not to hinder performance. Webalizer can even identify your user base using GeoIP services.

We assume you've followed the steps outlined in our [getting started guide](/docs/getting-started/). All configuration will be performed in a terminal session; make sure you're logged into your Linode as root via SSH. We'll also be installing the [Apache 2 web server](/docs/web-servers/apache/installation/centos-5) with very minimal configuration. If you already have Apache installed and configured, feel free to skip these steps. If this is your first time installing Apache on this Linode, make sure to read the installation guide for additional guidance.

## Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

## Install Required Software

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    yum update

### Install Apache

If you already have Apache installed and configured, you can safely skip this section of the guide. Install Apache by running the following command:

    yum install httpd

Issue the following sequence of commands to start Apache for the first time and ensure that the service restarts following the next reboot:

    /etc/init.d/httpd start

As mentioned earlier, you will need to go to the installation guide if you wish to configure your server beyond the default configuration.

### Install Webalizer

At this point we're able to install the required packages for Webalizer. Run the following command:

    yum install webalizer

## Configuring Webalizer for Virtual Hosts

This section assumes that you've already configured at least one virtual host. If you do not have virtual hosting configured, please refer to the guide for [installing Apache](/docs/web-servers/apache/installation/centos-5) to further clarify this process and create at least one virtual host. Then, webalizer can generate distinct statistic sets for multiple virtual hosts, using the `webalizer` command line with arguments to process statistics for different virtual host log files. The syntax resembles the following:

    webalizer -n hostname -o /path/to/webalizer/output /path/to/logfile.log

To process multiple virtual hosts, create a shell script. In this case, there are three virtual hosts. Be sure to substitute the correct hostname and paths for your particular virtual host configuration.

{{< file-excerpt "/opt/webalizerScript.sh" bash >}}
#!/bin/sh
webalizer -n tunahoagie -o /srv/www/example.com/public_html/webalizer /srv/www/example.com/logs/access.log
webalizer -n tofuhoagie -o /srv/www/example.org/public_html/webalizer /srv/www/example.org/logs/access.log
webalizer -n fuzzyshambler -o /srv/www/fuzzyshambler.com/public_html/webalizer /srv/www/fuzzyshambler.com/logs/access.log

{{< /file-excerpt >}}


Make the script executable:

    chmod +x /opt/webalizerScript.sh

Delete the default `/etc/cron.daily/00webalizer` script with the following command:

    rm -r /etc/cron.daily/00webalizer

Issue the following command to remove the default webalizer integration with Apache and restart the web server process:

    mv /etc/httpd/conf.d/webalizer.conf /etc/httpd/conf.d/webalizer
    /etc/init.d/httpd restart

### Finalizing Webalizer Configuration

With `webalizer` configured, you must create the `webalizer/` directories in each virtual host's document root before the software runs the first time. Issue the following commands, substituting the correct paths for your virtual hosting configuration:

    mkdir -p /srv/www/example.com/public_html/webalizer
    mkdir -p /srv/www/example.org/public_html/webalizer
    mkdir -p /srv/www/fuzzyshambler.com/public_html/webalizer

### Securing Webalizer Output Directories

Once the `webalizer` script has been tested, we recommend that you place some sort of security on the Webalizer output directories to prevent unauthorized access. Consider using [rule based authentication](/docs/web-servers/apache/configuration/rule-based-access-control) or [authentication based access control](/docs/web-servers/apache/configuration/http-authentication) to limit access to these files.

### Testing the Webalizer Script

Now that you have created a Webalizer script, you must make sure it actually works. First, you must give Webalizer an Apache log file to parse. One way to do this is to visit your site and refresh the page a few times. You can also accomplish this via the command line with the following:

    wget www.example.com
    wget www.example.org
    wget www.fuzzyshambler.com

Then, issue the following command:

    /opt/webalizerScript.sh

Check your Webalizer directory in each virtual host's document root by pointing your browser to your website(s). In this example the URL is located at `http://www.example.com/webalizer`. Enter your password and take a look at the statistics. Repeat this for each virtual host to verify that your usage statistics were generated for each one.

### Creating a Webalizer Cron Job

Many administrators generate their Webalizer statistics automatically every day. You can generate statistics daily using a cron job that runs the `webalizerScript.sh` script created above. Create a symbolic link from the `/etc/cron.daily/` directory to the `/opt/webalizerScript.sh` file. Issue the following commands:

    cd /etc/cron.daily
    ln -s /opt/webalizerScript.sh

Congratulations, you have successfully installed Webalizer! You can leave future usage statistics generation to cron!

## Other Considerations

Even with a low traffic site, Apache logs can become large. If your logs are routinely large, processing those logs can be time-consuming. You should consider [log rotation](/docs/uptime/logs/use-logrotate-to-manage-log-files) to prevent potential performance issues.
