#! /usr/local/bin/python3

import sh
import sys
import os

script_location = os.path.dirname(os.path.abspath(__file__))
repo_dir = script_location
content_dir = os.path.join(repo_dir, 'docs')

def parse_aliases(alias_line):
    aliases_as_messy_strings = alias_line.split(':')[-1].strip().split(',')

    aliases_as_clean_strings = map(
        lambda x: x.strip(" '[]"), aliases_as_messy_strings)

    return set(map(lambda x: os.path.normpath(x).lower() + "/", aliases_as_clean_strings))

def alias_style_path_for_path(content_dir, path):
    directory = os.path.dirname(path) if os.path.isfile(path) else path
    directory_abs_path = os.path.abspath(directory)
    return os.path.relpath(directory_abs_path, content_dir).lower() + "/"

def insert_aliases(content_dir, paths):
    for path in paths:
        basename = os.path.basename(path)
        if os.path.isfile(path) and (basename == 'index.md' or basename == '_index.md'):
            insert_alias(content_dir, path)
        elif os.path.isdir(path):
            insert_aliases(content_dir, path_contents(path))

def insert_alias(content_dir, markdown_file, new_alias):
    def serialized_alias_set(aliasSet):
        return "[" + ",".join(map(lambda x: "'" + x + "'", aliasSet)) + "]"

    new_alias = new_alias
    new_alias_append = new_alias + '-classic-manager/'
    markdown_file_append = 'docs/' + markdown_file + '/index.md'

    with open(markdown_file_append, 'r+') as fd:
        contents = fd.readlines()
        fd.seek(0)
        frontmatter_begin = False
        frontmatter_line_written = False
        for line in contents:
            if "aliases: " in line and frontmatter_begin:
                aliases = parse_aliases(line) | {new_alias_append}
                fd.write("aliases: " + serialized_alias_set(aliases) + "\n")
                frontmatter_line_written = True
            elif "---" in line and frontmatter_begin and not frontmatter_line_written:
                fd.write("aliases: " +
                         serialized_alias_set({new_alias_append}) + "\n" + line)
                frontmatter_line_written = True
            elif "---" in line:
                frontmatter_begin = True
                fd.write(line)
            else:
                fd.write(line)
        fd.truncate()



insert_alias(content_dir, 'uptime/monitoring-and-maintaining-your-server', 'uptime/monitoring-and-maintaining-your-server-classic-manager')
