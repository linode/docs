#! /usr/local/bin/python3

import sh
import sys
import os


def exit_script(custom_message):
    print(custom_message)
    print()
    print("usage: cascade_tags.py docs/directory1/ docs/directory2/ ...")
    sys.exit(1)


def parse_tags(tags_line):
    tags_as_messy_strings = tags_line.split(':')[-1].strip().split(',')

    tags_as_clean_strings = set(map(
        lambda x: x.strip(" '[]\"").lower(), tags_as_messy_strings))
    return tags_as_clean_strings


def serialized_tags_set(tagSet):
    return "[" + ",".join(map(lambda x: '"{}"'.format(x), tagSet)) + "]"


def extract_tags_from_section(section_markdown_file):
    tags = set()
    with open(section_markdown_file, 'r+') as fd:
        contents = fd.readlines()
        fd.seek(0)
        frontmatter_begin = False
        frontmatter_end = False
        for line in contents:
            if "tags:" in line and frontmatter_begin and not frontmatter_end:
                # parse the tags, but don't write the tags: line back into the section file
                tags = parse_tags(line)
            elif "cascade:" in line and frontmatter_begin and not frontmatter_end:
                # don't write the cascade: line back into the file
                pass
            elif "---" in line and frontmatter_begin and frontmatter_begin:
                # this case is entered the second time a "---" is encountered
                frontmatter_end = True
                fd.write(line)
            elif "---" in line and not frontmatter_begin and not frontmatter_end:
                # this case is entered the first time a "---" is encountered
                # (i.e. the first line on the file)
                frontmatter_begin = True
                fd.write(line)
            else:
                # just write all the other lines as the originally appeared in the file
                fd.write(line)
        fd.truncate()

    return tags


def replace_tags_in_guide(guide_markdown_file, parent_tags):
    tags = set()
    with open(guide_markdown_file, 'r+') as fd:
        contents = fd.readlines()
        fd.seek(0)
        frontmatter_begin = False
        frontmatter_end = False
        tags_found = False
        for line in contents:
            if "tags:" in line and frontmatter_begin and not frontmatter_end:
                # only rewrite a "tags: " line found inside the frontmatter,
                # and only if there are parent_tags to be merged
                tags_found = True
                if parent_tags:
                    tags = parse_tags(line)
                    fd.write("tags: " + serialized_tags_set(parent_tags | tags) + "\n")
                else:
                    fd.write(line)
            elif "---" in line and frontmatter_begin and not frontmatter_end:
                # this case is entered the second time a "---" is encountered
                # if there are parent tags to be merged, but no tags on the
                # guide itself, write those parent tags just before the close
                # of the frontmatter
                if not tags_found and parent_tags:
                    fd.write("tags: " + serialized_tags_set(parent_tags) + "\n")
                frontmatter_end = True
                fd.write(line)
            elif "---" in line and not frontmatter_begin and not frontmatter_end:
                # this case is entered the first time a "---" is encountered
                # (i.e. the first line on the file)
                frontmatter_begin = True
                fd.write(line)
            else:
                # just write all the other lines as the originally appeared in the file
                fd.write(line)
        fd.truncate()


def path_contents(path):
    # next(os.walk(path)) returns a tuple like:
    # ('docs/development/javascript', ['deploy-a-react-app-on-linode'], ['_index.md'])
    # contents[1] are all immediate subdirectories of path_contents[0]
    # contents[2] are all files in path_contents[0]
    contents = next(os.walk(path))
    return list(map(lambda tail: os.path.join(contents[0], tail), contents[1] + contents[2]))


def cascade_tags_recursive(path, parent_tags):
    contents = path_contents(path)
    section_file = next((path for path in contents if "_index.md" in path), None)
    other_contents = [path for path in contents if "_index.md" not in path]
    guide_file = next((path for path in other_contents if "index.md" in path), None)
    if section_file:
        tags = extract_tags_from_section(section_file)
        for path in other_contents:
            if os.path.isdir(path):
                cascade_tags_recursive(path, parent_tags | tags)
    elif guide_file:
        replace_tags_in_guide(guide_file, parent_tags)


if len(sys.argv) < 2:
    exit_script("Script expects at least one directory path as an argument.")

for path in sys.argv[1:]:
    cascade_tags_recursive(path, set())