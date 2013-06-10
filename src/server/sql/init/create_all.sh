#!/bin/sh -x

for file in $(ls create_*.sql)
do
    mysql -h igingadb.cjwa8rdmpuw6.ap-northeast-1.rds.amazonaws.com -u dbuser -p < $file
done
