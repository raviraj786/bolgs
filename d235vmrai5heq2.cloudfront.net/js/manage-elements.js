function loadCaptcha(){
    if(manageElements.enable_captcha == 1){
        if(manageElements.captcha_type == 'visible'){
            $('form').each(function(){
                if($(this).find('#zen-recaptcha-div').length && $(this).find('#zen-recaptcha-div').find('.zen-visible-captcha').length){
                    var div = $(this).find('#zen-recaptcha-div').find('.zen-visible-captcha')[0];
                    grecaptcha.render(div.id, {
                      'sitekey' : manageElements.site_key
                    });
                }
            });
        }
        else{
            $('form').each(function(){
                if($(this).attr('data-captcha') && $(this).attr('data-captcha') == 'invisible'){
                    var but = $(this).find('.checkout-button')[0];
                    grecaptcha.render(but, {
                        'sitekey'  : manageElements.site_key,
                        'callback' : checkout.processPayment,
                        'size'     : 'invisible',
                        'badge'    : 'bottomleft'
                    });
                }
            });
        }
    }
}

var manageElements = {
  init : function(){
    // manageElements.manageIframeSize();
    manageElements.manageULIcons();
    manageElements.animations       = {
      callouts    : ['bounce', 'flash', 'pulse', 'shake', 'swing', 'tada'],
      transitions : ['bounceIn', 'bounceUpIn', 'bounceDownIn', 'bounceLeftIn', 'bounceRightIn', 'expandIn', 'fadeIn', 'flipXIn', 'flipYIn', 'flipBounceXIn', 'flipBounceYIn',
                     'perspectiveUpIn', 'perspectiveDownIn', 'perspectiveLeftIn', 'perspectiveRightIn', 'shrinkIn', 'slideUpIn', 'slideDownIn', 'slideLeftIn', 'slideRightIn',
                     'slideUpBigIn', 'slideDownBigIn', 'slideLeftBigIn', 'slideRightBigIn', 'swoopIn', 'whirlIn']
    };
    manageTimer.init();
    managePopup.init();
    manageCustomFields.init();
    manageElements.allElements      = $('*[data-uniqid]');
    manageElements.animatedElements = $('*[data-animation]');
    manageElements.initAnimation();
    $('#zenPopupModalContent').find('.overly').remove();
  },

    manageULIcons : function(){
        $(document).find('ul li').each(function(){
			var _this = this;
			if($(_this).find('i.list-icon').length){
                var ico = $(this).find('i.list-icon').attr('class').split(' ');
	            var get = $.grep(ico, function(v, i){
	                return v.indexOf('fa-') === 0;
	            }).join();

	            var itype = $.grep(ico, function(v, i){
                	return v == 'fa' || v == 'fab' || v == 'fas' || v == 'far';
            	}).join();

                var typeCls = (itype == 'fas') ? 'solid' : (itype == 'fab') ? 'brands' : 'regular';
                $(_this).attr('class', get + ' ' + typeCls);
                $(this).find('i.list-icon').remove();
            }
		});
    },

  manageIframeSize : function(){
    $(document).find('.videoWrapper').each(function(){
			var _this = this;
			$(_this).find('iframe').each(function(){
				if(!this.hasAttribute('width')){
					$(this).attr('width', $(_this).outerWidth());
				}
				if(!this.hasAttribute('height')){
					$(this).attr('height', $(_this).outerWidth() / 1.8);
				}
			});
		});
  },

  initAnimation : function(){
    manageElements.animatedElements.each(function(){
      var animData = (typeof $(this).data('animation') == 'object') ? $(this).data('animation') : ($(this).data('animation')) ? JSON.parse($(this).data('animation').split("'").join('"')) : {};
      manageElements.startAnimation(this, animData);
    });

    var ob_anim = getComputedStyle(document.documentElement).getPropertyValue('--ob_anim');
    if(ob_anim != '' && (manageElements.animations.callouts.indexOf(ob_anim) > -1) || manageElements.animations.transitions.indexOf(ob_anim) > -1){
        var ob_inter = getComputedStyle(document.documentElement).getPropertyValue('--ob_anim_interval');
        var animData = {
            delay    : 0,
            type     : ob_anim,
            interval : (ob_inter != '') ? ob_inter : 0
        };
        manageElements.startAnimation($('#ob_cs_text')[0], animData);
    }
  },

  startAnimation  : function(el, data){
    var delay = data.delay * 1000;
    var anim  = data.type;
    var inter = data.interval * 1000;
    // var vp    = false;
    $(el).attr('data-vp', 'false');
    if(inter == 0){
        $(el).inViewport(function(px){
            if(px > 0 && px >= $(el).outerHeight() * 0.75 && $(el).attr('data-vp') == 'false'){
                setTimeout(function(){
                  var easing = (manageElements.animations.callouts.indexOf(anim) > -1) ? 'callout.' + anim : 'transition.' + anim;
                  if(anim == 'normal'){
                    $(el).css('opacity', 1);
                  }
                  else{
                    $(el).velocity(easing).css('opacity', 1);
                  }
                }, delay);
                $(el).attr('data-vp', 'true');
                // vp = true;
            }
            else if(px == 0){
                // vp = false;
                $(el).attr('data-vp', 'false');
                if(delay > 0){
                    $(el).css('opacity', 0);
                }
            }
        });
    }
    else{
        setTimeout(function(){
          var easing = (manageElements.animations.callouts.indexOf(anim) > -1) ? 'callout.' + anim : 'transition.' + anim;
          if(anim == 'normal'){
            $(el).css('opacity', 1);
          }
          else{
            $(el).velocity(easing).css('opacity', 1);
          }
          if(inter > 0 && anim != 'normal'){
            setInterval(function(){ $(el).velocity(easing).css('opacity', 1); }, inter);
          }
        }, delay);
    }
  }
};

