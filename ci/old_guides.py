from tabulate import tabulate
from operator import itemgetter
import yaml
import regex
import glob

def parse_yaml(filestring):
    reg = regex.compile(r'^---(.*?)---',flags=regex.DOTALL)
    match = regex.search(reg, filestring)
    if not match: return {}
    yaml_text = match.group(1)
    try:
        return yaml.load(yaml_text)
    except:
        return {}

def make_record(yaml):
    if 'title' in yaml:
        title = yaml['title']
    else:
        title = "No title"
    record = {
        'title': title,
        'updated': yaml['modified']        
    }
    return record


def find_old_guides():
    old_guides = []
    guides_scanned = 0
    rootdir = 'docs'
    for files in glob.glob('docs/**/*.md',recursive=True):
        guides_scanned += 1
        filename = files 
        with open(filename, 'r') as f:
            filestring = f.read()
            parsed = parse_yaml(filestring)
            if 'modified' in parsed and 'deprecated' not in parsed:
                record = make_record(parsed)
                record['path'] = filename
                old_guides.append(record)
    print(str(guides_scanned) + " guides scanned.")
    old_guides.sort(key=itemgetter('updated'))
    oldest_guides = old_guides[0:20]
    print(tabulate(oldest_guides))        


if __name__ == '__main__':
    find_old_guides()
