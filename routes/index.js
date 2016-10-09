var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
	User = require('../models/user.js'),
	Post = require('../models/post.js'),
	Comment = require('../models/comment.js');
/* GET home page. */
module.exports = function(app) {
	//主页
	app.get('/', function(req, res) {
		//判断是否是第一页，并把请求的页数转换成 number 类型
		var page = req.query.p ? parseInt(req.query.p) : 1;
		//查询并返回第 page 页的 10 篇文章
		Post.getTen(null, page, function(err, posts, total) {
			if(err) {
				posts = [];
			}
			res.render('index', {
				title: '主页',
				posts: posts,
				page: page,
				count : total,
				url: 'index',
				isFirstPage: (page - 1) == 0,
				isLastPage: ((page - 1) * 10 + posts.length) == total,
				user: req.session.user,
			});
		});
	});
	//登录
	app.get('/login', checkNotLogin);
	app.get('/login', function(req, res) {
		res.render('login', {
			title: '用户登录',
			url: 'login',
			user : req.session.user,
		});
	});
	app.post('/login', checkNotLogin);
	app.post('/login', function(req, res) {
		var name = req.body.username,
			password = req.body.password;
		var md5 = crypto.createHash('md5');
		password = md5.update(password).digest('hex');
		User.get(name,function(err,user){
			if(!user){
				return res.json({code:'0',data:"用户不存在！"});
			}
			if(user.password != password){
				return res.json({code:'0',data:"密码错误！"});
			}
			req.session.user = user;
			res.json({code:'1',data:"登陆成功！"});
		});
	});
	//注册
	app.get('/reg', checkNotLogin);
	app.get('/reg', function(req, res) {
		res.render('reg', {
			title: '用户注册',
			url: 'reg',
			user : req.session.user,
		});
	});
	app.post('/reg', checkNotLogin);
	app.post('/reg', function(req, res) {
		var name = req.body.username;
		//生成密码的 md5 值
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			name: name,
			password: password,
			email: req.body.email
		});
		//检查用户名是否已经存在 
		User.get(newUser.name, function(err, user) {
			if(err) {
				return res.json({code:"0",data:err});
			}
			if(user) {
				return res.json({code:"0",data:'用户已存在！'});
			}
			//如果不存在则新增用户
			newUser.save(function(err, user) {
				if(err) {
					return res.json({code:"0",data:err});
				}
				req.session.user = user; //用户信息存入 session
				res.json({code:"1",data:'注册成功！'});//code为1：成功
			});
		});
	});
	//发表
	app.get('/post', checkLogin);
	app.get('/post', function(req, res) {
		res.render('post', {
			title: '发表文章',
			url: 'post',
			user : req.session.user,
		});
	});
	app.post('/post', checkLogin);
	app.post('/post', function(req, res) {
		var currentUser = req.session.user;
		var tags = req.body.tag.split(',');
		var post = new Post(currentUser.name, currentUser.head, req.body.title, tags, req.body.post);
		post.save(function(err){
			if (err) {
		      	return res.json({code:'0',data:err});
		    }
//			var json = {code:"1",data:'发布成功！'};
			res.redirect('/u/'+currentUser.name);
		})
	});
	//根据用户姓名获取用户文章
	app.get('/u/:name', function(req, res) {
		var page = req.query.p ? parseInt(req.query.p) : 1;
		//检查用户是否存在
		User.get(req.params.name, function(err, user) {
			if(!user) {
				return res.redirect('/'); //用户不存在则跳转到主页
			}
			//查询并返回该用户的所有文章
			Post.getTen(user.name, page, function(err, posts , total) {
				if(err) {
					return res.redirect('/');
				}
				res.render('user', {
					title: user.name,
					posts: posts,
					url:"users",
					page: page,
					count : total,
        			isFirstPage: (page - 1) == 0,
        			isLastPage: ((page - 1) * 10 + posts.length) == total,
					user: req.session.user,
				});
			});
		});
	});
	//文章详情
	app.get('/u/:name/:day/:title', function(req, res) {
		Post.getOne(req.params.name, req.params.day, req.params.title, function(err, post) {
			if(err) {
				return res.redirect('/');
			}
			res.render('article', {
				title: req.params.title,
				post: post,
				url:"article",
				user: req.session.user,
			});
		});
	});
	app.post('/u/:name/:day/:title', function(req, res) {
		var date = new Date(),
			time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
			date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    	var	head = req.body.head; 
		var comment = {
			name: req.body.name,
			head: head,
			time: time,
			content: req.body.content
		};
		var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
		newComment.save(function(err) {
			if(err) {
				return res.redirect('back');
			}
			res.redirect('back');
		});
	});
	//文章编辑功能
	app.get('/edit/:name/:day/:title', checkLogin);
	app.get("/edit/:name/:day/:title",function(req,res){
		var currentUser = req.session.user;
		Post.edit(currentUser.name,req.params.day,req.params.title,function(err,post){
			if(err) {
				return res.redirect('/');
			}
			res.render('edit',{
				title:"编辑    - "+ req.params.title,
				url:"edit",
				post:post,
				user: currentUser,
			});
		});
	});
	//文章内容更新
	app.post('/edit/:name/:day/:title', checkLogin);
	app.post('/edit/:name/:day/:title',function(req,res){
		var currentUser = req.session.user;
		Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, function (err){
		 	 var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
		 	if(err){
		 		return res.redirect("/");
		 	}
//		 	res.json({code:"1",data:"修改成功！",url:url});//成功！返回文章页
			res.redirect("/u/"+currentUser.name);
		 });
	});
	//删除文章
	app.get('/remove/:name/:day/:title', checkLogin);
	app.get('/remove/:name/:day/:title',function(req,res){
		var currentUser = req.session.user;
		Post.remove(currentUser.name,req.params.day,req.params.title,function(err){
			if(err){
				return res.redirect("/");
			}
			res.json({code:"1",data:"删除成功！"});
		});
	});
	//查詢搜索
	app.get('/search', function(req, res) {
		Post.search(req.query.keyword, function(err, posts) {
			if(err) {
				return res.redirect('/');
			}
			res.render('search', {
				title: "搜索结果  - " + req.query.keyword,
				posts: posts,
				url:'search',
				user: req.session.user,
			});
		});
	});
	//获取所有标签
	app.get('/tags', function(req, res) {
		Post.getTags(function(err, posts) {
			if(err) {
				return res.redirect('/');
			}
			res.render('tags', {
				title: '标签',
				posts: posts,
				url: 'tags',
				user: req.session.user,
			});
		});
	});
	//根据标签查询文章
	app.get('/tags/:tagname', function(req, res) {
		var tagname = req.params.tagname;
		Post.getTag(tagname, function (err, posts) {
		    if (err) {
		      return res.redirect('/');
		    }
		    res.render('tag', {
		      title: '标签    - ' + tagname,
		      posts: posts,
		      url : 'tag',
		      user: req.session.user,
		    });
		}); 
	});
	//注销
	app.get('/logout', checkLogin);
	app.get('/logout', function(req, res) {
		req.session.user = null;
		req.flash("success","注销成功!");
		res.redirect("/");
	});
	app.get('/upload', checkLogin);
	app.get('/upload', function(req, res) {
		res.render('upload', {
			title: '文件上传',
			user: req.session.user,
			url: 'upload'
		});
	});
	app.post('/upload', checkLogin);
	app.post('/upload', function(req, res) {
		res.json({code:"1",data:'文件上传成功！'});
	});
	
	function checkLogin(req, res, next) {
		if(!req.session.user) {
			res.redirect('/login');
		}
		next();
	}
	function checkNotLogin(req, res, next) {
		if(req.session.user) {
			res.redirect('back');
		}
		next();
	}
};