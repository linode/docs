---
slug: using-ssh-agent
description: "ssh-agent manages keys and passwords for SSH, and it can make connecting to clients quicker and easier. Find out how ssh-agent works and how you can set it up to start using for your SSH connections."
keywords: ['start ssh agent','how to use ssh agent','ssh agent list keys']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-11-10
modified_by:
  name: Nathaniel Stickman
title: "Use ssh-agent to Manage Private Keys"
title_meta: "How to Use ssh-agent to Manage Private Keys"
external_resources:
- '[die.net: ssh-agent(1)](https://linux.die.net/man/1/ssh-agent)'
- '[SSH: ssh-agent](https://www.ssh.com/academy/ssh/agent)'
- '[Smallstep: SSH Agent Explained](https://smallstep.com/blog/ssh-agent-explained/)'
authors: ["Nathaniel Stickman"]
---

ssh-agent manages private keys for SSH connections, facilitating smoother SSH experiences and allowing you to use SSH sessions across programs. This guide aims to give you a full walkthrough of ssh-agent. The tutorial herein explains what ssh-agent is capable of and shows you how to use it.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What is ssh-agent?

ssh-agent is a program by OpenSSH that stores private keys for SSH authentication. The agent can start up an authentication session using a key. It then provides that authentication across programs and windows on your system.

In other words, ssh-agent provides a kind of single sign-on (SSO) service for your system. It allows you to authenticate an SSH connection once, then use that authentication across multiple programs.

ssh-agent works by starting up a client when you initially authenticate an SSH connection. The agent then keeps that authentication in memory and acts as a client for any other programs that attempt to make additional SSH connections.

### What is ssh-agent Forwarding?

The ssh-agent tool also has an agent forwarding feature. This allows an ssh-agent client to utilize authorization from a distant ssh-agent acting as an SSH server.

The most common use case for this feature utilizes a locally stored key on a remote server. For instance, say there's a remote machine you want to connect to through a bastion server using a key stored locally. Agent forwarding allows your local ssh-agent to share the authentication key with the bastion server's ssh-agent. This gives the bastion server the ability to connect to the remote host.

