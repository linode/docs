import pytest

from contextlib import redirect_stdout
import re
import ast
from datetime import datetime
import requests
import urllib.request
from urllib.error import HTTPError, URLError
from conftest import file_io, LOCALHOST


def _localserve_running():
    """
    Check if local server is running on 1313
    """
    try:
        requests.get('http://localhost:1313/docs/')
        return True
    except requests.exceptions.ConnectionError:
        return False

localserver = pytest.mark.skipif(not _localserve_running(),
                                 reason="Local server not running on port 1313")

@localserver
@file_io
def test_alias(md_filepath):
    aliases = []
    valid_alias = True
    for line in md_filepath:
        # Check if file is expired
        today = datetime.now()
        has_exp_header = re.match(r'^expiryDate: ', line)
        if has_exp_header:
            exp_date = datetime.strptime(line.split()[1], '%Y-%m-%d')
            if exp_date <= today:
                pytest.skip("Marked expired not checked")

        match = re.match(r'^aliases: \[.*\]', line)
        if match:
            new_line = match.group()
            # Literal evaluation of brackets in alias
            aliases += ast.literal_eval(new_line[new_line.find("["):])

    #Check case where alias points back to URL
    if md_filepath.name.lstrip('./content/')[:-3] in \
            [a.rstrip('/') for a in aliases]:
        valid_alias = False
        print('Circular alias: ' + path)
    for alias in aliases:
        try:
            urllib.request.urlopen(LOCALHOST + alias).getcode()
        except HTTPError:
            valid_alias = False
            print('404 alias: ' + alias)
    assert valid_alias == True,'Not a valid alias'

