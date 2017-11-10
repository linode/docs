import pytest

from contextlib import redirect_stdout
import regex
from conftest import file_io

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

