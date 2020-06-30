layui.define(['layer','conf','iframe'],function(exports){
	var layer = layui.layer,
		conf= layui.conf,
		iframe = layui.iframe
		// console.log(iframe)
  var obj = {
    msg: function(str){
		console.log(str)
      layer.msg('Hello '+ (str||'mymod'));
    },
	sum:function(a,b){
		return layer.msg(a+b)
	}
  };
  //输出test接口
  exports('b', obj);
}); 