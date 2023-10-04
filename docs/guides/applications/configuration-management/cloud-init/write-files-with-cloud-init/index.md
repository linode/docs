---
slug: write-files-with-cloud-init
title: "Use Cloud-init to Write to a File"
description: "Find out how you can use cloud-init to automate writing and modifying files during your new servers' initialization."
og_description: "Find out how you can use cloud-init to automate writing and modifying files during your new servers' initialization."
keywords: ['cloud-init','cloudinit','write files','sed']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Nathaniel Stickman"]
published: 2023-09-27
modified_by:
  name: Nathaniel Stickman
external_resources:
- '[Cloud-init Documentation - Module Reference: Write Files](https://cloudinit.readthedocs.io/en/latest/reference/modules.html#write-files)'
- '[Cloud-init Documentation - Examples : Writing Out Arbitrary Files](https://cloudinit.readthedocs.io/en/latest/reference/examples.html#writing-out-arbitrary-files)'
---

[Cloud-init](https://cloudinit.readthedocs.io/en/latest/index.html) is an industry-standard tool that automates server initialization and has cross-distribution, cross-platform support. While the cloud platform provides cloud-init with metadata for server deployment, custom user data lets you script almost every aspect of server initialization.

Akamai's [Metadata](/docs/products/compute/compute-instances/guides/metadata/) service lets you leverage cloud-init for deploying your Compute Instances. Using a cloud-config script, you can define everything you need, from security and user set up to software installation and shell script execution.

In this guide, learn how to use a cloud-config script to write files to your server during initialization. Automate the process of creating and editing files so that from the start your software and system configurations are precisely as you need them.

Before getting started, you should review our guide on how to [Use Cloud-init to Automatically Configure and Secure Your Servers](/docs/guides/configure-and-secure-servers-with-cloud-init/). There, you can see how to create a cloud-config file, which you need to follow along with the present guide. And when you are ready to deploy your cloud-config the guide linked above shows you how.

## Write to a File

Cloud-init includes a module for writing files, using the `write_files` option within your cloud-config script. This module provides the simplest setup when you want to create a new file or overwrite an existing file during initialization.

By default, the `write_files` option takes a file path, creating a new file or overwriting an existing at the given destination. Cloud-init creates any parent directories that do not already exist.

To start off, here is an example that creates an HTML file. The example defines a set of file contents as well as details like ownership and permissions.

```file {title="cloud-config.yaml" lang="yaml"}
write_files:
  - path: /var/www/html/example.com/index.html
    content: |
      <html>
      <body>
        <h1>Hello, World!</h1>
        <p>Welcome to the example web page!</p>
      </body>
      </html>
    owner: 'root:root'
    permissions: '0644'
```

Here is what this example `write_files` configuration is doing.

- `path` points to the location for the created file. Any existing file at the location gets overwritten, and parent directories get created as necessary. This is the one required option for `write_files`.

- `content` defines the content for the file. This can be a single line, or, as above, you can use appropriate Yaml formatting for multi-line file content. Leaving out the `content` option creates an empty file.

- `owner` optionally lets you define a user and/or group to assign ownership of the file to. The default is `root:root`. To specify a user and/or group created within the cloud-config script, you should use the `defer: true` option, as described further below, to ensure the user/group is created before the file.

- `permissions` optionally specifies the file's permissions. Use the format `0###` where `###` is an octal notation as used with `chmod`. You can learn more about permissions and octal notation in our guide on how to [Modify File Permissions with chmod](/docs/guides/modify-file-permissions-with-chmod/#using-octal-notation-syntax-with-chmod).

    The example `permissions` gives the owner user read-write permission (`6--`), read permission for the user's group (`-4-`), and read permission for all other users (`--4`).

An additional `defer` option can be useful when you want to delay creation of the file until the "final stage" of cloud-init's initialization. That way, you can ensure that a file is only created after all user creation and software installation.

Here is an example showing that feature off by creating an [Apache Web Server](/docs/guides/how-to-install-apache-web-server-ubuntu-18-04/) configuration. Using the `defer` option ensures that Apache gets installed and the Apache user (typically `www-data` on Debian and Ubuntu) gets created before the file.

```file {title="cloud-config.yaml" lang="yaml"}
write_files:
  - path: /etc/apache2/sites-available/example.com.conf
    content: |
      <VirtualHost *:80>
          ServerAdmin webmaster@example.com
          ServerName example.com
          ServerAlias www.example.com
          DocumentRoot /var/www/example.com/html/
          ErrorLog /var/www/example.com/logs/error.log
          CustomLog /var/www/example.com/logs/access.log combined
      </VirtualHost>
    owner: 'www-data:www-data'
    permissions: '0640'
    defer: true
```

Omitting the `defer: true` option above would result in an error, since the `www-data` user would not exist at the time cloud-init would attempt to create the file.

## Modify a File

When you need to modify a file, cloud-init has a couple of approaches you can use. The `write_files` option, to start, can actually achieve basic file modifications with its `append: true` option. For instance, the example here modifies the SSH service configuration by adding a `PermitRootLogin no` rule.

```file {title="cloud-config.yaml" lang="yaml"}
write_files:
  - path: /etc/ssh/sshd_config
    content: PermitRootLogin no
    append: true
```

But otherwise, `write_files` can only provide modifications by recreating the files. In that case, you would need to copy the whole configuration with your desired modifications into your cloud-config script.

The more approachable, and maintainable, solution is to use cloud-init's `runcmd` option to run `sed` commands on the server. `sed` provides text editing via shell commands, and `runcmd` lets you run shell commands from a cloud-init script. You can learn more about using `runcmd` in our guide [Use Cloud-init to Run Commands and Bash Scripts on First Boot](/docs/guides/run-shell-commands-with-cloud-init/) and more about `sed` in our guide [Manipulate Text from the Command Line with sed](/docs/guides/manipulate-text-from-the-command-line-with-sed/).

The `runcmd` option takes a list of shell commands. In the example that follows, two shell commands run to change the SSH service configuration, similar to the example above. But here, `sed` lets you replace existing settings, rather than just appending a new setting.

```file {title="cloud-config.yaml" lang="yaml"}
runcmd:
  - sed -i -e 's/PermitRootLogin\s*yes/PermitRootLogin no/g' /etc/ssh/sshd_config
  - sed -i -e 's/#*\s*PermitRootLogin/PermitRootLogin/g' /etc/ssh/sshd_config
```

Each command in the `runcmd` list above makes an edit to the `/etc/ssh/sshd_config` file. Together, these two command effectively switch `PermitRootLogin` to `no` and ensure that the setting is not commented out.

- With the first command, `sed` replaces `PermitRootLogin[any number of spaces]yes` with `PermitRootLogin no`.

- With the second command, `sed` removes the comment marker (`#`) from the beginning of any occurrences of `PermitRootLogin`.

## Verify File Contents

Once your server is up and running, you can use the `cat` command to verify that files have been written as expected. Using `cat` on a file's location, you should see the contents of the file as you dictated them in the cloud-config.

```command
cat /var/www/html/example.com/index.html
```

```output
<html>
<body>
  <h1>Hello, World!</h1>
  <p>Welcome to the example web page!</p>
</body>
</html>
```

You can do the same for file modifications. However, you can make that check more efficient by limiting the output to matching terms. Here, the `sshd_config` contents are filtered to just the lines where cloud-init made changes, the ones containing `PermitRootLogin`.

```command
cat /etc/ssh/sshd_config | grep PermitRootLogin
```

```output
PermitRootLogin no
```

For verifying file permissions, you can use the `stat` command. In the case of the `example.com.conf` file from further above, you would look for the file to be owned by `www-data` and for the `0640` permission.

```command
sudo stat /etc/apache2/sites-available/example.com.conf
```

```output
  File: /etc/apache2/sites-available/example.com.conf
  Size: 284       	Blocks: 8          IO Block: 4096   regular file
Device: 800h/2048d	Inode: 261541      Links: 1
Access: (0640/-rw-r-----)  Uid: (   33/www-data)   Gid: (   33/www-data)
...
```
