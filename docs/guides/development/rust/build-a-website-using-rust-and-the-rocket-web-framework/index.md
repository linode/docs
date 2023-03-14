---
slug: build-a-website-using-rust-and-the-rocket-web-framework
description: 'Learn what the Rocket framework is, what it does, how it works, and how to install and configure it.'
keywords: ['rocket','rust','functional programming','web application','app framework','handlebars templates']
tags: ['rust', 'web applications']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-04
modified_by:
  name: Nathaniel Stickman
title: "Build a Website Using Rust and the Rocket Web Framework"
external_resources:
- '[Rockets releases page](https://github.com/SergioBenitez/Rocket/releases)'
- '[Handlebars](https://handlebarsjs.com/)'
- '[Rockets full guide](https://rocket.rs/v0.4/guide/)'
- '[Handlebars language guide](https://handlebarsjs.com/guide/)'
- '[Rusts learning page](https://www.rust-lang.org/learn)'

authors: ["Nathaniel Stickman"]
---

Rust is a functional programming language noted for its high performance and capabilities in systems programming. However, with the *Rocket framework*, you can also use Rust for building full-functioning — and efficient — web applications.

This guide explains what Rocket is, shows you how to install it, and gets you started using it to create your own website.

## What is Rocket?

Rocket is a framework for building web applications with the Rust programming language. Rust itself is noted for its type-safety and speediness, and Rocket aims to leverage those attributes to make secure and efficient web applications.

Beyond that, Rocket emphasizes an easy and minimalistic path to putting together the web application you need. It uses simple and intuitive APIs, and Rocket does its job without all of the boilerplate code. Moreover, it is an extensible framework designed for flexibility.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1. Throughout, this guide uses `example-app` as the name of the Rocket application. Replace it with your preferred application name.

{{< note respectIndent=false >}}
This guide is written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install Rust

Rocket makes use of some of Rust's more cutting-edge features. As such, you need to install the nightly build of Rust to make sure Rocket works correctly.

