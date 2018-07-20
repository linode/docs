#!/bin/bash
set -euxo pipefail

pip install -r ci/requirements.txt
python ci/docs404.py
