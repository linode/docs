import pytest

from contextlib import redirect_stdout
import regex
import re
import ast
import urllib.request
from urllib.error import HTTPError, URLError
from conftest import file_io, LOCALHOST


@file_io
def test_whitespace(md_filepaths):
    has_whitespace = False
    for line_number, line in enumerate(md_filepaths, 1):
        match = regex.search(r'[\t]+$', line)
        if match:
            has_whitespace = True
            print("Trailing whitespace at " + str(line_number) + \
                  ":" + str(match.start()))
    assert has_whitespace == False


@file_io
def test_alias(md_filepaths):
    aliases = []
    valid_alias = True
    for line in md_filepaths:
        match = re.match(r'^aliases: \[.*\]', line)
        if match:
            new_line = match.group()
            # Literal evaluation of brackets in alias
            aliases += ast.literal_eval(new_line[new_line.find("["):])
    if md_filepaths.name.lstrip('./content/')[:-3] in \
            [a.rstrip('/') for a in aliases]:
        valid_alias = False
        print('Circular alias: ' + path)
    try:
        for alias in aliases:
            urllib.request.urlopen(LOCALHOST + alias).getcode()
    except HTTPError:
        valid_alias = False
        print('404 alias: ' + alias)
    assert valid_alias == True,'Not a valid alias'

