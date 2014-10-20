$(function () {
	'use strict';
	design();
});

$(window).load(function() {
	set_long_width();
});

$(window).resize(function() {
	set_long_width();
});

function get_space(num) {
	num+='';
	num=num.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
	return num
}

function getChar(event) {
	if (event.which == null) {
		if (event.keyCode < 32) return null;
			return String.fromCharCode(event.keyCode)
	}

	if (event.which!=0 && event.charCode!=0) {
		if (event.which < 32) return null;
			return String.fromCharCode(event.which)
	}

	return null;
}

function set_long_width() {
	if($('.b-form__input_long').length) {
		$('.b-form__input_long').each(function() {
			$(this).width($(this).parent().width()-$(this).parent().find('.b-form__label').width()-15)
		})
	}
	if($('.b-right-menu').length && $(window).width()>=740) {
		$('.b-right-menu').show();
	}
	else if($('.b-right-menu').length && $(window).width()<740) {
		$('.b-right-menu').hide();	
	}
}

window.design=function () {
	'use strict';
	$('.js-code').mask("999");
	$('.js-number-body').mask("999-99-99");
	$('.js-code').keypress(function(event) {
		if(parseInt($(this).val())>=100) {
			$(this).next().focus();
		}
	});
	$('body').on('click', '.b-fselect__main', function(e) {
		if($(this).parent().hasClass('open')) {
			$(this).parent().find('.b-fselect__dropdown').fadeOut(10).end().removeClass('open');
		}
		else {
			$(this).parent().find('.b-fselect__dropdown').fadeIn(10).end().addClass('open');
		}
	});
	$('body').on('click', '.b-header__menu', function(e) {
		if($(this).hasClass('open')) {
			$('.b-header__menu_toggler').slideUp(350);
			$('.b-header__menu').removeClass('open');
		}
		else {
			$('.b-header__menu_toggler').slideDown(350);
			$('.b-header__menu').addClass('open');
		}
	});
	$('body').on('click', '.b-fselect__dropdown li', function(e) {
		var text=$(this).html(),
			val=$(this).attr('data-value');
		$(this).parents('.b-fselect').find('.b-fselect__main').html(text).attr('data-value',val);
		$(this).parent().fadeOut(10).parents('.b-fselect').removeClass('open');
	});
	$('body').click(function(event) {
		if($(event.target).closest('.b-sort').length===0 && $('.b-sort').hasClass('clicked')) {
	        $('.b-sort__toggler').click();
      	}
		if($(event.target).closest('.b-fselect').length===0 && $('.b-fselect').hasClass('open')) {
	        $('.b-fselect.open').find('.b-fselect__main').click();
      	}
		if($(event.target).closest('.b-header__menu').length===0 && $('.b-header__menu').hasClass('open') && $(event.target).closest('.b-header__menu_toggler').length===0) {
	        $('.b-header__menu').click();
      	}
		if($(event.target).closest('.b-right-menu,.b-bank__name').length===0 && $('.b-right-menu__close').is(':visible')) {
	        $('.b-right-menu__close').click();
      	}
	});
	$('body').on('keypress', '.js-number-only', function(e) {
			e = e || event;
			if (e.ctrlKey || e.altKey || e.metaKey) return;
			var chr = getChar(e);
			if (chr == null) return;
			if (chr < '0' || chr > '9') {
				return false;
			}
	});
	$('body').on('focus', '.js-price', function(e) {
			var val=$(this).val();
			val=val.replace(' ','');
			$(this).val(val);
	});
	$('body').on('blur', '.js-price', function(e) {
			var val=$(this).val();
			val=get_space(val);
			$(this).val(val);
	});
	$('body').on('change', '.js-sum', function(e) {
			var t_val=$(this).val(),
			procent=$('.js-total').attr('data-procent'),
			cr=$('.js-total').attr('data-cr');
			t_val=t_val.replace(' ','');
			t_val=t_val/cr;
			var new_val=t_val-((t_val/100)*procent);
			new_val=new_val|0;
			$('.js-total').val(new_val).blur();
	});
	$('body').on('change', '.js-total', function(e) {
			var t_val=$(this).val(),
			procent=$('.js-total').attr('data-procent'),
			cr=$('.js-total').attr('data-cr');
			t_val=t_val.replace(' ','');
			t_val=t_val*cr;
			var new_val=t_val+((t_val/100)*procent);
			new_val=new_val|0;
			$('.js-sum').val(new_val).blur();
	});
	$('.b-transfer__reload').click(function() {
		$(this).addClass('clicked');
		setTimeout(function() {
			$('.b-transfer__reload').removeClass('clicked');
			var val1=$('.b-transfer__el_left form').html(),
				val2=$('.b-transfer__el_right form').html();
				$('.b-transfer__el_right form').html(val1);
				$('.b-transfer__el_left form').html(val2);
		},800)
	});
	$('.b-sort__toggler').click(function() {
		if($(this).parent().hasClass('clicked')) {
			$(this).parent().removeClass('clicked').find('.b-sort__dropdown').slideUp(250);
		}
		else {
			$(this).parent().addClass('clicked').find('.b-sort__dropdown').slideDown(250);
		}
	});
	$('.b-bank__name').click(function() {
		var text=$(this).text();
		if($(window).width()>=740) {
			$(this).attr('data-text',text).html('<input type="text" class="new_name"/>').find('input').focus();
		}
		else {
			$('.b-right-menu').fadeIn(450);
		}
	});
	$('body').on('blur', '.new_name', function(e) {
		var new_val=$(this).val() || $(this).parent().attr('data-text');
		$(this).parent().html('<span>'+new_val+'</span>');
	});
	$('body').on('click', '.b-right-menu__close', function(e) {
		e.preventDefault()
		$(this).parents('.b-right-menu').fadeOut(450);
	});
	set_long_width();
	$('.b-bank__toggler span').click(function() {
		var toggler=$(this).parent(),
			toggler_text=toggler.find('span'),
			body=toggler.parents('.b-bank').find('.b-bank__body');
		if(toggler.hasClass('open')) {
			toggler.removeClass('open');
			toggler_text.text('Показать счета');
			body.fadeOut(250);
		}
		else {
			toggler.addClass('open');
			toggler_text.text('Свернуть');
			body.fadeIn(250);
		}
	})
};