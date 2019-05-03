---
author: Mihalis Tsoukalos
  name: Linode Community
  email: mihalistsoukalos@gmail.com
description: 'Using Cobra to create powerful command line utilities in Go.'
keywords: ["go", "golang", "cobra", "programming", "cli"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-11-29
modified_by:
  name: Linode
title: 'Guide Title'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[Go](https://www.golang.com)'
  - '[Cobra](https://github.com/spf13/cobra)'
---

## Before You Begin

You will need to have a recent version of Go installed on your computer in order
to follow the presented commands. Any Go version newer than 1.7 will do but it is considered a
good practice to have the latest version of Go installed. You can check your Go version
by executing `go version`.

{{< note >}}
This guide is written for a non-root user. Depending on your installation, some commands might require the help of `sudo` in order to get property executed. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Using the Cobra Go package

Cobra is a very handy and popular Go package that allows you to develop command line utilities with commands, subcommands, aliases, configuration files, etc. If you have ever used `hugo`, `docker` or `kubectl` you will understand immediately what Cobra does as all these tools where developed using Cobra.

This guide is going to implement four scenarios:

- A command line utility with first level commands only
- A command line utility with first and second level commands
- A command line utility with support for command line flags
- A command line utility with command aliases

## Installing Cobra

It is required that you install Cobra – you can install it by executing the
following command:

    $ go get github.com/spf13/cobra/cobra

Cobra comes with its own command line utility named `cobra`, which is usually installed
on `~/go/bin/cobra`. Although it is possible to create command line utilities without
using the `cobra` utility, it would really take more time and effort to do so.

Should you wish to learn more about the commands supported by `cobra`, you should execute
`~/go/bin/cobra` without any command line parameters:

        $ ~/go/bin/cobra
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

All Cobra projects follow the same development cycle. You first use the `cobra` tool to initialize
a project, then you create commands and subcommands and then you make the desired changes to the
generated Go source files in order to support the desired functionality.

{{< note >}}
The `cobra init` command stores Cobra projects inside `~/go/src`, which means that
after executing `cobra init <project_name>` to create a new Cobra project, you will
need to change to the new directory.
{{< /note >}}

## A utility with first level commands

In this section you will learn how to develop the skeleton of a simple command
line utility with three commands, named `insert`, `delete` and `list`.

### The initial structure

So, in order to create our first command line utility, which is going to be called `three`,
we will need to execute the following commands:

    $ ~/go/bin/cobra init three
        $ cd ~/go/src/three
        $ ~/go/bin/cobra add insert
        $ ~/go/bin/cobra add delete
        $ ~/go/bin/cobra add list

The `cobra add` command creates new commands along with the required files.

The directory structure and the files in the `three` directory can be seen from the
output of the `tree(1)` command:

    $ tree
    .
    ├── LICENSE
    ├── cmd
    │   ├── delete.go
    │   ├── insert.go
    │   ├── list.go
    │   └── root.go
    └── main.go

    1 directory, 6 files

If you try to interact with `three` at this point, you will get the following kind of output:

    $ go run main.go insert
    insert called
        $ go run main.go delete
    delete called
        $ go run main.go list
    list called
        $ go run main.go doesNotExist
    Error: unknown command "doesNotExist" for "three"
    Run 'three --help' for usage.
    unknown command "doesNotExist" for "three"
    exit status 1

Therefore, currently all desired commands are supported but have no functionality
because their implementation is minimal.

### Looking at the Go code

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

### Changing the implementation of a command

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

## A utility with first and second level commands

In this section you will learn how to add subcommands to existing commands – subcommands
are commands that are associated with specific commands only. In this case we are going
to implement the `all` subcommand for the `delete` and `list` commands of the utility
that we created in the previous section. The `insert` command does not need such as a
functionality.

### The initial structure

Once again, our own utility will begin by using the `cobra` utility and executing the
following commands:

    $ ~/go/bin/cobra init three_all
        $ cd ~/go/src/three_all
        $ ~/go/bin/cobra add insert
        $ ~/go/bin/cobra add delete
        $ ~/go/bin/cobra add list

### Implementing a subcommand

In this part we are going to add the `all` subcommand. In order to create the `all`
subcommand for the `delete` command you will need to execute the following:

    $ ~/go/bin/cobra add all -p 'deleteCmd'

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

        $ ~/go/bin/cobra add all -p 'listCmd'
        Error: /Users/mtsouk/go/src/three_all/cmd/all.go already exists

There is a trick that can help you bypass that. You can rename the existing `./cmd/add.go` file
to whatever you want as long as it is unique. However, a rational filename would be
`./cmd/delete_all.go`:

    $ mv cmd/all.go cmd/delete_all.go

Now, you can execute the following command without getting any error messages:

    $ ~/go/bin/cobra add all -p 'listCmd'

For everything to be correct and avoid conflicts in command names, you will need to
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

### Using subcommands

In this subsection we are going to test the commands and subcommands that we
have created previously:

    $ go run main.go delete
    delete called
        $ go run main.go delete all
        all in delete was called!
        $ go run main.go list
    list called
        $ go run main.go list all
    all called
        $ go run main.go insert all
    insert called
        $ go run main.go insert
    insert called

The `all` subcommand is considered a command line argument to the `insert` command,
which is the reason that you get that output from `go run main.go insert all`.

### The directory structure of the source code

The `tree(1)` utility will reveal the directory structure of the final version
of the utility:

    $ tree
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

## A utility with command line flags

This time, we are going to create a command line utility with a global flag and
a flag that is connected to a specific command only.

### The initial structure

We are going to create the initial version of the utility, which is called `my_flags`,
as follows:

    $ ~/go/bin/cobra init my_flags
        $ cd ~/go/src/my_flags
        $ ~/go/bin/cobra add count
        $ ~/go/bin/cobra add version

### Implementing flags

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

The name of the global command line flag is `developer`, is created in the `init()` function and
is accessed in the `initConfig()` function. However, `developer` can also be accessed from
the other Go source files of the utility. The default value of `developer` is `Unknown Developer!`.

In order to add a flag to the `count` command, we will need to change the `./cmd/count.go`
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

The name of the local command line flag that is associated with the `count` command is `number`,
is created in the `init()` function and is accessed in the implementation of the `count` command.
The `count` flag has a default value of `10`.

In the previous code you can also see how to access the `developer` flag that was defined in
`./cmd/root.go`.

### Testing the utility

In this subsection we are going to test the implementation of flags in the `my_flags` utility:

    $ go run main.go
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
        $ go run main.go count
        Developer: Unknown Developer!
        count called
        0 1 2 3 4 5 6 7 8 9
        From count command - Developer: Unknown Developer!
        $ go run main.go count --number 15
        Developer: Unknown Developer!
        count called
        0 1 2 3 4 5 6 7 8 9 10 11 12 13 14
        From count command - Developer: Unknown Developer!
        $ go run main.go count --number 15 --developer "Mihalis Tsoukalos"
        Developer: Mihalis Tsoukalos
        count called
        0 1 2 3 4 5 6 7 8 9 10 11 12 13 14
        From count command - Developer: Mihalis Tsoukalos
        $ go run main.go version
        Developer: Unknown Developer!
        version called
        $ go run main.go version --developer "Mihalis Tsoukalos"
        Developer: Mihalis Tsoukalos
        version called
        $ go run main.go version --count 20
        Error: unknown flag: --count
        Usage:
          my_flags version [flags]

        Flags:
          -h, --help   help for version

        Global Flags:
              --developer string   Developer name. (default "Unknown Developer!")

        unknown flag: --count
        exit status 1

### The directory structure of the source code

The `tree(1)` utility will reveal the directory structure of the final version
of the utility:

    $ tree
        .
        ├── LICENSE
        ├── cmd
        │   ├── count.go
        │   ├── root.go
        │   └── version.go
        └── main.go

        1 directory, 5 files

## Creating command aliases

In this last section of this guide, we are going to create a utility where some of
its commands have aliases. This is extremely handy when you want to call long commands
using shorter names.

### The initial structure

As expected, the initial version of the utility, which is going to be called `my_aliases`,
will be created using the `cobra` utility:

    $ ~/go/bin/cobra init my_aliases
        $ cd ~/go/src/my_aliases
        $ ~/go/bin/cobra add delete
        $ ~/go/bin/cobra add version

### Implementing the aliases of a command

We are going to implement aliases for the `delete` command only. The final implementation
of the `delete` command as found in `./cmd/delete.go` will be as follows:

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

### Testing command aliases

If everything is correct, the following three commands will be equivalent
and generate the same output:

    $ go run main.go delete
    delete called
        $ go run main.go dlt
    delete called
        $ go run main.go del
    delete called

{{< note >}}
Although all three aliases are equivalent and execute the same code, the
internal representation of the `delete` command is only defined by `deleteCmd`.
{{< /note >}}
