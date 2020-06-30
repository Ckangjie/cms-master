layui.config({
	base: "/"
}).use(['form', 'layer', 'layedit', 'laydate', 'upload', 'app'], function() {
	var form = layui.form
	layer = parent.layer === undefined ? layui.layer : top.layer,
		laypage = layui.laypage,
		upload = layui.upload,
		layedit = layui.layedit,
		laydate = layui.laydate,
		request = layui.request,
		app = layui.app,
		$ = app.jquery,
		objImg = {}
	//用于同步编辑器内容到textarea
	layedit.sync(editIndex);
	
	// 页面加载选中radio
	var status =Number($('.group-radio').attr('data-status'))
	switch(status){
		case 0: $("[value=0]").attr('checked',true); break;
		case 1: $("[value=1]").attr('checked',true); break;
		case 2: $("[value=2]").attr('checked',true); break;
		case 3: $("[value=3]").attr('checked',true); break;
		default: break;
	}
	
	//上传缩略图
	upload.render({
		elem: '.thumbBox',
		url: app.conf.apiPath + '/upload',
		method: "post", //此处是为了演示之用，实际使用中请将此删除，默认用post方式提交
		done: function(res, index, upload) {
			// objImg.img = xhr + '/' + res.data.url
			$('.thumbImg').attr('src', app.conf.apiPath + '/' + res.data.url)
		}
	});

	//格式化时间
	function filterTime(val) {
		if (val < 10) {
			return "0" + val;
		} else {
			return val;
		}
	}
	//定时发布
	var time = new Date();
	var submitTime = time.getFullYear() + '-' + filterTime(time.getMonth() + 1) + '-' + filterTime(time.getDate()) + ' ' +
		filterTime(time.getHours()) + ':' + filterTime(time.getMinutes()) + ':' + filterTime(time.getSeconds());
	laydate.render({
		elem: '#release',
		type: 'datetime',
		trigger: "click",
		done: function(value, date, endDate) {
			submitTime = value;
		}
	});
	form.on("radio(release)", function(data) {
		if (data.elem.title == "定时发布") {
			$(".releaseDate").removeClass("layui-hide");
			$(".releaseDate #release").attr("lay-verify", "required");
		} else {
			$(".releaseDate").addClass("layui-hide");
			$(".releaseDate #release").removeAttr("lay-verify");
			submitTime = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() +
				':' + time.getMinutes() + ':' + time.getSeconds();
		}
	});

	form.verify({
		newsName: function(val) {
			if (val == '') {
				return "文章标题不能为空";
			}
		},
		content: function(val) {
			if (val == '') {
				return "文章内容不能为空";
			}
		}
	})
	
	form.on("submit(addNews)", function(data) {
		var api = $(".newsName").attr('data-api');
		var id = $(".newsName").attr('data-id');
		var img = $(".thumbImg").attr("src");
		obj = Object.assign({}, data.field, objImg)
		//截取文章内容中的一部分文字放入文章摘要
		var abstract = layedit.getText(editIndex).substring(0, 50);
		obj.abstract = abstract
		obj.id = id
		obj.img = img
		//弹出loading
		// var index = top.layer.msg('数据提交中，请稍候', {
		// 	icon: 16,
		// 	time: false,
		// 	shade: 0.8
		// });
		// 上传文章
		app.request._ajax(api, obj, 'POST', function(res) {
			setTimeout(function() {
				// top.layer.close(index);
				// top.layer.msg(res.msg);
				layer.closeAll("iframe");
				//刷新父页面
				parent.location.reload();
			}, 500);
			return false;
		})
	})

	//创建一个编辑器
	var editIndex = layedit.build('news_content', {
		height: 535,
		uploadImage: {
			url: "../../static/json/newsImg.json"
		}
	});
	// 重新渲染页面
	layui.form.render()
})
