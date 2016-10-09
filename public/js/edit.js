$(document).ready(function() {
	$("#postForm").validate({
		rules: {
			title: {
				required: true,
				minlength: 3,
			},
			post: {
				required: true,
				minlength: 10
			},
		},
		messages: {
			title: {
				required: "请输入标题",
				minlength: "标题不能少于3个字母",
			},
			post: {
				required: "请输入正文",
				minlength: "正文不能少于10个字母"
			},			
		},
		submitHandler:function() { 
			ajaxForm();
		}
	});
	function ajaxForm(){
		var title = $('#title').val();
		var tags = $('#tag').val();
		var post = editor.text();
		var param = {
			title:title,
			tags:tags,
			post:post
		};
		param = param.serialize(), 
		$.ajax({
			type:"post",
			url:window.location.pathname,
			data:param,
			success:function(data){
				$(".message").find(".modal-body h4").text(data.data);
				if(data.code == "1"){
					$(".message").find(".modal-footer").html("<a class='btn btn-default col-xs-6' href='"+data.url+"'>返回文章页</a><a class='btn btn-default col-xs-6' href='"+window.location.pathname+"'>继续修改</a>");
				}else{
					$(".message").find(".modal-footer").html("<a class='btn btn-default' data-dismiss='modal'>返回</a>");
				}
			}
		});
	}
});