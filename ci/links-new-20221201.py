#!/usr/bin/env python
import os
import sys
import re
import frontmatter
import random

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
    "docs/api",
    "docs/reference-architecture"
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

                        # Identifies the canonical link for a guide
                        if "slug" in expanded_guide.keys() and "docs/guides/" in file_path:
                            canonical_link = "/docs/guides/" + expanded_guide['slug'] + "/"
                        elif "slug" in expanded_guide.keys() and "docs/api/" in file_path:
                            canonical_link = "/docs/api/" + expanded_guide['slug'] + "/"
                        else:
                            canonical_link = "/" + file_path
                            canonical_link = canonical_link.replace('/index.md','/')
                            canonical_link = canonical_link.replace('/_index.md','/')

                        # Construct the guide object
                        guide = Guide(file_path, expanded_guide['title'], canonical_link)

                        # Add aliases to the guide object if they exist
                        if "aliases" in expanded_guide.keys():
                            guide.add_aliases(expanded_guide['aliases'])

                        # Append the guide object to the list of guides
                        guides.append(guide)
                    except Exception as e: print(e)

    print ("There are " + str(len(guides)) + " guides.")

    print("There are " + str(i) + " markdown files.")

    #for x in random.sample(guides, 5):
    #    print(x.path)
    #    print(x.title)
    #    print(x.link)
    #    if x.aliases:
    #        print(x.aliases)
    #        print(x.aliases[0])

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
def get_duplicate_aliases3(guides):

    aliases = set()
    duplicate_aliases = []

    for guide in guides:
      for alias in guide.aliases:
        if (alias,guide) in aliases:
          existing_duplicate_alias = next((x for x in duplicate_aliases if x.link == alias), None)
          if existing_duplicate_alias:
              existing_duplicate_alias.add_guide(guide)
              print("Duplicate alias found (EXISTING duplicate): " + alias)
              print("... in " + guide.path)
          else:
              duplicate_alias = Issue(alias,'duplicate-alias')
              duplicate_alias.add_guide(guide)
              duplicate_aliases.append(duplicate_alias)
              print("Duplicate alias found (NEW duplicate): " + alias)
              print("... in " + guide.path)
        else:
          aliases.add((alias, guide))

    print ("Number of duplicate aliases:" + str(len(duplicate_aliases)))

    for alias in duplicate_aliases:
      print("Alias: " + alias.link)
      for guide in alias.affected_guides:
          print("... Guide: " + guide.path)

    return duplicate_aliases

# ------------------
# Check for duplicate aliases
# ------------------
def get_duplicate_aliases2(guides):

    aliases = set()
    issues = []

    for guide in guides:
      for alias in guide.aliases:
        if alias in aliases:
          issues.append(Issue(alias,'duplicate-alias'))
        else:
          aliases.add(alias)

    print ("Number of issues:" + str(len(issues)))

    for issue in issues:
      print("Alias: " + issue.link)
      for guide in issue.affected_guides:
          print("... Guide: " + guide.path)

    return issues

