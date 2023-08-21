---
slug: how-to-use-fluentd-for-data-logging
title: "How to Use Fluentd for Data Logging"
title_meta: "Using Fluentd for Open Source Unified Data Logging"
description: 'Discover the power of Fluentd for data logging. This guide introduces this open source tool, provides steps to install it, and a simple example to get you started.'
og_description: 'Discover the power of Fluentd for data logging. This guide introduces this open source tool, provides steps to install it, and a simple example to get you started.'
keywords: ['fluentd for data logging','fluentd','open source data logging','unified logging layer','logging with json']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Tom Henderson"]
published: 2023-08-17
modified_by:
  name: Linode
external_resources:
- '[Fluentd](https://www.fluentd.org/)'
---

Fluentd is under the umbrella of the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/projects/fluentd/) Graduated Hosted Projects. Fluentd is a data collector, log aggregator, and parsed data forwarder. Fluentd is an Apache 2-licensed free and open source project formed to aggregate logs from diverse sources, and is written in Ruby and C.

Fluentd uses plug-ins to parse and reformat data flowing through the application. Plug-ins use JSON-formatted data concepts, allowing programmers can adapt specific applications as inputs or outputs by modifying existing plug-ins and their configurations.

Fluentd is highly extensible, with over 1,000 plug-in modules available.

## What is a Unified Logging Layer?

Fluentd takes diverse data input sources found in various application log types, parses this input, and renders a chosen uniform output stream. This data is then used by other applications and/or for uniform log archiving and further analysis. Fluentd uses *directives* that modify the flow to match expressions, control flow, and route flows.

The Fluentd uniform output stream can be sent to many different application destinations. These include inputs to NoSQL and SQL databases, archival applications, and monitoring console apps. Fluentd unifies input logs and messages then outputs them in a configured, stratified stream specified by Fluentd and its plug-in configuration. Many plug-ins are available on GitHub.

Data outputs from Fluentd are handled similarly through administratively defined or standardized streams. These are set by program configuration, or a combination of Fluentd configuration and chosen plug-in options.

Fluentd is capable of handling many diverse data inputs and output destinations concurrently through the use of plug-ins. Input and output data stream at different speeds and event cycles.

Several instances of Fluentd can run in parallelizing schemes on different hosts for fault tolerance and continuity. Data sources external to the hosted Fluentd versions require network pathway considerations, including firewall, routing, pathway congestion, and encryption. Fluentd conversation configurations can support SSL/TLS encryption.

## Fluentd Plug-Ins

Input and output plug-ins are required to parse data flows through Fluentd. Choose your plug-ins and study their configuration files and options, then clear a network pathway for their data flow. The network delivery path must be reachable by the Fluentd instance/s, and congestion avoided.

Fluentd plug-ins are categorized by *role*, of which there are nine:

-   Input
-   Parser
-   Filter
-   Output
-   Formatter
-   Service Discovery
-   Buffer
-   Metrics

Plug-ins use a naming convention associated with their role as an input or output plug-in. As an example, `in_syslog` is an input plug-in, using the `in_` prefix.

The output plug-ins, prefixed with `out_`, have three different flushing and buffering modes:

-   **Non-Buffered**: The plug-in does not buffer data. It writes or outputs results immediately after processing.

-   **Synchronous Buffered**: The plug-in outputs data in chunks specified by the <buffer> data value set in its configuration. When a <buffer> datum is set, the plug-in sends chunks of data at a specified speed. This technique is used to prevent destination congestion.

-   **Asynchronous Buffered**: The plug-in stores data for later transmission.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides. This guide focuses on Ubuntu and Debian Linux as hosts for Fluentd, although adaptations of Fluentd can be found for Windows and macOS as well.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system and create a limited user account.

1.  Fluentd input and output are synchronized to a time source, and Fluentd recommends setting up a Network Time Protocol daemon prior to software installation. In cloud environments with many separated data sources, a single source of NTP synchronization is recommended. The NTP time becomes the basis for data stamping through the parsing stages that Fluentd performs.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

The commands, file contents, and other instructions provided throughout this guide may include placeholders. These are typically domain names, IP addresses, usernames, passwords, and other values that are unique to you. The table below identifies these placeholders and explains what to replace them with:

| Placeholder: | Replace With: |
| -- | -- |
| `EXAMPLE_USER` | The username of the current user on your local machine. |

### Required Resources

1.  Check the maximum number of file descriptors:

    ```command
    ulimit -n
    ```

    ```output
    1024
    ```

    If the answer is the default of `1024`, an adjustment must be made to the `/etc/security/limits.conf` file.

1.  Open the `/etc/security/limits.conf` file using a text editor with root permissions:

    ```command
    sudo nano /etc/security/limits.conf
    ```

