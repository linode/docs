---
slug: how-to-use-nslookup-command
description: 'The nslookup command lets you quickly obtain DNS records. Learn how to use nslookup, including both interactive and non-interactive modes.'
keywords: ['nslookup command','nslookup ip address','how to use nslookup','nslookup examples']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-01
modified_by:
  name: Linode
title: "Use the nslookup Command"
title_meta: "A Complete Guide to the nslookup Command"
external_resources:
- '[nslookup man page](https://manpages.ubuntu.com/manpages/bionic/man1/nslookup.1.html)'
- '[Wikipedia nslookup page](https://en.wikipedia.org/wiki/Nslookup)'
- '[Wikipedia Domain Name System page](https://en.wikipedia.org/wiki/Domain_Name_System)'
- '[Microsoft nslookup documentation](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/nslookup)'
authors: ["Jeff Novotny"]
---

The `nslookup` command is a useful tool for investigating domain name propagation issues. It allows users to obtain information regarding domain names and IP addresses from the *Domain Name System* (DNS) infrastructure. This guide introduces and explains how to use the `nslookup` command, and provides several examples.

## What is the nslookup Command?

The name of the `nslookup` command is an abbreviated version of "name server lookup". `nslookup` sends a request to the local domain name system server asking for information from its DNS records. In response, the DNS server returns the IP address or relevant domain information for a specific website or server. However, it can also return the domain associated with a particular IP address.

The `nslookup` command can be used in either interactive or non-interactive mode. It is available on Linux, macOS, and Windows systems, and provides several useful options. The command relies on the underlying TCP/IP and networking system tools.

Here are some of the main purposes of the `nslookup` command:

-   `nslookup` quickly returns the IP address for any domain. It is considered one of the best tools for troubleshooting DNS problems. It is especially handy for situations where the IP address of a domain has recently changed, but requests for the domain are not resolving.
-   It is used to investigate suspicious domains. A good example is a web address designed to closely mimic an existing domain, for instance, `examp1e.com` in place of `example.com`.
-   It can defend against *cache poisoning* in which invalid domain information is sent to secondary DNS servers, known as resolvers.

### How Do DNS Lookups Work?

Each DNS server maintains a list of mappings between domain names and their associated IP addresses. When a DNS server receives a DNS request for a particular domain name from a web server, it translates the domain into an IP address. It then returns the address to the web server, which uses it to request the web page. Every internet client uses DNS services to properly transmit outgoing TCP/IP packets.

Typically a DNS responds to a request by retrieving information from its cache. The cache is updated when updates are received. If the domain name entry for a particular domain has been recently changed, the server might not have received the updated information yet. In this event, the `nslookup` command still receives the outdated information from the DNS. This allows users to see what the local DNS record points to and determine whether the DNS update has propagated fully.

The `nslookup` command typically sends its request to the local DNS server. However, an alternate DNS can be specified, such as the root system within the DNS zone. Not all servers are accessible because many internal DNS systems are private and do not respond to external requests. Therefore, private DNS servers don't respond to external `nslookup` requests.

{{< note respectIndent=false >}}
In actual practice, there are two types of DNS services. A recursive DNS service, also known as a *resolver*, maintains a cache of the domain name mappings, but does not process any updates.

In many networks, a resolver initially handles DNS queries. If it does not have the information, perhaps because the entry has aged out, it forwards the request to an authoritative DNS. Authoritative DNS systems maintain the master DNS records and are responsible for keeping the tables updated. The authoritative DNS returns the IP address to the resolver, which relays it back to the original web server. The resolver also caches the mapping for future requests.
{{< /note >}}

### What Information Can the nslookup Command Retrieve?

A DNS server maintains several different types of domain records, covering topics including reverse lookups, mail servers, and time-to-live settings. Here is a list of all the available DNS records.

