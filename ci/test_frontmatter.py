import pytest
import frontmatter

from blueberry import require_yaml, only_allowed_yaml

def test_required_yaml():
    with open('ci/data/SHOUTING_BAD_FILE.md',r) as f:
        yaml = frontmatter.loads(f.read())
        print(yaml)

def test_only_allowed_yaml():
    pass
