---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-05-21
modified_by:
  name: Linode
title: "Index"
h1_title: "h1 title displayed in the guide."
contributor:
  name: Your Name
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

## Developing StackScripts

The only requirements to run a StackScript are that the first line of the script should contain a shebang such as `#!/bin/bash` and the interpreter specified in the shebang should be installed in the Linode base image you are deploying. While `Bash` is an obvious choice for StackScripts, you may choose any language or system.

**Community StackScripts**, are scripts created by Linode and other community members which are made available publicly to other users. Depending on the type of the script you develop, you may consider sharing your script in this library so that others may deploy instances using the script.

The syntax to pull another StackScript is:

    <ssinclude StackScriptID="[NUMBER]">

This downloads the StackScript on the Linode as `ssinclude-[NUMBER]`. To download and run the script (assuming it's written as a Bash script) use:

    source <ssinclude StackScriptID="[NUMBER]">

If you're scripting in another language, execute the script on a second line, as seen below:

    <ssinclude StackScriptID="[NUMBER]">
    ./ssinclude-[NUMBER]


### Bootstrapping StackScripts

If you have an existing deployment script, you can use StackScripts to deploy instances with this script. Consider the following methods for *bootstrapping* one script with StackScripts:

{{< file "StackScript" bash >}}
#!/bin/bash

wget http://example.com/ --output-document=/opt/deployment-script.pl
chmod +x /opt/deployment-script.pl

./opt/deployment-script.pl

{{< /file >}}


This approach is useful for bootstrapping scripts written in languages that are not included in the default instance template, as in the following example:

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

wget http://example.com/ --output-document=/opt/deployment-script.php
chmod +x /opt/deployment-script.php

./opt/deployment-script.php

{{< /file >}}


If you do not want to rely on an existing external server to host your scripts for download, you can embed the bootstrapped script in the StackScript. Consider the following example:

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


### Using StackScripts from the Linode API

The [Linode API](http://www.linode.com/api/index.cfm) contains support for managing StackScripts and deploying instances with StackScripts. Consider the documentation of the following Linode API methods:

-   [avail.stackscripts](https://www.linode.com/api/utility/avail.stackscripts)
-   [stackscript.create](https://www.linode.com/api/stackscript/stackscript.create)
-   [stackscript.list](https://www.linode.com/api/stackscript/stackscript.list)
-   [stackscript.update](https://www.linode.com/api/stackscript/stackscript.update)
-   [linode.disk.createfromstackscript](https://www.linode.com/api/linode/linode.disk.createfromstackscript)

    {{< note >}}
To create a disk with `linode.disk.createfromstackscript`, you need to first create a configuration profile and attach the disk to the profile before you can boot and run the StackScript.
{{< /note >}}

### Variables and UDFs

The StackScript system provides a basic markup specification that interfaces with the Linode deployment process so that users can customize the behavior of a StackScript on a per-deployment basis. These `UDF` tags, when processed, insert variables and values into the script's environment.

The UDF tags are explained in the table below:

|Label    | Description           | Requirements
|:--------|:----------------------|:---------
|name     | The variable name     | Alphanumeric, len <64, must be unique
|label    | The question to ask   | Text 0-255
|default  | The default value     | If not specified then this UDF is required
|example  | Example input         |
|oneof    | A comma separated list of values| Optional
|manyof   | A comma separated list of values| Optional


Here is an example implementation of the UDF variables. The UDF tags are commented out to prevent execution errors, as the StackScript system parses the tags without removing them:

{{< file "StackScript" bash >}}
# [...]
# <UDF name="var1" Label="A question" default="" example="Enter something here." />
# <UDF name="var2" Label="Pick one of" oneOf="foo,bar" example="Enter something here." />
# <UDF name="var3" Label="A question" oneOf="foo,bar" default="foo" />
# <UDF name="var4" Label="Pick several from" manyOf="foo,bar" default="foo,bar" />
# [...]
{{< /file >}}

{{< note >}}
If you would like to create a masked password input field, use the word 'password' anywhere in the UDF name.
{{< /note >}}

There are also a set of Linode created environmental variables that can be used for API calls or other tasks from within the script.

| Environment Variable               | Description                                                                               |
|:-----------------------------------|:------------------------------------------------------------------------------------------|
| `LINODE_ID=123456`                 | The Linode's ID number                                                                    |
| `LINODE_LISHUSERNAME=linode123456` | The Linode's full lish-accessible name                                                    |
| `LINODE_RAM=1024`                  | The RAM available on this Linode's plan                                                   |
| `LINODE_DATACENTERID=6`            | The ID number of the data center containing the Linode. See our API for more information. |


If you do not want to use the StackScript system to set your environment variables, you might consider hosting files with settings on a different system.For example, use the following fragment:

{{< file "StackScript" bash >}}
# [...]
IPADDR=$(/sbin/ifconfig eth0 | awk '/inet / { print $2 }' | sed 's/addr://')

wget http://example.com/base.env --output-document=/tmp/base.env
wget http://example.com/$IPADDR.env --output-document=/tmp/system.env

source /tmp/base.env
source /tmp/system.env
# [...]

{{< /file >}}


Make sure that there are files accessible through `HTTP` hosted on the `example.com` domain for both basic environment files such as `base.env` and machine specific files such as `[ip-address].env` before launching this StackScript. Also consider the possible security implications of allowing any file with sensitive information regarding your deployment to be publicly accessible.
