import sys
import regex

filenames = []
for fn in range(1,len(sys.argv)):
    filenames.append(sys.argv[fn])

target = regex.compile(r'-{4,}')

for filepath in filenames:
    with open(filepath, 'r') as f:
        old_line = ''
        new_doc = ''
        for number, line in enumerate(f,1):
            if line.startswith('|'):
                new_doc += old_line
            else:
                matches = regex.findall(target, line)
                if matches: 
                    print('Found match at line ' + str(number) + ':')
                    new_doc += '# ' + old_line
                    line = ''
                else:
                    new_doc += old_line
            old_line = line
    with open(filepath, 'w') as f:
        f.write(new_doc)

