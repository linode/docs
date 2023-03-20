---
title: "Linode CLI Commands for Compute Instances"
description: "How to use the Linode CLI to create and manage Linode instances."
published: 2020-07-22
modified: 2022-05-02
authors: ["Linode"]
---

Tasks related to Linode instances are performed with `linode-cli linodes [ACTION]`.

1.  List all of the Linodes on your account:

        linode-cli linodes list

    Filter results to a particular region:

        linode-cli linodes list --region us-east

    Filtering works on many fields throughout the CLI. Use `--help` for each action to see which properties are filterable.

1.  Create a new Linode:

        linode-cli linodes create --root_pass mypassword

    The defaults you specified when configuring the CLI will be used for the new Linode's type, region, and image. Override these options by specifying the values:

        linode-cli linodes create --root_pass mypassword --region us-east --image linode/debian9 --group webservers

    If you are not writing a script, it is more secure to use `--root_pass` without specifying a password. You will then be prompted to enter a password:

        linode-cli linodes create --root_pass

1.  For commands targeting a specific Linode, you will need that Linode's ID. The ID is returned when creating the Linode, and can be viewed by listing the Linodes on your account as described above. Store the ID of the new Linode (or an existing Linode) for later use:

        export linode_id=<id-string>

1.  View details about a particular Linode:

        linode-cli linodes view $linode_id

1.  Boot, shut down, or reboot a Linode:

        linode-cli linodes boot $linode_id
        linode-cli linodes reboot $linode_id
        linode-cli linodes shutdown $linode_id

1.  View a list of available IP addresses for a specific Linode:

        linode-cli linodes ips-list $linode_id

1.  Add a private IP address to a Linode:

        linode-cli linodes ip-add $linode_id --type ipv4 --public false

1.  Create a new disk for a Linode:

        linode-cli linodes disk-create $linode_id --size 2700 --root_pass mypassword --filesystem raw --no-defaults

    {{< note >}}
    Even if you set the `--filesystem` to `raw`, the defaults you specified when configuring the CLI will be used for setting a Linode's disk image for this disk, overriding the filesystem setting. To create a disk without the default image, using only the parameters you send in this command, use the `--no-defaults` flag.
    {{< /note >}}

1.  List all disks provisioned for a Linode:

        linode-cli linodes disks-list $linode_id

1.  Upgrade your Linode. If an upgrade is available for the specified Linode, it will be placed in the Migration Queue. It will then be automatically shut down, migrated, and returned to its last state:

        linode-cli linodes upgrade $linode_id

1.  Rebuild a Linode:

        linode-cli linodes rebuild $linode_id --image linode/debian9 --root_pass

1. Rebuild a Linode, adding a populated authorized_keys file:

        linode-cli linodes rebuild $linode_id --image linode/debian9 --root_pass --authorized_keys "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEC+DOVfw+8Jsw1IPrYCcU9/HCuKayCsV8bXjsHqX/Zq email@example.com"

    If your key exists on your filesystem, you can also substitute its value in the CLI command with `cat`. For example:

        linode-cli linodes rebuild $linode_id --image linode/debian9 --root_pass --authorized_keys "$(cat ~/.ssh/id_rsa.pub)"

Many other actions are available. Use `linode-cli linodes --help` for a complete list.
