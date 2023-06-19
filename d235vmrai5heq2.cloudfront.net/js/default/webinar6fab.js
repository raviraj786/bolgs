var webinar = {
    ready: function () {
        webinar.loadRegistrationPage();
        webinar.loadWaitingPage();

        $('body').off('click', '#show-registration-popup-btn').on('click', '#show-registration-popup-btn', webinar.showRegistrationPopup);
        $('body').off('submit', 'form[name="register-live-webinar-form"]').on('submit', 'form[name="register-live-webinar-form"]', webinar.registerUser);
        $('body').off('click', '#ni-waiting-page-url').on('click', '#ni-waiting-page-url', webinar.copyWaitingPageURL);
        $('body').off('click','#ni-enter-live-webinar-btn').on('click','#ni-enter-live-webinar-btn',webinar.EnterUserIntoWebinar);
        $('body').off('change', 'select#live_ms_schedules_select').on('change', 'select#live_ms_schedules_select', function(){
            var selectedText = $(this).val();
             $("select#live_ms_schedules_select").val(selectedText);
                 webinar.setRegisterBtnUrl();
        });
        $("#ni-zen-pick-date-list").on("click","a",function(e){
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
                    li +='<li class="' + sel +' ni_zen_picked_time_list" id="zen_picked_time" data-schedule-id="' + key +'" data-schedule-text="'+ display_text +'">'+
                              '<a href="#" style="text-decoration:none;" class="t6-zen-list-times"><span>'+ obj +'</span></a></li>';
                }
                $('#ni-zen-time-pick-list').html();
                $('#ni-zen-time-pick-list').html(li);
                $('#ni_zen_schedule_text').html();
                $('#ni_zen_schedule_text').html(firstSessionDisplayText);
                webinar.setRegisterBtnUrl();
            });
            
            $("#ni-zen-time-pick-list").on("click","a",function(e){
                e.preventDefault();
                var li_time = $(this).parent();
                li_time.addClass("selected").siblings().removeClass("selected");
                var schedule_text = li_time.attr("data-schedule-text");
                $('#ni_zen_schedule_text').html();
                $('#ni_zen_schedule_text').html(schedule_text);
                webinar.setRegisterBtnUrl();
            });
           
        },

    loadRegistrationPage: function () {
        webinar.setRegisterBtnUrl();
        if ($("#ni-webinar-register-page-countdown").length > 0) {
            webinar.initializeRegisterPageCountDown();
        }
    },

    initializeRegisterPageCountDown: function () {console.log("Here");
        $('.countdown').countEverest({
            hour: $("#schedule_hour").val(),
            minute: $("#schedule_minute").val(),
            day: $("#schedule_day").val(),
            month: $("#schedule_month").val(),
            year: $("#schedule_year").val(),
            timeZone: Number($("#schedule_timezone").val()),
            onComplete: function () {
                $('#webinar-timer-block').hide();
                $('.countdown').hide();
            }
        });
    },

    showRegistrationPopup: function (e) {
        e.preventDefault();
        var webinar_id = $("#webinar_id").val();
        $('#register-live-webinar-popup-container #webinar_id').val(webinar_id);
        var schedule_id = $("#webinar_schedule_id").val();
        $('#register-live-webinar-popup-container #schedule_id').val(schedule_id);
        $('#register-live-webinar-popup-container').modal('toggle');
        $(".register-error-block").html('');
        $(".register-error-block").css('padding', '0px');
        $(".registration-text-box").val("");
    },

    registerUser: function (e) {
        e.preventDefault();
        var slug = $("#webinar_slug").val();
        $.ajax({
            url: "/webinar/" + slug + "/register",
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

                    $("#login-live-class .login-error-block").html(response.msg);
                    $("#login-live-class .login-error-block").css("padding", "0px 20px");
                    $("#login-live-class .login-error-block").css("padding-top", "15px");
                    return;
                }
            },
            error: function (response) {
//                    alert("Sorry, please try again.")
            }
        });
    },

    copyWaitingPageURL: function (e) {console.log("Copy URL")
        e.preventDefault();
        var copyText = $("div.weblink#ni-waiting-page-url").html();
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

    loadWaitingPage: function () {
        if ($("#ni-waiting-page-countdown").length > 0) {
            webinar.initializeWaitingPageCountDown();
        }
    },

    initializeWaitingPageCountDown: function () {
         webinar.ShowWebinarEnterButtons();
        $('.countdown').countEverest({
            hour: $("#schedule_hour").val(),
            minute: $("#schedule_minute").val(),
            day: $("#schedule_day").val(),
            month: $("#schedule_month").val(),
            year: $("#schedule_year").val(),
            timeZone: Number($("#schedule_timezone").val()),
            onComplete: function () {
                webinar.waitingPageTimerOnCompleteActions();
            }
        });
    },

    waitingPageTimerOnCompleteActions: function () {
        $("p#show-pwd").removeClass("hide");
        $('.countdown').hide();
        $('#webinar-timer-block').hide();
        $("#presenter-not-joined").removeClass("hide");
        if ($("#webinar-user").length > 0 && $("#webinar-user").val() == "attendee") {
            $("p#show-pwd").removeClass("hide");
            $("#ni-enter-live-webinar-btn").removeClass("hide");
        }
        // to check admin started webinar in every seconds, after timer hits to zero
        if ($("#presenter-not-joined").length > 0) {
            var startInterval = setInterval(function () {
                webinar.checkWebinarStartedorNot(startInterval);
            }, 30000);
        }
    },
    checkWebinarStartedorNot: function(startInterval) {
            var webinar_id = $("#live_webinar_id").val();
            var schedule_id = $("#live_webinar_schedule_id").val();
            var reg_key = $("#registration_key").val(); 
            var token = $("#csrf_token").val();
            var webinar_recurring_id =  $('#rec_schedule_id').val();
            $.ajax({
                url: "/webinar/checkstarted",
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
         EnterUserIntoWebinar: function() {            
            var webinar_id = $("#live_webinar_id").val();
            var schedule_id = $("#live_webinar_schedule_id").val();
            var reg_key = $("#registration_key").val(); 
            var token = $("#csrf_token").val();
            var rec_schedule = $("#rec_schedule_id").val();
            $.ajax({
                url: "/webinar/"+webinar_id+"/enteruser",
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
                        $("a#enter-webinar-btn").attr("href",response.live_webinar_url);
                        $("a#enter-webinar-btn").removeClass("hide");                        
                    }
                },
                error: function (response) {
    //                    alert("Sorry, please try again.")
                }
            });                      
        },
        ShowWebinarEnterButtons: function() {
            if($("#webinar-user").length > 0 && $("#webinar-user").val() == "co-host") {
                $("p#show-pwd").removeClass("hide");                                
                $("#ni-enter-live-webinar-btn").removeClass("hide");
            }else if($("#webinar-user").length == 0){
                $("p#show-pwd").addClass("hide");                                
                $("#ni-enter-live-webinar-btn").addClass("hide");
            }
            
            if($("#ni-enter-live-webinar-btn").length > 0 && $("#ni-enter-live-webinar-btn").attr('href') == '#') {
                $("#ni-enter-live-webinar-btn").removeClass("hide");
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
                }else if($('#ni-zen-pick-date-list').length > 0){
                     schedule_id = $('#ni-zen-time-pick-list ').find("li.selected").attr("data-schedule-id");
                     $('#live_webinar_schedule_id').val(schedule_id);
                     schedule_date = $('#ni-zen-time-pick-list ').find("li.selected").attr("data-schedule-text");
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
                        document.getElementById('zen_wb_popup_btn_dynamic').setAttribute("disabled","disabled");
                        $('#zen_wb_popup_btn_dynamic').prop("disabled", true).click(function() {
                            console.log('Disabled...');
                        });
                        $('#reg_filled_webinar_error_msg').removeClass("hide");
                    }
                }));
               
            }
            if(schedule_id > 0){
                if($('#zenPopupModal .zen-custom-form #live_webinar_schedule_id_popup').length>0)
                {
                    $('#zenPopupModal .zen-custom-form #live_webinar_schedule_id_popup').val(schedule_id);
                }else{
                    $('#zenPopupModal .zen-custom-form').append("<input type='hidden' id='live_webinar_schedule_id_popup' value='"+schedule_id+"'>");
                }

                if($('#zenPopupModal .popup-section2 #schedule_date_div').length>0)
                {
                    $('#zenPopupModal .popup-section2 #schedule_date_div #schedule_date_text ').html(schedule_date);
                }else{
                     $('<div id="schedule_date_div"><p id="schedule_date_text"> ' + schedule_date + '</p></div>').insertBefore('.zen-custom-form');
                }
            }
        },
};
$(webinar.ready);