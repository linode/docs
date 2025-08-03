---
slug: How-To-Use-Binutils-On-Linux
author:
  name: Linode Community
  email: docs@linode.com
description: "An overview of the various tools included in the binutils package.  This guide describes what each tool does, why it exists and an example of how to use it."
og_description: "An overview of the various tools included in the binutils package.  This guide describes what each tool does, why it exists and an example of how to use it."
keywords: ["Binutils", "Linux", "Assembly", "Binary"]
tags: ["binutils", "GNU", "binary", "Linux", "object file", "ld", "gcc", "assembly", "ELF", "compiler", "linker"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 
modified_by:
  name: Linode
title: "How To Use binutils, the GNU Binary Utilities, In Linux"
h1_title: "The Linux Toolbox for Creating, Linking, Examining and Dissecting Binary Files"
enable_h1: true
contributor:
  name: Jan Slezak
  link: https://github.com/scumdestroy
external_resources:
- '[Binutils - GNU Project](https://www.gnu.org/software/binutils/)'
- '[GNU Binutils Docs](https://sourceware.org/binutils/)'
- '[GNU Binutils at Wikipedia](https://en.wikipedia.org/wiki/GNU_Binutils)'
- '[Official Binutils Repo](https://sourceware.org/git/binutils-gdb.git)'

---

[*GNU Binutils*](https://www.gnu.org/software/binutils/) are a collection of binary utilities that compile, link, manage and examine binary programs, object files, system libraries and assembly source code.  The tools included can be used on their own, though users are more likely to interact with them unknowingly, as they compose integral parts of other programs like `make`, `gcc` and the `gdb` debugger. 

Learning `binutils` can be very beneficial to programmers.  Being able to understand how the system functions at lower levels of programming and how to navigate through the code will be applicable across many applications, libraries and even operating systems.  Gaining the ability to dissect, examine and diagnose issues quickly, precisely and confidently will reduce troubleshooting and debug time, across many otherwise difficult problems without clear solutions.  If a serious issue occurs during the initial compiling or linking stage, it is often unlikely that solutions and workarounds targeting executable files will be able to solve the problem.  Most programmers are not able to work with low-level code, leading these skills to increase in value and demand in fields like reverse engineering, malware analysis and exploit development.

The `binutils` package is commonly shipped with various popular Linux distributions and is available in the default package managers of almost all Linux variants.  Though the `binutils` package contains a variety of tools with diverse uses, their primary purpose centers around compiling and linking programs at .      

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

2.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.


{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}


## Installing Binutils 

To check if `binutils` is already installed, enter the following command to list the binaries, libraries and documentation files available from the `binutils` package.

    cat /var/lib/dpkg/info/binutils.list

{{< output >}}
/usr/bin/addr2line
/usr/bin/ar
/usr/bin/as
/usr/bin/c++filt
/usr/bin/dwp
/usr/bin/elfedit
/usr/bin/gold
[...]
{{< /output >}}

If the previous command returns no data or an error, install binutils using the standard package manager.

For Debian and Ubuntu-based distributions, enter the following command.

    sudo apt-get update && sudo apt-get upgrade && sudo apt-get install binutils -y 

On Fedora or other distributions using the `dnf` package manager, enter the following command.
    
    sudo dnf makecache --refresh && sudo dnf -y install binutils

On RedHat, CentOS or other distributions using the `yum` package manger, enter the following command.

     sudo yum makecache --refresh && sudo yum -y install binutils

The `binutils` package is also available from its [official repository]("https://sourceware.org/git/binutils-gdb.git").

## Core Utilities (as, ld)

Among the many tools available across the GNU Binutils package, the two most common and important are `as`, the assembler and `ld`, the linker.

### `as`, the GNU assembler

The assembler, or `as`, is used to process assembly code into binaries that can be read by the system's processor.  When using tools like `gcc` or `make` to compile C code into an executable **ELF** file, the code is actually converted into assembly code by `as`, which is then generated into the machine code the processor can use.  Almost all executable files ran in Linux are ELF files, an acronym for *Executable and Linkable Format*.  In addition to the machine code within the file (the "E" part), there are also symbols denoting the various functions, variables and their locations necessary for successful execution of the binary file.  In similar fashion, using `as` to compile a library file will result in an ELF file that contains the expected code, as well as symbols defining where the code for each library function begins.  Generally, much of this is automated and will not need to be performed manually, though it can be very useful for debugging, diagnosing issues and finding workarounds for compilation errors.

Following the Unix philosophy of having a singular purpose and performing it exceptionally, the most common use of `as` is reading assembly code and writing it to machine code as shown below.

    as asm_code.s -o machine_code.o

    file asm_code.s

{{< output >}}
asm_code.s: assembler source, ASCII text
{{< /output >}}

    file machine_code.o

{{< output >}}
machine_code.o: ELF 64-bit LSB relocatable, x86-64, version 1 (SYSV), not stripped
{{< /output >}}

{{< note >}}
Without the `-o` flag to set an output file, `as` will default to an output file named `a.out`.  Running the `file` command on the `a.out` file will produce the same output as the example above, regardless of the file extension it appears to hold.
{{< /note >}}

The output of `as` will not always necessarily produce executable files.  For example, library files compiled by `as` will not have an entry point (`main()` function), instead existing to hold sets of functions for other programs to call and utilize.  Compiled assembly code can also reference functions in other binary files or your assembled file may not have the directions to call functions in other libraries.  The solution to all of these issues can be found in `ld`, a tool for linking multiple binary files together.

## `ld`, the GNU linker

The linker, or `ld`, combines multiple object, binary and library files into a new, single, final executable binary package, either at runtime or as a final step. Before reaching their final executable form, multiple source files can be compiled, linked and recompiled multiple times into ELF object files.  To accomplish this predictably and successfully, the linker follows instructions through resolving the *symbols* inherent in the files it parses.  

Symbols are parsed by the linker into two possible categories.  *Definitions*, which connect a name to its data, such as the initialization of a global variable or the code that defines a function or *declarations*, basically any subsequent uses of aforementioned variables or functions.  When a variable or function is initially defined, a symbol representing its memory address and initial value is created.  Any subsequent mentions of the variable or function will generate an unresolved reference, though they will share the same symbol as their instantiated definition.  The job of the linker is to resolve all of these references and link all matching declarations to a singular, shared copy, which may resolve to a library, a binary file or something else.  

Like the assembler, this process is generally not handled manually by users, though can be invoked with the following syntax.

    ld code_1.o code_2.o -o linked_codes.bin      

## Putting It All Together

Though many complicated sub-processes occur during the process of compiling C code into an executable, it can be simplified into three separate events.  The following summary will use `gcc` as an example, though most other compilers follow a similar process.

GCC converts the C source code into assembly code.

    gcc code.c -S asm_code.S

The assembler uses the assembly code to generate an object file.

    as asm_code.S -o object_file.o

The linker resolves the symbols in the object file to generate an executable ELF file that the system can process.

    ld object_file.o -o ELF_executable 

{{< note >}}
Running `gcc` with the `-v` flag will produce overwhelmingly verbose output, replete with detailed descriptions of each step throughout the compilation process.
{{< /note >}}

### GNU's Gold Linker

In some Linux distributions, `binutils` may come bundled with a new linker, invoked via `gold` or `ld.gold`.  *Gold* was developed from scratch, for the purpose of providing cleaner and faster results than its predecessor, especially when working with large applications coded in C++.  *Gold* does not rely on the long-standing *BFD library* utilized by `ld` for decades to process a vast variety of object files, leaving it less versatile and incompatible with some object file formats.   

To replace `ld` with the newer `gold` linker in `gcc`, use the `-fuse-ld` flag as seen in the example below.

    gcc source_code.c -o compiledELF -fuse-ld=gold 

To set `gold` as the preferred linker when compiling with `make` or `cmake`, add the following line to the project's `Makefile`.

    LD=ld.gold


