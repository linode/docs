import regex
from dateutil.parser import parse
import sys
import yaml
import json
import csv
import os
import fnmatch

def parse_date(yaml_file,field):
    try:
        return parse(str(yaml_file[field]))
    except:
        return None 

def main():
    source_dir = '.'
    if len(sys.argv) > 1:
        source_dir = sys.argv[1]
    with open('publication_dates.csv', 'w', newline='') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(['filename','published','modified','expires','deprecated'])
        for root, dirnames, filenames in os.walk(source_dir):
            for filename in fnmatch.filter(filenames,'*.md'):
                if not filename.startswith('_'):
                    with open(os.path.join(root,filename)) as f:
                        row = [filename]
                        filestring = f.read()
                        reg = regex.compile(r'^---(.*?)---',flags=regex.DOTALL)
                        match = regex.search(reg, filestring)
                        assert match
                        yaml_text = match.group(1)
                        yml = yaml.load(yaml_text)
                        row.append(parse_date(yml,'published'))
                        row.append(parse_date(yml,'modified'))
                        if 'expiryDate' in yml:
                            row.append(parse_date(yml,'expiryDate'))
                        else:
                            row.append(None)
                        if 'deprecated' in yml:
                            row.append(yml['deprecated'])
                        else:
                            row.append(False)
                    csvwriter.writerow(row)        
    
if __name__ == '__main__':
    main()
