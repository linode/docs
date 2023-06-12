---
slug: customization-tricks-for-ssh
title: "SSH Customization Tricks"
description: 'The SSH Secure Shell defaults are good, but there are tricks administrators use to increase security and handle different kinds of auths. Customization can mean productivity and security.'
keywords: ['passwordless ssh', 'ssh linux', 'customize ssh', 'ssh google authenticator', 'ssh logs']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Tom Henderson"]
published: 2023-06-12
modified_by:
  name: Linode
---

SSH, the Secure SHell, is a popular software method of connecting two hosts over network circuits. SSH is flexible, encrypts inter-host communications, and users can be authenticated in several optional ways. Other apps, such as *scp*, *sftp*, and *rsync* can use SSH as an authenticated and encrypted network transport seamlessly between hosts.

All SSH connections require authentication. This authentication comes in several forms, including correct passwords, “pre-seeding” certificates, or host-resident authenticators.

The SSH customizations described work on Windows using PuTTY, macOS, and unmodified Linux.

## Passwordless SSH Login

By default, SSH server hosts require a username and password for authentication when logging into a target server host. It’s also possible to send a host a valid certificate in lieu of a password if the server host target has a configuration file that permits this; the valid certificate sent to the target server host via SSH is stored in the target host server for subsequent authentication login re-use. Subsequent logins to the target server require using only the username and hostname/IP when using the same initiating host, or the same security certificate on another host when initiating an SSH session.

Compute Instances are created with SSH server keys generated anew, unless other SSH keys are chosen and added during the Compute Instance creation. Other hosts must have SSH keys generated that can then be used to seed targeted SSH server hosts, including Windows hosts.

The SSH keys that seed the target host must have already been generated, and have been generated in a Compute Linux instance by logging into the target SSH host. The following steps show you how:

1. Generate a new key pair on a Linux or Mac host in a terminal session and enter the following command:

    ```command
    code: ssh-keygen - t rsa
    ```

    The results look similar to this:

    ```output
    user2@localhost:~$ ssh-keygen -t rsa
    Generating public/private rsa key pair.
    Enter file in which to save the key (/home/user2/.ssh/id_rsa):
    ```

1. At this point, you can press **Enter** to accept the default file path and file name for the key. You can also specify a different path and filename if required.

    ```output
    Created directory '/home/user2/.ssh'.
    ```

1. You are asked to enter a passphrase twice.

    ```output
    Enter passphrase (empty for no passphrase):
    Enter same passphrase again:
    ```

1. The terminal proceeds to save the identification and public key files as shown below:

    ```output
    Your identification has been saved in: /home/user2/.ssh/id_rsa
    Your public key has been saved in: /home/user2/.ssh/id_rsa.pub
    ```

1. The terminal then displays the key fingerprint and a randomart image representation of the key:

    ```output
    The key fingerprint is:
    SHA256:YzXFNdEGsDpWukEtEtMgT6Wh2MmJvvX38NLzzBxUJYI user2@localhost

    The key's randomart image is:
    +---[RSA 3072]----+
    |      . *+.o+o*+.|
    |     = B =Eo.o o+|
    |    o * + = +  ..|
    |   .     + *   . |
    |    . . S *   .  |
    |     o o o + .   |
    |    .   . +.  .  |
    |         ..+o+ . |
    |           .oo=  |
    +----[SHA256]-----+
    ```

    This generates an RSA encoded key pair (one private, one public), and places the keys in the directed folder which by default is, `/home/<current user>/.ssh/`.

1. Add the private key to the local SSH authentication agent on the local server using the following command:

    ```command
    ssh-add
    ```

    This command adds the private key to the SSH authentication agent, allowing you to use it for passwordless authentication.

1. Place the generated key into the target server host key store using `ssh-copy-id`.

    ```command
    ssh-copy-id <current_username>@<target_server_host>
    ```

    In the example above, replace the `current_username` with the current logged-in username and `target_server_host` with the actual IP address or DNS name of the target server.

1. After successfully logging into the target host server, change the user directory permissions for the `.ssh` directory and the `authorized_keys` file using the following command:

    ```command
    chmod 600 .ssh/authorized_keys
    chmod 700 .ssh
    ```

## Using Secondary/MFA Authentication For SSH Host Login

The SSH process, by default, uses the single-factor password, or in our passwordless example above, a pre-seeded key exchange, to provide authorization to use SSH between hosts. The SSH process permits additional authorizing methods, called Multi-Factor Authorization/MFA, which adds additional SSH, hence multi-factor, authorization methods to validate/prohibit logins.

The openSSH code used in Linux and other operating systems permits MFA through the use of Pluggable Authentication Modules (PAMs), which are identified in the SSH configuration files. This secondary authentication adds additional protection against passwords, injection, and other attempts to break through SSH authentication protections.

The SSH login process, when using secondary/MFA, spawns a proxy authentication process as called from the SSH configuration and related PAM files on the target SSH server host. Once the authentication process defined in the PAM on the target host is satisfied, the SSH circuit connection is complete, and encrypted per the other selections made in the SSH server file: often the `/etc/SSH/SSHd_config` file.

