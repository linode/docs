---
author:
  name: Nathan Melehan
  email: nmelehan@linode.com
description: 'Best practices when migrating a website or other cloud service to Linode.'
keywords: ["migrate", "website migration"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-07-31
modified_by:
  name: Linode
published: 2018-07-31
title: Best Practices when Migrating to Linode
---

This guide describes the recommended strategy for migrating your services from another host to Linode. The specific steps you'll need to carry out will vary depending on the software you use, but the high-level outline is generally the same regardless of the nature of your service. The [Migrate to Linode](/docs/platform/migrate-to-linode/) section offers other guides which describe migrating particular services in more detail.

## Deciding on a Migration Strategy

There are two general strategies for migrating from another hosting provider:

1.  **Install Each Service Individually - Recommended Method**

    -  Create a Linode, deploy a Linode-provided Linux image to it, and copy over only the configuration and data relevant to your services. This results in a Linux environment that is guaranteed to boot normally on the Linode platform.

        Re-installing your services can take time, but any issues that come up when setting up your applications are usually easier to troubleshoot than low-level configuration problems. This is the recommended strategy when migrating.

1.  **Full Clone - Not Recommended**

    -  Create a Linode and perform a full clone of your existing disks from your current host to the Linode. This will create an exact copy of your disks on the Linode platform. This strategy is not recommended because low-level system configuration files can be different on different hosting providers.

        These differences can prevent your Linode from booting normally. It is possible to adjust these settings sufficiently to allow your Linode to run normally, but getting the right values for these settings can be difficult, and it can be difficult to troubleshoot when they are incorrect.

## Migration Strategy Outline

### Deploy a New Linode

There are two considerations when creating a new Linode: which data center the Linode should reside in, and which hardware resource plan the Linode should run under.

1.  **Data Center Location**

    -  To choose a data center location, run speed tests to the different regions that Linode offers from the [speedtest page](/speedtest/). This page allows you to download a 100MB file from each location. Compare the speed of each download to determine the bandwidth between your location and the data center.

        You can also run [MTR tests](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) to the speed test servers at each location (e.g. `speedtest.dallas.linode.com`). These tests will report latency between your location and the data center--a lower latency is more desirable.

1.  **Plan Size**

    -  To determine which plan to choose, review the [Linode Pricing page](/pricing#all). At a minimum, choose a plan which offers enough storage capacity for the data you store on your current hosting provider.

        CPU and RAM allocations are also important since a service with a higher workload/higher traffic will require more of each. If you're not sure what your workload will require, start with a smaller Linode and then [resize your plan](/docs/platform/disk-images/resizing-a-linode/) up or down as needed.

### Deploy Linux

If you know which Linux distribution your current host uses, deploy that to the new Linode. If your current deployment uses an older version of a Linux distribution, deploy the newest version available for your new Linode to ensure the latest security enhancements and software availability.

If your host offers a shared environment and you are not sure which Linux distribution is being used, then you can select any new Linux image. The most commonly used distributions on Linode are Ubuntu, Debian, and CentOS. Most Linux distributions should support the software your service will use, but a few software packages are better-suited to specific distributions. Review Linode's [Guides & Tutorials](/docs/) to see which guides have been written for the software and distributions you're interested in.

For further details on deploying your new Linux image, follow the [Getting Started with Linode](/docs/getting-started/) guide. It is also recommended that you follow the [How to Secure Your Server](/docs/security/securing-your-server/) guide once you have deployed your new image.

### Install Software

Install the same software stack that is present on your current host on your new Linode. For guidance on how to set up different kinds of software, review Linode's [Guides & Tutorials](/docs/).

If your host provides a shared environment and you're not sure which software is needed, ask your host if they can provide more information about the software they run. For example, WordPress sites are powered by PHP, a web server, and a database, so installing a [LAMP stack](/docs/web-servers/lamp/) would be sufficient.

{{< note >}}
You may want to install your software via a [configuration management tool](/docs/applications/configuration-management/). Configuration management is a method for condensing your installation scripts into a *recipe* that can be run repeatedly and which will result in the same deployment every time. Once you've written your recipes, configuration management can greatly speed up creating new deployments and maintenance of existing deployments. These tools also minimize the potential for human error.
{{< /note >}}

### Back up Your Data

Locate and backup the data on your current host. Identify:

- Which software configuration settings should be preserved (e.g. web server, virtual host information, database connection settings, and which files contain these settings, etc.).

- Where your data is stored on disk (e.g. as files in a directory, in a database process, etc.).

If your data is stored in a database, you will likely need to perform a *database dump*. This will result in a file on disk that encapsulates your database data and can be copied over the network as a normal file:

-  [Use mysqldump to Back Up MySQL or MariaDB](/docs/databases/mysql/use-mysqldump-to-back-up-mysql-or-mariadb/)
-  [Create Physical Backups of your MariaDB or MySQL Databases](/docs/databases/mysql/create-physical-backups-of-your-mariadb-or-mysql-databases/)
-  [How to Back Up Your PostgreSQL Database](/docs/databases/postgresql/how-to-back-up-your-postgresql-database/)

If your current host is a shared environment and you do not have full administrative/command-line access to it, then your host may offer an alternative method for exporting your data. If this is the case, then you should use those tools to download the data to your local computer or some other accessible location.

### Use rsync to Transfer Your Data to Your Linode

- Transfer your data to your Linode using a network transfer tool like `rsync`. The [Introduction to rsync](/docs/tools-reference/tools/introduction-to-rsync/) guide is a good place to become more familiar with this tool.

    For example, the following command will upload files from `/path/to/source_folder` on the current host to `/path/to/destination_folder` on the new Linode. Run this command from your current host. Replace `example_user` with the Linux user on your Linode, and `linode_ip_address` with your Linode's IP address:

        rsync -avzh /path/to/source_folder example_user@linode_ip_address:/path/to/destination_folder

- If your current host is a shared environment and you previously downloaded your data to your computer, then you should upload the data from your computer to your Linode. You can use an SFTP tool like [FileZilla](/docs/tools-reference/file-transfer/filezilla/), which has clients available for Windows, Mac, and Linux.

- If you have uploaded a database dump file to your new Linode, you will also need to *restore* the dump file so that your database software can use the data normally. The database guides linked to in the [Backup Your Data](#backup-your-data) section include instructions for restoring those files.

### Test the New Environment

When you have finished setting up your software and restoring your data, test the installation to make sure it works normally. At this point, you have not yet updated DNS records to point to your Linode deployment, but there are still methods for [previewing your services without DNS](/docs/networking/dns/previewing-websites-without-dns/).

Take this time to perform load testing on your new service. [ApacheBench](https://en.wikipedia.org/wiki/ApacheBench) is a popular benchmarking tool for web services. If you discover that the hardware resource plan you chose originally is not enough when completing these load tests, then resize your plan and continue testing.

When you have finished testing, move on to the last step in migrating: updating your DNS records.

## Migrating DNS Records

To direct your visitors to your Linode, associate your domain with [your new Linode's IP](/docs/networking/remote-access/#network-access). There are two options for moving your DNS records:

-  Use Linode's fast, stable [DNS hosting](/dns-manager/) which is free as long as you have one active Linode on your account.

-  Continue to use your current nameserver authority and update your DNS records with your new Linode's IP address. You should check with your current provider to see if there are any costs for their DNS services. If you are using your domain name registrar's nameservers, then they are generally free.

{{< content "use-linode-name-servers" >}}

### Alternative: Use Your Current Nameservers

If you'd like to continue with your current nameservers, update all of the DNS records that are assigned to your old host's IP address to use your new Linode's IP. Contact your nameserver authority for instructions on how to update your DNS records.

{{< disclosure-note "Updating DNS records at common nameserver authorities" >}}
The following support documents describe how to update DNS records at common nameserver authorities:

-   [GoDaddy](https://www.godaddy.com/help/manage-dns-zone-files-680)
-   [DreamHost](https://help.dreamhost.com/hc/en-us/articles/215414867-How-do-I-add-custom-DNS-records)
-   [Gandi](https://doc.gandi.net/en/dns/zone)
-   [1&1](https://www.1and1.com/help/domains/configuring-your-ip-address/connecting-a-domain-to-a-static-ip-address/)
-   [Network Solutions](http://www.networksolutions.com/support/how-to-manage-advanced-dns-records/)
-   [Bluehost](https://my.bluehost.com/hosting/help/559)
-   [HostGator](https://support.hostgator.com/articles/manage-dns-records-with-hostgatorenom)
-   [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain)
-   [Hover](https://help.hover.com/hc/en-us/articles/217282457-How-to-Edit-DNS-records-A-AAAA-CNAME-MX-TXT-SRV-)
{{< /disclosure-note >}}

After DNS propagation has finished, [set reverse DNS](/docs/networking/dns/configure-your-linode-for-reverse-dns/) for your domain. This is especially important if you are running a mail server.

## Next Steps

After completing the steps above, your service should be fully migrated to Linode. It is a good idea to wait a few days before cancelling your shared hosting service to make sure that everything is running smoothly, and to confirm that you don't need to obtain more files from your shared host.
