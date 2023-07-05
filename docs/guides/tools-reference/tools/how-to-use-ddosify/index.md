---
slug: how-to-use-ddosify
title: "How to Use Ddosify"
description: 'This guide explains how to install Ddosify and how to use it to test a system response to a denial of service attack.'
keywords: ['Ddosify', 'install Ddosify', 'Ddosify test DoS attack', 'how to use Ddosify']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ['Jeff Novotny']
published: 2023-02-13
modified_by:
  name: Linode
external_resources:
- '[Ddosify website](https://ddosify.com/)'
- '[Ddosify GitHub site and documentation](https://github.com/ddosify/ddosify)'
- '[Sample Ddosify .json configuration file](https://github.com/ddosify/ddosify/blob/master/config_examples/config.json)'
- '[Wikipedia entry on Denial of Service Attacks](https://en.wikipedia.org/wiki/Denial-of-service_attack)'
---

One of the more serious threats to a website or online application is a *distributed denial-of-service* (DDoS) attack. This can result in errors, crashes, degraded performance, or the complete inaccessibility of the resource. The best way to combat this problem is to incorporate stress testing into the quality control process. [Ddosify](https://ddosify.com/) can flood a system with traffic to simulate this type of attack. This guide explains how to install and use Ddosify and provides some background about DDoS threats.

## What is a DDoS Attack?

A distributed denial-of-service attack is a type of distributed cyber-attack originating from multiple sources. When the attack has a single origin, it is usually referred to as a *denial-of-service* (DoS) attack. The purpose of the attack is to slow down the target or exhaust its available bandwidth. This can make it more difficult for users to access the server resources. An attack can even knock an application or website completely offline by exploiting flaws in its design.

The most common DoS technique is to use a *botnet* to flood a connection with traffic. While each request might be legitimate, a large number of repeated or nonsensical requests usually indicate malicious intent. Hackers send a large volume of packets to the target in an attempt to keep it busy receiving and processing packets and transmitting replies. In a cloud computing situation, attackers might force a provider to auto-deploy new servers or increase the available bandwidth, incurring extra costs. DoS attackers often use some of the following techniques.

- The packets used in a DoS attack are often large and complex, with many header options. More complicated packets take more time to parse and process and increase strain on the system.
- Packets can be sent very slowly to maximize the number of open connections and strain the target system.
- Malformed packets are frequently sent to increase the load on the target system. The target might fail to properly handle invalid packets, leading to crashes, degraded performance, or memory leaks.
- In a *Layer 7 DDoS Attack*, hackers target specific applications, such as forms or a database search. These features are often targeted because they take up more computing power.

There are many known types of DoD/DDoS attacks. The attack is often combined with an attempt to access restricted information, including user information or financial details. Many techniques have been developed to defend against a DoS attack, including ingress filtering, IP address blocking, bandwidth management, and rate limiting. Some applications use *upstream filtering*. This diverts all traffic to a *scrubbing center* which discards any unwanted or excessive traffic. The [Wikipedia Denial of Service entry](https://en.wikipedia.org/wiki/Denial-of-service_attack) provides a brief description of the various types of DoS/DDoS attacks and some strategies to combat them.

## What is Ddosify?

Ddosify is a free open-source tool used for testing a system's response to a DoS attack. It is written using Golang for enhanced performance. By adjusting the parameters and rate of the Ddosify test traffic, web administrators can analyze system robustness and resilience. Ddosify supports command line parameters to adjust the traffic rate and test duration, add packet headers, and set the request type, among other attributes. Ddosify can also read test parameters from a `.json` file.

There are two different variants of Ddosify. The *Ddosify Engine* command line utility is available as a pre-compiled application or Docker container. It is also possible to download and compile the Golang source code. The web-based *Ddosify Cloud* application provides a GUI, more detailed charts and reports, and additional features. The free version of Ddosify is somewhat limited, while the commercial edition has more features and a higher capacity. However, all instances of the application are straightforward to use. No programming knowledge is required to use Ddosify.

Here are some of the advantages and features of Ddosify.

-   HTTP, HTTPS, and HTTP2 support is available.
-   Users can define their own test cases in a `.json` file.
-   Different load types are available, including `linear` and `incremental, which increase throughout the test.
-   Ddosify displays detailed real-time results. It can save the output in a variety of formats.
-   Dynamic variables and parameters can be incorporated into test cases.
-   Test data can be imported from a CSV file and used in the test.

## How to Stress Test a Web Application Against a DDOS Attack?

Transmitting a large amount of traffic to the root of the domain can help determine the maximum capacity of the website. However, this does not test the complex scenarios more likely to cause problems. A full test methodology takes into account the design and architecture of the website or web application and identifies potential weak spots. Test activities should be directed at these vulnerabilities. However, it is a good idea to schedule periodic load tests, especially if the site design has changed.

The following list describes some issues to consider when developing the stress test.

-   Sections of the website or application that accept user data.
-   Connections to PHP, the database, or third-party modules.
-   URL-based parameters.
-   Different types of HTTP requests, for example, `POST` or `PUT`.
-   Malformed or erroneous packets.
-   Interior pages of the website, especially those involving additional processing. Examples include the checkout or login page. Pay close attention to user actions such as adding and removing items from a cart or abandoning carts at checkout.
-   Multi-page processes require subsequent user input after an initial request.
-   Special functionality, including password resets or contact forms.

{{< caution >}}
Only use Ddosify to test a system under your control. It is unethical and potentially illegal to use it to probe other systems.
{{< /caution >}}

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  Create and configure a domain name and point it at the Linode under test. It is easier to use Ddosify in conjunction with a domain name. For more information on domains and how to create a DNS record, see the [Linode DNS Manager](/docs/guides/dns-manager/) guide.

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install Ddosify

Select a server to host the Ddosify application. Although Ddosify can be used to test the local system, this does not represent a realistic scenario. Ddosify is typically used to analyze a remote *Device Under Test* (DUT). The DUT represents the server hosting the application to test. Traffic is sent from the server running Ddosify to the DUT, which returns the relevant HTTP response. These responses are used to analyze the performance of the DUT.

This guide explains how to configure the server hosting Ddosify, but does not explain how to configure the DUT. However, the DUT must have an operational web server to receive and respond to the Ddosify requests. This guide is designed for systems running Ubuntu 22.04 LTS but is generally applicable to all Linux distributions and releases. To install Ddosify, follow these steps.

{{< note >}}
This guide only covers the installation of the precompiled application. To build Ddosify from the source code or install the Docker container, consult the [DDosify documentation](https://github.com/ddosify/ddosify).
{{< /note >}}

1.  Ensure the system is up to date. Reboot the system if necessary.

    ```command
    sudo apt-get update -y && sudo apt-get upgrade -y
    ```

1.  Install Ddosify using the installation script. The script automatically selects the latest stable release of the application. Download the script using `curl`.

    ```command
    sudo curl -sSfL https://raw.githubusercontent.com/ddosify/ddosify/master/scripts/install.sh | sh
    ```

    ```output
    Installing ddosify to /usr/local/bin/
    Installed ddosify to /usr/local/bin/
    ```

1.  Confirm the release of Ddosify using the `-version` option.

    ```command
    ddosify -version
    ```

    ```output
    Version:        v0.14.0
    Git commit:     c70e3fd
    Built           2023-02-14T15:12:58Z
    Go version:     go1.18.10
    OS/Arch:        linux/amd64
    ```

## How to Use Ddosify

Ddosify is fairly straightforward to use, although many configuration options are available. Run Ddosify from the terminal using the `ddosify` command, specifying the target site and any additional parameters.

To use Ddosify to launch a simulated DoS attack, run the `ddosify` command, appending the target system using the `-t` option. The target is usually specified using its domain name, but it is also possible to use its IP address. By default, Ddosify transmits 100 packets, but this number can be adjusted using the `-n` option.

The following example transmits 25 packets to `example.com`. Substitute the domain name of the DUT in place of `example.com`. To terminate the test at any time, enter `Ctrl-C`.

{{< note >}}
To conduct a proper test, the remote system must allow all test traffic through its firewall. This means `ufw`, or any other firewall, must permit web server traffic.
{{< /note >}}

```command
ddosify -t http://example.com/ -n 25
```

Ddosify updates the results in real-time as the test progresses. After the trial is complete, it provides a summary of the results. The following output confirms all responses were received, with some variance in latency.

```output
CTRL+C to gracefully stop.
✔️  Successful Run: 6      100%       ❌ Failed Run: 0        0%       ⏱️  Avg. Duration: 0.30093s
✔️  Successful Run: 9      100%       ❌ Failed Run: 0        0%       ⏱️  Avg. Duration: 0.23000s
✔️  Successful Run: 15     100%       ❌ Failed Run: 0        0%       ⏱️  Avg. Duration: 0.17400s
✔️  Successful Run: 17     100%       ❌ Failed Run: 0        0%       ⏱️  Avg. Duration: 0.16386s
✔️  Successful Run: 21     100%       ❌ Failed Run: 0        0%       ⏱️  Avg. Duration: 0.14940s
✔️  Successful Run: 23     100%       ❌ Failed Run: 0        0%       ⏱️  Avg. Duration: 0.14563s
✔️  Successful Run: 25     100%       ❌ Failed Run: 0        0%       ⏱️  Avg. Duration: 0.14112s

RESULT
-------------------------------------
Success Count:    25    (100%)
Failed Count:     0     (0%)

Durations (Avg):
  DNS                  :0.0043s
  Connection           :0.0466s
  Request Write        :0.0017s
  Server Processing    :0.0883s
  Response Read        :0.0002s
  Total                :0.1411s

Status Code (Message) :Count
  200 (OK)    :25
```

### Optional Parameters for Ddosify

It is possible to adjust the default test parameters. The most common Ddosify flags are as follows.

- **-a**: Authentication parameters. This value should take the form `username:password`.
- **-b**: The contents of the body of the packet. This represents the packet payload.
- **-d**: The test duration in seconds.
- **-h**: A header for the request. Multiple headers can be specified using multiple `-h` parameters.
- **-l**: The type of load test. This parameter accepts the values `linear`, `incremental` and `waved`. `linear` transmit packets at the same rate throughout the test. The `incremental` setting increases the packet rate as the test proceeds. The `waved` setting alternates between higher and lower traffic levels.
- **-m**: Type of HTTP request method to use. Some possible values include `GET`, `PUT`, `POST`, `DELETE`, and `OPTIONS`.
- **-n**: The total number of packets to transmit.
- **-P**: A proxy address for the request.
- **-T**: The timeout to use for each request.
- **-t**: The URL of the target website. This parameter is mandatory unless a configuration file is used.

The following example demonstrates how to use multiple parameters in the same test. Even though the request is invalid, the test is considered successful because the expected result is achieved. All requests return the status code `405` because the `POST` method is not allowed on this resource.

```command
ddosify -t http://example.com -n 50 -d 4 -b "Test" -h 'Accept: text/html' -l waved -m POST -T 5
```

```output
✔️  Successful Run: 16     100%       ❌ Failed Run: 0        0%       ⏱️  Avg. Duration: 0.23044s
✔️  Successful Run: 41     100%       ❌ Failed Run: 0        0%       ⏱️  Avg. Duration: 0.14256s
✔️  Successful Run: 50     100%       ❌ Failed Run: 0        0%       ⏱️  Avg. Duration: 0.13249s

RESULT
-------------------------------------
Success Count:    50    (100%)
Failed Count:     0     (0%)

Durations (Avg):
  DNS                  :0.0056s
  Connection           :0.0403s
  Request Write        :0.0001s
  Server Processing    :0.0864s
  Response Read        :0.0001s
  Total                :0.1325s

Status Code (Message) :Count
  405 (Method Not Allowed)    :50
```

### Help and Debug Information for Ddosify

The `--debug` parameter displays detailed results about a single iteration of the test. Ddosify runs the test once and dumps the packet contents of both the request and response. This is especially helpful for debugging complicated trails containing many parameters or analyzing failures.

```command
ddosify -t http://example.com -n 25 --debug
```

```output
Running in debug mode, 1 iteration will be played...
CTRL+C to gracefully stop.

STEP (1)
-------------------------------------
- Environment Variables

- Test Data

- Request
    Target:     http://example.com
    Method:     GET
    Headers:
    Body:

- Response
    StatusCode:    200
    Headers:
        Date:             Wed, 15 Feb 2023 13:59:08 GMT
        Server:           nginx/1.18.0 (Ubuntu)
        Last-Modified:    Tue, 14 Feb 2023 16:17:46 GMT
        Content-Type:     text/html
        Etag:             W/"63ebb42a-264"
        Connection:       keep-alive
    Body: <!DOCTYPE html>
<html>
...
</html>
```

To display help information, append the `--help` flag. Ddosify provides a list of the command line options.

```command
ddosify --help
```

```output
Usage of ddosify:
  -P string
    Proxy address as protocol://username:password@host:port. Supported proxies [http(s), socks]
...
  -version
    Prints version, git commit, built date (utc), go information and quit
```

### Running a Ddosify Test Using a Configuration File

For more complex scenarios, Ddosify allows users to run tests based on the contents of a configuration file. This file must be written in JSON format. The configuration file allows for greater control over the parameters and can more precisely define the flow of a test case. It permits multiple test stages, each using unique parameters.

To set test parameters based on a configuration file, append the `--config` flag to the `ddosify` command. This parameter accepts the location of a `.json` file containing a detailed parameterized description of the test. The configuration file overrides all other settings, including the target, which must be specified in the configuration file.

The following example uses a very trivial configuration as an example. For a more detailed example of a Ddosify configuration file, study the [sample configuration](https://github.com/ddosify/ddosify/blob/master/config_examples/config.json) on the Ddosify GitHub site. More information on using the `--config` flag is available in the [Ddosify GitHub documentation](https://github.com/ddosify/ddosify#config-file).

```file {title="config.json"}
{
    "iteration_count": 30,
    "debug" : false,
    "load_type": "linear",
    "duration": 5,
    "steps": [
    {
      "id": 1,
      "url": "http://example.com",
      "protocol": "http",
      "method": "POST",
      "timeout": 3
    }
  ]
}
```

```command
ddosify --config config.json
```

## Conclusion

Ddosify is an application for flooding a target system with traffic to simulate a denial-of-service attack. This test strategy allows system administrators to analyze the resilience of their system in advance of an actual attack. Ddosify can be downloaded as a pre-compiled executable, a Docker container, or as Golang source code. To use Ddosify, run the `ddosify` command, specifying the name of the target site. To control the test case, users can adjust parameters indicating the format and rate of the packets, the test duration, and the type of traffic. Ddosify can also use a `.json` file to describe the test parameters. For more information on Ddosify, consult the [Ddosify documentation](https://github.com/ddosify/ddosify).
