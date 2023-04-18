---
slug: using-jq-to-process-json-on-the-command-line
description: 'This guide shows you how to use the JQ command and includes installation instructions and examples.'
keywords: ['jq command','linux jq','jq examples','jq filter']
tags: ['linux', 'debian', 'ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-05
modified_by:
  name: Linode
title: "Using the JQ Command to Process JSON on the Command Line"
title_meta: "How to Use JQ to Process JSON on the Command Line"
external_resources:
- '[The jq GitHub page](https://github.com/stedolan/jq)'
authors: ["Jeff Novotny"]
---

[*jq*](https://github.com/stedolan/jq) is a free open source [JSON](https://www.json.org/json-en.html) processor that is flexible and straightforward to use. It allows users to display a JSON file using standard formatting, or to retrieve certain records or attribute-value pairs from it. It features a powerful set of filters and functions that can manipulate, analyze and transform JSON data. Because this tool is advanced, it is important to become familiar with how JQ works before implementing it. This JQ tutorial introduces the jq application, explains how to install and use it, and shows JQ examples in order to understand its functionality. Continue reading to learn all about how to use jg!

## An Introduction to JSON and jq

jq is used to process *JavaScript Object Notation* (JSON) data. JSON has become one of the most widely used standards for exchanging data due to its flexibility and intuitive, human-readable structure. JSON is derived from JavaScript and is designed as an open standard to be both language-independent and self-describing. This makes it a useful mechanism for data exchange, especially between web applications and servers. The data in a JSON file can usually be understood even without an API. All JSON files have the file extension `.json`.

JSON files share a common format. Here are some highlights of the JSON specification.

- Lists are enclosed in square brackets `[]`, and curly brackets `{}` delimit objects.
- Objects are associative arrays in which each key must be unique.
- JSON files typically consist of an open-ended number of attribute-value pairs and arrays.
- The key and value are separated with a `:` character, while each key-value pair is separated by a comma.
- JSON supports most basic data types, including number, string, boolean, array, and object.
- All strings must be enclosed in quotes.

JSON lacks error handling and is not completely secure from hostile services or users. Due to its origins as an open standard, it has limited official support. Below is an example of a sample JSON file, which is taken from the official JSON site.

{{< file "menu.json" json >}}
{"menu": {
  "id": "file",
  "value": "File",
  "popup": {
    "menuitem": [
      {"value": "New", "onclick": "CreateNewDoc()"},
      {"value": "Open", "onclick": "OpenDoc()"},
      {"value": "Close", "onclick": "CloseDoc()"}
    ]
  }
}}
{{< /file >}}

jq was developed specifically to address the need for a JSON processor. Traditionally, there were few good tools for working with JSON data. Users had to rely on `grep`, `sed`, and other Linux commands, or write their own functions. jq is available for most systems and can be installed using a variety of package managers or directly as a binary. It is written in the C programming language and is completely portable to other systems, with no runtime dependencies.

jq is a lightweight, flexible, command-line JSON processor that can slice, filter, and transform the components of a JSON file. Many users rely on jq to properly format JSON files because it always displays JSON information in a "pretty" format. jq aligns brackets, applies proper spacing and indentation rules, and displays each property on its own line.

A large number of built-in functions are used to extract certain values or array entries. jq greatly simplifies array processing because it can iterate through an entire array and display a particular entry. Standard mathematical and logical operators allow users to parse a file for entries satisfying a boolean expression.

jq uses a piping mechanism to chain filters together and constructs complex data transformations. It can be integrated with other programs or processes. For example, it can receive input from the terminal and send its output to another Linux utility, such as `find`.

jq is well documented. Here are some of the available resources.

- There is a [full language description](https://github.com/stedolan/jq/wiki/jq-Language-Description) on the jq GitHub page.
- Additional resources include a [jq user manual](https://stedolan.github.io/jq/manual/) and a [tutorial](https://stedolan.github.io/jq/tutorial/).
- The jq site features a [cookbook](https://github.com/stedolan/jq/wiki/Cookbook) showing how jq can be used for complex tasks, such as recursively deleting elements from objects.

## A Comparison Between jq and sed

jq is often compared to the standard Linux `sed` command. Both commands are useful for parsing, filtering, and transforming text. However, there are significant differences between the two applications. Here is an analysis of the similarities and differences between the applications and their relative strengths.

- jq expects JSON data and is not used with other types of data. `sed` can process a variety of text-based file formats.
- `sed` expects to receive lines of data separated by new lines. It reads text line by line and re-evaluates the script each time. It is not designed for structured data and does not interpret nested braces properly. jq is specifically designed for JSON files and can understand all JSON formatting conventions.
- `sed` is most commonly used for search-and-replace tasks and reformatting plain text. It is somewhat simple and limited in what it can do. jq can be used for a wider range of tasks, such as evaluating data against boolean expressions.
- It is easier to perform simple text substitution tasks using `sed` because its purpose is built for this task. If complex substitutions are required, `sed` is a better choice.
- Both `sed` and jq use regular expressions. However, `sed` always treats text as a regular expression. Options are used to control this behavior in jq.
- `sed` allows simple programming options, such as `q` to quit, and it is sometimes used for scripting. jq has a larger number of built-in functions but is not typically used to write general-purpose scripts.
- `sed` is available on most operating systems. jq is a more specialized program. It is user-installed and is not widely available on most systems.
- `grep` or `head` are often better choices than either application for very simple tasks such as searching for a specific term.

To summarize, jq is used to process JSON files. The `sed` utility is a better choice for other text files or straightforward text substitutions.

## How to Install jq

jq can be installed through a variety of methods. On many Linux systems, it can be installed using the default package manager. It can also be installed using third-party package managers including Homebrew and Zero Install or downloaded as a binary. The [*jq installation page on GitHub*](https://github.com/stedolan/jq/wiki/Installation) contains instructions on how to build jq from the source. It also explains how to use Docker to install jq, along with instructions for Windows and macOS.

### Install jq with Package Managers

jq is available as part of the default repositories in Debian, Ubuntu, Fedora, and several other distributions.

On **Ubuntu** and **Debian**, install jq using the following command:

    sudo apt-get install jq

On **Fedora** systems, use the following command to install jq:

    sudo dnf install jq

For other Linux distributions, see the [jq Downloads page](https://stedolan.github.io/jq/download/).

The [Homebrew package manager](https://brew.sh/) can also be used to install jq. If Homebrew is not installed on your system, install it using the command `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"` and follow all instructions. See the Homebrew home page for more information. Once Homebrew is downloaded, install jq using the command `brew install jq`.

The [Zero Install](https://0install.net/) package manager also supports jq. To install jq using Zero Install, follow the steps below:

1. Download the Zero Install script.

        curl -O <https://get.0install.net/0install.sh> && chmod +x 0install.sh

1. Install Zero Install using the shell script.

        sudo ./0install.sh install local

1. Install jq using Zero Install.

        0install add jq <https://apps.0install.net/utils/jq.xml>

To verify jq is correctly installed, use the command `jq --version`. This displays release information for the installation.

    jq --version

{{< output >}}
jq-1.6
{{< /output >}}

### Install jq Manually

To install jq manually, follow these instructions.

1. Download the binary from the [jq Downloads page](https://stedolan.github.io/jq/download/).
1. Transfer the file to the Linode using `scp` or another method.
1. Copy the application to a folder that is included in the `$PATH` variable, such as `/usr/local/bin`, or append the install directory to the `$PATH` variable. The application is ready to run, and no further installation is required.
1. If the system displays a permissions error when running a `jq` command, change the permissions using `chmod +x jq`.

## How to Use jq

It is fairly easy to use jq to perform basic operations on JSON files. However, some of the techniques for transforming and reformatting data can be complex. It is often easiest to try jq out on a sample JSON file first. There are plenty of examples on the [JSON website](https://json.org/example.html) that are guaranteed to be correctly formatted.

### How to ‘Pretty Print’ JSON Files

A commonly-used jq command is the "prettify" function. This operation takes a JSON file and formats it into easy-to-read output, with proper line spacing, standard indentation, and perfectly aligned braces. To prettify a JSON file, use the `jq '.'` command. The `.` symbol is known as the *identity* command. It takes any input and reproduces it in standard JSON formatting. You can pipe JSON-formatted input to this command, or specify an input file as an argument.

The following command pipes a JSON message to the `prettify` command using the `echo` command. The output of the `echo` command serves as input for the `jq` command.

    echo '{"menu": { "id": "file", "value": "File", "popup": { "menuitem": [ {"value": "New", "onclick": "CreateNewDoc()"}, {"value": "Open", "onclick": "OpenDoc()"} ] } } }' | jq '.'

{{< output >}}
{
  "menu": {
    "id": "file",
    "value": "File",
    "popup": {
      "menuitem": [
        {
          "value": "New",
          "onclick": "CreateNewDoc()"
        },
        {
          "value": "Open",
          "onclick": "OpenDoc()"
        }
      ]
    }
  }
}
{{< /output >}}

jq input can be retrieved using `curl` from any website with a JSON API. The following command retrieves the page views for the "Talking Heads Discography" Wikipedia page over a period of three days. Once again, the output is displayed in "pretty" format because the `.` operator automatically formats the data as required.

    curl 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/Talking_Heads_discography/daily/20210928/20210930' | jq '.'

{{< output >}}
{
  "items": [
    {
      "project": "en.wikipedia",
      "article": "Talking_Heads_discography",
      "granularity": "daily",
      "timestamp": "2021092800",
      "access": "all-access",
      "agent": "all-agents",
      "views": 381
    },
    {
      "project": "en.wikipedia",
      "article": "Talking_Heads_discography",
      "granularity": "daily",
      "timestamp": "2021092900",
      "access": "all-access",
      "agent": "all-agents",
      "views": 419
    },
    {
      "project": "en.wikipedia",
      "article": "Talking_Heads_discography",
      "granularity": "daily",
      "timestamp": "2021093000",
      "access": "all-access",
      "agent": "all-agents",
      "views": 408
    }
  ]
}
{{< /output >}}

Finally, `jq` can process the contents of a local JSON file. Specify the name of the file as the final argument to the command. The `|` operator is not required in this case.

    jq '.' menu.json
{{< output >}}
{
  "menu": {
    "id": "file",
    "value": "File",
    "popup": {
      "menuitem": [
        {
          "value": "New",
          "onclick": "CreateNewDoc()"
        },
        {
          "value": "Open",
          "onclick": "OpenDoc()"
        },
        {
          "value": "Close",
          "onclick": "CloseDoc()"
        }
      ]
    }
  }
}
{{< /output >}}

### How to Use Filters with jq

The jq application provides a way of filtering out certain properties or array items from within the file.

To access a particular property within a JSON record, use the `.field` operator. Type the `.` character followed by the name of a field or object to access its value. The following command displays the values inside the `menu` object. All values, including nested fields and arrays, are displayed.

{{< note respectIndent=false >}}
From this point on, all examples use a local JSON file. However, the output can be piped to `jq` from `curl` or any other process in any of these examples.
{{< /note >}}

    jq '.menu' menu.json
{{< output >}}
{
  "id": "file",
  "value": "File",
  "popup": {
    "menuitem": [
      {
        "value": "New",
        "onclick": "CreateNewDoc()"
      },
      {
        "value": "Open",
        "onclick": "OpenDoc()"
      },
      {
        "value": "Close",
        "onclick": "CloseDoc()"
      }
    ]
  }
}
{{< /output >}}

To access a nested property, use the full name of the property. Chain together the names of all parent properties and the name of the property to access its value. The following example demonstrates how to access the value of the `menu.id` property.

    jq '.menu.id' menu.json
{{< output >}}
"file"
{{< /output >}}

Multiple items can be displayed using the same `jq` command. Separate the items with a comma, and enclose the whole list in quotes.

    jq '.menu.id, .menu.value' menu.json

{{< output >}}
"file"
"File"
{{< /output >}}

### How to Process Arrays with jq

jq processes arrays using the `[]` operator. This operator iterates over each item in a list and prints it.

    echo '[ {"value": "New", "onclick": "CreateNewDoc()"}, {"value": "Open", "onclick": "OpenDoc()"} ]' | jq '.[]'
{{< output >}}
{
  "value": "New",
  "onclick": "CreateNewDoc()"
}
{
  "value": "Open",
  "onclick": "OpenDoc()"
}
{{< /output >}}

To simplify certain array-processing instructions, the file `submenu.json` is sometimes used in this section.

{{< file "submenu.json" json >}}
[
  {"value": "New", "onclick": "CreateNewDoc()", "priority": 20},
  {"value": "Open", "onclick": "OpenDoc()", "priority": 17},
  {"value": "Close", "onclick": "CloseDoc()"}
]
{{< /file >}}

The output of the `[]` operator is similar to the basic `jq '.'` output because the `.` operator automatically iterates through any arrays it encounters. However, the `[]` operator can be extended to display the value of a specific field for each item in the array. Follow the `[]` operator with the `.` operator and the name of the property inside the array item. To display only the `value` field from each entry in the array, use `jq '.[].value'`. The `|` operator can also be used to pipe the contents of the array to the `field` operator, for example, `jq '.[] | .value'`.

    jq '.[].value' submenu.json
{{< output >}}
"New"
"Open"
"Close"
{{< /output >}}

To view a specific entry within an array, specify the index of the item within the `[]` operator. The notation is zero-based, so `[0]` refers to the first item of the array. The following command displays the second item of the array, which is item `[1]`.

    jq '.[1]' submenu.json

{{< output >}}
{
  "value": "Open",
  "onclick": "OpenDoc()",
  "priority": 17
}
{{< /output >}}

To access an array nested deeper within a JSON file, first use the `field` operator to extract the array object. Pipe the result to the `[]` operator.

    jq '.menu.popup.menuitem | .[1]' menu.json

{{< output >}}
{
  "value": "Open",
  "onclick": "OpenDoc()",
}
{{< /output >}}

An array can also be "sliced" to show only a portion of it. Within the `[]` operator, specify the first and last entry to display, separated by a `:`. The first number is inclusive, while the second is exclusive. To display the first two items of an array, use the notation `[0:2]`.

    jq '.[0:2]' submenu.json

{{< output >}}
[
  {
    "value": "New",
    "onclick": "CreateNewDoc()",
    "priority": 20
  },
  {
    "value": "Open",
    "onclick": "OpenDoc()",
    "priority": 17
  }
]
{{< /output >}}

### How to Use Built-in Operators and Functions with jq

jq has an extensive collection of functions that can be applied to either an array or a key-value pair. These functions can determine the length of an array, a maximum value, and whether a value exists.

The `length` function displays the length of an array. It is also used to determine the length of a string. The following example determines the number of items in the `menu.popup.menuitem` array. The object is extracted and piped through to the `length` function.

    jq '.menu.popup.menuitem | length' menu.json

{{< output >}}
3
{{< /output >}}

The following example determines the string length of the value of `menu.id`.

    jq '.menu.id | length' menu.json

{{< output >}}
4
{{< /output >}}

The `max` and `min` values are used to determine the maximum and minimum values of a field in an array. To use this function, the list of values must be presented as an array. In the following example, the inner `[]` operator refers to the pre-existing array object. The value of the `priority` field is extracted from each item of the array. The outer `[]` operator converts this output back into another array. The new array can now serve as input for the `max` function.

    jq '[.[].priority] | max' submenu.json

{{< output >}}
20
{{< /output >}}

To see the keys for each value in an array, use the `keys` function. The following function displays the name of each property inside the `menu` object, packaged as an array.

    jq '.menu | keys' menu.json

{{< output >}}
[
  "id",
  "popup",
  "value"
]
{{< /output >}}

The `has` function determines whether an array item has a value defined for a given key. The output of `has` is fed into the `map` command. This transforms the list of values into a new array. In this example, the first two entries in the array have a key named `priority`, while the third does not. Therefore, the `has` function returns `true` for the first two iterations and `false` on the third.

    jq 'map(has("priority"))' submenu.json

{{< output >}}
[
  true,
  true,
  false
]
{{< /output >}}

The `map` function is also used to determine how many unique values there are for a given key in an array. Use `map` to create a new array based on all values for the key in the array and pass this to the `unique` filter. The `unique` filter removes all duplicate values.

    jq 'map(.onclick) | unique' submenu.json

{{< output >}}
[
  "CloseDoc()",
  "CreateNewDoc()",
  "OpenDoc()"
]
{{< /output >}}

### How to Use Logic with jq (Conditionals and Comparisons)

jq's `select` operator is used to filter out items within an array. Only items where the value satisfies a given condition or matches a comparison are displayed. The `[]` operator is first used to iterate over all items in the array. Each item is then tested against the condition. All standard logical and mathematical operators, such as `>`, `<`, and `==`, standing for equivalence, are available.

The following example demonstrates how to perform a mathematical comparison. The `select` filter returns all entries where the value of `priority` is greater than `18`.

    jq '.[] | select(.priority>18)' submenu.json

{{< output >}}
{
  "value": "New",
  "onclick": "CreateNewDoc()",
  "priority": 20
}
{{< /output >}}

Conditions can be combined. The next example demonstrates how the `or` keyword is used to match a key against one of two values. The `value` property matches the condition if it is either `Open` or `Close`. If both conditions must be true, the `and` keyword must be used instead.

    jq '.[] | select(.value=="Close" or .value=="Open")' submenu.json

{{< output >}}
{
  "value": "Open",
  "onclick": "OpenDoc()",
  "priority": 17
}
{
  "value": "Close",
  "onclick": "CloseDoc()"
}
{{< /output >}}

### Regular Expressions

The `select` function is used in conjunction with the `test` function to harness the power of regular expressions. The `test` function evaluates each value for a given key against the regular expression and returns a boolean value. The `select` function displays only the matching values. In this example, `select(.onclick|test("^O."))` shows the array entries where the value of `onclick` begins with a `O`.

    jq '.[] | select(.onclick|test("^O."))' submenu.json

{{< output >}}
{
  "value": "Open",
  "onclick": "OpenDoc()",
  "priority": 17
}
{{< /output >}}

### How to Use jq to Transform Data

jq can also manipulate data within an array. For example, it can remove an array item or perform mathematical operations on a numerical field. Operations can even be chained together to form highly-complex transformations. The output of these operations can be saved as another file or analyzed in place.

The following example removes the `priority` field from the output for each record in the array. This operation only affects the display output, not the contents of the original JSON file.

    jq '.[] | del(.priority)' submenu.json
{{< output >}}
[
  {
    "value": "New",
    "onclick": "CreateNewDoc()",
  },
  {
    "value": "Open",
    "onclick": "OpenDoc()",
  },
  {
    "value": "Close",
    "onclick": "CloseDoc()"
  }
]
{{< /output >}}

This example adds `2` to each value of `priority` in the array and displays the new values as a list. The third value was previously `NULL`, but it is incremented to `2` after the transformation.

     jq  .'[] | .priority+ 2' submenu.json

{{< output >}}
22
19
2
{{< /output >}}

The `map` function can output the same information as an array.

    jq  'map(.priority+ 2)' submenu.json

{{< output >}}
[
  22,
  19,
  2
]
{{< /output >}}

## Conclusion

jq is a handy and lightweight open-source utility designed to display, filter, process, and transform the contents of JSON files. It is particularly useful for iterating through JSON array objects. jq is easy to install and is often part of the default package on many systems. It can also be installed using a package manager.

jq is frequently used to display the contents of JSON files in a nicely-formatted manner. However, it can also filter the file contents to display only certain values and iterate through all items in an array. It features support for comparisons, conditional, and regular expressions, along with some functions for transforming data. jq is thoroughly documented. See the [jq GitHub page](https://github.com/stedolan/jq) for more information, including a language description and installation instructions for all systems. Start using the jq command today!
