import sys
import regex
import os
import fnmatch


def main():
    print('Running replacement script...')
    target = regex.compile(r'-{4,}')
    source_dir = '.'
    if len(sys.argv) > 1:
        source_dir = sys.argv[1]
    for root, dirnames, filenames in os.walk(source_dir):
        for filename in fnmatch.filter(filenames,'*.md'):
            old_line = ''
            with open(os.path.join(root,filename)) as infile:
                new_doc = ''
                is_shortcode = []
                for number, line in enumerate(infile, 1):
                    if regex.findall('{{< \w+',line):
                        is_shortcode.append(True)
                    elif regex.findall('{{< \/',line):
                        if len(is_shortcode) > 0:
                            is_shortcode.pop()
                    if line.strip().startswith('|') or line.strip().startswith('#') or any(is_shortcode):
                        new_doc += old_line
                    else:
                        matches = regex.findall(target, line)
                        if matches and len(matches) is 1: 
                            print("Found match in file {} at line {}:".format(filename, str(number)))
                            print(matches)
                            new_doc += '# ' + old_line
                            line = ''
                        else:
                            new_doc += old_line
                    old_line = line
            new_doc += old_line
            old_line = ''
            with open(os.path.join(root,filename), 'w') as f:
                f.write(new_doc)

if __name__ == '__main__':
    main()
