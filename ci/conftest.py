import pytest
import os
import fnmatch
from functools import wraps


LOCALHOST = "http://localhost:1313/docs/"

def file_io(func):
    """
    Open and close file objects for tests
    """
    @wraps(func)
    def wrapper(md_filepaths):
        # Before test
        f = open(md_filepaths, 'r')
        # After test
        r = func(f)
        f.close()
        return r
    return wrapper


@pytest.fixture(scope='module', autouse=True)
def md_index(path='.', extension='*.md'):
    """
    Traverses root directory
    """
    index = []
    exclude = ['node_modules']
    for root, dirnames, filenames in os.walk(path):
        dirnames[:] = [d for d in dirnames if d not in exclude]
        for filename in fnmatch.filter(filenames, extension):
            index.append(os.path.join(root, filename))
    return index


@pytest.fixture(params=md_index())
def md_filepaths(request):
    return request.param


#@pytest.fixture(params=[open(i) for i in md_index()])
#def md_files(request):
#    return request.param


