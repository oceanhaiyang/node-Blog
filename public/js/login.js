$(document).ready(function() {
	$("#loginForm").validate({
		rules: {
			username: {
				required: true,
				minlength: 5,
				maxlength: 15
			},
			password: {
				required: true,
				minlength: 5
			}
		},
		messages: {
			username: {
				required: "请输入用户名",
				minlength: "用户名不能少于5个字母",
				maxlength: "用戶名不能超過15个字母"
			},
			password: {
				required: "请输入密码",
				minlength: "密码长度不能小于 5 个字母"
			}
		},
		submitHandler:function() { 
			ajaxForm();
		}
	});
	function ajaxForm(){
		var param = $("#loginForm").serialize();
		$.ajax({
			type:"post",
			url:"/login",
			data:param,
			dataType : "json", 
			success:function(data){
				$(".message").find(".modal-body h4").text(data.data);
				if(data.code == "1"){
					$(".message").find(".modal-footer").html("<a class='btn btn-default' href='/'>返回首页</a>");
				}else{
					$(".message").find(".modal-footer").html("<a class='btn btn-default' data-dismiss='modal'>确定</a>");
				}
			}
		});
	}
});