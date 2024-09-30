---
slug: create-a-dagger-pipeline
title: "How to Create a Dagger Pipeline on Akamai"
description: "This guide explains how to create a CI/CD pipeline using Dagger and the Dagger Python SDK."
authors: ["Jeff Novotny"]
contributors: ["Jeff Novotny"]
published: 2023-08-19
modified: 2024-05-15
keywords: ['dagger sdk','how to use dagger','dagger python','ci/cd pipeline dagger']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Dagger](https://dagger.io/)'
- '[Dagger Documentation](https://docs.dagger.io/)'
- '[Dagger Quickstart](https://docs.dagger.io/648215/quickstart)'
- '[Dagger Python SDK](https://docs.dagger.io/sdk/python)'
- '[Dagger Go SDK](https://docs.dagger.io/sdk/go)'
- '[Dagger Node.js SDK](https://docs.dagger.io/sdk/nodejs)'
- '[Dagger on GitHub](https://github.com/dagger)'
- '[Dagger Cookbook for Registry Authentication](https://docs.dagger.io/7442989/cookbook/#publish-image-to-registry)'
- '[Harbor container registry](https://goharbor.io/)'
---

[Dagger](https://dagger.io/) is a free and open source application for automating *Continuous Integration/Continuous Delivery* (CI/CD) pipelines. It allows administrators and developers to create scripts to assemble, test, build, and even publish a project to a container registry. Dagger includes APIs for several programming languages, providing additional convenience. This guide supplies a brief introduction to Dagger and demonstrates how to create a simple Dagger pipeline.

## What is Dagger?

Dagger was originally created by the founder of Docker. It allows users to automate their production pipelines using the language they prefer. The Dagger interface allows users to generate, build, test, and containerize their applications through the use of a detailed SDK. Dagger runs the entire pipeline inside one or more containers, and requires the Docker BuildKit backend to operate. It is designed to be used as part of a CI/CD pipeline, which automates the entire application development life cycle. A mature CI/CD pipeline allows for a quicker, more efficient, and more robust delivery schedule.

The script first imports the Dagger package and opens a session to the Dagger engine. The script then transmits the pipeline requests to the engine using an internal protocol. For each request, the Dagger engine determines the operations required to compute the results. The various tasks are run concurrently for better performance. The results are then processed asynchronously and sent back to the script when everything is resolved. Results can be assigned to a variable and used as inputs to subsequent stages of the pipeline.

In addition to cross-language support, Dagger provides some of the following advantages:

-   It allows developers to integrate automated tests directly into their pipeline.
-   Because it is developed using a standard programming language, a Dagger script is portable and system agnostic. It can run on any architecture.
-   Scripts can run locally or remotely.
-   Dagger caches results for later use to optimize performance.
-   It is fully compatible and thoroughly integrated with Docker. Docker assists Dagger in dependency management. Scripts are cross-compatible with many other CI/CD environments.
-   Relatively little code is required to develop a complex pipeline.
-   It can optionally use the Dagger CLI extension to interact with the Dagger Engine from the command line.
-   Dagger is scalable and can simultaneously handle many highly detailed pipelines.

Because Dagger is a relatively new application, it does not yet have an extensive user base or many avenues for support. Although the Dagger SDK is very powerful, it is also complex and takes some time to learn.

Due to Dagger's multi-language support, developers can code their pipeline in their favorite language. It potentially provides the opportunity to use the same programming language as the one used to develop the application. The Dagger SDK/API is available in the following languages:

- **Python**
- **Go**
- **Node.js**
- **GraphQL**

Dagger recommends the Go SDK for those who are unsure which SDK to use. The GraphQL API is language agnostic. It can serve as a low-level framework for those who want to use a language without its own API.

For more background on Dagger, see the [Dagger Documentation](https://docs.dagger.io/) and the [Dagger Cookbook](https://docs.dagger.io/7442989/cookbook/).

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  To publish the container, you must have access to a container registry. This guide uses the open source [Harbor](https://goharbor.io/) registry to publish the container. However, it is possible to push the container to any container repository. For information on how to create a Harbor registry on a separate Compute Instance, see the guide on [Deploying Harbor through the Linode Marketplace](/docs/marketplace-docs/guides/harbor/). Before using Harbor, it is necessary to create a project named `dagger` to host the example container.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install Dagger

Dagger requires the use of Docker. This guide uses the Python SDK to compose the script. The Dagger module for Python is installed using `pip`, the Python package manager. This guide is written for Ubuntu 22.04 LTS users, but is generally applicable to most recent releases and other Linux distributions. To install Dagger, follow these steps.

1.  Install any updates to ensure the system is up to date:

    ```command
    sudo apt update -y && sudo apt upgrade -y
    ```

    Afterward, reboot the system if advised to do so.

1.  Ensure `git` is installed on the system:

    ```command
    sudo apt install git
    ```

1.  To prepare for the Docker v2 installation, remove any older releases of the application and then install some additional components:

    ```command
    sudo apt remove docker docker-engine docker.io containerd runc
    sudo apt install ca-certificates curl gnupg lsb-release
    ```

1.  Add the official Docker GPG key to help validate the installation:

    ```command
    sudo mkdir -m 0755 -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    ```

1.  Add the Docker repository to `apt`, then update the package list:

    ```command
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt update
    ```

1.  Install the latest release of Docker Engine and CLI, along with some related packages:

    ```command
    sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    ```

1.  To ensure Docker is operating correctly, run the `hello-world` container:

    ```command
    sudo docker run hello-world
    ```

    If everything is working, the container displays the message `Hello from Docker!`:

    ```output
    Hello from Docker!
    This message shows that your installation appears to be working correctly.
    ```

1.  Install the Dagger SDK for the appropriate programming language. This guide uses Python to create the example application, so the next steps explain how to download the Python SDK. Use `pip` to install the `dagger-io` module. If `pip` is not yet installed, it can be added using the command `sudo apt install python3-pip`. Python release 3.10 is required.

    {{< note type="warning" title="Required Options">}}
    Dagger uses Docker to create a container, but `sudo` is normally required to run Docker. This means the Python `dagger-io` package must be accessible to the root user. Unfortunately, Python installs modules locally by default. There are a couple of ways to work around this problem:

    The quickest method is to install the `dagger-io` package globally using the `pip -H` flag. This ensures it is accessible to all users. Unfortunately, using `pip` globally can lead to complex and confusing permission issues. This technique should be used with great care, especially in a multi-user environment. To install the package globally, use this command instead of the one below:

    ```command
    sudo -H pip install dagger-io
    ```

    A better workaround is to add the current user to the `docker` group. This allows the user to access Docker without root access, but this requires a reboot to take effect. This guide proceeds as if the user has been added to the `docker` group and installs `dagger-io` locally. To add the current user to the `docker` group, use the following command syntax, replacing `example-username` with your actual username:

    ```command
    sudo usermod -aG docker example-username
    ```
    {{< /note >}}

    ```command
    pip install dagger-io
    ```

    {{< note >}}
    SDKs are also available for Node.js and Go. To install the Go SDK, use the `go mod init main` and `go get dagger.io/dagger` commands. For the Node.js SDK, use `npm install @dagger.io/dagger --save-dev`.
    {{< /note >}}

## How to Create a Sample Dagger Pipeline

This guide uses the Python SDK to create an example Dagger CI/CD pipeline. To simplify the process, this guide uses the `hello-dagger` demo app to demonstrate the main steps. Dagger recommends using this application when learning how to create a pipeline. However, any application can be used for the demo, provided the appropriate script updates are made.

For more information on the Python SDK or to further customize the application, see the [Dagger Python SDK documentation](https://docs.dagger.io/sdk/python). See the [Dagger Quickstart demo](https://docs.dagger.io/593914/quickstart-hello/) for information on how to create this pipeline using either Go or Node.

To create a Dagger pipeline in Python, follow these steps.

### Download the Example Application

Dagger has developed a sample React application named `hello-dagger` as a teaching aid. To get started, download the application from GitHub using `git`.

1.  Clone the application from GitHub:

    ```command
    git clone https://github.com/dagger/hello-dagger.git
    ```

1.  Change to the new `hello-dagger` directory and create a new `ci` directory to contain the scripts:

    ```command
    cd hello-dagger
    mkdir ci
    ```

### Create and Test a Dagger Pipeline for the Application

The Dagger client enables users to create a multi-stage Python program to define, test, and build an application. This section of the tutorial does not yet publish the application. It is important to test it first to ensure it builds correctly. To create a new pipeline, follow these steps.

1.  Navigate to the `hello-dagger/ci` directory, create a new `main.py` Python project file, and open the file in the `nano` text editor:

    ```command
    cd ~/hello-dagger/ci
    nano main.py
    ```

1.  At the top of the file, add the required `import` statements, including an `import dagger` directive to import the Dagger SDK:

    ```file {title="~/hello-dagger/ci/main.py" lang="python"}
    import sys
    import anyio
    import dagger
    ```

1.  Define a `main` routine, create a Dagger configuration object, and define `stdout` as the output stream:

    ```file {title="~/hello-dagger/ci/main.py" lang="python" linenostart="5"}
    async def main():
        config = dagger.Config(log_output=sys.stdout)
    ```

1.  Create a Dagger client using `dagger.Connection`, passing it the `config` object as the default configuration. Create a new client container with the following parameters:

    - Base the container on the `node:16-slim` image using the `from_` method. This method also initializes the container.
    - Use the `with_directory` method to specify both the directory to use as the source and the mount location inside the container.
    - Specify the current directory as the source of the application using the string `client.host().directory(".")`.
    - Mount the application inside the `/src` directory of the container.
    - Exclude the extraneous `node_modules` and `ci` directories from this process.

    Add the following lines to the file to mount the source code at the `src` directory of a `node:16-slim` container:

    ```file {title="~/hello-dagger/ci/main.py" lang="python" linenostart="8"}
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

    {{< note >}}
    The Dagger Python SDK makes extensive use of a technique known as *method chaining*. The methods are processed in the order they appear. Subsequent methods act on the object returned in the previous method.
    {{< /note >}}

1.  The next phase of the pipeline uses `npm install` to install the application dependencies inside the container. The `with_workdir` method tells Dagger where inside the container to run the command. The `with_exec` method tells Dagger to run `npm install` at that location. Add the following lines to the script:

    ```file {title="~/hello-dagger/ci/main.py" lang="python" linenostart="19"}
    runner = source.with_workdir("/src").with_exec(["npm", "install"])
    ```

1.  The final section of the Python script automatically runs a test suite against the application. This command uses the `with_exec` method again, with `npm test --watchAll=false` as the test command. If an error results, details are printed to the console via the `stderr` stream and the pipeline terminates. At the end of the file, add a call to the `main` routine:

    ```file {title="~/hello-dagger/ci/main.py" lang="python" linenostart="21"}
            out = await runner.with_exec(["npm", "test", "--", "--watchAll=false"]).stderr()
            print(out)

    anyio.run(main)
    ```

1.  The entire file should look like this:

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

    Ensure the proper indentation of each line is maintained.

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Change back to the main `hello-dagger` project directory and run the Python script using `python3 ci/main.py`:

    ```command
    cd ~/hello-dagger
    python3 ci/main.py
    ```

    No errors should be seen and all `npm` tests should pass:

    ```output
    Test Suites: 1 passed, 1 total
    Tests:       1 passed, 1 total
    Snapshots:   0 total
    Time:        3.896 s
    Ran all test suites.
    ```

    {{< note >}}
    Because Dagger first has to ask Docker to download the `node:16-slim` container, it might take a couple minutes before the `npm install` command runs. Subsequent runs of this program take less time.
    {{< /note >}}

### Add a Build Stage to the Pipeline

After the main components of the pipeline have been created, as described in the previous section, it is time to add the build stage. Most of the `main.py` file remains the same in this version of the file. However, the output of the test phase is no longer sent to standard output. Instead, it feeds into the build stage of the pipeline. To add build directives to the file, follow these steps.

1.  Open the `main.py` file used in the previous section:

    ```command
    nano ~/hello-dagger/ci/main.py
    ```

1.  Make the following changes:

    -   The file remains the same up until the `runner.with_exec` command.
    -   Remove the command `out = await runner.with_exec(["npm", "test", "--", "--watchAll=false"]).stderr()` and add the following line. This is the same command except the result is assigned to the `test` object.
    -   Remove the `print(out)` command as this statement is reintroduced later in the new program.

    ```file {title="~/hello-dagger/ci/main.py" lang="python" linenostart="21"}
    test = runner.with_exec(["npm", "test", "--", "--watchAll=false"])
    ```

1.  Add new instructions to build the application to include the following details:

    -   Use the `with_exec` method to define `npm run build` as the build command.
    -   Store the outcome in the `/build` directory of the container using the `directory` method. The new directory is assigned to `build_dir`.
    -   The `export` method writes the contents of the directory back to the `./build` directory on the host. The `await` keyword tells the pipeline to wait for the activity to complete before proceeding.
    -   The `entries` method extracts the full list of directories from the `build` directory and writes the list back to the console.

    ```file {title="~/hello-dagger/ci/main.py" lang="python" linenostart="23"}
            build_dir = (
                test.with_exec(["npm", "run", "build"])
                .directory("./build")
            )

            await build_dir.export("./build")
            e = await build_dir.entries()
            print(f"build dir contents:\n{e}")

    anyio.run(main)
    ```

1.  After the new build section is added, the entire file should resemble the following example:

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

1.  Return to the `hello-dagger` directory and run the Python script again:

    ```command
    cd ~/hello-dagger
    python3 ci/main.py
    ```

    The script displays the list of directories inside the build directory:

    ```output
    build dir contents:
    ['asset-manifest.json', 'favicon.ico', 'index.html', 'logo192.png', 'logo512.png', 'manifest.json', 'robots.txt', 'static']
    ```

    {{< note >}}
    The first part of the script should run more quickly because the container does not have to be downloaded. However, the build process typically takes about a minute to finish.
    {{< /note >}}

### Publish the Container to a Registry

At this point, the Dagger pipeline creates, tests, and builds the application. The pipeline is already very useful and could even be considered complete. However, Dagger can also publish the container to a registry to create an even more optimized workflow.

Before publishing the container, the application build is copied into an `nginx` container. Any authentication details must be defined in advance.

This example publishes the guide to the Harbor registry. Harbor is a lightweight and easy to use container registry platform that can be installed on a separate system. It provides cloud storage, signing and scanning tools, security, access control, audit mechanisms, and container management. It allows administrators to have control over their own registry and keep it on the same network as their development systems. For more information on using the registry, see the [Harbor documentation](https://goharbor.io/docs/2.8.0/install-config/).

To publish the application, follow these steps.

1.  Open the main.py file again:

    ```command
    nano ~/hello-dagger/ci/main.py
    ```

1.  Directly beneath the start of the `async with dagger.Connection(config) as client:` block, add the password details. Use the `set_secret` method to provide the registry password. The parameters must be the string `password` in quotes, followed by the actual password for the Harbor account. The string `password` tells Dagger what type of secret is being defined. Assign the result to the `secret` variable.

    ```file {title="~/hello-dagger/ci/main.py" lang="python" linenostart="9"}
    secret = client.set_secret("password", "HARBORPASSWORD")
    ```

1.  The next change applies to the build stage. The following changes are required to this section of the pipeline:

    -   Do not assign the result of the build to the `build_dir` variable. Instead, wait for all build activities, including the directory export back to the host, to complete.
    -   Replace the command assigning the directory to `build_dir` with the following lines.
    -   Remove the remainder of the `main` function, up to the command `anyio.run(main)`. Delete the two asynchronous `await` directives and the `print` command.

    ```file {title="~/hello-dagger/ci/main.py" lang="python" linenostart="24"}
    await (
        test.with_exec(["npm", "run", "build"])
        .directory("./build")
        .export("./build")
    )
    ```

1.  Define a new container based on the `nginx:1.23-alpine` image and package the application into this container. Add the following details:

    -   This section creates a new container based on the `nginx:1.23-alpine` image. Use the syntax `client.container().from_("nginx:1.23-alpine")` to instantiate the container.
    -   Use the `.with_directory` method to write the `build` directory to the root `html` NGINX directory inside the container.
    -   Assign the container to the `ctr` variable.

    ```file {title="~/hello-dagger/ci/main.py" lang="python" linenostart="30"}
    ctr =  (
        client.container()
        .from_("nginx:1.23-alpine")
        .with_directory("/usr/share/nginx/html", client.host().directory("./build"))
    )
    ```

1.  To publish the container to the registry, use the `with_registry_auth` and `publish` methods. This example uses Harbor as the target registry, but the container can be published to any Docker-compatible registry. Add the following section to the file, accounting for the following changes:

    -   Enclose the details in an asynchronous `await` call.
    -   For the first parameter of the `with_registry_auth` method, supply the domain name of the registry in the format `registrydomainname/project/repository:tag`. Replace `registrydomainname` with the name of your Harbor domain, `project` with the project name, and `repository` with the name of the repository to publish to. The `tag` field is optional.
    -   For the remaining parameters, append a user name for the Harbor account along with the `secret` variable. In this example, the account name is `admin`.
    -   In this example, `example.com/dagger/daggerdemo:main` means the container is published to the `daggerdemo` repository inside the `dagger` project in the `example.com` registry. The container is tagged with the `main` tag.
    -   In the `publish` method, indicate where to publish the container. This information follows the same format as the registry information in `with_registry_auth` and should repeat the same details.

    ```file {title="~/hello-dagger/ci/main.py" lang="python" linenostart="36"}
            addr = await (
                ctr
                .with_registry_auth("example.com/dagger/daggerdemo:main", "admin", secret)
                .publish("example.com/dagger/daggerdemo:main")
            )
        print(f"Published image to: {addr}")

    anyio.run(main)
    ```

    {{< note >}}
    Before publishing a container to a Harbor registry, you must create a project to contain the container. This example publishes the container to the `daggerdemo` repository inside the `dagger` project. If `dagger` does not already exist, the request fails.
    {{< /note >}}

1.  The entire file should be similar to the following example. Replace `example.com` with the domain name of the Harbor registry and `HARBORPASSWORD` with the actual password for the registry.

    ```file {title="~/hello-dagger/ci/main.py" lang="python"}
    import sys
    import anyio
    import dagger

    async def main():
        config = dagger.Config(log_output=sys.stdout)

        async with dagger.Connection(config) as client:
            secret = client.set_secret("password", "HARBORPASSWORD")
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

            ctr =  (
                client.container()
                .from_("nginx:1.23-alpine")
                .with_directory("/usr/share/nginx/html", client.host().directory("./build"))
            )

            addr = await (
                ctr
                .with_registry_auth("example.com/dagger/daggerdemo:main", "admin", secret)
                .publish("example.com/dagger/daggerdemo:main")
            )
        print(f"Published image to: {addr}")

    anyio.run(main)
    ```

    Save the file and exit `nano` when finished.

1.  From the `hello-dagger` directory, run the Python script again. The script builds the container and pushes it out to the registry. The whole process might take a few minutes to complete. When complete, the script displays the name and tag generated for the image. Make note of the full container name and tag for future use.

    ```command
    cd ~/hello-dagger
    python3 ci/main.py
    ```

    ```output
    Published image to: example.com/dagger/daggerdemo:main@sha256:eb8dbf08fb05180ffbf56b602ee320ef5aa89b8f972f553e478f6b64a492dd50
    ```

1.  Confirm the container has been successfully built and uploaded. Use the `docker run` command to pull the container back to the host and run the application. Specify the exact container name and address indicated in the output of the `main.py` script.

    ```command
    docker run -p 8080:80 example.com/dagger/daggerdemo:main@sha256:eb8dbf08fb05180ffbf56b602ee320ef5aa89b8f972f553e478f6b64a492dd50
    ```

    Navigate to port `8080` of the node, using either the IP address or a fully qualified domain name. The browser should display a "Welcome to Dagger" web page.

## Conclusion

Dagger provides a multi-language framework for CI/CD automation in a containerized context. It includes capabilities to construct a pipeline that assembles, tests, builds, and publishes an application using a single script. Dagger includes SDKs for Python, Go, and Node.js, along with a GraphQL API for low-level integration with other languages. For more information on how to use Dagger, consult the [Dagger Documentation](https://docs.dagger.io/).