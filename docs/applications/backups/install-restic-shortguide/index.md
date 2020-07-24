---
author:
  name: Andy Heathershaw
  email: andy@andysh.uk
description: 'A shortguide that shows how to install Restic backup.'
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-07-24
title: "Install Restic backup"
headless: true
show_on_rss_feed: false
---
Download the latest version of Restic from [the Github Releases page](https://github.com/restic/restic/releases) (version 0.9.6 at the time of writing):

    wget https://github.com/restic/restic/releases/download/v0.9.6/restic_0.9.6_linux_amd64.bz2
    
{{< note >}}
Ensure you select the correct file for your system. The above command is correct for most Linuxes on Linode.
{{< /note >}}

Extract the downloaded file:

    bzip2 -d restic_0.9.6_linux_amd64.bz2
    
Move it to somewhere in your PATH and make it executable for all users:

    sudo mv restic_0.9.6_linux_amd64 /usr/local/bin/restic
    sudo chmod ugo+x /usr/local/bin/restic
    
You can now run Restic using the command "restic":

    restic version
    
{{< output >}}
restic 0.9.6 compiled with go1.13.4 on linux/amd64
{{< /output >}}