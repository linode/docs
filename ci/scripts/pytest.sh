#!/bin/bash

pip install -r ci/requirements.txt
python -m pytest -n 2
