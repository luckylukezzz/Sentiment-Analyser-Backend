
### full stack CI/CD

frontend: react -> Vercel<br>
backend: node.js -> EC2<br>

## EC2 instance creation

use t3 micro<br>
create pem key<br>

<img src="https://github.com/luckylukezzz/nodesv/assets/50476499/eaed2cc4-cfd0-4e3b-92eb-fe20f2415493" alt="Description of the image" width="300"/>
<br>
setting up storage and security group<br>
<img src="https://github.com/luckylukezzz/nodesv/assets/50476499/71b0e23e-888b-4ef4-95d7-6596ddfc72d4" alt="Description of the image" width="300"/>
<br>
check inbound trafiic<br>

<img src="https://github.com/luckylukezzz/nodesv/assets/50476499/f244a418-1189-4697-b8f1-749b4128b3c2" alt="Description of the image" width="300"/>
<br>

## Connecting to ec2

open cmd at the location of downloaded .pem key. then paste the following command. and go along with instructions<br>
<img src="https://github.com/luckylukezzz/nodesv/assets/50476499/1ccf81e4-bc27-497c-89a2-a3096be08e49" alt="Description of the image" width="300"/>

## Runner create

repo setting-> actions -> runners -> self-hosted-runner->linux
<br>
<img src="https://github.com/luckylukezzz/nodesv/assets/50476499/44039d56-211c-48b0-8144-0fbffe2d0a24" alt="Description of the image" width="300"/>
<br>
just copy paste all in terminal until configuration
<br>
<img src="https://github.com/luckylukezzz/nodesv/assets/50476499/30f25a2a-8ca3-477e-844f-765d3bef267c" alt="Description of the image" width="300"/>
<br>
now runner is offline<br>
paste these commands -> runner idle<br>
<img src="https://github.com/luckylukezzz/nodesv/assets/50476499/7244b5e3-cbe4-4c91-955b-d26f287204a1" alt="Description of the image" width="300"/>

## .env file secrets

settings -> secrets and variables -> ations -> new repo secret <br>
paste env variables here<br>

## github actions

actions tab -> continuous intergration -> select node.js
```sh
# This workflow will do a clean installation of node dependencies, cache/restore them, build the source code and run tests across different versions of node
# For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

name: Node.js CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:

    runs-on: self-hosted

    strategy:
      matrix:
        node-version: [18.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: |
        touch .env
        echo "${{ secrets.ENV }}" > .env


# use this later(not now)
#--------------------------------------------------------------
    - run: pm2 restart backend     
    
```
<br>
check the repo files r there
<br>
here the actions-runner-bacendserver is runner name you created<br>
nodejs-restapi-ec2 is the repo name  (change them as yours)<br>
<img src="https://github.com/luckylukezzz/nodesv/assets/50476499/9c9b3a4d-891b-4f81-9bb7-c07aec3b2534" alt="Description of the image" width="300"/>
<br>

## installing nginx, node,pm2 in vps

```sh
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh
sudo apt-get install -y nodejs
node -v
npm -v
sudo apt-get install -y nginx
sudo npm i -g pm2
```
## create ssl certificates 
```sh
which openssl
sudo mkdir /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/nginx-selfsigned.key -out /etc/nginx/ssl/nginx-selfsigned.crt
```

## configure nginx

```sh
cd /etc/nginx/sites-available
sudo nano default

```
```sh
server {
      listen 80 default_server;
      listen [::]:80 default_server;
      server_name _;
      location / {
             return 301 https://$host$request_uri;
      }
}
server{
      listen 443 ssl default_server;
      listen [::]:443 ssl default_server;
      server_name _;
      ssl_certificate /etc/nginx/ssl/nginx-selfsigned.crt;
      ssl_certificate_key /etc/nginx/ssl/nginx-selfsigned.key;

      ssl_protocols TLSv1.2 TLSv1.3;
      ssl_prefer_server_ciphers on;
      ssl_ciphers HIGH:!aNULL:!MD5;

      root /var/www/html;
location / {
             rewrite ^\/(.*)$ /$1 break;
              proxy_pass http://localhost:5000;
             proxy_set_header Host $host;
              proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
      }
}
                                     
```
<br>
ctrl + x to save <br>
then enter<br>

```sh
sudo systemctl restart nginx
```

## running node server
In terminal
go to where server.js is <br>
runner_path/_work/rep_oname/repo_name  might like this <br>

```sh
pm2 start server.js --name=backend
```
<br>
In terminal set path for pm2 that github can recognize
<br>

```sh
sudo ln -s "$(which pm2)" /usr/bin/pm2
```

<br>
now its time to modify yaml file in repo .github/workflows with 
<br>

```sh
- run: pm2 restart backend
```

### deploy frontend with vercel or netlify (change api endpoints in frontend requests to https)
