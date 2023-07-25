---
slug: running-commands-with-dockerized
description: "Dockerized packages together a set of useful command-line tools, allowing you to run commands without installing additional software. Learn more about Dockerized, including how to set up and start using it, in this guide."
keywords: ['docker run command', 'dockerized application', 'docker containerize command']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-02-22
modified_by:
  name: Linode
title: "How to Use Dockerized to Run Commands"
authors: ["Nathaniel Stickman"]
---

Dockerized lets you run useful command-line tools without having to install them or their dependencies on your system. Dockerized gives an easier and cleaner method to try out a tool or to leverage a tool for a one-off task.

In this guide, learn more about what Dockerized is and how to install it. Additionally, you can follow along with some example scenarios to start seeing how Dockerized might be useful to you.

## Before You Begin

1. If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1. Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Is Dockerized?

[Dockerized](https://github.com/datastack-net/dockerized) packages are a set of useful command-line tools for you to run without further installation. The included commands range from popular cloud and development tools to database and networking tools. And you can even expand Dockerized with additional commands, so you are not limited to only the ones it comes packaged with.

Dockerized accomplishes all of this by leveraging Docker and Docker Compose. Each Dockerized command creates a temporary Docker container with the given tool. These containers let you run each software setup without adding installations or dependencies to your wider system.

Dockerized has a wide range of use cases, and you may already have some of your own in mind. But two categories, in particular, stand out.

- Trying out new tools. Dockerized lets you test a range of tools without having to first install each. This lets you compare and explore tools' capabilities without the tedium of installation and the clutter of numerous applications that you may never use again.

- Running one-off tasks. Scripting languages excel at running single-use tasks, but typically they require you to have installed an interpreter and its dependencies. Dockerized includes numerous script interpreters, meaning that you can create and run scripts without further installations on your system.

## How to Install Dockerized

Dockerized is distributed as a precompiled binary, and its only external dependency is Docker. Once you have those set up, you are able to run all of the included commands with Dockerized — and any additional commands you add.

Follow along here to set up everything you need to start using Dockerized on your system.

### Installing Docker

Dockerized runs commands through Docker containers, so you need to have Docker installed to be able to use Dockerized.

On **Debian**, **Ubuntu**, **CentOS**, and **Fedora** systems, you can install the Docker Engine by following our [Installing and Using Docker](/docs/guides/installing-and-using-docker-on-ubuntu-and-debian/) guide.

Use the drop-down at the top of the page to select the distribution for you. Then, follow along with the sections of the guide on installing and starting Docker.

Additionally, you need to add any non-root users you want to run Dockerized with to the `docker` user group. Follow the section on running Docker as a non-root user in the guide linked above to see the appropriate command to do so.

### Downloading Dockerized

Dockerized is distributed as a package with the precompiled binary and its dependencies. To install Dockerized, you need to download and extract this package and place its binary in your user's shell path.

1. Create a directory to house the Dockerized project, and change into that directory. This guide uses a directory in the current user's home directory.

    ```command
    mkdir ~/dockerized
    cd ~/dockerized
    ```
1. Download the Dockerized package. The quickest way to do so is by using a single command like the one shown here. This command fetches information about the latest release, parses the Linux download URL from it, and downloads the package.

    ```command
    curl -s https://api.github.com/repos/datastack-net/dockerized/releases/latest \
    | grep "browser_download_url.*dockerized.*linux-x86_64.zip" \
    | tail -n 1 \
    | cut -d : -f 2,3 \
    | tr -d \" \
    | wget -O dockerized.zip -qi -
    ```

1. Unzip the package. You may need to install the `unzip` utility first, which you can typically do through your system's package manager.

    ```command
    unzip dockerized.zip
    ```

1. Now you need to add the Dockerized binary to your shell path. There are several ways of doing this, the simplest of which is to add the Dockerized `bin/` directory directly to your shell path, as shown below.

    ```command
    export PATH="$PATH:$HOME/dockerized/bin"
    ```

    But that approach limits the Dockerized application to the current user. This guide, instead, recommends adding a symbolic link of the Dockerized binary into a directory on your system's shell path. To do so:

    -   Move the `dockerized/` directory to a more centralized location.

        ```command
        sudo mv ~/dockerized/ /usr/local/lib/dockerized/
        ```

    -   Create a symbolic link within a directory on your system's shell path. Typically, `/usr/local/bin/` is on that path, but change that in this example as needed.

        ```command
        sudo ln -s /usr/local/lib/dockerized/bin/dockerized /usr/local/bin/dockerized
        ```

    -   Verify the setup by checking the version for one of the Dockerized commands.

        For instance, run this command to check the version of NPM within Dockerized.

        ```command
        dockerized npm --version
        ```

        Dockerized pulls the appropriate image or images the first time a command is run, then you should see the command's output — `8.5.2` in this example.

        ```output
        [+] Running 10/10
        ⠿ npm Pulled
        [...]
        8.5.2
        ```

1. Contrast this with the output without Dockerized. In this example, NPM is not installed on the system itself.

    ```command
    npm --version
    ```

    ```output
    -bash: npm: command not found
    ```

## How to Run Commands with Dockerized

You can already see the most basic execution of a Dockerized command above. Dockerized takes the command followed by any input you want to provide to the command.

To demonstrate further, the following is a simple `Hello, world!` execution using one of the interpreters included with Dockerized, *Lua*.

```command
dockerized lua -e 'print("Hello, world!")'
```

```output
Hello, world!
```

What follows are some more advanced usages of Dockerized. These each aim to broadly cover a use case, giving you bases and some ideas for how you might use Dockerized. The possibilities are extensive, but these examples are meant to start you out and show off more of Dockerized's capabilities.

### Database Maintenance Scripting

Dockerized includes containers for several scripting languages, including Lua, Python, and Ruby. Scripting languages excel at being able to complete one-off tasks, and this fits well with the model for Dockerized. You do not need to install a script interpreter and dependencies whenever you need to run a simple, one-off script.

This example, while rudimentary, demonstrates how you can set up a Ruby script for modifying a database.

1. Create a directory for the script, and change into that directory. This example puts the new directory in the current user's home directory.

    ```command
    mkdir ~/ruby-script
    cd ~/ruby-script
    ```

1. Use the Gem command included with Dockerized to install the `sqlite3` Ruby gem. The command below ensures that the gem gets installed into a `gem/` subdirectory of the current directory.

    ```command
    dockerized gem install sqlite3 --install-dir ./gems
    ```

1. Create a `test.rb` file within the directory, and give it the contents shown here. The example code has comments explaining what each part does.

    In summary, the script connects to an SQLite database file. It displays the results from a given table if there are any. If there are not any results, the script inserts several entries.

    ```file {title="test.rb" lang="ruby"}
    # Alter the load path for Ruby to include the local gem path
    $LOAD_PATH.unshift 'gems/gems/sqlite3-1.6.0-x86_64-linux/lib'

    # Import the sqlite3 gem
    require 'sqlite3'

    # Make a connection to test.db; configure to process rows as hashes
    db = SQLite3::Database.open 'test.db'
    db.results_as_hash = true

    # Create a table if it does not already exist
    db.execute 'CREATE TABLE IF NOT EXISTS the_data (id INTEGER PRIMARY KEY, name TEXT);'

    # Define an array of values to be inserted into the table
    name_array = ["first name", "second name", "third name"]

    # Fetch everything in the table
    results = db.query 'SELECT name FROM the_data;'

    # If there is anything in the table, display what is there; if there is
    # not anything in the table, insert the values from name_array
    first_result = results.next
    if first_result
        puts "Results found!"

        puts first_result["name"]
        results.each do |result|
            puts result["name"]
        end
    else
        puts "No results found"
        puts "Inserting new records"

        name_array.each do |new_name|
            db.execute 'INSERT INTO the_data (name) VALUES (?);', new_name
        end
    end
    ```

1. Run the script using the Ruby container from Dockerized.

    ```command
    dockerized ruby test.rb
    ```

    The first time running the script, you should see an indication that no records were found and that new records are being added.

    ```output
    No results found
    Inserting new records
    ```

    Run the script again, and you should see that the script fetches the results it inserted into the table on the previous run.

    ```output
    Results found!
    first name
    second name
    third name
    ```

### Static HTTP Server

Dockerized includes several tools that can serve static files over HTTP — Node, Python, and Ruby, for instance. These can be useful if your want to test some static website files without preparing an entire project.

Python provides an easy way to see this in action through its `http.server` module.

1. Create a directory for the static website files, then change into that directory. This example uses a directory in the current user's home directory.

    ```command
    mkdir ~/simple-website
    cd ~/simple-website
    ```

1. Give the directory an `index.html` landing page. From there you can provide whatever additional content you want. The following gives a basic example.

    ```file {title="index.html" lang="html"}
    <!doctype html>
    <html lang="en">
      <head>
        <title>A Simple Website</title>
      </head>
      <body>
        <p>This is a test website.</p>
      </body>
    </html>
    ```

1. Run the following Dockerized command to serve the static website files in the current directory. The `-p` option lets you forward a port from within the container to the host machine.

    ```command
    dockerized -p 8080:8080 python -m http.server 8080
    ```

    In this case, `http.server` serves the content on port `8080` of its container, and the `-p` option forwards that port to port `8080` on the host machine as well.

1. Navigate to the host's port `8080` in a web browser, and you should see the website's content.

    ```output
    This is a test website.
    ```

## How to Add More Commands to Dockerized

Dockerized comes with a useful set of commands and tools, but you may want to expand on it. And Dockerized can readily accommodate this through simple Docker Compose additions.

Essentially, Dockerized needs two kinds of files to direct it on adding additional commands.

- A `dockerized.env` file provides a `COMPOSE_FILE` variable with the location or locations of Docker Compose files.

    This file needs to be in either the current user's home directory or the current working directory. Dockerized in this way allows you to apply a scope to additional commands, fitting them to specific users and project directories.

    Dockerized gives you two variables to help with specifying `docker-compose.yml` file locations within the `docker.env` file. The first is `${HOME}`, corresponding to the current user's home directory. The second is `${DOCKERIZED_PROJECT_ROOT}`, corresponding to the current working directory.

- A `docker-compose.yml` defines the additional service or services to add to Dockerized.

    You have more control of the location of this file, since you define its location using the `COMPOSE_FILE` environment variable.

All of this becomes clearer with an example. Follow along with the steps here to add a simple cURL command utility to Dockerized. These steps add the command for the current user.

1. Create a `dockerized.env` file in the current user's home directory, and give that file the contents shown below.

    ```file {title="~/dockerized.env" lang="env"}
    COMPOSE_FILE="${COMPOSE_FILE};${HOME}/dockerized-additions/docker-compose.yml"
    ```

    This sets the `COMPOSE_FILE` environment variable, which gives Dockerized the locations of Docker Compose configurations to derive commands from.`${COMPOSE_FILE}` and ensures that the default `docker-compose.yml` remains included. `${HOME}` points to the current user's home directory, which then gets expanded on with a specific location for the new `docker-compose.yml` file to be included.

1. Create the new `docker-compose.yml` file at the location indicated above — `~/dockerized-additions/docker-compose.yml`. Give that file the contents shown here.

    ```file {title="~/dockerized-additions/docker-compose.yml" lang="yml"}
    version: "3"
    services:
      curl:
        image: curlimages/curl:latest
        entrypoint: ["curl"]
    ```

    This creates a `curl` service, which provides a `curl` command to Dockerized. The service uses the [curlimages/curl](https://hub.docker.com/r/curlimages/curl) Docker image, and the `entrypoint` tells Dockerized to run the `curl` command within the container immediately whenever the service is called.

You can test out this example setup by running the new command. This example only configures the new command for the current user, so be sure to use the same user when testing the command.

```command
dockerized curl eth0.me
```

```output
192.0.2.0
```
## Conclusion

With that, you have a ready Dockerized setup and some understanding of how you can start effectively making use of it. Dockerized provides a strong addition to your toolkit. Now that you have it, you are likely to quickly start seeing a multitude of places to use it.
