---
author:
  name: Linode
  email: skleinman@linode.com
description: 'A collection of security practices to help you prevent common system exploits.'
keywords: 'security,ssh,development,hosting,network'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['security/basics/']
modified: Tuesday, April 19th, 2011
modified_by:
  name: System
published: 'Monday, August 31st, 2009'
title: Linux Security Basics
---

One of the most daunting prospects of administering your own server on a public network is dealing with your server's security. While security threats in a networked world are real and it is always important to be mindful of security issues, protecting against possible attacks is often a matter of exercising basic common sense and adhering to some general best practices.

This guide takes a broad overview of common security concerns and provides a number of possible solutions to common security problems. You are encouraged to consider deploying some of these measures to "harden" your server against possible attacks.

It's important to remember that all of the solutions we present in this document are targeted at specific kinds of attacks, which themselves may be relevant only in specific configurations. Security solutions need to be tailored to the kind of services that you're providing and the software you're running, and the decision whether or not to deploy a specific security solution is often a matter of personal discretion and cost-benefit analysis.

Perhaps most importantly, it should be understood that security is a process, not a product (credit to Bruce Schneier.) There is no "magic bullet" set of guidelines that can be followed to ensure the security of any system. Threats are constantly evolving, so vigilance is required on the part of network administrators to prevent unauthorized access to systems.

Keep Systems and Software Up To Date
------------------------------------

One of the most significant sources of security vulnerabilities are systems running out of date software with known security holes. Make a point of using your system's [package management](/docs/using-linux/package-management) tools to keep your software up to date; this will greatly assist in avoiding easily preventable security intrusions.

Running system updates with the package management tool, using `apt-get update && apt-get upgrade` (for Debian and Ubuntu Systems) or `yum update` (for CentOS and Fedora systems) is simple and straightforward. This practice ensures that if your distribution maintains active security updates, your system will be guarded against many security holes in commonly used software packages.

System update tools will, however, not keep software up to date that you've installed outside of package management. This includes software that you've compiled and installed "by hand" (e.g. with `./configure && make && make install`) and web-based applications that you've installed from a software developer's site, as is often the case with applications like WordPress and Drupal. Also excluded from protection will be libraries and packages you've installed with supplementary package management tools like Ruby's Gems, Perl's CPAN tool, Python `easy_install`, and Haskell Cabal. You will have to manage the process of keeping these files up to date yourself.

The method you use to make sure that your entire system is kept up to date is a matter of personal preference, and depends on the nature of your workflow. We would recommend trying *very hard* to use the versions of software provided by your operating system or other programming platform-specific package management tools. If you must install from "source," we would recommend that you save the tarballs and source files for all such software in `/src/` or `~/src/` so that you can keep track of what software you've installed in this manner. Often, you can remove a manually compiled application by issuing `make uninstall` in the source repository (directory). Additionally, it may be helpful to maintain a list of manually installed software, with version numbers and download locations. You may also want to investigate packaging your own software so that you can install it with `apt`, `yum` or `pacman`.

Because of the complexity of maintaining software outside of the system's package management tools we *strongly* recommend avoiding manually installing software unless absolutely necessary. Your choice in a Linux distribution should be heavily biased by the availability of software in that distro's repositories for the systems you need to run on your server.

Disable Unused Services
-----------------------

One common avenue for attack involves exploiting unused applications. In general we recommend disabling daemons (services) that you're not actively using, developing, or testing. Using `/etc/init.d/[service] stop` or `/etc/rc.d/[service] stop`, depending on your distribution, to deactivate unused services can prevent these services from being exploited later. Please note that services that are configured to start at system boot will run again should you reboot your server, so it may be safer to disable them from automatically starting using your distribution's particular method for doing so.

Not only will unused services no longer consume system resources, if there are any security vulnerabilities in these services, would-be attackers will be unable to exploit them. *Any service that you're not using should be turned off.*

To see what processes you're currently running, we recommend using the `htop` tool. Install with `apt-get install htop`, `yum install htop` or `pacman -Sy htop`.

Lock Down SSH
-------------

