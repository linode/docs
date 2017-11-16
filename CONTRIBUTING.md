# Contribute to Linode

This guide describes how to write and submit a guide for the Linode docs. If you would like to write on on a topic, please visit our [Contribute](http://www.linode.com/contribute) page to choose a topic and submit a writing sample. When you have received an email notifying you that your topic has been accepted, you are ready to follow the steps in this guide.


## Fork the Linode Library

All of our guides are stored in the [github.com/linode/docs](https://github.com/linode/docs) repository. You will need to clone this repository to your local computer:

1.  On Github, navigate to the [linode/docs](https://github.com/linode/docs) repository. Click fork on the top right corner.

2.  If you are unfamiliar with Git, refer to the official documentation on setting up [Git](https://help.github.com/articles/set-up-git/).

3.  Clone your fork of the repository. Replace `YOUR-USERNAME` with your Github username:

        git clone https://github.com/YOUR-USERNAME/docs

4.  Navigate to the project directory:

        cd docs

## Install Hugo

The Linode documentation site is built using [Hugo](http://gohugo.io), a static site generator. In order to preview your guide before submission, you will need to install Hugo on your local computer.

We recommend using Hugo version >=0.30. Earlier versions will not render our documentation correctly.

### OSX

On OSX, the easiest way to install Hugo is by using [Homebrew](https://brew.sh/):

    brew install hugo

### Linux

For other platforms, go to the [Hugo releases](https://github.com/gohugoio/hugo/releases) page and download the most up to date binary for your platform.

    curl -OL https://github.com/gohugoio/hugo/releases/download/v0.30.2/hugo_0.30.2_Linux-64bit.tar.gz
    tar -xvzf hugo_0.30.2_Linux-64bit.tar.gz
    sudo mv hugo /usr/local/bin

### Windows

Use Chocolatey(https://chocolatey.org/) to install Hugo on Windows.

    choco install hugo -confirm

## Create a New Guide

This section will take you through the process of creating a new guide using the topic of installing nginx on Debian as an example. You can use a Hugo [archetype](https://gohugo.io/content-management/archetypes/) to simplify the process

1.  Create a new branch for your guide:

        git checkout -b nginx-on-debian

2.  From the root of the `docs` repo, run the following command. Specify the location and title of your guide; the example nginx guide should be located in `web-servers/nginx`. This will create a markdown file populated with YAML front matter.

        hugo new web-servers/nginx/how-to-install-nginx-on-debian.md --kind content

3.  Start the Hugo server. View the Linode library on a local server in your browser on `http://localhost:1313/docs/`.

        hugo server

4.  Navigate to the location of your new guide. The example nginx guide will be located at `http://localhost:1313/docs/web-servers/nginx/how-to-install-nginx-on-debian`.

## Run Tests

The `ci/` directory contains tests written in Python to ensure a given guide meets some of Linode's basic guidelines. Python 3.4 and above is required to run these tests.

1.  Using a virtual environment to download dependencies is highly recommended. Install a virtual environment using [Anaconda/Miniconda](https://www.anaconda.com/download/#macos) or [Virtualenv](https://virtualenv.pypa.io/en/stable/).

2.  Use pip to install all the requirements.

        pip install -r ci/requirements.txt

3.  Run all of the tests in `ci/` by:

        python -m pytest ci/

4.  Adding an `-rs` flag will display the reasons for skipped tests.

        python -m pytest -rs ci/

## Write and Submit

Your local Hugo development server has hot-reloading enabled, so you will be able to view changes to your guide as you write them. Please see our [Linode Writer's Formatting guide](/docs/linode-writers-formatting-guide/) for more information.

If your guide requires any images, these will go in the `content/assets` folder. Create a new directory for your guide and place all of the images there.

1.  Commit your changes to your local branch:

        git add how-to-install-nginx-on-debian.md
        git commit -m "Initial draft of guide"

2.  Push the local branch to your fork:

        git push --set-upstream origin nginx-on-debian

3.  Go to `https://github.com/linode/docs` and open a pull request.

Your guide is now submitted. Thank you for contributing to Linode! Our content team will review your guide and contact you if any changes are needed. If you have any questions, please feel free to email us at [docs@linode.com](mailto:docs@linode.com).

