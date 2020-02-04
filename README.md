# getcomic - 漫画打包器

这是一个漫画打包器，可以将线上漫画直接打包成一个pdf文件。

考虑到国内网络环境，建议通过docker来使用。

暂时只支持 ``manhuadb`` 一个源，暂时只支持pdf输出方式，发布到线上环境也只支持``telegraph``。

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
comicid: 545
# 有些漫画会分为港版台版甚至电子版等，这个是该漫画下载哪个类型，0表示第1个分类，-1表示全部下载
roottype: 0
# 除非是图形环境，否则不要开启debug模式
isdebug: false
# 漫画输出目录
comicrootpath: ./comic
# 是否输出pdf文件
outputpdf: true
# 是否发布到telegraph，如果要发布，则需要配置telegraph.yaml文件
publishtelegraph: true
# telegraph配置文件
telegraphconfig: ./cfg/telegraph.yaml
```

4. 如果希望发布到``telegraph``，还需要配置``cfg/telegraph.yaml``文件。

``` yaml
# 账号，按我的习惯一般全小写字母加数字，不确定是否有限制
shortname: zerro
# 作者名
authorname: Zerro Zhao
# token，如果是新建一个账号，第一次是不知道token的，启动一次以后，将输出的token填到这里
token: 
# 上传文件超时
timeout: 30000
# 输出目录
outputpath: ./telegraphdata
```

5. 新建 ``comic``、``telegraphdata`` 目录。

5. 执行下面脚本，即可开始下载、打包、发布漫画。

```
docker stop getcomic
docker rm getcomic
docker run -d -v $PWD/cfg:/usr/src/app/cfg -v $PWD/comic:/usr/src/app/comic --name getcomic zerrozhao/getcomic
```

注意：

- 当查看该进程已结束后，漫画就下载完了，可以通过 ``docker ps`` 查看。 
- 内部有各种错误处理机制，但万一被ban或者别的网络错误，可能会很长时间没有反应，这时重启即可，前面已经下载的不会重复下载，中间有缺页的也会再次补齐。
- 如果使用docker方式，需要版本更新时，直接执行 ``docker pull zerrozhao/getcomic`` 即可更新到最新版，配置文件等都会向下兼容。
- 如果是npm安装的，需要版本更新时，直接执行 ``npm i getcomic -g`` 即可。
- 发布到``telegraph``时，前面会有一个``upload``图片的过程，由于``telegraph``对同ip上传图片频次有限制，可能会提示过段时间再试，建议间隔1小时重启，前面已经上传的文件不会重新上传。
- 关于``telegraph``内容，可以直接查看``telegraphdata``下面的``json``文件，每次重启，都会拉取最新的数据，包括阅读数等。
- 如果要发布到``telegraph``，``title``尽量不要设置为``account``。
- ``telegraph``在mac、ios、android下，阅读体验很好，在windows下就是一个普通网页而已。

### nodejs环境下直接使用

``` sh
npm i getcomic -g
```

后续步骤和docker一样。

### 测试

少量测试用例，jest即可执行。

### 更新说明

##### v0.2

- 新增发布漫画到telegraph
- 支持telegraph自动传图片
- 支持telegraph上传缓存，不会重复上传文件

##### v0.1

- 支持manhuadb源下载
- 支持直接打包为pdf，方便各种电子书（特别是非kindle系列的大屏电子书）阅读
- 支持本地缓存，不会重复下载