#!/bin/bash
set -euxo pipefail
mkdir "/home/travis/hugo"
pip install -r ci/requirements.txt
python ci/docs404.py
