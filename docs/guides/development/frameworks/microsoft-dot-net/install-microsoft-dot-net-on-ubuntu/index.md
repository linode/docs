---
slug: install-microsoft-dot-net-on-ubuntu
title: "How to Install and Use .NET on Ubuntu 22.04"
title_meta: "Installing Microsoft .NET on Ubuntu 22.04 LTS"
description: 'Want to learn how to enable .NET on Ubuntu? Read our guide to learn what .NET is and how you can install Dot-Net on Ubuntu 22.04.'
keywords: ['dotnet on Ubuntu 22.04', 'dotnet runtime', 'install dotnet', 'enable dotnet ubuntu 22.04', 'install dotnet server ubuntu']
tags: ['ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Tom Henderson"]
published: 2023-06-13
modified_by:
  name: Linode
---

Microsoft .NET, also known as Dot-Net or dotnet, is a platform for distributing and running applications. It provides both the dotnet SDK, which includes the runtime files, and the dotnet runtime files alone, along with application files. The runtime .NET application distribution may also use Microsoft’s ASPcore runtime, and although distributed as a separate package on other platforms, ASPcore is included with the Linux runtime packages.

Applications are typically distributed as a package that includes the necessary runtime components. The runtime files consist of the minimum set of files required to run an application and are usually distributed as part of the application code. Additional libraries or other dependencies required must also be included in the application distribution. Scripts may also be included that alter the environment to ensure proper application execution.

The .NET platform supports the execution of code written in multiple programming languages. It can be used as a stand-alone application, a linked application in the client-server or peer models, or connected to Microsoft’s ASPcore or other ASP web/HTML services.

In Linux environments, this framework is commonly referred to as dotnet, Dot-Net, or dot-net. The dotnet environment has been ported to various versions of Windows operating systems, macOS, and multiple Linux distributions.

The instructions in this guide specifically apply to Ubuntu Linux 22.04 on Intel/AMD processors as found on Akamai Cloud. Other ports of dotnet exist on other processor families and operating system versions and are not covered in these instructions.


## Asset Assessment And Installation

When deploying a Linode Ubuntu 22.04 LTS instance, Microsoft's .NET and other Microsoft executables are not pre-installed. The instance is considered a "clean" installation for subsequent Microsoft software. There are several methods to install the dotnet SDK on a clean instance. If Microsoft's Visual Studio development environment is already installed on the instance, the dotnet SDK is automatically included and does not require re-installation for the instance and user.

There are two sources for software distribution used (unless otherwise administratively defined): Ubuntu repositories and Microsoft's repositories. By default, and without any user/administrative intervention, the Ubuntu 22.04 "jammy" repositories are used to download and install Microsoft .NET software. Subsequent updates to Ubuntu-distributed .NET components are upgraded via Ubuntu repositories and use Ubuntu apt(titude) package manager. However, if you prefer to receive updates from Microsoft repositories instead of Ubuntu's repositories, you need to add Microsoft's software repository.

The default installations under Ubuntu’s snap or apt packaging services only use stable sources. If nightly builds or other unstable or zero-day updates are needed, Microsoft’s repository can be added as a source for the non-stable versions Microsoft supports for the dotnet SDK or runtime components.

### Install dotnet With Apt

You can install dotnet from apt sources on Akamai Cloud Ubuntu 22.04 images. By default, apt controls the subsequent updates and timing of updates unless the Microsoft repository is added. There are four dotnet packages available via apt for Microsoft's dotnet:

- `dotnet6` - the dotnet SDK
- `dotnet-sdk-6.0` - long name for `dotnet6`, same package
- `aspnet-runtime-6.0` - ASP.NET core version 6.0
- `dotnet-runtime-6.0` - dotnet runtime version 6.0

The `dotnet6` and `dotnet-sdk-6.0` packages are the same, and are a superset of dotnet components, the dotnet SDK. The `aspnet-runtime-6.0` and `dotnet-runtime-6.0` packages are distributable packages that can be subsequently bundled with code/applications and additional libraries and docs.

To install on Ubuntu 22.04 using apt, follow the steps below:

1. Open a terminal and run the following command to update local sources and install the desired package:

    ```command
    apt update && apt install <package_name>
    ```

    Replace `<package_name>` with the name of the dotnet package you want to install (`dotnet6`, `dotnet-sdk-6.0`, `aspnet-runtime-6.0`, or `dotnet-runtime-6.0`).

1. After installation, export the landing directory for the chosen dotnet binary by running the following command:

    ```command
    export DOTNET_ROOT=$(/usr/bin/)/.dotnet
    ```

    This sets the `DOTNET_ROOT` environment variable to the directory `/usr/bin/.dotnet`.

The apt packages provided are for dotnet version 6.0. If you need to install other packages or versions, you may need to use snap repositories or refer to [Microsoft’s repositories](https://github.com/dotnet) for further instructions.


### Installation Considerations As A Snap Package

*Snap* is a package manager that is pre-installed on all Ubuntu 22.04 LTS instances, including those deployed in a Akamai Cloud. Snap packages are installed as an instance for the user invoking snap, and such an instance is not shared with other users of the host unless administratively shared. A "clean" deployment of a Akamai Cloud Ubuntu 22.04 LTS instance doesn't need to be checked for an existing installation, avoids collision and revision synchronization problems, and the instance can have either the `dotnet-sdk` or just the dotnet runtime installed via a snap package installation.

Ubuntu’s snap packages use the `squashfs` file system, which enables the package contents to be placed into the current user's directory. The snap package installation process is automatic, and updates are handled seamlessly.

It's worth noting that while snap is the default packaging method for Ubuntu, Microsoft's Visual Studio IDE for Linux does not currently have a snap package available. Therefore, if you are using Microsoft's Visual Studio, you need to install the dotnet SDK separately.

If you are working with an unknown or unclean Compute Instance and need to assess the existence of dotnet, you can open a bash shell (<kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>T</kbd>) and use the `dotnet` command to check if dotnet is already installed for the current user.

If dotnet is already installed, you should see the following output:

```output
Usage: dotnet [options]
Usage: dotnet [path-to-application]

Options:
  -h|--help         Display help.
  --info            Display .NET information.
  --list-sdks       Display the installed SDKs.
  --list-runtimes   Display the installed runtimes.

path-to-application:
  The path to an application .dll file to execute.
```

The output indicates that dotnet is available and provides usage options for the `dotnet` command. One more additional check is required to ensure that a host does not have existing dotnet dependencies that may thwart a fresh installation (if the host is not known to be clean; fresh Ubuntu 22.04 LTS Linodes are known to be clean; dotnet is not installed).

If dotnet is not installed, you will see an error message indicating that the command is not found or recognized.

This method checks the existence of dotnet for the current user. Inter-version dependencies and library collisions can occur in unclean or unknown instances, so it's important to ensure a clean and known installation for accurate assessment.

To check for the presence of a shared instance of dotnet (SDK or runtime) that is incorrectly installed for sharing, you can follow these steps:

1. Execute the following command to test for the shared instance:

    ```command
    sudo ls /home/user/share/dotnet
    ```

    This command checks if the directory where dotnet shared code is typically stored exists. The `/home/user/share/dotnet` directory is commonly used for storing the shared code. Replace `user` with the actual username of the user account you are using.

1. If the shared instance is found, it needs to be removed or isolated from the desired user. This can be achieved by either:

    - Removing the shared instance by identifying the directories or files associated with the shared dotnet code. This could include the `/home/user/share/dotnet` directory mentioned earlier, as well as any other directories or files related to the shared instance. Use appropriate commands such as `rm` (remove) or `sudo rm` (remove with root privileges) to delete the identified directories or files.

    - Installing a snap-only instance to separate it from the desired user. The specific command may vary depending on the name of the dotnet snap package. For example, if the package is named `dotnet-sdk`, you can use the following command:

        ```command
        sudo snap install dotnet-sdk
        ```

### Install dotnet From Snap Repositories

To install dotnet software using snap repositories, you can use the command-line interface. Follow the steps below:

1. Install the dotnet-sdk snap package by running the following command:

    ```command
    snap install dotnet-sdk --classic
    ```

    This command installs the dotnet-sdk package, which includes the dotnet SDK.

1. To install dotnet runtime packages, you can use a similar approach. To find the available versions of dotnet SDK and/or runtime as snap packages, execute the following command:

    ```command
    snap find dotnet | more
    ```

This command queries the snap repository and displays a list of available dotnet SDK and runtime versions. Note that versions marked as "RC" (release candidate) are not considered stable for production use. It is recommended to choose the `dotnet-runtime-60` package or higher versions that are not release candidates for production use.


### Install from Microsoft And/Or Ubuntu Repositories (Mixed Repositories)

You have the option to install the dotnet SDK and runtime packages from either the Microsoft repository or the Ubuntu repository. Using mixed repositories can potentially lead to conflicts, update issues, and asset version conflicts between the repositories. Microsoft provides [detailed information on the current ramifications](https://github.com/dotnet/core/issues/7699) and suggests solutions until a more permanent fix is found. You can refer to their documentation on [GitHub](https://github.com/dotnet/core/issues/7699) for more information on resolving repository mixture problems.


### Installation Alternatives

The dotnet installations surround the dotnet SDK and applications using the runtime components. The runtime components are the dotnet runtime, and the ASPcore runtime, along with applications developed and/or distributed with a runtime. Version 6.0+ of these components is preferred if the application uses the connection to outside network resources, as Version 6.0+ supports OpenSSL V3 encryption. Prior versions of dotnet support deprecated versions of OpenSSL; prior versions of OpenSSL have security vulnerabilities that are unwanted in production code.

Microsoft provides a Github-based `docker pull` of specific components that include extra components designed for flexible Docker installations needing more than the runtime, but less than the full SDK. The docker-pull script/dockerfile is located in an [Ubuntu 22.04-specific Microsoft Docker Repository](https://mcr.microsoft.com/en-us/product/dotnet/nightly/runtime-deps/tags).

The installation methods available in the Ubuntu 22.04 GUI are the same as those in the Ubuntu 22.04 server editions. You can choose to install dotnet using the snap packaging system, install from a source tarball, or opt for a Docker download via GitHub. You can choose either the run-time or the full SDK.


## Server Applications

You can develop standalone applications with dotnet, or actively pull and/or push data from other hosts/network locations, and store data locally. Application network data transportation must be made available through the Ubuntu 22.04 firewall, *ufw*, [whose settings are easily configured](https://www.linode.com/docs/guides/configure-firewall-with-ufw/) for the specific needs of applications. Scripts installing dotnet applications may require sudo rights to effectively change the firewall, file, or environmental settings for the user(s) of the runtime application.

Web services used in dotnet applications typically use ports `443`, `80`, and `8080` but are application-specific. You must change the *ufw* firewall to allow port access and use the correct protocol, either TCP or UDP, to communicate across the port(s).

Tailor user rights and file accessibility for the current dotnet-based application to use the installed run application, as well as to update application code for patching/fixing. By default, an apt- or snap-installed dotnet installation is updated either automatically or manually, depending on settings in the user’s host environment. If no network route can be found to a repository, no updates occur, leaving applications vulnerable.


## Limitations Of dotnet in Ubuntu 22.04 LTS

The dotnet components in the Ubuntu Repositories (apt and snap) support certain older versions of dotnet applications, but not all versions. If an application relies on a specific version that is not available, it cannot be easily adapted and may require recompilation. Only the developer knows what specific version dependencies are needed to make an application supportable on Ubuntu 22.04 instances. You may need to re-compile applications when runtime upgrade compatibility is required.

Docker dotnet images for versions below 6.0 are not provided for Ubuntu 22.04. If you require Docker images for older versions, alternative solutions or custom configurations may be needed.

## Security Implications

Microsoft’s dotnet implementation on Ubuntu 22.04 LTS focuses on applications that use the runtime and ASPcore in versions 6.0+. While older versions are available in repositories, the default settings favor the use of Versions 6.0+. Stand-alone code that doesn’t push or pull data is unlikely to present a security risk when prior versions of the dotnet or ASPcore runtimes are used. However, applications compiled with SDK versions 6.0+ benefit from the enhanced security provided by OpenSSL Version 3. Previous SDK versions rely on the now-deprecated encryption methods of OpenSSL Version 1, which are known to have security vulnerabilities.

## dotnet Requirements For Applications

The Ubuntu 22.04 base instance contains the components needed for dotnet applications executed through the dotnet runtime. If some of the library dependencies are missing/deleted/unavailable, applications do not run.

The library components needed by dotnet runtime applications include the following dependencies:

- GNU C Library (glibc)
- GNU C++ library
- GCC low-level runtime library
- Kerberos
- OpenSSL (Version 3)
- Zlib compression library
- libgdiplus (Version 6.0.1+)

These libraries need to be accessible to the dotnet application through the associated GUID instance (dotnet app).

Additionally, if the dotnet application makes use of HTTPS access, the host system must have appropriate ca-certificates configured to establish secure connections. This ensures that the application can communicate securely over HTTPS protocols.


## Conclusion

Ubuntu/Canonical and Microsoft offer installation of dotnet SDK developer services, and application execution services are readily available, especially in Ubuntu 22.04. Installation from apt, snap, and docker permit a Linode Ubuntu 22.04 clean image to install and run dotnet applications or the SDK quickly, and cleanly, and get needed updates under the aegis of standard package update mechanisms used by Ubuntu.

While many older versions of dotnet runtime versions are not supported, the more secure dotnet Version 6+ supported runtime employs more up-to-date openSSL security.