SSH, the secure shell service, is the main avenue we use to interact with servers remotely. While SSH provides exceptional encryption and security for users, it also provides a great deal of access to your server and thus represents an appealing target for an attacker. To counteract the possibility of having your servers compromised with an SSH attack, we recommend taking the following steps.

First, **disable root logins via SSH**. Since the root username is predictable and provides complete access to your system, providing unfettered access to this account over SSH is unwise. Edit the `/etc/ssh/sshd_config` file to modify the `PermitRootLogin` option as follows:

    PermitRootLogin no

If you need to gain root access to your system you can (and should) use tools like `su` and `sudo` to do so without logging in as root.

Second, **disable password authentication.** Generate and use SSH keys to log into your system. Without passwords enabled, attackers will need to guess (or steal) your SSH private key in order to gain access to your server. In the file `/etc/ssh/sshd_config`, modify `PasswordAuthentication` as follows:

    PasswordAuthentication no

If you do not have SSH keys generated you will have to generate them on your own machine before disabling password authentication.

To generate SSH keys for your host, issue the following command on your *local system* if you're using Mac OS X or Linux locally:

    ssh-keygen

Answer the program's inquiries; generally the defaults are acceptable. This will generate an SSH key using the RSA algorithm. If you want to use the DSA algorithm, append `-t dsa` to the command.

Your SSH key will be generated with the private key in `~/.ssh/id_rsa` and the public key in `~/.ssh/id_rsa.pub`. You will want to copy the **public key** into the `~/.ssh/authorized_keys` file on the **remote machine**, using the following commands (replacing your own SSH user and host names).

    scp ~/.ssh/id_rsa.pub user@hostname.com:/home/user/.ssh/uploaded_key.pub
    ssh user@hostname.com "cat ~/.ssh/uploaded_key.pub >> ~/.ssh/authorized_keys"

If you're using PuTTY in Windows, note that it has the ability to generate keys using `puttygen` that you can upload to your server. You can download `puttygen` from the [PuTTY Homepage](http://www.chiark.greenend.org.uk/~sgtatham/putty).

If you have a problem logging in you will need physical access or out-of-band console access to your server to restore SSH functionally. You can use the [Linode shell (LISH)](/docs/troubleshooting/using-lish-the-linode-shell) to access your server's console.

Limit Root and System Users' Access
-----------------------------------

In general, users and applications that do not have access to a system on your server, either by virtue of limited access rules or by limited abilities to log into the system, cannot do any harm to the system. Additionally, one common way of compromising a system is to trick the system into thinking that a user has access rights greater than what they actually have. While these "escalation attacks" are relatively uncommon and are often patched rather quickly, they are only a threat when there are accounts that can be exploited.

To address these possible threats we suggest the following best practices with regards to managing your user accounts:

-   Don't give people user accounts if they don't need them. There are often ways to provide access to specific servers without giving users accounts with even limited access to the system. Giving someone a shell account on your system should be seen as a last resort in most cases.
-   If you need to have multiple administrators for a system, rather than share a single root password among many people, use `sudo` to give "root access" but force users to authenticate with their own password. The `sudo` command also provides more detailed logging, so you know which root commands were issued by which user.
-   Leverage [user groups and permissions](/docs/using-linux/users-and-groups) to provide granular access control when you have no option but to give a user an account on your system.
-   Disable unused system user accounts, either by removing the account outright with the `userdel` command, or by locking the user account with `usermod --lock LOGIN-NAME` until the user needs access again (achieved with `usermod --unlock`).

Limiting access to your servers and adhering to best practices with regards to administrative access and user account management won't guard against escalation attacks or all possible intrusions. However, by limiting the size of your "shadow" you decrease the likelihood of becoming the victim of many kinds of attacks.

Use a Firewall to Block Unwanted Traffic
----------------------------------------

As the term "firewall" has fallen into common non-technical usage, the specific role of a firewall solution as part of a larger security plan has become somewhat unclear. Firewalls are simple traffic filters that can be used to limit and constrain inbound traffic to your Linode. The aim is to prevent all traffic arriving from certain IP addresses or over certain ports in situations where you know that traffic is unwanted or malicious.