- **Address (A) Record**: Lists the IP address of the domain. Each address for the domain is described using a separate address record, so a domain can have multiple addresses and "A" records.
- **Canonical Name (CNAME) Record**: Lists any aliases for the host.
- **Mail Exchange (MX) Record**: Provides information about the mail servers within the domain.
- **Name Server (NS) Record**: Lists all primary and secondary name servers for the domain.
- **Pointer (PTR) Record**: A pointer record enables reverse lookups. It lists the host name associated with an IP address.
- **Start of Authority (SOA) Record**: An SOA record indicates the most authoritative host for the DNS zone. A zone groups together multiple domains within the same organization.
- **Text (TXT) Record**: A TXT record contains notes about the domain. Administrators often use this field to verify ownership and prevent spam.
- **Time-to-Live (TTL) Record**: This setting indicates how long resolvers should cache the DNS information.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Use the nslookup Command

`nslookup` is available for the Linux, macOS, and Windows operating systems. However, the syntax is structured slightly different on Windows. This guide focuses on how to use the command on Linux-based systems, but the commands are very similar on macOS. Information on how to use `nslookup` on Windows can be found in the [Microsoft documentation](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/nslookup).

The `nslookup` command supports both interactive and non-interactive modes. Interactive mode is useful for script development, troubleshooting, and exploratory searches. The non-interactive command is better for quick searches for a single piece of information. The non-interactive command can be fully integrated into scripts and software applications.

`nslookup` is pre-installed and ready-to-use on most Linux-based systems. If it is not, it easily can be installed from the command line.

-   **Debain** and **Ubuntu**:

        sudo apt-get install dnsutils

-   **AlmaLinux**, **CentOS Stream**, **Fedora**, and **Rocky Linux**:

        sudo dnf install bind-utils

### Using nslookup in Interactive Mode

To use `nslookup` interactively, simply enter the command `nslookup` from a terminal with no additional parameters. The interactive prompt should appear.

    nslookup

{{< output >}}
>
{{< /output >}}

{{< note respectIndent=false >}}
If you receive an error message when running the `nslookup` command, the network services might have been stopped. Reboot the system to reinitialize the process.
{{< /note >}}

The interactive prompt accepts requests for server information without requiring the `nslookup` command. To use `nslookup` to find the IP address for the English-language Wikipedia domain, enter the following:

    en.wikipedia.org

The local DNS server returns its own address along with information about the `en.wikipedia.org` domain. The reply lists the canonical name of the server and its Ipv4 and Ipv6 addresses:

{{< output >}}
Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
en.wikipedia.org	canonical name = dyna.wikimedia.org.
Name:	dyna.wikimedia.org
Address: 91.198.174.192
Name:	dyna.wikimedia.org
Address: 2620:0:862:ed1a::1
{{< /output >}}

{{< note respectIndent=false >}}
This answer is said to be `non-authoritative` because it is provided by the local DNS, not the DNS associated with the domain.
{{< /note >}}

To change the request type, use the `set` directive and append the preferred option. The following example sets the type for all further requests to `ns`. This instructs the `nslookup` utility to request information about the name servers used within the domain.

    set type=ns

When `nslookup` sends another query about the domain, a list of nameservers is retrieved.

    wikipedia.org

{{< output >}}
Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
wikipedia.org	nameserver = ns0.wikimedia.org.
wikipedia.org	nameserver = ns1.wikimedia.org.
wikipedia.org	nameserver = ns2.wikimedia.org.

Authoritative answers can be found from:
{{< /output >}}

To exit interactive mode, use the `exit` keyword.

    exit

### Using nslookup Non-interactively

`nslookup` can also be used in non-interactive mode, in the same way as other Linux commands. To use the `nslookup` command non-interactively, use the format `nslookup [options] domain_name`. The command returns the same information it did in interactive mode. This is the correct mode to use in scripts and applications requiring accurate DNS information.

To display basic information about a domain, enter the `nslookup` command and the name of the domain. This example displays the "A" records for the domain. An "A" record lists the IP addresses for a web host.

    nslookup wikipedia.org

