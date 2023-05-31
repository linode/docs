---
slug: how-to-create-a-dagger-pipeline-with-linode
title: "How to Create a Dagger Pipeline With Linode"
description: 'This guide explains how to create a CI/CD pipeline using Dagger and the Dagger Python SDK'
og_description: 'This guide explains how to create a CI/CD pipeline using Dagger and the Dagger Python SDK'
keywords: ['Dagger SDK','how to use Dagger','Dagger Python','CI/CD pipeline Dagger']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Jeff Novotny"]
published: 2023-05-24
modified_by:
  name: Linode
external_resources:
- '[Dagger](https://dagger.io/)'
- '[Dagger Documentation](https://docs.dagger.io/)'
- '[Dagger Quickstart](https://docs.dagger.io/648215/quickstart)'
- '[Dagger Python SDK](https://docs.dagger.io/sdk/python)'
- '[Dagger Go SDK](https://docs.dagger.io/sdk/go)'
- '[Dagger Node.js SDK](https://docs.dagger.io/sdk/nodejs)'
- '[Dagger on GitHub](https://github.com/dagger)'
- '[Dagger Cookbook for Registry Authentication](https://docs.dagger.io/7442989/cookbook/#publish-image-to-registry)'
- '[ttl anonymous container registry](https://ttl.sh/)'
---

