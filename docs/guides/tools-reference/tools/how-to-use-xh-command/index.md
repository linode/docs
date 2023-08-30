---
slug: how-to-use-xh-command
authors: ["Nathaniel Stickman"]
description: "Learn how to start using xh to make HTTP requests on your Linux system. Similar to HTTPie, xh gives you a friendlier way to make requests than with curl. But xh also aims to do so with snappy performance."
keywords: ['linux xh command','curl alternative linux','how to use httpie']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-20
modified_by:
  name: Nathaniel Stickman
title: "Use the xh Command for HTTP Requests on Linux"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
---

`xh` is a command-line HTTP client, much like cURL. It follows HTTPie as a modern alternative to cURL. Both HTTPie and `xh` put an emphasis on readability and working with web APIs. But `xh`, being built on Rust, accomplishes this with speed.

In this guide, learn more about how `xh` compares to similar tools, as well as how to install and start using `xh` on your Linux system.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On Debian and Ubuntu, you can do this with:

            sudo apt update && sudo apt upgrade

    - On AlmaLinux, CentOS (8 or later), or Fedora, use:

            sudo dnf upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## What is xh?

`xh` is a command-line HTTP client with human readability and modern web APIs in mind. It implements much of the design of the HTTPie client, but improves on its performance. `xh` is built with Rust, and it takes advantage of the Rust environment to optimize its speed.

### xh vs HTTPie

