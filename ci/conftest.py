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
def md_index(path='.', extension='*.md'):
    """
    Traverses root directory
    """
    index = []
    exclude_dir = ['node_modules', 'archetypes', '.git']
    exclude_file = ['_index.md','.gitignore']
    for root, dirnames, filenames in os.walk(path):
        dirnames[:] = [d for d in dirnames if d not in exclude_dir]
        for filename in fnmatch.filter(filenames, extension):
            if filename in exclude_file:
                continue
            index.append(os.path.join(root, filename))
    return index


@pytest.fixture(params=md_index())
def md_filepath(request):
    return request.param

@pytest.fixture(scope='module', autouse=True)
def full_index(path='.'):
    """
    Traverses root directory
    includes assets/
    """
    index = []
    exclude_dir = ['node_modules', 'archetypes', '.git']
    exclude_file = ['.gitignore']
    for root, dirnames, filenames in os.walk(path):
        dirnames[:] = [d for d in dirnames if d not in exclude_dir]
        for filename in filenames:
            if filename in exclude_file:
                continue
            index.append(os.path.join(root, filename))
    return index

@pytest.fixture(params=full_index())
def all_filepaths(request):
    return request.param

