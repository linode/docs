---
slug: install-dotnet-on-ubuntu
title: "Install the .NET Runtime (or SDK) on Ubuntu 22.04"
title_meta: "How to Install the .NET Runtime (or SDK) on Ubuntu 22.04"
description: 'Learn how to install the .NET 6 SDK or runtime on Ubuntu and understand its limitations, requirements, and security implications.'
keywords: ['dotnet on Ubuntu 22.04', 'dotnet runtime', 'install dotnet', 'enable dotnet ubuntu 22.04', 'install dotnet server ubuntu']
tags: ['ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Linode"]
published: 2023-06-13
modified_by:
  name: Linode
---

Microsoft [.NET](https://dotnet.microsoft.com/en-us/) (pronounced *dot net* and sometimes written as *dotnet*) is a free and open-source platform for building, distributing, and running software applications. Developers can write code for their applications in multiple languages (including C# and Visual Basic) and target any operating system that supports .NET (including Windows, Linux, and macOS). Using the .NET platform (and it's many available libraries and app models), developers can create command-line apps, web applications (with [ASP.NET](https://dotnet.microsoft.com/en-us/apps/aspnet)), cross-platform mobile and desktop applications (with [.NET MAUI](https://dotnet.microsoft.com/en-us/apps/maui)), and much more.

.NET applications can be distributed as either *self-contained* or *framework-dependent* executables. Self-contained applications already include the necessary .NET runtime files and libraries needed to run the application. When running a *framework-dependent* application, you first need to install the .NET runtime and any required .NET libraries as these are not included. This guide covers how to install the .NET runtime (or SDK) so that you can run framework-dependent .NET applications on Ubuntu 22.04, provided these apps target the Linux operating system.

## Platform Compatibility

Applications built using .NET can support a wide range of both desktop and mobile operating systems, including Windows, Linux, macOS, iOS, and Android. This wasn't always the case, which is why some resources online might describe .NET as Windows-only. Originally, .NET existed as the .NET Framework. This was a proprietary software development platform built by Microsoft to support the development of Windows applications. The last version of the .NET Framework (version 4.8) was released in 2019.

In 2016, Microsoft released .NET Core (what is now simply called .NET) as a completely new implementation of the platform. It was developed specifically for cross-platform support and was released as a free and open-source software development platform. It has now replaced the .NET Framework and, starting with the release of .NET "Core" version 5, the word "core" was dropped from the name.

## The .NET SDK vs the .NET runtime

When running a framework-dependent .NET application on Linux, you need to first install .NET. On most distributions, there are typically several packages available, including those for the .NET SDK and the .NET runtime. The SDK (short for software development kit) contains tools needed to develop *and* run applications. The runtime just contains the files needed to run .NET applications. If you do not intend to develop .NET applications on your system, you can save space by installing the runtime instead of the SDK.

## Installation

Microsoft's .NET runtime does not come pre-installed on most Linux distributions, including Ubuntu 22.04 LTS. Unless you have already installed Visual Studio or another application that's dependent on the same .NET runtime version, you'll need to install the runtime before using your .NET app.

The .NET runtime can be installed directly from Ubuntu's package repositories (starting with Ubuntu 22.04), from Microsoft's own repository, or by using the Snap package manager.

### Determine if .NET is Already Installed

To avoid conflicting or duplicate .NET installations, you should check if any .NET runtimes are already installed on your system. To do this, run the command below:

```command
dotnet --list-runtimes
```

If .NET is not installed, you will likely receive a command not found message. If .NET is installed, your output should list each runtime that is installed.

```output
Microsoft.AspNetCore.App 7.0.5 [/usr/lib/dotnet/shared/Microsoft.AspNetCore.App]
Microsoft.NETCore.App 7.0.5 [/usr/lib/dotnet/shared/Microsoft.NETCore.App]
```

For a more comprehensive view of .NET on your system, use the `dotnet --info` command.

### Install .NET Using APT

Starting with Ubuntu 22.04 LTS, .NET is available from Ubuntu's own package repositories and can quickly be installed using the APT package manager. For more details on this installation procedure, review Microsoft's [Install .NET SDK or .NET Runtime on Ubuntu 22.04](https://learn.microsoft.com/en-us/dotnet/core/install/linux-ubuntu-2204) guide.

{{< note >}}
Not all .NET versions are included in Ubuntu's repository. If your application requires a specific .NET version (including nightly versions), you should use Microsoft's own repository instead. For instructions on doing this, review the official [Register the Microsoft package repository](https://learn.microsoft.com/en-us/dotnet/core/install/linux-ubuntu#register-the-microsoft-package-repository) guide. Using mixed repositories can potentially lead to conflicts, update issues, and asset version conflicts between the repositories. Microsoft provides [detailed information on the current ramifications](https://github.com/dotnet/core/issues/7699) and suggests solutions on resolving repository problems.

{{< /note >}}

The following .NET packages are available when using the default package repositories on Ubuntu 22.04:

- [dotnet7](https://packages.ubuntu.com/jammy-updates/dotnet7): The main .NET 7.0 package, which includes CLI tools, the SDK, and the runtime.
- [dotnet6](https://packages.ubuntu.com/jammy-updates/dotnet6): The main .NET 6.0 package, which includes CLI tools, the SDK, and the runtime.

You can also install specific components of either version using the packages below:

- [dotnet-sdk-7.0](https://packages.ubuntu.com/jammy-updates/dotnet-sdk-6.0): The .NET 7.0 SDK. This includes both the .NET runtime and ASP.NET runtime, among other tools and packages.
- [dotnet-runtime-7.0](https://packages.ubuntu.com/jammy-updates/dotnet-runtime-6.0): The .NET 7.0 runtime.
- [aspnetcore-runtime-7.0](https://packages.ubuntu.com/jammy-updates/aspnetcore-runtime-6.0): The ASP.NET 7.0 runtime, which also installs the .NET 7.0 runtime.
- [dotnet-sdk-6.0](https://packages.ubuntu.com/jammy-updates/dotnet-sdk-6.0): The .NET 6.0 SDK. This includes both the .NET runtime and ASP.NET runtime, among other tools and packages.
- [dotnet-runtime-6.0](https://packages.ubuntu.com/jammy-updates/dotnet-runtime-6.0): The .NET 6.0 runtime.
- [aspnet-runtime-6.0](https://packages.ubuntu.com/jammy-updates/aspnetcore-runtime-6.0): The ASP.NET 6.0 runtime, which also installs the .NET 6.0 runtime.

You can choose to install either the main package, the SDK, the .NET runtime, or the ASP.NET runtime (for ASP.NET web applications). If you only intend to run an existing .NET application and wish to conserve disk space (or avoid installing unnecessary software), we recommend just installing the runtime package corresponding with whichever .NET version you want to use.

To install .NET using APT, open a terminal and run the following command to update local sources and install the desired package:

```command
sudo apt update && sudo apt install [package]
```

Replace *[package]* with the name of the .NET package you want to install (such as `dotnet7` or `dotnet6`).

### Install .NET Using Snap

*Snap* is a package manager that is pre-installed all newer Ubuntu systems, including Ubuntu 22.04 LTS. Snap packages are installed as an instance for the user invoking snap and these instances are not shared with other users by default. Ubuntu’s snap packages use the `squashfs` file system, which enables the package contents to be placed into the current user's directory. The snap package installation process is automatic, and updates are handled seamlessly.

It's worth noting that while snap is the default packaging method for Ubuntu, Microsoft's Visual Studio IDE for Linux does not currently have a snap package available. Therefore, if you are using Microsoft's Visual Studio, you need to install the .NET SDK separately.

{{< note title="Check for incorrectly installed or shared snap packages." isCollapsible=true type="secondary" >}}
To check for the presence of a shared instance of .NET (SDK or runtime) that is incorrectly installed for sharing, you can follow these steps:

1.  Execute the following command to test for the shared instance:

    ```command
    sudo ls /home/user/share/dotnet
    ```

    This command checks if the directory where .NET shared code is typically stored exists. The `/home/user/share/dotnet` directory is commonly used for storing the shared code. Replace `user` with the actual username of the user account you are using.

1.  If the shared instance is found, it needs to be removed or isolated from the desired user. This can be achieved by either:

    - Removing the shared instance by identifying the directories or files associated with the shared .NET code. This could include the `/home/user/share/dotnet` directory mentioned earlier, as well as any other directories or files related to the shared instance. Use appropriate commands such as `rm` (remove) or `sudo rm` (remove with root privileges) to delete the identified directories or files.

    - Installing a snap-only instance to separate it from the desired user. The specific command may vary depending on the name of the dotnet snap package. For example, if the package is named `dotnet-sdk`, you can use the following command:

        ```command
        sudo snap install dotnet-sdk
        ```
{{< /note >}}

To install .NET using Snap, follow the steps below:

-   **.NET SDK:** Install the full .NET SDK package by running the following command:

    ```command
    sudo snap install dotnet-sdk --classic --channel=6.0
    ```

    This command installs the .NET 6.0 SDK. If you wish to install .NET 7.0 SDK, use `--channel=7.0`.

-   **.NET runtime:** To install the .NET runtime, run the following command:

    ```command
    sudo snap install dotnet-runtime-60
    ```

    This installs the .NET 6.0 runtime. Other versions are also available, such as for .NET 7.0 (`dotnet-runtime-70`) and 3.1 (`dotnet-runtime-31`).

For a full list of the available snap packages, run the command below:

```command
snap find dotnet
```

This queries the snap repository and displays a list of available .NET SDK and runtime versions. Note that versions marked as "preview" or "RC" (release candidate) are not considered stable.

## Server Applications

While many .NET applications are standalone, others connect directly to external systems. If your application connects to other services, you may need to adjust your firewall settings so these connections are not blocked. For instructions on using UFW (the default firewall front-end interface for Ubuntu 22.04), see the guide [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/). Web services typically use ports `443`, `80`, and `8080`, though ports are application-specific. If these ports are blocked, you can adjust the firewall to allow access.

Scripts installing .NET applications may require sudo rights to effectively change the firewall, files, or environmental settings for the user(s) of the runtime application. In addition, you may need to modify user rights and file accessibility so that your .NET-based application can properly run.

## Limitations of .NET in Ubuntu 22.04

The .NET components in the Ubuntu Repositories (apt and snap) support certain versions of .NET, but not all versions. If an application relies on a specific version that is not available, you may need to perform an alternative installation method. Consult the application's documentation (or contact its developer) to learn what operating systems are supported and what specific version dependencies are needed to run the application.

## Security Implications

Since Ubuntu 22.04 includes support for .NET 6.0 and .NET 7.0, many security risks present in older versions of .NET do not apply. However, older versions of .NET (like version 3.1 and 5.0) can be installed using Snap or other methods. When older versions of .NET are used, consider any security implications before running the software. While stand-alone code that does not access data from external sources is unlikely to present a security risk, applications that do connect to external services should be scrutinized. Starting with .NET version 6.0, applications benefit from the enhanced security provided by OpenSSL version 3. Previous versions rely on the now-deprecated encryption methods of OpenSSL version 1, which are known to have security vulnerabilities.

## Conclusion

Now that Ubuntu (Canonical) and Microsoft offer .NET packages through Ubuntu's default repositories, installing .NET runtimes (or SDKs) is much easier on Ubuntu 22.04 (and later versions). Whether you're installing .NET from APT, Snap, or another method, you can now install and run .NET applications quickly, and cleanly, and with the security that comes with consistent package updates. While many older versions of the .NET runtime versions are not supported through APT, the more secure .NET 6.0 and 7.0 versions can be installed on any Ubuntu system.