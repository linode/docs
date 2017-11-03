import pytest

def test_404():
    f = open('result.csv')
    assert sum([1 for line in f]) == 1,'404 response in HTML - see scraper logs'
