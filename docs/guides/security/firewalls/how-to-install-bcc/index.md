---
slug: how-to-install-bcc
description: 'Learn to enhance the security of the server through the use of eBPF tracing tools'
keywords: ["eBPF", "bcc", "tracing", "tools", "monitoring", "networking", "observability"]
bundles: ['network-security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-27
modified: 2021-08-27
modified_by:
  name: Linode
title: Installing BCC to Use eBPF Tracing Tools
tags: ["networking","security"]
external_resources:
- '[iovisor](https://github.com/iovisor/bcc)'
authors: ["Linode"]
---
## Before You Begin

You need the following:

1. A system running on a Linux distribution and a Linux kernel version 4.1 or later. Review the Getting Started guide if you do not yet have a compatible system. For more information, review the [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guide.

1. **Login credentials to the system** for either the root user (not recommended) or a standard user account (belonging to the `sudo` group) and the ability to access the system through [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/). Review the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide for assistance on creating and securing a standard user account.

{{< note respectIndent=false >}}
Some commands in this guide require elevated privileges and are prefixed with the `sudo` command. If you are logged in as the root use (not recommended), you can omit the `sudo` prefix if desired. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/#understanding-the-sudo-linux-group-and-user) guide.
{{< /note >}}

## What is eBPF?

Berkeley Packet Filter (BPF) is an execution engine subsystem in the kernel that processes a virtual instruction set. BPF has been extended recently as eBPF for providing a safe way to extend kernel functionality. BPF is now used for software defined networking, observability, security enforcement, and more. The main front-ends for BPF performance tools are BPF Compiler Collection (BCC) and `bpftrace`.

eBPF tracing is used for:

- any ext4 operations that take longer than 50 ms
- run queue latency, as a histogram
- packets and applications that are experiencing TCP retransmits.
- the stack trace when threads block (off-CPU), and how long they block
- security modules and software defined networks.

### Install BCC on different distributions of Linode using packages

#### Ubuntu 18.04 or later
The stable and the nightly packages are built for Ubuntu Bionic (18.04).

**Stable and Signed Packages**

Install BCC using stable packages by adding the appropriate key and repository to Advanced Package Tools (APT) by typing the following commands:

    sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 4052245BD4284CDD
    echo "deb https://repo.iovisor.org/apt/$(lsb_release -cs) $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/iovisor.list
    sudo apt-get update
    sudo apt-get install bcc-tools libbcc-examples linux-headers-$(uname -r)

Tools are installed under `/usr/share/bcc/tools`.

**Nightly Packages**

Install BCC using nightly packages by typing the following commands:

    echo "deb [trusted=yes] https://repo.iovisor.org/apt/bionic bionic-nightly main" | sudo tee /etc/apt/sources.list.d/iovisor.list
    sudo apt-get update
    sudo apt-get install bcc-tools libbcc-examples linux-headers-$(uname -r)

The tools are installed under `/usr/share/bcc/tools`.

**Ubuntu Packages**

BCC is also available from the standard Ubuntu multiverse repository, under the package name bpfcc-tools:

    sudo apt-get install bpfcc-tools linux-headers-$(uname -r)

The tools are installed in  */sbin* with a `-bpfcc` extension. To verify the installation run `sudo opensnoop-bpfcc`.


#### Debian 10

##### Debian Packages

BCC and its tools are available in the standard Debian main repository. From the source package `bpfcc` under the package names `bpfcc-tools`, `python-bpfcc`, `libbpfcc`, and `libbpfcc-dev`.

    sudo apt-get install bpfcc-tools linux-headers-$(uname -r)

The tools are installed in  */sbin* with a `-bpfcc` extension. Try running `sudo opensnoop-bpfcc`.


#### Fedora 32 or later

As of Fedora 30, `bcc` binaries are available in the standard repository.

    sudo dnf install bcc

{{< note respectIndent=false >}}
If you keep getting `Failed to load program: Operation not permitted` when you run the `hello_world.py` example as root, then you need to lift the kernel lockdown. For more information, see [FAQ](https://github.com/iovisor/bcc/blob/master/FAQ.txt).
{{< /note >}}

#### Gentoo - Portage

Install BCC using the following command:

    sudo emerge dev-util/bcc

Use the command `sudo ACCEPT_KEYWORDS="~amd64" emerge dev-util/bcc` if there is a message that reads similar to:

{{< output >}}
!!! All ebuilds that could satisfy "dev-util/bcc" have been masked.
!!! One of the following masked packages is required to complete your request:
- dev-util/bcc-0.20.0-r1::gentoo (masked by: ~amd64 keyword)
- dev-util/bcc-0.19.0-r1::gentoo (masked by: ~amd64 keyword
{{< /output >}}

The appropriate dependencies are pulled automatically.


#### Alpine 3.11 or later
As of Alpine 3.11, `bcc` binaries are available in the community repository:

    sudo apk add bcc-tools bcc-doc

The tools are installed in `/usr/share/bcc/tools`.

#### Python Compatibility

The binary packages include bindings for Python 3 only. The Python-based tools assume that a python binary is available at `/usr/bin/python,` but that may not be true on recent versions of Alpine. If you encounter errors like &lt;tool-name&gt;: not found, you can try creating a symlink to the Python 3.x binary:

    sudo ln -s $(which python3) /usr/bin/python

**Containers**

Alpine Linux is often used as a base system for containers. BCC can be used in such an environment by launching the container in privileged mode with kernel modules available through bind mounts:

    sudo docker run --rm -it --privileged \
      -v /lib/modules:/lib/modules:ro \
      -v /sys:/sys:ro \
      -v /usr/src:/usr/src:ro \
      alpine:3.12

#### CentOS - Source

For CentOS 7.6 only

1. Install build dependencies:
{{< output >}}
  sudo yum install -y epel-release
  sudo yum update -y
  sudo yum groupinstall -y "Development tools"
  sudo yum install -y elfutils-libelf-devel cmake3 git bison flex ncurses-devel
  sudo yum install -y luajit luajit-devel  # for Lua support
{{< /output >}}

1. Install and compile LLVM from source code:
{{< output >}}
  curl  -LO  http://releases.llvm.org/7.0.1/llvm-7.0.1.src.tar.xz
  curl  -LO  http://releases.llvm.org/7.0.1/cfe-7.0.1.src.tar.xz
  tar -xf cfe-7.0.1.src.tar.xz
  tar -xf llvm-7.0.1.src.tar.xz

  mkdir clang-build
  mkdir llvm-build

  cd llvm-build
  cmake3 -G "Unix Makefiles" -DLLVM_TARGETS_TO_BUILD="BPF;X86" \
  -DCMAKE_BUILD_TYPE=Release ../llvm-7.0.1.src
  make
  sudo make install

  cd ../clang-build
  cmake3 -G "Unix Makefiles" -DLLVM_TARGETS_TO_BUILD="BPF;X86" \
  -DCMAKE_BUILD_TYPE=Release ../cfe-7.0.1.src
  make
  sudo make install
  cd ..
{{< /output >}}
1. Optional:
   Install from `centos-release-scl`:

    {{< output >}}
  yum install -y centos-release-scl
  yum-config-manager --enable rhel-server-rhscl-7-rpms
  yum install -y devtoolset-7 llvm-toolset-7 llvm-toolset-7-llvm-devel llvm-toolset-7-llvm-static llvm-toolset-7-clang-devel
  source scl_source enable devtoolset-7 llvm-toolset-7
    {{< /output >}}
    For permanently enabling scl environment, see: https://access.redhat.com/solutions/527703.

1. Install and compile BCC:
  {{< output >}}
  git clone https://github.com/iovisor/bcc.git
  mkdir bcc/build; cd bcc/build
  cmake3 ..
  make
  sudo make install
  {{< /output >}}
### Useful commands using the BCC (eBPF) tools:

 - Trace new processes: `execsnoop`
 - Trace file opens with process and filename: `opensnoop`
 - Summarize block I/O (disk) latency as a power-of-2 distribution by disk: `biolatency -D`
 - Summarize block I/O size as a power-of-2 distribution by program name: `bitesize`
 - Trace common ext4 file system operations slower than 1 millisecond: `ext4slower 1`
 - Trace TCP active connections (connect()) with IP address and ports: `tcpconnect`
 - Trace TCP passive connections (accept()) with IP address and ports: `tcpaccept`
 - Trace TCP connections to local port 80, with session duration: `tcplife -L 80`
 - Trace TCP retransmissions with IP addresses and TCP state: `tcpretrans`
 - Sample stack traces at 49 Hertz for 10 seconds, emit folded format (for flame graphs): `profile -fd -F 49 10`
 - Trace details and latency of resolver DNS lookups: `gethostlatency`
 - Trace commands issued in all running bash shells: `bashreadline`

