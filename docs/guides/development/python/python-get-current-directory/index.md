---
slug: python-get-current-directory
title: "How to Get the Current Directory in Python"
title_meta: "A Guide to Paths in Python: Get Working Directory"
description: 'This guide provides information on how to retrieve the current working directory in Python using the os module. It covers the os.getcwd() function and provides sample code to demonstrate its usage.'
keywords: ['python change working directory', 'python get current directory', 'python change directory', 'change directory python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Martin Heller"]
published: 2023-06-12
modified_by:
  name: Linode
---

Programs often need to look for, read, and write specific files in a special location. By convention, and with support from the operating system, programs maintain a current working directory used as the context for many of their files. There may also be fixed directories and files that are special to the program, such as the configuration files for editors and IDEs.

## What is the Current Working Directory?

In most operating systems, a directory is a container for files, and possibly for other directories, called subdirectories. In Unix-like systems, directories are treated as a special kind of file.

Files contain data and/or code. In Unix-like systems, files can have special bits in their permissions that mark them as executable. In Windows systems, the file type determines whether a file is executable.

Folders might seem like they are synonymous with directories, but they are usually considered the graphical representation of directories rather than the directories themselves. Paths are strings that describe the locations of directories and files in the context of the operating system’s file system. Paths can be absolute, or relative.

The current working directory (CWD) associates a specific directory with a program and makes that directory the default location for all file operations. When a program reads or writes a file without specifying a directory in the path, it looks for the file in the current working directory. If the program specifies a relative path, such as `../my_file`, the path is calculated relative to the current working directory, in this case specifying the directory above the CWD. If the program specifies an absolute path, such as `/usr/bin/python3`, the CWD does not enter into the calculation of the location.

The current working directory is independent of the executable file’s location.

## How to Get and Change the Current Directory in Python

Python programs share the operating system’s idea of the CWD with all other programs, even though Python as a whole is a system-agnostic language. Python has a module, `os`, that provides a portable way of using operating system-dependent functionality, and within that module, each system’s version of Python has an appropriate implementation for that system.

### How to Get the Current Working Directory

To get the current working directory in Python, import the `os` module and call the `os.getcwd()` method. Here’s an example:

```output
Python 3.9.7 (default, Sep 3 2021, 09:29:02)
[GCC 9.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import os
>>> cwd = os.getcwd()
>>> print(cwd)
```

In the example above, the `os.getcwd()` method returns a string representing the current working directory.

### How to Change the Current Working Directory

To change the current working directory in Python, import the `os` module and call the `os.chdir(<path>)` method. Here’s an example:

```output
Python 3.9.7 (default, Sep 3 2021, 09:29:02)
[GCC 9.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import os
>>> current_dir = os.getcwd()
>>> print("Current working directory:", current_dir)
Current working directory: /home/user
>>> os.chdir("my_directory")
>>> new_dir = os.getcwd()
>>> print("New current working directory:", new_dir)
New current working directory: /home/user/my_directory
```

#### Change the current working directory to the path

The `os.fchdir()` is a method that can support specifying a file descriptor in Python. This method changes the current working directory to the directory associated with a given file descriptor. The file descriptor must refer to an opened directory, not an open file.

The `os.fchdir()` method can raise `OSError` and its subclasses such as `FileNotFoundError`, `PermissionError`, and `NotADirectoryError`. Some possible reasons for `OSError` being raised include:

- The specified file descriptor is not valid
- The specified file descriptor does not refer to a directory
- The process does not have permission to access the directory associated with the file descriptor
- The directory associated with the file descriptor has been removed while the file descriptor was still open

In Python 3.6 and later versions, the `os.chdir()` method was updated to accept a path-like object as its argument in addition to a string representing the directory path.

Following is an example that uses a path-like object to set the current working directory:

```output
Python 3.9.7 (default, Sep 16 2021, 13:09:58)
[Clang 13.0.0 (clang-1300.0.29.3)] on darwin
>>> import os
>>> os.getcwd()
'/Users/myuser'
>>> os.chdir("..")
>>> os.getcwd()
'/Users'
>>> os.chdir("~/Pictures")
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
FileNotFoundError: [Errno 2] No such file or directory: '~/Pictures'
```

From the above code, although the `~/Pictures` directory exists, changing to it works in the shell:

```command
(base) username@hostname ~ % cd ~/Pictures
(base) username@hostname Pictures %
```

But, in Python, the expansion of `~` to the home directory path does not happen. When you try to change the current working directory to `~/Pictures`, Python interprets it as a literal string with `~` as a character and `Pictures` as a directory name and tries to change the working directory to a directory named `~` in the current directory, which does not exist.

{{< note noTitle=true >}}
The directory path conventions are different on Windows, where you see back-slashes for directory separators and letter disk descriptors in the shell and file manager. For example, `c:\Users\User\Documents`. In Python, you still use forward slashes for directory separators. The forward slashes are converted to back slashes inside the os module to interact with the Windows operating system.
{{< /note >}}

To resolve the `FileNotFoundError` above, use the `os.path.exists(<path>)` method as shown in the example below. This method finds out whether a path exists or not before attempting to open or access it.

```output
Python 3.9.12 (main, Apr  5 2022, 01:53:17)
[Clang 12.0.0 ] :: Anaconda, Inc. on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> import os
>>> os.path.exists("~/Pictures")
False
>>> os.path.exists("./Pictures")
True
>>> os.getcwd()
'/Users/myuser'
```

From the above Python example, the `os.path.exists(path)` method returns `True` if the specified path exists and `False` for broken symbolic links. The method internally uses `os.stat()` to check for the existence of the file or directory, and `os.stat()` requires read and execute permissions on the file or directory. Hence, on some platforms, even if the file, or directory exists physically on the system, the method may return `False` due to permission issues.


## Conclusion

As you see, you can get the current working directory in Python by importing the `os` module and calling the `os.getcwd()` method. You can change the working directory using the `os.chdir(<path>)` method, and you can test whether a path, either directory, or file, exists using the `os.path.exists(<path>)` method.
