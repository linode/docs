# In this Guide

- [How to download and install the Linode Docs library](#installing-the-docs-library)

- [How to contribute to the library](#contributing-to-the-docs-library)

# Installing the Docs Library

Linode's documentation library uses a static site generator, [Hugo](https://gohugo.io/), to build the website from Markdown (`.md`) files. Building the site requires Node.js, NPM, and Go.

## Install prerequisites

### Install Go

Some parts of the Linode documentation environment require the [GO programming language](https://golang.org/). In most cases, you should install the latest version of Go.

#### Install Go on macOS and Windows

The Go package can be found on the [official downloads page](https://go.dev/dl/). Install the latest package available for your operating system. Since the latest version that is available at the time of this writing is 1.19.1, links to that version are used below:

- **macOS (Intel):** Use the x.darwin-amd64.pkg file ([go1.19.1.darwin-amd64.pkg](https://go.dev/dl/go1.19.1.darwin-amd64.pkg))
- **macOS (Apple Silicon):** Use the x.darwin-arm64.pkg file ([go1.19.1.darwin-arm64.pkg](https://go.dev/dl/go1.19.1.darwin-arm64.pkg))
- **Linux (64-bit):** Use the x.linux-amd64.tar.gz file ([go1.19.1.linux-amd64.tar.gz](https://go.dev/dl/go1.19.1.linux-amd64.tar.gz))
- **Windows (64-bit):** Use the x.windows-amd64.msi file ([go1.19.1.windows-amd64.msi](https://go.dev/dl/go1.19.1.windows-amd64.msi))

**For Windows and macOS** users, click the link above to download the software and run it.

**For Linux** users, run the following commands to download the file, extract it into the `/usr/local` folder, and add the folder to your PATH variable:

    wget https://go.dev/dl/go1.19.1.linux-amd64.tar.gz
    tar -C /usr/local -xzf go1.19.1.linux-amd64.tar.gz
    export PATH=$PATH:/usr/local/go/bin

You can ensure that go has been installed by checking the version currently in use:

    go version

### Install Node.js

To support the JavaScript runtime environment used by the Linode documentation site, Node.js must be installed on your system.

#### Install Node.js on macOS and Linux

To install Node.js on Linux and macOS, we recommend using the [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm) to switch between other versions of Node you may be using now or may use in the future.

NVM can be installed by entering the following command, which downloads and runs an install script.

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

Close out of your terminal session and open up a new one. You may receive a warning similar to the following: `zsh compinit: insecure directories, run compaudit for list. Ignore insecure directories and continue [y] or abort compinit [n]? y`. If you do, enter `y` to access your terminal and then run `compaudit` for a list of affected directories. Likely, the directories are within `/usr/local/share/zsh`. Run the following command against that folder to update the permissions and prevent the same warning message from appearing the next time you open a terminal session.

    chmod -R 755 /usr/local/share/zsh

Using NVM, install the latest Node.js 18.x release and set it as the currently active version.

    nvm install 18
    nvm use 18

You can confirm the version of NVM and Node.js by running the following commands.

    nvm -v
    node -v

#### Install Node.js on Windows

To Install the latest Node.js LTS release on Windows, navigate to the [downloads page](https://nodejs.org/en/download/) and install the appropriate `.msi` installer file for your type of processor (32-bit or 64-bit). Open the file and follow the prompts to complete the installation process. To confirm that Node and NPM has been installed successfully, open up your command prompt and enter the following command to check your version:

    node -v
    npm -v

### Install Hugo

The Linode documentation library is built using [Hugo](http://gohugo.io), an open-source static site generator. In order to preview your guide before submission, you need to install Hugo on your local computer. This site currently uses **Hugo v0.111.3**. To remain consistent in the testing and development process, it's recommended to install this version instead of using a newer version.

Note: If you observe any issues on a newer version, please [file an issue](https://github.com/linode/docs/issues) in the docs GitHub repository.

#### macOS and Linux

To install Hugo, download the appropriate binary for your system, extract it, and move it to a directory within your PATH.

1.  Download the file below that corresponds with the OS and platform on your local system. If you don't see your system on this list, you can find additional files on the [Hugo v0.111.3 GitHub release page](https://github.com/gohugoio/hugo/releases/tag/v0.111.3) under **Assets**.

    - **macOS:** https://github.com/gohugoio/hugo/releases/download/v0.111.3/hugo_extended_0.111.3_darwin-universal.tar.gz
    - **Linux:** https://github.com/gohugoio/hugo/releases/download/v0.111.3/hugo_extended_0.111.3_Linux-64bit.tar.gz

    You can download this file through a terminal using the curl command, replacing [url] with the URL for your platform:

        curl -OL [url]

1.  Extract the archive file using the `tar` command, replacing *[file]* with the correct filename.

        tar -xvzf [file]

    Once extracted, there should be a `hugo` file in the same directory. This is used to run Hugo.

1.  Move the hugo file to a location within your system's PATH variable. For most systems, the `/usr/local/bin` path can be used.

        mv hugo /usr/local/bin

    You may need to use `sudo` to run this command successfully:

        sudo mv hugo /usr/local/bin

    If you do not have permission to move the file to one of the system folders, you can instead add it to a location in your home directory and then set that location in your PATH:

        mkdir ~/bin
        mv hugo ~/bin
        export PATH=$HOME/bin:$PATH

    Make sure to also add the final `export PATH` line in the above snippet to your terminal's configuration file, like `~/.zshrc` on macOS.

1. Test Hugo by running `hugo version`. This should output a long string indicating that version 0.111.3 is being used. If not, review the prior steps and the [Install Hugo from Tarball](https://gohugo.io/getting-started/installing/#install-hugo-from-tarball) section of the Hugo documentation.

#### Windows

While macOS and Linux are preferred by most of the core Linode Docs team, it's also possible to use Hugo on Windows.

1. Download the [hugo_0.111.3_Windows-64bit.zip](https://github.com/gohugoio/hugo/releases/download/v0.111.3/hugo_0.111.3_Windows-64bit.zip) file. Additional files for other operating systems can be found on the [Hugo v0.111.3 GitHub release page](https://github.com/gohugoio/hugo/releases/tag/v0.111.3) under **Assets**.

1. Extract the file to the directory you'd like to install Hugo under, such as `C:\Hugo\bin`.

1.  Add the directory to your PATH. In powershell, this can be accomplished with the following command:

        set PATH=%PATH%;C:\Hugo\bin

## Fork and Clone the Linode Library

All of our guides are stored in the [github.com/linode/docs](https://github.com/linode/docs) repository. You will need to clone this repository to your local computer.

For more information about using Git, refer to the [official Git documentation](https://git-scm.com/documentation). If you're a Git beginner, both [GitHub](https://guides.github.com/) and [GitLab](https://docs.gitlab.com/ee/gitlab-basics/README.html) offer excellent primers to get you started.

1.  On Github, navigate to the [linode/docs](https://github.com/linode/docs) repository. Click fork on the top right corner.

1.  Clone your fork of the repository using either the [HTTPS URL](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls) or the [SSH URL](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories#cloning-with-ssh-urls). In the commands below, replace `USERNAME` with your GitHub username.

    -   **HTTPS URL:** When prompted for your password, enter your personal access token from GitHub. For instructions on creating this token, see [Creating a Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-fine-grained-personal-access-token).

            git clone https://github.com/USERNAME/docs linode-docs

    -   **SSH URLs:** Before continuing with SSH URLs, you should first have a public/private key pair installed on your local system. Then, you must upload your public key to your GitHub account. When running the command below, you will be prompted for a password. Enter your SSH passphrase in this prompt. For further instructions, [Adding a new SSH key to your account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).

            git clone git@github.com:USERNAME/docs.git linode-docs

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

    - **HTTPS URL:** `git remote add upstream https://github.com/linode/docs.git`
    - **SSH URL:** `git remote add upstream git@github.com:linode/docs.git`

1.  Install the Node dependencies for the repository:

        npm install

# Contributing to the Docs Library

This guide describes how to write and submit a guide for the Linode docs. If you would like to write on a topic, please visit our [Contribute](http://www.linode.com/contribute) page to choose a topic and submit a writing sample. When you have received an email notifying you that your topic has been accepted, you are ready to follow the steps in this guide.

## Fixing an Issue

If you want to start contributing by helping us correct existing issues, go to our [GitHub Issues page](https://github.com/linode/docs/issues) and look for issues with the label ```help wanted```. Read through the comments and make sure there is not an open pull request against the issue, and that nobody has left a comment stating that they are working on the issue (3 days without activity is a good rule of thumb). Leave a comment stating that you would like to work on the issue.

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

    - The `index.md` file will contain the Markdown content for your guide.

    - The `--kind content` option specifies that the `content` archetype will be used to populate the new Markdown file with sample content. The archetypes available can be found under the `archetypes/` directory in the repository.

1.  The command will output the location of your new guide on your filesystem:

        /Users/your-computer-user/linode-docs/docs/guides/web-servers/nginx/how-to-install-nginx-on-debian/index.md created

    Note that the guide is created under a `docs/` subdirectory that's within the docs repository (e.g. `/Users/your-computer-user/linode-docs/docs/`), which can be a little confusing initially. The root of the docs repository (e.g. `/Users/your-computer-user/linode-docs/`) contains other non-content files that are needed for publishing the site: Hugo's configuration file, theme information, unit testing information, etc.

1.  Start the local Hugo web server:

        hugo server

    This starts a local server you can use to view the Linode library in your browser on `http://localhost:1313/docs/`.

    Note: The first time Hugo is run on your workstation, it needs to compile a cache of web-optimized images for each guide in the documentation library. This process can take 10-20 minutes. If you run Hugo again in the future, the cache from your first build is reused and the startup time is much faster.

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