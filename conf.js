layui.define(function(exports){
    var href = location.href, conf = {
            // 项目服务接口地址【后端人员提供】
            apiPath: 'http://127.0.0.1:3000',
            // 项目视图模板地址【以实际开发目录为准】
            template: location.protocol+'//'+location.host+'/'+(href.split('/')[3]? href.split('/')[3] : 'index')+'/',
            // 登录拦截端口【完全分离时为空可前后端都拦截】
            intercept: 'admin',
            // 是否开启单点登录
            single: true
        };
	exports('conf', conf);
    if(href.indexOf(conf.intercept) > -1 && href.indexOf('/login') < 0 && !sessionStorage.getItem('token')){
		console.log(2)
        location.replace(conf.template+'login/login.html');
    }
});