Continue reading to learn how to [enable agent forwarding](/docs/guides/using-ssh-agent/#enabling-ssh-agent-forwarding) for your ssh-agent sessions.

## How to Use ssh-agent

The next sections show you how to use ssh-agent on your Linux system. For the most basic use cases, the sections on starting ssh-agent and adding keys are all you need to get started.

Follow the section on applying the ssh-agent for more details on the process and additional ssh-agent options. Finally, the section on enabling agent forwarding breaks down the steps and options for that feature.

### Starting Up ssh-agent

Most Linux systems include ssh-agent by default, but you must enable it. The `ssh-agent` command outputs a series of commands which set the environmental variables needed by ssh-agent.

1.  Use the following command to execute the `ssh-agent` commands and enable ssh-agent for your current shell session:

    ```command
    eval `ssh-agent`
    ```

    {{< note respectIndent=false >}}
Adding that command as a line to your `~/.bashrc` file automatically enables ssh-agent at system start up.
    {{< /note >}}

1.  Verify that ssh-agent is running by checking for the `SSH_AUTH_SOCK` environmental variable:

    ```command
    echo $SSH_AUTH_SOCK
    ```

    {{< output >}}
/tmp/ssh-qmq8m7V80sRi/agent.42596
    {{< /output >}}

### Adding Keys to ssh-agent

Before you can use ssh-agent, you need to add at least one key. The `ssh-add` command automatically adds all private keys stored within the `~/.ssh` directory. That includes `~/.ssh/id_rsa`, the default location for most SSH private keys:

```command
ssh-add
```

{{< output >}}
Identity added: /home/example-user/.ssh/id_rsa (example-user@localhost)
{{< /output >}}

Should you need to specify a particular key location, you can provide the path to the key as an argument to `ssh-add`. This example adds a key stored at `~/my_documents/ssh/example-user.private_key`:

```command
ssh-add ~/my_documents/ssh/example-user.private_key
```

You can subsequently get a list of all the keys currently added to ssh-agent using the `-l` option. This lists the identifiers for the keys that are set up for ssh-agent:

```command
ssh-add -l
```

{{< output >}}
3072 SHA256:<KEY_ID> example-user@localhost (RSA)
{{< /output >}}

### Applying the ssh-agent

Your ssh-agent is now fully operational. Connecting to a remote machine over SSH using one of the keys added to your ssh-agent starts an agent session. At that point, you can leverage ssh-agent for authentication across multiple programs.

The start-up command provided above can be expanded with some options. These let you have more control over how ssh-agent operates. The following are some of the more useful of these options:

-   `-a` lets you specify a bind address for ssh-agent socket. This address corresponds to a location on your machine. By default, ssh-agent uses a somewhat random path following the format `/tmp/ssh-<RANDOM_STRING>/agent.<PID>`.

    {{< note respectIndent=false >}}
ssh-agent restricts this location's permissions to the current user. You should ensure similar permissions if you specify a custom bind address.
    {{< /note >}}

    Here is an example that binds the ssh-agent socket at `~/ssh-socket/ssh-agent`:

    ```command
    eval `ssh-agent -a ~/ssh-socket/ssh-agent`
    ```

-   `-t` lets you specify a number of seconds as the maximum lifetime of identities added to the agent. Otherwise, the agent keeps keys stored in memory as long as the agent is running.

    This example limits identity lifetime to 24 hours (86,400 seconds):

    ```command
    eval `ssh-agent -t 86400
    ```

-   `-k` kills the currently running ssh-agent, using current environmental variables to identify the agent:

    ```command
    eval `ssh-agent -k`
    ```

To see a full list of available options, refer to the man page for `ssh-agent`, or see the `die.net` link at the end of this tutorial.

### Enabling ssh-agent Forwarding

Agent forwarding lets your local ssh-agent pass keys to remote ssh-agents for authenticating further connections. This feature can be useful for certain use cases. For instance, connecting to a remote host through a bastion server, or connecting to a private GitHub repository on a remote machine.

The agent forwarding feature can be activated once you have everything else set up for your local ssh-agent. The following steps walk you through the specifics. You have some options when it comes to configuring agent forwarding, which are also covered here.

1.  Follow the directions above on your local machine (where the keys are stored) to start up ssh-agent and add your private keys. You should not take these steps on the remote machines.

1.  Two options are available for enabling agent forwarding. These options differ in their balance of accessibility and security, so keep that in mind when deciding which to use.

    -   The simplest method is to use the `-A` flag with the `ssh` command. This enables agent forwarding for a single SSH session. The process is simple to start with and offers security by limiting the forwarding to a single session.

        For example, to use agent forwarding for your SSH session to a user named `example-user` on a remote host at `192.0.2.1`, you can use:

        ```command
        ssh -A example-user@192.0.2.1
        ```

    -   A more permanent solution is to adjust the configuration file for the ssh-agent. Specifically, you need to add a configuration with `ForwardAgent yes` for the destination machine.

        The ssh-agent configuration file should be located at `~/.ssh/config`. You may need to create the file if it does not already exist.

        This example works for forwarding authentication to a remote machine at `192.0.2.1`:

        ```file {title="~/.ssh/config"}
        Host 192.0.2.1
          ForwardAgent yes
        ```

        Now SSH into the machine. Your SSH connection to the `192.0.2.1` address automatically triggers agent forwarding:

        ```command
        ssh example-user@192.0.2.1
        ```

        You could use `Host *` to make the configuration universal, but doing so is not recommended. Any remote machine you SSH into would have access to your all of your agent's keys for the duration of your connection. That leaves significant room for exploitation.

1.  At this point, you can utilize the agent forwarding on your remote machine — the server at `192.0.2.1` in the examples above. The agent forwarding process automatically runs the ssh-agent on the remote machine.

    Say, for example, you now want to connect to another machine, using the `192.0.2.1` server as a bastion. Simply open a second SSH connection to that machine — which, for this example, is at `192.0.2.2` using a user named `example-user`:

    ```command
    ssh example-user@192.0.2.2
    ```

    Agent forwarding means that any keys from the original, local machine are now available on the remote machine (`192.0.2.1`). These keys can thus be used to connect to a further machine — `192.0.2.2` in this example.

1.  To better secure your agent, you can lock the agent before forwarding. To do so, use the command here. This prompts you to create a password, used to secure your ssh-agent:

    ```command
    ssh-add -x
    ```

    {{< output >}}
Agent locked.
    {{< /output >}}

    You can later unlock the agent using this next command. The command prompts you to reenter the password you created when locking the agent:

    ```command
    ssh-add -X
    ```

    {{< output >}}
Agent unlocked.
    {{< /output >}}

## Conclusion

ssh-agent offers a strong tool for securely leveraging your private keys across multiple programs and windows. With agent forwarding you can extend that utility to further hosts. This allows you to manage keys locally, even for connections through bastion servers or private Git repositories accessed remotely.