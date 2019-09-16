# Contribute to Linode

This guide describes how to write and submit a guide for the Linode docs. If you would like to write on a topic, please visit our [Contribute](http://www.linode.com/contribute) page to choose a topic and submit a writing sample. When you have received an email notifying you that your topic has been accepted, you are ready to follow the steps in this guide.

## Fork the Linode Library

All of our guides are stored in the [github.com/linode/docs](https://github.com/linode/docs) repository. You will need to clone this repository to your local computer.

For more information about using Git, refer to the [official Git documentation](https://git-scm.com/documentation). If you're a Git beginner, both [GitHub](https://guides.github.com/) and [GitLab](https://docs.gitlab.com/ee/gitlab-basics/README.html) offer excellent primers to get you started.

1.  On Github, navigate to the [linode/docs](https://github.com/linode/docs) repository. Click fork on the top right corner.

2.  Clone your fork of the repository. Replace `YOUR-USERNAME` with your Github username. This example creates a `linode-docs` directory:

        git clone https://github.com/YOUR-USERNAME/docs linode-docs

    This may take a few minutes to copy all of the files and images to your machine.

3.  Navigate to the project directory:

        cd linode-docs

## Install Hugo

The Linode documentation library is built using [Hugo](http://gohugo.io), an open-source static site generator. In order to preview your guide before submission, you will need to install Hugo on your local computer.

Install a version of Hugo newer than 0.30. Earlier versions of Hugo will not render the site correctly.

### OSX

On OSX, the easiest way to install Hugo is with [Homebrew](https://brew.sh/):

    brew install hugo

### Linux

Go to the [Hugo releases](https://github.com/gohugoio/hugo/releases) page and download the most up to date binary for your platform. Replace each instance of `v0.31.1` in this example with the newest version:

    curl -OL https://github.com/gohugoio/hugo/releases/download/v0.31.1/hugo_0.31.1_Linux-64bit.tar.gz
    tar -xvzf hugo_0.31.1_Linux-64bit.tar.gz
    sudo mv hugo /usr/local/bin

### Windows

Use [Chocolatey](https://chocolatey.org/) to install Hugo on Windows:

    choco install hugo -confirm

## Create a New Guide

This section takes you through the process of creating a new guide using the topic of installing nginx on Debian as an example. You can use a [Hugo archetype](https://gohugo.io/content-management/archetypes/) to simplify the process.

1.  Checkout the develop branch:

        git checkout develop

2.  Update the develop branch with the latest changes. If this is the first time creating a new guide, you will have to first add the docs repository as a remote:

        git remote add upstream https://github.com/linode/docs.git

    Update the develop branch:

        git pull upstream develop

3.  Create a new branch for your guide:

        git checkout -b nginx-on-debian

4.  From the root of the Docs repository, run the following command. Specify the location and title of your guide; the example nginx guide should be located in `web-servers/nginx`. This will create a markdown file populated with YAML front matter:

        hugo new web-servers/nginx/how-to-install-nginx-on-debian/index.md --kind content

    This will create a subdirectory with the guide's intended url, with an `index.md` file inside that will hold the guide's contents:

        /Users/your-macbook-user/linode-docs/docs/web-servers/nginx/how-to-install-nginx-on-debian/index.md created

    Any images should be added inside this directory as well. Note that the guide is created under a `docs/` subdirectory that's within the Docs repository; all guides will be under this subdirectory. The root of the Docs repository itself contains related information: Hugo's configuration file, theme information, unit testing information, etc.

5.  Start the Hugo server:

        hugo server

    This starts a local server you can use to view the Linode library in your browser on `http://localhost:1313/docs/`.

6.  In a web browser, navigate to the location of your new guide. The example nginx guide will be located at `http://localhost:1313/docs/web-servers/nginx/how-to-install-nginx-on-debian`.

## Run Tests

The `ci/` directory contains tests written in Python to ensure a given guide meets some of Linode's basic guidelines. Python 3.4 or newer is required to run these tests.

1.  Using a virtual environment to download dependencies is highly recommended. Install a virtual environment using [Anaconda/Miniconda](https://www.anaconda.com/download/#macos) or [Virtualenv](https://virtualenv.pypa.io/en/stable/).

2.  Use pip to install all the requirements:

        pip install -r ci/requirements.txt

3.  Run all of the tests in `ci/`:

        python -m pytest ci/

4.  Use the `-rs` flag to display the reasons for any skipped tests:

        python -m pytest -rs ci/

## Write and Submit

Your local Hugo development server has hot-reloading enabled, so you will be able to view changes to your guide as you save them. Please see our [Linode Writer's Formatting guide](https://www.linode.com/docs/linode-writers-formatting-guide/) for more information.

Images should be placed in the guide's subdirectory and linked using their filename as the relative URL: `![Image Title](image.png)`.

1.  Commit your changes to your local branch:

        git add docs/web-servers/nginx/how-to-install-nginx-on-debian/
        git commit -m "Initial draft of guide"

2.  Push the local branch to your fork:

        git push --set-upstream origin nginx-on-debian

3.  Go to `https://github.com/linode/docs` and open a pull request.

Your guide is now submitted. Thank you for contributing to Linode! A member of the content team will review your guide and contact you if any changes are required.
