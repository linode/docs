#!/bin/bash

pip install -r ci/requirements.txt
python ci/docs404.py
ci/scripts/docs404.sh
