---
slug: install-restic-shortguide
description: 'A shortguide that shows how to install Restic backup.'
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-07-24
modified_by:
  name: Andy Heathershaw
title: "Install Restic backup"
headless: true
show_on_rss_feed: false
authors: ["Andy Heathershaw"]
---

1. Download the latest version of Restic from [the Github Releases page](https://github.com/restic/restic/releases) (version 0.15.2 at the time of writing):

        wget https://github.com/restic/restic/releases/download/v0.15.2/restic_0.15.2_linux_amd64.bz2

    {{< note respectIndent=false >}}
Ensure you select the correct file for your system. The above command is correct for most Linux distributions on Linode.
{{< /note >}}

1. Extract the downloaded file:

        bzip2 -d restic_0.15.2_linux_amd64.bz2

1. Move the extracted file to your system's `$PATH` and make it executable for all users:

        sudo mv restic_0.15.2_linux_amd64 /usr/local/bin/restic
        sudo chmod ugo+x /usr/local/bin/restic

1. You can now run Restic using the command `restic`:

        restic version

    You should see a similar output:

    {{< output >}}
restic 0.15.2 compiled with go1.20.3 on linux/amd64
{{< /output >}}
