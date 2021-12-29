#!/bin/bash

# Usage:
#    ./apply_index_name_suffix.sh some-algolia-index-suffix
#
# This script will update config.toml and apply a suffix to the Algolia
# indices that are defined in the file.
#
# This is used to create different namespaces within an Algolia account.
# Having different namespaces allows you to maintain separate sets of indices
# for testing the docs UI.
#
# In the future, this will be used to create separate Algolia indices
# corresponding to the Netlify previews for each pull request.

# This is a Linux and macOS compatible way to invoke sed
# From an answer here https://stackoverflow.com/questions/2320564/sed-i-command-for-in-place-editing-to-work-with-both-gnu-sed-and-bsd-osx

sedi () {
    sed --version >/dev/null 2>&1 && sed -i -- "$@" || sed -i "" "$@"
}

sedi "s/^meta_index = \"\(.*\)\"/meta_index = \"\1$1\"/g" '../config.toml'
sedi "s/^index = \"\(.*\)\"/index = \"\1$1\"/g" '../config.toml'
sedi "s/^index_by_pubdate = \"\(.*\)\"/index_by_pubdate = \"\1$1\"/g" '../config.toml'