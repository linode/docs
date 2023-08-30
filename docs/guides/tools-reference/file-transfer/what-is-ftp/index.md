---
slug: what-is-ftp
description: 'What is FTP? File transfer protocol makes it easy to communicate and transfer files between computers on a TCP/IP network. ✓ Learn more about FTP here!'
keywords: ['what is ftp','file transfer protocol','what is ftp server','ftp file','ftp sites meaning','ftp server means','what is a ftp client','example of ftp','how does ftp work','ftp network']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-03-08
modified_by:
  name: Linode
title: "What Is FTP and How Does It Work?"
title_meta: "Quick Guide to FTP: File Transfer Protocol"
authors: ["David Strom"]
---

File Transfer Protocol (FTP) is one of the utility players of internet protocols, serving a variety of useful functions. It pre-dates the internet by a few years, and continues to play an important role in moving files from one computer to another. The protocol was first published as [RFC 114](https://datatracker.ietf.org/doc/html/rfc114) in April 1971 by MIT graduate student Abhay Bhushan. It was proposed as a way to move files across the early ARPANET. Later that year it was updated by other RFCs, along with numerous extensions and enhancements since. This is a great illustration of the power of the open standards process. FTP’s most recent update is [RFC 5797](https://www.rfc-editor.org/rfc/rfc5797.html). One of these key enhancements was written by internet luminary Jon Postel. This goes to show how the protocol plays an important role in developing other core internet technologies.

FTP has grown up in the past 50 years as computers, protocols, and security standards have created more complexities. This guide explores the basic functions and inner workings of FTP, some common uses, its benefits, its many variations, and improvements.

## FTP Basics and How it Works

FTP’s use is often transparent, and many products use it behind the scenes. In the past, files were downloaded and uploaded as part of a web browsing session. This was an important transitional step between FTP and web protocols. However, having insecure FTP access from within a browser became more of a risk than a benefit. Consequently, Chrome, Firefox, and Mozilla removed [FTP protocols in recent versions](https://www.androidpolice.com/2021/07/14/firefox-90-fully-removes-ftp-support-and-reorganizes-some-settings-apk-download/). Users of those browsers need to install separate FTP clients. Although there is still FTP support at the command line of both Windows and Linux operating systems.

FTP plays a key role in building and maintaining websites. After all, this is the main protocol used to assemble a site from its various files and keep it updated with fresh content. For example, in this context FTP is used to download a file from a web page, stream a video, or listen to an audio track.

Another boost comes from cloud computing. This makes it possible to store vast amounts of data quickly, and thus requires FTP to transport it in and out of the cloud. This extends the function of file transfer beyond just two computers talking to each other. It makes it easier for many users to share file collections. Also aiding and abetting its acceptance is that Linux comes with its own built-in FTP server, making it handy to set one up.

{{< note >}}
[FileZilla](https://filezilla-project.org/) is a popular open source FTP client and server tool, available for both Linux and Windows.
{{< /note >}}

FTP commands have a relatively simple syntax and are composed at either the Linux or Windows command lines. A sample series of commands from Windows looks like this:

```ouptput
C:\Users\dstro>ftp test.rebex.net
Connected to test.rebex.net.
220 Microsoft FTP Service
200 OPTS UTF8 command successful - UTF8 encoding now ON.
User (test.rebex.net:(none)): demo
331 Password required for demo.
Password:
230 User logged in.
ftp>
```

The output shown here first connects to a FTP server via `ftp test.rebex.net`. After username and password entry, it ends with a usable `ftp>` prompt that accepts commands to upload and download files.

FTP can also be used to move code between development and production environments, or to copy code from open source repositories such as GitHub. In these instances, the protocol is typically built into these tools, so the transfers happen silently.

There are two **basic types** of FTP:

-   **Clients** are individual users that connect via the protocol to a server in order to upload and download files.

-   **Servers** use the TCP/IP protocols and internet naming conventions just like any other server. They aggregate files into directories and other typical collections for easier reference. Instead of accessing the server with an `HTTP:` line in the browser, you use an `FTP:` line to indicate that protocol.

There are also two **basic modes** of operation:

-   **Active mode** has two communication channels: one to control the session (over port 21), and one for the data transfer (over port 20).

-   **Passive mode** is more firewall-friendly, as all traffic happens over a mutually agreed-upon port and the FTP client initiates all connections. This is because many firewalls, and also networks that use Network Address Translation, don’t allow incoming traffic from external networks. There were [extensions added in 1998](https://www.rfc-editor.org/rfc/rfc2428.html) to make passive-mode FTP work across IPv6 networks.

There are also two **authentication types**:

-   **Password-Protected** logins are the norm. Logins and passwords are either sent in clear text or encrypted.

-   **Anonymous** supports data transfers without encrypting data or using a username and password, often used for bulk file downloads.

## What is FTP Used For?

FTP has three main purposes:

-   Files can be **backed up** from one computer to another or to a cloud-based service. This provides a redundant location so that files are kept more safely, in case of disaster or a security incident that wipes the original file collection.

-   Files can be **replicated**, to provide a more secure location.

-   FTP is often used to perform an **initial file loading** to a new system, such as a website or database.

## What are Some of the Benefits of FTP?

-   **Capacity:** Other internet protocols typically place limitations on moving and manipulating large files. For example, sending and receiving email attachments. FTP is designed for bulk data transfer, so it is more appropriate when moving these larger files, or for moving groups of files using one command. For businesses that need to move large amounts of data on a regular basis, FTP is an important asset.

-   **Separating the Data and Control Planes:** Long before this became popular in network security, FTP was designed to do this. Remember, HTTP did not have this separation when it was first created. This feature was actually born out of FTP's pre-internet origins, which didn’t allow bi-directional communications. FTP now has additional security enhancements that improve its security while making it more flexible. However, this separation, and the session initiation process, also carries some overhead. Both in terms of network latency and time spent setting things up properly between client and server.

-   **Automation Features:** FTP is easily scriptable and can automate more mundane tasks, such as making regular data backups. Again, this highlights the behind-the-scenes role that it continues to play. For example, transfers can be scheduled to automatically happen every day to synchronize files and folders. This can help organizations be more efficient by creating solid workflows that don’t depend on manual methods.

## FTP Security Enhancements

FTP has several security-related enhancements to protect both the data and control planes. The [original protocols operated without any encryption](https://www.ssh.com/academy/ssh/ftp/server) whatsoever, making FTP connections vulnerable to man-in-the-middle or session interception attacks. In 1999, these drawbacks were recognized and two researchers published [RFC 2577](https://datatracker.ietf.org/doc/html/rfc2577), which describes a variety of attack vectors. These include brute-force attacks (guessing passwords), bounce attacks (sending commands to a target server), packet captures, guessing the next open port to usurp a legitimate connection, combining FTP with remote server execution schemes, various forms of spoofing, and DDoS attacks to block the FTP server’s operations.

To remedy this problem, here are several different security standards and enhancements currently in place to add encryption:

-   **Explicit FTP (FTPeS)**: Adds a TLS/SSL connection that operates over port 21. This is the newest enhancement.

-   **Implicit FTP (FTPS):** Also uses a TLS/SSL connection, but over port 990.

-   **Secure FTP (SFTP):** Uses SSH encryption via port 22 to secure files and also supports passwordless options that run over SSH. This option may be more firewall-friendly in certain circumstances than the above two variations.

-   **FTP over HTTPS:** Provides for higher encryption key lengths as well as working within web browsers, which adds to usability.

Many of the third-party FTP clients and servers (such as FileZilla) support these variations and security enhancements. This [video explains some of the differences](https://www.hypr.com/security-encyclopedia/file-transfer-protocol-ftp) among them.

## Conclusion

The FTP protocol perpetuates internet expansion and growth by providing the basic file transfer underpinnings of the web and other more advanced data processing techniques. It is capable of handling more advanced operating systems as well as supporting the expansion of cloud computing. Understand its limitations and ensure that your FTP resources are properly secured with one of the security extensions.