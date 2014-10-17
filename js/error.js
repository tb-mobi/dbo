/************************************************
 * Exception handler
 ************************************************/
App.Exception=Ember.Object.extend({
	code:null
	,message:null
	,todo:null
});
App.ExceptionController=Ember.ObjectController.extend({
	current:null
});
App.ExceptionView=Ember.View.extend({
	template:getView("error")
	,controller:App.ExceptionController
	,init: function () {
        this._super();
    }
    ,name: "ExceptionView"
});