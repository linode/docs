---
slug: stackscripts-create-linode-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that describes how to deploy a Linode Instance with a StackScript.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-09-16
modified_by:
  name: Heather Zoppetti
published: 2020-09-16
title: Deploy a Linode Instance with a StackScript
keywords: ["stackscripts"]
headless: true
show_on_rss_feed: false
aliases: ['/platform/stackscripts/stackscripts-create-linode-shortguide/']
---

- If you have an existing deployment script, you can use a StackScript to deploy Linode instances with it. The following example StackScript installs PHP on the Linode, downloads an external PHP script from the URL `http://example.com/deployment-script.php`, makes it executable, and then runs the downloaded script.

    {{< file "StackScript" bash >}}
#!/bin/bash
if [ -f /etc/apt/sources.list ]; then
   apt-get upgrade
   apt-get -y install php
elif [-f /etc/yum.conf ]; then
   yum -y install php
elif [-f /etc/pacman.conf ]; then
   pacman -Sy
   pacman -S --noconfirm pacman
   pacman -S --noconfirm php
else
   echo "Your distribution is not supported by this StackScript"
   exit
fi

wget http://example.com/deployment-script.php --output-document=/opt/deployment-script.php
chmod +x /opt/deployment-script.php

./opt/deployment-script.php
    {{< /file >}}

- If you do not want to rely on an existing external server to host your scripts for download, you can embed the bootstrapped script into the StackScript.

    {{< file "StackScript" bash >}}
#!/bin/bash

if [ -f /etc/apt/sources.list ]; then
   apt-get upgrade
   apt-get -y install php5
elif [-f /etc/yum.conf ]; then
   yum -y install php
elif [-f /etc/pacman.conf ]; then
   pacman -Sy
   pacman -S --noconfirm pacman
   pacman -S --noconfirm php
else
   echo "Your distribution is not supported by this StackScript"
   exit
fi

cat >/opt/deployment-script.php <<EOF
#!/usr/bin/php
<?php print('Hello World!'); ?>
EOF

chmod +x /opt/deployment-script.php

./opt/deployment-script.php

    {{< /file >}}
