function getTemplate(name) {
    var template = '';
    $.ajax({
        url: 'templates/' + name + '.html'
        ,async: false
        ,success: function (text) {
            template = text;
        }
    });
    return Handlebars.compile(template);
};
window.psoUrl="/pso/"
$(function(){
	var addapter=new dbo.PSOAdapter({
		url:'/pso/'
		,login:"SH"
		,password:"3855359"
		,template:getTemplate('user')
		,container:$("#headerUser")
		//,callback:function(){console.debug("started");}
	});
	addapter.signin();
	//var ex=new dbo.Exception({template:getTemplate('error'),container:$("#content")});
});