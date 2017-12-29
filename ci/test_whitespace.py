import pytest

from contextlib import redirect_stdout
import regex
from conftest import file_io

@file_io
def test_whitespace(md_filepath):
    has_whitespace = False
    for line_number, line in enumerate(md_filepath, 1):
        has_trailing = regex.search(r'[\t ]+$', line)
        if has_trailing:
            has_whitespace = True
            print("Trailing whitespace at " + str(line_number) + \
                  ":" + str(has_trailing.start()))
    assert has_whitespace == False

@file_io
def test_tabs(md_filepath):
    has_tabs = True
    for line_number, line in enumerate(md_filepath, 1):
        has_tabs = '\t' in list(line)
        if has_tabs:
            print("Mixed spacing on line " + str(line_number))
    assert has_tabs == False

