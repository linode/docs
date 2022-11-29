---
title: "Write a Custom Script for Use with StackScripts"
description: "This guide details the StackScript system including script requirements, how to import an existing StackScript into a new StackScript, and more."
keywords: ["automation", "scripts", "deployments", "instance"]
tags: ["linode platform","automation","cloud manager"]
published: 2020-05-21
modified: 2022-11-28
modified_by:
  name: Linode
image: WritingScripts_LinodeStackScripts.png
aliases: ['/platform/stackscripts/writing-scripts-for-use-with-linode-stackscripts-a-tutorial/','/guides/writing-scripts-for-use-with-linode-stackscripts-a-tutorial/']
---

Writing a script for use in a StackScript is generally the same as writing a script that is executed from the command line or another program. This guide includes information about the StackScript system, including the following:

- [Base requirements for any script that is used as a StackScript](#stackscript-requirements).
- [Importing an existing StackScript into your own script for code reuse](#import-a-stackscript).
- [Accessing a StackScript's ID number](#access-a-stackscript-s-id-number).
- [Incorporating user defined fields (UDFs) into your scripts to allow for custom behavior when deploying a new Linode with a StackScript](#user-defined-fields-udfs).
- [Using the StackScript system's default environment variables](#default-environment-variables).

## Before You Begin

When creating a StackScript, most of the time is spent writing the deployment script itself. This script runs the first time a Compute Instance boots up and allows you to configure the system to fit your precise needs and requirements. Before you write the script, consider the following:

- **What is the purpose of your script?** The first question you should ask is *what purpose will your script serve*. Do you want to build a web server? Are you building a script to take care of securing new servers? Consider each task you want your script to perform.

- **Which scripting language should be used for your script?** You can write the StackScript in any language that the distribution supports out of the box. Specifically, you need to specify the interpreter that is used to execute the script. Common scripting languages are bash and python.

- **Which Linux distributions should the script support?** Since each distribution bundles different core software, the commands needed to install applications or configure networking vary between distributions. You need to determine which distributions you want to have available when deploying the Compute Instance. Then, you can customize your script to include commands for those distributions.

- **Which dynamic variables do you want the user to set when deploying a Compute Instance?** Determine what information you wish to collect during deployment. These user variables can be defined through the use of UDF fields within the script. All UDF fields are visible in the Cloud Manager when creating a Compute Instance based on the StackScript.

## Define the Language and Interpreter

The primary requirement for your scripts is that the interpreter needed to execute your script should exist in the Linode base image you are deploying. While Bash is an obvious choice for a script, you may choose any scripting language.

{{< note >}}
Linode images are created using "vanilla" versions of its given distribution. Consult our [Choosing a Linux Distribution](/docs/guides/choosing-a-distribution/) guide to see list of all distributions Linode provides and to access each distribution's corresponding websites. You can find more information on the interpreters available for each distribution on their official websites.
{{</ note >}}

The first line of the script must include a [*shebang*](https://en.wikipedia.org/wiki/Shebang_(Unix)) followed by the path to the interpreter that should be use.

- **Bash:** `#!/bin/bash`
- **Python:** `#!/usr/bin/env python`
- **Python 3:** `#!/usr/bin/python3`

### Import a StackScript

Your scripts can import any Account StackScript that you own or any Community StackScript. This allows you to reuse code minimizing what you need to write in your own scripts.

- The example below shows the syntax to import another StackScript. As a result of including this line in a script, the imported StackScript is downloaded as `ssinclude-[NUMBER]` to your Linode. However, it must be run in order to execute its contents.

    {{< file >}}
<ssinclude StackScriptID="[NUMBER]">
{{</ file >}}

     In Bash, you can download and run the script in the following way:

    {{< file >}}
source <ssinclude StackScriptID="[NUMBER]">
{{</ file >}}

    If you're scripting in another language, import the StackScript, then execute it on a second line:

    {{< file >}}
<ssinclude StackScriptID="[NUMBER]">
./ssinclude-[NUMBER]
{{</ file >}}

- Linode provides a [StackScript Bash Library](https://cloud.linode.com/stackscripts/1) that includes a set of functions that perform various common tasks users might wish to execute on their Linodes. This script creates the functions, but does not run them. A new StackScript can import the Bash Library and then execute functions from it.

    {{< note >}}
Linode's [StackScript Bash Library's](https://cloud.linode.com/stackscripts/1) ID number is `1`.
{{</ note >}}

### Access a StackScript's ID Number

Follow the steps in this section to find the ID number of a StackScript.

1. Log into the [Linode Cloud Manager](https://cloud.linode.com/).

1. Click on the **StackScripts** link in the left-hand navigation menu. You are brought to the *StackScripts* page.

    ![Click on the StackScripts link in the left-hand navigation menu.](stackscripts-sidebar-link.png)

1. Click on the **Account StackScripts** tab or the **Community StackScripts** tab, depending on the type of StackScript whose ID you'd like to find

1. Click on the StackScript whose ID you'd like to access. This brings you to its **StackScript detail page**.

    ![View the details and contents of an Account StackScript.](access-stackscript-detail-page.png)

1. The StackScript detail page's URL displays the StackScript's ID number. You can now use this number to [import the StackScript](#import-a-stackscript) into your own script.

    ![Access a StackScript's ID number.](access-stackscript-id-number.png)

### User Defined Fields (UDFs)

The StackScript system provides a basic markup specification that interfaces with the Linode deployment process. This syntax allows users to customize the behavior of a StackScript on a per-deployment basis. When a StackScript contains a *user defined field (UDF)*, the Linode Cloud Manager presents the UDF as a form field. The user can then insert a corresponding custom value into the field. The values and their related variables are inserted into the script's environment when used to deploy a new Linode.

- Use the following format to insert a UDF tag into a StackScript.

    {{< note >}}
The UDF tags are commented out to prevent execution errors, as the StackScript system parses the tags without removing them.
{{</ note >}}

    {{< file >}}
# <UDF name="example-var" label="An example informative label for the user." default="A default value" example="An example value." />
{{</ file >}}

- A UDF tag accepts the following attributes:

    |**Label**    | **Description**   | **Data Type** |
    |:--------|:----------------------|:---------
    |*name*     | The variable name to use within the StackScript.  {{< note >}}
If you would like to create a masked password input field, use the word `password` anywhere in the UDF `name` attribute.
    {{< /note >}}*required*.    | String. Alphanumeric and underscore, length must be less than 64 characters, and the name must be unique within the StackScript. |
    |*label*    | The form field's label to present to a user in the Linode Cloud Manager. *required*.| String.
    |*default*  | The UDF's default value. If no value is specified by the user, the default value is used when deploying a new Linode with the StackScript.     | String. |
    |*example*  | An example input value to present to a user in the Linode Cloud Manager.| String. |
    |*oneof*      | A comma separated list of acceptable single values for the field. When this attribute is provided, a dropdown menu is presented to a user with a list of values to choose from within the Linode Cloud Manager. Only one value can be selected by the user. If your StackScript uses the *oneof* attribute, you cannot use the *manyof* attribute.| Comma separated list of strings. |
    |*manyof*     | A comma separated list of acceptable values for the field in any quantity, combination, or order. When this attribute is used, a dropdown menu is presented to a user. The menu lists the acceptable values they can choose from with the Linode Cloud Manager. Multiple values can be selected by the user. If your StackScript uses the *manyof* attribute, you cannot use the *oneof* attribute. | Comma separated list of strings. |

{{< note >}}
UDF fields are only usable by scripts written in bash.
{{< /note >}}

### Default Environment Variables

Linode StackScripts provide a set of default environment variables that you can use to provide your script with information about the Linode it has deployed.

| **Environment Variable**               | **Description**                                                                       |
|:-----------------------------------|:------------------------------------------------------------------------------------------|
| `LINODE_ID`           | The deployed Linode's ID number                                                            |
| `LINODE_LISHUSERNAME` | The deployed Linode's full [Linode Shell (LISH)](/docs/guides/using-the-lish-console/) accessible name. |
| `LINODE_RAM`          | The [RAM available on this Linode's plan](/docs/guides/choosing-a-compute-instance-plan/#hardware-resource-definitions).                                                   |
| `LINODE_DATACENTERID` | The ID number of the data center containing the Linode. You can use the [Linode API](https://developers.linode.com/api/v4/regions) to see a list of all data center IDs. |

{{< disclosure-note "Set your Environment Variables Using an External File" >}}

It is possible to set your script's environment variables using externally hosted files. The example Bash script uses the wget utility to download two files named `base.env` and `$IPADDR.env` from the external site `http://example.com/`. The `source` command loads the downloaded files into the script.

{{< file "StackScript" bash >}}
# [...]
IPADDR=$(/sbin/ifconfig eth0 | awk '/inet / { print $2 }' | sed 's/addr://')

wget http://example.com/base.env --output-document=/tmp/base.env
wget http://example.com/$IPADDR.env --output-document=/tmp/system.env

source /tmp/base.env
source /tmp/system.env
# [...]
{{< /file >}}

{{< note >}}
The files you reference within your script must exist and be accessible via `HTTP`. Also, ensure that the files you host externally do not contain any sensitive information.
{{</ note >}}

{{</ disclosure-note >}}

## StackScript Examples

### Using an External Script

## Next Steps

- See [A Tutorial for Creating and Managing StackScripts](/docs/guides/creating-and-managing-stackscripts-a-tutorial/) to learn how to add your script to a StackScript and how to make a StackScript available to the rest of the Linode Community.

- See [A Tutorial for Solving Real World Problems with Bash Scripts](/docs/guides/solving-real-world-problems-with-bash-scripts-a-tutorial/) for a primer on creating Bash scripts.