App.Navigation=Ember.Object.extend({
	id:null
	,name:null
	,href:null
});
App.NavigationController=Ember.ArrayController.create({
	content: []
	,contact:"8 (800) 194-94-65"
	,init:function(){
		var tut = this;
		$.getJSON('data/navigation.json').success(function(data){
			console.log("Got navigation");
			data.forEach(function(item){
				tut.pushObject(App.Navigation.create(item));
			});
		});
	}
});
App.HeaderView = Ember.View.extend({
    template: getView('header')
	,controller:App.NavigationController
    ,init: function () {
        this._super();
    }
    ,name: "HeaderView"
});