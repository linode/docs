---
slug: running-commands-with-dockerized
title: "How to Use Dockerized to Run Commands"
description: "Dockerized packages together a set of useful command-line tools, allowing you to run commands without installing additional software. Learn more about Dockerized, including how to set up and start using it, in this guide."
published: 2023-08-08
modified_by:
  name: Linode
keywords: ['docker run command', 'dockerized application', 'docker containerize command']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Nathaniel Stickman"]
---

[Dockerized](https://github.com/datastack-net/dockerized) is a utility that runs common commands, interpreters, and other applications within a Docker container. This saves you from manually installing each command (and its dependencies) to your local system. Using Dockerized allows you to try out a new tool, leverage a tool for a one-off task, or ensure your team is using the same version of a tool.

In this guide, learn more about what Dockerized is and how to install it. Additionally, you can follow along with some example scenarios to start seeing how Dockerized might be useful to you.

{{< note >}}
There are multiple separate applications that are named *Dockerized*, *Dockerize*, or something very similar. This guide discusses the tool hosted on the [datastack-net/dockerized](https://github.com/datastack-net/dockerized) GitHub repository.
{{< /note >}}

## Before You Begin

1. If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1. Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Is Dockerized?

Dockerized packages a set of useful command-line tools, allowing you to use those tools without further installation. Out of the box, Dockerized includes many popular development tools (like git, npm, and pip), database CLIs (like mysql and postgres), networking (like wget and telnet), and many others. For a list, review the [Supported Commands](https://github.com/datastack-net/dockerized#supported-commands) section on the GitHub readme page. You can even expand Dockerized with additional commands, so you are not limited to only the ones included by default.

Dockerized accomplishes all of this by leveraging Docker and Docker Compose. Each Dockerized command creates a temporary Docker container with the given tool. These containers let you run each software setup without adding installations or dependencies to your system.

Dockerized has a wide range of use cases and you may already have some of your own in mind. But two categories, in particular, stand out.

- **Trying out new tools.** Dockerized lets you test a range of tools without having to install each one. This allows you to compare and explore a tool's capabilities without the tedium of installation and the clutter of numerous applications that you may never use again.

- **Running one-off tasks.** Scripting languages excel at running single-use tasks, but typically they require you to have installed an interpreter and its dependencies. Dockerized includes numerous script interpreters, meaning that you can create and run scripts without further installations on your system.

## How to Install Dockerized

Dockerized is distributed as a precompiled binary and its only external dependency is Docker. Once you have those set up, you are able to run all of the included commands with Dockerized — as well as any additional commands you add.

{{< note >}}
These installation instructions should work for most Linux distributions and macOS. Dockerized also supports Windows, but that is outside the scope of this guide. To view official instructions for all supported operating systems, see the [Installation](https://github.com/datastack-net/dockerized#installation) section found in the Dockerized GitHub readme file.
{{< /note >}}

### Install Docker

Dockerized runs commands through Docker containers, so you need to have Docker installed to be able to use Dockerized.

On most Linux systems, you can install the Docker Engine by following our [Installing and Using Docker](/docs/guides/installing-and-using-docker-on-ubuntu-and-debian/) guide. Additionally, you need to add any non-root users you want to run Dockerized with to the `docker` user group. Follow the section on running Docker as a non-root user in the guide linked above to see the appropriate command to do so.

### Download and Install Dockerized

To install Dockerized, download the latest zip file corresponding with your operating system, extract the zip file, and add the Dockerized `bin` directory to your PATH variable.

1.  Download the Dockerized package for your operating system from the [Releases](https://github.com/datastack-net/dockerized/releases) page on GitHub. The quickest way to do so is by using a single command like the one shown below. This command fetches information about the latest release, finds the download URL for the specified operating system, and downloads the package.

    ```command
    curl -s https://api.github.com/repos/datastack-net/dockerized/releases/latest \
    | grep "browser_download_url.*dockerized.*linux-x86_64.zip" \
    | tail -n 1 \
    | cut -d : -f 2,3 \
    | tr -d \" \
    | wget -O dockerized.zip -qi -
    ```

    If you are using macOS, replace `linux-x86_64.zip` in the command above with one of the following strings:

    - **Apple Silicon:** `mac-arm64.zip`
    - **Intel:** `mac-x86_64.zip`

1.  Since Dockerized is packaged as a zip file, you need a way to extract the file. This guide uses the [unzip](https://linux.die.net/man/1/unzip) command, which comes with macOS but not most Linux distributions. Linux users should first install unzip through their package manager:

    -   **Ubuntu, Debian, and many other distributions using the APT package manager:**

        ```command
        sudo apt install unzip
        ```

    -   **CentOS/RHEL, AlmaLinux, Rocky Linux 8 (and above) and Fedora:**

        ```command
        sudo dnf install unzip
        ```

1.  Unzip the Dockerized package to a new directory in your home folder (`~/dockerized/`).

    ```command
    unzip dockerized.zip -d ~/dockerized/
    ```

1.  Modify your PATH environmental variable to include the Dockerized binary. There are many methods of doing this, though this guide covers two common ways.

    -   **Install just for current user:** Add the `dockerzied/bin` folder to the PATH variable.

        ```command
        export PATH="$PATH:$HOME/dockerized/bin"
        ```

    -   **Install for all users:** Add a symlink of the Dockerized binary file to an existing directory accessible to all users and make sure that directory is on your system's PATH variable.

        First, move the `dockerized/` directory to a more centralized location.

        ```command
        sudo mv ~/dockerized/ /usr/local/lib/dockerized/
        ```

        Then, create a symbolic link within a directory on your system's shell path. Typically, `/usr/local/bin/` is on that path, but change that in this example as needed.

        ```command
        sudo ln -s /usr/local/lib/dockerized/bin/dockerized /usr/local/bin/dockerized
        ```

1.  Verify the setup by checking running a command from Dockerized. For instructions, review the [Run Commands with Dockerized](#run-commands) section below.

## Run Commands with Dockerized {#run-commands}

To start using Dockerized to run one of the included command-line tools, enter the following command. Replace *COMMAND* with the command you wish to run.

```command
dockerized COMMAND
```

For instance, you can use the npm utility (included with Dockerized). As a basic example, run the command below to check the version of npm that is used:

```command
dockerized npm --version
```

The first time a command is run, Dockerized downloads the appropriate image(s) needed for the associated tool. You should then see the command's output.

```output
[+] Running 10/10
⠿ npm Pulled
[...]
8.5.2
```

If you run the command outside of Dockerized, you may notice different output or receive a command not found error. This is because your system either is running a different version of the utility used by Dockerized or, more likely, the utility isn't installed locally on your system.

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

While Dockerized comes with a useful set of commands, you may want to expand the existing functionality and add new commands. As Dockerized uses [Docker Compose](https://docs.docker.com/compose/), you can create additional [Compose files](https://docs.docker.com/compose/compose-file/) to define new commands. Then you can specify the location of the Compose file(s) through the use of Dockerized environment variables.

1.  **Define the new command(s) within Docker Compose files:** [Compose files](https://docs.docker.com/compose/compose-file/) are used to define additional commands for use with Dockerized. A single file can store multiple commands or you can create a file for each command. If you wish for the commands to be used by other users, make sure the corresponding Compose file is accessible by those users. Otherwise, if your current user is the only intended user, it can be stored within your home directory.

    As an example, create a new file called `new-command.yml` with the following contents:

    ```file {title="~/new-command.yml" lang="yml"}
    version: "3"
    services:
      example:
        image: curlimages/curl:latest
        entrypoint: ["curl"]
    ```

    This creates a new service named `example`. This service name defines the Dockerized command, so a service named `example` is called by running `dockerized example`. The service uses the [curlimages/curl](https://hub.docker.com/r/curlimages/curl) Docker image and the `entrypoint` tells Dockerized to run the `curl` command within the container immediately whenever the service is called.

1.  **Specifiy the location of the Compose file(s) within Dockerized:** Once you have created your Compose files, you need to tell Dockerized where to look. This is accomplished through the use of environment configuration files (`dockerized.env`), which can be stored within your home directory (so you can access the new command globally) or within a specific project directory (so you can access the command from within a certain project folder). In this way, Dockerized allows you to apply a scope to additional commands, fitting them to specific users and project directories. There are two variables that can be used to specify the relative location of the Compose file(s): `${HOME}` (which corresponds to the user's home directory) and `${DOCKERIZED_PROJECT_ROOT}` (which corresponds to the current working directory).

    To continue with the example in the previous step, create a new file in your home directory called `dockerized.env` with the following contents:

    ```file {title="~/dockerized.env" lang="env"}
    COMPOSE_FILE="${COMPOSE_FILE};${HOME}/new-command.yml"
    ```

    This updates the `COMPOSE_FILE` setting to include both the existing built-in commands (`${COMPOSE_FILE}` variable) and the new command(s) (`${HOME}/new-command.yml`). Additional locations can be added using a semicolon (`;`) as the delimiter.

You can test out this example by running the newly defined command as shown below, replacing example.com with the URL of any web page or API endpoint you would like to output.

```command
dockerized example example.com
```

Since the Dockerized `example` service name is mapped to the curl command, running the command actually runs `curl` from within the Docker container and displays the contents of the web page provided.

For additional instructions on defining new commands or adjusting Dockerized settings, review the [Customization](https://github.com/datastack-net/dockerized#customization) section of the readme file on GitHub.