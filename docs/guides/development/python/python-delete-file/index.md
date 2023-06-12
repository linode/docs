---
slug: python-delete-file
title: "Modules in Python: Remove Files & Directories"
title_meta: "Quick Guide to Python: Delete Files & Directories"
description: 'In Python, delete file commands use functions from os, pathlib, and shutil modules. Read this guide to learn how to delete single files and entire directories. '
keywords: ['python delete file', 'python remove file', 'python delete directory', 'python delete file if exists', 'python delete all files in directory']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Stephen Satchell"]
published: 2023-06-12
modified_by:
  name: Linode
---

Many applications use temporary files to hold intermediate results in their execution. A program, for example, may process several gigabytes of data in multiple passes because trying to hold it all in memory can exceed the ability of the system, even with a large swap store. This is true when multiple copies of an application are running. Holding all the data in memory can slow down the application because the virtual memory system has to keep paging data in and out of working memory. When the application is finished with the temporary files, it’s a good idea to delete that working file, to free up the disk space.

Other applications may generate a report or transaction file as part of their work. If the program encounters a fatal problem and does not finish completely, the best practice is to remove the incomplete output.

This guide describes the tasks, how the tasks are done in a shell, and the equivalent Python code:

- Delete a single file
- Delete multiple files using glob filename syntax
- Delete an empty directory
- Delete a directory that still contains files
- Show how to use glob syntax for file names
- Show an alternative using the Python “pathname” module


## How To Delete a File

While other scripting languages require programmers to use external shell commands to delete files, Python provides built-in modules that perform the same functions as the shell commands.

To delete a file in Python, you must have ownership of the file as well as write and execute permissions for the directory that contains the file. In a shell, you use the `rm` or `unlink` command to delete a file, symlink, or hard link.

To delete a file named `example.txt`, use the following command:

{{< note type="warning">}}
It's important to exercise caution when using `rm` or `unlink` commands, as files can be permanently deleted from the file system without any confirmation.
{{< /note >}}


```command
$ rm /tmp/example.txt
```

To unlink the same file, use the following command:

```command
$ unlink /tmp/example.txt
```

### How to Delete a Single File in Python Using the “os” Module

The `os` module in Python provides the functions `os.remove()` and `os.unlink()` which can be used to delete a single file from the file system. The code below demonstrates how to delete a single file using the `os` module:

```file {title="delete_file.py" lang="python"}
import os

file_path = "/tmp/example.txt"

try:
    # delete the file using os.remove()
    os.remove(file_path)
    print(f"{file_path} deleted successfully.")
except OSError as e:
    print(f"Error deleting {file_path}: {e}")
```
When you delete a symbolic link (symlink) in a Unix-like operating system, only the link itself is removed, and the file that it points to remains untouched. On the other hand, when you delete a hard link, the file associated with that link is not removed from the file system, unless no other links are pointing to the same file.

The `os.remove()` and `os.unlink()` functions can raise several exceptions if an error occurs during the deletion process. The exceptions that may be raised by these functions include:

- `FileNotFoundError` – raised if the file to be deleted is not found at the specified path.
- `IsADirectoryError` – raised if the path specified for deletion is a directory, not a file.
- `PermissionError` – raised if the user does not have sufficient permissions to delete the file.
- `OSError` – a catch-all exception that can be raised for any other error that occurs during the deletion process.


## How To Delete Multiple Files

Use the `rm` command with the `*~` wildcard to remove all files in the current directory that end with a tilde (`~`) character, which are typically backup files created by some text editors. For example, to remove all backup files from the current directory, use the following command:

```command
rm *~
```

### How to Delete Multiple Files in Python Using the “os” Module

In Python, you can delete multiple files using the `os` and `glob` modules. The `glob` module is used to find all the file paths that match a specified pattern, while the `os` module is used to delete each file. The Python script below demonstrates how to delete all files in the current directory that end with a tilde character:

