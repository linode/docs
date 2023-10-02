---
slug: how-to-deploy-rshiny-server-on-ubuntu-and-debian
description: 'Shiny is an R library that enables the creation of interactive data visualizations. This guide will show how to deploy an R Shiny app using Shiny Server.'
keywords: ["r", "data visualization", "shiny", "web app"]
tags: ["web applications"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-02-07
modified: 2018-02-07
modified_by:
  name: Linode
title: 'How to Deploy Interactive R Apps with Shiny Server'
external_resources:
  - '[Shiny Server – Introduction](https://shiny.rstudio.com/articles/shiny-server.html)'
  - '[Gallery of Shiny Apps](https://shiny.rstudio.com/gallery/)'
audiences: ["beginner"]
concentrations: ["Scientific Computing and Big Data"]
languages: ["r"]
aliases: ['/development/r/how-to-deploy-rshiny-server-on-ubuntu-and-debian/']
authors: ["Jared Kobos"]
---

![How to Deploy Interactive R Apps with Shiny Server](shiny-server.jpg)

## What is Shiny?

[Shiny](https://shiny.rstudio.com/) is a library for the R programming language that allows you to create interactive web apps in native R, without needing to use web technologies such as HTML, CSS, or JavaScript. There are many ways to deploy Shiny apps to the web; this guide uses Shiny Server to host an example Shiny app on a Linode.

## Before You Begin

If you do not have RStudio installed on your local computer, follow our [How to Deploy RStudio Using an NGINX Reverse Proxy](/docs/guides/how-to-deploy-rstudio-server-using-an-nginx-reverse-proxy/) guide to set up a remote workstation on a Linode.

## Build a Shiny Test App

Shiny Server comes with pre-installed demo apps. However, in order to demonstrate the process of deploying an app, you will create an app locally and deploy it to a Shiny Server on a Linode.

1.  Open RStudio and install the Shiny package:

        install.packages('shiny')

2.  In the **File** menu, under **New File**, select **Shiny Web App...**. When prompted, choose a name for your project. Select **Multiple File** and choose a directory to store the new app's files.

    ![Create New Shiny App](create-shiny-app.png "Create New Shiny App")

3.  Rstudio automatically opens two new files: `ui.R` and `server.R`. These files are pre-filled with a demo app that will create an interactive histogram of R's built-in Old Faithful data set. Edit `server.R` to adjust the formatting of the histogram according to your tastes. For example, to change the bars to red with a black border:

        hist(x, breaks = bins, col = 'red', border = 'black')

4.  To test the project locally, click **Run App** in the upper right corner of the text editor.

5.  Save the project and copy the files to your Linode. Replace `username` with your Unix account username and `linodeIP` with the public IP address or domain name of your Linode:

        scp -r ~/shiny/Example username@linodeIP:/home/username

## Deploy a Shiny App to a Remote Server

The steps in this section should be completed on your Linode.

### Install R

{{< content "install_r_ubuntu" >}}

### Add the Shiny Package

Use `install.packages()` to add the Shiny package:

    sudo su - \
    -c "R -e \"install.packages('shiny', repos='https://cran.rstudio.com/')\""

### Install Shiny Server

1.  Install `gdebi`:

        sudo apt install gdebi-core

2.  Download Shiny Server:

        wget https://download3.rstudio.org/ubuntu-12.04/x86_64/shiny-server-1.5.6.875-amd64.deb

3.  Use `gdebi` to install the Shiny Server package:

        sudo gdebi shiny-server-1.5.6.875-amd64.deb

4.  The `shiny-server` service should start automatically. Check its status:

        sudo systemctl status shiny-server.service

5.  In a browser, navigate to your Linode's public IP address or FQDN on port `3838` (e.g. `example.com:3838`). You should see the Shiny Server welcome page:

    ![Shiny Server Welcome Page](shiny-welcome.png "Shiny Server Welcome Page")

### Deploy Your App

By default, Shiny Server uses `/srv/shiny-server/` as its site directory. Any Shiny apps in this directory will be served automatically.

1.  Copy the example app directory into `/srv/shiny-server/`:

        sudo cp -r Example/ /srv/shiny-server/

2.  In a web browser, navigate to the app's address. Replace `example.com` with your Linode's public IP address or FQDN:

        example.com:3838/Example

    You should see your app displayed:

    ![Shiny Demo App](shiny3.png "Shiny Demo App")

### Configure Shiny Server

Shiny Server's configuration file is stored at `/etc/shiny-server/shiny-server.conf`:

{{< file "/etc/shiny-server/shiny-server.conf" >}}
# Instruct Shiny Server to run applications as the user "shiny"
run_as shiny;

# Define a server that listens on port 3838
server {
  listen 3838;

  # Define a location at the base URL
  location / {

    # Host the directory of Shiny Apps stored in this directory
    site_dir /srv/shiny-server;

    # Log all Shiny output to files in this directory
    log_dir /var/log/shiny-server;

    # When a user visits the base URL rather than a particular application,
    # an index of the applications available in this directory will be shown.
    directory_index on;
  }
}
{{< /file >}}

You can edit the port that Shiny Server will listen on, or change the site directory from which apps are served. The `directory_index` option allows visitors to view the contents of a directory by navigating to that path (for example, visiting `example.com:3838/sample-apps` will show a list of the example apps included in the Shiny Server installation). You can disable this behavior and hide the contents of directories by setting this option to `off`. For more information about configuring Shiny Server, see the official [Administrator's Guide](http://docs.rstudio.com/shiny-server/).

After making changes to this file, restart the `shiny-server` service:

      sudo systemctl restart shiny-server.service

## Next Steps

In order to keep the deployed app up-to-date with changes made in your local environment, consider using a more sophisticated deployment method such as Git or Rsync. Production deployments may also want to run Shiny Server behind a reverse proxy to make use of additional security and optimization features.
