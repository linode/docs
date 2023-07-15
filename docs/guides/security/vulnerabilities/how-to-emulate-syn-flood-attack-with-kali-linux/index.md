---
slug: how-to-emulate-syn-flood-attack-with-kali-linux
title: "How to Emulate a SYN Flood Attack With Kali Linux"
description: 'This guide explains how to conduct a DDoS stress test using a SYN flood attack originating on Kali Linux.'
keywords: ['DDoS stress test','SYN flood attack','Kali Linux flood attack','hping3 stress test']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Jeff Novotny"]
published: 2023-04-14
modified_by:
  name: Linode
external_resources:
- '[Kali Linux](https://www.kali.org/)'
- '[Kali Linux Documentation](https://www.kali.org/docs/)'
- '[Kali Linux hping3 documentation](https://www.kali.org/tools/hping3/)'
- '[Wikipedia Denial-of-service attack entry](https://en.wikipedia.org/wiki/Denial-of-service_attack)'
---

A *distributed denial-of-service* (DDoS) attack can seriously hamper the ability of a website to function properly. An attack can result in intermittent errors or even cause the site to become completely inaccessible. Due to the serious consequences, it is important to understand how a site might respond when under attack. The [Kali Linux](https://www.kali.org/) operating system provides a helpful tool to mimic a `SYN` flood attack on a device under test.


## What is a Denial-of-Service (DoS) Attack?

A DDoS attack is a type of remote *cyber-attack* that attempts to interfere with, or render unavailable, a web site or other web resource. If the attack is launched from a single source, it is referred to as a *denial-of-service* (DoS) attack. If the attack originates from multiple IP addresses, it is a distributed denial-of-source (DDoS) attack. DDoS attacks are more difficult to defend against because administrators cannot ban a single source IP address. In many cases, traffic originates from a *botnet* of compromised systems.

DoS/DDoS attacks take place for many reasons. In some cases, the attacks occur for political or anti-competitive reasons, or to suppress information. An attacker might also be out for revenge or to express displeasure with a company or organization. Occasionally, an attack is undertaken to extort money from the target organization.

Many common attacks flood a server with a barrage of packets in a *brute force attack*. The packets can be valid requests, or a combination of nonsensical or malformed packets. This torrent of requests can overwhelm the target, monopolizing the available memory and system CPU, while using up most of the available transport sessions. The target is not able to simultaneously process the hostile requests and still respond to most of the legitimate users. Some users might be able to access the resource, but the majority of the requests time out or are dropped.

In more sophisticated attacks, hackers can leverage their knowledge of a system to construct an *application layer attack*. For example, they can devise an elaborate multi-step assault that abandons an online shopping cart at check out time. Attackers can also assemble "poisoned packets" to find bugs or weaknesses in the system, potentially leading to system crashes. Some attacks target auto-scaled cloud applications, causing the application to repeatedly create and then delete cloud resources. Hackers often combine several attack vectors to maximize the chances of knocking the target offline. More information about the various types of attacks along with historical examples can be found on the [Wikipedia page on denial-of-service attacks](https://en.wikipedia.org/wiki/Denial-of-service_attack).

Fortunately, system administrators have some tools at their disposal to defend against such attacks, including the following:

-   Upstream filtering by sentry systems to review the requests and discard unwanted traffic. Only packets deemed acceptable are sent to the server.
-   Session analysis, using application-layer indicators. For instance, a website might block a user who keeps putting an item in a basket and removing it again. Very rapid or very slow responses might also indicate a hostile session.
-   Intrusion prevention systems to scan requests for signatures associated with common attacks.
-   Rate limiting and traffic shaping, often implemented at the routing layer.
-   Firewalls to block vulnerable ports.
-   Access control lists to black-hole specific addresses associated with botnets.
-   Penetration and security testing tools to examine the target system for vulnerabilities.

### What is a SYN Flood Attack?

A `SYN` flood attack is a frequent DoS technique. This attack transmits a large number of *Transmission Control Protocol* (TCP) `SYN` (synchronize) packets to the target server. Under normal circumstances, a TCP client sends a `SYN` packet when it wants to open a connection. The `SYN` request is an "active open" because it immediately establishes a TCP session and triggers the recipient to send a response.

In a valid exchange, the server sends a `SYN-ACK` response back to the client. The client then responds with an `ACK` packet, establishing the connection. However, in a SYN flood attack, the attacker typically forges the sender address, and the originator does not intend to respond. So the targeted server is left waiting for a response that never arrives. The session is left in a partially-opened state until it times out.

Although this attack is fairly unsophisticated, it can be successful. Establishing and abandoning a session uses up more resources than other comparable techniques. Most servers can handle a substantial number of partially-open or idle sessions. However, a DDoS attack transmits an overwhelming amount of SYN packets, monopolizing all the available connections. This leaves the server with very few resources to respond to legitimate users. An additional side effect of these zombie sessions is to drain memory and keep the CPU occupied, further degrading the system.

There are a few techniques available to combat this attack. Administrators might reduce the `SYN-Received` timer or use SYN cookies to pause and reactivate connections. However, it is challenging to effectively deal with this kind of attack without compromising normal operating behavior.

## What is Kali Linux?

Kali Linux is an open source Linux operating system based on Debian. Although all Linux systems contain tools for security and connectivity testing, Kali Linux provides a larger selection of information security tools. Some of the tasks it is optimized to perform include the following:

-   Penetration Testing
-   Security Research
-   Computer Forensics
-   Reverse Engineering

At the command line level, Kali Linux is similar to Debian and other Linux distributions. Most of the tools and commands that work elsewhere on Linux also work on Kali Linux. However, Kali Linux includes the following capabilities to assist with security and penetration testing.

-   An industry-leading suite of open source penetration and security testing tools, including commands to simulate a `SYN` attack.
-   The *live-build* feature enables users to build custom Kali Linux images. Users can optimize their builds with the specific tools required for their testing.
-   Live USB boot allows Kali Linux to boot from a USB device without having to access the target operating system.
-   Full encryption of all persistent volumes.
-   The LUKS Nuke option, permitting quick yet controlled data destruction.
-   Kali Everywhere, which can run Kali Linux on the cloud, in a Docker container, or on a virtual machine, DVD, USB, or Windows Subsystem for Linux.
-   A snapshot utility, with the ability to roll back to a previous state.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides. To deploy Kali Linux using the Linode Marketplace, consult the guide to [the Kali Linux Application](https://www.linode.com/marketplace/apps/kali-linux/kali-linux/).

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
The steps in this guide ares written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## How to Use Kali Linux to Launch a SYN Flood Attack

On Kali Linux, the `hping3` utility is used to simulate a `SYN` flood attack. Although this strategy is sometimes used as the dominant attack vector, it is more frequently combined with other attacks. Nonetheless, a `SYN` flood test allows administrators to determine how their application performs under increased levels of traffic and stress. It also allows them to evaluate how the various components of their DDoS defense architecture might handle a real attack.

The `hping3` utility is available for Kali Linux and most other Linux distributions. To use `hping3` on Kali Linux to stress test the devices under test, follow these steps.

{{< note >}}
The following guidelines are generally applicable for many different Linux distributions. However, the `hping3` options and usage details are distribution-dependent. Consult the platform documentation for more details.
{{< /note >}}

{{< note type="warning" >}}
This is a very dangerous and potentially destructive test. It must only be used in a development, staging, or test environment, or during a maintenance window. **DO NOT** use this command to test an in-service production server.
{{< /note >}}

{{< note type="warning" >}}
This command must only be used to test servers inside your organization and under your control. **DO NOT** use this command to probe external servers. Tampering with the public internet infrastructure is a serious offense in many jurisdictions.
{{< /note >}}

1.  Ensure any Kali Linux compute instances running the stress test are fully configured and up-to-date. A single Kali Linux instance can emulate a basic non-distributed denial-of-service attack. But multiple Kali Linux systems are more effective in creating a realistic DDoS scenario. For more information, consult the [Linode guide to deploying Kali Linux using the Marketplace App](https://www.linode.com/marketplace/apps/kali-linux/kali-linux/).

1.  Install the `hping3` package. This package might already be installed on the Kali Linux server.

    ```command
    sudo apt-get install hping3
    ```

1.  Establish baseline metrics for how the web server operates under normal conditions. This might involve scripts emulating friendly web users.

1.  Put any DDoS mitigation measures in place, including firewalls, access control lists, and rate limiting.

1.  On the first Kali Linux machine, use the `hping3` command to launch a SYN request attack. Supply the following parameters:

    - **-i**: Specifies the wait between packets. The value `-i u40` sends a SYN packet every `40` microseconds.
    - **-S**: This tells `hping3` to send `SYN` packets.
    - **-p**: Specifies the TCP port to address. `-p 80` sends packets to port `80`, which is the well-known port for HTTP connections.
    - **-c**: The `count` parameter indicates the number of packets to send.
    - Append the destination IP address as the final argument to the command. The destination server must be able to accept HTTP packets.
    - **-q**: **Optional** Runs the test in "quiet mode", displaying only the initial command and results summary.

    The following example sends `100000` packets to address `192.168.1.10` at a rate of `40` microseconds between packets. The entire test takes four seconds to complete.

    {{< note >}}
    `hping3` has many more options to adjust the test constraints or change the packet type. However, the parameters listed here are sufficient to conduct a typical SYN flood test. For more details about the Kali Linux `hping3` command, see the [Kali Linux hping3 documentation](https://www.kali.org/tools/hping3/). The `hping3 -h` command also displays help information.
    {{< /note >}}

    ```command
    sudo hping3 -i u40 -S -p 80 -c 100000 192.168.1.10
    ```

1.  Review the results of the command to determine how the far-end system handled the attack. If the number of packets received matches the number of packets transmitted, the web server kept up with the number of requests. Review the logs from any attack mitigation defenses, such as packet filtering devices, to ensure they behaved as expected. The overall response indicates how the server might react to a low-volume, short-duration DoS attack.

    ```output
    HPING 192.168.1.10 (eth0 192.168.1.10): S set, 40 headers + 0 data bytes

    --- 192.168.1.10 hping statistic ---
    100000 packets transmitted, 100000 packets received, 0% packet loss
    round-trip min/avg/max = 0.4/12.0/1014.2 ms
    ```

1.  If possible, launch simultaneous attacks from multiple Kali Linux instances. For a more stressful test, increase the duration of the test or decrease the interval between packets. For example, change the previous `hping3` command to use `-i u10` and `-c 250000`.

1.  Throughout the testing, monitor the web server to ensure it is working properly.

    - Ensure friendly users are not affected and any existing sessions are maintained.
    - Review server metrics to verify how the system responded.
    - Verify any automated tests completed successfully.
    - It is normal to see some level of service degradation, such as increased response times, but the server should continue to function.

1.  Increase the attack rate until the web server is no longer able to respond to all requests. This indicates the tolerance level of the server to a DoS attack. It provides an approximate indication of what level of attack a server can withstand at its current settings without further defense measures.

## Limitations of the Kali Linux SYN Flood Attack

Although these test results are valuable, they do not necessarily reveal how the server might behave during a real attack. Some of the limitations of the Kali Linux `SYN` flood test are as follows.

-  The `SYN` flood test is simpler and less realistic than an actual DDoS attack. `SYN` packets might be used for initial probe testing and random uncoordinated attacks. However, professional attacks usually combine several attack vectors and different types and rates of packets. The `hping3` tool lacks the capability to generate a more complex attack.

-  `SYN` flood testing uses a brute force attack technique. It does not require any knowledge of the target server other than its IP address. It cannot leverage any application knowledge to create a more demanding test or expose internal application weaknesses. For instance, a `SYN` flood assault does not use any of the sessions it attempts to initiate for further attacks.

-   Most professional DDoS attacks use a botnet consisting of thousands of clients to direct an extremely large amount of traffic to the target. A few Kali Linux systems cannot hope to match this rate of traffic. Most modern web servers with a decent amount of memory and CPU power are able to withstand the sort of penetration testing described in this guide.

Nonetheless, this is a good starting point for DoS/DDoS penetration testing. It indicates how a web application responds to a moderately stressful number of invalid requests. For more advanced and aggressive penetration testing, commercial load generation devices from companies such as [IXIA/KeySight](https://www.keysight.com/us/en/products/network-test.html) are usually required.

## Conclusion

DoS/DDos attacks are a real threat to web servers. Attackers flood a server with valid and invalid packets in an attempt to keep it from responding to legitimate users. Kali Linux is a Debian-based operating system specializing in security and penetration testing. One of its featured tools is the `hping3` utility. This tool sends a flood of TCP `SYN` packets to a target at a predetermined rate. This attack opens and then abandons a large number of TCP sessions, stressing the web server. For more information on Kali Linux and `hping3`, see the [Kali Linux Documentation](https://www.kali.org/docs/).
