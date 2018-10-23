## 使用Nodejs+MongoDb构建多人博客

技术方面使用了`nodejs，mongodb，Express框架，Kindeditor`等

#### 特点
1. 使用Ejs模版引擎
2. 实现了发表与编辑博文功能
3. 实现了评论功能
4. 增加pv统计和留言统计
5. 用户头像
6. 新增日志功能
7. 采用Kindeditor富文本编辑器
8. 实现了分页功能

----------

### 建立数据库
在mondodb安装目录下新建blog文件夹
###启动数据库
命令：

> mongod --dbpath ../blog
###数据库操作
命令：

> mongo
	
> use blog
 
> db.users.find()

> db.user.remove()
