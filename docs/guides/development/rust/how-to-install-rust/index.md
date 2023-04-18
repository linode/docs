---
slug: how-to-install-rust
description: "This guide explains how to install Rust on Ubuntu 20.04. We'll also teach you about Cargo, Rust's build tool and package manager."
keywords: ['Rust','programming language','installation']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-07
image: RUST1.jpg
modified_by:
  name: Linode
tags: ["rust", "development", "ubuntu"]
title: "Installing and Using Rust"
title_meta: "How to Install and Use Rust"
external_resources:
- '[Rust Programming Language](https://www.rust-lang.org/)'
authors: ["Jeff Novotny"]
---

This guide explains how to install [*Rust*](https://www.rust-lang.org/), a popular programming language designed to maximize performance and safety. It also discusses how to create, compile, and run a simple Rust project. Rust is somewhat similar to C++, although it is able to guarantee memory and thread safety. Rust was originally developed for use at Mozilla Research, but it has recently gained in popularity throughout the software industry. For many years now, Rust has been rated one of the top programming languages in industry surveys.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. For information about the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Advantages of the Rust Programming Language

Rust runs as quickly as C++ does, but is safer to use. This is because it emphasizes memory and thread safety through the use of a borrow checker and reference validation. Unlike many memory-safe languages, Rust does not use a garbage collector, which means it is relatively memory efficient. Rust allows direct access to the hardware layer and control over the memory layout. This makes it a good choice for embedded systems. It is suitable for highly concurrent systems and for applications requiring large-system integrity. Rust includes a library that allows for calls to, or from, C++ with very little overhead.

## Installing Rust

The typical, and most straightforward, way to install Rust is by using `rustup`. This is Rust's main installation program and version manager. These instructions are designed for Ubuntu, but are generally applicable to most Linux distributions.

{{< note respectIndent=false >}}
To experiment with Rust before downloading it, try the [*Rust Playground*](https://play.rust-lang.org/). This is an open source educational program that allows beginners to write and run simple Rust programs.
{{< /note >}}

1.  Download `rustup`, which manages the Rust download process.

        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

    {{< note respectIndent=false >}}
For those who do not want to use `curl`, it is also possible to download `rustup-init` directly. A list of all the versions of `rustup-init` can be found on Rust's [installation methods page](https://rust-lang.github.io/rustup/installation/other.html). For Ubuntu systems, select the`x86_64-unknown-linux-gnu` file.
{{< /note >}}

1.  Rust displays some background details about the installation, including the location of default directories and environmental settings for its various components. It then provides the following three choices:

    {{< output >}}
1) Proceed with installation (default)
2) Customize installation
3) Cancel installation
    {{< /output >}}

1.  In most cases, customization is not required. To accept the defaults and proceed with the installation, enter `1`. To customize the Rust installation, first carefully review the information about the various settings and note any necessary changes. Then enter `2` to begin the customization process.

    When the process is complete, Rust confirms the installation is successful.
    {{< output >}}
Rust is installed now. Great!
    {{< /output >}}

1.  To apply the environment changes, either source the Rust `env` file or log in to a new console session. Then verify the correct version of Rust has been installed by using the `version` flag.

        source $HOME/.cargo/env
        rustc --version

    You should see a similar output:

    {{< output >}}
rustc 1.50.0 (cb75ad5db 2021-02-10)
    {{< /output >}}

1.  If the `version` command still does not work, manually add the `~/.cargo/bin` directory to the `PATH` variable in `~/.bashrc`. Source the `.bashrc` file and try the command again.

    {{< file "~/.bashrc" >}}
...
export PATH="$HOME/.cargo/bin:$PATH"
...
    {{< /file >}}

