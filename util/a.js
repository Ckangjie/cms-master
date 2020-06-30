layui.define(['jquery'],function(exports){
	var $ = layui.jquery
	var obj ={
		tips:function(obj){
			var html
			if(obj.msg){
				html = `<span class="${obj.class}">${obj.msg}</span>`
			}
			$('body').append(html)
		}
	};
	exports('a',obj)
})