1. Install [*rustup*](https://rustup.rs/), an installer for Rust. Follow the prompts the installation script presents.

        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

    If you do not already have Curl installed, use this command to install it first:

        sudo apt install curl

1. Log out and log back in or run the following command to load the necessary executables into your Bash path:

        source $HOME/.cargo/env

1. Set `nightly` as your default Rust version:

        rustup default nightly

    Alternatively, you can set the nightly release as your default for a specific project. Once you create a project (like in the steps below) run the following command in the project directory to have it use the nightly build:

        rust override set nightly

## Getting Started with Rocket

In this section, you complete the following steps:

   - Download and explore Rocket's example applications
   - Create your own Rocket application

### Example Applications

1. Use Git to clone the Rocket repository. For this example, the repository is cloned into the current user's home directory.

        cd ~
        git clone https://github.com/SergioBenitez/Rocket

    If you do not already have Git, install it first with the following command:

        sudo apt install git

1. Change into the resulting `Rocket` directory, and check out the latest version. You can refer to [Rocket's releases page](https://github.com/SergioBenitez/Rocket/releases) to see the latest version.

        cd Rocket
        git checkout v0.4.7

1. Look through the `examples` directory for an example you would like to explore. When you have found one, change into its directory. Here, the `hello_world` example is chosen.

        cd examples/hello_world

1. Run the example:

        cargo run

    Rocket serves the application on localhost port `8000`. To visit the application remotely, you can use an SSH tunnel:

    - On Windows, you can use the PuTTY tool to set up your SSH tunnel. Follow the appropriate section of the [Using SSH on Windows](/docs/guides/connect-to-server-over-ssh-on-windows/#ssh-tunnelingport-forwarding) guide, replacing the example port number there with `8000`.

    - On macOS or Linux, use the following command to set up the SSH tunnel. Replace `example-user` with your username on the application server and `192.0.2.0` with the server's IP address:

            ssh -L8000:localhost:8000 example-user@192.0.2.0

1. Now, you can visit the application in your browser by navigating to `localhost:8000`.

### Create an Application

1. Change to the location where you would like the project directory to be created. In this case, this is the current user's home directory.

        cd ~

1. Create a new binary-based Rust project, then change into the new directory you created for it.

        cargo new example-app --bin
        cd example-app

    Unless noted otherwise, all subsequent commands in this guide assume you are still in the application directory.

1. Open the `Cargo.toml` file, and add Rocket as a dependency for the project. Use the version number for the latest version of Rocket. Refer to the [Example Applications](/docs/guides/build-a-website-using-rust-and-the-rocket-web-framework/#example-applications) section above for how to identify the latest Rocket release.

    {{< file "~/example-app/Cargo.toml" >}}
# [...]

[dependencies]
rocket = "0.4.7"
    {{< /file >}}

1. Open the `src/main.rs` file, and populate it with the following lines:

    {{< file "~/example-app/src/main.rs" rust >}}
#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

fn main() {
    rocket::ignite().mount("/", routes![index]).launch();
}
    {{< /file >}}

1. You have now created a basic "Hello, World!" application, which you can test by using the `cargo run` command as shown in the [Example Applications](#example-applications) section above.

## Build a Website with Rocket

Rocket can easily be set up to provide web service APIs based on the above example and referring to the [official Rocket documentation](https://rocket.rs/v0.4/guide/).

Pairing Rocket with a template engine like [Handlebars](https://handlebarsjs.com/) makes it ready to run a full website. The steps below show you how to do just that and set you up with the foundations for going off and building your own templates.

1. Follow the steps in the [Create an Application](/docs/guides/build-a-website-using-rust-and-the-rocket-web-framework/#create-an-application) section above to create a base Rocket application to work off.

1. Open the project's `Cargo.toml`, and modify with the additional  lines in the example below:

    {{< file "~/example-app/Cargo.toml" >}}
# [...]

[dependencies]
rocket = "0.4.7"
serde = { version = "1.0", features = ["derive"] }

[dependencies.rocket_contrib]
version = "*"
default-features = false
features = ["handlebars_templates"]
    {{< /file >}}

    This adds `serde`, which comes with some typing features the application needs,as a dependency. The `rocket_contrib` section allows Handlebars to be identified as a feature that the project uses.

1. Open your `~/example-app/src/main.rs` file, and modify it to include the following code:

    {{< file "~/example-app/src/main.rs" rust >}}
#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;

use rocket::response::Redirect;
use rocket_contrib::templates::Template;

#[derive(serde::Serialize)]
struct Message {
    user: &'static str,
    body: &'static str
}

#[derive(serde::Serialize)]
struct BoardContext {
    current_user: Option<String>,
    messages: Vec<Message>,
    parent: &'static str
}

#[derive(serde::Serialize)]
struct AboutContext {
    parent: &'static str
}

#[get("/")]
fn index() -> Redirect {
    Redirect::to("/user/anonymous")
}

#[get("/user/<username>")]
fn board(username: String) -> Template {
    Template::render("index", &BoardContext {
        current_user: Some(username),
        messages: vec![Message{user: "userA", body: "This is the first test message."},
                        Message{user: "userB", body: "This is the second test message."}],
        parent: "layout"
    })
}

#[get("/about")]
fn about() -> Template {
    Template::render("about", &AboutContext {
        parent: "layout"
    })
}
    {{< /file >}}

    - This creates a `Message` struct, defining the basic shape for messages. The `BoardContext` and `AboutContext` structs determine "context" information to be handed off to the templates. Each context struct has a `parent` attribute. The application uses these attributes in the `board` and `about` functions to apply the appropriate page layout for each page.

    - These two functions are where the application loads the Message board and the About pages, respectively. They populate the context information and render the templates with it.

    - The application also uses a redirect to navigate users from the base URL (`/`) to the message board URL.

1. Create a template directory.

        mkdir templates

1. Create the five template files shown below.

    - The `layout.hbs` file defines the page layout used on each page. Using the `parent` attribute defined in the `main.rs` file's context structs, you could also have different layouts for different sections of your site.

    {{< file "~/example-app/templates/layout.hbs" >}}
<!doctype html>
<html>
  <head>
    <title>Example App - Message Board</title>
  </head>
  <body>
    {{> header}}
    {{~> page}}
    {{> footer}}
  </body>
</html>
    {{< /file >}}

    - The `header.hbs` and `footer.hbs` files provide contents for those sections. These are directly referenced in the page layout file, so they appear on each page of your site that uses that page layout.

    {{< file "~/example-app/templates/header.hbs" >}}
<nav>
  <a href="/">Message Board</a> | <a href="/about">About</a>
</nav>
    {{< /file >}}

    {{< file "~/example-app/templates/footer.hbs" >}}
<footer>
  Built with Rust and the Rocket framework.
</footer>
    {{< /file >}}

    - The `index.hbs` file defines the way your main page — in this case, the Message board — gets laid out.

    {{< file "~/example-app/templates/index.hbs" >}}
{{#*inline "page"}}

<section id="message_board">
  <h1>Hi, {{ current_user }}!</h1>
  You can login as a different user by navigating to "/user/{username}".

  <h2>Messages</h2>
  <ul>
    {{#each messages}}
      <li>{{ this.user }}: {{ this.body }}</li>
    {{/each}}
  </ul>
</section>

{{/inline}}
{{~> (parent)~}}
    {{< /file >}}

    The `about.hbs` provides the contents for the about page.

    {{< file "~/example-app/templates/about.hbs" >}}
{{#*inline "page"}}

<section id="about">
  <h1>About</h1>
  This is an example web application built with Rust and the Rocket framework.
</section>

{{/inline}}
{{~> (parent)~}}
    {{< /file >}}

1. Now you can run the application using the `cargo run` command as shown in the [Example Applications](/docs/guides/build-a-website-using-rust-and-the-rocket-web-framework/#example-applications) section above.

    ![Example Rocket website using Handlebars templates](rocket-template-example.png)

## Conclusion

After completing this guide, you should have a solid understanding of how to get started using Rocket to make web applications. Rust and Rocket are highly capable and have a lot to offer with their functional approach, high performance, and efficient design.

Check out the [Rocket's full guide](https://rocket.rs/v0.4/guide/) to learn more about the features it offers. Take a look at the [Handlebars language guide](https://handlebarsjs.com/guide/), too, if you are interested in doing more with templates in Rocket.

To continue learning more about the Rust programming language, check out the resources linked on [Rust's learning page](https://www.rust-lang.org/learn), which include both *The Rust Book* and a Rust course.
