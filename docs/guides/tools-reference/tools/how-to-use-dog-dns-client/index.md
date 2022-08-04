---
slug: use-dog-linux-dns-client
author:
  name: Nathaniel Stickman
description: "Learn how to use the dog command-line DNS client, a modern and more user-friendly alternative to dig."
keywords: ['dog dns client','dig alternative linux','dig command examples']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-23
modified_by:
  name: Nathaniel Stickman
title: "Use the Linux dog Command to Look Up DNS Records"
h1_title: "How to Use the Linux dog Command to Look Up DNS Records"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
---

`dog` is a command-line DNS client used for looking up DNS records for domain names. It's an alternative to the popular `dig` command. The `dog` command gives you a simpler interface, more readable results, and additional features like DNS over TLS.

In this guide, learn more about `dog` and how to install and start using it on your Linux system.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What is dog?

[`dog`](https://github.com/ogham/dog) is an open-source DNS client for the command line, much like the popular `dig` tool. With `dog`, you get significant improvements to the interface, along with more readable, color-coded results, and the ability to render those results in JSON. `dog` also adds support for DNS over TLS (DoT) and DNS over HTTPS (DoH) protocols, giving you more options for securing your DNS lookups.

You can learn more about the `dig` command and its features in our guide [Use dig to Perform Manual DNS Queries](/docs/guides/use-dig-to-perform-manual-dns-queries/).

## How to Install dog

1. Install `gcc`, `tar`, and the developer package for `libssl` or `openssl`. Choose the command for your particular Linux distribution.

    - On **Debian** and **Ubuntu**, you can do so with:

            sudo apt install build-essential tar libssl-dev pkg-config

    - On **AlmaLinux**, **CentOS**, and **Fedora**, you can use:

            sudo dnf install gcc tar openssl-devel

    {{< note >}}
You may need to update your system's version of the GNU C library (glibc).
{{</ note >}}

1. Install [Rust](https://www.rust-lang.org/). You need Rust to compile the `dog` source code:

        curl --proto =https --tlsv1.2 -sSf https://sh.rustup.rs | sh

    When prompted, select `1` for the default installation path.

1. Either restart your shell session (exiting and logging back in) or run the following command:

        source $HOME/.cargo/env

1. Navigate to the [releases page](https://github.com/ogham/dog/releases/) for `dog`, identify the latest release, and copy the URL for the `.tar.gz` file.

    {{< note >}}
To access the `.tar.gz` file, navigate to the [**Tags** section](https://github.com/ogham/dog/tags) of the dog releases page.
    {{</ note >}}

1. Download that file, replacing the URL below with the one you copied:

        curl -LO https://github.com/ogham/dog/archive/refs/tags/v0.1.0.tar.gz

1. Extract the contents of the `.tar.gz` file, and change into the extracted directory. Replace the filename below with the one for the file you downloaded. Likewise with the directory name, matching the extracted one:

        tar -xvzf v0.1.0.tar.gz
        cd dog-0.1.0

1. Run the following command to have Cargo compile the binary for `dog`:

        cargo build --release

1. Copy the resulting binary into your current user's `PATH`:

        sudo cp target/release/dog /usr/local/bin

1. Verify your installation by checking the installed version of `dog`:

        dog --version

    {{< output >}}
dog ● command-line DNS client
v0.1.0
https://dns.lookup.dog/
    {{< /output >}}

## How to Use dog

`dog` gives you much of the same functionality of `dig`, but pared down to the essential DNS records. This makes `dog`'s results easier to read and more manageable.

In the section below, you can see how to get started with basic `dog` queries and learn more about its advanced options. If you want to learn more about DNS and its role in managing your servers, refer to the end of this guide for more resources.

### Basic Queries

At its simplest, you can start looking up DNS records with `dog` just by giving it a hostname:

    dog github.com

{{< output >}}
A github.com. 51s   192.0.2.0
{{< /output >}}

The output includes the record type (**A**), the domain name, the time until the record is refreshed (51 seconds), and the record's main contents — a host IP address, in this case. The main contents for a record vary depending on the record type, which you can see with the next example.

`dog` provides color codes to portions of the records it displays. This helps you navigate the information when your response includes several records, like in the image for the next example command below.

`dog` looks up **A** type records by default, which contain IPv4 addresses. But you can easily add more record types to your `dog` lookup, like this:

    dog github.com A AAAA MX NS TXT

{{< output >}}
  A github.com.      40s   192.0.2.0
SOA github.com.   58m20s A "dns1.p08.nsone.net." "hostmaster.nsone.net." 1633608682 12h00m00s 2h00m00s 14d0h00m00s 1h00m00s
SOA github.com.   58m20s A "dns1.p08.nsone.net." "hostmaster.nsone.net." 1633608682 12h00m00s 2h00m00s 14d0h00m00s 1h00m00s
 MX github.com.   42m35s   1 "aspmx.l.google.com."
 MX github.com.   42m35s   10 "alt3.aspmx.l.google.com."
 MX github.com.   42m35s   10 "alt4.aspmx.l.google.com."
 MX github.com.   42m35s   5 "alt1.aspmx.l.google.com."
 MX github.com.   42m35s   5 "alt2.aspmx.l.google.com."
 NS github.com. 1h00m00s   "dns1.p08.nsone.net."
 NS github.com. 1h00m00s   "dns2.p08.nsone.net."
 NS github.com. 1h00m00s   "dns3.p08.nsone.net."
 NS github.com. 1h00m00s   "dns4.p08.nsone.net."
 NS github.com. 1h00m00s   "ns-1283.awsdns-32.org."
 NS github.com. 1h00m00s   "ns-1707.awsdns-21.co.uk."
 NS github.com. 1h00m00s   "ns-421.awsdns-52.com."
 NS github.com. 1h00m00s   "ns-520.awsdns-01.net."
TXT github.com.   11m02s   "MS=6BF03E6AF5CB689E315FB6199603BABF2C88D805"
TXT github.com.   11m02s   "MS=ms44452932"
TXT github.com.   11m02s   "MS=ms58704441"
TXT github.com.   11m02s   "adobe-idp-site-verification=b92c9e999aef825edc36e0a3d847d2dbad5b2fc0e05c79ddd7a16139b48ecf4b"
TXT github.com.   11m02s   "atlassian-domain-verification=jjgw98AKv2aeoYFxiL/VFaoyPkn3undEssTRuMg6C/3Fp/iqhkV4HVV7WjYlVeF8"
TXT github.com.   11m02s   "docusign=087098e3-3d46-47b7-9b4e-8a23028154cd"
TXT github.com.   11m02s   "stripe-verification=f88ef17321660a01bab1660454192e014defa29ba7b8de9633c69d6b4912217f"
    TXT github.com.   11m02s   "v=spf1 ip4:192.30.252.0/22 include:_netblocks.google.com include:_netblocks2.google.com include:_netblocks3.google.com include:spf.protection.outlook.com include:mail.zendesk.com include:_spf.salesforce.com include:servers.mcsv.net ip4:166.78.69.169 ip4:166.78.69.170 ip4:166.78.71.131 ip4:167.89.101.2 ip4:167.89.101.192/28 ip4:192.254.112.60 ip4:192.254.112.98/31 ip4:192.254.113.10 ip4:192.254.113.101 ip4:192.254.114.176 ~all"
{{< /output >}}

For reference, here are some of the most frequently seen DNS record types, along with brief introductions to each:

- **A**: Contain the IPv4 addresses for hosts
- **AAAA**: Contain the IPv6 addresses for hosts
- **CNAME**: Keep aliases between domains
- **MX**: Name the mail server domains behind hosts
- **NS**: Give the nameservers responsible for hosts
- **TXT**: Hold arbitrary text for informational purposes

You can see the list of record types supported by `dog` in its [official documentation](https://dns.lookup.dog/record-types).

As with `dig`, `dog` gives you an option to output short records, using the `--short` flag. With this option, your results only include the main contents of the record — the IP address, for instance, in **A** records, the mail server in **MX** records, or the informational text in **TXT** records:

    dog github.com A --short

{{< output >}}
192.0.2.0
{{< /output >}}

In addition to providing more readable output, `dog` also comes with an option to export your results as JSON. Here's an example that uses a query similar to the one above and saves the results directly as a `.json` file:

    dog github.com A NS TXT --json > dog-github-dns-lookup.json

### Advanced Options

Like `dig`, `dog` lets you specify a DNS server to use for your query. Domains typically have specifically delegated DNS servers that get used whenever you look up their records. However, you can use a tool like `dog` to conduct your lookup using an arbitrary DNS server, which can be useful for testing and troubleshooting:

    dog github.com @8.8.8.8

{{< output >}}
A github.com. 1m00s   192.0.2.0
{{< /output >}}

Both `dig` and `dog` support lookups for the TCP and UDP protocols. `dog` uses UDP by default, but you can easily use TCP by adding the `--tcp` flag to your command.

However, in addition to these two protocols, `dog` adds options for two more: DNS over TLS (DoT) and DNS over HTTPS (DoH). Each of these protocols allows you to make more secure DNS queries.

Here is an example that uses the DoT protocol via a Google DNS server. Using this option can mitigate threats of interference in the request and response:

    dog github.com MX --tls @dns.google

{{< output >}}
MX github.com. 12m40s   1 "aspmx.l.google.com."
MX github.com. 12m40s   5 "alt1.aspmx.l.google.com."
MX github.com. 12m40s   5 "alt2.aspmx.l.google.com."
MX github.com. 12m40s   10 "alt3.aspmx.l.google.com."
MX github.com. 12m40s   10 "alt4.aspmx.l.google.com."
{{< /output >}}

Below is an example using the DoH protocol via a Cloudflare DNS server. This protocol can be used for the same reason as the DoT protocol, but has the added feature that it runs on the popular **443** port. That potentially allows it to blend in with other traffic:

    dog github.com NS --https @https://cloudflare-dns.com/dns-query

{{< output >}}
NS github.com. 6m21s   "dns1.p08.nsone.net."
NS github.com. 6m21s   "dns2.p08.nsone.net."
NS github.com. 6m21s   "dns3.p08.nsone.net."
NS github.com. 6m21s   "dns4.p08.nsone.net."
NS github.com. 6m21s   "ns-1283.awsdns-32.org."
NS github.com. 6m21s   "ns-1707.awsdns-21.co.uk."
NS github.com. 6m21s   "ns-421.awsdns-52.com."
NS github.com. 6m21s   "ns-520.awsdns-01.net."
{{< /output >}}

## Conclusion

To learn more about DNS, including more about record types and the role of DNS in the Internet, take a look at our guide [DNS Records: An Introduction](/docs/guides/dns-records-an-introduction/). From there, you may also want to look at our guide [Troubleshooting DNS Records](/docs/guides/troubleshooting-dns/). It can give you some ideas for how you might use a tool like `dog` to help keep your DNS setup in order.