# ------------------
# Check for duplicate aliases
# ------------------
def get_duplicate_aliases(guides):

    aliases = []
    duplicate_aliases = []

    for guide in guides:
        for alias in guide.aliases:
          if aliases:
            for existing_alias in aliases:
            # if aliases.get(alias):
            #if alias in aliases:
              if alias in existing_alias[0]:
                print(2)
                # Get the first item in duplicate_aliases that contains the alias
                existing_duplicate_alias = next((x for x in duplicate_aliases if x.link == alias), None)
                if existing_duplicate_alias:
                    existing_duplicate_alias.add_guide(guide)
                    print("Duplicate alias found (EXISTING duplicate): " + alias)
                    print("... in " + guide.path)
                else:
                    duplicate_alias = Issue(alias,'duplicate-alias')
                    duplicate_alias.add_guide(guide)
                    duplicate_aliases.append(duplicate_alias)
                    print("Duplicate alias found (NEW duplicate): " + alias)
                    print("... in " + guide.path)
          aliases.append((alias, guide))

    print(str(len(aliases)))

    # duplicate_aliases = [x for n, x in enumerate(aliases) if x in aliases[:n]]

    print ("Number of duplicate aliases:" + str(len(duplicate_aliases)))

    for x in random.sample(duplicate_aliases, 2):
    #for x in guides[:0]:
        print(x.link)
        for guide in x.affected_guides:
            print(guide.path)

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
# Check internal links
# ------------------
def check_internal_markdown_links(guides):

    # The regex pattern used to locate all markdown links containing the string "/docs".
    # This bypasses any external urls and archor links
    link_pattern = re.compile("(?:[^\!]|^)\[([^\[\]]+)\]\(()([^()]+)\)")
    # An array of all internal links that do not point to a guide
    internal_links_with_errors = []
    internal_links_with_warnings = []

    for guide in guides:
                expanded_guide = frontmatter.load(guide.path)

                # Reset insideSpecialElement for each new file
                insideSpecialElement = False

                # Iterate through each line of the file
                for i, line in enumerate(open(guide.path)):

                    if line.strip().startswith('{{< file'):
                        insideSpecialElement = True
                        continue
                    elif line.strip().startswith('{{</ file'):
                        insideSpecialElement = False
                        continue

                    if insideSpecialElement == True:
                        continue

                    # Skip over block quotes
                    if line.strip().startswith('>'):
                        continue
                    # Find and iterate through all markdown links to other guides
                    for match in re.finditer(link_pattern, line):
                        # Remove the title, brackets, and parenthesis from the markdown link syntax
                        link = match.group(3)
                        link_unmodified = link
                        #link = link[link.find("(")+1:link.find(")")]
                        if "linode.com/docs/" in link:
                            internal_links_with_errors.append(link_unmodified)
                            continue
                        # Ignore links that start with common protocols
                        if link.startswith('http://') or link.startswith('https://') or link.startswith('ftp://'):
                            continue
                        # Ignore anchors
                        if link.startswith('#'):
                            continue
                        elif "#" in link:
                            link = link.split("#", 1)[0]
                        # Ignore links to resources within the same directory
                        if not "/" in link and "." in link:
                            continue
                        # Log error if link does not start with /docs/
                        if not link.startswith('/docs/'):
                            internal_links_with_errors.append(link_unmodified)
                            continue
                        # Log warning if link ends with two slashes /
                        if '//' in link:
                            internal_links_with_warnings.append(link_unmodified)
                            link = link.replace('//','/')
                        # Log warning if link does not end with a slash /
                        if not link.endswith('/'):
                            internal_links_with_warnings.append(link_unmodified)
                            link = link + '/'
                        # Check if link points to a canonical internal URL
                        if not next((x for x in guides if x.link == link), None):
                        #if not (link in guides.link):
                            # Checks if the link matches an alias or not
                            if next((x for x in guides if link.replace('/docs/','/') in x.aliases), None) is not None:
                            #if aliases.get(link.replace('/docs/','/')) is not None:
                                internal_links_with_warnings.append(link_unmodified)
                            else:
                                internal_links_with_errors.append(link_unmodified)

    num_errors = len(internal_links_with_errors)
    num_warnings = len(internal_links_with_warnings)

    if num_errors != 0:
        if num_errors == 1:
            print('Failure: There is 1 error in links.')
        else:
            print('Failure: There are ' + str(num_errors) + ' errors in links.')
        for link in internal_links_with_errors:
            print("\t- " + link)
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

# ------------------
# Main function
# ------------------
def main():

    guides = get_guides()
    assets = get_assets()

    issues = []

    issues.append(get_duplicate_aliases2(guides))

    #check_internal_markdown_links(guides)

    invalid_links = []

    issue_log = "issues.csv"

if __name__ == "__main__":
    main()