[HTTPie](https://httpie.io/) is perhaps the most successful alternative to cURL, the ubiquitous command-line HTTP client. HTTPie was created to modernize cURL. Its interface made reading and working with results from modern web APIs more approachable. With HTTPie, testing and debugging web services from the command line became much more appealing. You can learn more about HTTPie in our guide [How to Install and Use HTTPie on Linux](/docs/guides/installing-and-using-httpie-on-linux/).

`xh` recognizes where HTTPie has been successful — its readability and ease — but also found where HTTPie can be improved on. HTTPie does not prioritize performance. `xh` takes much of HTTPie's remarkable design and implements it in Rust. The result is a modern and fast command-line HTTP client. It does not yet have all of the capabilities of HTTPie. Still, `xh` is an effective solution if you want more speed out of your HTTP client.

### xh vs curlie

`curlie` is another HTTP client for the command line following the inspiration of HTTPie. It was built to apply HTTPie's priorities of readability and modernization directly to cURL. In fact, `curlie` is a frontend to the cURL tool. What it provides is a better interface for working with web services and more human-readable output.

Because `curlie` is a frontend to cURL, it keeps cURL's speed and versatility. It is the HTTP client to go for if you truly want a modernized version of cURL and aren't willing to compromise on performance.

Learn more about `curlie` in our guide [How to Install and Use the curlie Command on Linux](/docs/guides/installing-and-using-the-curlie-command-on-linux/).

`xh` and `curlie` are comparable when it comes to performance. So what sets `xh` apart? `xh`, like HTTPie, is an entirely new tool. It fits in the same category as cURL, but was originally built with web APIs in mind. `curlie`, on the other hand, is better thought of as an improvement on cURL.

This makes `xh` the best option if you want an HTTP client made for working with web services. `xh` is also a good choice if you are familiar with HTTPie's commands but want something faster. Choose `curlie` instead if you want a modernized take on cURL that remains closer to the spirit of the original.

## How to Install xh

The shortest method for installing `xh` is through its installation script. You can execute the script with the command:

    curl -sfL https://raw.githubusercontent.com/ducaale/xh/master/install.sh | sh

Alternatively, you can install `xh` as a Cargo package using the following steps.

1. Install `gcc`.

    - On Debian and Ubuntu, you can do so with:

            sudo apt install build-essential

    - On AlmaLinux and CentOS (8 or later), use:

            sudo dnf install gcc

1. Install [Rust](https://www.rust-lang.org/), which includes the Cargo package manager:

        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"

    When prompted, select `1` for the default installation path.

1. Either restart your shell session (exiting and logging back in) or run the following command:

        source $HOME/.cargo/env

1. Install `xh` via the Cargo package manager:

        cargo install xh

Whichever method you use, you can afterward verify your installation with:

    xh --version

{{< output >}}
xh 0.13.0
{{< /output >}}

## How to Use xh

Commands in `xh` are very similar to those in HTTPie. So, if you are familiar with the latter, you should be ready to start with `xh`.

The sections that follow walk you through how to make several different kinds of HTTP requests with `xh`. By the end, you should have everything you need to start using `xh` against web services for your own projects.

The examples that follow use the [Reqres](https://reqres.in/) project, which gives RESTful web API endpoints for testing a variety of HTTP request methods.

### Basic Requests

`xh` can perform the most basic requests — `GET` requests — by providing the command with a URL, as in:

    xh https://reqres.in/api/users

{{< output >}}
HTTP/2.0 200 OK
access-control-allow-origin: *
age: 5611
alt-svc: h3=":443"; ma=86400, h3-29=":443"; ma=86400, h3-28=":443"; ma=86400, h3-27=":443"; ma=86400
cache-control: max-age=14400
cf-cache-status: HIT
cf-ray: 6a0b92be7e921088-ATL
content-type: application/json; charset=utf-8
date: Wed, 20 Oct 2021 12:00:17 GMT
etag: W/"3e4-2RLXvr5wTg9YQ6aH95CkYoFNuO8"
expect-ct: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
nel: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}
report-to: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v3?s=oYeOwtHyQD2atJc3SS1bhZtrHifC0cZn0dkf4DuVY0TvQGPpX9P1cOgMHe4mFc17VHyXngyyhpQjllpaVazrYl2DLUgogZSisKU5SRjfbqOPwlIz66Cy2SY9PPBgSDsfpOMv8S%2FOzQk%3D"}],"group":"cf-nel","max_age":604800}
server: cloudflare
vary: Accept-Encoding
via: 1.1 vegur
x-powered-by: Express

{
    "page": 1,
    "per_page": 6,
    "total": 12,
    "total_pages": 2,
    "data": [
        {
            "id": 1,
            "email": "george.bluth@reqres.in",
            "first_name": "George",
            "last_name": "Bluth",
            "avatar": "https://reqres.in/img/faces/1-image.jpg"
        },
[...]
{{< /output >}}

`xh` also applies syntax highlighting to its output, making items easier to distinguish.

Some URLs redirect you to an endpoint. You can use the `--follow` flag to have `xh` follow redirects before giving you the results. For instance, omitting `https` in a Reqres request URL redirects you to the URL's `https` version:

    xh --follow get reqres.in/api/users

You can add a header to your request by providing a string with the header data after the URL. This example uses another web service, one that gives "dad jokes." This service requires you to provide a header indicating the accepted content type:

    xh --follow icanhazdadjoke.com/ 'Accept: application/json'

{{< output >}}
HTTP/2.0 200 OK
alt-svc: h3=":443"; ma=86400, h3-29=":443"; ma=86400, h3-28=":443"; ma=86400, h3-27=":443"; ma=86400
cache-control: max-age=0, must-revalidate, no-cache, no-store, public, s-maxage=0
cf-cache-status: DYNAMIC
cf-ray: 6a0ccbe30f0e63db-ATL
content-type: application/json
date: Wed, 20 Oct 2021 12:06:04 GMT
expect-ct: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
nel: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}
report-to: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v3?s=IdL%2FpQg4QJ9voscEP3Ua4vmqd%2BADd7u%2Bg5B3EtVr97EUxKVqfXgxt0X2nDvETbB2ERR%2Fm8VdYir2qht%2B5d46yVG5aE%2FVumYw82jZiUOWZSpSQ%2Bb1Op6RuBAq8B7PrlXnshl45nkZLgXCUorIsCmsB60%3D"}],"group":"cf-nel","max_age":604800}
server: cloudflare
strict-transport-security: max-age=15552000; includeSubDomains
x-content-type-options: nosniff
x-frame-options: DENY
x-xss-protection: 1; mode=block

{
    "id": "o4MexXSClb",
    "joke": "What did the judge say to the dentist? Do you swear to pull the tooth, the whole tooth and nothing but the tooth?",
    "status": 200
}
{{< /output >}}

### Request Methods

`xh` lets you specify the request method by putting its designation in front of the request URL. For example, the command below makes a `POST` request to create a new user in Reqres:

    xh post https://reqres.in/api/users name="example-user" job="example-job"

{{< output >}}
HTTP/2.0 201 Created
access-control-allow-origin: *
alt-svc: h3=":443"; ma=86400, h3-29=":443"; ma=86400, h3-28=":443"; ma=86400, h3-27=":443"; ma=86400
cf-cache-status: DYNAMIC
cf-ray: 6a0b9cdd7acd63c6-ATL
content-length: 93
content-type: application/json; charset=utf-8
date: Wed, 20 Oct 2021 12:09:12 GMT
etag: W/"5d-UJmHf4LAg2+IQAd3azbDglBiXR0"
expect-ct: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
nel: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}
report-to: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v3?s=xHcJXnevZCrl1F%2FpSGJ1f02FauuEtCNMDYvqorSKyET4akmWOLMarAQU%2F5C%2BIXoH1hUg1jyCA70s%2Fk8i4b5JY%2BVrtjXuMblBw5uc2fmTvcbEg7wXngunjUjs4TCcdqdSLifHTUueFd8%3D"}],"group":"cf-nel","max_age":604800}
server: cloudflare
via: 1.1 vegur
x-powered-by: Express

{
    "name": "example-user",
    "job": "example-job",
    "id": "955",
    "createdAt": "2021-10-20T12:09:12.089Z"
}
{{< /output >}}

You can see that the command above also provides parameters after the URL. `xh` automatically converts these key-value pairs into a JSON object to submit as the payload for your request.

Here is another example, using the `DELETE` request method:

    xh delete https://reqres.in/api/users/1

{{< output >}}
HTTP/2.0 204 No Content
access-control-allow-origin: *
alt-svc: h3=":443"; ma=86400, h3-29=":443"; ma=86400, h3-28=":443"; ma=86400, h3-27=":443"; ma=86400
cf-cache-status: DYNAMIC
cf-ray: 6a0bbd5059871877-ATL
content-length: 0
date: Wed, 20 Oct 2021 12:11:21 GMT
etag: W/"2-vyGp6PvFo4RvsFtPoIWeCReyIC8"
expect-ct: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
nel: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}
report-to: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v3?s=WY%2Bk%2B0I7leHOdVbfnCjZivZLgdFVwXNmXXKUeLWIq98Z%2Balz2a%2FKOTq%2B5tSlrtZ%2FRHbT1uZFWdpa5x%2Bv893P%2FtuD0eaxp7%2BBAUlBIl4gtaYWqDjDAAKpE3i8VC%2F3hasDkRQW8CI%2BKFI%3D"}],"group":"cf-nel","max_age":604800}
server: cloudflare
via: 1.1 vegur
x-powered-by: Express
{{< /output >}}

### Submitting JSON Data

Like HTTPie, `xh` allows you to submit JSON payloads from files and to save response to files.

To submit JSON from a file, first create a file with JSON content. You can do so with a command like this one:

    echo '{ "name": "another-example-user", "job": "example-job" }' > create-another-user.json

Then, put together an `xh` command like the one below. Using the `<` operator after the URL allows you to then specify the location of the file you want to submit:

    xh post https://reqres.in/api/users < create-another-user.json

{{< output >}}
HTTP/2.0 201 Created
access-control-allow-origin: *
alt-svc: h3=":443"; ma=86400, h3-29=":443"; ma=86400, h3-28=":443"; ma=86400, h3-27=":443"; ma=86400
cf-cache-status: DYNAMIC
cf-ray: 6a0bb66bd8ff1025-ATL
content-length: 101
content-type: application/json; charset=utf-8
date: Wed, 20 Oct 2021 12:16:38 GMT
etag: W/"65-CoFZJWDUr5SJneN0BNkHyZeXaq0"
expect-ct: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
nel: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}
report-to: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v3?s=2f3NTLfFTXzM5pz2gD6uRS0oNxMtghQPtnVMJTusUgdr7E9HUWfV1ZHWMUCXGzESxoc8Et8vYB267ZZrqoG80V7OCSsS5UPWp7Hlt0q%2FHcMyAv7MSkoNilXjqx5aIfREmkPoqI%2BzzKE%3D"}],"group":"cf-nel","max_age":604800}
server: cloudflare
via: 1.1 vegur
x-powered-by: Express

