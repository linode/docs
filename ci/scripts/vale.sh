#!/bin/bash

wget https://github.com/errata-ai/vale/releases/download/v1.2.6/vale_1.2.6_Linux_64-bit.tar.gz
mkdir vale
tar -xvzf vale_1.2.6_Linux_64-bit.tar.gz -C vale
files=`git diff --name-only develop | grep 'index.md'`
for file in $files; do
  echo ${file}
done
./vale/vale --glob=${files} docs
