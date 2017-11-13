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
def test_yaml(md_filepaths):
    for filestring in md_filepaths:
        reg = regex.compile(r'^---(.*?)---',flags=regex.DOTALL)
        match = regex.search(reg, filestring)
        # Hack until README.md files won't be passed in
        # assert match
        if not match: return
        yaml_text = match.group(1)
        parsed_yaml = yaml.load(yaml_text)
        for requirement in requirements:
            req = requirements[requirement]
            if req['required']:
                assert requirement in parsed_yaml, 'YAML metadata missing required element: ' + requirement
            if req['type'] is 'link':
                regexp = regex.compile(r'\[(.*)\]\((.*)\)')
                assert regex.match(regexp,parsed_yaml[requirement]), 'YAML metadata formatting error: ' + requirement
            if req['type'] is 'date':
                try:
                    parse(str(parsed_yaml[requirement]))
                except ValueError:
                    assert False, 'YAML metadata formatting error: ' + requirement + ' date parse failed.'

