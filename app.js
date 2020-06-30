layui.extend({
	b:'util/b',
	a:'util/a',
	conf:'conf',
	request:'util/request',
	iframe:'util/iframe',
	handle:'util/handle',
	verify:'util/verify',
	route:'util/route',
}).define(['jquery','b','a','request','iframe','conf','handle','verify','route'],function(exports){
	exports('app',{
		b:layui.b,
		a:layui.a,
		jquery:layui.jquery,
		request:layui.request,
		iframe:layui.iframe,
		conf:layui.conf,
		handle:layui.handle,
		verify:layui.verify,
		route:layui.route
	});
});