var manageTimer = {
  init : function(){
    manageTimer.ce    = $('.zentimer-main');
    manageTimer.cePos = [];
    if(manageTimer.ce.length == 0){
      manageTimer.deleteCookie(window.location.href + '_timer_date');
    }
    else{
      manageTimer.getTimerPos(manageTimer.ce);
      manageTimer.manageTimerOptions(0);
      manageTimer.initSticky(manageTimer.ce);
    }
  },

  getTimerPos : function(ce){
    for(var t = 0; t < ce.length; t++){
      var $ce              = $(ce[t]);
      manageTimer.cePos[t] = $ce.offset().top + $ce.outerHeight();
    }
  },

  manageTimerOptions : function(i){
    var $ce                      = $(manageTimer.ce[i]);
    manageTimer.firstCalculation = true;
    manageTimer.timerData        = (typeof $ce.data('timer') == 'object') ? $ce.data('timer') : JSON.parse($ce.data('timer').split("'").join('"'));
    if(manageTimer.timerData.type == 'evergreen'){
      manageTimer.createEvergreenTimerOptions(i, $ce);
    }
    if(manageTimer.timerData.type == 'date'){
      manageTimer.createDateTimerOptions(i, $ce);
    }
  },

  createEvergreenTimerOptions : function(i, $ce){
    var now  = new Date();
    var qStr = window.location.search;
    if(qStr != '' && qStr.indexOf('preview=on') > -1){
        manageTimer.createOptions(i, now, $ce);
        return;
    }
    /*if(siteTracking.userId){
      $.ajax({
        url  : siteTracking.internalApi.tracking_get_visit_date_url,
        type : 'post',
        data : {
          userId : siteTracking.userId,
          path   : siteTracking.getPathUrl().fullPath
        },
        success: function(result){
          if(result.created_at){
            now = new Date(result.created_at);
          }
          manageTimer.createOptions(i, now, $ce);
        }
      });
    }
    else{*/
      var cname = window.location.href + '_timer_date';
      var cdate = (navigator.cookieEnabled) ? siteTracking.getCookie(cname) : '';
      if(cdate != ''){
        now = new Date(cdate);
      }
      else{
        siteTracking.setCookie(cname, now, 5 * 365);
      }
      manageTimer.createOptions(i, now, $ce);
   // }
  },

  createDateTimerOptions : function(i, $ce){
    var dateTime = (manageTimer.timerData.date != '') ? manageTimer.timerData.date.split(' ') : ['', ''];
    var dt       = (dateTime[0] != '') ? dateTime[0].split('-') : [0, 0, 0];
    var tm       = (dateTime[1] != '') ? dateTime[1].split(':') : [0, 0];
    var options  = {
      day            : parseInt(dt[2]),
      month          : parseInt(dt[1]),
      year           : parseInt(dt[0]),
      hour           : parseInt(tm[0]),
      minute         : parseInt(tm[1]),
      second         : 0,
      singularLabels : true
    };
    if(manageTimer.timerData.zone != ''){
      options['timeZone'] = parseFloat(manageTimer.timerData.zone.split(':')[1]);
    }
    manageTimer.options = options;
    manageTimer.manageTimerSettings(i, $ce);
  },

  createOptions : function(i, now, $ce){
    var days  = (manageTimer.timerData.days != '') ? parseInt(manageTimer.timerData.days) : 0;
    var hours = (manageTimer.timerData.hours != '') ? parseInt(manageTimer.timerData.hours) : 0;
    var mins  = (manageTimer.timerData.minutes != '') ? parseInt(manageTimer.timerData.minutes) : 0;
    var secs  = (manageTimer.timerData.seconds != '') ? parseInt(manageTimer.timerData.seconds) : 0;
    now.setDate(now.getDate() + days);
    now.setHours(now.getHours() + hours);
    now.setMinutes(now.getMinutes() + mins);
    now.setSeconds(now.getSeconds() + secs);
    var options = {
      day            : now.getDate(),
      month          : now.getMonth() + 1,
      year           : now.getFullYear(),
      hour           : now.getHours(),
      minute         : now.getMinutes(),
      second         : now.getSeconds(),
      singularLabels : true
    };
    manageTimer.options = options;
    manageTimer.manageTimerSettings(i, $ce);
  },

  manageTimerSettings : function(i, $ce){
    if(manageTimer.timerData.action == 'redirect_url' && manageTimer.timerData.action_url != ''){
      manageTimer.options['onComplete'] = function(){
        window.location = manageTimer.timerData.action_url;
      }
    }
    if(manageTimer.timerData.style == 'flip'){
      manageTimer.options['afterCalculation'] =  function(){
        manageTimer.flipAnimate(this);
      }
    }
    if(manageTimer.timerData.style == 'circle'){
      manageTimer.options['onChange'] = function(){
        var clr = $ce.data('circle');
        manageTimer.drawCircle(document.getElementById('ce-days'), this.days, 365, clr);
        manageTimer.drawCircle(document.getElementById('ce-hours'), this.hours, 24, clr);
        manageTimer.drawCircle(document.getElementById('ce-minutes'), this.minutes, 60, clr);
        manageTimer.drawCircle(document.getElementById('ce-seconds'), this.seconds, 60, clr);
      }
    }
    if(manageTimer.timerData.style == 'modern'){
      manageTimer.options['onChange'] = function(){
        manageTimer.modernAnimate($(this.$element).find('.ce-digits span'));
      }
    }
    $ce.countEverest(manageTimer.options);
    if(i + 1 < manageTimer.ce.length){
      manageTimer.manageTimerOptions(i + 1);
    }
  },

  flipAnimate : function(plugin){
    var units  = {
      days    : plugin.days,
      hours   : plugin.hours,
      minutes : plugin.minutes,
      seconds : plugin.seconds
    };
    // max values per unit
    var maxValues = {
      hours   : '23',
      minutes : '59',
      seconds : '59'
    };
    var actClass = 'active';
    var	befClass = 'before';

    var clr  = $(plugin.$element).data('flipcolor');
    var upbg = $(plugin.$element).data('flipupbg');
    var dwbg = $(plugin.$element).data('flipdownbg');

    // build necessary elements
    if(manageTimer.firstCalculation == true){
      manageTimer.firstCalculation = false;

      // build necessary markup
      $(plugin.$element).find('.ce-unit-wrap div').html('');
      $(plugin.$element).find('.ce-unit-wrap div').each(function(){
        var $this     = $(this);
        var className = $this.attr('class');
        var value     = units[className];
        var sub       = '';
        var dig       = '';

        // build markup per unit digit
        for(var x = 0; x < 10; x++){
          sub += [
            '<div class="digits-inner">',
              '<div class="flip-wrap">',
                '<div class="up">',
                  '<div class="shadow"></div>',
                  '<div class="inn" style="color:' + clr + ';background-color:' + upbg + '">' + x + '</div>',
                '</div>',
                '<div class="down">',
                  '<div class="shadow"></div>',
                  '<div class="inn" style="color:' + clr + ';background-color:' + dwbg + '">' + x + '</div>',
                '</div>',
              '</div>',
            '</div>'
          ].join('');
        }

        // build markup for number
        for(var i = 0; i < value.length; i++){
          var w = 88 / value.length;
          dig += '<div class="digits" style="width:' + w + '%;">' + sub + '</div>';
        }
        $this.append(dig);
      });
    }

    // iterate through units
    $.each(units, function(unit){
      var digitCount   = $(plugin.$element).find('.' + unit + ' .digits').length;
      var maxValueUnit = maxValues[unit];
      var maxValueDigit;
      var value        = plugin.strPad(this, digitCount, '0');

      // iterate through digits of an unit
      for(var i = value.length - 1; i >= 0; i--){
        var $digitsWrap = $(plugin.$element).find('.' + unit + ' .digits:eq(' + (i) + ')');
        var $digits     = $digitsWrap.find('div.digits-inner');

        // use defined max value for digit or simply 9
        if(maxValueUnit){
          maxValueDigit = (maxValueUnit[i] == 0) ? 9 : maxValueUnit[i];
        }
        else{
          maxValueDigit = 9;
        }

        // which numbers get the active and before class
        var activeIndex = parseInt(value[i]);
        var beforeIndex = (activeIndex == maxValueDigit) ? 0 : activeIndex + 1;

        // check if value change is needed
        if($digits.eq(beforeIndex).hasClass(actClass)){
          $digits.parent().addClass('play');
        }

        // remove all classes
        $digits.removeClass(actClass).removeClass(befClass);

        // set classes
        $digits.eq(activeIndex).addClass(actClass);
        $digits.eq(beforeIndex).addClass(befClass);
      }
    });
  },

  deg : function(v){
		return (Math.PI/180) * v - (Math.PI/2);
	},

	drawCircle : function(canvas, value, max, clr){
		var	circle = canvas.getContext('2d');

		circle.clearRect(0, 0, canvas.width, canvas.height);
		circle.lineWidth = 4;

		circle.beginPath();
		circle.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - circle.lineWidth, manageTimer.deg(0), manageTimer.deg(360 / max * (max - value)), false);
		circle.strokeStyle = '#282828';
		circle.stroke();

		circle.beginPath();
		circle.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - circle.lineWidth, manageTimer.deg(0), manageTimer.deg(360 / max * (max - value)), true);
		circle.strokeStyle = (clr) ? clr : '#117d8b';
		circle.stroke();
	},

  modernAnimate : function($el){
		$el.each( function(index){
			var $this     = $(this);
			var fieldText = $this.text();
			var fieldData = $this.attr('data-value');
			var fieldOld  = $this.attr('data-old');

			if(typeof fieldOld === 'undefined'){
				$this.attr('data-old', fieldText);
			}

			if(fieldText != fieldData){
				$this.attr('data-value', fieldText).attr('data-old', fieldData).addClass('ce-animate');

				window.setTimeout(function(){
			    $this.removeClass('ce-animate').attr('data-old', fieldText);
				}, 300);
			}
		});
	},

  deleteCookie : function(name){
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },

  initSticky : function(ce){
      $(document).scroll(function(){
        var topExists = false;
        var botExists = false;
        var maxH      = 0;
        for(var j = 0; j < ce.length; j++){
          var $ce       = $(ce[j]);
          var timerData = (typeof $ce.data('timer') == 'object') ? $ce.data('timer') : JSON.parse($ce.data('timer').split("'").join('"'));
          if(timerData.sticky == 'top'){
            if($(window).scrollTop() > manageTimer.cePos[j]){
              topExists = true;
              $ce.css('width', '100%');
              $ce.css('position', 'fixed');
              $ce.css('top', '0px');
              $ce.css('left', '0px');
              $ce.css('z-index', '9999');
              if($ce.height() > maxH)
                maxH = $ce.height();
            }
            else{
              $ce.css('width', '');
              $ce.css('position', '');
              $ce.css('top', '');
              $ce.css('left', '');
              $ce.css('z-index', '');
            }
          }
          else if(timerData.sticky == 'bottom'){
            if($(window).scrollTop() > manageTimer.cePos[j]){
              botExists = true;
              $ce.css('width', '100%');
              $ce.css('position', 'fixed');
              $ce.css('bottom', '0px');
              $ce.css('left', '0px');
              $ce.css('z-index', '9999');
              if($ce.height() > maxH)
                maxH = $ce.height();
            }
            else{
              botExists = false;
              $ce.css('width', '');
              $ce.css('position', '');
              $ce.css('bottom', '');
              $ce.css('left', '');
              $ce.css('z-index', '');
            }
          }
        }
        // if(topExists == true){
        //   $('body').css('margin-top', maxH + 'px');
        // }
        if(botExists == true){
          $('body').css('margin-bottom', maxH + 'px');
        }
        else{
          $('body').css('margin-bottom', '');
        }
      });
  }
};

