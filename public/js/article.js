$(document).ready(function() {
	$(".remove").click(function(e){
		var url = $(this).attr("url");
		$.getJSON(url,function(data) {
			console.log(data);
		       	$(".message").find(".modal-body h4").text(data.data);
				if(data.code == "1"){
					$(".message").find(".modal-footer").html("<a class='btn btn-default' href='/'>返回首页</a>");
				}else{
					$(".message").find(".modal-footer").html("<a class='btn btn-default' data-dismiss='modal'>确定</a>");
				}
		    }
		);
	});
	
});