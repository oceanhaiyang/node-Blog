$(document).ready(function() {
	$("#regForm").validate({
		rules: {
			username: {
				required: true,
				minlength: 5,
				maxlength: 15
			},
			password: {
				required: true,
				minlength: 5
			},
			confirmpassword: {
				required: true,
				equalTo: "#password"
			},
			email: {
				required: true,
				email: true
			},
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
			},
			confirmpassword: {
				required: "请输入密码",
				equalTo: "两次密码输入不一致"
			},
			email: "请输入一个正确的邮箱",
		},
		submitHandler:function() { 
			ajaxForm();
		}
	});
	function ajaxForm(){
		var param = $("#regForm").serialize();
		$.ajax({
			type:"post",
			url:"/reg",
			data:param,
			dataType : "json", 
			success:function(data){
				$(".message").find(".modal-body h4").text(data.data);
				if(data.code == "1"){
					$(".message").find(".modal-footer").html("<a class='btn btn-default' href='/login'>返回登陆</a>");
				}else{
					$(".message").find(".modal-footer").html("<a class='btn btn-default' data-dismiss='modal'>确定</a>");
				}
			}
		});
	}
});