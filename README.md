# getcomic - 漫画打包器

这是一个漫画打包器，可以将线上漫画直接打包成一个pdf文件。

考虑到国内网络环境，建议通过docker来使用。

暂时只支持 manhuadb 一个源，暂时只支持pdf输出方式。

### docker下的使用说明

1. 新建目录，可以是getcomic，下面所有操作，都在该目录下进行。

2. 通过dockerhub拉取镜像。

```
docker pull zerrozhao/getcomic
```

3. 在目录下新建``cfg``目录，并复制下面内容到``cfg/config.yaml``里。

```yaml
source: manhuadb
comicid: 139
roottype: 1
isdebug: false
comicrootpath: ./comic
```

4. 新建 ``comic`` 目录。

5. 执行下面脚本，即可开始下载并打包漫画。

```
docker stop getcomic
docker rm getcomic
docker run -d -v $PWD/cfg:/usr/src/app/cfg -v $PWD/comic:/usr/src/app/comic --name getcomic zerrozhao/getcomic
```