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
# 漫画源站
source: manhuadb
# 漫画id，如果是manhuadb，其实就是该漫画url最后的数字
comicid: 139
# 有些漫画会分为港版台版甚至电子版等，这个是该漫画下载哪个类型，0表示第1个分类，-1表示全部下载
roottype: 1
# 除非是图形环境，否则不要开启debug模式
isdebug: false
# 漫画输出目录
comicrootpath: ./comic
```

4. 新建 ``comic`` 目录。

5. 执行下面脚本，即可开始下载并打包漫画。

```
docker stop getcomic
docker rm getcomic
docker run -d -v $PWD/cfg:/usr/src/app/cfg -v $PWD/comic:/usr/src/app/comic --name getcomic zerrozhao/getcomic
```