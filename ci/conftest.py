# -*- coding: utf-8 -*-
import pytest
import os
import fnmatch


@pytest.fixture(scope='module', autouse=True)
def md_index(path='.', extension='*.md'):
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


@pytest.fixture(params=[open(i) for i in md_index()])
def md_files(request):
    return request.param