{{< output >}}
Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
Name:	wikipedia.org
Address: 91.198.174.192
Name:	wikipedia.org
Address: 2620:0:862:ed1a::1
{{< /output >}}

To validate the results on a different DNS server, append the name of the server to the end of the command. This example requests the IP address of `wikipedia.org` directly from a Wikipedia name server. The response contains the authoritative answer for the domain.

    nslookup wikipedia.org ns0.wikimedia.org

{{< output >}}
Server:		ns0.wikimedia.org
Address:	208.80.154.238#53

Name:	wikipedia.org
Address: 91.198.174.192
Name:	wikipedia.org
Address: 2620:0:862:ed1a::1
{{< /output >}}

## nslookup Examples

Although users are most often searching for nameserver and IP address information, `nslookup` provides access to all DNS records. This section includes examples showing how to use `nslookup` to obtain more detailed DNS information.

Specify the type of record to search for using the `type` option. Add the option `-type=option_type` directly after the `nslookup` directive and before any domain name. Replace `option_type` with the name of the record type. For instance, to view the nameservers for a domain, use `-type=ns`. The following example displays nameserver information for `wikipedia.org`.

    nslookup -type=ns  wikipedia.org

{{< output >}}
Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
wikipedia.org	nameserver = ns0.wikimedia.org.
wikipedia.org	nameserver = ns1.wikimedia.org.
wikipedia.org	nameserver = ns2.wikimedia.org.

Authoritative answers can be found from:
{{< /output >}}

To view mail server information for a domain, set the `type` to `mx`.

    nslookup -type=mx  wikipedia.org

{{< output >}}
Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
wikipedia.org	mail exchanger = 10 mx1001.wikimedia.org.
wikipedia.org	mail exchanger = 10 mx2001.wikimedia.org.

Authoritative answers can be found from:
{{< /output >}}

`nslookup` can also retrieve the official *Start of Authority* (SOA) record, containing vital information about the domain. This information includes the email address of the administrator and DNS parameters such as refresh time. Use `-type=soa` to search for this information.

    nslookup -type=soa wikipedia.org

{{< output >}}
Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
wikipedia.org
    origin = ns0.wikimedia.org
    mail addr = hostmaster.wikimedia.org
    serial = 2022030414
    refresh = 43200
    retry = 7200
    expire = 1209600
    minimum = 3600

Authoritative answers can be found from:
{{< /output >}}

It is often useful to compare SOA records between sites. The SOA record for `amazon.com` has much lower `refresh` and `retry` numbers, suggesting the domain information might change more frequently.

    nslookup -type=soa amazon.com

{{< output >}}
Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
amazon.com
    origin = dns-external-master.amazon.com
    mail addr = root.amazon.com
    serial = 2010161662
    refresh = 180
    retry = 60
    expire = 3024000
    minimum = 60

Authoritative answers can be found from:
{{< /output >}}

The TXT records are used to validate domain information. Use `-type=txt` to retrieve this information.

    nslookup -type=txt wikipedia.org

{{< output >}}
Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
wikipedia.org	text = "google-site-verification=AMHkgs-4ViEvIJf5znZle-BSE2EPNFqM1nDJGRyn2qk"
wikipedia.org	text = "yandex-verification: 35c08d23099dc863"
wikipedia.org	text = "v=spf1 include:wikimedia.org ~all"

Authoritative answers can be found from:
{{< /output >}}

Use the option `-type=any` to view the full DNS records for a domain.

    nslookup -type=any google.com

{{< output >}}
Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
Name:	google.com
Address: 216.58.212.206
Name:	google.com
Address: 2a00:1450:4009:81e::200e
google.com	mail exchanger = 10 smtp.google.com.
google.com	nameserver = ns4.google.com.
google.com	nameserver = ns3.google.com.
google.com	nameserver = ns1.google.com.
google.com	nameserver = ns2.google.com.

