# -*- coding: utf-8 -*-
import ntpath
import inspect
import itertools
import json
import os
import re
import subprocess
import sys
import time
import datetime
import urllib.request
from urllib.error import HTTPError, URLError
from yaml import scanner

import frontmatter

from contextlib import ContextDecorator
from operator import methodcaller
from pathlib import Path

# TODO:
# Add flake8 to requirements and lint this file
# TODO:
# Create a regex cookbook!


REPORT_KEYS = ['files', 'excluded_files', 'directories']
BASE_URL = 'http://localhost:1313/docs/'
OPTIONAL_PARAMS = ['args', 'kwargs']
WORKING_DIR = os.getcwd()

TRAILING_WHITESPACE_REGEX = re.compile(r'[\t ]+$')
MIXED_WHITESPACE_REGEX = re.compile(r'([ \t]*)')
LINK_REGEX = re.compile(r'\[(.*)\]\((.*)\)')
INTERNAL_LINK_REGEX = re.compile(r'\[(.*)\]\((/docs/[^")]*)(\".*\")?\)')
IMAGE_LINK_REGEX = re.compile(r'!\[(.*)\]\((.*(?:\.jpg|\.png)).?\s?(\".*\")?\)')

_validate = {'file_yaml': [], 'filepath': [], 'line': []}


def add_rule(function):
    """Decorate a function to collect as test.

    Function args are mapped into _validate
    """
    if inspect.isfunction(function):
        sig = inspect.signature(function)
        for p in sig.parameters.values():
            if p.name not in OPTIONAL_PARAMS:
                intersect = list(_validate.keys() & {p.name})
                if len(intersect) != 0:
                    _validate[intersect[0]].append(function)
    return function


# -----------------------------------------------------------------------------
# YAML

with open('ci/yaml_rules.json') as json_data:
    requirements = json.load(json_data)

@add_rule
def require_yaml(file_yaml, **kwargs):
    """Ensure all required headers are present."""
    for header, req in requirements.items():
        if req['required'] and header not in file_yaml:
            return str(kwargs.get('filename')), \
            f"Missing required metadata: {header}"

@add_rule
def only_allowed_yaml(file_yaml, **kwargs):
    """Misspelled/incorrect/non-allowed metadata headers."""
    for header in file_yaml.keys():
        if header not in requirements.keys():
            return str(kwargs.get('filename')), \
            f"Non-allowed metadata: {header}"

@add_rule
def format_yaml(file_yaml, **kwargs):
    """
    Uses yaml_rules.json to ensure metadata
    headers are of the correct type/format.
    """
    filename = str(kwargs.get('filename'))
    for header, req in requirements.items():
        if header in file_yaml.keys():
            val, type = file_yaml[header], req['type']
            if type == "link":
                if not re.search(LINK_REGEX, val):
                    return filename, \
                    f"Invalid metadata format: {val}"
            elif type == "list":
                if not isinstance(val, list):
                    return filename, \
                           f"Invalid metadata format: {val} should be a list."
            elif type == "bool":
                if not isinstance(val, bool):
                    return filename, \
                           f"Invalid metadata format: {val} should be a boolean."
            elif type == "date":
                if not isinstance(val, datetime.date):
                    return filename, \
                           f"Invalid metadata format: {val} should be YYYY-MM-DD."

@add_rule
def valid_alias(file_yaml, **kwargs):
    """Check formatting of aliases."""
    if 'aliases' in file_yaml:
        if 'deprecated' not in file_yaml or file_yaml['deprecated'] is False:
            errors = []
            for alias in file_yaml['aliases']:
                if not alias.endswith('/'):
                    errors.append(f"{alias} should end with a slash (/).")
            if errors:
                return str(kwargs.get('filename')), '\n'.join(errors)
            else:
                return None


# -----------------------------------------------------------------------------
# Filename / Path

@add_rule
def lowercase_filename(filepath):
    """File name must be all lowercase."""
    # Handle Windows filepaths. See https://stackoverflow.com/q/8384737
    filename = ntpath.basename(str(filepath))

    # Cartesian product of filenames and extension
    # e.g. README.txt, README.md, CHANGELOG.txt, CHANGELOG.md ...
    file_extensions = ['txt', 'md']
    name = ['README', 'CHANGELOG', 'CONTRIBUTING', 'LICENSE', 'CODE_OF_CONDUCT']
    exempt_files = [('.'.join(x)) for x
                    in itertools.product(name, file_extensions)]

    if filename in exempt_files:
        return
    elif not filename.islower():
        return str(filepath), "File name must be all lowercase."


@add_rule
def lowercase_extension(filepath):
    """File extensions must be lowercase."""
    filename, file_extension = os.path.splitext(filepath)
    if file_extension != file_extension.lower():
        return str(filepath), "File extensions must be lowercase."


# -----------------------------------------------------------------------------
# Line

@add_rule
def trailing_whitespace(line, **kwargs):
    """Check for extra whitespace at end of lines."""
    pos = len(line)
    has_trailing = re.search(TRAILING_WHITESPACE_REGEX, line)
    if has_trailing:
        return kwargs.get('line_num'), pos, "Remove trailing whitespace."

@add_rule
def mixed_whitespace(line, **kwargs):
    """Detects mixed spaces and tabs."""
    for pos, char in enumerate(MIXED_WHITESPACE_REGEX.match(line).group(1)):
        has_tabs = char != ' '
        if has_tabs:
            # kwargs.get('line_num') is wrong due to
            # python-frontmatter stripping excess newlines
            return line, pos, "Use four spaces instead of tabs."

