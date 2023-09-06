---
slug: how-to-use-xh-command
title: "Use the xh Command for HTTP Requests on Linux"
title_meta: "Use the xh Command for HTTP Requests on Linux"
description: 'Learn how to make HTTP requests on your Linux system with xh. Similar HTTPie, xh is more user-friendly than cURL, but boasts snappier performance.'
og_description: 'Learn how to make HTTP requests on your Linux system with xh. Similar HTTPie, xh is more user-friendly than cURL, but boasts snappier performance.'
keywords: ['linux xh command','curl alternative linux','how to use httpie']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Nathaniel Stickman"]
published: 2023-03-07
modified_by:
  name: Linode
---

`xh` is a command-line HTTP client, much like cURL. It follows HTTPie as a modern alternative to cURL. Both HTTPie and `xh` put an emphasis on readability and working with web APIs. However, because `xh` is built with Rust, it accomplishes this with great speed.

In this guide, learn more about how `xh` compares to similar tools, as well as how to install and start using it on your Linux system.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Is xh?

`xh` is a command-line HTTP client with human readability and modern web APIs in mind. It implements much of the design of the HTTPie client, but improves on its performance. `xh` is built with Rust, taking advantage of the Rust environment to optimize its speed.

### xh vs. HTTPie

[HTTPie](https://httpie.io/) is perhaps the most successful alternative to cURL, the ubiquitous command-line HTTP client. HTTPie was created to modernize cURL. Its interface makes reading and working with results from modern web APIs more approachable. With HTTPie, testing and debugging web services from the command line is much more appealing. Learn more about HTTPie in our guide [How to Install and Use HTTPie on Linux](/docs/guides/installing-and-using-httpie-on-linux/).

`xh` recognizes where HTTPie is successful, namely its readability and ease, but also found where HTTPie can be improved on. HTTPie does not prioritize performance. `xh` takes much of HTTPie's remarkable design and implements it in Rust. The result is a modern and fast command-line HTTP client. While it does not yet have all of HTTPie's capabilities, `xh` is an effective solution if you want more speed from your HTTP client.

### xh vs. curlie

`curlie` is another HTTP client for the command line inspired by HTTPie. It was built to apply HTTPie's priorities of readability and modernization directly to cURL. In fact, `curlie` is a frontend to the cURL tool. It provides is a better interface for working with web services and more human-readable output.

Because `curlie` is a frontend to cURL, it keeps cURL's speed and versatility. It is the HTTP client to choose if you truly want a modernized version of cURL and aren't willing to compromise on performance.

Learn more about `curlie` in our guide [How to Install and Use the curlie Command on Linux](/docs/guides/installing-and-using-the-curlie-command-on-linux/).

`xh` and `curlie` are comparable when it comes to performance. What sets `xh` apart is that, like HTTPie, it is an entirely new tool. It fits in the same category as cURL, but was originally built with web APIs in mind. `curlie`, on the other hand, is better thought of as an improvement on cURL.

This makes `xh` the best option if you want an HTTP client made for working with web services. `xh` is also a good choice if you are familiar with HTTPie's commands but want something faster. Alternatively, choose `curlie` if you want a modernized take on cURL that remains closer to the spirit of the original.

## How to Install xh

The shortest method for installing `xh` is through its installation script. You can execute the script with the command:

```command
curl -sfL https://raw.githubusercontent.com/ducaale/xh/master/install.sh | sh
```

{{< note >}}
On AlmaLinux, CentOS Stream, Fedora, and Rocky Linux instances, you must create the `~/.local/bin` directory prior to launching the installation script:

```command
mkdir -p ~/.local/bin
```

Additionally, AlmaLinux, CentOS Stream, and Rocky Linux instances also require the installation of `tar`:

```command
sudo dnf install tar
```
{{< /note >}}

Alternatively, you can install `xh` as a Cargo package using the following steps.

1.  Install `gcc`.

    {{< tabs >}}
    {{< tab "Debian and Ubuntu" >}}
    ```command
    sudo apt install build-essential
    ```
    {{< /tab >}}
    {{< tab "AlmaLinux, CentOS Stream, and Rocky Linux" >}}
    ```command
    sudo dnf install gcc
    ```
    {{< /tab >}}
    {{< /tabs >}}

1.  Install [Rust](https://www.rust-lang.org/), which includes the Cargo package manager:

    ```command
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```

    When prompted, select `1` for the default installation path.

1.  Either restart your shell session by exiting and logging back in, or run the following command:

    ```command
    source $HOME/.cargo/env
    ```

1.  Install `xh` via the Cargo package manager:

    ```command
    cargo install xh
    ```

Whichever method you use, you can afterward verify your installation with:

```command
xh --version
```

```output
xh 0.18.0
-native-tls +rustls
```

## How to Use xh

Commands in `xh` are very similar to those in HTTPie. So, if you are familiar with HTTPie, you should be ready to start with `xh`.

The sections that follow walk through how to make several different kinds of HTTP requests with `xh`. By the end, you should have everything you need to start using `xh` against web services for your own projects.

The examples that follow use the [Reqres](https://reqres.in/) project, which gives RESTful web API endpoints for testing a variety of HTTP request methods.

### Basic Requests

`xh` can perform the most basic requests (`GET` requests) by providing the command with a URL, like so:

```command
xh 0.18.0
-native-tls +rustls
```

```output
HTTP/2.0 200 OK
access-control-allow-origin: *
age: 7
cache-control: max-age=14400
cf-cache-status: HIT
cf-ray: 8021cfa109bd1363-ATL
content-encoding: br
content-type: application/json; charset=utf-8
date: Tue, 05 Sep 2023 22:11:58 GMT
etag: W/"3e4-2RLXvr5wTg9YQ6aH95CkYoFNuO8"
nel: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}
report-to: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v3?s=%2FyU6EirFTXUMw8xb%2FTquMlu0S7HEjcngrwpZBP1di5226p5c9FgJEVoOnAazDP8UkVImFKhm85UW%2Bgn1SaGRlZYfquDC2JL6UL%2BQ6%2Bz7sA5XOl3695t5RwQDknCQlwsl%2F3YqnWYGJQ%3D%3D"}],"group":"cf-nel","max_age":604800}
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
        {
            "id": 2,
            "email": "janet.weaver@reqres.in",
            "first_name": "Janet",
            "last_name": "Weaver",
            "avatar": "https://reqres.in/img/faces/2-image.jpg"
        },
        {
            "id": 3,
            "email": "emma.wong@reqres.in",
            "first_name": "Emma",
            "last_name": "Wong",
            "avatar": "https://reqres.in/img/faces/3-image.jpg"
        },
        {
            "id": 4,
            "email": "eve.holt@reqres.in",
            "first_name": "Eve",
            "last_name": "Holt",
            "avatar": "https://reqres.in/img/faces/4-image.jpg"
        },
        {
            "id": 5,
            "email": "charles.morris@reqres.in",
            "first_name": "Charles",
            "last_name": "Morris",
            "avatar": "https://reqres.in/img/faces/5-image.jpg"
        },
        {
            "id": 6,
            "email": "tracey.ramos@reqres.in",
            "first_name": "Tracey",
            "last_name": "Ramos",
            "avatar": "https://reqres.in/img/faces/6-image.jpg"
        }
    ],
    "support": {
        "url": "https://reqres.in/#support-heading",
        "text": "To keep ReqRes free, contributions towards server costs are appreciated!"
    }
}
```

`xh` also applies syntax highlighting to its output, making items easier to distinguish.

Some URLs redirect you to an endpoint. You can use the `--follow` flag to have `xh` follow redirects before giving you the results. For instance, omitting `https` in a Reqres request URL redirects you to the URL's `https` version:

```command
xh --follow get reqres.in/api/users
```

You can add a header to your request by providing a string with the header data after the URL. This example uses another web service, one that gives "dad jokes". This service requires you to provide a header indicating the accepted content type:

```command
xh --follow icanhazdadjoke.com/ 'Accept: application/json'
```

```output
HTTP/2.0 200 OK
access-control-allow-headers: User-Agent, Content-Type
access-control-allow-methods: GET
access-control-allow-origin: *
access-control-max-age: 86400
access-control-request-method: GET
alt-svc: h3=":443"; ma=86400
cache-control: max-age=0, must-revalidate, no-cache, no-store, public, s-maxage=0
cf-cache-status: DYNAMIC
cf-ray: 8021db391aac07ce-ATL
content-encoding: br
content-type: application/json
date: Tue, 05 Sep 2023 22:19:53 GMT
nel: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}
report-to: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v3?s=VyVj4dh8HlTlQIAZbZXf6DjpG31dtUVPzIQYl6mtQ44OVt70yS3MNC7AoaDOtf2Q7dDpPLo6doWFnx1NFoWYnNpQO%2F3m%2BDCH9aAT0qhVRUZEWMkpPTe2Tj8g8z9%2FYqtzytfu9hnBj0fdLMi%2FuZ9zWxM%3D"}],"group":"cf-nel","max_age":604800}
retry-after: 60
server: cloudflare
strict-transport-security: max-age=15552000; includeSubDomains
x-content-type-options: nosniff
x-frame-options: DENY
x-ratelimit-limit: 100
x-ratelimit-remaining: 99
x-ratelimit-reset: 1693952454
x-xss-protection: 1; mode=block

{
    "id": "KJJtPuPKJe",
    "joke": "What did the scarf say to the hat? You go on ahead, I am going to hang around a bit longer.",
    "status": 200
}
```

### Request Methods

`xh` lets you specify the request method by putting its designation in front of the request URL. For example, the command below makes a `POST` request to create a new user in Reqres:

```command
xh post https://reqres.in/api/users name="example-user" job="example-job"
```

```output
HTTP/2.0 201 Created
access-control-allow-origin: *
cf-cache-status: DYNAMIC
cf-ray: 8021dc4e5ff50725-ATL
content-length: 93
content-type: application/json; charset=utf-8
date: Tue, 05 Sep 2023 22:20:37 GMT
etag: W/"5d-7rtjeA7fl4sXwJ22cfm1vehRA+s"
nel: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}
report-to: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v3?s=7tyC4uqc4mRXNiFe8KMg%2FP9zCAiSnAusjVvZ72mXZ3BNIvEQ19aAAP0xzCXeOSYDJ%2FVJ4tW2k%2BrkK3ECTk1WEwL6r2znDAoO%2Fn9O9FIrNWq1emVw9YOXnlSn4jVfIGrDZ6gYE8D97w%3D%3D"}],"group":"cf-nel","max_age":604800}
server: cloudflare
via: 1.1 vegur
x-powered-by: Express

{
    "name": "example-user",
    "job": "example-job",
    "id": "243",
    "createdAt": "2023-09-05T22:20:37.667Z"
}
```

The command above also provides parameters after the URL. `xh` automatically converts these key-value pairs into a JSON object to submit as the payload for your request.

Here is another example, using the `DELETE` request method:

```command
xh delete https://reqres.in/api/users/1
```

```output
HTTP/2.0 204 No Content
access-control-allow-origin: *
cf-cache-status: DYNAMIC
cf-ray: 8021de5a0af5452f-ATL
content-length: 0
date: Tue, 05 Sep 2023 22:22:01 GMT
etag: W/"2-vyGp6PvFo4RvsFtPoIWeCReyIC8"
nel: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}
report-to: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v3?s=D6sW1JRpvmHHxT4pr4EfQhZf%2FfiFmqhLUIvHTvu32xtqPcV4MkQeJ1fveFHd535I%2BUCiQJua97ZciivQnJBs5PckRIuWsyMMpbNIkiQ7Kw6SzS1pp5p4zn%2Fgq%2BX5j6i0nCCvHkf94A%3D%3D"}],"group":"cf-nel","max_age":604800}
server: cloudflare
via: 1.1 vegur
x-powered-by: Express
```

### Submitting JSON Data

Like HTTPie, `xh` allows you to submit JSON payloads from files and to save responses to files.

To submit JSON from a file, first create a file with JSON content. You can do so with a command like this one:

```command
echo '{ "name": "another-example-user", "job": "example-job" }' > create-another-user.json
```

Then, put together an `xh` command like the one below. Using the `<` operator after the URL allows you to specify the name and location of the file you want to submit:

```command
xh post https://reqres.in/api/users < create-another-user.json
```

```output
HTTP/2.0 201 Created
access-control-allow-origin: *
cf-cache-status: DYNAMIC
cf-ray: 8021e0f7c8f906f6-ATL
content-length: 101
content-type: application/json; charset=utf-8
date: Tue, 05 Sep 2023 22:23:48 GMT
etag: W/"65-UZS60J4K9Gn3WnWA6H6WBTaKwIk"
nel: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}
report-to: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v3?s=w8f9WaP%2FgGIkRyVIOhgdeUAldAGGDJXHaK5bGR%2BnN3YjECWtPrWvj%2FF8rfy%2Bre3B8q9Ov7%2BV5pg%2FWAplxm2ltLT7mf8Nyx4bc5W9MfAu%2Ftp4gDMnkAqTiMyxKvYKGA5xyZj7pN%2FjNQ%3D%3D"}],"group":"cf-nel","max_age":604800}
server: cloudflare
via: 1.1 vegur
x-powered-by: Express

{
    "name": "another-example-user",
    "job": "example-job",
    "id": "288",
    "createdAt": "2023-09-05T22:23:48.634Z"
}
```

The syntax for saving a response to a file is similar. Use the `>` operator after the URL and provide a name and location for the output file:

```command
xh get https://reqres.in/api/users/9 > user-info.json
```

```file {title="user-info.json" lang="json"}
{"data":{"id":9,"email":"tobias.funke@reqres.in","first_name":"Tobias","last_name":"Funke","avatar":"https://reqres.in/img/faces/9-image.jpg"},"support":{"url":"https://reqres.in/#support-heading","text":"To keep ReqRes free, contributions towards server costs are appreciated!"}}
```

## Conclusion

To continue learning about `xh`, take a look at its [GitHub page](https://github.com/ducaale/xh). You may also want to reference the [HTTPie documentation](https://httpie.io/), since `xh` implements most of HTTPie's commands.

If you want to continue looking at how similar tools compare, review the [GitHub page](https://github.com/rs/curlie) for `curlie`.