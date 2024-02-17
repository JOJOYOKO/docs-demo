# [配置IPv6公网地址DDNS并开放外网访问端口](https://www.cnblogs.com/wzcsxjl/p/14907217.html)

目前使用三大运营商宽带服务都会下发公网IPv6地址，这样我们想要在外网访问家里的路由、NAS等设备就可以直接通过IPv6地址来访问了。但是每次重新拨号后IPv6地址都会改变，而且IPv6的地址很长，这样就引出了动态域名服务，即DDNS。

其实DDNS的原理就是将本地获取到的公网IP地址告诉域名服务商，并且在IP地址发生变化时也会同步新的IP地址到域名服务器程序，这样我们只需使用域名就可以随时随地去访问家里的设备了。

为了安全起见，路由器的防火墙策略默认是禁止从外网主动访问内网的设备的，我们需要将被访问的设备上的服务对应的端口开放出来。

归纳起来其实就两步：1）DDNS；2）开放端口。

下面我们就来实际操作一下吧

# 一、配置IPv6 DDNS

以下是两种DDNS方法，任选其一即可

## 1．使用每步DDNS

首先去[免费动态域名解析服务器IPV6内网穿透软件监控源码下载-青岛每步 (meibu.com)](http://www.meibu.com/index.asp)这个网站注册一个域名，如：xxxxxx.noip.cn，并且复制出注册时设置的登陆密码备用。

下载[meibu.sh](https://files.cnblogs.com/files/blogs/676078/meibu.sh)这个脚本，将第35行中xxxxxx.noip.cn和123456改为你自己申请的域名和登陆密码。

 ![](https://img2020.cnblogs.com/blog/2343414/202106/2343414-20210620163803448-1573247219.jpg)

将meibu.sh脚本使用WinSCP等工具上传至需要做域名解析的设备中，此处以我的OpenWrt为例

SSH登陆设备

创建目录

mkdir -p /usr/share/meibu

将脚本上传至此目录（/usr/share/meibu）

赋予脚本执行权限

chmod +x /usr/share/meibu/meibu.sh

执行脚本

/usr/share/meibu/meibu.sh

查看ip.txt文件内容

ll /usr/share/meibu
cat /usr/share/meibu/ip.txt

查看域名解析到的地址是否和ip.txt中的匹配

nslookup xxxxxx.noip.cn 8.8.8.8

如果两个地址一致则表明解析成功

添加定时任务

crontab -e

添加以下内容

* * * * * /bin/sh /usr/share/meibu/meibu.sh

这样每分钟就会查询一次IP地址，有变化时就将新的IP地址绑定到域名上

## 2．使用dynv6 DDNS

去[Free dynamic DNS for IPv6 (dynv6.com)](https://dynv6.com/)这个网站注册一下，使用邮箱确认（注：邮箱链接确认可能需要梯子）后登陆

到[dynv6](https://dynv6.com/zones/new)这儿创建一个域名

 ![](https://img2020.cnblogs.com/blog/2343414/202106/2343414-20210620164304740-1656476026.jpg)

创建好后切换到instructions标签，如下图，复制域名和token备用

 ![](https://img2020.cnblogs.com/blog/2343414/202106/2343414-20210620164336744-1296149148.jpg)

下载[dynv6.sh](https://files.cnblogs.com/files/blogs/676078/dynv6.sh)这个脚本文件

SSH登陆设备

创建目录

mkdir -p /usr/share/dynv6

上传脚本至/usr/share/dynv6目录中

赋予脚本执行权限

chmod +x /usr/share/dynv6/dynv6.sh

输入以下命令进行解析（注意将红字部分替换为自己的token和域名）

token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx /bin/sh /usr/share/dynv6/dynv6.sh xxxxxx.v6.navy

查看域名解析到的地址

nslookup xxxxxx.v6.navy 8.8.8.8
cat /usr/share/dynv6/.dynv6.addr6

两个地址一致则域名解析成功

添加定时任务

crontab -e

添加以下内容

* * * * * token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx /bin/sh /usr/share/dynv6/dynv6.sh xxxxxx.v6.navy

# 二、开放外网访问端口

防火墙的设置都是在主路由上进行的，这里分别以主路由是Padavan和OpenWrt开放8088端口为例。

## 1．Padavan开启IPv6外网访问端口

### （1）开启路由器自身端口

ip6tables -A INPUT -p tcp --dport 8088 -j ACCEPT
ip6tables -A OUTPUT -p tcp --sport 8088 -j ACCEPT

### （2）开启局域网其他设备端口

ip6tables -A FORWARD -p tcp --dport 8088 -j ACCEPT

### （3）开机自动开放端口

在“高级设置”->“自定义设置”->“脚本”->“在防火墙规则启动后执行:”最后添加以下内容

# 开启路由器自身端口

ip6tables -A INPUT -p tcp --dport 8088 -j ACCEPT
ip6tables -A OUTPUT -p tcp --sport 8088 -j ACCEPT

# 开启局域网其他设备端口

ip6tables -A FORWARD -p tcp --dport 8088 -j ACCEPT

点击最下面的“应用本页面设置”

## 2．OpenWrt开启IPv6外网访问端口

### （1）开启路由器自身端口

ip6tables -I INPUT -p tcp --dport 8088 -j ACCEPT
ip6tables -I OUTPUT -p tcp --sport 8088 -j ACCEPT

### （2）开启局域网其他设备端口

ip6tables -A zone_wan_forward -p tcp -m tcp --dport 8088 -m comment --comment Allow-8088 -j zone_lan_dest_ACCEPT

或者

ip6tables -I FORWARD -p tcp --dport 8088 -j ACCEPT

### （3）开机自动开放端口

vim /etc/rc.local

在exit 0上面添加

# 开启路由器自身端口

ip6tables -I INPUT -p tcp --dport 8088 -j ACCEPT
ip6tables -I OUTPUT -p tcp --sport 8088 -j ACCEPT

# 开启局域网其他设备端口

ip6tables -I FORWARD -p tcp --dport 8088 -j ACCEPT

保存退出

# 附：使用socat转发内网IPv4服务

如果不是访问局域网NAS这类对传输速度要求特别高的设备，可以在主路由上使用socat来进行转发，这样就只需要在主路由上配置一次DDNS，然后想访问局域网哪个设备只需配置socat转发并开启主路由自身的外网访问端口即可，如外网访问主路由的IPv6 8088端口时转发至内网设备的192.168.2.110:80这个服务，只需执行以下命令即可：

nohup socat TCP6-LISTEN:8088,reuseaddr,fork TCP4:192.168.2.110:80 > /dev/null 2>&1 &

开机自动执行转发

Padavan固件：找到“高级设置”->“自定义设置”->“脚本”->“在路由器启动后执行:”，添加以下命令

nohup socat TCP6-LISTEN:8088,reuseaddr,fork TCP4:192.168.2.110:80 > /dev/null 2>&1 &

点击最下面的“应用本页面设置”

OpenWrt固件：将上面的命令添加到/etc/rc.local文件（exit 0上面）中，保存退出。
