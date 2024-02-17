# [小米路由R1D使用Caddy搭建WebDAV服务并反向代理局域网内的其他HTTP服务](https://www.cnblogs.com/wzcsxjl/p/14614672.html)

我的R1D是14年买的，原装的硬盘已经不能用了，换了一块从笔记本上退役下来的500G硬盘后继续愉快的使用了……

当初买这款路由器的原因之一是看中了它的内置硬盘，可以用来备份手机相册、存储智能摄像机录像、迅雷下载等轻NAS的功能。以前一直是在手机上用小米WiFi查看路由器中的硬盘资料，最近在外面用APP下载文件总是失败，可能是小米的中转服务器不给流量了，总之是不好用了，就想着自己可不可以搭建一个文件管理服务，可以**在外网上传下载甚至直接看硬盘存放的视频。**

# 一、安装配置Caddy

之前在Padavan固件中用过“文件管理”的功能，是通过Caddy来部署的，感觉挺好用的，那就在R1D上也部署一下吧~

首先开启SSH，去官网http://d.miwifi.com/rom/ssh按照教程操作就可以了

## 1．查看CPU信息

SSH登陆R1D，查一下CPU信息

cat /proc/cpuinfo

 ![](https://img2020.cnblogs.com/blog/2343414/202104/2343414-20210403200132393-916717765.jpg)

或者用以下命令查看系统架构

uname -a

 ![](https://img2020.cnblogs.com/blog/2343414/202104/2343414-20210403200141368-1062065860.jpg)

查到是armv7处理器架构

可能是由于小米路由器内核的原因，使用Caddy官网“Linux arm 7”平台的二进制文件有问题，经测试“Linux arm 5”的二进制文件可以正常运行。

## 2．下载包含WebDAV插件的Caddy

那么我们就到Caddy官网下载包含WebDAV插件的二进制单文件，打开[Download Caddy](https://caddyserver.com/download)，“Platform: ”选“Linux arm 5”，在下面找到包含WebDAV插件的PACKAGE勾选，再点击右上角的“Download”

 ![](https://img2020.cnblogs.com/blog/2343414/202104/2343414-20210403200204550-797464787.jpg)

下载得到一个名为“caddy_linux_arm5_custom”的文件

## 3．部署配置Caddy并配置反向代理

在R1D中新建一个目录

mkdir /userdisk/caddy

使用WinSCP的上传功能或SecureCRT的rz命令将此文件上传至“/userdisk/caddy”目录中

修改caddy_linux_arm5_custom名称为caddy

cd /userdisk/caddy
mv caddy_linux_arm5_custom caddy

增加执行权限

chmod +x caddy

生成密码（此处设置一个123456的密码）

./caddy hash-password --plaintext 123456
JDJhJDE0JFhpQlFyTmJ5bGxwNDRsOExZQmZvVk9yWVFDTi9GclFoRjZ0bnZ3aTNZZXpiYzNkdThub25p

复制上面得到的一长串加密密码备用

在当前目录（/userdisk/caddy）创建一个名为[Caddyfile](https://files.cnblogs.com/files/blogs/676078/Caddyfile.zip)的配置文件

vim Caddyfile

添加以下内容（按自己需求将开放的端口号、开放的访问文件目录、域名和内网HTTP服务地址改为自己的）

`{`

    `order webdav before file_server`

`}`

`# 此处以开放5005端口为例，可以自行修改`

`:5005 {`

    `# 设置/userdisk/data为可以被访问的目录，可自行修改为想要访问的目录`

    `root *` `/userdisk/data`

    `encode` `gzip`

    `# 生成123456（此处明文密码自己设置）的密码 caddy hash-password --plaintext 123456`

    `# 下面的username为用户名（可自行更改），后面的长字符串为使用上面命令生成的密码`

    `basicauth {`

        `username JDJhJDE0JFhpQlFyTmJ5bGxwNDRsOExZQmZvVk9yWVFDTi9GclFoRjZ0bnZ3aTNZZXpiYzNkdThub25p`

    `}`

    `route {`

        `rewrite` `/webdav` `/webdav/`

        `webdav` `/webdav/``* {`

            `# 使用WebDAV访问路径的前缀`

            `prefix` `/webdav`

        `}`

        `# HTTP文件服务，可以在浏览器中查看下载文件`

        `file_server browse`

    `}`

`}`

`# 代理本机路由器Web页面`

`# ly.xxxxxx.noip.cn是你注册域名xxxxxx.noip.cn的子域名，因为每步DDNS启用了泛域名，前面的子域（如ly）随便起，只要不和其他子域重复即可`

`http:``//ly``.xxxxxx.noip.cn:5005 {`

    `# localhost:80是本机Web页面访问地址`

    `reverse_proxy localhost:80 {`

        `header_up Host {http.reverse_proxy.upstream.hostport}`

    `}`

`}`

`# 代理局域网中其他设备的服务`

`http:``//fw``.xxxxxx.noip.cn:5005 {`

    `# http://192.168.128.180:8123为局域网内可访问的HTTP服务地址`

    `reverse_proxy http:``//192``.168.128.180:8123 {`

        `header_up Host {http.reverse_proxy.upstream.hostport}`

    `}`

`}`

保存退出

以上配置就是运行了WebDAV和file_server服务，并使用Caddy代理了局域网中的其他HTTP服务。

## 4．前台启动Caddy

在当前目录尝试启动

./caddy run

## 5．内网访问HTTP文件服务和WebDAV

### （1）访问HTTP文件服务

在浏览器地址栏输入http://192.168.31.1:5005，用户名和密码为前面设置的username和123456，打开后效果如下 

 ![](https://img2020.cnblogs.com/blog/2343414/202104/2343414-20210403200347381-1138655677.jpg)

### （2）访问WebDAV服务

Win10添加WebDAV，“映射网络驱动器”或者“添加一个网络位置”都可以，此处以“添加一个网络位置”为例。

打开“此电脑”，右键单击空白处，选择“添加一个网络位置”，点击两次“下一步”后，输入http://192.168.31.1:5005/webdav

 ![](https://img2020.cnblogs.com/blog/2343414/202104/2343414-20210403200427964-1286500933.jpg)

点击“下一步”，输入之前用户名和密码后再“下一步”后点击“完成”，这样就可以在“Windows资源管理器”中访问R1D硬盘文件了。

## 6．后台启动Caddy

没有问题的话可以在当前目录后台启动caddy服务

./caddy start

查看caddy服务进程

![](https://img2020.cnblogs.com/blog/2343414/202107/2343414-20210714150904696-1776802589.jpg)

## 7．配置开机启动Caddy

把WebDAV服务配置为开机后台启动

vim /etc/rc.local

在exit 0上面添加以下内容：

cd /userdisk/caddy
./caddy start

这样WebDAV的服务已经部署好了，重启路由器后也会自己启动。

# 二、使R1D中的文件能够在外网访问

但是我们为了方便不在家的时候访问，需要开启对应的外网端口，而且路由的IP地址在重新拨号后会变化，还要配置动态域名服务。

## 1．R1D获取公网IPv6地址

我家用的是移动大内网宽带，没有公网IPv4地址，好在现在可以获取到IPv6地址（前提是在光猫中设置好支持IPv6），那就可以使用支持IPv6的DDNS来解析了。

R1D默认是不支持IPv6的，下面我们来修改配置使其可以获取到IPv6地址（此处以光猫桥接模式，R1D拨号为例），还是在SSH中操作

vim /etc/config/ipv6

修改为以下内容：

config ipv6 'settings'
　　list if_on 'wan'
　　option enabled '1'
　　list if_on 'ipv6'
　　option enabled '1'

保存退出

重新拨号后应该就可以获取到IPv6地址了（下图中2409开头就是公网IPv6地址）

 ![](https://img2020.cnblogs.com/blog/2343414/202104/2343414-20210403200653835-797097621.jpg)

我们使用br-lan这个网络接口的IPv6地址

 ![](https://img2020.cnblogs.com/blog/2343414/202104/2343414-20210403200703133-1098857702.jpg)

## 2．配置动态域名服务

到[http://www.meibu.com/](http://www.meibu.com/)这个网站注册申请一个域名（如：xxxxxx.noip.cn）

SSH中新建一个目录

mkdir /userdisk/meibu_ddns

下载文件[meibu_ddns.sh](https://files-cdn.cnblogs.com/files/blogs/676078/meibu_ddns.sh)

将第35行中xxxxxx.noip.cn和123456改为你自己申请的域名和密码

![](https://img2020.cnblogs.com/blog/2343414/202106/2343414-20210614185119529-723212948.jpg)

将修改后的脚本上传到/userdisk/meibu_ddns目录中

增加脚本执行权限

cd /userdisk/meibu_ddns
chmod +x meibu_ddns.sh

执行脚本

./meibu_ddns.sh

在当前目录（/userdisk/meibu_ddns）会生成ip.txt文件，记录的是br-lan网络接口的IPv6地址

输入以下命令（注意将xxxxxx.noip.cn改为自己申请的域名）查看解析到的IP地址

nslookup xxxxxx.noip.cn 8.8.8.8

解析出来的地址和br-lan网络接口的IPv6地址一致则说明脚本执行成功

将此脚本添加到定时任务中

crontab -e

加入以下内容

*/1 * * * * /opt/bin/sh /userdisk/meibu_ddns/meibu_ddns.sh

保存退出

这样每隔一分钟就会执行一次脚本，查看IP地址是否变化，有变化再去更新动态域名IP地址

## 3．开启外网访问端口并配置开机自动开放端口

现在只剩下开启外网端口了

在终端执行

ip6tables -I INPUT -p tcp --dport 5005 -j ACCEPT
ip6tables -I OUTPUT -p tcp --sport 5005 -j ACCEPT

这样就对外网放开了IPv6的5005端口

现在配置一下开机执行上面这两条规则

vim /etc/rc.local

在exit 0上面添加以下内容

ip6tables -I INPUT -p tcp --dport 5005 -j ACCEPT
ip6tables -I OUTPUT -p tcp --sport 5005 -j ACCEPT

到此就实现了开机自动开放端口

## 4．在外网访问R1D文件

浏览器使用域名+端口就可以登陆访问文件服务了

 ![](https://img2020.cnblogs.com/blog/2343414/202104/2343414-20210403200754154-1627532811.jpg)

手机可以使用“ES文件浏览器”添加WebDAV

 ![](https://img2020.cnblogs.com/blog/2343414/202104/2343414-20210403200818088-1806344529.png)

 ![](https://img2020.cnblogs.com/blog/2343414/202104/2343414-20210403200834523-908737023.png)

这样即便不在家里，只要有网络就可以用电脑或手机访问R1D的硬盘资料了。
