---
slug: use-paramiko-python-to-ssh-into-a-server
author:
  name: Cameron Laird
  email: claird@phaseit.net
description: 'This guide shows how you can use the Python module Paramiko, an app that uses the SSHv2 protocol to connect to remote servers, to connect to a server remotely.'
og_description: 'This guide shows how you can use the Python module Paramiko, an app that uses the SSHv2 protocol to connect to remote servers, to connect to a server remotely.'
keywords: ['paramiko python']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-13
image: HowtoUseParamikoandPythontoSSHintoaServer.jpg
modified_by:
  name: Linode
title: "Use Paramiko and Python to SSH into a Server"
h1_title: "How to Use Paramiko and Python to SSH into a Server"
enable_h1: true
contributor:
  name: Cameron Laird
external_resources:
- '[Paramiko GitHub](https://github.com/paramiko/paramiko)'
---

When your Python program needs to run an external password-dependent program, or access a remote server, use [*Paramiko*](https://github.com/paramiko/paramiko). Paramiko is a Python module that implements the [SSHv2](https://datatracker.ietf.org/doc/html/rfc4253) protocol. Paramiko is not part of Python’s standard library, although it’s widely used. This guide shows you how to use Paramiko in your Python scripts to authenticate to a server using a password and SSH keys.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

## Install Paramiko

You must install Paramiko on your system before being able to use it in your Python programs. Use the command below to install Paramiko with Pip:

    pip install paramiko

{{< note >}}
If you are not familiar with Pip or do not have it installed on your system, see our [How to Manage Python Packages and Virtual Environments on Linux](/docs/guides/how-to-manage-packages-and-virtual-environments-on-linux/#how-pip-works) guide.
{{< /note >}}

If your system is [configured to use Anaconda](/docs/guides/how-to-install-anaconda/), you can use the following command to install Paramiko:

    conda install -c anaconda paramiko

## A Paramiko SSH Example: Connect to Your Server Using a Password

This section shows you how to authenticate to a remote server with a username and password. To begin, create a new file named `first_experiment.py` and add the contents of the example file. Ensure that you update the file with your own Linode's details. Replace the values for `YOUR_IP_ADDRESS`, `YOUR_LIMITED_USER_ACCOUNT`, and `YOUR_PASSWORD`. Use the [Find Your Linode's IP Address](/docs/guides/find-your-linodes-ip-address/) guide, if needed.

{{< file "password_login.py" >}}
import paramiko

command = "df"

# Update the next three lines with your
# server's information

host = "YOUR_IP_ADDRESS"
username = "YOUR_LIMITED_USER_ACCOUNT"
password = "YOUR_PASSWORD"

client = paramiko.client.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, username=username, password=password)
_stdin, _stdout,_stderr = client.exec_command("df")
print(_stdout.read().decode())
client.close()
{{< /file >}}

This file connects to remote server over SSH using the IP address and credentials that you provide. It then uses the `df` command to generate a report of your server's free disk space.

Execute the file with the following command:

    python password_login.py

You see a similar output:

{{< output >}}
Filesystem       1K-blocks  Used Available Use% Mounted on
devtmpfs           1921544     0   1921544   0% /dev
tmpfs              1936296     0   1936296   0% /dev/shm
tmpfs              1936296   211308   1724988  11% /run
tmpfs              1936296     0   1936296   0% /sys/fs/cgroup
/dev/mapper/cl-root  46110724 20501872  25608852  45% /
/dev/sda1           999320   187324 743184  21% /boot
{{< /output >}}

The file above provides a high-level example that you can use to incorporate Paramiko into your Python code. While everything Paramiko does can also be done  with shell commands, Paramiko gives you all the power of Python. Python gives you access to structuring data, looping, parsing, and other powerful features that go beyond what is available in shell scripting. For example, if you are writing a program to calculate system usage percentages, Python is better at extracting and calculating values from your system's output.

## Second Paramiko Example: Connect to your Server Using SSH Keys

One of Paramiko’s specific strengths is the correct handling of [SSH add keys](/docs/guides/use-public-key-authentication-with-ssh/). The introductory example above depended on the use of your limited user account's password. It is more secure, however, to use SSH keys for server authentication. The example file below, provides a report that alerts you of any logins by users that are not included in your list of `expected` users. The Python script relies on Paramiko (notice the `key_based_connect()` function) to use SSHv2 authentication to connect to any of the servers provided in the code's `server_list` list.

{{< file "key_based_login.py">}}
# This is a small tool to report on successful logins
# to accounts other than those listed in the variable
# expected.  Such a report might lead to an investigation
# into how and why those other accounts were logging in.

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

Execute the file with the following command:

    python key_based_login.py

If a user outside of the Python script's `expected` list accesses one of your servers, the Python script returns the following:

{{< output >}}
Entry user4   pts/0     192.0.2.0  Wed Sep 23 15:13 - 17:28  (02:14)' is a surprise on 192.0.2.0.
{{< /output >}}

## Going Further with Paramiko

Paramiko helps you automate repetitive system administration tasks on remote servers. More advanced Paramiko programs send the lines of a script one at a time. It does this rather than transacting all of a command, such as `df` or `last`, synchronously to completion. Paramiko is a helpful addition to your system administrator toolchain when working to automate common tasks. You can visit [Paramiko's documentation](http://docs.paramiko.org/en/stable/) to learn about its special-purpose methods and variables that go beyond the examples covered in this guide.
