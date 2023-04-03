---
slug: using-cobra
description: 'Cobra is a popular Go package that lets you develop command line utilities with commands, subcommands, and more. This guide shows how to use the app.'
keywords: ["go", "golang", "cobra", "programming", "cli"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-11-29
modified_by:
  name: Linode
title: 'Using Cobra and Go to Create Command Line Utilities'
external_resources:
  - '[Go](https://www.golang.com)'
  - '[Cobra](https://github.com/spf13/cobra)'
aliases: ['/development/go/using-cobra/']
authors: ["Mihalis Tsoukalos"]
---

## Before You Begin

You will need to install a recent version of Go on your computer in order to follow the presented commands. Any Go version newer than 1.7 will do but it is considered a good practice to have the latest version of Go installed. You can check your Go version
by executing `go version`.

If you still need to install Go, you can follow our guide for Ubuntu installation [here](/docs/guides/install-go-on-ubuntu/).

{{< note respectIndent=false >}}
This guide is written for a non-root user. Depending on your installation, some commands might require the help of `sudo` in order to get property executed. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Using the Cobra Go Package

Cobra is a very handy and popular Go package that allows you to develop command line utilities with commands, subcommands, aliases, configuration files, etc. If you have ever used `hugo`, `docker` or `kubectl` you will have some idea of what Cobra does as all of these tools were developed using Cobra as a part of their foundation.

This guide is going to implement four scenarios:

- A command line utility with first level commands only
- A command line utility with first and second level commands
- A command line utility with support for command line flags
- A command line utility with command aliases

## Installing Cobra

You must install Cobra before beginning – you can install it by executing the
following command:

    go get github.com/spf13/cobra/cobra

Cobra comes with its own command line utility named `cobra`, which is usually installed
in `~/go/bin/cobra`. Although it is possible to create command line utilities without
using the `cobra` utility, cobra helps to save time by reducing the overhead and complexity often required to execute these tasks.

If you wish to learn more about the commands supported by `cobra`, you should execute
`~/go/bin/cobra` without any command line parameters:

    ~/go/bin/cobra

{{< output >}}
Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.

Usage:
cobra [command]

Available Commands:
add         Add a command to a Cobra Application
help        Help about any command
init        Initialize a Cobra Application

Flags:
-a, --author string    author name for copyright attribution (default "YOUR NAME")
--config string    config file (default is $HOME/.cobra.yaml)
-h, --help             help for cobra
-l, --license string   name of license for the project
--viper            use Viper for configuration (default true)

Use "cobra [command] --help" for more information about a command.
{{< /output >}}

All Cobra projects follow the same development cycle. You first use the `cobra` tool to initialize
a project, then you create commands and subcommands, and finally you make the desired changes to the
generated Go source files in order to support the desired functionality.

{{< note respectIndent=false >}}
The `cobra init` command stores Cobra projects inside `~/go/src`, which means that
after executing `cobra init <project_name>` to create a new Cobra project, you will
need to change to the new directory.
{{< /note >}}

## A Utility With First Level Commands

In this section you will learn how to develop the skeleton of a simple command
line utility with three commands named `insert`, `delete`, and `list`.

### The Initial Structure

In order to create our first command line utility, which is going to be called `three`,
we will need to execute the following commands:

    ~/go/bin/cobra init three
    cd ~/go/src/three
    ~/go/bin/cobra add insert
    ~/go/bin/cobra add delete
    ~/go/bin/cobra add list

The `cobra add` command creates new commands along with the required files.

The directory structure and the files in the `three` directory can be seen from the
output of the `tree(1)` command:

    tree
{{< output >}}
.
├── LICENSE
├── cmd
│   ├── delete.go
│   ├── insert.go
│   ├── list.go
│   └── root.go
└── main.go

1 directory, 6 files
{{< /output >}}

{{< note respectIndent=false >}}
`Tree` is not installed by default on many distributions. You can install it manually using your package manager, or skip the steps that use it if you feel comfortable with your understanding of your directory structure. If you're using the `apt` package manager, tree can be installed with the following command:

    sudo apt install tree
{{< /note >}}

If you try to interact with `three` at this point, you will get the following kind of output:

    go run main.go insert
{{< output >}}
insert called
{{< /output >}}

    go run main.go delete
{{< output >}}
    delete called
{{< /output >}}

    go run main.go list
{{< output >}}
    list called
{{< /output >}}

    go run main.go doesNotExist
{{< output >}}
    Error: unknown command "doesNotExist" for "three"
    Run 'three --help' for usage.
    unknown command "doesNotExist" for "three"
    exit status 1
{{< /output >}}

Therefore, currently all desired commands are supported but have no functionality
because their implementation is minimal.

### Looking at the Go Code

The automatically generated implementation of the `delete` command can be found
at `./cmd/delete.go` and is currently as follows:

{{< file "./cmd/delete.go" go >}}
// Copyright © 2019 NAME HERE <EMAIL ADDRESS>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package cmd

import (
        "fmt"

        "github.com/spf13/cobra"
)

// deleteCmd represents the delete command
var deleteCmd = &cobra.Command{
        Use:   "delete",
        Short: "A brief description of your command",
        Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
        Run: func(cmd *cobra.Command, args []string) {
                fmt.Println("delete called")
        },
}

func init() {
        rootCmd.AddCommand(deleteCmd)

        // Here you will define your flags and configuration settings.

        // Cobra supports Persistent Flags which will work for this command
        // and all subcommands, e.g.:
        // deleteCmd.PersistentFlags().String("foo", "", "A help for foo")

        // Cobra supports local flags which will only run when this command
        // is called directly, e.g.:
        // deleteCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
{{< /file >}}

The actual implementation of the `delete` command is in the function defined in
the `Run` field of the `deleteCmd` structure variable.

The other two commands have similar implementations.

### Changing the Implementation of a Command

After making the desired changes and removing the code comments, the implementation of
the `delete` command will be as follows:

{{< file "./cmd/delete.go" go >}}
package cmd

import (
        "fmt"
        "github.com/spf13/cobra"
)

var deleteCmd = &cobra.Command{
        Use:   "delete",
        Short: "A brief description of your command",
        Long:  `A longer description for the delete command.`,
        Run: func(cmd *cobra.Command, args []string) {
                fmt.Println("This is the delete command!")
        },
}

func init() {
        rootCmd.AddCommand(deleteCmd)
}
{{< /file >}}

As the point of this guide is not to implement the commands but to illustrate the
use of Cobra, the implementation of the `delete` command will stop here.

You can experiment on your own by trying to change the default implementation of
the `insert` and `list` commands.

## A Utility With First and Second Level Commands

In this section you will learn how to add subcommands to existing commands – subcommands
are commands that are associated with specific commands only. In this case we are going
to implement the `all` subcommand for the `delete` and `list` commands of the utility
that we created in the previous section. The `insert` command does not need such a
functionality.

### The Initial Structure

Once again, our own utility will begin by using the `cobra` utility and executing the
following commands:

    ~/go/bin/cobra init three_all
    cd ~/go/src/three_all
    ~/go/bin/cobra add insert
    ~/go/bin/cobra add delete
    ~/go/bin/cobra add list

### Implementing a Subcommand

In this section we are going to add the `all` subcommand. In order to create the `all`
subcommand to the `delete` command you will need to execute the following:

    ~/go/bin/cobra add all -p 'deleteCmd'

In this case, you should use the internal representation of the `delete` command,
which is `deleteCmd`. The fact that `all` is a subcommand of `delete` is defined
inside the `init()` function of `./cmd/all.go` as follows:

{{< file "./cmd/all.go" go >}}
func init() {
        deleteCmd.AddCommand(allCmd)
}
{{< /file >}}

However, if you try to create the `all` subcommand for `list` you will get
the following error message:

    ~/go/bin/cobra add all -p 'listCmd'
{{< output >}}
        Error: /Users/mtsouk/go/src/three_all/cmd/all.go already exists
{{< /output >}}

There is a trick that can help you bypass that. You can rename the existing `./cmd/add.go` file
to whatever you want as long as it is unique. However, a rational filename would be
`./cmd/delete_all.go`:

    mv cmd/all.go cmd/delete_all.go

Now you can execute the following command without getting any error messages:

    ~/go/bin/cobra add all -p 'listCmd'

For everything to function correctly and to avoid conflicts in command names, you will need to
either change the name of the `all` subcommand in `./cmd/all.go` or in `./cmd/delete_all.go`.
In this case, the change will happen in `./cmd/delete_all.go`:

{{< file "./cmd/delete_all.go" go >}}
package cmd

import (
        "fmt"
        "github.com/spf13/cobra"
)

var delete_allCmd = &cobra.Command{
        Use:   "all",
        Short: "A brief description of your command",
        Long:  `The all subcommand of the delete command.`,
        Run: func(cmd *cobra.Command, args []string) {
                fmt.Println("all in delete was called!")
        },
}

func init() {
        deleteCmd.AddCommand(delete_allCmd)
}
{{< /file >}}

So the internal name of the `all` subcommand for `delete` is now `delete_allCmd`.

### Using Subcommands

In this subsection we are going to test the commands and subcommands that we
have created previously:

    go run main.go delete
{{< output >}}
delete called
{{< /output >}}

    go run main.go delete all
{{< output >}}
all in delete was called!
{{< /output >}}

    go run main.go list
{{< output >}}
list called
{{< /output >}}

    go run main.go list all
{{< output >}}
all called
{{< /output >}}

    go run main.go insert all
{{< output >}}
insert called
{{< /output >}}

    go run main.go insert
{{< output >}}
insert called
{{< /output >}}

The `all` subcommand is considered a command line argument to the `insert` command,
which is the reason that you get that output from `go run main.go insert all`.

### The Directory Structure of the Source Code

The `tree(1)` utility will reveal the directory structure of the final version
of the utility:

    tree
{{< output >}}
    .
    ├── LICENSE
    ├── cmd
    │   ├── all.go
    │   ├── delete.go
    │   ├── delete_all.go
    │   ├── insert.go
    │   ├── list.go
    │   └── root.go
    └── main.go

    1 directory, 8 files
{{< /output >}}

## A Utility With Command Line Flags

This time we are going to create a command line utility with a global flag and
a flag that is connected to a specific command only.

### The Initial Structure

We are going to create the initial version of the utility, which is called `my_flags`,
as follows:

    ~/go/bin/cobra init my_flags
    cd ~/go/src/my_flags
    ~/go/bin/cobra add count
    ~/go/bin/cobra add version

### Implementing Flags

The general idea here is that global flags are defined in `./cmd/root.go` whereas
flags associated with specific commands are defined and handled inside the implementation
files of these commands.

In order to create a new global flag that accepts an integer parameter, we are going to
make changes to `./cmd/root.go`. The final version of `./cmd/root.go` will be the following:

{{< file "./cmd/root.go" go >}}
package cmd

import (
        "fmt"
        "github.com/spf13/cobra"
        "os"
)

var developer string

var rootCmd = &cobra.Command{
        Use:   "my_flags",
        Short: "A brief description of your application",
        Long:  `A longer description.`,
}

func Execute() {
        if err := rootCmd.Execute(); err != nil {
                fmt.Println(err)
                os.Exit(1)
        }
}

func init() {
        cobra.OnInitialize(initConfig)
        rootCmd.PersistentFlags().StringVar(&developer, "developer", "Unknown Developer!", "Developer name.")
}

func initConfig() {
        developer, _ := rootCmd.Flags().GetString("developer")
        if developer != "" {
                fmt.Println("Developer:", developer)
        }
}
{{< /file >}}

The name of the global command line flag is `developer`, created in the `init()` function and accessed in the `initConfig()` function. However, `developer` can also be accessed from
the other Go source files of the utility. The default value of `developer` is `Unknown Developer!`.

In order to add a flag to the `count` command we will need to change the `./cmd/count.go`
file – its final version will be as follows:

{{< file "./cmd/count.go" go >}}
package cmd

import (
        "fmt"

        "github.com/spf13/cobra"
)

var countCmd = &cobra.Command{
        Use:   "count",
        Short: "A brief description of your command",
        Long:  `A longer description of count command.`,
        Run: func(cmd *cobra.Command, args []string) {
                fmt.Println("count called")
                number, _ := cmd.Flags().GetInt("number")
                for i := 0; i < number; i++ {
                        fmt.Print(i, " ")
                }
                fmt.Println()

                developer, _ := rootCmd.Flags().GetString("developer")
                if developer != "" {
                        fmt.Println("From count command - Developer:", developer)
                }
        },
}

func init() {
        rootCmd.AddCommand(countCmd)
        countCmd.Flags().Int("number", 10, "A help for number")
}
{{< /file >}}

The name of the local command line flag that is associated with the `count` command is `number`. It is created in the `init()` function and is accessed in the implementation of the `count` command.
The `count` flag has a default value of `10`.

In the previous code you can also see how to access the `developer` flag that was defined in
`./cmd/root.go`.

### Testing the Utility

In this subsection we are going to test the implementation of flags in the `my_flags` utility:

    go run main.go
{{< output >}}
        A longer description.

        Usage:
          my_flags [command]

        Available Commands:
          count       A brief description of your command
          help        Help about any command
          version     A brief description of your command

        Flags:
              --developer string   Developer name. (default "Unknown Developer!")
          -h, --help               help for my_flags

        Use "my_flags [command] --help" for more information about a command.
{{< /output >}}

    go run main.go count
{{< output >}}
        Developer: Unknown Developer!
        count called
        0 1 2 3 4 5 6 7 8 9
        From count command - Developer: Unknown Developer!
{{< /output >}}

    go run main.go count --number 15
{{< output >}}
        Developer: Unknown Developer!
        count called

        0 1 2 3 4 5 6 7 8 9 10 11 12 13 14
        From count command - Developer: Unknown Developer!
{{< /output >}}

    go run main.go count --number 15 --developer "Mihalis Tsoukalos"
{{< output >}}
        Developer: Mihalis Tsoukalos
        count called
        0 1 2 3 4 5 6 7 8 9 10 11 12 13 14
        From count command - Developer: Mihalis Tsoukalos
{{< /output >}}

    go run main.go version
{{< output >}}
        Developer: Unknown Developer!
        version called
{{< /output >}}

    go run main.go version --developer "Mihalis Tsoukalos"
{{< output >}}
        Developer: Mihalis Tsoukalos
        version called
{{< /output >}}

    go run main.go version --count 20
{{< output >}}
        Error: unknown flag: --count
        Usage:
          my_flags version [flags]

        Flags:
          -h, --help   help for version

        Global Flags:
              --developer string   Developer name. (default "Unknown Developer!")

        unknown flag: --count
        exit status 1
{{< /output >}}

### The Directory Structure of the Source Code

The `tree(1)` utility will reveal the directory structure of the final version
of the utility:

    tree
{{< output >}}
        .
        ├── LICENSE
        ├── cmd
        │   ├── count.go
        │   ├── root.go
        │   └── version.go
        └── main.go

        1 directory, 5 files
{{< /output >}}

## Creating Command Aliases

In this last section of this guide we are going to create a utility where some of
its commands have aliases. This is extremely handy when you want to call long commands
using shorter names.

### The Initial Structure

As expected, the initial version of the utility, which is going to be called `my_aliases`,
will be created using the `cobra` utility:

    ~/go/bin/cobra init my_aliases
    cd ~/go/src/my_aliases
    ~/go/bin/cobra add delete
    ~/go/bin/cobra add version

### Implementing the Aliases of a Command

We are going to implement aliases for the `delete` command only. The final implementation
of the `delete` command, as found in `./cmd/delete.go`, will be as follows:

{{< file "./cmd/delete.go" go >}}
package cmd

import (
        "fmt"

        "github.com/spf13/cobra"
)

var deleteCmd = &cobra.Command{
        Use:     "delete",
        Aliases: []string{"del", "dlt"},
        Short:   "A brief description of your command",
        Long:    `A longer description of the delete command.`,
        Run: func(cmd *cobra.Command, args []string) {
                fmt.Println("delete called")
        },
}

func init() {
        rootCmd.AddCommand(deleteCmd)
}
{{< /file >}}

A single Go statement is needed for defining the two aliases of the `delete` command
– this is the line that begins with `Aliases`, which is a String slice. You can add as
many values as you wish to that String slice.

### Testing Command Aliases

If everything is correct, the following three commands will be equivalent
and generate the same output:

    go run main.go delete
{{< output >}}
    delete called
{{< /output >}}

    go run main.go dlt
{{< output >}}
    delete called
{{< /output >}}

    go run main.go del
{{< output >}}
    delete called
{{< /output >}}

{{< note respectIndent=false >}}
Although all three aliases are equivalent and execute the same code, the
internal representation of the `delete` command is only defined by `deleteCmd`.
{{< /note >}}
