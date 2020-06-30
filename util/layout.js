
layui.define(['jquery','form','layer','upload','layedit','conf','route','request'], function(exports){
    var o = layui.jquery,
        form = layui.form,
        layer = layui.layer,
        upload = layui.upload,
        layedit = layui.layedit,
        conf = layui.conf,
        route = layui.route,
        request = layui.request;

	exports('layout', {
        /**
         * [_nodes 渲染当前页面操作节点]
         * @param  {[type]} layId [table表对象ID]
         * @param  {[type]} data  [节点数据集]
         */
        _nodes: function(layId, data){
            if(data && typeof data == 'object'){
                var btnStr = '',
                    obj_toolBar = document.querySelector('div[lay-id="'+layId+'"] .layui-table-tool .layui-table-tool-temp'),
                    obj_tool = document.querySelectorAll('div[lay-id="'+layId+'"] .layui-table-body input, div[lay-id="'+layId+'"] .layui-table-body a');
                
                for(var i in data){
                    var el = data[i];
                    if(el.node != 'list'){
                        btnStr += '<button class="layui-btn layui-btn-sm" style="background: '+el.node_color+'" lay-event="'+el.node+'" access-id="'+el.id+'"><i class="layui-icon '+el.icon+'"></i>'+el.name+'</button>';
                    }else{
                        for(var i=0; i<obj_tool.length; i++){
                           obj_tool[i].setAttribute('access-id',el.id); 
                        }
                    }
                }
                obj_toolBar.innerHTML = '<div class="layui-btn-container">'+btnStr+'</div>';
                form.render();
            }
        },
        /**
         * [_isNode 判断用户是否有该节点权限]
         * @param  {[type]}   access_id [当前操作的节点ID]
         * @param  {Function} callback  [满足权限后回调]
         */
        _isNode: function(access_id, callback){
            var param = {"access_id":access_id};
            request._ajax('admin/isNode', param, function(){
                if(typeof callback == 'function') callback();
            });
        },
        /**
         * [_nav 左侧菜单]
         * @param  {[type]} data [菜单树形数据集]
         */
        _nav: function(data){
            if(data){
                var li = '<li class="layui-nav-item layui-this"><a href="#"><i class="layui-icon layui-icon-home"></i><cite>系统主页</cite></a></li>';
                // 遍历生成主菜单
                for(var i=0; i <data.length; i++){
                    // 判断是否存在子菜单
                    if(data[i].childs != null && data[i].childs.length > 0){
                        li += '<li class="layui-nav-item">'+
                            '<a href="javascript:;">'+
                                '<i class="layui-icon '+data[i].icon+'"></i>'+
                                '<cite>'+data[i].name+'</cite>'+
                            '</a>'+
                            '<dl class="layui-nav-child">';
                            // 遍历获取子菜单
                            for(var k=0; k <data[i].childs.length; k++){
                                li += this._getChilds(data[i].childs[k]);
                            }
                        li += "</dl></li>";
                    }else{
                        var href = '#'+data[i].hash, layer = '';
                        if(data[i].open_mode == 'layer'){
                            href = 'javascript:;'; layer = data[i].hash;
                        }
                        li += '<li class="layui-nav-item">'+
                            '<a href="'+href+'" layer="'+layer+'">'+
                                '<i class="layui-icon '+data[i].icon+'"></i>'+
                                '<cite>'+data[i].name+'</cite>'+
                            '</a>'+
                        '</li>';
                    }
                };
                document.getElementById('nav-left').innerHTML = li;
                this._naved();
            }
        },
        /**
         * [_getChilds 左侧菜单递归生成子级]
         * @param  {[type]} data [子菜单树形数据集]
         * @return {[type]}      [返回拼装菜单字符集]
         */
        _getChilds: function(data) {
            var subStr = "";
            if(data.childs != null && data.childs.length > 0){
                subStr += '<dd>'+
                    '<a href="javascript:;">'+
                        '<i class="layui-icon '+data.icon+'"></i>'+
                        '<cite>'+data.name+'</cite>'+
                    '</a>'+
                    '<dl class="layui-nav-child">';
                for(var j=0; j<data.childs.length; j++){
                    subStr += this._getChilds(data.childs[j]);
                }
                subStr += "</dl></dd>";
            }else{
                var href = '#'+data.hash, layer = '';
                if(data.open_mode == 'layer'){
                    href = 'javascript:;'; layer = data.hash;
                }
                subStr += '<dd>'+
                    '<a href="'+href+'" layer="'+layer+'">'+
                        '<i class="layui-icon '+data.icon+'"></i>'+
                        '<cite>'+data.name+'</cite>'+
                    '</a>'+
                '</dd>';
            }
            return subStr;
        },
        // 左侧菜单渲染+处理
        _naved: function(){
            layui.use('element', function(){
                // 菜单高亮+手风形式打开菜单
                o('#nav-left li a').each(function(){
                    // 菜单高亮处理
                    var _that = o(this);
                    if(_that.attr('href') == '#'+location.hash.substring(1).split('?')[0]){
                        o('a[href="#"]').parent('li').removeClass('layui-this');
                        _that.parent().addClass('layui-this');
                        _that.parents('li').addClass('layui-nav-itemed');
                    }
                    // 手风形式打开菜单
                    _that.click(function(){
                        _that.parents('li').siblings().removeClass('layui-nav-itemed');
                    });
                });
                // 监听浏览器url变化 获取页面
                window.onhashchange = function(){
                    route._page(location.hash.substring(1).split('?')[0]);
                    if(document.body.clientWidth < 991) o('.nav-flexible.layui-icon-app').click();
                }
                // 窗口打开页面
                layui.element.on('nav(nav-left)', function(){
                    var hash = this.getAttribute('layer'), title = this.lastChild.innerText;
                    if(hash){
                        route._page(hash, false, function(response){
                            layer.open({
                                title:title, content:response, area:['50%','70%'], type:1, maxmin:true
                            });
                        }, 'edit');
                    }
                });
                // 端伸缩菜单
                o('.nav-flexible').click(function(){
                    var obj_layui_side = o('.layui-side'),
                        obj_layui_body = o('.layui-body'),
                        obj_layui_footer = o('.layui-footer');

                    if(obj_layui_side.css('display') == 'block'){
                        obj_layui_body.animate({left: ''});
                        obj_layui_footer.animate({left: ''});
                    }else{
                        obj_layui_body.animate({left: '200px'});
                        obj_layui_footer.animate({left: '200px'});
                    }
                    obj_layui_side.animate({width:'toggle'});
                });
            });
        },
         /**
          * [_uploads 文件上传]
          * @param  {[type]} object   [上传作用域｜文件参数名｜数据库字段名]
          * @param  {[type]} url      [上传地址]
          * @param  {[type]} data     [编辑时，原文件数据]
          * @param  {[type]} type   [上传类型：所有文件file｜图片image｜视频video｜音频audio]
          * @param  {[type]} multiple [是否支持多文件上传]
          * <div class="layui-col-md12">
                <div class="layui-card layui-form-box" id="photo">
                    <div class="layui-card-header"><button type="button" class="layui-btn layui-btn-sm layui-btn-normal">上传封面图</button></div>
                    <div class="layui-card-body">
                        <div class="tips">最佳图片尺寸：400*280</div>
                        <div class="file-view layui-row layui-col-space15"></div>
                    </div>
                </div>
            </div>
          */
        _uploads: function(object, url, data, type, multiple){
            var obj = o('#'+object), obj_file_view = obj.find('.file-view'),
                multiple = multiple!=true? false:true, type = type? type:'image',
                input_html = '', type_icon = '', elip_html = '', a_html = '';
            // 上传文件
            upload.render({
                url:conf.apiPath+url+(url.indexOf('?')>0? '&' : '?')+'token='+sessionStorage.getItem('token'),
                elem:obj.find('button'), multiple:multiple, accept:type,
                //上传完毕
                done: function(res){
                    // 成功
                    if(res.code == 0){
                        // 赋值表单隐藏域 field
                        input_html = '<input name="'+(multiple? object+'[]' : object)+'" value="'+res.data.src+'" type="hidden">';
                        // 成功后预览
                        switch(res.data.type){
                            case 'image': type_icon = '<img src="'+res.data.src+'">'; break;
                            case 'video': type_icon = '<p class="layui-icon layui-icon-video"></p>'; break;
                            case 'audio': type_icon = '<p class="layui-icon layui-icon-headset"></p>'; break;
                            default: type_icon = '<p class="layui-icon layui-icon-file"></p>';
                        }
                        // 文件名
                        elip_html = '<p class="layui-elip">'+res.data.file_name+'</p>';
                        a_html = '<a class="layui-col-md4" href="'+res.data.src+'" target="_blank"><div>'+input_html+type_icon+elip_html+'</div></a>';
                        multiple? obj_file_view.append(a_html) : obj_file_view.html(a_html);
                    }else{
                        // 失败
                        layer.msg(res.msg);
                    }
                }
            });
            // 编辑时 渲染原有文件
            if(data){
                // 多文件 [文件列表为一组数据，否则会出错]
                if(typeof data == 'object'){
                    for(var i in data){
                        // 赋值表单隐藏域 field
                        input_html = '<input name="'+object+'[]" value="'+data[i]+'" type="hidden">';
                        // 文件预览
                        type_icon = '<p class="layui-icon layui-icon-file"></p>';
                        if(data[i].indexOf('/image/') > 0) type_icon = '<img src="'+data[i]+'">';
                        if(data[i].indexOf('/video/') > 0) type_icon = '<p class="layui-icon layui-icon-video"></p>';
                        if(data[i].indexOf('/audio/') > 0) type_icon = '<p class="layui-icon layui-icon-headset"></p>';
                        // 文件名
                        elip_html = '<p class="layui-elip">'+data[i].substring(data[i].length-14)+'</p>';
                        a_html += '<a class="layui-col-md4" href="'+data[i]+'" target="_blank"><div>'+input_html+type_icon+elip_html+'</div></a>';
                    }
                }
                // 单文件
                else{
                    // 赋值表单隐藏域 field
                    input_html = '<input name="'+object+'" value="'+data+'" type="hidden">';
                    // 文件预览
                    type_icon = '<p class="layui-icon layui-icon-file"></p>';
                    if(data.indexOf('/image/') > 0) type_icon = '<img src="'+data+'">';
                    if(data.indexOf('/video/') > 0) type_icon = '<p class="layui-icon layui-icon-video"></p>';
                    if(data.indexOf('/audio/') > 0) type_icon = '<p class="layui-icon layui-icon-headset"></p>';
                    // 文件名
                    elip_html = '<p class="layui-elip">'+data.substring(data.length-14)+'</p>';
                    a_html = '<a class="layui-col-md4" href="'+data+'" target="_blank"><div>'+input_html+type_icon+elip_html+'</div></a>'
                }
                obj_file_view.append(a_html);
            }
        },
        /**
         * [_tableReload layui table刷新]
         * @param  {[type]} msg [刷新前提示字符]
         * @param  {[type]} obj [table ID对象]
         * @param  {Number} t   [延时：毫秒]
         */
        _tableReload: function(msg, obj, t) {
            var _that = this;
            if(msg) layer.msg(msg);
            if(!t) t = 1000;
            setTimeout(function() {
                layui.use('table', function(){
                    layer.closeAll();
                    layui.table.reload(obj, {where:{'_':_that._getCode(16)}});
                });
            }, t);
        },
        /**
         * [_layedit 创建layui编辑器]
         * @param  {[type]} obj [作用域]
         * @param  {[type]} url [编辑器图片上传地址]
         * @param  {[type]} h   [编辑器高度]
         * @return {[type]}     [index ,获取值时提供编辑器索引]
         */
        _layedit: function(obj, url, h){
            var index = layedit.build(obj, {
                height:h? h:'auto',
                uploadImage:{url:conf.apiPath+url+'?token='+sessionStorage.getItem('token'), type:'post'}
            });
            return index;
        },
        /**
         * [_layconfirm layui样式询问框]
         * @param  {String}   msg      [提示字符]
         * @param  {Function} callback [确认后回调]
         * @return {[type]}            [description]
         */
        _layconfirm: function(msg, callback) {
            if(!msg) msg = '确定执行吗？';
            layer.confirm(msg, {
                icon:3, title:'系统消息', btn:['确定', '取消']
            },function(index) {
                layer.close(index);
                if(typeof callback == 'function') callback();
            });
        },
        /**
         * [_confirm 默认询问框]
         * @param  {[type]} msg [提示字符]
         * @return {[type]}     [返回]
         */
        _confirm:function(msg){
            if(!msg) msg = '确定执行吗？';
            return !confirm(msg)? false : true;
        },
        /**
         * [_getCode 获取随机字符编码]
         * @param  {[int]} len [获取长度]
         * @return {[string]}  [随机字符]
         */
        _getCode: function(len){
            var value = '',code = '',
                arr = [
                    1,2,3,4,5,6,7,8,9,0,'a','b','c','d','e','f','g','h','j','k','l','m','n','p','q','r','s','t','u','v','w',
                    'x','y','z','A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z'
                ];
            for(var i=0; i<len; i++){
                value = Math.round(Math.random() * (arr.length-1));
                code += arr[value];
            }
            return code;
        },
        /**
         * [_getColor 获取随机颜色值]
         * @param  {Number} amount [获取数量]
         * @return {[string/arr]}  [默认返回一个值，获取两个以上返回颜色值数组]
         */
        _getColor: function(amount){
            amount = amount? amount : 1;
            var color = '';
            if(amount > 1){
                var color = [];
                for(var i=0; i<amount; i++){
                    color.push('#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6));
                }
            }else{
                color = '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);
            }
            return color;
        },
        /**
         * [_getColorJb 获取随机渐变颜色]
         * @return {[type]} [background值]
         */
        _getColorJb: function(){
            var randum = function(max) { //随机数
                return Math.round(Math.random() * max);
            }
            var hexify = function(x) { //转换16进制
                return ('0' + parseInt(x).toString(16)).slice(-2);
            }
            var randex = function() { //随机16进制色彩值
                return '#' + hexify(randum(255)) + hexify(randum(255)) + hexify(randum(255));
            };
            if (!!Math.round(Math.random())) {
                return 'radial-gradient(circle at ' + randum(100) + '% ' + randum(100) + '%, ' + randex() + ', ' + randex() + ')';
            } else {
                return 'linear-gradient(' + randum(360) + 'deg, ' + randex() + ', ' + randex() + ')';
            }
        },
        /**
         * [_isPcVisit 判断是否电脑访问]
         * @return {Boolean} [是/否]
         */
        _isPcVisit: function(){
            var userAgentInfo = navigator.userAgent,
                Agents = ["Android","iPhone","SymbianOS","Windows Phone","iPad","iPod"],
                flag = true;
            for(var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false; break;
                }
            }
            return flag;
        },
        /**
         * [_ueditor 创建百度编辑器]
         * @param  {[type]}  obj      [作用域]
         * @param  {[type]}  width    [实体宽度]
         * @param  {Number}  height   [实体高度]
         * @param  {Boolean} disabled [是否禁止编辑，默认：可编辑]
         * @return {[type]}           [description]
         */
        _ueditor: function(obj, width, height, disabled){
            if(!width) width = o('#'+obj).parent().width()-19;
            if(!height) height = 500;
            // 删除百度编辑器实体
            UE.delEditor(obj);
            // 渲染百度编辑器
            var ue = UE.getEditor(obj, {
                initialFrameWidth:width, initialFrameHeight:height, zIndex:19891017
            });
            if(disabled) ue.ready(function(){ ue.setDisabled(); });
        }
	});
});