#! /usr/local/bin/python3

import sh
import sys
import os


def print_error_and_continue(error, custom_message):
    print(custom_message)
    print("Full command: " + str(error.full_cmd))
    print("Stderr: " + str(error.stderr))
    print("Exit code: " + str(error.exit_code))
    print("Proceeding with script execution...\n")


def exit_script(custom_message):
    print(custom_message)
    print()
    print("usage: mv-guide.py source target")
    print("       mv-guide.py source ... directory")
    print("source and directory arguments must be directories.")
    print()
    print("This command can:")
    print("- Rename the path of a guide or section.")
    print("- Move several guides or sections to another section that already exists.")
    print("The command will add aliases from your guides' and sections' old locations, \nand it will stage all changes when finished.")
    sys.exit(1)


def parse_aliases(alias_line):
    aliases_as_messy_strings = alias_line.split(':')[-1].strip().split(',')

    aliases_as_clean_strings = map(
        lambda x: x.strip(" '[]"), aliases_as_messy_strings)

    return set(map(lambda x: os.path.normpath(x).lower() + "/", aliases_as_clean_strings))


def alias_style_path_for_path(content_dir, path):
    directory = os.path.dirname(path) if os.path.isfile(path) else path
    directory_abs_path = os.path.abspath(directory)
    return os.path.relpath(directory_abs_path, content_dir).lower() + "/"


def insert_alias(content_dir, markdown_file):
    def serialized_alias_set(aliasSet):
        return "[" + ",".join(map(lambda x: "'" + x + "'", aliasSet)) + "]"

    new_alias = alias_style_path_for_path(content_dir, markdown_file)

    with open(markdown_file, 'r+') as fd:
        contents = fd.readlines()
        fd.seek(0)
        frontmatter_begin = False
        frontmatter_line_written = False
        for line in contents:
            if "aliases: " in line and frontmatter_begin:
                aliases = parse_aliases(line) | {new_alias}
                fd.write("aliases: " + serialized_alias_set(aliases) + "\n")
                frontmatter_line_written = True
            elif "---" in line and frontmatter_begin and not frontmatter_line_written:
                fd.write("aliases: " +
                         serialized_alias_set({new_alias}) + "\n" + line)
                frontmatter_line_written = True
            elif "---" in line:
                frontmatter_begin = True
                fd.write(line)
            else:
                fd.write(line)
        fd.truncate()


def path_contents(path):
    # next(os.walk(path)) returns a tuple like:
    # ('docs/development/javascript', ['deploy-a-react-app-on-linode'], ['_index.md'])
    # contents[1] are all immediate subdirectories of path_contents[0]
    # contents[2] are all files in path_contents[0]
    contents = next(os.walk(path))
    return list(map(lambda tail: os.path.join(
                contents[0], tail), contents[1] + contents[2]))


def insert_aliases(content_dir, paths):
    for path in paths:
        basename = os.path.basename(path)
        if os.path.isfile(path) and (basename == 'index.md' or basename == '_index.md'):
            insert_alias(content_dir, path)
        elif os.path.isdir(path):
            insert_aliases(content_dir, path_contents(path))


def move_under_new_parent_directory(content_dir, paths, new_parent_directory):
    insert_aliases(content_dir, paths)
    for path in paths:
        try:
            sh.git("mv", path, new_parent_directory)
            if os.path.isdir(path):
                sh.rmdir(path)
        except sh.ErrorReturnCode_128 as e:
            print_error_and_continue(
                e, "Caught error when attempting to run 'git mv':")
        except sh.ErrorReturnCode:
            print_error_and_continue(e, "Caught error when attempting to clean up old directory.\n\
This is likely because it contains files not tracked by version control (e.g. .DS_Store, etc).")


def rename(content_dir, old_path, new_path):
    sh.mkdir(new_path)
    move_under_new_parent_directory(
        content_dir, path_contents(old_path), new_path)
    try:
        if os.path.isdir(old_path):
            sh.rmdir(old_path)
    except sh.ErrorReturnCode as e:
        print_error_and_continue(e, "Caught error when attempting to clean up old directory.\n\
This is likely because it contains files not tracked by version control (e.g. .DS_Store, etc).")


def move_guides(paths):
    script_location = os.path.dirname(os.path.abspath(__file__))
    repo_dir = script_location
    content_dir = os.path.join(repo_dir, 'docs')
    working_directory = os.getcwd()

    if os.path.commonpath([repo_dir, working_directory]) != repo_dir:
        exit_script("Script must be invoked within repository.")

    # check if all arguments exist within repository
    for path in paths:
        abs_path = os.path.abspath(path)
        if content_dir not in abs_path:
            exit_script(
                f"Path '{path}' ({abs_path}) is not in your docs content directory.")

    # check that all arguments (except for the last one) exist and are directories
    for path in paths[:-1]:
        if not os.path.isdir(os.path.abspath(path)):
            exit_script(
                f"Path '{path}' ({os.path.abspath(path)}) does not exist or is not a directory.")

    # If the last argument is a file that already exists
    if os.path.isfile(paths[-1]):
        exit_script(
            f"Path '{path}' ({os.path.abspath(path)}) cannot be a file.")

    # If the last argument is a directory that already exists
    elif os.path.isdir(paths[-1]):
        move_under_new_parent_directory(
            content_dir, paths[:-1], paths[-1])

    # Otherwise, the last argument does not already exist on the filesystem
    # If there are only two paths passed, then we should rename the first path argument
    elif len(paths) == 2:
        rename(content_dir, paths[0], paths[1])

    else:
        exit_script(
            f"Path '{paths[-1]}' ({os.path.abspath(paths[-1])}) does not exist.")

    try:
        sh.git("add", "-A")
    except sh.ErrorReturnCode_128 as e:
        print_error_and_continue(
            e, "Caught error when attempting to stage changes:")


if len(sys.argv) < 3:
    exit_script("Script expects at least two directory paths as arguments.")

move_guides(sys.argv[1:])

print("All guides moved successfully, and changes have been staged.")
print("Run 'git status' and 'git diff --staged' to review changes.")
print("This command does not update the titles of your guides, please remember to do so if appropriate.")
