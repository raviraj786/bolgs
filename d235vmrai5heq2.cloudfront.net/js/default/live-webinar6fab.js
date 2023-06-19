var live_webinar = {
        ready: function() {
            live_webinar.InitializeCountDowns();
            $('body').off('click','#register-webinar-btn').on('click','#register-webinar-btn',live_webinar.ShowRegistrationPopup);
            $('body').off('submit','form[name="register-live-webinar"]').on('submit','form[name="register-live-webinar"]',live_webinar.RegisterWebinar);                        
//            $('body').off('click','#waiting-page-url-copy').on('click','#waiting-page-url-copy',live_webinar.CopyWebinarJoinURL);
            $('body').off('click','#enter-live-webinar-btn').on('click','#enter-live-webinar-btn',live_webinar.EnterUserIntoLiveWebinar);
            $('body').off('click','div.weblink#waiting-page-url').on('click','div.weblink#waiting-page-url',live_webinar.CopyWebinarJoinURL);
            
            $('body').off('click','.go-to-plans').on('click','.go-to-plans',function(){
                $('html, body').animate({ scrollTop: $('.zen_cs_plans_dynamic').offset().top }, 'slow');
            });
            
            $('#email').off('focus').on('focus', function(){
                $(this).closest('.email-outer').find('.contact-info-error-text').hide();
            });
            $('body').off('change', '#live_ms_schedules_select').on('change', '#live_ms_schedules_select', function(){
                var selectedText = $(this).val();
                 $("select#live_ms_schedules_select").val(selectedText);
                 live_webinar.setRegisterBtnUrl();
            });
            $("#zen-pick-date-list").on("click","a",function(e){
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
                         $('#live_webinar_schedule_id').val(key);
                         firstSessionDisplayText = display_text;
                     }i++;
                    li +='<li class="' + sel +' zen_picked_time_list" id="zen_picked_time" data-schedule-id="' + key +'" data-schedule-text="'+ display_text +'">'+
                              '<a href="#" style="color:black;text-decoration:none;"><span>'+ obj +'</span></a></li>';
                }
                $('#zen-time-pick-list').html();
                $('#zen-time-pick-list').html(li);
                $('#zen_schedule_text').html();
                $('#zen_schedule_text').html(firstSessionDisplayText);
                live_webinar.setRegisterBtnUrl();
            });
            
            $("#zen-time-pick-list").on("click","a",function(e){
                e.preventDefault();
                var li_time = $(this).parent();
                li_time.addClass("selected").siblings().removeClass("selected");
                var schedule_text = li_time.attr("data-schedule-text");
                $('#zen_schedule_text').html();
                $('#zen_schedule_text').html(schedule_text);
                live_webinar.setRegisterBtnUrl();
            });
            live_webinar.validateEmailInput();
            
        },
        
        InitializeCountDowns: function() {
            live_webinar.setRegisterBtnUrl();
            if($(".countdown#webinar-register-page-countdown").length > 0) {
                live_webinar.ShowRegistrationButton();
                $('#webinar-timer-block').show();
                $('.countdown').countEverest({
                    hour: $("#schedule_hour").val(),
                    minute:$("#schedule_minute").val(),
                    day: $("#schedule_day").val(),
                    month: $("#schedule_month").val(),
                    year: $("#schedule_year").val(),
                    timeZone: Number($("#schedule_timezone").val()),
                    onComplete: function () {
                        $('#webinar-timer-block').hide();
                        $('.countdown').hide();
                    }
                });
            }
            
            if($("#waiting-page-countdown").length > 0) {
                live_webinar.ShowWebinarEnterButtons();
                $('#webinar-timer-block').show();
                $('.countdown').countEverest({
                    hour: $("#schedule_hour").val(),
                    minute:$("#schedule_minute").val(),
                    day: $("#schedule_day").val(),
                    month: $("#schedule_month").val(),
                    year: $("#schedule_year").val(),
                    timeZone: Number($("#schedule_timezone").val()),
                    onComplete: function () {
                        $("p#show-pwd").removeClass("hide");                        
                        $('.countdown').hide();
                        $('#webinar-timer-block').hide();
                        $("#presenter-not-joined").removeClass("hide");
                        if($("#webinar-user").length > 0 && $("#webinar-user").val() == "attendee") {
                            $("p#show-pwd").removeClass("hide");
                            $("#enter-live-webinar-btn").removeClass("hide");
                        }                        
//                          to check admin started webinar in every seconds, after timer hits to zero
                        if($("#presenter-not-joined").length > 0) {
                            var startInterval = setInterval(function () {
                                live_webinar.checkLiveWebinarStartedorNot(startInterval);
                            }, 30000);
                        }
                    }
                });                
            }
        },
        
        setRegisterBtnUrl : function (){
            if (! $('#zen_wb_popup_btn_dynamic').length > 0 ){
               $('.zen_wb_btn_div').closest('div.page').find('div.zenler-plan-type-4-outr').remove();
               //return; 
            }
            //if live webinar has multiple schedules,get the selected webinar schedule id
            var schedule_id = 0;
            var schedule_date = "";
            if ($('input[name="live_multiple_schedules"]').val() == 1){
                if($("#live_ms_schedules_select").length > 0){
                    schedule_id = $("#live_ms_schedules_select").find(":selected").val();
                    schedule_date = $("#live_ms_schedules_select").find(":selected").text(); 
                    $('#live_webinar_schedule_id').val(schedule_id);
                }else if($('#zen-pick-date-list').length > 0){
                     schedule_id = $('#zen-time-pick-list ').find("li.selected").attr("data-schedule-id");
                     $('#live_webinar_schedule_id').val(schedule_id);
                     schedule_date = $('#zen-time-pick-list ').find("li.selected").attr("data-schedule-text");
               }
                var reg_filled_webinars = $('#reg_filled_webinars').val();
                reg_filled_webinars = JSON.parse(reg_filled_webinars);
                document.getElementById('zen_wb_popup_btn_dynamic').removeAttribute("disabled");
                $('#zen_wb_popup_btn_dynamic').prop("disabled", false).click(function() {
                            console.log('not Disabled...');
                });
                $('#reg_filled_webinar_error_msg').addClass("hide");
                
                if(reg_filled_webinars.some(function(el){
                    if(el == schedule_id){
                       // $('#zen_wb_popup_btn_dynamic').addClass("hide");
                        document.getElementById('zen_wb_popup_btn_dynamic').setAttribute("disabled","disabled");
                        $('#zen_wb_popup_btn_dynamic').prop("disabled", false).click(function() {
                            console.log('not Disabled...');
                        });
                        $('#reg_filled_webinar_error_msg').removeClass("hide");
                    }
                }));
               
            }
            //if live webinar checkout page, remove register popup (email field conflict while login)
            if ($('input[name="lc-chk-page"]').val() == 1){
                $('#zenPopupModal').remove();
            }
            var slug = $("#live_webinar_slug").val()
            var outer = $('div.zen_wb_btn_div');
            var live_webinar_url = "/live-webinar/" + slug + "/buy";
            var coupon = site.getParameterByName('coupon', window.location.href);
            
            if (coupon != '' && coupon != null && schedule_id > 0){
                live_webinar_url = live_webinar_url + '?coupon=' + coupon + '&live_schedule_id=' + schedule_id;
            }else if(coupon != '' && coupon != null){
                live_webinar_url = live_webinar_url + '?coupon=' + coupon ;
            }else if(schedule_id > 0){
                live_webinar_url = live_webinar_url + '?live_schedule_id=' + schedule_id;
            }
            if (schedule_id > 0) {
                if ($('#zenPopupModal .zen-custom-form #live_webinar_schedule_id_popup').length > 0)
                {
                    $('#zenPopupModal .zen-custom-form #live_webinar_schedule_id_popup').val(schedule_id);
                } else {
                    $('#zenPopupModal .zen-custom-form').append("<input type='hidden' id='live_webinar_schedule_id_popup' value='" + schedule_id + "'>");
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
            if ($('input[name="live_pl_cnt"]').length == 0){ //for old blocks/live classes
                show_pop_up = true;
            }else{
                var reg_popup = $('input[name="live_reg_pop"]').val();
                if (reg_popup == 1){
                    show_pop_up = true;
                }
                if (!show_pop_up){
                    var plan_count = $('input[name="live_pl_cnt"]').val();
                    if (plan_count == 0){ //if price is hidden or no plans are added, go to support
                        url = "/support";
                        $("#zen_wb_popup_btn_dynamic").attr('href', url);
                        $('div.zenler-plan-type-4-outr').remove();
                    }else if (plan_count == 1){
                        url = live_webinar_url ;
                        $("#zen_wb_popup_btn_dynamic").attr('href', url);
                        if(schedule_id > 0 && $('.zen_cs_plans_dynamic').length > 0){
                            var priceBtn = $('.pricebutton');  
                            live_webinar.ChangeButtonUrl(priceBtn,schedule_id);
                        }
                    }else if (plan_count > 1){
                        if ($('.zen_cs_plans_dynamic').length > 0) {
                            $("#zen_wb_popup_btn_dynamic").attr('href', '#');
                            $("#zen_wb_popup_btn_dynamic").addClass('go-to-plans');
                             if(schedule_id > 0){
                                var priceButtons = document.querySelectorAll('.pricebutton.dynamic-button');
                                for(var i =0;i<priceButtons.length;i++){
                                    var prBtn = priceButtons[i];
                                    live_webinar.ChangeButtonUrl(prBtn,schedule_id);
                                }
                            }
                        } 
                    }
                }else{
                    $('div.zenler-plan-type-4-outr').remove();

                }
            }
        },
        
        ShowRegistrationButton: function() {
            if($("input.show-webinar-registration-btn").length > 0 && $("input.show-webinar-registration-btn").val()) {
                $("button.webinar-registration-btn").removeClass('hide');
            } else {
                $("button.webinar-registration-btn").addClass('hide');
            }
        },
        
        ShowRegistrationPopup: function() {
            var webinar_id = $("#live_webinar_id").val();
            $('#webinar_id').val(webinar_id);
            var schedule_id = $("#live_webinar_schedule_id").val();
            $('#schedule_id').val(schedule_id);
            $('#register-live-webinar').modal('toggle');
            $(".register-error-block").html('');
            $(".register-error-block").css('padding', '0px');
            $(".register-textbox").val("");
        },
        
        RegisterWebinar: function(e) {
            e.preventDefault();
            var slug = $("#live_webinar_slug").val();
            $.ajax({
                url: "/live-webinar/"+slug+"/register",
                method: "POST",
                type: "json",
                data: $(this).serialize(),
                beforeSend: function () {
                    
                },
                complete: function () {

                },
                success: function (response) {
                    if (response.status) {
                        window.location = response.redirect_url;
                    } else {
                        site.notifyError(response.msg);
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
        
        EnterUserIntoLiveWebinar: function() {            
            var webinar_id = $("#live_webinar_id").val();
            var schedule_id = $("#live_webinar_schedule_id").val();
            var reg_key = $("#registration_key").val(); 
            var token = $("#csrf_token").val();
            var rec_schedule = $("#rec_schedule_id").val();
            $.ajax({
                url: "/live-webinar/"+webinar_id+"/enteruser",
                method: "POST",
                type: "json",
                data: {   
                    _token : token,
                    webinar_id: webinar_id,
                    schedule_id : schedule_id,
                    reg_key: reg_key,
                    rec_schedule : rec_schedule
                },
                beforeSend: function () {

                },
                complete: function () {

                },
                success: function (response) {
                    if (response.success) {
                        $("a#enter-live-webinar-btn").attr("href",response.live_webinar_url);
                        $("a#enter-live-webinar-btn").removeClass("hide");                        
                    }
                },
                error: function (response) {
    //                    alert("Sorry, please try again.")
                }
            });                      
        },
        
        CopyWebinarJoinURL: function(e) {
            e.preventDefault();
            var copyText = $("div.weblink#waiting-page-url").html();
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
        
        ShowWebinarEnterButtons: function() {
            if($("#webinar-user").length > 0 && $("#webinar-user").val() == "co-host") {
                $("p#show-pwd").removeClass("hide");                                
                $("#enter-live-webinar-btn").removeClass("hide");
            }else if($("#webinar-user").length == 0){
                $("p#show-pwd").addClass("hide");                                
                $("#enter-live-webinar-btn").addClass("hide");
            }
            
            if($("#enter-live-webinar-btn").length > 0 && $("#enter-live-webinar-btn").attr('href') == '#') {
                $("#enter-live-webinar-btn").removeClass("hide");
            }
        },
        
        checkLiveWebinarStartedorNot: function(startInterval) {
            var webinar_id = $("#live_webinar_id").val();
            var schedule_id = $("#live_webinar_schedule_id").val();
            var reg_key = $("#registration_key").val(); 
            var token = $("#csrf_token").val();
            $.ajax({
                url: "/live-webinar/checkstarted",
                method: "post",
                type: "json",
                data: {
                    _token : token,
                    webinar_id: webinar_id,
                    schedule_id : schedule_id,
                    reg_key: reg_key,
                    webinar_recurring_id : ("undefined" != typeof ($('#rec_schedule_id').val())) ? $('#rec_schedule_id').val():'',
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
        validateEmailInput : function (){
            var contact_outer = $('div.contact-info');
            //contact_outer.find('input#email:visible').on("blur","input#email:visible",function(){
            contact_outer.find('input#email:visible').on('blur', function(e) {
                /* for webinars email to be validated, login not required */
                var email = contact_outer.find('input#email').val();
                var p_type = 1;
                if (contact_outer.closest('form').find('input[name="product-type"]').length > 0){
                    p_type = contact_outer.closest('form').find('input[name="product-type"]').val();
                    if (p_type == 4){
                        $.ajax({
                            url: APP_URL + "/check-email",
                            method: "POST",
                            type: "json",
                            data: contact_outer.closest('form').serialize(),
                            beforeSend : function(){
                                //site.blockElement(contact_outer);
                            },
                            complete   : function(){
                                //site.unblockElement(contact_outer);
                            },
                            success:function(response){
                                if (response.success){
                                    contact_outer.find('input[name="cu_id"]').val(1);
                                    if (paypalpay.paypal_verified == 1){
                                        paypalpay.initPaypal();
                                    }
                                }else{
                                    contact_outer.find('input[name="cu_id"]').val(0);
                                    var errors = response.messages;
                                    var error = '';
                                    //site.listErrors(errors, $('span.contact-info-error-text'));
                                    $.each( errors, function( key, value ) {
                                        error += '<span class="contact-info-error-text text-danger">'+value+'</span>';
                                    });
                                    contact_outer.find('div.err-msg').html(error);
                                    contact_outer.find('div.email-outer').addClass("has-error");
                                }
                                
                            },
                            error: function(response){
                                
                            }
                        });
                        /*if (!site.validateEmail(email, '.contact-info-error-text')){
                            contact_outer.find('input[name="cu_id"]').val(0);
                        }else{
                            contact_outer.find('input[name="cu_id"]').val(1);
                            if (paypalpay.paypal_verified == 1){
                                paypalpay.initPaypal();
                            }
                        }*/
                    }
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
        }
        
        
        
};

$(live_webinar.ready);
