
layui.define(['jquery','form'], function(exports){	
	var o = layui.jquery,
		form = layui.form;

	verify = form.verify({
		
		href: 		[/^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/, '域名地址输入不正确'],

		route: 		[/^[a-zA-Z]+\/?([a-zA-Z])+\/?([a-zA-Z])+\/?([a-zA-Z])+$/, '格式不正确，顶级格式：###；子级格式：### / ### / ### ...'],

		zipcode: 	[/^[1-9][0-9]{5}$/, '邮政编码不正确'],

		idcard: 	[/(^\d{15}$)|(^\d{17}([0-9]|X)$)/, '身份证输入不正确'],

		name: 		[/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/, '姓名输入不正确'],

		bank: 		[/^([1-9]{1})(\d{14}|\d{18})$/, '银行账号不正确'],

		qq: 		[/^[1-9][0-9]{4,14}$/, 'QQ号码不正确'],

		letter: 	[/^[a-zA-Z]{3,16}$/, '请输入3-16位英文字母'],

		chinese: 	[/^[\u4e00-\u9fa5]+$/, '必须输入汉字'],

		notempty: function(val, e){
			if(!val){
				var msg = o(e).attr('placeholder');
				return msg? msg : '必填项不能为空';
			}
		},
		sync: function(val, e){
			if(val != o(e).parents('form').find('input[name="'+o(e).attr('lay-than')+'"]').val()){
				var msg = o(e).attr('placeholder');
				return msg? msg : '与指定域值输入不一样';
			}
		},
		notsync: function(val, e){
			if(val == o(e).parents('form').find('input[name="'+o(e).attr('lay-than')+'"]').val()){
				var msg = o(e).attr('placeholder');
				return msg? msg : '与指定域值输入一样';
			}
		},
		account: function(val, e){
			if(!(/^[a-zA-Z0-9_-]{3,16}$/.test(val))){
				return '账号输入不正确，3-16位字母或数字组成';
			}
		},
		password: function(val, e){
			if(!(/^[a-zA-Z0-9_-]{3,16}$/.test(val))){
				return '密码输入不正确，3-16位字母或数字组成';
			}
		},
		phoneCode: function(val){
			if(!(/^[0-9]{4,6}$/.test(val))){
				return '短信验证码输入不正确';
			}
		},
		telephone: function(val, e){
			if(!(/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(val))){
				return '座机号码输入不正确';
			}
		},
		checkbox: function(val, e){
			var state = false;
			o(e).children('input').each(function(){
				if(o(e).is(":checked") || o(this).is(":checked")) state = true;
			});
			if(!state){
				var msg = o(e).attr('placeholder');
				return msg? msg : '至少选择一项';
			}
		},
		layedit: function(val, e){
			var obj = document.querySelector('iframe').contentWindow.document.body;
			if(!obj.innerHTML){
				var msg = o(e).attr('placeholder');
				return msg? msg : '描述内容不能为空';
			}
		}
	});
	exports('verify', verify);
});