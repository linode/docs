![Linode logo](docs/assets/Linode-Logo-Black.png)

# Guides and Tutorials [![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-blue.svg)](https://creativecommons.org/licenses/by/4.0/) [![first-timers-only](http://img.shields.io/badge/first--timers--only-friendly-blue.svg)](http://www.firsttimersonly.com/) [![Build Status](https://api.travis-ci.com/linode/docs.svg?branch=develop)](https://travis-ci.com/linode/docs) [![GitHub release](https://img.shields.io/github/release/linode/docs.svg)](https://github.com/linode/docs/releases/latest)

<img align="right" width="100" height="100" src="docs/assets/Linode-Logo-Black.png">

###### [Contributing](CONTRIBUTING.md) | [Formatting Guide](https://linode.com/docs/linode-writers-formatting-guide/)

> Linode maintains a library of tutorials hosted at https://www.linode.com/docs/. The guides serve as an easy to follow reference for Linux, web servers, development, and more.

### Quickstart

1. Fork and clone this repository.

1. Download and install [Hugo version v0.105.0](https://github.com/gohugoio/hugo/releases/tag/v0.105.0). Installation instructions for different operating systems are available in the [Hugo documentation library](https://gohugo.io/getting-started/installing/).

1. In your terminal, navigate into the cloned docs repository.

1. Use the [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm) to install and use version 14.18.1 of Node:

        nvm install 14.18.1
        nvm use 14.18.1

1. Install the Node dependencies:

        npm install

1. Start the local Hugo web server:

        hugo server

    Note: The first time Hugo is run on your workstation, it needs to compile a cache of web-optimized images for each guide in the documentation library. This process can take 10-20 minutes. If you run Hugo again in the future, the cache from your first build is reused and the startup time is much faster.

1. In a web browser, navigate to `localhost:1313/docs/`.

## How can I write a guide?

We are constantly looking to improve the quality of our library. Visit our [Contribute Page](https://www.linode.com/docs/contribute/).

More detailed instructions on submitting a pull request can be found [here](CONTRIBUTING.md).

