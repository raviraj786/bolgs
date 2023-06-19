var live_class = {
        ready: function() {
            live_class.loadPages();
            $('body').off('submit','form[name="login-liveclass"]').on('submit','form[name="login-liveclass"]',live_class.LoginLiveClass);
            $('body').off('click','.book-my-slot').on('click','.book-my-slot',live_class.ShowThankYouPage);
            $('body').off('click','#waiting-page-url-copy').on('click','#waiting-page-url-copy',live_class.CopyLiveClassURL);
            $('body').off('click','#enter-live-class-btn').on('click','#enter-live-class-btn',live_class.EnterUserIntoLiveClass);

//            Old Theme
            $('body').off('click','#book-my-slot-p1').on('click','#book-my-slot-p1',live_class.ShowThankYouPage);
            $('body').off('click','#login-book-my-slot-p1').on('click','#login-book-my-slot-p1',live_class.ShowLoginPopup);

            $('body').off('click','.go-to-plans').on('click','.go-to-plans',function(){
                $('html, body').animate({ scrollTop: $('.zen_cs_plans_dynamic').offset().top }, 'slow');
            });
            $('body').off('change', '#lc_ms_schedules_select').on('change', '#lc_ms_schedules_select', function(){
                var selectedText = $(this).val();
                 $("select#lc_ms_schedules_select").val(selectedText);
                live_class.loadPages();
            });
            if($('#lc-zen-pick-date-list').length > 0){
                live_class.loadSlider();

            }
            $("#lc-zen-pick-date-list").on("click","a",function(e){
                e.preventDefault();
                var lithis = $(this).parent();
                lithis.addClass("selected").siblings().removeClass("selected");
                 var val =  lithis.text();
                 var schedule = lithis.attr("data-time-schedules");
                 schedule = JSON.parse(schedule);
                 var sel = "";
                 var li = "";
                 var i=0;
                 var firstSessionDisplayText = "";
                 for (var key in schedule.times) {
                     sel = "";
                     var obj = schedule.times[key]['time'] ;
                     var display_text = schedule.times[key]['schedule_text'];
                    if(i==0){
                         sel = "selected";
                         $('#live_class_schedule_id').val(key);
                         firstSessionDisplayText = display_text;
                     }i++;
                    li +='<li class="' + sel +' zen_picked_time_list" id="lc_zen_picked_time" data-schedule-id="' + key +'" data-schedule-text="'+ display_text +'">'+
                              '<a href="#" style="text-decoration:none;" class="zen-list-times"><span>'+ obj +'</span></a></li>';
                }
                $('#lc-zen-time-pick-list').html();
                $('#lc-zen-time-pick-list').html(li);
                $('#lc_zen_schedule_text').html();
                $('#lc_zen_schedule_text').html(firstSessionDisplayText);
                 live_class.loadPages();
            });

            $("#lc-zen-time-pick-list").on("click","a",function(e){
                e.preventDefault();
                var li_time = $(this).parent();
                li_time.addClass("selected").siblings().removeClass("selected");
                var schedule_text = li_time.attr("data-schedule-text");
                $('#lc_zen_schedule_text').html();
                $('#lc_zen_schedule_text').html(schedule_text);
                live_class.loadPages();
            });

        },

        loadPages: function() {
            //if live class checkout page, remove register popup (email field conflict while login)
            if ($('input[name="lc-chk-page"]').val() == 1){
                $('#zenPopupModal').remove();
            }
            if (! $('#zen_lc_popup_btn_dynamic').length > 0 ){
               $('.zen_lc_btn_div').closest('div.page').find('div.zenler-plan-type-4-outr').remove();
               $('.zen_lc_btn_div').closest('div.page').find('div.zenler-plan-type-5-outr').remove();
               //return;
            }
//            Register Page
           // if ($("#liveclass-register-page-countdown").length > 0) {
                var schedule_uid = 0;
                var schedule_id = "";
                var schedule_date = "";
                if ($('input[name="lc_multiple_schedules"]').val() == 1){
                    if($("#lc_ms_schedules_select").length > 0){
                        schedule_uid = $("#lc_ms_schedules_select").find(":selected").val();
                        schedule_date = $("#lc_ms_schedules_select").find(":selected").text();
                        schedule_id = $("#lc_ms_schedules_select").find(":selected").attr("data-schedule-key");
                        $('#live_class_schedule_id').val(schedule_uid);
                        $("#live_class_schedule").val(schedule_id);
                    }else if($('#lc-zen-pick-date-list').length > 0){
                         schedule_uid = $('#lc-zen-time-pick-list ').find("li.selected").attr("data-schedule-id");
                         $('#live_class_schedule_id').val(schedule_uid);
                         $("#live_class_schedule").val(schedule_id);
                         schedule_date = $('#lc-zen-time-pick-list ').find("li.selected").attr("data-schedule-text");
                   }
                    var reg_filled_classes = $('#reg_filled_classes').val();
                    reg_filled_classes = JSON.parse(reg_filled_classes);
                    document.getElementById('zen_lc_popup_btn_dynamic').removeAttribute("disabled");
                     $('#zen_lc_popup_btn_dynamic').prop("disabled", false).click(function() {
                            console.log('not Disabled...');
                    });
                    $('#reg_filled_webinar_error_msg').addClass("hide");

                    if(reg_filled_classes.some(function(el){
                        if(el == schedule_uid){
                           // $('#zen_wb_popup_btn_dynamic').addClass("hide");
                            document.getElementById('zen_lc_popup_btn_dynamic').setAttribute("disabled","disabled");
                            $('#zen_lc_popup_btn_dynamic').prop("disabled", true).click(function() {
                                console.log('Disabled...');
                            });
                            $('#reg_filled_webinar_error_msg').removeClass("hide");
                        }
                    }));

                }
                if($('#class_link').length > 0){
                    var class_type = $('#class_link').val();
                }else{
                    var class_type = "live-class";
                }
                var slug = $("#live_class_slug").val();
                var outer = $('div.zen_lc_btn_div');
                var live_class_url = "/"+class_type+"/" + slug + "/buy";
                var coupon = site.getParameterByName('coupon', window.location.href);
                if (coupon != '' && coupon != null && schedule_uid > 0){
                    live_class_url = live_class_url + '?coupon=' + coupon + '&live_schedule_id=' + schedule_uid;
                }
                else if (coupon != '' && coupon != null){
                    live_class_url = live_class_url + '?coupon=' + coupon;
                }
                else if(schedule_uid > 0){
                    live_class_url = live_class_url + '?live_schedule_id=' + schedule_uid;
                }
                 if (schedule_uid > 0) {
                    if ($('#zenPopupModal .zen-custom-form #live_webinar_schedule_id_popup').length > 0)
                    {
                        $('#zenPopupModal .zen-custom-form #live_webinar_schedule_id_popup').val(schedule_uid);
                    } else {
                        $('#zenPopupModal .zen-custom-form').append("<input type='hidden' id='live_webinar_schedule_id_popup' value='" + schedule_uid + "'>");
                    }

                    if ($('#zenPopupModal .popup-section2 #schedule_date_div').length > 0)
                    {
                        $('#zenPopupModal .popup-section2 #schedule_date_div #schedule_date_text ').html(schedule_date);
                    } else {
                        $('<div id="schedule_date_div"><p id="schedule_date_text"> ' + schedule_date + '</p></div>').insertBefore('.zen-custom-form');
                    }
                }
                var show_pop_up = false;
                var url = '';
                if (outer.find('input[name="live_pl_cnt"]').length == 0){ //for old blocks/live classes
                    show_pop_up = true;
                }else{
                    var reg_popup = outer.find('input[name="live_reg_pop"]').val();
                    if (reg_popup == 1){
                        show_pop_up = true;
                    }
                    if (!show_pop_up){
                        var plan_count = outer.find('input[name="live_pl_cnt"]').val();
                        if (plan_count == 0){ //if price is hidden or no plans are added, go to support
                            url = "/support";
                            $(".liveclass-registration-btn").attr('href', url);
                            $(".liveclass-registration-btn").attr('data-toggle', '');
                            $(".liveclass-registration-btn").attr('data-action', '');
                            $('div.zenler-plan-type-4-outr').remove();
                            $('div.zenler-plan-type-5-outr').remove();
                        }else if (plan_count == 1){
                            url = live_class_url ;
                            $(".liveclass-registration-btn").attr('href', url);
                            $(".liveclass-registration-btn").attr('data-toggle', '');
                            $(".liveclass-registration-btn").attr('data-action', '');
                            if(schedule_uid > 0 && $('.zen_cs_plans_dynamic').length > 0){
                                var priceBtn = $('.pricebutton');
                                live_class.ChangeButtonUrl(priceBtn,schedule_uid);
                            }
                        }else if (plan_count > 1){
                            if ($('.zen_cs_plans_dynamic').length > 0) {
                                $(".liveclass-registration-btn").attr('href', '#');
                                $(".liveclass-registration-btn").attr('data-toggle', '');
                                $(".liveclass-registration-btn").attr('data-action', '');
                                $(".liveclass-registration-btn").addClass('go-to-plans');
                                if(schedule_uid > 0){
                                var priceButtons = document.querySelectorAll('.pricebutton.dynamic-button');
                                for(var i =0;i<priceButtons.length;i++){
                                    var prBtn = priceButtons[i];
                                    live_class.ChangeButtonUrl(prBtn,schedule_uid);
                                }
                            }
                            }
                        }
                    }else{
                        $('div.zenler-plan-type-4-outr').remove();
                        $('div.zenler-plan-type-5-outr').remove();
                    }
                }
                if ($("#liveclass-register-page-countdown").length > 0) {
                    $('#liveclass_timer_block').show();
                    $('.countdown').countEverest({
                        hour: $("#schedule_hour").val(),
                        minute: $("#schedule_minute").val(),
                        day: $("#schedule_day").val(),
                        month: $("#schedule_month").val(),
                        year: $("#schedule_year").val(),
                        timeZone: Number($("#schedule_timezone").val()),
                        onComplete: function () {
                            $('#liveclass_timer_block').hide();
                            $('.countdown').hide();
                        }
                    });
                }
                if (show_pop_up){ //works as old way (no pricing case)
                    if($("#user-login-status").val() == "logged_out") {
    //                    $(".liveclass-registration-btn").attr('id', 'login-book-my-slot');
                        $(".liveclass-registration-btn").addClass('login-book-my-slot');
                        $(".liveclass-registration-btn").attr('href', '#zenPopupModal');
                        $(".liveclass-registration-btn").attr('data-toggle', 'modal');
                        $(".liveclass-registration-btn").attr('data-action', 'popup');
                    } else if($("#user-login-status").val() == "logged_in") {
    //                    $(".liveclass-registration-btn").attr('id', 'book-my-slot');
                        $(".liveclass-registration-btn").addClass('book-my-slot');
                        $(".liveclass-registration-btn").attr('href', '#');
                        $(".liveclass-registration-btn").attr('data-toggle', '');
                        $(".liveclass-registration-btn").attr('data-action', '');
                    }
                }
          //  } else
                if ($("#liveclass-waiting-page-countdown").length > 0) {
                    live_class.ShowLiveClassEnterButtons();
                    $('#waiting-page-countdown').show();
                    $('.countdown').countEverest({
                        hour: $("#schedule_hour").val(),
                        minute: $("#schedule_minute").val(),
                        day: $("#schedule_day").val(),
                        month: $("#schedule_month").val(),
                        year: $("#schedule_year").val(),
                        timeZone: Number($("#schedule_timezone").val()),
                        onComplete: function () {
                            $("p#show-pwd").removeClass("hide");
                            $('.countdown').hide();
                            $('#liveclass_timer_block').hide();
                            $("#presenter-not-joined").removeClass("hide");
                            if ($("#live-class-user").length > 0 && $("#live-class-user").val() == "attendee") {
                                $("p#show-pwd").removeClass("hide");
                                $("#enter-live-class-btn").removeClass("hide");
                            }
//                            to check admin started class in every seconds, after timer hits to zero
                            if($("#presenter-not-joined").length > 0) {
                                var startInterval = setInterval(function () {
                                    live_class.checkLiveclassStartedorNot(startInterval);
                                }, 30000);
                            }
                        }
                    });
            }
        },

        ShowLoginPopup: function() {
            $('#login-live-class').modal('toggle');
            $(".login-error-block").html('');
            $(".login-error-block").css('padding', '0px');
            $(".login-textbox").val("");
        },

        LoginLiveClass: function(e) {
            e.preventDefault();
            $.ajax({
                url: "/live-class/login",
                method: "GET",
                type: "json",
                data: $(this).serialize(),
                beforeSend: function () {

                },
                complete: function () {

                },
                success: function (response) {
                    if (response.status) {
                        live_class.ShowThankYouPage();
                    } else {
                        $("#login-live-class .login-error-block").html(response.msg);
                        $("#login-live-class .login-error-block").css("padding","0px 20px");
                        $("#login-live-class .login-error-block").css("padding-top","15px");
                        return;
                    }
                },
                error: function (response) {
//                    alert("Sorry, please try again.")
                }
            });
        },

        ShowThankYouPage: function() {
            var token = $('input[name="_token"]').val();
            if($('#class_link').length > 0){
                var class_type = $('#class_link').val();
            }else{
                var class_type = "live-class";
            }
            $.ajax({
                url:  "/"+class_type+"/register",
                method: "POST",
                type: "json",
                data: {
                    _token: token,
                    live_class_id : $("#live_class_id").val(),
                    live_class_schedule_id : $("#live_class_schedule_id").val(),
                    schedule : $("#live_class_schedule").val(),
                    slug : $("#live_class_slug").val(),
                 //   course_with_live : $('#course_with_live').val()
                },
                beforeSend: function () {

                },
                complete: function () {

                },
                success: function (response) {
                    if (response.success) {
                        if(fbtrackid && fbtrackid!=''){
                            var live_class_id = $("#live_class_id").val();
                            live_class.FBTrackOnLiveClassReg(live_class_id);
                        }
                            window.location = response.redirect_hash_url;
                    }
                    else {
                       $("button.close").click();
                       $("#access-denied-text").removeClass('hide');
                       $("#access-denied-text").html("You can't Book this Live Session yet.<br>Please contact the Site Admin.");
                       $(".liveclass-registration-btn").hide();
                    }
                },
                error: function (response) {
//                    alert("Sorry, please try again.")
                }
            });
        },

        CopyLiveClassURL: function(e) {
            e.preventDefault();
            var copyText = $("#waiting-page-url-copy").html();
            copyText = copyText.split('<span');
            copyText = copyText[0];
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val(copyText).select();
            document.execCommand("copy");
            $temp.remove();
            site.notifySuccess("URL Copied");
            return false;
        },

        EnterUserIntoLiveClass: function() {
            $.ajax({
            url: "/live-class/enteruser",
            method: "post",
            type: "json",
            data: {
                _token: $('#csrf_token').val(),
                live_class_schedule_id: $("#live_class_schedule_id").val(),
                live_class_id : $("#live_class_id").val(),
                key: $("#registration_key").val(),
                rec_schedule : $("#rec_schedule_id").val(),
               // course_with_live : $("#course_with_live").val(),
            },
            beforeSend: function () {

            },
            complete: function () {

            },
            success: function (response) {
                if (response.success) {
                    $("a#enter-live-class-btn").attr("href",response.live_class_url);
                    $("a#enter-live-class-btn").removeClass("hide");
                    if($(".show-pwd.hide").length == 1) {
                        $("a#enter-live-class-btn").click();
                    }
                } else {
                    $('#error-message').css('display', 'block');
                    $('#error-message').html(response.message);
                    $('#error-message').fadeOut(20000);
                }
            },
            error: function (response) {
//                    alert("Sorry, please try again.")
            }
        });
        },

        ShowLiveClassEnterButtons: function () {
            if ($("#live-class-user").length > 0 && $("#live-class-user").val() == "co-host") {
                $("p#show-pwd").removeClass("hide");
                $("#enter-live-class-btn").removeClass("hide");
            } else if ($("#live-class-user").length == 0) {
                $("p#show-pwd").addClass("hide");
                $("#enter-live-class-btn").addClass("hide");
            }

            if ($("#enter-live-class-btn").length > 0 && $("#enter-live-class-btn").attr('href') == '#') {
                $("#enter-live-class-btn").removeClass("hide");
            }
        },

        FBTrackOnLiveClassReg:function(live_class_id){
            var email = '';
            var topic = '';
            $.ajax({
                url: APP_URL + "/getLiveClassDetails",
                method: "GET",
                type: "json",
                async:false,
                data: { id:live_class_id },
                success:function(response){
                    if (response.success){
                        email = response.mail;
                        topic = response.topic;
                    }
                }
            });
            fbq('trackCustom','Live Class Registration',{'Live Class':topic,'Email-Id':email});
        },

        checkLiveclassStartedorNot: function(startInterval) {
            $.ajax({
                url: "/live-class/checkstarted",
                method: "post",
                type: "json",
                data: {
                    _token: $('#csrf_token').val(),
                    live_class_schedule_id: $("#live_class_schedule_id").val(),
                    live_class_id: $("#live_class_id").val(),
                    key: $("#registration_key").val(),
                    live_recurring_id : ("undefined" != typeof ($('#rec_schedule_id').val())) ? $('#rec_schedule_id').val():'',
                    //course_with_live : ("undefined" != typeof ($('#course_with_live').val())) ? $('#course_with_live').val():0,

                },
                beforeSend: function () {

                },
                complete: function () {

                },
                success: function (response) {
                    if (response.success) {
                        clearInterval(startInterval);
                        window.location.reload();
                    } else {

                    }
                },
                error: function (response) {

                }
            });
        },
         ChangeButtonUrl:function(prcBtn,schedule_id) {
            var url = $(prcBtn).attr('href');
            var url = new URL(url);
            var search_params = url.searchParams;
            search_params.set('live_schedule_id', schedule_id);
            url.search = search_params.toString();
            var new_url = url.toString();
            var new_url_to_set = new_url.replace("\//", "/");
            $(prcBtn).attr('href',new_url_to_set);
        },
        loadSlider: function (e) {
        // e.preventDefault();
         // duration of scroll animation
        // duration of scroll animation
         var scrollDuration = 300;
         // paddles
         var leftPaddle = document.getElementsByClassName('left-paddle');
         var rightPaddle = document.getElementsByClassName('right-paddle');

         // get items dimensions
         var menuSize = 0;
         var itemsLength = $('.inline_nav li').each(function () {
             menuSize += $(this).outerWidth(true);
         });
         // get some relevant size for the paddle triggering point
         var paddleMargin = 20;
         var down = false;

         // get wrapper width
         var getMenuWrapperSize = function () {
             return $('.inline_nav_wrapper').outerWidth();
         }
         var menuWrapperSize = getMenuWrapperSize();
         // the wrapper is responsive
         $(window).on('resize', function () {
             menuWrapperSize = getMenuWrapperSize();
         });


         // get how much of menu is invisible
         var menuInvisibleSize = menuSize - menuWrapperSize;

         // get how much have we scrolled to the left
         var getMenuPosition = function () {
             return $('.inline_nav').scrollLeft();
         };

         // finally, what happens when we are actually scrolling the menu
         $('.inline_nav').on('scroll', function () {

             // get how much of menu is invisible
             menuInvisibleSize = menuSize - menuWrapperSize;
             // get how much have we scrolled so far
             var menuPosition = getMenuPosition();

             var menuEndOffset = menuInvisibleSize - paddleMargin;

             // show & hide the paddles
             // depending on scroll position
             if (menuPosition <= paddleMargin) {
                 $(leftPaddle).addClass('hidden');
                 $(rightPaddle).removeClass('hidden');
             } else if (menuPosition < menuEndOffset) {
                 // show both paddles in the middle
                 $(leftPaddle).removeClass('hidden');
                 $(rightPaddle).removeClass('hidden');
             } else if (menuPosition >= menuEndOffset) {
                 $(leftPaddle).removeClass('hidden');
                 $(rightPaddle).addClass('hidden');
             }

         });

         // scroll to left
         $(rightPaddle).on('click', function () {
             $('.inline_nav').animate({scrollLeft: $('.inline_nav').scrollLeft() + 150}, scrollDuration);
         });

         // scroll to right
         $(leftPaddle).on('click', function () {
             $('.inline_nav').animate({scrollLeft: $('.inline_nav').scrollLeft() - 150}, scrollDuration);
         });


         if (!is_touch_device()) {

             var nav_out_timer;
             $(".inline_nav").mousedown(function (e) {
                 e.preventDefault();
                 e.stopPropagation();
                 down = true;
                 x = e.pageX;
                 y = e.pageY;
                 left = $(this).scrollLeft();
             });

             $(".inline_nav_wrapper").mouseover(function (e) {
                 window.clearTimeout(nav_out_timer);
             });
             $(".inline_nav_wrapper").mouseout(function (e) {
                 nav_out_timer = window.setTimeout(function () {
                     down = false;
                 }, 100);
             });

             $("body").mousemove(function (e) {
                 if (down) {
                     var newX = e.pageX;
                     $(".inline_nav").scrollLeft(left - newX + x);
                 }
             });

             $(".inline_nav").on('mouseup', function (e) {
                 if (down) {
                     e.preventDefault();
                     e.stopPropagation();
                     down = false;
                 }
             });
             $(".inline_nav a").on('click', function (e) {
                 if (Math.abs(left - $(".inline_nav").scrollLeft()) !== 0) {
                     e.preventDefault();
                     e.stopPropagation();
                     e.stopImmediatePropagation();
                     return false;
                 }
             });
             $('.inline_nav a').each(function () {
                 // Cache event
                 var existing_event = this.onclick;

                 // Remove the event from the link
                 this.onclick = null;

                 // Add a check in for the class disabled
                 $(this).click(function (e) {
                     if ($(this).hasClass('disabled')) {
                         e.stopImmediatePropagation();
                         e.preventDefault();
                     }
                 });

                 // Reattach your original onclick, but now in the correct order
                 // if it was set in the first place
                 if (existing_event) {
                     $(this).click(existing_event);
                 }
             });


            }

            function is_touch_device() {
                return 'ontouchstart' in window        // works on most browsers
                        || navigator.maxTouchPoints;       // works on IE10/11 and Surface
            };
        }

};

$(live_class.ready);
