import pytest

import regex
from dateutil.parser import parse
import sys
import yaml
import json
from conftest import file_io

with open('ci/yaml_rules.json') as json_data:
    requirements = json.load(json_data)


@file_io
def test_yaml(md_filepath):
    filestring = md_filepath.read()
    reg = regex.compile(r'^---(.*?)---',flags=regex.DOTALL)
    match = regex.search(reg, filestring)

    if not match: pytest.skip('No YAML header')

    yaml_text = match.group(1)
    parsed_yaml = yaml.load(yaml_text)
    for requirement in requirements:
        req = requirements[requirement]
        if req['required']:
            assert requirement in parsed_yaml, 'YAML metadata missing required element: ' + requirement
        if req['type'] == 'link':
            # Check external links have balanced brackets
            regexp = regex.compile(r'\[(.*)\]\((.*)\)')
            assert regex.match(regexp,parsed_yaml[requirement]), 'YAML metadata formatting error: ' + requirement
        if req['type'] == 'date':
            try:
                d = parse(str(parsed_yaml[requirement]))
            except ValueError:
                assert False, 'YAML metadata formatting error: ' + requirement + ' date parse failed.'
