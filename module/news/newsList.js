layui.config({
	base: "/"
}).use(['form', 'layer', 'laydate', 'table', 'laytpl', 'app'], function() {
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : top.layer,
		laydate = layui.laydate,
		app = layui.app,
		$ = app.jquery,
		laytpl = layui.laytpl,
		table = layui.table;
	//新闻列表
	var tableIns = table.render({
		elem: '#newsList',
		url: app.conf.apiPath + '/articleList',
		cellMinWidth: 95,
		page: true,
		height: "full-125",
		limit: 20,
		limits: [10, 15, 20, 25],
		id: "newsListTable",
		cols: [
			[{type: "checkbox",fixed: "left",width: 50},
			{field: 'id',title: 'ID',width: 60,align: "center"},
			{field: 'title',title: '文章标题',align: 'center'},
			{field: 'author',title: '发布者',align: 'center'},
			{field: 'status',title: '发布状态',align: 'center',templet: "#status"},
			{field: 'time',title: '发布时间',align: 'center',minWidth: 110,templet: function(d) {return d.time.substring(0, 10);}},
			{title: '操作',width: 170,templet: '#newsListBar',fixed: "right",align: "center"},
			]
		]
	});

	//是否置顶
	form.on('switch(newsTop)', function(data) {
		var index = layer.msg('修改中，请稍候', {
			icon: 16,
			time: false,
			shade: 0.8
		});
		setTimeout(function() {
			layer.close(index);
			if (data.elem.checked) {
				layer.msg("置顶成功！");
			} else {
				layer.msg("取消置顶成功！");
			}
		}, 500);
	})

	//搜索【此功能需要后台配合，所以暂时没有动态效果演示】
	$(".searchVal").bind("keyup", function(e) {
		e.preventDefault();
		table.reload("newsListTable", {
			url: app.conf.apiPath + '/search',
			page: {
				curr: 1 //重新从第 1 页开始
			},
			where: {
				key: $(".searchVal").val() //搜索的关键字
			}
		})
	});

	//添加文章
	function addNews(edit) {
		var index = layui.layer.open({
			title: "添加文章",
			type: 2,
			content: "newsAdd.html",
			success: function(layero, index) {
				var body = layui.layer.getChildFrame('body', index);
				if (edit) {
					body.find(".newsName").val(edit.title);
					body.find(".newsName").attr('data-api', edit.api);
					body.find(".newsName").attr('data-id', edit.id);
					body.find(".abstract").val(edit.abstract);
					body.find(".thumbImg").attr("src", edit.img);
					body.find("#news_content").val(edit.content);
					body.find(".newsStatus select").val(edit.status);
					body.find(".group-radio").attr('data-status', edit.type);
					form.render();
				}
				setTimeout(function() {
					layui.layer.tips('点击此处返回文章列表', '.layui-layer-setwin .layui-layer-close', {
						tips: 3
					});
				}, 500)
			}
		})
		layui.layer.full(index);
		//改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
		$(window).on("resize", function() {
			layui.layer.full(index);
		})
	}
	$(".addNews_btn").click(function() {
		addNews({
			api: '/addArticle'
		});
	})

	//批量删除
	$(".delAll_btn").click(function() {
		var checkStatus = table.checkStatus('newsListTable'),
			data = checkStatus.data,
			ids = [];
		if (data.length > 0) {
			for (var i in data) {
				ids.push(data[i].id);
			}
			layer.confirm('确定删除选中的文章？', {
				icon: 3,
				title: '提示信息'
			}, function(index) {
				layer.close(index);
				delArticle({
					'ids': JSON.stringify(ids)
				})
			})
		} else {
			layer.msg("请选择需要删除的文章");
		}
	})

	//列表操作
	table.on('tool(newsList)', function(obj) {
		var checkStatus = table.checkStatus('newsListTable'),
			delId = checkStatus.data,
			layEvent = obj.event,
			data = obj.data,
			id = data.id,
			ids = [],
			list = [1, 2, 5, 6, 8]
		if (layEvent === 'edit') { //编辑
			data.api = '/editArticle'
			if (delId.length === 0) {
				layer.msg("请选择需要编辑的文章");
				return false;
			} else if (delId.length > 1) {
				layer.msg("你的目标不明确!")
			} else if (delId[0].id !== data.id) {
				layer.msg("请点击对应的文章");
			} else {
				addNews(data);
			}
		} else if (layEvent === 'del') { //删除
			if (delId.length === 0) {
				layer.msg("请选择需要删除的文章");
				return false;
			} else if (delId.length > 1) {
				layer.msg("请点击批量删除!")
			} else if (delId[0].id !== data.id) {
				layer.msg("请点击对应的文章");
			} else {
				ids.push(data.id)
				layer.confirm('确定删除此文章？', {
					icon: 3,
					title: '提示信息'
				}, function(index) {
					layer.close(index);
					delArticle({
						'ids': JSON.stringify(ids)
					})
				});
			}
		} else if (layEvent === 'look') { //预览
			layer.alert("此功能需要前台展示，实际开发中传入对应的必要参数进行文章内容页面访问")
		}
	});

	function delArticle(data) {
		layui.request._ajax('/delArticle', data, 'POST', function(res) {
			tableIns.reload();
		})
	}

})
