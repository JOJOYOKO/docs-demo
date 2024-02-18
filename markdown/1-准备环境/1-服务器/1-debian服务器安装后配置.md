# debian服务器安装后配置

## sudo命令提示，不在sudoers文件中。

解决方法：先切换至root用户，输入命令：`su root`，然后输入密码

![](https://pic1.zhimg.com/80/v2-1c47cdf0fcda338d912edede4ed65de4_1440w.webp)

2、查看 `/etc/sudoers` 文件权限，如果只读权限，修改为可写权限

输入查看文件命令：`ls –l /etc/sudoers`

![](https://pic2.zhimg.com/80/v2-8f3bb88c86d6fb6a3f763b90b01020ed_1440w.webp)

由此可看，该文件为只读权限

3、设置 `/etc/sudoers` 文件权限，添加 可写权限

输入修改权限命令：`chmod u+w /etc/sudoers`

![](https://pic4.zhimg.com/80/v2-8e88514c802e9c19d154eb75ef44071f_1440w.webp)

4、执行nano命令，编辑`/etc/sudoers`文件，

输入编辑文件命令：`nano /etc/sudoers`

![](https://pic2.zhimg.com/80/v2-34228d384c9207849485139d42710891_1440w.webp)

5、查看打印内容

![](https://pic3.zhimg.com/80/v2-9972d62327169d33337f70709612942e_1440w.webp)

6、在`root ALL=(ALL) ALL` 的下一行添加代码：yoko  ALL=(ALL) ALL`

![](https://pic4.zhimg.com/80/v2-eab5130293a5072c6072368d228bf2df_1440w.webp)

7、按写入关闭并保存

![](https://pic1.zhimg.com/80/v2-d5f7dca7f232b952c5852bbe3cb8f0b4_1440w.webp)

8、恢复 `/etc/sudoers`的权限为440

输入回复权限的命令：`chmod 440 /etc/sudoers`

![](https://pic3.zhimg.com/80/v2-c8236c7e6257287a17c2e661f4d46612_1440w.webp)

11、查看`/etc/sudoers`的权限是否恢复

输入查看权限命名：`ll /etc/sudoers`

![](https://pic1.zhimg.com/80/v2-9d5a7e78bbbb2739f2b358c60598d9e8_1440w.webp)

12、权限恢复正常，切换至普通用户

输入切换用户命令：`su yoko`

![](https://pic4.zhimg.com/80/v2-79ea96c61cf7ca1d02fed999085f4eeb_1440w.webp)

13、测试该用户的权限，我们可以使用命令 `sudo useradd user3` 来创建新用户

![](https://pic3.zhimg.com/80/v2-0c8f5828287340835fae7acf20acf62a_1440w.webp)

14、此时已经没有了先去的报错，用户也已经创建成功，大功告成！！！

## 请使用 apt-cdrom，通过它可以让 APT 识别该盘片。apt-get upgdate 不能被用来加入新的盘片。问题

**解决方法1：**

修改源配置文件

```html
vim /etc/apt/sources.list
```

复制

把有 deb cdrom 开头的行，前面都加上 # 号，保存退出即可。

[![解决 Debian 更新系统安装软件出现 cdrom 错误插图](https://www.11343.com/wp-content/uploads/2023/06/debian_cdrom_02.png "解决 Debian 更新系统安装软件出现 cdrom 错误插图")](https://www.11343.com/wp-content/uploads/2023/06/debian_cdrom_02.png)
