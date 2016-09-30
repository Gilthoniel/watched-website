#!/bin/bash

nohup java -jar -Dspring.profiles.active=production server/package.jar > logs.out 2> logs.err &