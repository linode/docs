import pytest
import os

def test_extension(all_filepaths):
    """
    Tests that all file extensions are lowercase.
    Ignores files without an extension.
    """
    filename, file_extension = os.path.splitext(all_filepaths)
    assert file_extension == file_extension.lower(), 'File extensions must be lowercase.'
