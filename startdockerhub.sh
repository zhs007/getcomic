docker stop getcomic
docker rm getcomic
docker run -d -v $PWD/cfg:/usr/src/app/cfg -v $PWD/comic:/usr/src/app/comic --name getcomic zerrozhao/getcomic