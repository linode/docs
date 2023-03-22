---
slug: how-to-use-shebang-bash-python
description: 'This guide explains what a Shebang is and how to use it in a script'
keywords: ['how to use Shebang','Shebang Python','Shebang Bash','what is a Shebang']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-08-02
modified_by:
  name: Linode
title: "Use the Shebang in Bash and Python"
title_meta: "How to Use the Shebang in Bash and Python"
external_resources:
- '[Wikipedia Shebang page](https://en.wikipedia.org/wiki/Shebang_(Unix))'
authors: ["Jeff Novotny"]
---

A [*Shebang*](https://en.wikipedia.org/wiki/Shebang_(Unix)) directive, which always begins with the sequence `#!`, can sometimes be found on the first line of a Bash or Python script. In a Linux environment, the Shebang functions as an interpreter directive. This guide explains what a Shebang is and what advantages it provides. It also describes how to use a Shebang inside a Bash or Python script.

## What is a Shebang?

The Shebang `#!` symbol indicates the interpreter, or which version of an interpreter, to use when executing a script. It is also known as the "sharp-exclamation", "sha-bang", "hash-bang", or "pound-bang". The name is believed to have originated as a partial contraction of either "SHarp bang" or "haSH bang".

A Shebang is always the first line of a script. Because it begins with the `#` symbol, the interpreter does not process the line containing the Shebang. When a Linux system executes a text file, it treats the Shebang as an interpreter directive. It locates the correct interpreter and runs it, passing the name of the file to the interpreter as input. For example, executing a file named `~/scripts/shebang` that begins with the Shebang `#!/bin/sh` is functionally equivalent to running the command `/bin/sh ~/scripts/shebang`. The text file must be executable for proper processing to occur.

The Shebang directive has the following advantages:

-   Permits users to treat scripts and files as commands.
-   Hides certain implementation details from users, such as the name of the interpreter.
-   Does not require the user to know the absolute path to the interpreter or how to use the `env` command.
-   Allows a particular version of an interpreter to be used, for example, `python2` versus `python3`.
-   Allows the interpreter to be changed while maintaining the same user behavior and command.
-   Can automatically pass mandatory options through to the interpreter.

One potential drawback can occur if the path to the interpreter is hard coded. If the location of the interpreter changes, the Shebang directive must be updated at the same time. Otherwise, the script might stop working.

The Shebang directive follows this format.

```file
#!interpreter [options]
```

Here is an actual example of a Shebang instruction. This Shebang mandates the use of the `sh` Bourne shell to run the script. This example uses an absolute path to define the interpreter.

```file
#!/bin/sh
```

The `env` utility can help find the path to the interpreter. In this case, the Shebang instructs the system to use `/usr/bin/env` to discover the path to the `python2` interpreter. This technique is more robust because it continues to work if the path changes.

```file
#!/usr/bin/env python2
```

To effectively implement a Shebang, keep in mind the following rules.

-   The directive must always begin with the `#!` character combination.
-   To work properly, a Shebang must occur on the first line of the file. If it is found in any other place, it is treated as a comment.
-   Either specify the full absolute path to the interpreter or use `env` to find the correct path.
-   Place any interpreter options after the name of the interpreter. Implementation details for compiler options vary between different systems. However, all major operating systems support at least one option.
-   One or more spaces between the `#!` character combo and the name of the interpreter are allowed, but not required. For example, the directives `#!interpreter` and `#! interpreter` are both valid and functionally equivalent.
-   Linux permits a second script to serve as the interpreter for the first script, but this is not the case for all operating systems.

The directive `#!/bin/false` is a special Shebang. It immediately exits and returns a failure status. It prevents certain system files from being executed outside of their correct context.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Use a Shebang in a Bash Script?

The most common use of the Shebang is to specify the correct shell to use for a shell script. If a Shebang is not specified, the system uses the default interpreter belonging to the current shell. For example, in the Bash shell, the default interpreter is `bash`.

To ensure the `sh` interpreter always processes a script, no matter what shell is active, a Shebang must be used. A Shebang such as `#!/bin/sh` or `#!/usr/bin/env sh` must be added. The system launches the `sh` interpreter, appending the name of the file as an argument. The interpreter treats the Shebang like a comment, which avoids an infinite loop, and interprets the remainder of the file.

### Using a Shebang with an Absolute Path

One common method to use a Shebang is to specify the full path to the interpreter on the first line of the file.

{{< note respectIndent=false >}}
In this program, the line `ps h -p $$ -o args=''` prints out the name of the interpreter along with any arguments passed to it.
{{< /note >}}

To use a Shebang to define a mandatory interpreter for a shell script, follow these steps.

1.  Create a file named `shebang_absolute` with the following contents.

    ```file {title="shebang_absolute"}
    #!/bin/sh

    echo "Interpreter test. The interpreter and arguments are:"
    ps h -p $$ -o args=''
    ```

2.  Ensure the file is executable.

    ```command
    chmod +x shebang_absolute
    ```

3.  Execute the file from the same directory. The `sh` interpreter is shown in the output.

    ```command
    ./shebang_absolute
    ```

    {{< output >}}
Interpreter test. The interpreter and arguments are:
/bin/sh ./shebang_absolute
    {{< /output >}}

4.  Change the first line to `#!/bin/bash` and run the program again. The output now shows `bash` as the interpreter.

    ```command
    ./shebang_absolute
    ```

    {{< output >}}
Interpreter test. The interpreter and arguments are:
/bin/bash ./shebang_absolute
    {{< /output >}}

### Using a Shebang with env

For a more robust script implementation, use the `env` utility to determine the path to the interpreter. `env` uses the `$PATH` variable to search for the interpreter. It always returns the first match it finds.

To use `env` in a Shebang, follow these steps.

1.  Create a new file named `shebang_env`. Add the following instructions.

    ```file {title="shebang_env"}
    #!/usr/bin/env sh

        echo "Interpreter test. The interpreter and arguments are:"
        ps h -p $$ -o args=''
    ```

2.  Change the file attributes so the file is executable.

    ```command
    chmod +x shebang_env
    ```

3.  Execute the file. Run the command from the same directory as the new file.

    ```command
    ./shebang_env
    ```

    {{< output >}}
Interpreter test. The interpreter and arguments are:
sh ./shebang_env
    {{< /output >}}

### Passing Options to the Interpreter

A Shebang can pass through interpreter options. The directive `#!/bin/sh -v` runs the interpreter using the `-v`/verbose option. This option echoes each command to the screen upon execution. This example appends the `-v` option to the Shebang in `shebang_absolute`.

```command
./shebang_absolute
```

{{< output >}}
#!/bin/bash -v

echo "Interpreter test. The interpreter and arguments are:"
Interpreter test. The interpreter and arguments are:
ps h -p $$ -o args=''
/bin/bash -v ./shebang_absolute
{{< /output >}}

{{< note respectIndent=false >}}
If the Shebang uses `env`, do not declare the option within the Shebang. Instead, use the declaration `set -v` to set the option on the next line.
{{< /note >}}

## How to Use a Shebang in a Python Script?

In Python, the Shebang identifies which version of the Python interpreter to use. This feature might be necessary for older programs that cannot run on newer interpreters. Any script that requires Python version 2 can be redirected to the `python2` interpreter. The Shebang `#!/usr/bin/env python2` sets the Python interpreter to `python2`. Always use the `env` utility to set the path to the Python interpreter because it is sometimes installed in a non-standard directory.

To use a Shebang with a Python script, follow these steps.

1.  Create the `py_v3.py` Python file. Add the following commands. The `sys.version` method displays the active version of the Python interpreter. Use `import sys` to import the necessary package.

    ```file {title="py_v3.py" lang="python"}
    #!/usr/bin/env python3

    import sys
    print("This version of Python is:")
    print(sys.version)
    ```

2.  Set the execute permission on the file.

    ```command
    chmod +x py_v3.py
    ```

3.  Run the executable file, but do not use the `python3` command. The correct Python interpreter is selected at runtime based on the Shebang.

    ```command
    ./py_v3.py
    ```

    {{< output >}}
This version of Python is:
3.10.4 (main, Jun 29 2022, 12:14:53) [GCC 11.2.0]
    {{< /output >}}

4.  To confirm Python version 2 can be substituted in place of Python 3, create a new file `py_v2.py` and enter the following instructions.

    ```file {title="py_v2.py" lang="python"}
    #!/usr/bin/env python2

    import sys
    print("This version of Python is:")
    print(sys.version)
    ```

5.  Set the executable attribute and run the file. The program now displays information about the `python2` interpreter.

    ```command
    chmod +x py_v2.py
    ./py_v2.py
    ```

    {{< output >}}
This version of Python is:
2.7.18 (default, Jul  1 2022, 10:30:50)
[GCC 11.2.0]
    {{< /output >}}

## Overriding the Shebang Directive

Even if a file contains a Shebang, it's still possible to override it from the command line. One reason to do this might be to test how a script behaves with a different interpreter. From the command line, enter the name of the interpreter to use, followed by the name of the file. This tells the system to ignore the Shebang statement.

In the following example, `py_v2.py` contains the Shebang directive `#!/usr/bin/env python2`. But if the command `python3 ./py_v2.py` is entered, the `python3` interpreter is used instead.

```command
python3 ./py_v2.py
```

{{< output >}}
This version of Python is:
3.10.4 (main, Jun 29 2022, 12:14:53) [GCC 11.2.0]
{{< /output >}}

## Conclusion

A Shebang indicates which Bash or Python interpreter to use to interpret an executable file. Shebangs are supported on Linux and many other operating systems. A Shebang begins with the characters `#!` and only occurs on the first line of the file. The interpreter can be specified using an absolute path or through the `env` program. It is possible to use a Shebang to pass additional parameters to the interpreter or to override a Shebang on the command line.