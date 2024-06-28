
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

