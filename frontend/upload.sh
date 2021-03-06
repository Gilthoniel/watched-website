#!/usr/bin/env bash

# Keep in memory the passphrase for the session
echo "Save the ssl passphrase"
eval `ssh-agent`
ssh-add

echo "Start cleaning the server"
ssh -t watched@137.74.45.180 "kill \$(ps aux | grep '[j]ava -jar' | awk '{print \$2}')"
ssh -t watched@137.74.45.180 "rm server/package.jar"
ssh -t watched@137.74.45.180 "rm -r frontend/assets"
ssh -t watched@137.74.45.180 "rm frontend/index.html"

echo "Copying files"
scp ../backend/target/backend-0.0.1-SNAPSHOT.jar watched@137.74.45.180:~/server/package.jar
scp -r dist watched@137.74.45.180:~/frontend/assets
scp index.html watched@137.74.45.180:~/frontend/index.html
ssh -t watched@137.74.45.180 "chmod a+x run_package.sh"

echo "Run the server"
ssh watched@137.74.45.180 "./run_package.sh"
read -n1 -r -p "Press any key to continue..." key