from tabulate import tabulate
from operator import itemgetter
import frontmatter
import sys
import regex
import glob

def make_record(yaml):
    """Create a dictionary object from yaml front matter"""
    
    if 'title' in yaml:
        title = yaml['title']
    else:
        title = "No title"
    record = {
        'title': title,
        'updated': yaml['modified']        
    }
    return record

def find_old_guides(count=20):
    """Print a list of the 20 oldest guides in the library.

    Results are sorted by modification date (in front matter)
    and deprecated guides are ignored.

    Command line arguments:
    count: number of guides to list (default: 20)
    """
    old_guides = []
    guides_scanned = 0
    rootdir = 'docs'
    for filename in glob.glob('docs/**/*.md',recursive=True):
        guides_scanned += 1
        with open(filename, 'r') as f:
            yaml = frontmatter.loads(f.read())
            if 'modified' in yaml and 'deprecated' not in yaml:
                record = make_record(parsed)
                record['path'] = filename
                old_guides.append(record)
    print(str(guides_scanned) + " guides scanned.")
    old_guides.sort(key=itemgetter('updated'))
    oldest_guides = old_guides[0:count]
    print(tabulate(oldest_guides))        


if __name__ == '__main__':
    if len(sys.argv) > 1:
        count = int(sys.argv[1])
    else:
        count = 20
    find_old_guides(count)
