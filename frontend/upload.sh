#!/usr/bin/env bash

eval `ssh-agent`
ssh-add

ssh -t watched@137.74.45.180 "kill \$(ps aux | grep '[j]ava -jar' | awk '{print \$2}')"
ssh -t watched@137.74.45.180 "rm server/package.jar"
ssh -t watched@137.74.45.180 "rm -r frontend/assets"
ssh -t watched@137.74.45.180 "rm frontend/index.html"

scp ../backend/target/backend-0.0.1-SNAPSHOT.jar watched@137.74.45.180:~/server/package.jar
scp -r dist watched@137.74.45.180:~/frontend/assets
scp index.html watched@137.74.45.180:~/frontend/index.html

ssh -t watched@137.74.45.180 "nohup java -jar -Dspring.profiles.active=production server/package.jar > logs.out 2> logs.err &"
read -n1 -r -p "Press any key to continue..." key