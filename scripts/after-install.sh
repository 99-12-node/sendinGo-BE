#!/bin/bash
REPOSITORY=/home/ubuntu/build

cd $REPOSITORY

sudo npm install 

sudo pm2 stop all
sudo pm2 start app.js --name deploy