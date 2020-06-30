layui.define(['jquery'],function(exports){
	var $ = layui.jquery
	var iframe ={
		iframe:function(obj){
		var iframe = document.querySelector(obj.elem);
		iframe.height = document.querySelector(obj.pid).clientHeight;
		iframe.width = document.querySelector(obj.pid).clientWidth;
	}
	};
	exports('iframe',iframe)
})