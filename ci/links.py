#!/usr/bin/env python
import os
import sys
import re
import frontmatter
import requests

output_duplicates_filename = "duplicates.csv"

changed_files = sys.argv[1].split(',')
print(changed_files)

# ------------------
# Build a list of all aliases and map them to their current link
# ------------------

# The directory to be used when building the list of aliases
docs_directory = '../docs/'
canonical_internal_urls = []
# A dictionary that maps all aliases to the current (canonical) link
aliases = {}
# A dictionary that contains all the aliases that are duplicated on multiple guides
duplicate_aliases = {}

# Iterate through each markdown file within the alias_directory
for root, dirs, files in os.walk(docs_directory):
    for file in files:
        if file.endswith('.md'):

            # The relative file path of the file
            file_path = os.path.join(root, file)

            try:
                # Loads the entire guide (including front matter)
                guide = frontmatter.load(file_path)
                # Creates the canonical (current) link for the guide
                if "/docs/guides/" in file_path:
                    canonical_link = "/docs/guides/" + guide['slug'] + "/"
                elif "/docs/products/" in file_path:
                    canonical_link = file_path.replace('../docs/','/docs/')
                    canonical_link = canonical_link.replace('/index.md','/')
                    canonical_link = canonical_link.replace('/_index.md','/')
                else:
                    # Go to the next file if it is not located in /guides/ or /products/
                    file.next()
                # Update the canonical url array
                canonical_internal_urls.append(canonical_link)
                # Updates the aliases dictionary with all aliases in the guide
                # and maps them to the guide's canonical link
                for alias in guide['aliases']:
                    # Check if the alias already exists in the aliases dictionary
                    if aliases.get(alias) is not None:
                      # If it does exist, then it's a duplicate alias - which is not ideal as
                      # and a member of the docs team should manually intervene.
                      # Let's check to see if the duplicate alias has already been logged.
                      if duplicate_aliases.get(alias) is not None:
                          # If the duplicate has been logged, increment the count.
                          # This helps us identify how many times this alias appears.
                          count = duplicate_aliases.get(alias)
                          count = count + 1
                          duplicate_aliases.update({ alias : count})
                      # If the duplicate alias has not yet been logged, clear it and log it.
                      else:
                        # Log the duplicate, starting the count at 2
                        duplicate_aliases.update({ alias : 2})
                    # If the alias does not yet exist in the aliases dictionary, add it
                    else:
                      aliases.update({ alias : canonical_link})
            except:
                continue
num_duplicates = len(duplicate_aliases)
if num_duplicates != 0:
    if num_duplicates == 1:
        print('Failure: There is 1 duplicate alias.')
    else:
        print('Failure: There are ' + str(num_duplicates) + ' duplicate aliases.')
    print(duplicate_aliases)
    #sys.exit(1)
else:
    print('Success: There are no duplicate aliases.')

# To view aliases, use print(aliases)

# ------------------
# Check internal links
# ------------------

# The regex pattern used to locate all markdown links containing the string "/docs".
# This bypasses any external urls and archor links
link_pattern = re.compile("(?:[^\!]|^)\[([^\[\]]+)\]\(()([^()]+)\)")
# An array of all internal links that do not point to a guide
internal_links_with_errors = []
internal_links_with_warnings = []

external_links_with_errors = []

headers = {
    'User-Agent': 'Linode Docs External Link Crawler'
}

# Iterate through each markdown file within the docs_directory
for root, dirs, files in os.walk(docs_directory):
    for file in files:
        if file.endswith('index.md'):

            # The relative file path of the file
            file_path = os.path.join(root, file)

            if file_path.replace('../docs/','docs/') in changed_files:
              is_changed = True
            else:
              is_changed = False

            # Iterate through each line of the file
            for i, line in enumerate(open(file_path)):
                # Find and iterate through all markdown links to other guides
                for match in re.finditer(link_pattern, line):
                    # Remove the title, brackets, and parenthesis from the markdown link
                    link = match.group()
                    link = link[link.find("(")+1:link.find(")")]

                    if not link.startswith('/docs/'):
                        internal_links_with_errors.append(link)
                        continue
                    # Check if link points to a canonical internal URL
                    if not (link in canonical_internal_urls):
                        # Checks if the link matches an alias or not
                        if aliases.get(link.replace('/docs/','/')) is not None:
                            # Checks if the link matches a duplicate
                            internal_links_with_warnings.append(link)
                        else:
                            internal_links_with_errors.append(link)

num_errors = len(internal_links_with_errors)
num_warnings = len(internal_links_with_warnings)

if num_errors != 0:
    if num_errors == 1:
        print('Failure: There is 1 error in links.')
    else:
        print('Failure: There are ' + str(num_errors) + ' errors in links.')
    #print(internal_links_with_errors)
    #sys.exit(1)
if num_warnings != 0:
    if num_warnings == 1:
        print('Warning: There is 1 non-breaking issues in links.')
    else:
        print('Warning: There are ' + str(num_warnings) + ' non-breaking issues in links.')
    #print(internal_links_with_warnings)
if num_errors == 0 and num_warnings == 0:
    print('Success: All internal links are valid.')
else:
    sys.exit(1)

# Log duplicate to Excel
# alias, link to guide that it appears on

# Check internal links.
# Build a list of all canonical URLs and aliases
#   If alias is duplicate
#       Log error
# Iterate through all markdown links
#   If link does not begin with `https://` or `http://`
#       If the link appears in list of alias urls
#          Log warning
#       Elif the link does not appear in list of canonical urls
#           Log error
# Iterate through all links in changed docs
#   If link begins with `https://` or `http://`
#       Perform a web request.
#       If web request results in 400 (or maybe non 200?)
#           Log error
#       Elif web request results in 301
#           Log warning