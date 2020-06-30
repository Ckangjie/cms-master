
layui.define(['jquery','layer','conf'],function(exports){
	var o = layui.jquery,
        layer = layui.layer,
        template = layui.conf.template;

    exports('route', {
        /**
         * [_page 通过hash值获取页面]
         * @param  {[type]}   hash     [hash值]
         * @param  {[type]}   data     [父级页面数据]
         * @param  {Function} callback [回调函数，默认为空则是body主体渲染]
         * @param  {[type]}   filter   [回调页面的监听按钮]
         */
        _page: function(hash, data, callback, filter){
            // 清除hash上的其它参数
            if(hash && hash.indexOf('?') > 0) hash = hash.substr(0,hash.indexOf('?'));
            // 默认获取index文件
            var file = (!hash)? 'main/index' : (hash.indexOf('/') > 0)? hash : hash+'/index';
            o.ajax(template+file+'.html', {
                type:'GET', dataType:'html', cache:false,
                success: function(response){
                    if(response.indexOf('div') < 0){
                        o.ajax(template+'error/404.html', {
                            type:'GET', dataType:'html', cache:false,
                            success: function(response){
                                typeof callback == 'function'? callback(response) : o('.layui-body').html(response);
                            }
                        });
                    }else{
                        if(typeof callback == 'function'){
                            // 向下个页面传数据
                            sessionStorage.setItem('parentData', JSON.stringify((data && typeof data == 'object'? data : {})));
                            // 添加页面监听按钮
                            if(filter) response = response.replace(new RegExp('<slot></slot>','g'), '<button lay-filter="'+filter+'" lay-submit="" class="layui-btn layui-btn-sm layout-bg" type="button">确认</button>');
                            callback(response);
                        }else{
                            o('.layui-body').html(response);
                        }
                    }
                },
                error: function(){
                    o.ajax(template+'error/404.html', {
                        type:'GET', dataType:'html', cache:false,
                        success: function(response){
                            typeof callback == 'function'? callback(response) : o('.layui-body').html(response);
                        }
                    });
                }
            });
            document.body.scrollIntoView();
        },
        /**
         * [_href 页面跳转]
         * @param  {[type]} msg    [跳转前提示字符]
         * @param  {[type]} href   [跳转地址]
         * @param  {[type]} target [默认:普通/top:顶级/up:父级]
         * @param  {Number} t      [延时：毫秒]
         */
        _href: function(msg, href, target, t){
            if(!t) t = 1000;
            if(msg) layer.msg(msg);
            switch(target){
                case 'top':
                    window.setTimeout('top.location.href="'+href+'"',t);
                    break;
                case 'up':
                    window.setTimeout('parent.location.href="'+href+'"',t);
                    break;
                default:
                    window.setTimeout('window.location.href="'+href+'"',t);
            }
        },
        /**
         * [_reload 页面刷新]
         * @param  {[type]} msg    [刷新前提示字符]
         * @param  {[type]} target [默认:普通/top:顶级/up:父级]
         * @param  {Number} t      [延时：毫秒]
         */
        _reload: function(msg, target, t){
            if(!t) t = 1000;
            if(msg) layer.msg(msg);
            setTimeout(function(){
                switch(target){
                    case 'top':
                        top.location.reload();
                        break;
                    case 'up':
                        parent.location.reload();
                        break;
                    default:
                        self.location.reload(); 
                }
            },t)
        },
        /**
         * [_replace 页面重定向跳转]
         * @param  {[type]} msg    [跳转前提示字符]
         * @param  {[type]} href   [跳转地址]
         * @param  {[type]} target [默认:普通 top:顶级 up:父级]
         * @param  {[type]} t      [延时：毫秒]
         */
        _replace: function(msg, href, target, t){
            if(!t) t = 1000;
            if(msg) layer.msg(msg);
            switch(target){
                case 'top':
                    window.setTimeout('top.location.replace("'+href+'")',t);
                    break;
                case 'up':
                    window.setTimeout('parent.location.replace("'+href+'")',t);
                    break;
                default:
                    window.setTimeout('window.location.replace("'+href+'")',t);
            }
        }
    });
});