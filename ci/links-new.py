#!/usr/bin/env python
import os
import sys
import re
import frontmatter

class Guide:
    def __init__(self, path, title, link):
        self.path = path
        self.title = title
        self.link = link
        self.aliases = []
        self.assets = []
        self.anchors = []
        self.issues = []
        self.logged = False

    def add_aliases(self, aliases):
        self.aliases = aliases

    def add_asset(self, asset):
        self.assets.append(asset)

    def add_anchor(self, anchor):
        self.anchors.append(anchor)

    def add_issue(self, issue):
        self.issues.append(issue)

    def log_guide(self):
        self.logged = True

class Asset:
    def __init__(self, link):
        self.link = link

class Alias:
    def __init__(self, link, guide):
        self.link = link
        self.guide = guide

class Issue:
    def __init__(self, link, issue_code):
        self.link = link
        self.issue_code = issue_code
        self.affected_guides = []
        self.title = ""

    def add_guide(self, guide):
        self.affected_guides.append(guide)

    def add_title(self, title):
        self.title.append(title)

issue_codes = {
    'not-found': 'failure',
    'duplicate-alias': 'failure',
    'full-docs-url': 'failure',
    'not-within-docs': 'failure',
    'formatting': 'failure',
    'points-to-alias': 'warning',
}

docs_dir = [
    "docs/guides",
    "docs/products",
    "docs/bundles",
    "docs/api"
]

assets_dir = "docs/assets"

# ------------------
# Build a list of all guides
# ------------------
def get_guides():

    guides = []
    i = 0

    # Iterate through each file in each docs directory
    for dir in docs_dir:
        for root, dirs, files in os.walk(dir):
            for file in files:

                # The relative file path of the file
                file_path = os.path.join(root, file)

                # Only look for markdown files
                if file.endswith('.md'):
                    i += 1
                    try:
                        # Loads the entire guide (including front matter)
                        expanded_guide = frontmatter.load(file_path)

                        # Ignores the guide if it's headless
                        if "headless" in expanded_guide.keys():
                            if expanded_guide["headless"] == True:
                                continue

                        # Identifies the valid link for a guide
                        if "slug" in expanded_guide.keys() and "docs/guides/" in file_path:
                            link = "/docs/guides/" + expanded_guide['slug'] + "/"
                        elif "slug" in expanded_guide.keys() and "docs/api/" in file_path:
                            link = "/docs/api/" + expanded_guide['slug'] + "/"
                        else:
                            link = "/" + file_path
                            link = link.replace('/index.md','/')
                            link = link.replace('/_index.md','/')

                        # Construct the guide object
                        guide = Guide(file_path, expanded_guide['title'], link)

                        # Add aliases to the guide object if they exist
                        if "aliases" in expanded_guide.keys():
                            guide.add_aliases(expanded_guide['aliases'])

                        # Append the guide object to the list of guides
                        guides.append(guide)
                    except Exception as e: print(e)

    #for guide in guides:
    #    print(guide.path)

    print ("There are " + str(len(guides)) + " guides.")

    print("There are " + str(i) + " markdown files.")

    return guides

# ------------------
# Build a list of all assets
# ------------------
def get_assets():

    assets = []

    for root, dirs, files in os.walk(assets_dir):
        for file in files:

            # The relative file path of the file
            file_path = os.path.join(root, file)

            link = "/" + file_path

            asset = Asset(link)
            assets.append(asset)

    return assets

# ------------------
# Check for duplicate aliases
# ------------------
def get_duplicate_aliases(guides):

    aliases = []
    duplicate_alias = []

    for guide in guides:
        for alias in guide.aliases:
            if alias in aliases[0]:
                if next((x for x in duplicate_aliases if x.value == alias), None):
                    duplicate_alias.add_guide(alias[1])
                else:
                    duplicate_alias = Issue(alias[0],'duplicate-alias')
                    duplicate_alias.add_guide(alias[1])
                    duplicate_aliases.append(duplicate_alias)
            aliases.append((alias, guide))

    print(str(len(aliases)))

    duplicate_aliases = [x for n, x in enumerate(aliases) if x in aliases[:n]]

    print (duplicate_aliases)

    return duplicate_aliases

def filter_duplicate_alias(duplicate_aliases, link):
    for x, y in duplicate_aliases:
        if x == link :
            yield x,y

    #for alias in aliases:
    #    if alias[0].count(alias) > 1:
    #        duplicate_alias = Issue(alias[0],'duplicate-alias')
    #        duplicate_alias.add_guide(alias[1])
    #        duplicate_aliases.append(duplicate_alias)
    #
    #        if duplicate_aliases.get(alias) is not None:
    #            # If the duplicate has been logged, increment the count.
    #            # This helps us identify how many times this alias appears.
    #            count = duplicate_aliases.get(alias)
    #            count = count + 1
    #            duplicate_aliases.update({ alias : count})
    #        # If the duplicate alias has not yet been logged, clear it and log it.
    #        else:
    #          # Log the duplicate, starting the count at 2
    #          duplicate_aliases.update({ alias : 2})
    #      # If the alias does not yet exist in the aliases dictionary, add it


# ------------------
# Main function
# ------------------
def main():

    guides = get_guides()
    assets = get_assets()

    issues = []

    issues = issues + get_duplicate_aliases(guides)
    invalid_links = []

    issue_log = "issues.csv"

if __name__ == "__main__":
    main()