import pytest
import frontmatter

from blueberry import require_yaml, only_allowed_yaml, valid_alias

def test_required_yaml():
    with open('ci/data/goodfile.md','r') as f:
        yaml = frontmatter.loads(f.read()).metadata
    assert require_yaml(yaml) == None

def test_missing_yaml_header():
    with open('ci/data/missing_yaml_header.md','r') as f:
        yaml = frontmatter.loads(f.read()).metadata
    assert require_yaml(yaml)[1] == "Missing required metadata: published"

def test_extra_yaml_header():
    with open('ci/data/extra_yaml_header.md','r') as f:
        yaml = frontmatter.loads(f.read()).metadata
    assert only_allowed_yaml(yaml)[1] == "Non-allowed metadata: fake_header"

def test_valid_alias():
    with open('ci/data/goodfile.md', 'r') as f:
        yaml = frontmatter.loads(f.read()).metadata

    assert valid_alias(yaml) == None

def test_uppercase_alias():
    with open('ci/data/SHOUTING_BAD_FILE.md','r') as f:
        yaml = frontmatter.loads(f.read()).metadata

    assert valid_alias(yaml)[1] == "applications/containers/this-is-an-ALIAS/ should be lowercase."

def test_underscore_alias():
    with open('ci/data/underscore-alias.md','r') as f:
        yaml = frontmatter.loads(f.read()).metadata

    assert valid_alias(yaml)[1] == "applications/containers/this_is_an_alias/ should use dashes instead of underscores."

def test_alias_trailing_slash():
    with open('ci/data/trailing-slash-alias.md','r') as f:
        yaml = frontmatter.loads(f.read()).metadata

    assert valid_alias(yaml)[1] == "applications/containers/this-is-an-alias should end with a slash (/)."