Authoritative answers can be found from:
{{< /output >}}

{{< note respectIndent=false >}}
Some domains are not configured to return all information in response to this request, and only return the name servers. In this case, you must request each type of record separately.
{{< /note >}}

It's also possible to ask for information about a particular name server. Use `nslookup` and the name of the domain, along with the canonical name of the name server. This example demonstrates how to find out details about Wikipedia's `ns0.wikimedia.org` name server.

    nslookup wikipedia.org ns0.wikimedia.org

{{< output >}}
Server:		ns0.wikimedia.org
Address:	208.80.154.238#53

Name:	wikipedia.org
Address: 91.198.174.192
Name:	wikipedia.org
Address: 2620:0:862:ed1a::1
{{< /output >}}

To debug the information from `nslookup`, use the `-debug` flag. Debug mode displays the queries sent to the DNS server along with the replies received in response.

    nslookup -debug wikipedia.org

{{< output >}}
Server:		127.0.0.53
Address:	127.0.0.53#53

------------
    QUESTIONS:
    wikipedia.org, type = A, class = IN
    ANSWERS:
    ->  wikipedia.org
    internet address = 91.198.174.192
    ttl = 600
    AUTHORITY RECORDS:
    ADDITIONAL RECORDS:
------------
Non-authoritative answer:
Name:	wikipedia.org
Address: 91.198.174.192
------------
    QUESTIONS:
    wikipedia.org, type = AAAA, class = IN
    ANSWERS:
    ->  wikipedia.org
    has AAAA address 2620:0:862:ed1a::1
    ttl = 600
    AUTHORITY RECORDS:
    ADDITIONAL RECORDS:
------------
Name: wikipedia.org
Address: 2620:0:862:ed1a::1
{{< /output >}}

For more information on the list of available `nslookup` options, consult the [Linux man page](https://manpages.ubuntu.com/manpages/bionic/man1/nslookup.1.html).

{{< note respectIndent=false >}}
Most DNS requests are sent and received using TCP port 53. To request DNS information from a different port, use the `-port` flag, for example `nslookup -port=55  wikipedia.org`. In most cases DNS servers are configured to refuse these requests, resulting in the error message `communications error to 127.0.0.53#55: connection refused`.
{{< /note >}}

## How to Use nslookup for Reverse Lookups

Although `nslookup` can find the IP address for a domain, it can also reveal the domain mapped to an IP address. This is referred to as a *reverse DNS* lookup. To perform a reverse lookup, apply the `nslookup` command to the IP address under investigation. The following example illustrates how to find the domain that is mapped to the address `91.198.174.192`.

{{< note respectIndent=false >}}
The output displays the IP address in reverse order, so `91.198.174.192` is transposed to `192.174.198.91` in the display. The octets are presented in reverse order due to complex technical reasons involving the `in-addr.arpa` domain tree specification.
{{< /note >}}

    nslookup 91.198.174.192

{{< output >}}
192.174.198.91.in-addr.arpa	name = text-lb.esams.wikimedia.org.

Authoritative answers can be found from:
{{< /output >}}

A second alternative is to use the `-type=ptr` option and the address in reverse order to find the domain. The pointer record confirms the domain owns the address in question.

    nslookup -type=ptr 192.174.198.91.in-addr.arpa

{{< output >}}
Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
192.174.198.91.in-addr.arpa	name = text-lb.esams.wikimedia.org.

Authoritative answers can be found from:
{{< /output >}}

## Conclusion

The `nslookup` command is used to discover DNS information about a domain. It can work in either interactive or non-interactive mode, and is available for Linux, macOS, and Windows servers. `nslookup` can return the IP address for a domain, along with information about its nameservers, mail servers, and State of Authority record. It can also handle reverse DNS lookups for translating an IP address into a domain. For more information, see the [Linux nslookup man page](https://manpages.ubuntu.com/manpages/bionic/man1/nslookup.1.html).