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
   apt update
   apt -y install php
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

- The same script can be applied via python using the following syntax:

   {{< file >}}
#!/usr/bin/python3

import os.path

if os.path.isfile('/etc/apt/sources.list'):
   os.system('sudo apt update && sudo apt -y upgrade')
   os.system('sudo apt -y install php php-common')
elif os.path.isfile('/etc/yum.conf'):
   os.system('sudo yum install -y wget && sudo yum -y install php')
elif os.path.isfile('/etc/pacman.conf'):
   os.system('pacman -Sy && pacman -S --noconfirm pacman && pacman -S --noconfirm php')
else:
   print("Your Distribution is not supported by this StackScript")

os.system('wget http://example.com/deployment-script.php --output-document=/opt/deployment-script.php')
os.system('chmod +x /opt/deployment-script.php')

print("StackScript Complete. Thank you!")
{{< /file >}}

- If you do not want to rely on an existing external server to host your scripts for download, you can embed the bootstrapped script into the StackScript.

    {{< file "StackScript" bash >}}
#!/bin/bash

if [ -f /etc/apt/sources.list ]; then
   apt update
   apt -y install php
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

- When using scripts other than bash, the underlying software supporting the scripting language may need to be installed to the operating system as part of the StackScript. This issue can be resolved by creating a simple StackScript in bash to install the required software, and then importing and executing the second StackScript which is using the desired language. For CentOS for example, this StackScript could be used to install python3, and apply a script that was previously created for it:

   {{< file >}}
#!/bin/bash
sudo dnf install -y python3
source <ssinclude StackScriptID=1111>
python3 /root/ssinclude-1111
{{< /file >}}