{{< note respectIndent=false >}}
It is also possible to use Git to install Rust. Clone the [Rust GitHub repository](https://github.com/rust-lang/rustup) and run `cargo run --release`. See the `rustup` [installation page](https://rust-lang.github.io/rustup/installation/other.html) for more information.
{{< /note >}}

## Updating or Uninstalling Rust

1.  To update Rust, use the `rustup` tool.

        rustup update
2.  To remove Rust from your system, run the following command.

        rustup self uninstall

## Using Rust

Rust support is available for many editors, including [Vi/Vim](https://github.com/rust-lang/rust.vim), [VS Code](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust), and [Emacs](https://github.com/rust-lang/rust-mode).

### Building a Small Project in Rust

As with most programming languages, it is easiest to learn the basics with a simple "Hello, World" program. This short tutorial explains how to create, write, compile, and run a program in Rust. Compiling and running a program are separate steps. A program must be compiled before it can run.

1.  Create a directory named `projects` to store all of your Rust projects. Then, create a sub-directory for the "Hello World" project and move into the new directory.

        mkdir ~/projects
        cd ~/projects
        mkdir hello
        cd hello
1.  Create a new source file named `hello.rs` inside the `hello` directory. All Rust files must end with the `.rs` extension.

        touch hello.rs
1.  Open the `hello.rs` file in a text editor, and add the code required to display "Hello, World!" to the `main` function. The `main` function is the first code to execute in any Rust project. Here are a few things to note about this program:
    *   Parentheses `()` are used to enclose any function parameters. There are no parameters in this case.
    *   The body of the function is enclosed inside curly braces `{}`.
    *   Inside the function, `println!` is a macro that sends text to the standard output device. The `!` symbol at the end of the macro name means `println` is a macro and not an actual function.
    *   The arguments passed to `println` are contained inside the trailing parentheses. Here there is only one parameter, which contains the text to be printed.
    *   Each expression ends with a `;` symbol.

    Consult [Rust's documentation](https://doc.rust-lang.org/rust-by-example/index.html) for further discussion of Rust's style conventions.

    {{< file "~/projects/hello/hello.rs" rust >}}
fn main() {
    println!("Hello, world!");
}
    {{< /file >}}
1.  Save and close the `hello.rs` file.

1.  Compile the program using the `rustc` compiler. Provide the name of the file as an argument to `rustc`. This creates an executable named `hello`. The name of the executable is the name of the source file containing the `main` routine, minus the `.rs` extension.

        rustc hello.rs
1.  Run the program from the `hello` directory by specifying the name of the executable.

        ./hello
    Provided there are no errors, the program displays "Hello, world!" in the console window. If the program does not work as expected, verify the syntax of the `hello.rs` file is correct.
    {{< output >}}
Hello, world!
    {{< /output >}}

### Using the Cargo Build Tool and Package Manager

The lightweight process in the previous section works well with small applications because it imposes no extra overhead. For larger applications with dependencies, it is preferable to use [*Cargo*](https://doc.rust-lang.org/cargo/index.html), Rust's build tool and package manager. Cargo, which is installed by `rustup` alongside Rust, can be used to simplify many common development tasks. The following examples demonstrate some of Cargo's functionality.

1.  Confirm Cargo is installed and verify the version number using the `version` flag.

        cargo --version
    {{< output >}}
cargo 1.50.0 (f04e7fab7 2021-02-04)
    {{< /output >}}
1.  Create a new project using the `new` command. The following example indicates how to create a project named `cargo_project`.

        cargo new cargo_project
1.  Compile and build a project, linking in any dependencies, using the `build` command.

        cargo build
1.  Compile, build, and run any Rust project using the `run` command. If the source code has not changed since the last build, the compile and build steps are skipped.

        cargo run
1.  To use Cargo to test a Rust project, run the following command.

        cargo test
1.  Use Cargo to build documentation for a project using the `doc` command.

        cargo doc

1.  Publish a package to the [Crates repository](https://crates.io/) using the `publish` command.

        cargo publish

## For Further Reference

The Rust website provides extensive [*documentation*](https://www.rust-lang.org/learn), including tutorials, examples, and a link to the *Rust Programming Language* text. In particular, the [Rustlings Course](https://github.com/rust-lang/rustlings/) serves as a good quick introduction to the language. The short tutorial at the bottom of the [Getting Started](https://www.rust-lang.org/learn/get-started) page is also useful. The Rust documentation also contains guides to the Cargo package manager and the `rustc` compiler.