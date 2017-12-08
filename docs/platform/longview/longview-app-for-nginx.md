---
author:
  name: Linode
  email: docs@linode.com
description: Longview App for Nginx
keywords: ["Longview", " Nginx", " statistics", " HttpStubStatusModule"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['longview/longview-for-nginx/']
modified: 2013-11-12
modified_by:
  name: Linode
published: 2013-11-05
title: Longview App for Nginx
---

Longview for Nginx is a Longview App. The Longview Nginx tab appears in the Linode Manager when Longview detects that you have Nginx installed on your Linode. With the Longview Nginx App, you'll be able to view statistics for Nginx on your Linode. It can help you keep track of Nginx's settings, workers and requests, system resource consumption, and other information.

## Installing

Prerequisites:

-   Install and start [Nginx](/docs/websites/nginx)
-   Install the [Longview client](/docs/platform/longview/longview/#installing-the-client)

### Debian and Ubuntu Automatic Configuration

If Nginx is installed and running when you install the Longview client, the Nginx App should enable and configure itself automatically.

If you already have Longview installed, and later want to install Ngnix and enable the Longview App for it, you can run Longview through its automatic configuration sequence again. Depending on how Nginx's status module is configured, it will either find everything it needs to get the Nginx App started, or it will pop up a request to make some additional configurations. And don't worry - your old Longview data will stay safe.

1.  Make sure that Nginx is running.
2.  Run the automatic Longview configuration command on your Linode via SSH:

        dpkg-reconfigure -phigh linode-longview

3.  For most people, this will prompt a popup asking whether you would like Longview to attempt an automatic configuration of the Nginx status module:

    [![Longview has detected Nginx running on this server but was unable to access the server status page. Would you like to attempt to automatically configure the Nginx status module? This will require restarting Nginx to enable. Autoconfigure Mod\_Status: \<Yes\> \<No\>](/docs/assets/1456-longview_ngnix_popup_crop.png)](/docs/assets/1456-longview_ngnix_popup_crop.png)

    {{< note >}}
It's also possible that Longview will be able to locate the status page on its own. In that case, you won't get the popup, and you can go directly to Step 5.
{{< /note >}}

4.  This popup occurs when Longview can't locate the Nginx status page. In turn, this could indicate that the status page is in an unusual and unspecified location, or that the status module isn't enabled, or that Nginx itself is misconfigured. Select one of the options:

    -   **\<No\>**: the Longview tool will quit, and you can do a [manual configuration](#manual-configuration-all-distributions), which is safer if you have a delicate Nginx setup.
    -   **\<Yes\>**: the Longview tool will attempt to enable the status module, set the status page location in a new vhost configuration file, and restart Nginx. This option is easier, but has the potential to disrupt your current Nginx configuration. If you choose yes, and the configuration is successful, you should see output like the following:

            [ ok ] Stopping Longview Agent: longview.
            Checking Nginx configuration...
            Restarting nginx: nginx.
            Finished configuring nginx, writing new configuration to /etc/linode/longview.d/Nginx.conf
            [ ok ] Starting Longview Agent: longview.
            update-rc.d: using dependency based boot sequencing

    {{< note >}}
The automatic configuration sets the status page location to `http://127.0.0.2/nginx_status`.
{{< /note >}}

5.  Refresh the Longview Nginx tab in the Linode Manager to verify that it's working now.

If instead you receive a failure message, such as:

    [FAIL] Reloading web server config: nginx failed!

You will need to double-check your Nginx installation, and then do a [manual configuration](#manual-configuration-all-distributions). You can also visit the [Troubleshooting](#troubleshooting) section at the end of this article.

### Manual Configuration (All Distributions)

To enable the Nginx Longview app manually, follow these steps on your Linode via SSH:

1.  Add the following lines to your Nginx configuration to enable the status module and set the location of the status page. The lines can go at the end of the main configuration file at `nginx.conf` or in a separate vhost configuration file:

    {{< file-excerpt "nginx.conf" >}}
server {
    listen 127.0.0.1:80;
    server_name 127.0.0.1;
    location /nginx_status {
        stub_status on;
        allow 127.0.0.1;
        deny all;
    }
}

{{< /file-excerpt >}}


2.  Restart Nginx:

        service nginx restart

3.  Edit `/etc/linode/longview.d/Nginx.conf` to look like the following:

    {{< file "/etc/linode/longview.d/Nginx.conf" >}}
location http://127.0.0.1/nginx_status

{{< /file >}}


4.  Restart Longview:

        service longview restart

5.  Refresh the Longview Nginx tab in the Linode Manager.

You should now be able to see Longview data for Nginx. If that's not the case, proceed to the [Troubleshooting](#troubleshooting) section at the end of this article.

## Viewing Statistics

To see the output for the Longview Nginx App:

1.  Log in to the [Linode Manager](https://manager.linode.com/).
2.  Select the **Longview** tab.
3.  Select the **Nginx** tab.

Click the image for a full-size view.

[![The Longview Nginx App.](/docs/assets/1455-longview_nginx_stats_sm.png)](/docs/assets/1454-longview_nginx_stats.png)

You'll see the current version of Nginx listed on the upper right.

Mouse over a data point to see the exact numbers for that time. You can also zoom in on data points, or view older time periods with Longview Pro. For details, jump to this section in the main article about [navigating the Longview interface](/docs/platform/longview/longview#using-the-interface). The next sections cover the Longview Nginx App in detail.

### Requests

The **Requests** graph shows the total number of requests Nginx handled at the selected time. This is every HTTP and HTTPS request to your Linode.

### Connections

The **Connections** graph shows the amount of data that Nginx accepted and handled via web requests at the time selected.

### Workers

The **Workers** graph shows all of the Nginx workers at the selected time. The workers are broken down by state:

-   Waiting
-   Reading
-   Writing

### CPU

The **CPU** graph shows the percentage of your Linode's CPU being used by Nginx at the selected time. If you want to see the total CPU use instead, check the [Overview tab](/docs/platform/longview/longview#overview-tab).

### Memory

The **Memory** graph shows the amount of RAM being used by Nginx at the selected time. If you want to see your Linode's total memory use instead, check the [Overview tab](/docs/platform/longview/longview#overview-tab).

### Disk IO

The **Disk IO** graph shows the amount of input to and output from the disk caused by Nginx at the selected time. To see the total IO instead, visit the [Disks tab](/docs/platform/longview/longview#disks-tab).

### Process Count

The **Process Count** graph shows the total number of processes on your Linode spawned by Nginx at the selected time. If you want to see more details, and how this stacks up against the total number of processes on your Linode, see the [Process Explorer tab](/docs/platform/longview/longview#process-explorer-tab).

## Troubleshooting

If you don't see Longview data for Nginx, you'll instead get an error on the page and instructions on how to fix it. As a general tip, you can check the `/var/log/linode/longview.log` file for errors as well.

### Unable to Access Server Status Page for Nginx

More specifically, the error will state `Unable to access server status page (http://example.com/example) for Nginx: <error>`. This error occurs when Nginx's status setting is disabled or has been changed from the default location.

 {{< note >}}
This error occurs when Longview attempts to check the status page `location` listed in `/etc/linode/longview.d/Nginx.conf`, or the default page at `http://127.0.0.1/nginx_status`, but receives a non-200 HTTP response code. Basically, it means that the status page Longview is checking doesn't exist.
{{< /note >}}

To fix this, follow these steps:

1.  Make sure Nginx is running:

        service nginx restart

2.  Check the status page location, and make sure it's available over Port 80. The default location Longview checks is `http://127.0.0.1/nginx_status` on localhost, but Nginx doesn't typically have a status page location set up by default. In the Nginx configuration file (typically `nginx.conf` or a vhost configuration file), this is designated with the lines:

    {{< file-excerpt "nginx.conf" >}}
server {
    listen 127.0.0.1:80;
    server_name 127.0.0.1;
    location /nginx_status {
        stub_status on;
        allow 127.0.0.1;
        deny all;
    }
}

{{< /file-excerpt >}}



3.  Longview is designed to check the default location automatically. If you use the default location shown above, you should be done. Refresh the Longview Nginx tab in the Linode Manager to verify that it's working now.
4.  If you're not using the default location, you need to create a new file, `/etc/linode/longview.d/Nginx.conf`, and set the `location` variable to match what you set in the Nginx configuration file:

    {{< file "/etc/linode/longview.d/Nginx.conf" >}}
location http://127.0.0.1/url-goes-here

{{< /file >}}


5.  Restart Longview:

        service longview restart

6.  Refresh the Longview Nginx tab in the Linode Manager to verify that it's working now.

 {{< note >}}
If you originally compiled Nginx without the status module, you will need to recompile it with `--with-http_stub_status_module` and all your other settings. Then go back and try to enable the Longview Nginx App.
{{< /note >}}

### The Nginx Status Page Doesn't Look Right

More specifically, the error will state `The Nginx status page doesn't look right. Check <http://example.com/example> and investigate any redirects for misconfiguration.` This error occurs when Longview is able to reach the status page, but doesn't receive the expected content.

 {{< note >}}
This error occurs when Longview attempts to check the status page, and receives a 200 HTTP response code, but can't scrape the expected status content from the page. That is, the page exists on your Linode, but it doesn't have the right content. If, for example, Longview was to check your website's home page, you would get this error.
{{< /note >}}

To resolve this issue, follow these steps:

1.  Visit the URL shown in the error. See if it directs or redirects you to a page that isn't the Nginx status page.
2.  Update your Nginx and Longview settings so that they specify the same location:

    -   The **server\_name** and **location** lines in your Nginx configuration file
    -   The **location** line in `/etc/linode/longview.d/Nginx.conf`

    If the location line isn't set in `/etc/linode/longview.d/Nginx.conf`, Longview will check the default location of `http://127.0.0.1/nginx_status` on localhost.

3.  Make sure there aren't any Nginx redirects or other settings that are affecting this page.
4.  Restart Longview:

        service longview restart

5.  Refresh the Longview Nginx tab in the Linode Manager to verify that it's working now.

### Nginx Tab is Missing

If the Longview Nginx tab is missing entirely, this indicates that Nginx is either not installed, or has stopped. If you restart Nginx, you will be able to see the tab again and view all of your old data.