@add_rule
def valid_image_links(line, **kwargs):
    """Checks any image link encountered to see if a matching file exists in the
    specified directory."""
    match = IMAGE_LINK_REGEX.match(line)
    pos = len(line)
    if match:
        image = match.group(2)
        if image and image.endswith('/'):
            return kwargs.get('line_num'), image, "Images should not end with a slash."
        elif image:
            image_path = str(kwargs.get('filename'))[:-8] # Remove "index.md" from the end of the path
            if not os.path.isfile(image_path + image):
                return kwargs.get('line_num'), image, "Image link points to nonexistent file."


# -----------------------------------------------------------------------------
# Misc checks independent of files
# Should this be here?

def check_hugo_version():
    try:
        version = subprocess.run(["hugo", "version"], stdout=subprocess.PIPE)
        version = re.search(r'[\d.]+', version.stdout.decode("utf-8")).group(0)
    except:
        print("Check if Hugo is installed.")
        sys.exit(1)

def find_files(path='.', extension='md', recursive=False):
    # Returns list of absolute paths
    p = Path(path).resolve()
    construct_path = ''
    if recursive:
       construct_path = '**/'
    glob_path = '{}[!_]*.{}'.format(construct_path, extension)
    return list(p.glob(glob_path))


def readfile(filename, section=None):
    """Opens a filename and returns either yaml or content"""
    try:
        with open(filename, 'rb') as f:
            post = frontmatter.loads(f.read())
            if section == 'content':
                # TODO:
                # Check case of \r\n for Windows
                # WARNING: Removes trailing newlines
                return post.content.splitlines()
            elif section == 'metadata':
                # WARNING: Implicitly converts dates to datetime
                return post.metadata

    except (LookupError, SyntaxError, UnicodeError, scanner.ScannerError):
        # Return Error; require utf-8
        # Should this sys.exit(1) here?
        print(f"{filename} caused the Blueberry script to crash.")
        sys.exit(1)


class Reporter(object):

    def __init__(self):
        self.total_errors = 0
        self.start_time = 0
        self.filepath_errors = []
        self.yaml_errors = []
        self.line_errors = {}
        self._report_keys = REPORT_KEYS
        self.counters = dict.fromkeys(self._report_keys, 0)

    def start(self):
        self.start_time = time.time()

    def end(self):
        self.end = time.time() - self.start_time

    def get_total_errors(self):
        return self.total_errors

    def init_file(self, filename):
        self.filename = filename
        self.file_errors = 0
        self.total_length = sum(1 for line in open(filename))

    def get_filepath_error_count(self):
        return len(self.filepath_errors)

    def get_line_error_count(self):
        return sum(len(i) for i in self.line_errors.values())

    def get_yaml_error_count(self):
        return len(self.yaml_errors)

    def report_filepath_error(self):
        for result in self.filepath_errors:
            print("{1} - {0}".format(*result))

    def report_line_error(self):
        for key, values in self.line_errors.items():
            if len(values) > 0:
                for v in values:
                    print(key, "Position: {1} '{0}' - {2}".format(*v))

    def report_yaml_error(self):
        for filepath, result in self.yaml_errors:
            print(f"{filepath} - {result}")

    def collect_errors(self):
        self.total_errors =  self.get_filepath_error_count() + \
                             self.get_line_error_count() + \
                             self.get_yaml_error_count()
        return self.total_errors

    def rule_count(self):
        return len(list(itertools.chain(*_validate.values())))

    def report(self):
        # Print aggregated states for all tests
        # Then print each error on file basis
        print("Reporting results")
        print("Elapsed time: " + str(self.end))
        print("Collected checks: " + str(self.rule_count()))
        print("Total errors: " + str(self.total_errors))
        print("Scanned files: " + str(self.counters['files']))
        self.report_filepath_error()
        self.report_yaml_error()
        self.report_line_error()

class TestManager(object):
    # TODO:
    # Gracefully handle non-existent filepath

    def __init__(self, input_dir='docs/', **kwargs):
        self.input_dir = input_dir
        self.files = find_files(path=input_dir, recursive=True)

    def __call__(self, input_dir, recursive=False):
        self.input_dir = input_dir
        self.files = file_files(input_dir, recursive=recursive)

    def set_reporter(self, reporter):
        self._reporter = reporter

    def print_report(self):
        self._reporter.report()

    def exit_code(self):
        return int(self._reporter.collect_errors() > 0)

    def _function_mapper(self, obj, **kwargs):
        """Maps an iterable of functions on an object."""
        if type(obj) is list:
            res = []
            filename = kwargs.get('filename')
            if filename not in self._reporter.line_errors:
                self._reporter.line_errors[filename] = []
            for idx in range(len(obj)):
                res += map(methodcaller('__call__', obj[idx], line_num=idx, **kwargs), _validate['line'])
            self._reporter.line_errors[filename] += filter(None, res)
        elif type(obj) is dict:
            res = map(methodcaller('__call__', obj, **kwargs), _validate['file_yaml'])
            self._reporter.yaml_errors += filter(None, res)
        else:
            # Must be a filepath
            res = map(methodcaller('__call__', obj), _validate['filepath'])
            self._reporter.filepath_errors += filter(None, res)

    def _run(self):
        for filepath in self.files:
            self._reporter.init_file(filepath)
            self._reporter.counters['files'] += 1
            lines, front_matter = (readfile(filepath, section=s)
                                    for s in ('content', 'metadata'))
            for _ in filepath, lines, front_matter:
                self._function_mapper(_, **self._reporter.__dict__)
            self._reporter.collect_errors()

    def run(self):
        self._reporter.start()
        try:
            self._run()
        except KeyboardInterrupt:
            print("\n...\nManually stopped blueberry.py\n")
        self._reporter.end()


def _main():
    reporter, tm = Reporter(), TestManager()

    tm.set_reporter(reporter)
    tm.run()
    tm.print_report()
    sys.exit(tm.exit_code())


if __name__ == '__main__':
    _main()
