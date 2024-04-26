---
slug: run-shell-commands-with-cloud-init
title: "Use Cloud-Init to Run Commands and Bash Scripts on First Boot"
description: "In this tutorial, find out how you can use cloud-init to run shell commands and Bash scripts on first booting up a new server."
authors: ["Nathaniel Stickman"]
contributors: ["Nathaniel Stickman"]
published: 2023-11-15
keywords: ['cloud-init','cloudinit','bash','shell script']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Cloud-init Documentation - Examples: Run Commands on First Boot](https://cloudinit.readthedocs.io/en/latest/reference/examples.html#run-commands-on-first-boot)'
---

[Cloud-init](https://cloudinit.readthedocs.io/en/latest/index.html) is an industry-standard, cross-platform tool that automates the process of initializing new servers. Cloud-init leverages metadata from your cloud platform to handle the deployment while taking custom user data to script the server setup to your needs.

Akamai's [Metadata](/docs/products/compute/compute-instances/guides/metadata/) service lets you deploy Compute Instances using cloud-init. Applying a cloud-config script, you can define everything from security and user setup to software installation and shell script execution.

This guide covers how to use cloud-init to run shell commands as part of server deployment. Whether you need to execute a single shell statement or a full Bash script, cloud-init can automatically run the necessary commands on your system's first boot.

Before getting started, review our guide on how to [Use Cloud-Init to Automatically Configure and Secure Your Servers](/docs/guides/configure-and-secure-servers-with-cloud-init/). There, you can see how to create a cloud-config file, which you need to follow along with this guide. When you are ready to deploy your cloud-config, the guide linked above shows how.

## Run Commands with `runcmd` Directive

The `runcmd` option is the primary way to execute shell commands within cloud-config. The option takes a list of commands, which cloud-init then runs sequentially during the initialization process.

Each command given to `runcmd` can be entered either as a list or as a string. The string directly gives the command, just as you would input the command into the shell. As a list, the first item is the command, and each subsequent item is an option to the command, in order. Execution follows the same approach as [execve(3)](https://linux.die.net/man/3/execve).

To demonstrate, the example below provides a `runcmd` that uses both approaches. Each command runs a similar operation, appending a line to a `/run/test.txt`.

```file {title="cloud-config.yaml" lang="yaml"}
runcmd:
  - echo 'First command executed successfully!' >> /run/testing.txt
  - [ sh, -c, "echo 'Second command executed successfully!' >> /run/testing.txt" ]
```

{{< note >}}
Cloud-init recommends against writing files to the `/tmp/` directory in your cloud-config as that directory is prone to being cleared during boot processes. Instead, cloud-init recommends using the `/run/` directory for temporary files, as in the example above and the examples to follow.
{{< /note >}}

## Run Commands with `bootcmd` Directive

Cloud-init has another option for running commands, `bootcmd`. Within the cloud-config file, `bootcmd` is set up just like `runcmd`, taking a list of commands (which can be either strings or lists themselves).

There are two key features, however, that differentiate `bootcmd`. First, commands given in the `bootcmd` are executed early in the boot process. These commands run among the first tasks of system on boot. Second, they run on every system boot. Where `runcmd` commands only run once, during initialization, `bootcmd` commands become a part of your system's boot process, recurring with each boot.

To use `bootcmd`, the setup within cloud-config only differs from `runcmd` in the option name. Take this example:

```file {title="cloud-config.yaml" lang="yaml"}
bootcmd:
  - echo 'Boot command executed successfully!'
```

Should you need to run a command early in the boot process, but do not want the command to run with each boot, you can still use `bootcmd`. To do so, run the command using cloud-init's `cloud-init-per` utility, which lets you specify execution frequency.

In this next example, an `echo` command is run just as above, but `cloud-init-per` specifies that the command should be run only during instance initialization (`instance`). The `exampleinstanceecho` parameter names the command, and the actual command follows that.

```file {title="cloud-config.yaml" lang="yaml"}
bootcmd:
  - [ cloud-init-per, instance, example-instance-echo, echo, "Instance initialization command executed successfully!" ]
```

## Run a Bash Script

More than just commands, cloud-init's `runcmd` can be used to execute shell scripts. Doing so requires that you deliver the script to the new server and use a shell command (via `runcmd`) to execute the script.

If your script is hosted and accessible remotely, the most straightforward solution is to use a `wget` command to download it. From there, you can use a `runcmd` command to execute the script. [Object Storage](/docs/products/storage/object-storage/get-started/) can provide an effective way to host script files.

However, most use cases favor adding the shell script directly as part of the cloud-init initialization, without hosting the script file elsewhere. In such cases, you can use cloud-init's `write_files` option to create the script file on initialization. To learn more about writing files with cloud-init, read our guide on how to [Use Cloud-Init to Write to a File](/docs/guides/write-files-with-cloud-init/). The guide includes explanations of all the `write_files` options used here.

The example that follows demonstrates how `write_files` and `runcmd` can operate together in your cloud-config to create and execute a shell script. `write_files` creates a simple script file at `/run/scripts/test-script.sh` and gives the script executable permissions. The script `content` runs with Bash and appends a line to the `/run/testing.txt` file. `runcmd` executes the `test-script.sh` file as a command. This example uses the `sh` command to run the shell script:

```file {title="cloud-config.yaml" lang="yaml"}
write_files:
  - path: /run/scripts/test-script.sh
    content: |
      #!/bin/bash

      echo 'Script executed successfully!' >> /run/testing.txt
    permissions: '0755'

runcmd:
  - [ sh, "/run/scripts/test-script.sh" ]
```

## Verify that Commands or Script has Run

After your instance is deployed using cloud-init, verify the successful execution of commands. How you do so varies based on the nature of the commands. However, since many commands generate shell output by default, the most consistent way is to check the output in the cloud-init log file, located at `/var/log/cloud-init-output.log`.

For instance, the example `bootcmd` commands above each use `echo` to output to the terminal. Thus, you can verify those commands by searching the cloud-init logs for the output. The example simplifies the search by using `grep` to filter the logs down to lines containing known output text from the commands.

```command
sudo cat /var/log/cloud-init-output.log | grep 'executed successfully!'
```

```output
Boot command executed successfully!
Instance initialization command executed successfully!
```

Many command-line tools output information to the terminal, and this makes them straightforward to verify using the cloud-init logs. However, some commands output to their own log files. If not, you can always log actions with `echo` commands alongside your main commands. For example, the other commands above that run with `runcmd` output text to a `/run/testing.txt` file.

This may be the case with other commands you run from cloud-init. The command you are using may automatically generate logs, or you may choose to manually incorporate logging, like with the example commands. In either case, reviewing the content of the appropriate log file can confirm cloud-init's successful execution of the commands:

```command
sudo cat /run/testing.txt
```

```output
First command executed successfully!
Second command executed successfully!
Script executed successfully!
```