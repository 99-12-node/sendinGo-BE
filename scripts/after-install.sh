#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY

npm install 

pm2 stop all
pm2 kill

pm2 start ecosystem.config.js --env development --only sendingo-app-dev
pm2 start ecosystem.config.js --env production --only sendingo-app