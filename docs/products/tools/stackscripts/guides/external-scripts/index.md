---
title: "Use an Externally Hosted Deployment Script"
description: "Learn how to download an external script and use it within a StackScript."
aliases: ['/products/tools/stackscripts/guides/stackscripts-create-linode/']
published: 2020-04-22
modified: 2022-11-30
authors: ["Linode"]
---

## External Deployment Script

If you have an existing deployment script, you can use a StackScript to deploy Linode instances with it. The following example StackScript installs PHP on the Linode, downloads an external PHP script from the URL `http://example.com/deployment-script.php`, makes it executable, and then runs the downloaded script.

### Bash Example

```file {title="Bash StackScript Example" lang="bash"}
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
```

### Python Example

The same script can be applied via python using the following syntax:

```file {title="Python StackScript Example" lang="python"}
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
```

## Embedded Deployment Script

If you do not want to rely on an existing external server to host your scripts for download, you can embed the bootstrapped script into the StackScript.

```file {title="Embedded Script Example" lang="bash"}
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
```

## Install Software Dependencies

When using scripts other than bash, the underlying software supporting the scripting language may need to be installed to the operating system as part of the StackScript. This issue can be resolved by creating a simple StackScript in bash to install the required software, and then importing and executing the second StackScript which is using the desired language. For CentOS for example, this StackScript could be used to install python3, and apply a script that was previously created for it:

```file {title="Example StackScript to Install Dependencies" lang="bash"}
#!/bin/bash
sudo dnf install -y python3
source <ssinclude StackScriptID=1111>
python3 /root/ssinclude-1111
```