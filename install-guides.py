#! /usr/local/bin/python3

from sys import argv
import os
import shutil

script, firstargument = argv

#create directories using hugo archetype and command line provided directory
command = "hugo new --kind distribution-install-guides " + firstargument
os.system(command)

currentDirectory = os.getcwd()
source = currentDirectory + "/docs/" + firstargument

words = firstargument.split("/")
endDir = words[-1]

# Build sources for renaming of subdirectories
finalSourceUbuntu = source + "/" + "how-to-install-x-on-ubuntu"
finalSourceDebian = source + "/" + "how-to-install-x-on-debian"
finalSourceCentOS = source + "/" + "how-to-install-x-on-centos"

# Build destination for remaining subdirectories
destinationUbuntu = currentDirectory + "/docs/" + firstargument + "/"+ endDir + "-ubuntu"
destinationDebian = currentDirectory + "/docs/" + firstargument + "/"+ endDir + "-ubuntu"
destinationCentOS = currentDirectory + "/docs/" + firstargument + "/"+ endDir + "-ubuntu"

print("Will move these directories:\n" + finalSourceUbuntu + "\n" + finalSourceDebian + "\n" + finalSourceCentOS + "\n")
print("To this destination:\n" + destinationUbuntu + "\n" + destinationDebian + "\n" + destinationCentOS + "\n")

#Move subdirectories
dest = shutil.move(finalSourceUbuntu, destinationUbuntu)
dest = shutil.move(finalSourceDebian, destinationDebian)
dest = shutil.move(finalSourceCentOS, destinationCentOS)