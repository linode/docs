#!/bin/bash

pip install -r ci/requirements.txt
python ci/docs404.py
python ci/test_urls.py
