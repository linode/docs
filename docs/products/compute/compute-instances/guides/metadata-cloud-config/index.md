---
title: "Using Cloud-Config Files to Configure a Server"
description: ""
keywords: ["user data", "metadata", "cloud-init", "cloudinit"]
published: 2023-05-03
modified_by:
  name: Linode
authors: ["Linode"]
---

Cloud-config files are supported by our Metadata service and are used by Cloud-Init to automate server configuration. This guide covers creating cloud-config files, common modules, and examples to help get you started.

## Syntax

Cloud-config files are formatted using the YAML data format and must contain `#cloud-config` as the first line. YAML is a common format that's easy to parse and understand. Each key is typically entered on its own line and a colon (`:`) is used to separate the key from its value. The scope of the key is defined by its indentation. To learn more about YAML, review the [latest YAML specification](https://yaml.org/spec/1.2.2/#chapter-2-language-overview).

## Cloud-Config Modules

A cloud-config file must contain `#cloud-config` as the first line. Following that, you can utilize the keys provided by any of the Cloud-Init modules. Review the remaining sections of this guide for a list of common modules and how to configure them. For a full list of modules/keys, review [Cloud-Init Module Reference](https://cloudinit.readthedocs.io/en/latest/reference/modules.html).

## Create a New User

-   `users` *(list)*: Configure user accounts ([Reference](https://cloudinit.readthedocs.io/en/latest/reference/modules.html#users-and-groups) | [Example](https://cloudinit.readthedocs.io/en/latest/reference/examples.html#including-users-and-groups))
    - `name` *(string)*: The name of the user.
    - `passwd` *(string)*: The hash of the password you want to configure for this user.
    - `groups` *(string)*: The name of the group the user should belong to.
    - `sudo`: Define a sudo rule string or set to `False` to deny sudo usage.
    - `lock_passwd` *(boolean)*: If true (the default setting), prevents logging in with a password for that user.
    - `ssh_authorized_keys` *(list)*: A list containing the public keys that should be configured for this user.

```file {lang=yaml}
#cloud-config
users:
- name: example-user
  groups: sudo
  sudo: ALL=(ALL) NOPASSWD:ALL
  shell: /bin/bash
  ssh_authorized_keys:
  - [insert-public-key]
```

## Update System

- `package_update` *(boolean)*: Updates the apt database ([Cloud-Init Docs](https://cloudinit.readthedocs.io/en/latest/reference/examples.html#update-apt-database-on-first-boot))
- `package_upgrade` *(boolean)*: Upgrades the software on your system (by running the yum or apt upgrade command) ([Cloud-Init Docs](https://cloudinit.readthedocs.io/en/latest/reference/examples.html#run-apt-or-yum-upgrade))

```file {lang=yaml}
#cloud-config
package_update: true
package_upgrade: true
```

## Install a Software Package

- `packages` *(list)*: Installs the specified list of packages ([Cloud-Init Docs](https://cloudinit.readthedocs.io/en/latest/reference/examples.html#install-arbitrary-packages))

```file {lang=yaml}
#cloud-config
packages:
 - nginx
 - mysql-server
 - php7.4
```

## Run a Command

- `runcmd` *(list)*: Runs the specified commands during the first boot ([Cloud-Init Docs](https://cloudinit.readthedocs.io/en/latest/reference/examples.html#run-commands-on-first-boot))

```file {lang=yaml}
#cloud-config
runcmd:
 - mkdir ~/new-folder/
```

## Write to a File

-   `write_files` (*list*): ([Cloud-Init Docs](https://cloudinit.readthedocs.io/en/latest/reference/examples.html#writing-out-arbitrary-files))
    - `content`: The entire content to include in the file.
    - `path`: The path for the file. If a file already exists at this location, it is overwritten.
    - `permissions`: Defines the file permissions in octal format (ex: `0644`).

```file {lang=yaml}
#cloud-config
write_files:
- content: |
    <html>
    <h1>Hello world!</h1>

    <p>This is the content of my web page.</p>
    </html>
  path: /var/www/html/index.html
```