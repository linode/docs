#!/bin/bash
zone=$1
if [ ! -f ${zone}.template ]; then
  /bin/echo "Template file ${zone}.template not found."
  exit 1
fi

cat ${zone}.template > ${zone}.zone

if [ -f ${zone}.zone.signed ]; then
  ZSK=`/bin/grep "(zsk)" K${zone}.+*.key |/bin/head -1 |cut -d":" -f1 |/bin/sed -e s?"\.key$"?""?`
  KSK=`/bin/grep "(ksk)" K${zone}.+*.key |/bin/head -1 |cut -d":" -f1 |/bin/sed -e s?"\.key$"?""?`
else
  ZSK=`/usr/bin/ldns-keygen -a RSASHA1-NSEC3-SHA1 -b 1024 ${zone}`
  #ZSK=`/usr/bin/ldns-keygen -a RSASHA1-NSEC3-SHA1 -b 2048 ${zone}`
  KSK=`/usr/bin/ldns-keygen -k -a RSASHA1-NSEC3-SHA1 -b 2048 ${zone}`
  rm -f ${ZSK}.ds ${KSK}.ds
fi

SALT=`/bin/head -n 1024 /dev/random |/usr/bin/sha1sum |cut -d' ' -f1`

/usr/bin/ldns-signzone -n -p -s ${SALT} ${zone}.zone $ZSK $KSK

#KSK DS
/usr/bin/ldns-key2ds -n -1 ${zone}.zone.signed > ${KSK}.ds

KKSK=`echo ${KSK} |/bin/sed -e s?"^K"?"K256"?`

/usr/bin/ldns-key2ds -n -2 ${zone}.zone.signed > ${KKSK}.ds