var managePopup = {
  init : function(){
    managePopup.pop  = $('#zenPopupModal');
    managePopup.$pop = managePopup.pop.find('#zenPopupModalContent');
    managePopup.popupData = (typeof managePopup.$pop.data('popup') == 'object') ? managePopup.$pop.data('popup') : (managePopup.$pop.data('popup')) ? JSON.parse(managePopup.$pop.data('popup').split("'").join('"')) : {};
    managePopup.setAnimation();
    if(managePopup.popupData.active == 'true'){
      managePopup.setTrigger();
    }
  },

  setAnimation : function(){
    managePopup.pop.on('show.bs.modal', function(e){
      if(managePopup.pop.find('.modal-dialog').hasClass('modal-xl')){
        managePopup.pop.find('.modal-content').css('min-height', $(window).height() + 'px');
      }
      if(managePopup.popupData.active == 'false'){
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      var anim = managePopup.popupData.animation;
      // if(anim === 'shake' || anim === 'pulse' || anim === 'tada' || anim === 'flash' || anim === 'bounce' || anim === 'swing'){
      //   managePopup.pop.find('.modal-dialog').velocity('callout.' + anim);
      // }
      // else if(anim !== 'normal'){
      //   managePopup.pop.find('.modal-dialog').velocity('transition.' + anim);
      // }
      var easing = (manageElements.animations.callouts.indexOf(anim) > -1) ? 'callout.' + anim : 'transition.' + anim;
      if(anim != 'normal'){
        managePopup.pop.find('.modal-dialog').velocity(easing);
      }
    }).on('shown.bs.modal', function(e){
      if(managePopup.pop.find('.modal-dialog').hasClass('modal-xl') && managePopup.pop.css('padding-left') == '0px'){
        managePopup.pop.css('padding-left', '17px');
      }
    });
  },

  setTrigger : function(){
    if(managePopup.popupData.trigger == 'land'){
      managePopup.pop.modal('show');
    }
    if(managePopup.popupData.trigger == 'exit'){
      managePopup.left = false;
      $(document).mouseleave(function(e){
        if(managePopup.left == false && e.pageY <= 0){
          managePopup.pop.modal('show');
          managePopup.left = true;
        }
      });
    }
    if(managePopup.popupData.trigger == 'scroll'){
      managePopup.lastScrollTop = 0;
      managePopup.scrolled      = false;
      var docH                  = $(document).height();
      var limit                 = docH * (parseInt(managePopup.popupData.scroll) / 100);
      $(document).scroll(function(){
        managePopup.curScrollTop = $(document).scrollTop();
        if(managePopup.scrolled == false && managePopup.curScrollTop > managePopup.lastScrollTop && managePopup.curScrollTop >= limit){
          managePopup.pop.modal('show');
          managePopup.scrolled = true;
        }
        managePopup.lastScrollTop = managePopup.curScrollTop;
      });
    }
    if(managePopup.popupData.trigger == 'delay'){
      setTimeout(function(){
        managePopup.pop.modal('show');
      }, parseInt(managePopup.popupData.delay) * 1000);
    }
  }

};

var manageCustomFields = {
  init : function(){
    manageCustomFields.pageUrl = window.location.href;
    manageCustomFields.forms   = $('form.zen-custom-form');
    if(manageElements.isEu && manageElements.isEu == true){
      manageCustomFields.manageGdprFiled();
    }
    manageCustomFields.forms.find('.btn[data-action="submit"]').click(function(){
        if(!$(this).closest('form.zen-custom-form').find('#zen-recaptcha-div').length || manageElements.captcha_type == 'visible'){
            if((manageCustomFields.pageUrl.indexOf('/f/') > -1 || manageCustomFields.pageUrl.indexOf('/fp/') > -1) &&
            $(this).closest('form.zen-custom-form').find('input[type="email"]').length){
                manageCustomFields.submitFunnelForm(this);
            }
            else{
                manageCustomFields.submitForm(this);
            }
        }
        return false;
    });

    // manageCustomFields.forms.on('keypress', '.zen-custom-elm', function(ev){
    //   if(ev.which === 13){
    //     if((manageCustomFields.pageUrl.indexOf('/f/') > -1 || manageCustomFields.pageUrl.indexOf('/fp/') > -1) &&
    //       $(this).closest('form.zen-custom-form').find('input[type="email"]').length){
    //       manageCustomFields.submitFunnelForm($(this).closest('form.zen-custom-form').find('.btn[data-action="submit"]')[0]);
    //     }
    //     else{
    //       manageCustomFields.submitForm($(this).closest('form.zen-custom-form').find('.btn[data-action="submit"]')[0]);
    //     }
    //     return false;
    //   }
    // });

    manageCustomFields.forms.find('.btn[data-action="submit_signup"]').click(function(e){
      manageCustomFields.submitSignupForm(this, e);
    });

    $('form.zen-custom-form').find('.zen-custom-elm:not(.btn)').on('input', function(){
      $(this).removeClass('cu-has-error').parent().removeClass('cu-has-error');
    });
  },

  manageGdprFiled : function(){
    var consent = (manageElements.consent_text) ? manageElements.consent_text : '';
    manageCustomFields.forms.find('.gdpr-input-div').find('.gdpr-text').html(consent);
    manageCustomFields.forms.find('.gdpr-input-div').show();
  },

  validateCustomFields : function(btn){
    var erFlag = false;
    var form   = $(btn).closest('form.zen-custom-form');
    var schedule_id = form.find('#live_webinar_schedule_id_popup').val();
    if(typeof(schedule_id)!="undefined"){
        manageCustomFields.postData.fields["schedule_id"] = schedule_id;
    }
    form.find('.zen-custom-elm:not(.btn)').each(function(){
      var el   = (this.type == 'checkbox') ? $(this).parent() : $(this);
      if(!el.is(':visible')){
        return;
      }
      var data = (typeof el.data('custom') == 'object') ? el.data('custom') : JSON.parse(el.data('custom').split("'").join('"'));
      var val  = (this.type == 'checkbox') ? $(this).prop('checked') : $(this).val().trim();
      var name = (data.ctype == '') ? data.input : data.ctype;

      if((data.input == '0' || data.input == 'custom') && data.ctype == ''){
        return;
      }
      if(data.required == 'true'){
        if(this.type != 'checkbox' && val == ''){
          // el.addClass('cu-has-error');
          if(erFlag == false)
            site.notifyError(name + ' field is required !');
          erFlag = true;
        }
        else if(data.input == 'email'){
          if(!manageCustomFields.validateEmail(val)){
            if(erFlag == false)
              site.notifyError('Invalid email !');
            // el.addClass('cu-has-error');
            erFlag = true;
          }
        }
        else if(this.type == 'checkbox'){
          if($(this).prop('checked') == false){
            // el.addClass('cu-has-error');
            if(erFlag == false)
              site.notifyError('Checkbox must be checked !');
            erFlag = true;
          }
        }
      }
      else if(data.input == 'email'){
          if(!manageCustomFields.validateEmail(val)){
            if(erFlag == false){
                site.notifyError('Invalid email !');
            }
            erFlag = true;
        }
      }
      manageCustomFields.postData.fields[name] = val;

    });

    if(form.find('#zen-recaptcha-div').length){
        manageCustomFields.postData['enable_captcha']       = 1;
        manageCustomFields.postData['g-recaptcha-response'] = (manageElements.captcha_type == 'visible') ?
            form.find('#zen-recaptcha-div').find('[name="g-recaptcha-response"]').val() : $('[name="g-recaptcha-response"]').val();
    }
    else{
        manageCustomFields.postData['enable_captcha']       = 0;
        manageCustomFields.postData['g-recaptcha-response'] = '';
    }
    return erFlag;
  },

  submitForm : function(button){
      var defForms = ['register', 'login', 'support'];
      if((button.nodeName == 'FORM' || button.nodeName == 'form') && (defForms.indexOf(manageElements.page_uri) > -1 )){
          button.submit();
          return false;
      }
    var form                    = $(button).closest('form.zen-custom-form');
    var btn                     = $(form).find('.btn[data-action="submit"]')[0];
    var formName                = (form.attr('name')) ? form.attr('name') : '';
    var lists                   = ($(btn).attr('data-lists')) ? $(btn).attr('data-lists') : '';
    var emailLists              = (lists != '') ? lists.split(',') : [];
    var funls                   = ($(btn).attr('data-funnels')) ? $(btn).attr('data-funnels') : '';
    var funnels                 = (funls != '') ? funls.split(',') : [];
    var tags                    = ($(btn).attr('data-tags')) ? $(btn).attr('data-tags') : '';
    var addTags                 = (tags != '') ? tags.split(',') : [];
    manageCustomFields.postData = {
      formName   : formName,
      pageId     : manageElements.pageId,
      fields     : {}
    };
    if(emailLists.length > 0){
      manageCustomFields.postData['emailLists'] = emailLists;
    }
    if(funnels.length > 0){
      manageCustomFields.postData['funnels'] = funnels;
    }
    if(addTags.length > 0){
      manageCustomFields.postData['addTags'] = addTags;
    }

    var erFlag = manageCustomFields.validateCustomFields(btn);

    if(erFlag == true){
      return false;
    }
    else{
      $.ajax({
        url     : APP_URL + '/addCustomFields',
        method  : 'GET',
        type    : 'json',
        data    : manageCustomFields.postData,
        success : function(response){
          if(response.status == 1){
            form.find('input:not(.btn), textarea').val('');
            form.find('input[type="checkbox"]').prop('checked', false);
            $('#zenPopupModal').modal('hide');
            if($(btn).data('submitaction') && $(btn).data('submitaction') == 'href'){
              var link = ($(btn).data('submithref')) ? $(btn).data('submithref') : '';
              if(link != ''){
                location.href = link;
              }
            } else if (response.type == "liveclass_registration") {console.log("aa");
                live_class.ShowThankYouPage();
            } else if(response.type == "Webinar_Registration") {
                site.notifySuccess(response.msg);
                if(fbtrackid && fbtrackid!=''){
                   var webinar_id = $("#live_webinar_id").val();
                   manageCustomFields.FBTrackOnWebinarReg(webinar_id,manageCustomFields.postData.fields['email']);
                }
                location.href = response.redirect_url;
            } else {
                site.notifySuccess('Success !');
                if(manageElements.enable_captcha == 1 && manageElements.captcha_type == 'visible'){
                    location.reload();
                }
            }
          } else {
              if(response.type = "liveclass_registration") {
                  site.notifyError(response.msg);
              }
          }
          // else{
          //     if(response.status == 0 && response.message['g-recaptcha-response']){
          //         site.notifyError(response.message['g-recaptcha-response'][0]);
          //     }
          // }
        },
        error : function(response){
          site.notifyError('Sorry, please try again !');
        }
      });
    }
  },

  submitSignupForm : function(btn, e){
    var form     = $(btn).closest('form.zen-custom-form');
    var formName = (form.attr('name')) ? form.attr('name') : '';
    form.find('[name="form_name"]').val(formName);
    form.find('[name="page_id"]').val(manageElements.pageId);
  },

  submitFunnelForm : function(button){
    var form                    = $(button).closest('form.zen-custom-form');
    var btn                     = $(form).find('.btn[data-action="submit"]')[0];
    var formName                = (form.attr('name')) ? form.attr('name') : '';
    var lists                   = ($(btn).attr('data-lists')) ? $(btn).attr('data-lists') : '';
    var emailLists              = (lists != '') ? lists.split(',') : [];
    var funls                   = ($(btn).attr('data-funnels')) ? $(btn).attr('data-funnels') : '';
    var funnels                 = (funls != '') ? funls.split(',') : [];
    var tags                    = ($(btn).attr('data-tags')) ? $(btn).attr('data-tags') : '';
    var addTags                 = (tags != '') ? tags.split(',') : [];
    manageCustomFields.postData = {
      formName   : formName,
      pageId     : manageElements.pageId,
      fields     : {}
    };
    if(emailLists.length > 0){
      manageCustomFields.postData['emailLists'] = emailLists;
    }

    if(funnels.length > 0){
      manageCustomFields.postData['funnels'] = funnels;
    }
    if(addTags.length > 0){
      manageCustomFields.postData['addTags'] = addTags;
    }

    var erFlag = manageCustomFields.validateCustomFields(btn);

    if(erFlag == true || (('email' in manageCustomFields.postData.fields)  && manageCustomFields.postData.fields['email'] == '')){
      return false;
    }
    else{
        manageCustomFields.postData['_token'] = $('input[name="_token"]').val();
      $.ajax({
        url     : APP_URL + '/enrollToFunnel-addCustomFields',
        method  : 'POST',
        type    : 'json',
        data    : manageCustomFields.postData,
        success : function(response){
          if(response.status == 1){
            form.find('input:not(.btn), textarea').val('');
            form.find('input[type="checkbox"]').prop('checked', false);
            $('#zenPopupModal').modal('hide');

            if($(btn).data('submitaction')){
              if(fbtrackid && fbtrackid!=''){
                manageCustomFields.FBTrackOnAddLead(manageCustomFields.postData.fields['email'],manageCustomFields.postData.pageId);
              }
              var link = '';
              if($(btn).data('submitaction') == 'href'){
                link = ($(btn).data('submithref')) ? $(btn).data('submithref') : '';
              }
              if($(btn).data('submitaction') == 'nextstep'){
                link = (response.nextPageUrl != '') ? '/' + response.nextPageUrl : response.nextPageUrl;
              }
              if(link != ''){
                location.href = link;
              }
              else{
                site.notifySuccess('Success !');
              }
            }
          }
          else{
              site.notifyError('Something went wrong !');
          }
          // else{
          //     if(response.status == 0 && response.message['g-recaptcha-response']){
          //         site.notifyError(response.message['g-recaptcha-response'][0]);
          //     }
          // }
        },
        error : function(response){
          site.notifyError('Sorry, please try again !');
        }
      });
    }
  },

  validateEmail : function(email){
    var reg = /^([A-Za-z0-9_\-\.\+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,20})$/;
    return reg.test(email);
  },
  FBTrackOnAddLead:function(email,pageid){
    var funnelname = '';
    $.ajax({
        url     : APP_URL + '/getFunnelName',
        method  : 'GET',
        type    : 'json',
        async   : false,
        data    : {pageId:pageid},
        success : function(response){
          if(response.success){
              funnelname=response.funnel;
          }
      }
  });
  fbq('track','Lead',{'Funnel':funnelname,'Email-Id':email});
  },
  FBTrackOnWebinarReg:function(id,email){
      var webinarname = '';
      var lead = '';
       $.ajax({
        url     : APP_URL + '/getWebinarName',
        method  : 'GET',
        type    : 'json',
        async   : false,
        data    : {id:id,email:email},
        success : function(response){
          if(response.success){
              webinarname = response.webinar;
              lead = response.lead;
          }
      }
  });
  if(lead == 1){
      fbq('track','Lead',{'Webinar':webinarname,'Email-Id':email});
  }
  fbq('trackCustom','Webinar Registration' ,{'Webinar':webinarname,'Email-Id':email});
  }
};

(function($, win) {
  $.fn.inViewport = function(cb) {
     return this.each(function(i,el) {
       function visPx(){
         var elH = $(el).outerHeight(),
             H = $(win).height(),
             r = el.getBoundingClientRect(), t=r.top, b=r.bottom;
         return cb.call(el, Math.max(0, t>0? Math.min(elH, H-t) : Math.min(b, H)));
       }
       visPx();
       $(win).on('resize scroll', visPx);
     });
  };
}(jQuery, window));
