---
slug: install-nginx-centos
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide for installing NGINX on CentOS.'
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-03-19
modified_by:
  name: Linode
published: 2018-03-19
show_on_rss_feed: false
headless: true
title: Install NGINX on Ubuntu from the Official NGINX Repository
relations:
    platform:
        key: how-to-install-nginx
        keywords:
            - distribution: CentOS 7
tags: ["web server","nginx"]
aliases: ['/web-servers/nginx/install-nginx-centos/']
---

These instructions install NGINX Mainline on CentOS 7 from NGINX Inc's official repository. For other distributions, see the [NGINX admin guide](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/#installing-a-prebuilt-package). For information on configuring NGINX for production environments, see our *[Getting Started with NGINX](/docs/guides/getting-started-with-nginx-part-1-installation-and-basic-setup/)* series.

1.  Create the file `/etc/yum.repos.d/nginx.repo` in a text editor and add the following:

    {{< file "/etc/yum.repos.d/nginx.repo" >}}
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/mainline/centos/7/$basearch/
gpgcheck=0
enabled=1
{{< /file >}}

    {{< note >}}
If you're using a CentOS version other than 7, replace `7` in the `baseurl` in `nginx.repo` file with the correct CentOS version:

`baseurl=http://nginx.org/packages/mainline/<OS>/<OSRELEASE>/$basearch/`
{{< /note >}}

2.  Update yum and install NGINX:

        sudo yum update
        sudo yum install nginx

3.  Ensure NGINX is running and enabled to start automatically on reboot:

        sudo systemctl start nginx
        sudo systemctl enable nginx