On the whole, firewall settings and configurations are beyond the scope of this document. We recommend that you review specific [guides for firewall configuration](/docs/security/) to learn how to configure your firewall correctly for your use. In this section, we hope to explain some basic firewall settings that you can use to prevent most intrusions.

Although there are numerous packages on Linux systems that enable efficient and effective configuration of firewalls, the actual firewalls are created using *iptables*. This uses the packet filtering capabilities of the Linux kernel itself. This means that the firewall rules are enforced very efficiently.

Nevertheless, the firewall that you configure can be as open or as restrictive as you need. It's sometimes difficult to decide what the best strategy is for deploying an effective firewall. With the understanding that your firewall setup needs must take the actual uses of your server and its users into account, we offer the following list as potential strategies for deploying a firewall.

-   Identify the services that you're using and close all ports on all public IP addresses, except the ones that the services you use listen on. The most common standard ports include: web servers on port 80, ssh on port 22, smtp on port 25. If there are any security vulnerabilities for software running on other ports or intruders are scanning for open ports, the firewall will reject this traffic before it can invade your system. **Disadvantages:** This filter can be confusing if your suite of services change regularly, and you may end up unintentionally locking yourself out of services that you want to use, which can be hard to troubleshoot.
-   Watch access logs for suspicious behavior and block inbound traffic from IPs and IP ranges that are attacking your server. If you're getting malicious activity from a specific IP address, then it's probably safe to block all traffic from that IP, at least for a while. **Disadvantages:** People can change their IP addresses to get around these rules, and blocking individual addresses from accessing your server can't prevent attacks before they happen.
-   Block inbound traffic on sensitive ports, except from IP addresses that you know are good. Some services, like SSH, can grant an attacker a great deal of access to the system, while HTTP servers like Apache are designed to be accessed by the public at large. This is a "whitelisting" strategy and can be used to effectively secure services like SSH and database servers that are accessed over a private network. If you know where "good" traffic is likely to originate from, you can prevent would be attackers from gaining access to your machines without hindering the good traffic. **Disadvantages:** This strategy is only effective if you have a limited number of "good" sources of traffic, and is ineffective at securing services that need to be publicly accessible.

These rules can -- and perhaps should -- be deployed to varying degrees as part of a larger security strategy. Firewalls alone don't prevent malicious behavior and are not a security cure-all, but they can be quite effective at preventing some attacks.

When deciding to deploy firewall rules, the decision often comes down to the following questions: "will this rule impede traffic that actually want to service?", "will this rule make it more difficult to use the server as I want to?", and finally "will this rule successfully block traffic that I don't want to serve?" The answers to these questions often vary in response to the services you're providing and the way you use your server, but we hope that the above guidelines provide a productive starting point for your firewall deployment.

Use Denyhosts or Fail2Ban to Prevent Password Attacks
-----------------------------------------------------

