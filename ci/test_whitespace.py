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