1.  Add the following lines to the end of the file but replace `EXAMPLE_USER` with your actual username.

    ```file {title="/etc/security/limits.conf"}
    EXAMPLE_USER soft nofile 65536
    EXAMPLE_USER hard nofile 65536
    ```

1.  When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  To admit the larger values, reload the kernel by rebooting:

    ```command
    sudo reboot
    ```

1.  When the system reboots, recheck the maximum number of file descriptors:

    ```command
    ulimit -n
    ```

    ```output
    65536
    ```

## Installing Fluentd

Fluentd is deployed as a server application. There are two versions available: Fluentd and *td-agent*. Both versions behave identically, but [there are differences](https://www.fluentd.org/faqs). Fluentd is available as a Ruby gem or source code, while td-agent offers typical packages for Linux, macOS, and Windows. These examples use the td-agent installation.

1.  First, launch the appropriate cURL command for your operating system and version. The command installs the app and dependencies for the chosen version.

    {{< tabs >}}
    {{< tab "Ubuntu 22.04" >}}
    ```command
    curl -fsSL https://toolbelt.treasuredata.com/sh/install-ubuntu-jammy-td-agent4.sh | sh
    ```
    {{< /tab >}}
    {{< tab "Ubuntu 20.04" >}}
    ```command
    curl -fsSL https://toolbelt.treasuredata.com/sh/install-ubuntu-focal-td-agent4.sh | sh
    ```
    {{< /tab >}}
    {{< tab "Debian 11" >}}
    ```command
    curl -fsSL https://toolbelt.treasuredata.com/sh/install-debian-bullseye-td-agent4.sh | sh
    ```
    {{< /tab >}}
    {{< tab "Debian 10" >}}
    ```command
    curl -fsSL https://toolbelt.treasuredata.com/sh/install-debian-buster-td-agent4.sh | sh
    ```
    {{< /tab >}}
    {{< /tabs >}}

    ```output
    Installation completed. Happy Logging!
    ```

1.  Once the version-appropriate shell script is successfully executed, check to see if the service is `acitve (running)`:

    ```command
    sudo systemctl status td-agent.service
    ```

    If `active (running)`, the output should look like this:

    ```output
    ● td-agent.service - td-agent: Fluentd based data collector for Treasure Data
         Loaded: loaded (/lib/systemd/system/td-agent.service; enabled; vendor pres>
         Active: active (running) since Mon 2023-08-21 16:48:13 UTC; 57s ago
           Docs: https://docs.treasuredata.com/display/public/PD/About+Treasure+Dat>
       Main PID: 2102 (fluentd)
          Tasks: 9 (limit: 4557)
         Memory: 96.5M
            CPU: 2.669s
         CGroup: /system.slice/td-agent.service
                 ├─2102 /opt/td-agent/bin/ruby /opt/td-agent/bin/fluentd --log /var>
                 └─2105 /opt/td-agent/bin/ruby -Eascii-8bit:ascii-8bit /opt/td-agen>

    Aug 21 16:48:11 localhost systemd[1]: Starting td-agent: Fluentd based data col>
    Aug 21 16:48:13 localhost systemd[1]: Started td-agent: Fluentd based data coll
    ```

    If not, launch the daemon:

    ```command
    sudo systemctl start td-agent.service
    ```

1.  In order to survive a reboot, set the service to launch at startup:

    ```command
    sudo systemctl enable td-agent.service
    ```

## Testing Fluentd

1.  Open the `/etc/td-agent/td-agent.conf` file in a text editor with root permissions:

    ```command
    sudo nano /etc/td-agent/td-agent.conf
    ```

1.  Append the following configuration to the bottom of the file:

    ```file {title="/etc/td-agent/td-agent.conf"}
    <match our.test>
      @type stdout
    </match>
    ```

1.  When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Restart td-agent for the appendage to take effect:

    ```command
    sudo systemctl restart td-agent
    ```

1.  Once the daemon starts, test it using cURL and the REST API:

    ```command
    curl -X POST -d 'json={"json":"I’m Alive!"}' http://localhost:8888/our.test
    ```

1.  Use the following command to view the result of the test:

    ```command
    tail -n 1 /var/log/td-agent/td-agent.log
    ```

    It should answer with a time stamp and the "I'm Alive!" message:

    ```output
    2023-08-18 17:02:57.005253503 +0000 our.test: {"json":"I’m Alive!"}
    ```

## Syslog Application Example

Ubuntu 20.04 LTS and 22.04 LTS Linodes have the remote syslog known as rsyslog pre-installed and it is used in this example.

Once the Linode is started, login. In this example, `rsyslog.conf` is modified to send log entries to the same port as the Fluentd `tg-agent` is set to listen.

1.  Open `rsyslog.conf` in a text editor with root permissions:

    ```command
    sudo nano /etc/rsyslog.conf
    ```

1.  Append the following line to the bottom of the file:

    ```file {title="/etc/rsyslog.conf"}
    *.* @127.0.0.1:5440
    ```

    The above configuration line tells rsyslog to send syslog data to port `5440` of the local host.

1.  When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  After the file is saved, restart the rsyslog service:

    ```command
    sudo systemctl restart syslog
    ```

    Fluentd typically listens for messages through its plug-ins, however, in this example, the raw syslog messages are monitored, unfiltered, and unmodified. The td-agent file must be modified to make Fluentd listen for syslog-formatted data. Continue the above example of an input source as syslog at port `5440`.

1.  Open `td-agent.conf` in a text editor with root permissions:

    ```command
    sudo nano /etc/td-agent/td-agent.conf
    ```

1.  Append the following lines to the bottom of the file:

    ```file {title="/etc/td-agent/td-agent.conf"}
    <source>
       @type syslog
       port 5440
       tag system
    </source>

    <match system.**>
      @type stdout
    </match>
    ```

1.  When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Restart td-agent for the appendage to take effect:

    ```command
    sudo systemctl restart td-agent
    ```

1.  Rsyslog now outputs to the port where td-agent listens. Use the following command to view proof of the chain:

    ```command
    tail -n 1 /var/log/td-agent/td-agent.log
    ```

    Entries from syslog are found in the td-agent.log:

    ```output
    2023-08-21 17:26:09.000000000 +0000 system.auth.info: {"host":"localhost","ident":"sshd","pid":"4304","message":"Connection closed by 37.129.207.106 port 42964 [preauth]"}
    2023-08-21 17:26:13.000000000 +0000 system.auth.info: {"host":"localhost","ident":"sshd","pid":"4310","message":"Connection closed by 5.218.67.72 port 45500 [preauth]"}
    2023-08-21 17:26:13.000000000 +0000 system.auth.info: {"host":"localhost","ident":"sshd","pid":"4308","message":"Connection closed by 83.121.149.248 port 36697 [preauth]"}
    2023-08-21 17:26:19.000000000 +0000 system.auth.info: {"host":"localhost","ident":"sshd","pid":"4315","message":"Connection closed by 80.191.23.250 port 39788 [preauth]"}
    2023-08-21 17:26:20.000000000 +0000 system.auth.info: {"host":"localhost","ident":"sshd","pid":"4313","message":"Connection closed by 87.248.129.189 port 51192 [preauth]"}
    2023-08-21 17:26:24.000000000 +0000 system.auth.info: {"host":"localhost","ident":"sshd","pid":"4318","message":"Connection closed by 91.251.66.145 port 38470 [preauth]"}
    2023-08-21 17:26:25.000000000 +0000 system.auth.info: {"host":"localhost","ident":"sshd","pid":"4320","message":"Connection closed by 37.129.101.243 port 39424 [preauth]"}
    2023-08-21 17:26:26.000000000 +0000 system.auth.info: {"host":"localhost","ident":"sshd","pid":"4322","message":"Connection closed by 151.246.203.48 port 11351 [preauth]"}
    2023-08-21 17:26:29.000000000 +0000 system.auth.info: {"host":"localhost","ident":"sshd","pid":"4325","message":"Connection closed by 204.18.110.253 port 43478 [preauth]"}
    2023-08-21 17:26:31.000000000 +0000 system.auth.info: {"host":"localhost","ident":"sshd","pid":"4327","message":"Connection closed by 5.214.204.211 port 39830 [preauth]"}
    ```

Rsyslog has an input through the unified layer of Fluentd to the log of the td-agent. This is an unfiltered output that can be sent by an output plug-in to a desired archiving program, SIEM input, or other destination.

Common log sources such as syslog [can have highly tailored processing with Fluentd controls](https://docs.fluentd.org/input/syslog) applied.

## Fluentd Directives

In the example of an rsyslog input shown above, there is no filtration of the information. Fluentd uses a configuration file directive to manipulate data inputs. The Fluentd directives are:

-   **Source**: determines input sources
-   **Match**: parses for regular expression matches
-   **Filter**: determines the event directive pipeline
-   **System**: sets system-wide configuration
-   **Label**: groups the output and filters for internal routing of data
-   **Worker**: directives limit to the specific workers as an object
-   **@Include**: sources other files for inclusion

Behavior is controlled by the type of plug-in(s), how records are matched (accepted, rejected based upon regular expression match), filtered, tagged, and used by workers, system directives, and other behavior specified by @include files.

## Conclusion

Fluentd is highly customizable via its configuration as well as the configuration of the input and output plug-ins used. The unified logging layer represented by Fluentd processing becomes the input for many application destinations. These destinations are often archives, databases, SIEM, management consoles, and other log-processing apps. Fluentd is a unified logging layer application whose scope is modified by the customization of chosen plug-ins. Multiple instances of Fluentd can be configured for fault tolerance.

You should now have a basic understanding of Fluentd, along with some simple hands-on experience from the examples.