import pytest
from pathlib import Path

from blueberry import lowercase_filename

def test_lowercase_filename():
    caps = 'data/SHOUTING_BAD_FILE.md'
    p = Path(caps)
    if p.exists():
        assert lowercase_filename(caps) == (str(p), 'File name must be all lowercase.')

    filepath = 'data/CHANGELOG.md'
    p = Path(filepath)
    if p.exists():
        assert lowercase_filename(filepath) == None
