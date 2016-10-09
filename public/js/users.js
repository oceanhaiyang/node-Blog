$(document).ready(function() {
	function getParameter(name) { 
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
		var r = window.location.search.substr(1).match(reg); 
		if (r!=null) return unescape(r[2]); return null;
	}
	var totalRecords = $("#pager").attr("count");
	var totalPage = Math.ceil(totalRecords/5);
	var pageNo = getParameter('p');
	if(!pageNo){
		pageNo = 1;
	}
	kkpager.generPageHtml({
		pno: pageNo,
		mode: 'link', //可选，默认就是link
		//总页码  
		total: totalPage,
		//总数据条数  
		totalRecords: totalRecords,
		//链接算法
		getLink: function(n) {
			return "?p="+n;
		}

	});
});