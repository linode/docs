---
slug: How-To-Use-Binutils-On-Linux-Part-Three
author:
  name: Linode Community
  email: docs@linode.com
description: "Part III: A guide about the rest of tools in the binutils package.  This guide describes what each tool does, why it exists and an example of how to use it."
og_description: "Part III: A guide about the rest of tools in the binutils package.  This guide describes what each tool does, why it exists and an example of how to use it."
keywords: ["Binutils", "Linux", "Binary"]
tags: ["binutils", "GNU", "binary", "Linux", "object file"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 
modified_by:
  name: Linode
title: "How To Use binutils, the GNU Binary Utilities, In Linux Part III"
h1_title: "The Rest of the Linux Toolbox for Creating, Linking, Examining and Dissecting Binary Files"
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

## Binutils that Alter and Convert

### `strip`

The `strip` tool is used to remove symbols from object files.  During the development process, symbols can provide a useful reference point when debugging to aid in the troubleshooting process.  However, when the code is ready for deployment, leaving these symbols within the object file can waste previous bits of memory.  When working on embedded systems projects or other low-level code, it is recommended to use `strip` to optimize your code prior to deployment.  

To use `strip`, follow the format below.

        strip ./target_file

To compare file size before and after using `strip`, you can use `ls -lah` to view file information in your current directory.  To be certain that all symbols were removed from the executable, use the `nm` tool, which displays all symbol information within a binary.

        nm ./target_file

{{< output >}}
nm: target_file: no symbols
{{< /output >}}

### `c++filt`

The C++ language allows writing multiple functions with the same name (as long as they each process different types of parameters), a process known as overloading.  During compilation, *mangling* occurs, where each function is encoded into lower-level assembly labels.  The `c++filt` command performs the inverse of mangling, converting these low-level names into user-level names to prevent clashing error during the linking process. 

The `c++filt` tool can be used to decipher symbols sent as input, printing their demangled versions as standard output.

        grep *func* mangled.s | c++filt

{{< output >}}
func3(int):
func3():
{{< /output >}}


## Working with Object Files

### `objcopy`

The `objcopy` tool is used to copy or translate an object file into various formats for different platforms (like ARM or x86).  If the source code is available, the situation can be remedied by recompiling it into the desired format, however, when the source code is not available, the `objcopy` command is invaluable.

The general syntax of using `objcopy` is shown below.

        objcopy [options] infile [outfile].

To create a `.s` file of the target file, use the `-O srec` flag.

        objcopy -O srec object_file

To create a raw binary output of the object file, use the `-O binary` flag.

        objcopy -O binary object_file

### `objdump`

The `objdump` tool is used to disassemble an object file.  This feature is generally used in debugging for programmers dealing with compilation and low-level languages.  

To disassemble an object file, follow the syntax shown in the example below.

        objdump [options] target_file

To display assembler contents of all sections, use the `-D` or `--disassemble-all` flag.

        objdump -D target_file

To display debug information in an object file, use the `-g` or `--debugging` flag.  

        objdump -g target_file        

To display the contents of all headers, use the `-x` or `--all-headers` flag.

        objdump -x target_file


