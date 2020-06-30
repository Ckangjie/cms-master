layui.define(['jquery', 'layer','conf'], function (exports) {
	var $ = layui.jquery,
		layer = layui.layer,
		conf = layui.conf;
	exports('request', {
		/**
		 * [_ajax  服务请求]
		 * @param  {[type]}   url           [请求地址]
		 * @param  {[type]}   data          [发送数据]
		 * @param  {Function} callback      [正常回调]
		 * @param  {[type]}   method        [请求方式]
		 * @param  {[type]}   load          [请求加载框]
		 * @param  {[type]}   othercallback [其它回调]
		 * @param  {[type]}   async         [true：异步，false：同步]
		 */
		_ajax: function (url, data, method, callback, load, async) {
			if (!data) data = {}
			if (!method) method = 'GET'
			if (async != false) async = true
			var http = conf.apiPath + url
			// 添加token
			data.token = JSON.parse(sessionStorage.getItem('token'))
			data.author = JSON.parse(sessionStorage.getItem('username'))
			$.ajax(http, {
				data: data,
				type: method,
				dataType: 'json',
				async: async,
				timeout: 30000,
				success: function (res) {
					if (res.code === 0) {
						layer.msg(res.msg)
						if (typeof callback == 'function') callback(res);
					} else {
						layer.msg(res.msg)
					}
				},
				error: function (err) {
					console.log(err)
					layer.msg('请求超时，请稍后重试...');
				}
			})
		},
		 _tableReload: function(obj, t) {
            var _that = this;
            if(!t) t = 1000;
            setTimeout(function() {
                layui.use('table', function(){
                    layer.closeAll();
                    layui.table.reload(obj);
                });
            }, t);
        },
	})
})