One example of an authentication process using an Over The Phone (OTP) code is the Google Authenticator. The Google Authenticator app is available on Android and iPhone and [connects to the Google Authenticator PAM protecting SSH](https://www.redhat.com/sysadmin/mfa-linux). The PAM is set to expire OTP codes quickly and prevent machine-generated attacks. The Google Authenticator PAM system is an example of a software-based PAM system.

An example of a hardware-based PAM is offered by Yubico, in the form of a USB dongle called a YubiKey. The YubiKey dongle must be present in the host where a login attempt to an SSH server is made. Like the Google Authenticator, the Yubico PAM is downloadable and [installed into the SSH server host](https://developers.yubico.com/SSH/Securing_SSH_with_FIDO2.html). When a user attempts a login to the target server host, if a YubiKey is present, the login completes without a password. Otherwise, the login is rejected until the YubiKey is inserted into the user’s hardware.


## Using Corporate Or Other Certificate Authorities with SSH

Large organizations maintain their own certificate authorities (CAs) to vet and control access to organizational computing assets, including accessibility to assets via SSH. Instead of local key generation, key generation is used by applications that serialize keys and use role-based key security to permit traceability across a wide number of computing assets.

Keys generated by a CA may have various attributes built into the key that controls the key use. These include specific expiration times, chains-of-authority key signing, specific use tokenization, and other characteristics that increase key management across computing assets.
[Organizational CAs can be set up in role-based formats](https://betterprogramming.pub/how-to-use-ssh-certificates-for-scalable-secure-and-more-transparent-server-access-720a87af6617) to allow tracking and identity management, and this information can in turn be logged (see Logging Section) for auditing purposes.

## SSH Port Obfuscation

The SSH conversation between hosts takes place at an IP address, and by default, on Port `22`. This port is commonly attacked where the port is exposed for SSH. It is possible to change this port to a different port number, one that is not otherwise in use or a commonly opened port, to create an SSH connection between hosts. The following steps show you how:

1. Open a terminal and edit the SSH server's configuration file using vi, nano, or another command-line text editor.

    ```command
    $ sudo nano /etc/ssh/sshd_config
    ```

1. Find the line, `#Port 22` in the configuration file. Remove the "#" symbol to uncomment the line and make it usable.

1. Edit the line to choose a new port number:

    ```command
    Port <new port number>
    ```
    Replace `<new port number>` with the desired port number between `1024` and `7999`. For example, Port `5678`

1. Save the file and exit the text editor.
1. Restart the SSH daemon for the changes to take effect:

    ```command
    $ sudo systemctl restart sshd
    ```

1. Allow traffic on the new port in the firewall:

    ```command
    $ sudo ufw allow <new port number>
    ```

    Replace `<new port number>` with the chosen port number. For example:

    ```command
    $ sudo ufw allow 5678
    ```

1. To log in to the SSH server using an alternate port, use the following command:

    ```command
    $ ssh -p <new port number> user@hostname
    ```

    Replace `<new port number>` with the chosen port number, user with the desired username, and hostname with the target server's IP address or domain name. For example:

    ```command
    $ ssh -p 5678 user@hostname
    ```

1. When using other applications that utilize SSH as a transport, specify the new SSH port in the command-line invocation. For example, using `scp` to transfer files:

    ```command
    $ scp -P <new ssh port> user2@thathost:/home/user2/thesefiles /home/user2/
    ```

    Replace `<new ssh port>` with the chosen port number. For instance:

    ```command
    $ scp -P 5678 user2@thathost:/home/user2/thesefiles /home/user2/
    ```

    Other apps that use SSH as a transport have a similar “port call” to permit finding the target SSH server port to complete the connection. A port change can be used in conjunction with PAM modules, too.


## SSH Log Files

The use of SSH logging is set in the`ssh_config` (user) and `sshd_config` files located in Linux hosts in the `/etc/ssh/` directories. By default, the log level is INFO. These can be changed to VERBOSE, or for high detail, DEBUG.

1. In systems controlled by *systemd* the method to look at the logs comes from *journalctl*. To view SSH logs using the *journalctl* command, use the following command:

    ```command
    $ journalctl -u ssh
    ```

    You can also use additional arguments with *journalctl* to filter the logs, such as:

    - Display logs since today using the following command:

        ```command
        $ journalctl -u ssh --since today
        ```

    - Display logs since yesterday using the following command:

        ```command
        $ journalctl -u ssh --since yesterday
        ```

    - Display logs from the last boot using the following command:

        ```command
        $ journalctl -t sshd -b 0
        ```

        From the command above, the `-t` option allows filtering logs by a specific unit (in this case, `sshd`), and `-b 0` specifies the last boot.

2. The locations and methods for viewing SSH logs may vary depending on the Linux distribution and configuration. On some systems, SSH logs may be located in the `/var/log/auth.log` file. However, accessing this file requires superuser or root privileges.

    - To view the logs using `grep` command, you can use the following:

      ```command
      $ sudo grep ssh /var/log/auth.log
      ```

    - Alternatively, you can use other text editors or viewers to open and read the log file:

        ```command
        $ sudo nano /var/log/auth.log
        ```

## Conclusion

SSH is widely used for connecting, authenticating conversations, and encrypting data between hosts. Due to its popularity, SSH often becomes a target for hacking or cracking attempts. To enhance SSH productivity, security, and speed up SSH usage, the SSH tricks used in this guide can be helpful. These tricks also apply to applications that utilize SSH as a transport method, providing additional benefits and considerations.
