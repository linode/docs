#!/bin/bash

pip install -r ci/requirements.txt
python ci/test_urls.py
