#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY

npm install 

pm2 start app.js --name prod-app