```file {title="delete_files.py" lang="python"}
import os
import glob

# Find all files in the current directory that end with a tilde character
for filepath in glob.glob("*~"):
    try:
        # Attempt to delete the file
        os.unlink(filepath)
        print(f"Unlinked file: {filepath}")
    except OSError as e:
        # Handle any errors that occur during deletion
        print(f"Not unlinked {filepath}: {e}")
```

{{< note type="warning">}}
It's important to be careful when using the `glob` module, as using the `*` wildcard by accident can result in accidentally deleting all the files in the directory.
{{< /note >}}


### How To Delete an Empty Directory (Folder)

Use the `rmdir` command to remove an empty directory. The `rmdir` command only works on empty directories. To remove an empty directory called `/tmp/thedirectory`, use the following command:

```command
rmdir /tmp/thedirectory
```

### How to Delete an Empty Directory in Python Using the “os” Module

Use the `os.rmdir()` function to delete an empty directory. The Python script below demonstrates how to use `os.rmdir()` to delete an empty directory:

```file {title="delete_empty_directory.py" lang="python"}
import os

# Delete an empty directory called 'thedirectory'
os.rmdir('thedirectory')
```

## How To Delete a Non-Empty Directory

The `rm` command with the `-r` and `-f` flags is used to recursively delete a directory and its contents. It can be used even if some of the files or directories are write-protected or have other permissions that prevent normal deletion. The `rm -rf` command below deletes a directory called `thedirectory` and all its contents.

```command
rm -rf thedirectory
```

## How to Delete a Non-Empty Directory in Python Using the “shutil” Module

The `shutil.rmtree()` function is used to delete a non-empty directory and all its contents recursively. Following is an example that demonstrates how to use the `shutil.rmtree()` to delete a non-empty directory called `thedirectory`.

```file {title="delete_non_empty_directory.py" lang="python"}
import shutil

# Delete a non-empty directory called 'thedirectory'
shutil.rmtree('thedirectory')
```

The `shutil.rmtree()` can only be used on directories, not on symbolic links or other types of files. If you try to use `rmtree()` on a symbolic link, you get an error as shown below:

```file {title="rmtree_example.py" lang="python"}
import shutil

# Delete a symbolic link called 'thesymlink'
shutil.rmtree('thesymlink')
```

```output
NotADirectoryError: [Errno 20] Not a directory: 'thesymlink'
```

## File Path Pattern Matching In Shell and Python Using the “Glob” Module

The `glob` module in Python provides a way to match multiple files using a simple pattern-matching language. Following are some of the different members of the `glob` module:

- `glob.glob(path)`: This function returns a possibly empty list of pathnames that match the path argument. The path argument can contain the wildcard characters `*`, `?`, and `[]` to match multiple filenames. For example, `glob.glob('/usr/bin/*')` returns a list of all files in the `/usr/bin` directory.

- `glob.iglob(path)`: This function returns an iterator over the pathnames that match the path argument.

- `glob.escape(path)`: This function returns a version of the path where any wildcard characters (`*`, `?`, and `[]`) are escaped with a backslash (`\`).

For both the shells and the glob module, these characters have special meanings:

- The `*` pattern character matches any number of characters, including the null string
- The `?` pattern character matches one character
- The `[<set>]` pattern fragment matches any character in the string `<set>`: `[abc]` matches one character that is "`a`", "`b`", or "`c`"
- The `[!<set>]` pattern fragment machines any character not in the string `<set>`: `[!abc]` matches one character that is not "`a`", "`b`", or "`c`"
- "`[*]`", "`[[]`", and "`[]]`" matches the literal character "`*`", "`[`", and "`]`"

Python does not support the shell’s pattern-list forms "`?(<pattern-list>)`", "`*(<pattern-list>)`", "`+(<pattern-list>)`", and "`@(<pattern-list>)`". Some useful examples of supported patterns are listed below:

- "`*~`" match all files in the current directory that are editor backup files
- "`*.bak`" matches all files in the current directory that are Windows backup files
- "`*.[o]`" matches all files that are GCC output files.
- "`[*]`" matches all files that are one asterisk

For more unconventional forms of pattern matching for file paths, refer to the `glob` and `fnmatch` modules in the Python documentation and the "man 1 sh" command.
