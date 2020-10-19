#!/bin/bash

# This is a Linux and macOS compatible way to invoke sed
# From an answer here https://stackoverflow.com/questions/2320564/sed-i-command-for-in-place-editing-to-work-with-both-gnu-sed-and-bsd-osx
sedi () {
    sed --version >/dev/null 2>&1 && sed -i -- "$@" || sed -i "" "$@"
}

sedi "s/^meta_index = \"\(.*\)\"/meta_index = \"\1$1\"/g" '../config.toml'
sedi "s/^index = \"\(.*\)\"/index = \"\1$1\"/g" '../config.toml'
sedi "s/^index_by_pubdate = \"\(.*\)\"/index_by_pubdate = \"\1$1\"/g" '../config.toml'