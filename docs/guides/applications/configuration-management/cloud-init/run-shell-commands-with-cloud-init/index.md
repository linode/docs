---
slug: run-shell-commands-with-cloud-init
title: "Use Cloud-init to Run Commands and Bash Scripts on First Boot"
description: 'In this tutorial, find out how you can use cloud-init to run shell commands and Bash scripts on first booting up a new server.'
og_description: 'In this tutorial, find out how you can use cloud-init to run shell commands and Bash scripts on first booting up a new server.'
keywords: ['cloud-init','cloudinit','bash','shell script']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Nathaniel Stickman"]
published: 2023-10-04
modified_by:
  name: Nathaniel Stickman
external_resources:
- '[Cloud-init Documentation - Examples: Run Commands on First Boot](https://cloudinit.readthedocs.io/en/latest/reference/examples.html#run-commands-on-first-boot)'
---

[Cloud-init](https://cloudinit.readthedocs.io/en/latest/index.html) is an industry-standard, cross-platform tool that automates the process of initializing new servers. Cloud-init leverages metadata from your cloud platform to handle the deployment while taking custom user data to script the server setup to your needs.

Akamai's [Metadata](/docs/products/compute/compute-instances/guides/metadata/) service lets you deploy your Compute Instances using cloud-init. Applying a cloud-config script, you can define everything you need, from security and user set up to software installation and shell script execution.

This guide shows you how to use cloud-init to run shell commands as part of your server deployment. Whether you need to execute single shell statement or a full Bash script, cloud-init can automatically run the necessary commands on your system's first boot.

Before getting started, you should review our guide on how to [Use Cloud-init to Automatically Configure and Secure Your Servers](/docs/guides/configure-and-secure-servers-with-cloud-init/). There, you can see how to create a cloud-config file, which you need to follow along with the present guide. And when you are ready to deploy your cloud-config the guide linked above shows you how.

## Run Commands with `runcmd` Directive

Within cloud-config, the `runcmd` option is the primary way to execute shell commands. The option takes a list of commands for cloud-init to run sequentially during the initialization process.

Each command given to `runcmd` can be entered either:

- As a string. In this case, the string directly expresses the command, just as you would input the command in the shell.

- As a list. In this case, the first item is the command, and each subsequent item is an option to the command, in order. Execution follows the same approach as [execve(3)](https://linux.die.net/man/3/execve).

To demonstrate, the example below gives a `runcmd` that uses both approaches. Each command runs a similar operation, appending a line to a `/run/testing.txt`.

```file {title="cloud-config.yaml" lang="yaml"}
runcmd:
  - echo 'First command executed successfully!' >> /run/testing.txt
  - [ sh, -c, "echo 'Second command executed successfully!' >> /run/testing.txt" ]
```

{{< note >}}
Cloud-init recommends against writing files to the `/tmp/` directory in your cloud-config. During boot processes, that directory is prone to being cleared. Instead, cloud-init recommends using the `/run/` directory for your temporary files, as in the example above and the examples to follow.
{{< /note >}}

## Run Commands with `bootcmd` Directive

Cloud-init has another option for running commands, `bootcmd`. Within your cloud-config file, `bootcmd` is set up just like `runcmd`, taking a list of commands (which can be either strings or lists themselves). There are two key features, however, that differentiate `bootcmd`. Commands given in the `bootcmd` are:

- Executed early in the boot process. These commands run among the first tasks during system boot.

- Run on every system boot. Where `runcmd` commands only run once, during initialization, `bootcmd` commands become a part of your system's boot process, recurring with each boot.

To use `bootcmd`, the setup within your cloud-config only differs from `runcmd` in the option name. Take this example.

```file {title="cloud-config.yaml" lang="yaml"}
bootcmd:
  - echo 'Boot command executed successfully!'
```

Should you need to run a command early in the boot process but do not want the command to run with each boot, you can still use `bootcmd`. To do so, run the command using cloud-init's `cloud-init-per` utility, which lets you specify execution frequency.

In this next example, an `echo` command is run just as above. But here, `cloud-init-per` specifies that the command should be run only during instance initialization (`instance`). The `exampleinstanceecho` parameter names the command, and the actual command follows that.

```file {title="cloud-config.yaml" lang="yaml"}
bootcmd:
  - [ cloud-init-per, instance, example-instance-echo, echo, "Instance initialization command executed successfully!" ]
```

## Run a Bash Script

More than just commands, cloud-init's `runcmd` can be used to execute shell scripts. Doing so requires that you deliver the script to the new server and use a shell command — via `runcmd` — to execute the script.

If your script is hosted and accessible remotely, the most straightforward solution is to use a wget command to download it. From there, you can use a `runcmd` command to execute the script. ([Object Storage](/docs/products/storage/object-storage/get-started/), for instance, can offer an effective solution for hosting files.)

But most often use cases favor adding the shell script directly as part of the cloud-init initialization, without hosting the script file elsewhere. In such cases, you can use cloud-init's `write_files` option to create the script file on initialization. To learn more about writing files with cloud-init, take a look at our guide on how to [Use Cloud-init to Write to a File](/docs/guides/write-files-with-cloud-init/). The guide includes explanations of all the `write_files` options used here.

The following gives you an example of how `write_files` and `runcmd` can operate together in your cloud-config to create and execute a shell script. To elaborate, here is what the two modules accomplish in this example.

- `write_files` creates a simple script file at `/run/scripts/test-script.sh`, and gives the script executable permissions. The script `content` runs with Bash and appends a line to the `/run/testing.txt` file.

- `runcmd` executes the `test-script.sh` file as a command. This example uses the `sh` command to run the shell script.

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

Once you have deployed your server using cloud-init, how to verify that your commands ran successfully depends on what commands you ran. But since many commands generate shell output by default, the most consistent way is to check for that output in the cloud-init log file. You can find the log file at `/var/log/cloud-init-output.log`.

For instance, the example `bootcmd` commands above each use `echo` to output to the terminal. Thus, you can verify those commands by searching the cloud-init logs for the output. The example simplifies the search by using `grep` to filter the logs down to lines containing known output text from the commands.

```command
sudo cat /var/log/cloud-init-output.log | grep 'executed successfully!'
```

```output
Boot command executed successfully!
Instance initialization command executed successfully!
```

Some commands, instead, output to their own log files. And when they do not, you can always log actions with `echo` commands alongside your main commands. A similar case is set up with the other example commands above, run with `runcmd`. These output to a custom log file, `/run/testing.txt`. Reviewing the content of the appropriate log file — whether from the command itself or a custom log — can confirm the commands have run.

```command
sudo cat /run/testing.txt
```

```output
First command executed successfully!
Second command executed successfully!
Script executed successfully!
```
