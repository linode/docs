---
slug: How-To-Use-Binutils-On-Linux-Part-Two
author:
  name: Linode Community
  email: docs@linode.com
description: "Part II: A guide about tools in the binutils package that focus on binary analysis.  This guide describes what each tool does, why it exists and an example of how to use it."
og_description: "Part II: A guide about tools in the binutils package that focus on binary analysis.  This guide describes what each tool does, why it exists and an example of how to use it."
keywords: ["Binutils", "Linux", "Binary"]
tags: ["binutils", "GNU", "binary", "Linux", "object file"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 
modified_by:
  name: Linode
title: "How To Use binutils, the GNU Binary Utilities, In Linux Part II"
h1_title: "Conducting Binary Analysis with Binutils, the Linux Toolbox for Creating, Linking, Examining and Dissecting Binary Files"
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


## Binary Analysis: Binutils that Analyze and Inform

The tools in the `binutils` package provide many different ways to interact with binaries.  Linux environments grant their users limitless power under the assumption that they are adept in their knowledge, or at least, have a desire to understand their systems at a deeper level (if you are reading this, then their assumption is correct).  These binary utilities can be invoked to provide various types of information about binary files, allowing users to make confident and informed decisions, preventing them from unleashing some irreversible and destructive action onto a helpless binary.  

### `readelf` 

The `readelf` tool parses ELF format object files and displays information about its contents.  

 For reverse engineers and malware analysts, pulling information about a file's headers, symbols, classes, entry point address and more is usually the first step in the analysis process.  This information can also be helpful for troubleshooting, by taking a closer look into why a file may not be functioning as expected.

 To try the `readelf` tool, find an ELF object file with the following command.

        find / -name "*.o"

To be certain your target file with be compatible, run the `file` command followed by the file location being tested.

        file ./radare2/libr/asm/aop.o

The response should confirm the file is an ELF object file, similar to the output below. 

{{< output >}}
./radare2/libr/asm/aop.o: ELF 64-bit LSB relocatable, x86-64, version 1 (SYSV), with debug_info, not stripped
{{< /output >}}

There is no default settings for `readelf`, the command requires the user to decide what information to query and which sections to analyze.  To invoke the simplest and most thorough option, use the `-a` flag to receive all information possible.  

        readelf -a ./radare2/libr/asm/aop.o

{{< output >}}
ELF Header:
  Magic:   7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00
  Class:                             ELF64
  Data:                              2's complement, little endian
  Version:                           1 (current)
  OS/ABI:                            UNIX - System V
  ABI Version:                       0
[...]
{{< /output >}}

### `size`

The `size` tool is used to analyze binary files, listing the sizes of each section within, as well as its total size.  It supports many executable filetypes, though will respond with a `File format not recognized` error if it is used with non-executable files.

        size ./reversing/radare2/libr/asm/aop.o

{{< output >}}
   text    data     bss     dec     hex filename
   2399       0       0    2399     95f ./radare2/libr/asm/aop.o
{{< /output >}}

{{< note >}}
The `text` section refers to the code section of the binary, which has all the executable instructions in it. The `data` section is where all the initialized data is kept, and `bss` is where uninitialized data is stored.  Finally, `dec` is the total size of the previous three sections combined.
{{< /note >}}


### `gprof`

The `gprof` tool displays call graph profile data for programs written in C, Pascal and Fortran77.  The call graph profile calculates how much time is spent in each segment of code execution, letting the programmer know which parts of the code are inefficient.  This can illuminate problem areas that could benefit by being rewritten.  This command is a fairly obscure and advanced debugging and it is unlikely to be used, at least in contrast to the other tools included with `binutls`.  

To use `gprof`, you must compile your code with `gcc` and use the `-pg` flag.

        gcc -Wall -pg test.c -o gprof_test_compiled

Next, run the executable file that was previously compiled and a new file, entitled `gmon.out` will appear in your working directory.

        ./gprof_test_compiled

Finally, run the `gprof` tool with the executable and the `gmon.out` file as arguements, sending output into a new text file.  This text file will contain the analysis that `gprof` conducts.

        gprof ./gprof_test_compiled ./gmon_out > gprof_analysis.txt


The text file will appear similar to the example below.

{{< file "gprof_analysis.txt" >}}
Flat profile:

Each sample counts as 0.01 seconds.
%    cumulative self          self   total
time seconds    seconds calls s/call s/call name
33.86 15.52     15.52    1    15.52  15.52  func2

[...]
{{< /file >}}


### `gprofng`

Oracle engineers have recently developed `gprofng`, the next generation of the aforementioned tool.  Though similar in purpose to its predecessor, the new tool is significantly more versatile, as the binaries it analyzes do not need to be built in any specific way, nor does the user need to posesses the source code.  The `gprofng` tool can analyze C, C++, Java and Scala code and the output it provides can be in text or a full-color HTML page.  As this program is somewhat new, it is not included in all versions of `binutils`, though can typically be found in the default package manager by installing the `libgprofng0` library.

To use the `gprofng` tool to collect performance data on an executable, use the following command and switch `executable_file` with the target binary of your choice.  

        gprofng collect app ./executable_file

The previous command will create a directory containing the analysis information.  To view the collected data from the previous command in a command-line interface, enter the following command.

        gprofng display text ./DIRECTORY_CREATED_FROM_LAST_COMMAND

To display source code (if available) or a generated disassembly chart, enter the following command.  Remember to substitute `OBJECT_FILE` with the target file of your choice.

        gprofng display src OBJECT_FILE

### `strings`

The `strings` tool searches a binary file for readable bits of text that are at least four characters long and prints them on the screen.  The `strings` command is generally used for determining the contents of non-text files and is commonly used by reverse-engineers, anti-virus solutions and malware analysts, to identify malicious files without needing to run them.  

To use this tool, enter `strings` followed by the file you want to analyze.

        strings ./binary_file

{{< output >}}
ELF
GNU
GNU
libstdc++.so.6
GLIBC_2.2.5
[...]
{{< /output >}}

To find all strings with a minimum of six readable characters, use the `-n` flag as below.

        strings -n 6 ./binary_file

### `nm`

The `nm` tool displays information related to symbols within object files.  This tool provides a user with the ability to dissect object files and get a closer look at its internal symbols and how they were used by the assembler and linker tools during the compilation process.  

To use the `nm` tool, choose an object file to examine and follow the syntax below.

        nm object_file.o

To add debugger symbols to the output, use the `-a` flag.

        nm -a object_file.o

To display dynamic symbols only, use the `-D` flag.

        nm -D object_file.o




