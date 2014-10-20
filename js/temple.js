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
$(function(){
	var template=getTemplate('main');
	
});