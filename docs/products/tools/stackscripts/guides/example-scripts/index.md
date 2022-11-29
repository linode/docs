---
title: Example Scripts
title_meta: A Collection of Example Scripts for StackScripts
description: ""
published: 2022-11-29
modified_by:
  name: Linode
aliases: ['/platform/stackscripts/creating-and-managing-stackscripts-a-tutorial/','/guides/creating-and-managing-stackscripts-a-tutorial/','/products/tools/stackscripts/guides/stackscripts-edit-stackscript/','/products/tools/stackscripts/guides/stackscripts-delete-stackscript/']
---

## Basic Script

The file below displays an example of a simple script that executes some basic set up steps on a Linode. Review the example's comments for details on what each line of the script does.

```file {title="Example Script" lang="bash"}
#!/bin/bash
# This block defines the variables the user of the script needs to provide
# when deploying using this script.
#
#
#<UDF name="hostname" label="The hostname for the new Linode.">
# HOSTNAME=
#
#<UDF name="fqdn" label="The new Linode's Fully Qualified Domain Name">
# FQDN=

# This sets the variable $IPADDR to the IP address the new Linode receives.
IPADDR=$(/sbin/ifconfig eth0 | awk '/inet / { print $2 }' | sed 's/addr://')

# This updates the packages on the system from the distribution repositories.
apt-get update
apt-get upgrade -y

# This section sets the hostname.
echo $HOSTNAME > /etc/hostname
hostname -F /etc/hostname

# This section sets the Fully Qualified Domain Name (FQDN) in the hosts file.
echo $IPADDR $FQDN $HOSTNAME >> /etc/hosts
```