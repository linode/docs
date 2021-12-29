# Contribute to Linode

This guide describes how to write and submit a guide for the Linode docs. If you would like to write on a topic, please visit our [Contribute](http://www.linode.com/contribute) page to choose a topic and submit a writing sample. When you have received an email notifying you that your topic has been accepted, you are ready to follow the steps in this guide.

## Fixing an issue

If you want to start contributing by helping us correct existing issues, go to our [GitHub issues page](https://github.com/linode/docs/issues) and look for issues with the label ```help wanted```. Read through the comments and make sure there is not an open pull request against the issue, and that nobody has left a comment stating that they are working on the issue (3 days without activity is a good rule of thumb). Leave a comment stating that you would like to work on the issue.

## Install prerequisites

### Install Go

Some parts of the Linode documentation environment will require the [GO programming language](https://golang.org/). This guide was created using GO 1.15.3, and the install steps included will be for this specific version:

#### Install Go on macOS and Windows

The GO package can be found on the [GO downloads page](https://golang.org/dl/). On macOS, download the `go1.15.3.darwin-amd64.pkg` installer. On Windows, download the `go1.15.3.windows-amd64.msi` installer. Once the installer is downloaded, open it.

The installer prompts you to make changes to your system. Once the installation is complete, enter the following command in your terminal to verify the version of GO that you're currently running:

    go version

#### Install Go on Linux

Download the Linux binary for GO and extract it into the `/usr/local` folder:

    wget https://golang.org/dl/go1.15.3.linux-amd64.tar.gz
    tar -C /usr/local -xzf go1.15.3.linux-amd64.tar.gz

Add `/usr/local/go/bin` to the PATH variable:

    export PATH=$PATH:/usr/local/go/bin

You can ensure that go has been installed by checking the version currently in use:

    go version

### Install Node and NPM

To support the JavaScript runtime environment used by the Linode documentation site, Node v14.18.1 must be installed on your system.

#### Install Node on macOS and Linux

In order to install Node on Linux and macOS, we recommend using the [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm) to switch between other versions of Node you may be using now or may use in the future.

NVM can be installed by entering the following command, which will download and run an install script:

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash

You may need to exit and create a new command line session before NVM will work:

    exit

Next, use NVM to both install NVM and set it as the version of Node that you're actively using:

    nvm install 14.18.1
    nvm use 14.18.1

#### Install Node on Windows

To Install Node 14.18.1 on Windows, navigate to the [downloads page for this release](https://nodejs.org/download/release/v14.18.1/) and install the appropriate `.msi` installer file for your type of processor (32-bit or 64-bit). Open the file and follow the prompts to complete the installation process. To confirm that Node and NPM has been installed successfully, open up your command prompt and enter the following command to check your version:

    node -v
    npm -v

### Install Hugo

The Linode documentation library is built using [Hugo](http://gohugo.io), an open-source static site generator. In order to preview your guide before submission, you need to install Hugo on your local computer. The library is compatible with **Hugo 0.83.1** or newer.

Note: the site's testing suite has not been run with Hugo versions after 0.83.1, but it will likely build normally with newer versions. If you observe any issues on a newer version, please [file an issue](https://github.com/linode/docs/issues) in the docs GitHub repository.

#### Install Hugo on macOS

On macOS, the easiest way to install Hugo is with the [Homebrew](https://brew.sh/) package manager. If you don't have Homebrew installed already, run:

    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

Then run this command to install Hugo:

    brew install hugo

#### Install Hugo on Linux

Go to the [Hugo releases page on GitHub](https://github.com/gohugoio/hugo/releases/) and download the most up to date binary for your platform. These commands download the 64 bit binary of Hugo version 0.83.1 for Linux and place it in `/usr/local/bin`:

    curl -OL https://github.com/gohugoio/hugo/releases/download/v0.83.1/hugo_0.83.1_Linux-64bit.tar.gz
    tar -xvzf hugo_0.83.1_Linux-64bit.tar.gz
    sudo mv hugo /usr/local/bin

#### Install Hugo on Windows

Use [Chocolatey](https://chocolatey.org/) to install Hugo on Windows:

    choco install hugo

## Fork and Clone the Linode Library

All of our guides are stored in the [github.com/linode/docs](https://github.com/linode/docs) repository. You will need to clone this repository to your local computer.

For more information about using Git, refer to the [official Git documentation](https://git-scm.com/documentation). If you're a Git beginner, both [GitHub](https://guides.github.com/) and [GitLab](https://docs.gitlab.com/ee/gitlab-basics/README.html) offer excellent primers to get you started.

1.  On Github, navigate to the [linode/docs](https://github.com/linode/docs) repository. Click fork on the top right corner.

1.  Clone your fork of the repository. Replace `YOUR-USERNAME` with your Github username. This example creates a `linode-docs` directory:

        git clone https://github.com/YOUR-USERNAME/docs linode-docs

    This may take a few minutes to copy all of the files and images to your machine.

1.  Navigate to the project directory:

        cd linode-docs

1.  After you first clone the repository, you should be on the `develop` branch by default:

        git status

    ```
    On branch develop
    Your branch is up-to-date with 'origin/develop'.

    nothing to commit, working directory clean
    ```

1.  Add the `linode/docs` repository that you forked from as the `upstream` [Git remote](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes) for your local repository:

        git remote add upstream https://github.com/linode/docs.git

1.  Install the Node dependencies for the repository:

        npm install

## Create a New Guide

This section takes you through the process of creating a new guide, using the topic of installing nginx on Debian as an example. You will use a [Hugo archetype](https://gohugo.io/content-management/archetypes/) to simplify the process.

1.  Checkout the develop branch:

        git checkout develop

1.  Update the develop branch with the latest changes from the upstream repository:

        git pull upstream develop

1.  Create a new branch for your guide:

        git checkout -b nginx-on-debian

1.  From the root of the Docs repository, run the following example command:

        hugo new guides/web-servers/nginx/how-to-install-nginx-on-debian/index.md --kind content

    - By running this command, you're specifying that the guide should be listed under the `guides/web-servers/nginx/` section.

    - The guide itself will later be published under the `/docs/guides/how-to-install-nginx-on-debian/` URL path. Note that the URL for the guide will *not* include the `web-servers/nginx/` section information. This is intentional, as the docs website publishes guides under a flattened URL structure.

    - The `index.md` file will contain the markdown content for your guide.

    - The `--kind content` option specifies that the `content` archetype will be used to populate the new markdown file with sample content. The archetypes available can be found under the `archetypes/` directory in the repository.

1.  The command will output the location of your new guide on your filesystem:

        /Users/your-computer-user/linode-docs/docs/guides/web-servers/nginx/how-to-install-nginx-on-debian/index.md created

    Note that the guide is created under a `docs/` subdirectory that's within the docs repository (e.g. `/Users/your-computer-user/linode-docs/docs/`), which can be a little confusing initially. The root of the docs repository (e.g. `/Users/your-computer-user/linode-docs/`) contains other non-content files that are needed for publishing the site: Hugo's configuration file, theme information, unit testing information, etc.

1.  Start the local Hugo web server:

        hugo server

    This starts a local server you can use to view the Linode library in your browser on `http://localhost:1313/docs/`.

1.  In a web browser, navigate to the location of your new guide. The example nginx guide will be located at `http://localhost:1313/docs/guides/how-to-install-nginx-on-debian/`.

    Note that you will not be able to navigate to the new guide within the local website's Explore Docs menu, or through the search feature. This is because these features rely on a central search index, and this index is not updated until the production docs website is published.

## Write and Submit

Your local Hugo development server has hot-reloading enabled, so you will be able to view changes to your guide as you save them. Please see our [Linode Writer's Formatting guide](https://www.linode.com/docs/linode-writers-formatting-guide/) for more information.

Any images that you include in the guide should be added inside the same directory as the new `index.md` file. Images should be linked to using their filename as the relative URL: `![Image Title](image.png)`.

1.  Commit your changes to your local branch:

        git add docs/guides/web-servers/nginx/how-to-install-nginx-on-debian/
        git commit -m "Initial draft of guide"

1.  Push the local branch to your fork:

        git push --set-upstream origin nginx-on-debian

1.  Go to `https://github.com/linode/docs` and open a pull request.

Your guide is now submitted. Thank you for contributing to Linode! A member of the content team will review your guide and contact you if any changes are required.

## Run Tests

Tests are automatically run by Travis CI for every pull request that is submitted. To view the results of these tests, navigate to the end of the pull request's conversation, and then click on the **details** link for the **Travis CI - Pull Request** check. You may need to click the **Show all checks** link to see this feature. After clicking the **details** link, an overview of the Travis CI tests appears.

In the Travis CI overview, under the **Jobs and Stages** header, three tests are present:

- Vale: An automatic spell-checking service

- Blueberry: A custom script which ensures that a guide's frontmatter section follows certain guidelines

- Docs404: A custom script that scrapes the site and reports any internal 404 links. This script does not currently check for external 404 links.

To review the output of a given test, click on the link for the corresponding Travis CI job.