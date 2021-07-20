---
slug: use-paramiko-python-to-ssh-into-a-server
author:
  name: Cameron Laird
  email: claird@phaseit.net
description: 'The Python module, Paramiko, implements the SSHv2 protocol that helps you connect to remote servers. You can use Paramiko in your Python code to automate tasks on your server. This guide provides two Paramiko examples showing you how to connect to a server with your username and password and your SSH keys.'
og_description: 'The Python module, Paramiko, implements the SSHv2 protocol that helps you connect to remote servers. You can use Paramiko in your Python code to automate tasks on your server. This guide provides two Paramiko examples showing you how to connect to a server with your username and password and your SSH keys.'
keywords: ['paramiko python']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-12
modified_by:
  name: Linode
title: "Use Paramiko and Python to SSH into a Server"
h1_title: "How to Use Paramiko and Python to SSH into a Server"
enable_h1: true
contributor:
  name: Cameron Laird
external_resources:
- '[Python Subprocess Module](https://docs.python.org/3/library/subprocess.html)'
- '[Paramiko GitHub](https://github.com/paramiko/paramiko)'
- '[An Introduction to SSHv2](https://searchsecurity.techtarget.com/tip/An-introduction-to-SSH2)'
---

As a Python programmer, you’re probably familiar with the [*subprocess* module](https://docs.python.org/3/library/subprocess.html). Subprocess gives Python power over other applications: it’s the main way we execute other programs, including all the commands that a particular operating system builds. For historical and security reasons, the subprocess stumbles with password entry and other authentication methods. When your Python program needs to run an external password-dependent program, or access a different computer through a network connection, or both, you need [*Paramiko*](https://github.com/paramiko/paramiko).

## Install Paramiko

Paramiko is a Python module that implements [*SSHv2*](https://searchsecurity.techtarget.com/tip/An-introduction-to-SSH2). Paramiko is not part of Python’s standard library, although it’s widely used. This means that, before any of the programs here can succeed, you need to make it available to your system. Depending on the details of your environment using one of the following commands to install Paramiko.

    python -m pip install paramiko

or

    pip install paramiko

or

    conda install -c anaconda paramiko

or as appropriate to your own working Python environment.

## A Paramiko SSH Example

You can quickly experience Paramiko for yourself: create `first_experiment.py` with the contents of the file below. Ensure that you update the file with your Linode server's details for `host` numeric address, `username`, and `password`.

{{< file "first_experiment.py" >}}
import paramiko

command = "df"

# Update the next three lines with your

# server's information

host = "YOUR_NUMERIC_IP_ADDRESS"
username = "YOUR_ACCOUNT"
password = "YOUR_PASSWORD"

client = paramiko.client.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, username=username, password=password)
stdin, _stdout,_stderr = client.exec_command("df")
print(stdout.read().decode())
client.close()
{{< /file >}}

Execute the file with the following command:

    python first_experiment.py

You’ll see a result such as:

{{< output >}}
Filesystem       1K-blocks  Used Available Use% Mounted on
devtmpfs           1921544     0   1921544   0% /dev
tmpfs              1936296     0   1936296   0% /dev/shm
tmpfs              1936296   211308   1724988  11% /run
tmpfs              1936296     0   1936296   0% /sys/fs/cgroup
/dev/mapper/cl-root  46110724 20501872  25608852  45% /
/dev/sda1           999320   187324 743184  21% /boot
{{< /output >}}

The example above provides a high-level example you can use to incorporate Paramiko into your Python code. While everything Paramiko does can also be done, in principle, with shell commands, Paramiko gives you all the power of Python programming. Programs beyond a couple of pages of shell scripting benefit from Python’s facilities for structuring data, looping, parsing, and so on. If your programming is beyond the “Hello, world!” level, and you need to connect through SSHv2, you probably need the advantages Paramiko brings. If for instance, you’re developing “business logic” based on `Use%` of different filesystems of your servers, you’ll probably find the parsing to extract those values from `df`’s output, and the arithmetic to act on them, easier in Python.

## Second Paramiko Example: Connect to your Server with an SSH Key

Paramiko is useful for tasks across networked servers. A second, more ambitious example; one that illustrates intermediate-level use of Paramiko. One of Paramiko’s specific strengths is the correct handling of keys. The introductory example above depended on the use of a password. More professional work, though, is likely to configure servers so communications between them are hardened to avoid the use of passwords in favor of secured keys. Assume that you have such a network. A fleet of worker nodes each of which can be accessed at the command line by $AUTOMATION_ACCOUNT through a password-less login. In such a system, you can rely on the same SSHv2 keys to write and launch.

{{< file "key_based_login.py">}}

# This is a small tool to report on successful logins

# to accounts other than those listed in the variable

# expected.  Such a report might lead to an investigation

# into how and why those other accounts were logging in

import paramiko

def examine_last(server, connection):
     command = "sudo last"
     expected = ["user1", "reboot", "root", "sys-admin"]
 _stdin, stdout, _stderr = connection.exec_command("sudo last")
 lines = stdout.read().decode()
 connection.close()
 for line in lines.split("\n"):
           # Ignore the last line of the last report.
         if line.startswith("wtmp begins"):
             break
         parts = line.split()
         if parts:
             account = parts[0]
             if not account in EXPECTED:
                 print(f"Entry '{line}' is a surprise on {server}.")

def key_based_connect(server):
     host = "192.0.2.0"
     special_account = "user1"
 pkey = paramiko.RSAKey.from_private_key_file("./id_rsa")
 client = paramiko.SSHClient()
     policy = paramiko.AutoAddPolicy()
          client.set_missing_host_key_policy(policy)
 client.connect(host, username=special_account, pkey=pkey)
 return client

def main():
     server_list = ["worker1", "worker2", "worker3"]
 for server in server_list:
         connection = key_based_connect(server)
         examine_last(server, connection)

main()
{{< /file >}}

The result of running the above Python code might be:

{{< output >}}
Entry 'user4   pts/0     192.0.2.0  Wed Sep 23 15:13 - 17:28  (02:14)' is a surprise on 192.0.2.0.

{{< /output >}}

The larger point from a Paramiko perspective is that `key_based_connect()` illustrates a connection made with no password.

## Principles of Paramiko Productivity

If you can model a task “manually”--that is, login and run commands using any combination of passwords, passphrases, and keys--you can automate it with Paramiko. The [reference Paramiko documentation](http://docs.paramiko.org/en/stable/) is rich with special-purpose methods and variables. The unifying theme of all of them is that they enable the complete programmability of an SSHv2 transport. Paramiko even implements an SSHv2 server, to compliment the more commonly programmed clients as in the first and second examples above.

Even more advanced Paramiko programs send and receive just a line at a time, rather than transacting all of a command such as `df` or `last` synchronously to completion. You’ll make the most of your Linode assets by automating their operations, management, and policies. Paramiko is exactly the Python module to enable such automation.
