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
    def wrapper(md_filepath):
        # Before test
        f = open(md_filepath, 'r')
        # After test
        r = func(f)
        f.close()
        return r
    return wrapper

@pytest.fixture(scope='module', autouse=True)
def file_index(path='.', extension=None):
    """
    Traverses root directory
    """
    index = []
    exclude_dir = ['node_modules', 'archetypes', '.git']
    exclude_file = ['_index.md','.gitignore']
    for root, dirnames, filenames in os.walk(path):
        dirnames[:] = [d for d in dirnames if d not in exclude_dir]
        if extension:
            filter_ext = fnmatch.filter(filenames, extension)
        else:
            filter_ext = filenames #Filter nothing
        for filename in filter_ext:
            if filename in exclude_file:
                continue
            index.append(os.path.join(root, filename))
    return index

@pytest.fixture(params=file_index(extension='*.md'))
def md_filepath(request):
    return request.param

@pytest.fixture(params=file_index(extension=None))
def all_filepaths(request):
    return request.param

