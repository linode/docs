---
slug: manage-users-with-cloud-init
title: "Use Cloud-Init to Manage Users on New Servers"
description: "Follow along with this guide to use cloud-init for managing users and user groups on new servers."
authors: ["Nathaniel Stickman"]
contributors: ["Nathaniel Stickman"]
published: 2023-11-15
keywords: ['cloud-init','cloudinit','users','groups']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Cloud-init Documentation - Module Reference: Users and Groups](https://cloudinit.readthedocs.io/en/latest/reference/modules.html#users-and-groups)'
---

[Cloud-init](https://cloudinit.readthedocs.io/en/latest/index.html) is an industry-standard solution for automating server deployments, with support across platforms and distributions. Combining platform metadata with custom user data scripts, cloud-init can vastly simplify the process of initializing new servers.

With Akamai's [Metadata](/docs/products/compute/compute-instances/guides/metadata/) service, you can leverage cloud-init to deploy Compute Instances. A cloud-config user data script can define everything you need to initialize instances, from security and user set up to software installation and shell scripts.

This guide details how to start working with users as part of your cloud-init deployments. Read on for cloud-config scripts to provision users, add SSH keys, and disable remote root access.

Before getting started, you should review our guide on how to [Use Cloud-Init to Automatically Configure and Secure Your Servers](/docs/guides/configure-and-secure-servers-with-cloud-init/). There, you can see how to create a cloud-config file, which you need to follow the present guide. When you are ready to deploy your cloud-config, the guide linked above shows how.

## Create User

Within a cloud-config script, the `users` option handles user creation and most features for managing users. At its simplest, the option can work with as little as a `default` item, ensuring that cloud-init creates the default user. Whatever other users you add, it is recommended that you keep an entry for the `default` user as well.

```file {title="cloud-config.yaml" lang="yaml"}
users:
  - default
```

To create an additional user, add another item to the list with at least a `name` field defining the username. For instance, to create an `example-user`, you can use a configuration like this one.

```file {title="cloud-config.yaml" lang="yaml" hl_lines="3"}
users:
  - default
  - name: example-user
```

The cloud-init process sets up the user with a range of defaults, like a home directory and user group. However, you typically want to take a bit more control of the user creation, especially if you intend to access the user over SSH. Further sections cover features like [assigning groups](#manage-and-assign-groups) (including `sudo` access) and [adding SSH keys](#add-an-ssh-key-to-a-user) to users. In the example below, and the accompanying breakdown, are some additional useful options for managing new users.

```file {title="cloud-config.yaml" lang="yaml" hl_lines="4-7"}
users:
  - default
  - name: example-user
    gecos: Example User,600-700-8090
    shell: /bin/bash
    lock_passwd: false
    passwd: <PASSWORD_HASH>
```

This creates a basic user, accessible by a username and password. Here is an explanation of what each part of the example does:

-   `name`: Defines the username for the user. This field is required.

-   `gecos`: Provides a comment on the user. This is where you can enter GECOS information for the user, such as real name and contact details Each piece of information should be separated by commas.

-   `shell`: Points to a shell for the user. While not required, the user's shell may behave unexpectedly if you do not explicitly provide this field.

-   `lock_passwd`: Whether to disable password logins for the user. The default is `true` as it is recommended to use SSH access instead. This is because, in addition to SSH keys generally being more secure, the password hash is included in the cloud-config, making it more difficult to secure.

-   `passwd`: Defines the password for the user as a password hash. To login with the user using this password, the `lock_passwd` option needs to be set to `false`. You can generate a password hash with the following command:

    ```command
    mkpasswd --method=SHA-512 --rounds=4096
    ```

    {{< note >}}
    The configuration does support a `plain_text_passwd` option, where you can set a user password from plain text, rather than a hash. However, you should not use this option in a production environment, as the password becomes even more vulnerable to exposure.
    {{< /note >}}

For the full range of user configuration options, see cloud-init's [Users and Groups](https://cloudinit.readthedocs.io/en/latest/reference/modules.html#users-and-groups) module reference documentation.

## Manage and Assign Groups

Your cloud-config script can manage user groups either independently using the `groups` option or within a `users` entry. The `groups` option gives you more control of groups themselves and allows you to add existing users, like the default `root` user, to new groups.

Under `groups`, you have a list of groups to be added to the system. Just listing the name of a group, like `user-group` below, creates an empty group. Adding a list of usernames below a group name, as with `admin-group` below, initializes the system with those users belonging to the group.

```file {title="cloud-config.yaml" lang="yaml"}
groups:
  - admin-group:
    - root
  - user-group
```

Cloud-config also supports a `groups` option within each `users` entry. Using this `groups` option provides a more user-centered approach, allowing you to create and assign groups on a user-by-user basis. In the example below, a new `example-group` group is created along with the user, and the user is assigned to that group.

```file {title="cloud-config.yaml" lang="yaml"}
users:
  - name: example-user
    groups:
      - example-group
```

By default, cloud-init creates and assigns each user to a self-named user group. So the user above, `example-user`, actually belongs to two groups: `example-user` and `example-group`. You can set `no_user_group: true` on the user to not create the default `example-user` group.

### Assigning Sudo Access

Cloud-init controls `sudo` access on users primarily through the `sudo` option. This option takes a list of `sudo` rule strings, just they appear in the `sudoers` file. You can learn more about `sudo` access and `sudo` rules in the appropriate sections of our [Linux Users and Groups](/docs/guides/linux-users-and-groups/#understanding-the-sudo-linux-group-and-user) guide.

In the example below, a new `example-user` is created and given `sudo` access. The one rule applied allows the user to run any command as `sudo` after entering the user's password. This example also adds the user to the `sudo` user group.

```file {title="cloud-config.yaml" lang="yaml"}
users:
  - name: example-user
    groups:
      - sudo
    sudo:
      - ALL=(ALL:ALL) ALL
```

Alternatively, you can use the following `sudoers` rule to permit `sudo` access without password entry. This is useful for users that you have set up SSH key access on, but have not provided a password for.

```file {title="cloud-config.yaml" lang="yaml"}
...
    sudo:
      - ALL=(ALL) NOPASSWD:ALL
```

## Add an SSH Key to a User

Using the `ssh_authorized_keys` option, you can authorize a list of SSH public keys for accessing a user remotely. Doing so provides a more secure authorization route than passwords, and so it is recommended over password configuration.

If you do not have an SSH key pair yet, get one by following the relevant section of our guide on how to [Use SSH Public Key Authentication](/docs/guides/use-public-key-authentication-with-ssh/#generate-an-ssh-key-pair).

Once you have the SSH key pair, you can add your SSH public key to the `ssh_authorized_keys` list in the user configuration. In this example, `example-user` has authorized access from two SSH keys:

```file {title="cloud-config.yaml" lang="yaml"}
users:
  - name: example-user
    shell: /bin/bash
    ssh_authorized_keys:
      - <SSH_PUBLIC_KEY_FIRST>
      - <SSH_PUBLIC_KEY_SECOND>
```

With this set up, a machine with the matching SSH private key (typically where you generated the key pair) can access `example-user` over SSH. The SSH key provides the authentication, and does so more securely than manual password entry.

## Disable Root User

From a security perspective, it is generally advisable to disable root login via SSH. This limits the exposure of your root user and the possibility of your system being accessed with full root privileges.

To disable root access over SSH, you need to modify the SSH configuration file and restart your system's SSH service. All of this can be done with a series of shell commands, which cloud-config takes in the `runcmd` option. The example below uses three commands to modify the SSH service configuration:

-   The `sed` command removes any `PermitRootLogin` line already in the configuration file. Any existing setting is thus removed, and this bypasses more complicated commands that try to identify commented-out settings.

-   The `echo` command adds a new `PermitRootLogin` setting to the configuration file, with a value of `no` to disable root logins.

-   The `systemctl` command restarts the SSH service to ensure the setting takes effect immediately.

```file {title="cloud-config.yaml" lang="yaml"}
runcmd:
  - sed -i '/PermitRootLogin/d' /etc/ssh/sshd_config
  - echo "PermitRootLogin no" >> /etc/ssh/sshd_config
  - systemctl restart sshd
```

## Verify User Configuration

Once cloud-init has completed the server's initialization, verify that your user and group configurations have deployed as intended. For several of the components configured throughout this tutorial, the simplest verification is often just connecting to the given user via SSH.

For instance, if your cloud-config created an `example-user` with an SSH key, you should be able to connect to the server as that user via SSH. Replace `192.0.2.17` below with the deployed servers' actual IP address.

```command
ssh example-user@192.0.2.17
```

If you disabled remote root access, you should be able to verify that similarly, attempting to access the server as the `root` user:

```command
ssh root@192.0.2.17
```

To verify in more detail, you can use the `getent` and `groups` commands once you have logged into the server. The former, used with the `passwd` option and the username, provides a summary of a user's details on the system.

In this example, you can see an entry for an `example-user` that has a GECOS comment, home directory, and an assigned shell program:

```command
sudo getent passwd example-user
```

```output
example-user:x:1000:1002:Example User,600-700-8090:/home/example-user:/bin/bash
```

What is lacking above is verification of the user's group. You can get that with the `groups` command followed by the username. The example below does this for `example-user`, showing that the user belongs to a self-named user group along with `example-group`.

```command
sudo groups example-user
```

```output
example-user : example-user sudo example-group
```