# getcomic - 漫画打包器

这是一个漫画打包器，可以将线上漫画直接打包成一个 pdf 文件。  
从`v0.3.x`开始应该就非常稳定了，缺页问题基本上都是源站本来就缺页。  
后面版本更新，基本上都是添加源站。

考虑到国内网络环境，建议通过 docker 来使用。

## 关于漫画源站

暂时只支持 `manhuadb` 、 `manhuagui` 、`tvbsmh`，暂时只支持 pdf 输出方式，发布到线上环境也只支持`telegraph`。  
`manhuadb`普遍质量高一些，但有些漫画不全，而且有些漫画会缺页严重，因此后面支持了 `manhuagui`，但`manhuagui`漫画数量较少，所以还支持了`tvbsmh`。  
建议优先使用 `manhuadb` 来下载，缺失的部分用 `manhuagui` 或 `tvbsmh` 补完。

`tvbsmh` 的漫画，如果是单行本的，基本上都是双页。

`manhuagui` 会要求 ip 在国内，防爬虫策略最复杂。

### 关于部署环境

特别建议 windows 用户用 docker 来使用本项目（作者没实测过 windows），记住需要切换内核到 linux。

因为是 docker，按道理很多 nas 环境也能运行（没环境测试）。  
如果使用云服务器的话，建议内存至少有 2g。

你也可以直接使用[这个项目](https://github.com/zhs007/dockerscripts/tree/master/getcomic)来部署。

### docker 下的使用说明

1. 新建目录，可以是 getcomic，下面所有操作，都在该目录下进行。

2. 通过 dockerhub 拉取镜像。

```
docker pull zerrozhao/getcomic
```

3. 在目录下新建`cfg`目录，并复制下面内容到`cfg/config.yaml`里。

```yaml
# 漫画源站
source: manhuadb
# 漫画id，如果是manhuadb，其实就是该漫画url最后的数字
comicid: 545
# 只下一册时用，给空就是全下
bookid:
# 有些漫画会分为港版台版甚至电子版等，这个是该漫画下载哪个类型，0表示第1个分类，-1表示全部下载
roottype: 0
# 打包多少本书到一个文件
packagebooks: 1
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
# timeout - 60s
timeout: 60000
# 强制转换成png文件，部分站点jpg文件格式较奇怪，如果打包漫画出问题，建议强制转换为png下载。但强制转换png后，一般文件都会变大一些
outputpng: false
```

4. 如果希望发布到`telegraph`，还需要配置`cfg/telegraph.yaml`文件。

```yaml
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

5. 新建 `comic`、`telegraphdata` 目录。

6. 执行下面脚本，即可开始下载、打包、发布漫画。

```
docker stop getcomic
docker rm getcomic
docker run -d -v $PWD/cfg:/usr/src/app/cfg -v $PWD/comic:/usr/src/app/comic --name getcomic zerrozhao/getcomic
```

注意：

- 当查看该进程已结束后，漫画就下载完了，可以通过 `docker ps` 查看。
- 内部有各种错误处理机制，但万一被 ban 或者别的网络错误，可能会很长时间没有反应，这时重启即可，前面已经下载的不会重复下载，中间有缺页的也会再次补齐。
- 如果很多 TIMEOUT 的报错，建议将 timeout 时间改长，这样对网络不好的环境更合适。
- 配置文件里的 ``outputpng`` 要慎用，因为最终文件可能会变大到3倍左右，但有些时候，必须转换一次。
- comicid、bookid这些配置，不同源站不一样，自己多看看吧，特别是点开一部漫画，分别看看不同章节，应该就能发现规律了。
- packagebooks 是打包连载版用的，一般建议配置为8，就是8话打包为一本。
- 如果使用 docker 方式，需要版本更新时，直接执行 `docker pull zerrozhao/getcomic` 即可更新到最新版，配置文件等都会向下兼容。
- 如果是 npm 安装的，需要版本更新时，直接执行 `npm i getcomic -g` 即可。
- 发布到`telegraph`时，前面会有一个`upload`图片的过程，由于`telegraph`对同 ip 上传图片频次有限制，可能会提示过段时间再试，建议间隔 1 小时重启，前面已经上传的文件不会重新上传。
- 关于`telegraph`内容，可以直接查看`telegraphdata`下面的`json`文件，每次重启，都会拉取最新的数据，包括阅读数等。
- 如果要发布到`telegraph`，`title`尽量不要设置为`account`。
- `telegraph`在 mac、ios、android 下，阅读体验很好，在 windows 下就是一个普通网页而已。

### nodejs 环境下直接使用

```sh
npm i getcomic -g
```

后续步骤和 docker 一样。

### 测试

少量测试用例，jest 即可执行。

### 更新说明

##### v0.5

- 新增源 `tvbsmh`
- 优化了Docker镜像大小

##### v0.3

- 新增源 `manhuagui`
- 修正了某些漫画，对 pdf 页面大小判断不准确的 bug
- 可以将多话打包成 1 本

##### v0.2

- 新增发布漫画到 telegraph
- 支持 telegraph 自动传图片
- 支持 telegraph 上传缓存，不会重复上传文件

##### v0.1

- 支持 manhuadb 源下载
- 支持直接打包为 pdf，方便各种电子书（特别是非 kindle 系列的大屏电子书）阅读
- 支持本地缓存，不会重复下载