[Dagger](https://dagger.io/) is a free open source application for automating *continuous integration/continuous delivery* (CI/CD) pipelines. It allows administrators and developers to create scripts to assemble, test, and build a project, and even publish it to a container registry. Dagger includes APIs for several programming languages, providing additional convenience. This guide supplies a brief introduction to Dagger and demonstrates how to create a simple Dagger pipeline.

## What is Dagger?

Dagger was originally created by the founder of Docker. It allows users to automate their production pipelines using the language they prefer. The Dagger interface allows users to generate, build, test, and containerize their applications through the use of a detailed SDK. Dagger runs the entire pipeline inside one or more containers, and requires the Docker BuildKit backend to operate. It is designed to be used as part of a CI/CD pipeline, which automates the entire application development life cycle. A mature CI/CD pipeline allows for a quicker, more efficient, and more robust delivery schedule.

The script first imports the Dagger package and opens a session to the Dagger engine. The script then transmits the pipeline requests to the engine using an internal protocol. For each request, the Dagger engine determines the operations required to compute the results. The various tasks are run concurrently for better performance. The results are then processed asynchronously and sent back to the script when everything is resolved. Results can be assigned to a variable and used as inputs to a subsequent stages of the pipeline.

In addition to cross-language support, Dagger provides some of the following advantages:

- It allows developers to integrate automated tests directly into their pipeline.
- Because it is developed using a standard programming language, a Dagger script is portable and system agnostic. It can run on any architecture.
- Scripts can run locally or remotely.
- Dagger caches results for later use to optimize performance.
- It is fully compatible and thoroughly integrated with Docker. Docker assists Dagger in dependency management. Scripts are cross-compatible with many other CI/CD environments.
- Relatively little code is required to develop a complex pipeline.
- It can optionally use the Dagger CLI extension to interact with the Dagger Engine from the command line.
- Dagger is scalable and can simultaneously handle many highly-detailed pipelines.

Because Dagger is a relatively new application, it does not yet have an extensive user base or many avenues for support. Although the Dagger SDK is very powerful, it is also complex and takes some time to learn.

Due to Dagger's multi-language support, developers can code their pipeline in their favorite language. It potentially provides the opportunity to use the same programming language as the one used to develop the application. The Dagger SDK/API is available in the following languages:

- **Python**
- **Go**
- **Node.js**
- **GraphQL**

Dagger recommends the Go SDK for those who are unsure which SDK to use. The GraphQL API is language agnostic. It can serve as a low-level framework for those who want to use a language without its own API.

For more background on Dagger, see the [Dagger Documentation](https://docs.dagger.io/) and the [Dagger Cookbook](https://docs.dagger.io/7442989/cookbook/).

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  To publish the container, you must have access to a container registry. This guide uses the short-term anonymous [ttl.sh](https://ttl.sh/) registry to publish the container. However, it is possible to push to any container repository. Most repositories require a user account and password to publish containers.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install Dagger

Dagger requires the use of Docker. This guide uses the Python SDK to compose the script. The Dagger module for Python is installed using `pip`, the Python package manager. This guide is written for Ubuntu 22.04 LTS users, but is generally applicable to most recent releases and other Linux distributions. To install Dagger, follow these steps.

1.  Install any updates to ensure the system is up to date. Reboot the system if advised to do so.

    ```command
    sudo apt-get update -y && sudo apt-get upgrade -y
    ```

2.  Ensure `git` is installed on the system.

    ```command
    sudo apt install git
    ```

3.  Dagger requires the use of Docker. To prepare for the Docker v2 installation, remove any older releases of the application and then install some additional components.

    ```command
    sudo apt-get remove docker docker-engine docker.io containerd runc
    sudo apt-get install ca-certificates curl gnupg lsb-release
    ```

4.  Add the official Docker GPG key. This key helps validate the installation.

    ```command
    sudo mkdir -m 0755 -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    ```

5.  Add the Docker repository to `apt`, then update the package list.

    ```command
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    ```

6.  Install the latest release of Docker Engine and CLI, along with some related packages.

    ```command
    sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    ```

7.  To ensure Docker is operating correctly, run the `hello-world` container. If everything is working, the container displays the message `Hello from Docker!`.

    ```command
    sudo docker run hello-world
    ```

    ```output
    Hello from Docker!
    This message shows that your installation appears to be working correctly.
    ```

8.  Install the Dagger SDK for the appropriate programming language. This guide uses Python to create the example application, so the next steps explain how to download the Python SDK. Use `pip` to install the `dagger-io` module. If `pip` is not yet installed, it can be added using the command `sudo apt install python3-pip`. Python release 3.10 is required.

    {{< note >}}
    Dagger uses Docker to create a container, but `sudo` is normally required to run Docker. This means the Python `dagger-io` package must be accessible to the root user. Unfortunately, Python installs modules locally by default. There are several ways to work around this problem. The simplest method is to install the `dagger-io` package globally using the `pip -H` flag. This ensures it is accessible to all users. Unfortunately, using `pip` globally can lead to complex and confusing permission issues. This technique should be used with great care, especially in a multi-user environment.

    Another potential workaround is to add the current user to the `docker` group using the command `sudo usermod -aG docker userid`. This allows the user to access Docker without root access. This guide proceeds as if the user has been added to the `docker` guide and installs `dagger-io` locally. To install the package globally, use the command `sudo -H pip install dagger-io`.
    {{< /note >}}

    {{< note >}}
    SDKs are also available for Node.js and Go. To install the Go SDK, use the `go mod init main` and `go get dagger.io/dagger` commands. For the Node.js SDK, use `npm install @dagger.io/dagger --save-dev`.
    {{< /note >}}

    ```command
    pip install dagger-io
    ```

## How to Create a Sample Dagger Pipeline

This guide uses the Python SDK to create an example Dagger CI/CD pipeline. To simplify the process, this guide uses the `hello-dagger` demo app to demonstrate the main steps. Dagger recommends using this application when learning how to create a pipeline. However, any application can be used for the demo, provided the appropriate script updates are made.

For more information on the Python SDK or to further customize the application, see the [Dagger Python SDK](https://docs.dagger.io/sdk/python). See the [Dagger Quickstart demo](https://docs.dagger.io/593914/quickstart-hello/) for information on how to create this pipeline using either Go or Node.

To create a Dagger pipeline in Python, follow these steps.

### Download the Example Application

Dagger has developed a sample React application named `hello-dagger` as a teaching aid. Download the application from GitHub using `git` to get started.

1.  Clone the application from GitHub.

    ```command
    git clone https://github.com/dagger/hello-dagger.git
    ```

2.  Change to the new `hello-dagger` directory and create a new `ci` directory to contain the scripts.

    ```command
    cd hello-dagger
    mkdir ci
    ```

### Create and Test a Dagger Pipeline for the Application

The Dagger client enables users to create a multi-stage Python program to define, test, and build an application. This section of the tutorial does not yet publish the application. It is important to test it first and ensure it builds correctly. To create a new pipeline, follow these steps.

1.  `cd` to the `hello-dagger/ci` directory and create a new `main.py` Python project file. Open the file in a text editor.

    ```command
    cd ~/hello-dagger/ci
    vi main.py
    ```

2.  At the top of the file, add the required `import` statements. Include a `import dagger` directive to import the Dagger SDK.

    ```file {title="~/hello-dagger/ci/main.py" lang="python"}
    import sys
    import anyio
    import dagger
    ```

3.  Define a `main` routine. Create a Dagger configuration object and define `stdout` as the output stream. Add the following lines to the file.

    ```file {title="~/hello-dagger/ci/main.py" lang="python"}
    async def main():
        config = dagger.Config(log_output=sys.stdout)
    ```

4.  Create a Dagger client using `dagger.Connection`, passing it the `config` object as the default configuration. Create a new client container with the following parameters.

    - Base the container on the `node:16-slim` image using the `from_` method. This method also initializes the container.
    - Use the `with_directory` method to specify both the directory to use as the source and the mount location inside the container.
    - Specify the current directory as the source of the application using the string `client.host().directory(".")`.
    - Mount the application inside the `/src` directory of the container.
    - Exclude the extraneous `node_modules` and `ci` directories from this process.

    Add the following lines to the file to mount the source code at the `src` directory of a `node:16-slim` container.

    {{< note >}}
    The Dagger Python SDK makes extensive use of a technique known as *method chaining*. The methods are processed in order. Subsequent methods act on the object returned in the previous method.
    {{< /note >}}

    ```file {title="~/hello-dagger/ci/main.py" lang="python"}
    async with dagger.Connection(config) as client:
        source = (
            client.container()
            .from_("node:16-slim")
            .with_directory(
                "/src",
                client.host().directory("."),
                exclude=["node_modules/", "ci/"],
            )
        )
    ```

5.  The next phase of the pipeline uses `npm install` to install the application dependencies inside the container. The `with_workdir` method tells Dagger where inside the container to run the command. The `with_exec` method tells Dagger to run `npm install` at that location. Add the following lines to the script.

    ```file {title="~/hello-dagger/ci/main.py" lang="python"}
        runner = source.with_workdir("/src").with_exec(["npm", "install"])
    ```
6.  The final section of the Python script automatically runs a test suite against the application. This command uses the `with_exec` method again, with `npm test --watchAll=false` as the test command. If an error results, details are printed to the console via the `stderr` stream and the pipeline terminates. At the end of the file, add a call to the `main` routine.

    ```file {title="~/hello-dagger/ci/main.py" lang="python"}
        out = await runner.with_exec(["npm", "test", "--", "--watchAll=false"]).stderr()
        print(out)

    anyio.run(main)
    ```

7.  The entire file should look like this. Ensure the proper indentation of each line is maintained.

    ```file {title="~/hello-dagger/ci/main.py" lang="python"}
    import sys
    import anyio
    import dagger

    async def main():
        config = dagger.Config(log_output=sys.stdout)

        async with dagger.Connection(config) as client:
            source = (
                client.container()
                .from_("node:16-slim")
                .with_directory(
                    "/src",
                    client.host().directory("."),
                    exclude=["node_modules/", "ci/"],
                )
            )

            runner = source.with_workdir("/src").with_exec(["npm", "install"])

            out = await runner.with_exec(["npm", "test", "--", "--watchAll=false"]).stderr()
            print(out)

    anyio.run(main)
    ```

8.  Change back to the main `hello-dagger` project directory. Run the Python script using `python3 ci/main.py`. No errors should be seen and all `npm` tests should pass. Because Dagger first has to ask Docker to download the `node:16-slim` container, it might take a couple minutes before the `npm install` command runs. Subsequent runs of this program take less time.

    ```command
    cd ~/hello-dagger
    python3 ci/main.py
    ```

    ```output
    Test Suites: 1 passed, 1 total
    Tests:       1 passed, 1 total
    Snapshots:   0 total
    Time:        3.896 s
    Ran all test suites.
    ```

### Add a Build Stage to the Pipeline

After the main components of the pipeline have been created, as described in the previous section, it is time to add the build stage. Most of the `main.py` file remains the same in this version of the file. However, the output of the test phase is no longer sent to standard output. Instead, it feeds into the build stage of the pipeline. To add build directives to the file, follow these steps.

1.  Open the `main.py` file used in the previous section and make the following changes.

    - The file remains the same up until the `runner.with_exec` command.
    - Remove the command `out = await runner.with_exec(["npm", "test", "--", "--watchAll=false"]).stderr()` and add the following line. This is the same command except the result is assigned to the `test` object.
    - Remove the `print(out)` command. This statement is reintroduced later in the new program.

    ```file {title="~/hello-dagger/ci/main.py" lang="python"}
        test = runner.with_exec(["npm", "test", "--", "--watchAll=false"])
    ```

2.  Add new instructions to build the application. Include the following details.

    - Use the `with_exec` method to define `npm run build` as the build command.
    - Store the outcome in the `/build` directory of the container using the `directory` method. The new directory is assigned to `build_dir`.
    - The `export` method writes the contents of the directory back to the `./build` directory on the host. The `await` keyword tells the pipeline to wait for the activity to complete before proceeding.
    - The `entries` method extracts the full list of directories from the `build` directory and writes the list back to the console.

    ```file {title="~/hello-dagger/ci/main.py" lang="python"}
    # build application
        build_dir = (
            test.with_exec(["npm", "run", "build"])
            .directory("./build")
        )

        await build_dir.export("./build")
        e = await build_dir.entries()
        print(f"build dir contents:\n{e}")

    anyio.run(main)
    ```

3.  After the new build section is added, the entire file should resemble the following example.

    ```file {title="~/hello-dagger/ci/main.py" lang="python"}
    import sys
    import anyio
    import dagger

    async def main():
        config = dagger.Config(log_output=sys.stdout)

        async with dagger.Connection(config) as client:
            source = (
                client.container()
                .from_("node:16-slim")
                .with_directory(
                    "/src",
                    client.host().directory("."),
                    exclude=["node_modules/", "ci/"],
                )
            )

            runner = source.with_workdir("/src").with_exec(["npm", "install"])

            test = runner.with_exec(["npm", "test", "--", "--watchAll=false"])

            build_dir = (
                test.with_exec(["npm", "run", "build"])
                .directory("./build")
            )

            await build_dir.export("./build")
            e = await build_dir.entries()
            print(f"build dir contents:\n{e}")

    anyio.run(main)
    ```

4.  Return to the `hello-dagger` directory and run the Python script again. The script displays the list of directories inside the build directory. The first part of the script should run more quickly because the container does not have to be downloaded. But the build process typically takes about a minute to finish.

    ```command
    cd ~/hello-dagger
    python3 ci/main.py
    ```

    ```output
    build dir contents:
    ['asset-manifest.json', 'favicon.ico', 'index.html', 'logo192.png', 'logo512.png', 'manifest.json', 'robots.txt', 'static']
    ```

### Publish the Container to a Registry

At this point, the Dagger pipeline creates, tests, and builds the application. The pipeline is already very useful and could even be considered complete at this point. However, Dagger can also publish the container to a registry to create an even more optimized workflow.

Before publishing the container, the application build is copied into an `nginx` container. Any authentication details must be defined in advance and included as part of the `publish` method. To publish the application, follow these steps.

1.  Most of the script does not have to change. However, the `random` package has to be imported. `random` is used to generate a unique name for the container.

    ```file {title="~/hello-dagger/ci/main.py" lang="python"}
    import random
    ```

2.  The file remains the same until the build stage. The following changes are required.

    - Do not assign the result of the build to the `build_dir` variable. Instead, wait for all build activities, including the directory export back to the host, to complete.
    - Replace the command assigning the directory to `build_dir` with the following lines.
    - Remove the remainder of the `main` function, up to the command `anyio.run(main)`. Delete the two asynchronous `await` directives and the `print` command.

    ```file {title="~/hello-dagger/ci/main.py" lang="python"}
    await (
            test.with_exec(["npm", "run", "build"])
            .directory("./build")
            .export("./build")
        )
    ```

3.  The publishing step can be accomplished in one fairly detailed instruction. Note the following details.

    - This command constructs a new container based on the `nginx:1.23-alpine` image. Use the syntax `client.container().from_("nginx:1.23-alpine")` to build the container.
    - Use the `.with_directory` method to write the `build` directory to the root of the NGINX directory inside the container.
    - Publish the container to the registry using the `publish` method. Specify the name of the target registry and provide a name for the image.
    - To ensure the container receives a unique name, use the `random` function to generate a statistically unlikely identifier for the container.

    {{< note >}}
    This example publishes the container the anonymous [ttl.sh](https://ttl.sh/) registry. The ttl registry is designed for temporary use and does not require authentication, so it is insecure and not a good choice for sensitive information. To store the container in a more secure registry, replace `ttl.sh` with the domain name of the registry.

    Most other registries require a user name and password. To integrate registry authentication into the script, follow the example required in the [Dagger Cookbook](https://docs.dagger.io/7442989/cookbook/#publish-image-to-registry). Define a password secret, call the `with_registry_auth` method with the name of the registry and the secret, and publish the container using a valid user name.
    {{< /note >}}

    ```file {title="~/hello-dagger/ci/main.py" lang="python"}
            image_ref = await (
                client.container()
                .from_("nginx:1.23-alpine")
                .with_directory("/usr/share/nginx/html", client.host().directory("./build"))
                .publish(f"ttl.sh/hello-dagger-demo-{random.randint(0, 10000000)}")
            )
        print(f"Published image to: {image_ref}")

    anyio.run(main)
    ```

4.  The entire file should be similar to the following example.

    ```file {title="~/hello-dagger/ci/main.py" lang="python"}
    import random
    import sys
    import anyio
    import dagger

    async def main():
        config = dagger.Config(log_output=sys.stdout)

        async with dagger.Connection(config) as client:
            source = (
                client.container()
                .from_("node:16-slim")
                .with_directory(
                    "/src",
                    client.host().directory("."),
                    exclude=["node_modules/", "ci/"],
                )
            )

            runner = source.with_workdir("/src").with_exec(["npm", "install"])

            test = runner.with_exec(["npm", "test", "--", "--watchAll=false"])

            await (
                test.with_exec(["npm", "run", "build"])
                .directory("./build")
                .export("./build")
            )

            image_ref = await (
                client.container()
                .from_("nginx:1.23-alpine")
                .with_directory("/usr/share/nginx/html", client.host().directory("./build"))
                .publish(f"ttl.sh/hello-dagger-demo-{random.randint(0, 10000000)}")
            )
        print(f"Published image to: {image_ref}")

    anyio.run(main)
    ```

5.  From the `hello-dagger` directory, run the Python script again. The script builds the container and pushes it out to the registry. The whole process might take a few minutes to complete. When complete, the script displays the name and tag generated for the image. Make note of the full container name and tag for future use.

    ```command
    cd ~/hello-dagger
    python3 ci/main.py
    ```

    ```output
    Published image to: ttl.sh/hello-dagger-demo-5067894@sha256:eb8dbf08fb05180ffbf56b602ee320ef5aa89b8f972f553e478f6b64a492dd50
    ```

6.  Confirm the container has been successfully built and uploaded. Use the `docker run` command to pull the container back to the host and run the application. Specify the exact container name and address indicated in the output of the `main.py` script. Navigate to port `8080` of the node, using either the IP address or a fully qualified domain name. The browser should display a "Welcome to Dagger" web page.

    ```command
    docker run -p 8080:80 ttl.sh/hello-dagger-demo-5067894@sha256:eb8dbf08fb05180ffbf56b602ee320ef5aa89b8f972f553e478f6b64a492dd50
    ```

## Conclusion

Dagger provides a multi-language framework for CI/CD automation in a containerized context. It includes capabilities to construct a pipeline that assembles, tests, builds, and publishes an application using a single script. Dagger includes SDKs for Python, Go, and Node.js, along with a GraphQL API for low-level integration with other languages. For more information on how to use Dagger, consult the [Dagger Documentation](https://docs.dagger.io/).