The [DenyHosts](http://denyhosts.sourceforge.net/) and [Fail2Ban](/docs/security/fail2ban) applications (for which packages should be included in your distribution's software repository) help prevent dictionary attacks on your server. The basic concept is simple: these programs watch for attempted logins, and if your server is receiving multiple failed login attempts from the same IP address, these applications will insert firewall rules that will block traffic from the attacker's IP address.

The assumption is that "good" users are very likely to be able to get their password correct in less than 3-5 attempts, and that anyone who submits an incorrect password more than 3-5 times is trying to break into a system. While there is the potential for false positives, the "bans" can be temporary, and are easily reversed by the administrator if necessary.

The number of allowed attempts and the length of time the resulting ban remains in effect are configurable by the system administrator. Attempted logins can be monitored on a variety of protocols, including HTTP Auth, SMTP, and SSH. While this approach to restricting traffic won't prevent a compromised password from being used to break into a system, it can reduce the risk that a system user's weak password poses to the server as a whole.

Encrypt Sensitive Data
----------------------

If most "best security practices" come down to exercising a fair bit of paranoia over your data and systems, then implementing data encryption represents the most severe expression of this paranoia. Well tuned access control lists are often quite effective at preventing most casual abuse, and there is always some resource overhead for encrypting and decrypting data. Nevertheless, if you're storing truly sensitive data, it's often quite prudent to encrypt it. There are a number of different options for accomplishing this goal.

First, encrypt individual files using [PGP](http://en.wikipedia.org/wiki/Pretty_Good_Privacy) and the tools provided by the GNU Privacy Gaurd package in your distribution (frequently, as "gpg"). PGP is *very* secure, and if you already use PGP keys and have a small number of sensitive files, this can be quite workable. This prevents casual snoopers from reading the contents of a file, even if they have read access to it, though it only works on a file-by-file basis. Additionally, it can sometimes be confusing to make sure you're encrypting data with the proper public key.

The second option is more advanced. It requires running your own kernel under PV-GRUB, and using the [dm-crypt](http://www.saout.de/misc/dm-crypt/) kernel module to encrypt the contents of the disks. This takes a toll on disk performance, and requires you to enter a password on boot in order to access your files. The disadvantages are plenty: you are responsible for maintaining an up-to-date kernel, and if you lose your password all your files will be unrecoverable. Additionally, disk-level encryption protects against a very narrow set of threats: against physical attacks against the hardware and against unforeseen (and unlikely) issues with the virtualization engine in use. Once a machine with disk-level encryption is booted and running -- aside from the slight performance hit -- it is indistinguishable from an unencrypted system in terms of user experience.

The final option, and perhaps the best middle ground, is to use a system like "[EncFS](http://www.arg0.net/encfs)" which creates an encrypted filesystem in user-space (using the FUSE interface). This system writes your files in an encrypted format to the disk, and when you mount the filesystem you're provided with a usable and unencrypted view of it. When you unmount the file system, you only have encrypted files. EncFS doesn't protect meta-data information like file size, permissions, and last-edited time, but is otherwise very secure. For sensitive files, this prevents the additional complexity of managing individual encrypted files, while still allowing for high quality data security.

Again, from a holistic perspective, encrypting in this manner provides minimal benefit for most use cases and comes with a great deal of overhead. Nevertheless, there are some situations where encryption makes a lot of sense, particularly when you're managing very sensitive data on networked machines. Consider encryption as a possible tool among many options for creating a more secure environment.

Best Practices with Databases
-----------------------------

One common class of security issues involves the applications that you develop and run on your server, as opposed to all of the system software that your application depends upon. There are some basic guidelines that you may want to follow as you develop applications.

1.  *Distrust all inputs* by sanitizing all text and content that users could put into the system.

    Most programming languages have "string scrubber" tools that you can use to strip out all code, scripts, and unwanted HTML tags. Use these to prevent anyone from using your site to publish malicious code, or use code to exploit your server.

    If your application is written in Perl, consider enabling warnings and "taint mode" by starting your program with `#!/usr/bin/perl -tw`. Taint mode requires all input from external sources be tested with a regular expression before it may be used in your program. This means you won't accidentally use an untrusted input without (hopefully) running a sane regular expression check on it to make sure it contains only valid data.

    If your application is written in PHP, consider using the `mysql_real_escape_string` and `htmlentities` functions to sanitize user input such as GET and POST data. Using the above "string scrubbers" are a great way to begin securing your PHP code. You can find more information and examples on the [mysql\_real\_escape\_string](http://php.net/manual/en/function.mysql-real-escape-string.php) and [htmlentities](http://php.net/manual/en/function.htmlentities.php) manual pages.

2.  *Sanitize database inputs* to prevent SQL injection attacks when using a database system. One typical approach involves using prepared statements with the database interface. This prevents your database from generating unexpected output, and makes it impossible for users to perform unintended modification to your database or to access unauthorized content from your system.
3.  *Authenticate all requests* for secure information, rather than passing or storing `IsAuthenticated` or `IsPrivileged` status to the user. In short, avoid storing any information in cookies or in the HTTP query string that you don't want the users to be able to edit.

These tips for coding practices, and indeed all of the security tips that we present here, are simply a starting place for ensuring that your system remains protected against intrusions from malicious users. Nevertheless, from our experience even these small suggestions will help keep your system secure from many common exploits. We hope that this guide has presented a number of manageable approaches that you can deploy in order to help ensure that your system remains secure.



