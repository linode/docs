import pytest

def test_filename(md_filepaths):
    if any(e in md_filepaths for e in ['README.md', 'CHANGELOG.md']):
        assert True
    else:
        assert md_filepaths.islower() == True,'Filename should be lowercase'
