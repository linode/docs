---
author:
  name: Linode
  email: docs@linode.com
description: Use wget to download files on the command line
keywords: ["wget", "command line", "linux common commands"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/common-commands/wget/']
modified: 2011-05-17
modified_by:
  name: Linode
published: 2010-10-25
title: Download Resources from the Command Line with wget
---

`wget` is a powerful utility that retrieves files accessible as HTTP or FTP resources and saves them to the local file system. `wget` provides a number of options to allow users to configure how resources are downloaded and saved. It also features a recursive download function which allows you to download a set of linked resources for offline use.

## Using wget

The `wget` command takes one of the following forms:

    wget [OPTIONS] [URL]
    wget [URL] [OPTIONS]

When issued at the command line without options, `wget` will download the file specified by the `[URL]` to the current directory. Consider the following example:

    $ wget http://www.linode.com/docs/assets/695-wget-example.txt
    --2010-10-01 12:01:22--   http://www.linode.com/docs/assets/695-wget-example.txt
    Resolving linode.com/docs... 74.207.233.254
    Connecting to linode.com/docs|74.207.233.254|:80... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 477 [text/plain]
    Saving to: `wget-example.txt'

    100%[================================================>] 477         --.-K/s   in 0.002s

    2010-10-01 12:01:48 (261 KB/s) - `wget-example.txt' saved [477/477]

    $ cat wget-example.txt
    This is an example resource for the `wget` document
    <http://www.linode.com/docs/tools-reference/tools/download-resources-from-the-command-line-with-wget>, located
    in the Linode Docs.

    There are four lines of random characters at the end of this file.

    y7tWn6zZRFAX1cXyQzzSBhTDC+/SpN/RezhI2acW3qr3HGFDCM7PX9frUhna75wG
    6lOvibL5/sHTKP8N7tRfszZq1MaGlmpeEQN1n5afK6Awh0rykc5FMn2xb3jf0klF
    wVPjuxsptT/L05K6avRI81Edg2+8CkS8uA16u+bXqRn1BBQutRvxwrWwrKuP10pR
    uCf3HehndIeRghOAmXPc61cfUrHZ+MEqXYmSoKw4E0hI7GWXkwAyByCFPBVB9Fbe

This document specifies all options for `wget` *before* the URL. However, `wget` accepts these options before *and* after the URL argument. Both forms are functionally equivalent.

## Examples

### Download Content to Standard Output

The `-O` option controls the location and name of the file where `wget` writes the downloaded content. If you specify the file name as `-` as in `wget -O -`, `wget` will output the downloaded resource to the terminal. Add the `-q` option to suppress the "`wget` status output as follows:

    $ wget -q -O - http://www.linode.com/docs/assets/695-wget-example.txt
    This is an example resource for the `wget` document
    <http://www.linode.com/docs/tools-reference/tools/download-resources-from-the-command-line-with-wget>, located
    in the Linode Docs.

    There are four lines of random characters at the end of this file.

    y7tWn6zZRFAX1cXyQzzSBhTDC+/SpN/RezhI2acW3qr3HGFDCM7PX9frUhna75wG
    6lOvibL5/sHTKP8N7tRfszZq1MaGlmpeEQN1n5afK6Awh0rykc5FMn2xb3jf0klF
    wVPjuxsptT/L05K6avRI81Edg2+8CkS8uA16u+bXqRn1BBQutRvxwrWwrKuP10pR
    uCf3HehndIeRghOAmXPc61cfUrHZ+MEqXYmSoKw4E0hI7GWXkwAyByCFPBVB9Fbe

### View the HTTP Headers for a Resource

To view the HTTP header information attached to the resource, use the `-S` flag. Header information is often helpful for diagnosing issues with web sever configuration.

    $ wget -S http://www.linode.com/docs/assets/695-wget-example.txt
    --2010-10-01 12:03:50--   http://www.linode.com/docs/assets/695-wget-example.txt
    Resolving linode.com/docs... 74.207.233.254
    Connecting to linode.com/docs|74.207.233.254|:80... connected.
    HTTP request sent, awaiting response...
      HTTP/1.1 200 OK
      Server: nginx
      Date: Fri, 01 Oct 2010 16:03:51 GMT
      Content-Type: text/plain
      Content-Length: 477
      Last-Modified: Fri, 01 Oct 2010 16:00:34 GMT
      Connection: keep-alive
      Accept-Ranges: bytes
    Length: 477 [text/plain]
    Saving to: `wget-example.txt'

    100%[================================================>] 477         --.-K/s   in 0s

    2010-10-01 12:03:40 (1.73 MB/s) - `wget-example.txt' saved [477/477]

Add the `-q` option to suppress the status output of `wget`:

    $ wget -Sq http://www.linode.com/docs/assets/695-wget-example.txt
      HTTP/1.1 200 OK
      Server: nginx/0.7.65
      Date: Fri, 01 Oct 2010 16:05:34 GMT
      Content-Type: text/plain
      Content-Length: 477
      Last-Modified: Fri, 01 Oct 2010 16:00:34 GMT
      Connection: keep-alive
      Accept-Ranges: bytes

### Supply HTTP AUTH Credentials

If you need to access a resource that requires HTTP authentication, use the following form:

    wget --http-user=[USERNAME] --http-password=[PASSWORD] [URL]

In practice this may resemble:

    wget --http-user=username --http-password=iwLcis4TMOgn3PTy http://example.com/backups/database.1285770344

`wget` will not send the authentication information unless prompted by the web server. Use the `--auth-no-challenge` option to force `wget` to send the authentication credentials under every circumstance.

### Accept Self Signed Certificates

To successfully download a resource that is protected with a self-signed SSL certificate, you must specify the `--no-check-certificate` option.

    wget --no-check-certificate https://infra.example.com/backups/database-1285771361

Information is still encrypted, but the authenticity of the certificate is not confirmed.

### Recursively Download Files

The `-r` option allows `wget` to download a resource, search that content for links to other resources, and then download those resources. This is useful for creating backups of static websites or snapshots of available resources. There are a wide range of additional options to control the behavior of recursive downloads. Consider the following example:

    wget -r -l 3 -k -p -H https://example.com/

The options `-r -l 3 -k -p -H` have the following functionality:

-   `-r` enables recursive downloading.
-   `-l 3` allows `wget` to follow links three levels "deep". Specify `0` for an infinite level of recursion.
-   `-k` converts links in downloaded resources to point to the locally downloaded files. The resulting "mirror" will not be linked to the original source.
-   `-p` forces `wget` to download all linked sources, including scripts and CSS files, required to render the page properly.
-   `-H` allows recursive operations to follow links to other hosts on the network. Unless specified, `wget` will only download resources on the host specified in the original domain.

`wget` will only download resources that are linked to. Resources that are available but not linked to will not be downloaded.

### Download Resources in the Background

Use the `-b` option to background the download process if you do not want `wget` to occupy your terminal process.

    $ wget -b http://www.linode.com/docs/assets/695-wget-example.txt
    Continuing in background, pid 9810.
    Output will be written to `wget-log'.

    $ cat wget-log
    --2010-10-01 12:06:55--  http://www.linode.com/docs/assets/695-wget-example.txt
    Resolving linode.com/docs... 74.207.233.254
    Connecting to linode.com/docs|74.207.233.254|:80... connected.
    HTTP request sent, awaiting response... 200 OK
    Length: 477 [text/plain]
    Saving to: `wget-example.txt'

         0K                                                       100%  686K=0.001s

    2010-10-01 12:06:37 (686 KB/s) - `wget-example.txt' saved [477/477]

### Avoid Redundant Downloads

`wget` includes a number of options designed to conserve bandwidth and redundant operations.

-   `-nc` is the "no clobber" option, which prevents `wget` from downloading a file if it would overwrite an existing file.
-   `-N` prevents `wget` from downloading a file if a newer file of the same name exists on the local machine.
-   `-c` allows `wget` to continue downloading a file that was partially downloaded.

### Rate Limit Download Operations with wget

If you need to control how much bandwidth `wget` uses, you can specify a "rate limit" with the `--limit-rate=[RATE]` option. `[RATE]` is specified in terms of bytes per second unless a `k` is appended to specify kilobytes.

    wget --limit-rate=3k http://example.com/releases/1285786486.tar.gz

This command downloads the `1285786486.tar.gz` file with the operation limited to consume no more than 3 kilobytes a second. The method used to rate limit downloads is more effective for bigger files than for small downloads that complete rapidly.
