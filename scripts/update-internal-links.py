#!/usr/bin/env python3
import sys
import os
import re
import frontmatter

# A dictionary that maps all aliases to the current (canonical) link
aliases = {}
# A dictionary that contains all the aliases that are duplicated on multiple guides
duplicate_aliases = {}
# Counts
link_count = 0
guide_count = 0
fixed_link_count = 0

output_duplicates_filename = "duplicates.csv"

def main():
    docs_path = ""

    if len(sys.argv) == 2:
        docs_path = sys.argv[1]
        if not docs_path.endswith('/'):
            docs_path += "/"

    print(docs_path)

    path_to_guides = docs_path + "docs/guides/"
    path_to_product_docs = docs_path + "docs/products/"

    build_list_of_good_links(path_to_guides)
    build_list_of_good_links(path_to_product_docs)

    fix_existing_old_links(path_to_guides)
    fix_existing_old_links(path_to_product_docs)

    print("Aliases: " + str(len(aliases)))
    print("Duplicate aliases: " + str(len(duplicate_aliases)))
    print("Total guides analyzed: " + str(guide_count))
    print("Total links analyzed: " + str(link_count))
    print("Total links fixed: " + str(fixed_link_count))

def build_list_of_good_links(path_to_audit):
    """
    Build a list of all aliases and map them to their current link

    path_to_audit: the path to the guides to audit
    """

    global aliases
    global duplicate_aliases

    # Iterate through each markdown file within the path_to_audit
    for root, dirs, files in os.walk(path_to_audit):
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

def fix_existing_old_links(path_to_audit):
    """
    Find all markdown links, identify if they are an old link (alias),
    and replace them with the current link.

    path_to_audit: the path to the guides to audit
    """

    global guide_count
    global link_count
    global fixed_link_count

    # The regex pattern used to locate all markdown links containing the string "/docs".
    # This bypasses any external urls and archor links
    link_pattern = re.compile("(?:[^\!]|^)\[([^\[\]]+)\]\((/docs)([^()]+)\)")

    # Iterate through each markdown file within the given path
    for root, dirs, files in os.walk(path_to_audit):
        for file in files:
            if file.endswith('.md'):

                # The relative file path of the file
                file_path = os.path.join(root, file)
                guide_count+=1

                # Iterate through each line of the file
                for i, line in enumerate(open(file_path)):
                    # Find and iterate through all markdown links to other guides
                    for match in re.finditer(link_pattern, line):
                        link_count += 1
                        # Remove the title, brackets, and parenthesis from the markdown link
                        link = match.group()
                        link = link[link.find("(")+1:link.find(")")]
                        # Remove /docs/ from the link so its formatted the same as aliases
                        link_as_alias = link.replace('/docs/','/')
                        # Searches the aliases dictionary for the canonical link
                        link_canonical = aliases.get(link_as_alias)
                        # Checks if the link matches an alias (is not current)
                        if link_canonical is not None:
                            # Checks if the link matches a duplicate
                            if duplicate_aliases.get(link_as_alias):
                                with open(output_duplicates_filename, "w") as f:
                                    f.write(link_as_alias)
                                print("SKIPPED LINK | Points to duplicate aliases: " + link)
                            else:
                                print("UPDATED LINK | " + file_path + " | Changed " + link + " to " + link_canonical)
                                fixed_link_count += 1
                                # Replace the outdated link with the new link
                                with open(file_path) as f:
                                    updated_contents=f.read().replace(link, link_canonical)
                                with open(file_path, "w") as f:
                                    f.write(updated_contents)
                        # Check to see if the link matches a current link.
                        else:
                            continue

if __name__ == "__main__":
    main()