{
    "name": "another-example-user",
    "job": "example-job",
    "id": "313",
    "createdAt": "2021-10-20T12:16:38.886Z"
}
{{< /output >}}

The syntax for saving a response to a file is similar: Use the `>` operator after the URL, and then give a location for the output file:

    xh get https://reqres.in/api/users/9 > user-info.json

{{< file "user-info.json" json >}}
HTTP/2.0 200 OK
access-control-allow-origin: *
alt-svc: h3=":443"; ma=86400, h3-29=":443"; ma=86400, h3-28=":443"; ma=86400, h3-27=":443"; ma=86400
cache-control: max-age=14400
cf-cache-status: MISS
cf-ray: 6a0d2919bfe00fd4-ATL
content-type: application/json; charset=utf-8
date: Wed, 20 Oct 2021 12:19:41 GMT
etag: W/"118-h4/j+GWuEpfnmJgxhE5HWX+/QC8"
expect-ct: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
nel: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}
report-to: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v3?s=k746IDvgREeGP47%2Fs6sjRHs6pjFaUf%2B1zW2U9OQfMKBkH3%2Fq4LHN24SDns11jrJXlhwZzOx2PLEby2eSyIcXadBnwJrGLqedsrbPhE956G7bIXHb5KyTLYg0ZRhmkmm77jSLZC2P4EA%3D"}],"group":"cf-nel","max_age":604800}
server: cloudflare
vary: Accept-Encoding
via: 1.1 vegur
x-powered-by: Express

{
    "data": {
        "id": 9,
        "email": "tobias.funke@reqres.in",
        "first_name": "Tobias",
        "last_name": "Funke",
        "avatar": "https://reqres.in/img/faces/9-image.jpg"
    },
    "support": {
        "url": "https://reqres.in/#support-heading",
        "text": "To keep ReqRes free, contributions towards server costs are appreciated!"
    }
}
{{< /file >}}

## Conclusion

To continue learning about `xh`, take a look at its [GitHub page](https://github.com/ducaale/xh). You may also want to reference the [HTTPie documentation](https://httpie.io/), since `xh` implements most of HTTPie's commands.

- ''

If you want to continue looking at how similar tools compare, you can review the [GitHub page](https://github.com/rs/curlie) for `curlie`.
