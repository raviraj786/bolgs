var site = {
    ready: function (){
        $('.zbv-blog-05 h1, .zbv-blog-05 h2, .zbv-blog-05 h3, .zbv-blog-05 h4, zbv-blog-05 h5, .zbv-blog-05 h6').addClass('dynamic-heading');
        $('.zbv-blog-05 a').addClass('dynamic-link');
        $('.zbv-blog-05 p').addClass('dynamic-text');
        $('.zbv-blog-04 h1, .zbv-blog-04 h2, .zbv-blog-04 h3, .zbv-blog-04 h4, zbv-blog-04 h5, .zbv-blog-04 h6').addClass('dynamic-heading');
        $('[data-toggle="tooltip"]').tooltip();
        $('.navbar-header').closest('.container').css('position', 'relative');//For mobile issue in notification

        $('#communityPopup').on('hide.bs.modal', function (e) {
            $('.navbar-collapse').css('display', 'none');
        });
        if ($('.jqCommunity').length > 0) {
           $('body').off('click','.jqCommunity').on('click','.jqCommunity' , site.loadCommunity);
           $('#communityPopup').on('hide.bs.modal', function (e) {
                $('.modal .modal-dialog').attr('class', 'modal-dialog  zoomOut  animated');
           })
        }
        if ($('#jqSingleCommunityIframe').length > 0) {
           $('#jqSingleCommunityIframe').closest('div.col-md-12').css({
               'margin': 0,
               'padding': 0,
               'display': 'block',
               'padding-top': '20px',
               'background': '#fbfbfb'
           });
           $('#jqSingleCommunityIframe').closest('div#page').find('#header5').css({
               'border-bottom': 0,
           });
           site.loadCommunityHome();
        }
        if ($('#jqCommunityNotificationsIframe').length > 0) {
            $('#jqCommunityNotificationsIframe').closest('div.col-md-12').css({
               'margin': 0,
               'padding': 0,
               'display': 'block',
               'padding-top': '20px',
               'background': '#fbfbfb'
           });
           $('#jqCommunityNotificationsIframe').closest('div#page').find('#header5').css({
               'border-bottom': 0,
           });
           site.loadUserNotification();
        }
        //if ($('.jqSingleCommunity').length > 0) {
        $('html').click(function(e) {
            if(!$(e.target).closest('.jqNoficationBox').length > 0 )
            {
                $('.jqNoficationBox').remove();
                $('.jqIframeShadow').remove();
            }
            if ($('.jqIframeShadow').length > 0) {
                $('.jqIframeShadow').remove();
            }
         }); 
    
        /*$('iframe').click(function(e) {    alert('rjrj')
            if(!$(e.target).closest('.jqNoficationBox').length > 0 )
            {
                $('.jqNoficationBox').remove();
            }
         }); */

           $('body').off('click','.jqSingleCommunityLoad').on('click','.jqSingleCommunityLoad' , site.loadSingleCommunity);
          // $('body').off('click','.jqGetAllNotifications').on('click','.jqGetAllNotifications' , site.loadUserNotification);
       //}
        if ($('.jqCommunityHome').length > 0) {
           $('body').off('click','.jqCommunityHome').on('click','.jqCommunityHome' , site.loadCommunityHome);
           $('#communityPopup').on('hide.bs.modal', function (e) {
                $('.modal .modal-dialog').attr('class', 'modal-dialog  zoomOut  animated');
           })
        }

        if ($('.jqNotification').length > 0) {
           $('body').off('click','.jqNotification').on('click','.jqNotification' , site.loadCommunityNotifications);
           $('body').off('click','.jqMarkRead').on('click','.jqMarkRead' , site.markNotificationRead);
           $('body').off('click','.jqMarkAllAsRead').on('click','.jqMarkAllAsRead' , site.markAllNotificationsRead);
            $('body').off('click','.jqDeleteNotification').on('click','.jqDeleteNotification' , site.deleteNotification);
            $('body').off('mouseenter','.jqSingleCommunity').on('mouseenter','.jqSingleCommunity' , function() {
                $(this).find('.zen-mini-menu label').css({opacity:1});
            });
            $('body').off('mouseleave','.jqSingleCommunity').on('mouseleave','.jqSingleCommunity' , function() {
                $(this).find('.zen-mini-menu label').css({opacity:0.2});
            });
            $('body').off('click','.jqNotificationList .zc-icon-more-h').on('click','.jqNotificationList .zc-icon-more-h' , function() {
                //$('.jqNotificationList .mini-dropdown').hide();
                if ($(this).closest('.zen-mini-menu').find('.mini-dropdown').is(':visible')) {
                    $(this).closest('.zen-mini-menu').find('.mini-dropdown').hide();
                } else {
                    $(this).closest('.zen-mini-menu').find('.mini-dropdown').show();
                }
                return false;
            });
        }
        site.course_player_url = '';
        // var isEuCountry = site.detectAndCheckEuCountry();
        //alert('isEuCountry');
        if (typeof manageElements !== 'undefined' && typeof manageElements.isEu !== 'undefined' && manageElements.isEu) {
            if ($('.zen-signup form[name=signup_form]').length > 0) {
                $('.gdprSignupCheckbox').show();
            }
            if ($('form[name=signup_form] input[name=gdpr]').length > 0) {
               $('form[name=signup_form] input[name=gdpr]').prop('checked', false);
            }
            if ($('form[name=optin-form] input[name=gdpr]').length > 0) {
               $('form[name=optin-form] input[name=gdpr]').prop('checked', false);
            }
            if(site.getCookie('show_cookie_message') != 'no')
            {
                $('#cookie_box').show();
            }

            $('.cookie_box_close').click(function()
            {
                $('#cookie_box').animate({opacity:0 }, "slow");
                site.setCookie('show_cookie_message','no');
                return false;
            });
        } else {
           if ($('form[name=signup_form] input[name=gdpr]').length > 0) {
               $('form[name=signup_form] input[name=gdpr]').closest('div.checkbox').hide();
               //$('form[name=signup_form] input[name=gdpr]').prop('checked', true);
           }
           if ($('form[name=optin-form] input[name=gdpr]').length > 0) {
               $('form[name=optin-form] input[name=gdpr]').closest('div.checkbox').hide();
               //$('form[name=optin-form] input[name=gdpr]').prop('checked', true);
           }
       }
        //alert($(window).width());
        if ($(window).width() <= 768) {
            if ($('.jqLoginLogout').length > 0) {
                $('.jqLoginLogout').insertAfter($('.navbar-buttons').last());
            }
        }
        //$('body').on("change", "#role", site.getPermissions);
        $('body').on('click', '.delete-button', site.confirmDelete);
        $('body').on('change', '.image-preview', site.showImagePreview)
        $('body').on('click', 'button.cancel-subscription', site.confirmSubscriptionCancel);
        $('body').on('click', 'button.update-pwd', site.updatePassword);
        $('body').on('click', 'button.update-name', site.updateName);
        $('body').on('click', 'div.bundle-plan', site.showCoursePlans);
        $('body').on('change', 'select[name="categories"]', site.showCourseByCategory);
        $('body').on('change', 'select[name="blog-categories"]', site.showBlogByCategory);
        //$('body').on('click', 'button.search-course', site.searchCourse);
        $('body').off('submit','form[name=search]').on('submit','form[name=search]' , site.searchCourse);
        $('body').off('submit','form[name=blog-search]').on('submit','form[name=blog-search]' , site.searchBlog);
        $('body').off('focus','.form-control-error').on('focus','.form-control-error' , site.removeErrorMsg);
        $('body').off('click','.btn-enroll').on('click','.btn-enroll' , site.enrollInCourse); //when enroll in course is clicked from course sales page.
        $('body').off('click','a.continue-to-course').on('click','a.continue-to-course' , site.completeRegistration); //reg pop up only on user click continue course button
        $('body').off('click','a.cs_upsell_continue').on('click','a.cs_upsell_continue' , site.completeRegistration); //reg pop up only on user click continue course button

        $('body').off('click', 'span.daterange-icon').on('click', 'span.daterange-icon', function(){
            $(this).closest('div').find('input.date-picker').trigger('click');
        });
        $('a.site-menu').click(function () { //for student side billing menu not visible issue in mobile mode
            if($('.side-menu').css('left') != '-240px'){
                $(".side-menu").css('left', '-240px');
            }
            else{
                $(".side-menu").css('left', '0px');
            }
        });

        site.checkUpsellBlock();
        //site.myAccountsActiveTab();

        /*$( "input#search" ).keyup(function(e) {
            e.preventDefault();
            if (e.keyCode === 13) {
                site.searchCourse();
            }

        });*/

        site.setLoginRedirectUrl();
        site.page = 1;site.featuredpage = 1;site.mycoursepage = 1;site.livelistpage =1;site.livegridpage=1;site.webinarlistpage=1;site.webinargridpage=1;
        if ($('div.all-blogs').length > 0){
            site.loadMoreCourses($('div.all-blogs'), '/getblogs', total_blogs, $('a.allblog'));
        }
        if ($('div.all-courses').length > 0){
            site.loadMoreCourses($('div.all-courses'), '/getcourses', total_courses, $('a.allcourse'));
        }
        if ($('div.enrolled-courses').length > 0){
            site.loadMoreCourses($('div.enrolled-courses'), '/getmycourses',total_enrolled_courses, $('a.mycourse'));
        }
        if ($('div.featured-courses').length > 0){
            site.loadMoreCourses($('div.featured-courses'), '/getfeaturedcourses', total_featured_courses, $('a.featuredcourse'));
        }
        if ($('div.upcoming-live-classes-list-view').length > 0){
            site.loadMoreCourses($('div.upcoming-live-classes-list-view'), '/getliveclasses/list_type', total_live_classes, $('a.upcomingliveclassesListView'));
        }
        if ($('div.upcoming-live-classes-grid-view').length > 0){
            site.loadMoreCourses($('div.upcoming-live-classes-grid-view'), '/getliveclasses/grid_type', total_live_classes, $('a.upcomingliveclassesGridView'));
        }
        if ($('div.upcoming-webinars-list-view').length > 0){
            site.loadMoreCourses($('div.upcoming-webinars-list-view'), '/getlivewebinars/list_type', total_live_webinars, $('a.upcominglivewebinarsListView'));
        }
        if ($('div.upcoming-webinars-grid-view').length > 0){
            site.loadMoreCourses($('div.upcoming-webinars-grid-view'), '/getlivewebinars/grid_type', total_live_webinars, $('a.upcominglivewebinarsGridView'));
        }


        site.showEUGdprPopup();
        //site.showEUGdprConsentPopup();
        site.toggleCurriculumSections();
        site.completeRegistration();
        site.showFooterLogo();

        site.autoHeight();
        site.onfbhashchange();
        setTimeout(function(){
            site.getUpcomingLiveClassNotification();
        },2000);
      //  site.getUpcomingLiveClassNotification();
        /* If curriculum block is empty HIDE the "Course Curriculum" Heading*/
        //site.hideCurriculumBlockTitle();
        /* If pricing plan block is empty HIDE the "Course Pricing" Heading*/
        //site.hidePricingBlockTitle();

        /*$('input#search').on('keyup keypress', function(e) {
            if (e.type == "keypress"){
                var key = e.which;
                if(key == 13){
                    site.searchCourse();
                }
            }else{
                site.searchCourse();
            }

        });*/
        
        $('body').off("click", "#trainee-back-btn").on("click", "#trainee-back-btn", function (e) {
            window.history.back();
        }); 
        //$('body').off("submit", "form.jqZenlrContactForm").on("submit", "form.jqZenlrContactForm", site.validateSupportForm); 
        $('body').off("focus", "form.jqZenlrContactForm").on("focus", "form.jqZenlrContactForm", function() {
            var current = $(this);
            current.find('#message').css('border', '1px solid #e4e4e4');
            return false;
        }); 
        $('body').off("click", "a.load-more").on("click", "a.load-more", site.loadMoreButton); 
        $('body').off('submit','form[name=search-live-class]').on('submit','form[name=search-live-class]' , site.searchLiveclass);
        $('body').off('click','.register-now-btn').on('click','.register-now-btn' , site.checkuserloggedin);
        $('body').off('submit','form[name="live-class-login-popup"]').on('submit','form[name="live-class-login-popup"]',site.LoginLiveClass);        
        $('body').off('submit','form[name="register-live-webinar-popup"]').on('submit','form[name="register-live-webinar-popup"]',function(e) {
            e.preventDefault();
            var webinar_id = $(this).find("#webinar_id").val();
            var schedule_id = $(this).find("#schedule_id").val();
            var formData = $(this).serialize();
            site.registerWebinar(webinar_id, schedule_id, formData);
            
        });
        $('body').off('submit','form[name=search-webinar]').on('submit','form[name=search-webinar]' , site.searchWebinar);
        
        if($("div.upcoming-live-classes-countdown").length > 0) {
            $("div.upcoming-live-classes-countdown").each(function () {
                var live_class_id = $(this).find("#live_class_id").val();
                var schedule_id = $(this).find("#schedule_id").val();
                $(this).countEverest({
                    hour: $(this).find("#schedule_hour").val(),
                    minute: $(this).find("#schedule_minute").val(),
                    day: $(this).find("#schedule_day").val(),
                    month: $(this).find("#schedule_month").val(),
                    year: $(this).find("#schedule_year").val(),
                    timeZone: Number($(this).find("#schedule_timezone").val()),
                    onComplete: function () {
                        site.checkLiveclassStarted(live_class_id, schedule_id);
                    }
                });
            });
        }
        
        if($("div.upcoming-webinars-countdown").length > 0) {
            $("div.upcoming-webinars-countdown").each(function () {
                var webinar_id = $(this).find("#webinar_id").val();
                var schedule_id = $(this).find("#schedule_id").val();
                $(this).countEverest({
                    hour: $(this).find("#schedule_hour").val(),
                    minute: $(this).find("#schedule_minute").val(),
                    day: $(this).find("#schedule_day").val(),
                    month: $(this).find("#schedule_month").val(),
                    year: $(this).find("#schedule_year").val(),
                    timeZone: Number($(this).find("#schedule_timezone").val()),
                    onComplete: function() {
                        site.checkWebinarStarted(webinar_id, schedule_id);
                    }
                });
            });
        }        
        $('body').off('click','.update_consent_status').on('click','.update_consent_status',site.updateEuGdprStatus);
        $('body').off('click','.upcoming-block-copy-url-btn').on('click','.upcoming-block-copy-url-btn',site.copyWaitingPageUrl);
        
        $('body').off('click','#live_not_going').on('click','#live_not_going',site.updateNotGoingLiveStatus);
        $('body').off('click','#register_live_class').on('click','#register_live_class',site.registerUserToLiveClass);
        $('body').off('click','#close-popup').on('click','#close-popup',site.closeUpcomingLiveNotification);
        $('body').off('click','#join_class_now').on('click','#join_class_now',site.joinLiveClassNow);

    },
    /*validateSupportForm: function () {
        var current = $(this);
        var comment = $.trim(current.find('#message').val());
        if ('' == comment) {
            //site.notifyErrorMain('Please enter your comment');
            current.find('#message').css('border', '1px solid #fb0505');
            return false;
        }
    },*/
    detectAndCheckEuCountry: function() {
        var isEuCountry = false;
        $.ajax({
            url: APP_URL + "/detect-check-eu-country",
            method: "GET",
            type: "json",
            async: false,
            success:function(response){
                response;
                if (response.success){
                    isEuCountry = response.eu_country;
                }
            },
            error: function(response){
               return false;
            }
        });
        return isEuCountry;
    },
    setCookie: function(cookie_name, value) {
       var exdate = new Date();
       exdate.setDate(exdate.getDate() + (365*25));
       document.cookie = cookie_name + "=" + escape(value) + "; expires="+exdate.toUTCString() + "; path=/";
    },
    getCookie: function(cookie_name) {
        if (document.cookie.length > 0)
        {
           cookie_start = document.cookie.indexOf(cookie_name + "=");
            if (cookie_start != -1)
            {
               cookie_start = cookie_start + cookie_name.length+1;
               cookie_end = document.cookie.indexOf(";",cookie_start);
               if (cookie_end == -1)
               {
                   cookie_end = document.cookie.length;
               }
               return unescape(document.cookie.substring(cookie_start,cookie_end));
            }
        }
       return "";
    },
    setLoginRedirectUrl : function (){
        var redirect = $('input[name="hid-redirect"]');
        redirect.val(redirect.val() + window.location.hash);

        $('#redirecturl').val($('#redirecturl').val() + window.location.hash);
    },
    confirmDelete : function (){
        if (confirm('Are you sure you want to delete?')) {
           return true;
        }
        else {
           return false;
        }
    },
    showImagePreview : function (){
        var file    = document.querySelector('input[type=file]').files[0];
        if (file) {
            var readerObj = new FileReader();
            readerObj.onload = function (e) {
                // $('#preview-image img').remove();
                // $('#preview-image').html('<img src="'+e.target.result+'" width="150" height="150"/>');
                $("#preview-image img").attr("src",e.target.result) ;
            }
            readerObj.readAsDataURL(file);
        }
    },
    loadMoreCourses : function (container, url, total, cname){
        var page = 1;
        var current = container;
        var offset = container.offset().top + container.height();
        $(window).scroll(function(){
            if (current.hasClass('all-blogs')){
                page = site.page;
            }
            if (current.hasClass('all-courses')){
                page = site.page;
            }
            if (current.hasClass('featured-courses')){
                page = site.featuredpage;
            }
            if (current.hasClass('enrolled-courses')){
                page = site.mycoursepage;
            }

            if (current.hasClass('upcoming-live-classes-list-view')){
                page = site.livelistpage;
            }
            if (current.hasClass('upcoming-live-classes-grid-view')){
                page = site.livegridpage;
            }
            if (current.hasClass('upcoming-webinars-list-view')){
                page = site.webinarlistpage;
            }
            if (current.hasClass('upcoming-webinars-grid-view')){
                page = site.webinargridpage;
            }

            if(total > page * site_page_limit) {
                if($(window).scrollTop() + $(window).height() > offset) { 
                    site.loadMore(++page, container, url);
                    if (current.hasClass('all-blogs')){
                        site.page = page;
                    }
                    if (current.hasClass('all-courses')){
                        site.page = page;
                    }
                    if (current.hasClass('featured-courses')){
                        site.featuredpage = page;
                    }
                    if (current.hasClass('enrolled-courses')){
                        site.mycoursepage = page;
                    }

                    if (current.hasClass('upcoming-live-classes-list-view')){
                       site.livelistpage = page;
                    }
                    if (current.hasClass('upcoming-live-classes-grid-view')){
                        site.livegridpage = page;
                    }
                    if (current.hasClass('upcoming-webinars-list-view')){
                        site.webinarlistpage = page;
                    }
                    if (current.hasClass('upcoming-webinars-grid-view')){
                        site.webinargridpage = page;
                    }

                }
            }else{
                cname.remove();
            }
        })
    },
    loadMore : function (page, container, url){
        var url = url+'?page=' + page;
        //For all courses category n search
        if (typeof category_id !== 'undefined') {
            url += '&category=' + category_id;
        }
        if ($('input#search').length > 0){
            var keyword = $('input#search').val();
            url += '&keyword=' + keyword;
        }

        //For all courses category n search
        $.ajax(
        {
            url: url,
            type: "get",
            datatype: "html",
            async: false,
            beforeSend: function()
            {
                site.blockUI();
                //$('.ajax-loading').show();
            },
            complete: function()
            {
                site.unblockUI();
            }
        })
        .done(function(data)
        {
            if(data.length){
                //$('.ajax-loading').hide();
                container.find('#course-list').append(data);
                if($(".upcoming-live-classes").length > 0) {
                    container.find('#live-class-list').append(data);
                    var live_class_id = $(this).find("#live_class_id").val();
                    var schedule_id = $(this).find("#schedule_id").val();   
                    $("div.upcoming-live-classes-countdown").each(function () {
                        $(this).countEverest({
                            hour: $(this).find("#schedule_hour").val(),
                            minute: $(this).find("#schedule_minute").val(),
                            day: $(this).find("#schedule_day").val(),
                            month: $(this).find("#schedule_month").val(),
                            year: $(this).find("#schedule_year").val(),
                            timeZone: Number($(this).find("#schedule_timezone").val()),
                            onComplete: function () {
                                site.checkLiveclassStarted(live_class_id, schedule_id)
                            }
                        });
                    });
                }
                if($(".upcoming-webinars").length > 0) {
                    container.find('#webinar-list').append(data);
                    $("div.upcoming-webinars-countdown").each(function () {
                        var webinar_id = $(this).find("#webinar_id").val();
                        var schedule_id = $(this).find("#schedule_id").val();
                        $(this).countEverest({
                            hour: $(this).find("#schedule_hour").val(),
                            minute: $(this).find("#schedule_minute").val(),
                            day: $(this).find("#schedule_day").val(),
                            month: $(this).find("#schedule_month").val(),
                            year: $(this).find("#schedule_year").val(),
                            timeZone: Number($(this).find("#schedule_timezone").val()),
                            onComplete: function () {
                                site.checkWebinarStarted(webinar_id, schedule_id);
                            }
                        });
                    });
                }
                
            }

        })
        .fail(function(jqXHR, ajaxOptions, thrownError)
        {
            console.log('network error');
        });
    },
    notifySuccess: function (message, text){
      message = (message) ? message : 'Regular Success';
      text    = (text) ? text : '';
        /*PNotify.prototype.options.styling = "bootstrap3";
        PNotify.prototype.options.delay = 2000;
        if (! $('div.ui-pnotify').is(':visible')){
            new PNotify({
                title: message,
                text: text,
                type: 'success',
                icon: 'font-icon font-icon-check-circle',
                addclass: 'alert-with-icon'
            });
        }*/
        $.notify({
            icon: 'far fa-check-circle',
            title: '<strong>'+message+'</strong>',
            message: text
        },{
            placement: {
                from: "bottom"
            },
            type: 'success'
        });
    },
    notifyError: function (message, text){
        /*PNotify.prototype.options.styling = "bootstrap3";
        PNotify.prototype.options.delay = 2000;
        new PNotify({
            title: message,
            text: text,
            type: 'error',
            icon: 'font-icon font-icon-warning',
            addclass: 'alert-with-icon'
        });*/
        message = (message) ? message : 'Error Message';
        text    = (text) ? text : '';
        $.notify({
            icon: 'far fa-check-circle',
            title: '<strong>'+message+'</strong>',
            message: text
        },{
            placement: {
                from: "bottom"
            },
            type: 'danger'
        });
    },
    notifyWarning: function (message, text){
        /*PNotify.prototype.options.styling = "bootstrap3";
        PNotify.prototype.options.delay = 2000;
        new PNotify({
            title: message,
            text: text,
            icon: 'font-icon font-icon-warning',
             addclass: 'alert-with-icon'
        });*/
        message = (message) ? message : 'Warning Message';
        text    = (text) ? text : '';
        $.notify({
            icon: 'fal fa-check-circle',
            title: '<strong>'+message+'</strong>',
            message: text
        },{
            placement: {
                from: "bottom"
            },
            type: 'warning'
        });

    },
    blockUI: function(){
        // $.blockUI({
        //         message: '<div class="pls-wait"><img src="/images/loader.gif"/></div>',
        //         overlayCSS:  {
        //             background: 'rgba(142, 159, 167, 0.3)',
        //             opacity: 1,
        //             cursor: 'wait'
        //         },
        //         css: {
        //             //width: 'auto',
        //             top: '45%',
        //             left: '45%',
        //             width:'32px',
        //             height:'32px',
        //             margin:'0 auto',
        //             border:'none',
        //             backgroundColor:'transparent',
        //             background:'none'

        //         },
        //         blockMsgClass: 'block-msg-default',
        //         centerX: true,
        //         centerY: true
        //     });
        $.blockUI({
                message: '<div class="pre_loader"></div>',
                overlayCSS:  {
                    background: 'rgba(142, 159, 167, 0.3)',
                    opacity: 1,
                    cursor: 'none'
                },
                 css: {

                margin:'0 auto',
                border:'none',
                backgroundColor:'transparent',
                background:'none'

            },
            blockMsgClass: 'block-msg-default',
            centerX: true,
            centerY: true,
            });
    },
    unblockUI:function(){
        $.unblockUI();
    },
    blockElement: function(element, themeColor){
        if (typeof(themeColor)==='undefined') {
            themeColor = 'rgba(142, 159, 167, 0.3)';
        } else {
            themeColor = '#f9f9f9';
        }
        element.block({
            message: '<div class="pre_loader"></div>',
            overlayCSS:  {
                background: themeColor,
                opacity: 1,
                cursor: 'wait'
            },
            css: {
                //width: 'auto',

                margin:'0 auto',
                border:'none',
                backgroundColor:'transparent',
                background:'none'

            },
            blockMsgClass: 'block-msg-default',
            centerX: true,
            centerY: true
        });
    },
    /*blockElement: function(element){
        element.block({
            message: '<div id="floatingBarsG"><div class="blockG" id="rotateG_01"></div><div class="blockG" id="rotateG_02"></div>\n\
                        <div class="blockG" id="rotateG_03"></div><div class="blockG" id="rotateG_04"></div><div class="blockG" id="rotateG_05"></div>\n\
                        <div class="blockG" id="rotateG_06"></div><div class="blockG" id="rotateG_07"></div><div class="blockG" id="rotateG_08"></div></div>',
            overlayCSS:  {
                background: 'rgba(142, 159, 167, 0.3)',
                opacity: 1,
                cursor: 'wait'
            },
            css: {
                //width: 'auto',


            },
            blockMsgClass: 'block-msg-default'
        });
    },*/
    unblockElement: function(element){
        element.unblock();
    },
    confirmSubscriptionCancel: function (e){
        e.preventDefault();
        var form = $(this).closest('form');
        var warningMsg =  typeof $default_school_strings.cancel_subscription_warning !== 'undefined' && $default_school_strings.cancel_subscription_warning != '' ? $default_school_strings.cancel_subscription_warning : 'Are you sure you want to cancel the subscription?';
        var warningText =  typeof $default_school_strings.cancel_subscription_warning_text !== 'undefined' && $default_school_strings.cancel_subscription_warning_text != '' ? $default_school_strings.cancel_subscription_warning_text : 'If you have chosen to cancel the subscription, you will lose access to the course contents.';
        var okText =  typeof $default_school_strings.ok !== 'undefined' && $default_school_strings.ok != '' ? $default_school_strings.ok : 'OK';
        var cancelText =  typeof $default_school_strings.cancel !== 'undefined' && $default_school_strings.cancel != '' ? $default_school_strings.cancel : 'Cancel';

        swal({
                title: warningMsg,
                text: warningText,
                type: "error",
                buttons: {
                    cancel: cancelText,
                },
                showCancelButton: true,
                cancelButtonClass: "btn-default",
                confirmButtonClass: "btn-danger",
                confirmButtonText: okText,
                cancelButtonText: cancelText,
                closeOnConfirm: true
            },
        function(isConfirm){
            if (isConfirm) {
                form.submit();
            }
            else {
                return false;
            }
        });
        /*if (confirm('Are you sure you want to cancel the subscription?')) {
            if (confirm('You have chosen to cancel the subscription. You will lose access to the course contents.')) {
                var form = $(this).closest('form');
                form.submit();
            }
            else {
                return false;
            }
        }
        else {
           return false;
        }*/
    },
    toggleCurriculumSections: function (){

        $timeline_expandable_title = $('.timeline-action.is-expandable .title');
        $($timeline_expandable_title).attr('tabindex', '0');

        // Give timelines ID's
        $('.timeline').each(function(i, $timeline) {
            var $timeline_actions = $($timeline).find('.timeline-action.is-expandable');

            $($timeline_actions).each(function(j, $timeline_action) {
                var $milestoneContent = $($timeline_action).find('.content');

                $($milestoneContent).attr('id', 'timeline-' + i + '-milestone-content-' + j).attr('role', 'region');
                $($milestoneContent).attr('aria-expanded', $($timeline_action).hasClass('expanded'));

                $($timeline_action).find('.title').attr('aria-controls', 'timeline-' + i + '-milestone-content-' + j);
            });
        });

        $($timeline_expandable_title).click(function() {
            $(this).parent().toggleClass('is-expanded');
            $(this).siblings('.content').attr('aria-expanded', $(this).parent().hasClass('is-expanded'));
        });

        // Expand or navigate back and forth between sections
        $($timeline_expandable_title).keyup(function(e) {
            if (e.which == 13){ //Enter key pressed
              $(this).click();
            } else if (e.which == 37 ||e.which == 38) { // Left or Up
              $(this).closest('.timeline-milestone').prev('.timeline-milestone').find('.timeline-action .title').focus();
            } else if (e.which == 39 ||e.which == 40) { // Right or Down
              $(this).closest('.timeline-milestone').next('.timeline-milestone').find('.timeline-action .title').focus();
            }
        });

    },
    //Check user completed registration (user may have not submitted password on course enroll))
    completeRegistration : function (e){
        if (typeof e != "undefined"){ //on click of continue to course button
            e.preventDefault();
            site.course_player_url = $(this).attr("href");
        }else{
            if (typeof slug != "undefined"){
                if (window.location.pathname == '/courses/' + slug + '/subscribe'){ //for thankyou page. No need to show pop up
                    return;
                }
            }
        }
        $.ajax({
            url: APP_URL + "/complete-registration",
            method: "GET",
            type: "json",
            success:function(response){
                if (response.success){
                    if (response.show_pop_up){
                        $('body').find('div#page').append(response.pop_up);
                        //$('div.password-model').modal('show');
                        $('div.password-model').modal({
                            backdrop: 'static',
                            keyboard: false
                        })
                        $('div.password-model').on('shown.bs.modal', function () {
                            $('#name').focus();
                        })
                    }else{
                        if (site.course_player_url != ''){
                            window.location = site.course_player_url;
                        }
                    }
                }
            },
            error: function(response){
                //alert("Sorry, pleasdde try again.")
            }
        });
    },
    updatePassword: function (e){
        e.preventDefault();
        var pwd_outer = $(this).closest('div.password-model');
        var password = pwd_outer.find('input[name="password"]').val();
        var confirm_password = pwd_outer.find('input[name="confirm_password"]').val();
        var form = pwd_outer.find('form');
        var error = '';
        var error_box =  pwd_outer.find('div.message ul');

        error_box.html("");
        if (password == ''){
            error =  typeof $default_school_strings.enter_password_msg !== 'undefined' && $default_school_strings.enter_password_msg != '' ? $default_school_strings.enter_password_msg : 'Please enter password';
            //error = "Please enter password";
        }else {
            if (confirm_password == ''){
                error =  typeof $default_school_strings.enter_password_msg !== 'undefined' && $default_school_strings.confirm_password_msg != '' ? $default_school_strings.confirm_password_msg : 'Please confirm password';
                error = "Please confirm password";
            }
        }
        if (error != ""){
            site.addError(error, error_box);
            return false;
        }
        $.ajax({
            url: APP_URL + "/update-user-password",
            method: "POST",
            type: "json",
            data: form.serialize(),
            success:function(response){
                if (response.success){
                    $('div.password-model').modal('hide');
                    window.location = site.course_player_url;
                }else{
                    var errors = response.messages;
                    site.listErrors(errors, error_box);
                }
            },
            error: function(response){
                //alert("Sorry, please try again.")
            }
        });
    },
    updateName: function (e){
        e.preventDefault();
        var acc_outer = $(this).closest('div.password-model');
        var form = acc_outer.find('form');
        var error = '';
        var error_box =  acc_outer.find('div.message ul');

        error_box.html("");

        if (error != ""){
            site.addError(error, error_box);
            return false;
        }
        $.ajax({
            url: APP_URL + "/update-user-name",
            method: "POST",
            type: "json",
            data: form.serialize(),
            success:function(response){
                if (response.success){
                    acc_outer.modal('hide');
                    window.location.reload();
                }else{
                    var errors = response.messages;
                    site.listErrors(errors, error_box);
                }
            },
            error: function(response){
                //alert("Sorry, please try again.")
            }
        });
    },
    listErrors : function (errors, error_box){
        var error = '';
        $.each( errors, function( key, value ) {
            error += '<li class="text-danger"><span>'+value+'</span></li>';
            //error_box.append('<li class="text-danger"><span>'+value+'</span></li>');
        });
        error_box.html(error);
    },
    addError : function (error, error_box){
        error_box.html('<li class="text-danger"><span>'+error+'</span></li>');
    },
    showSuccessMsg : function (error, msg_box){
        msg_box.html('<li class="text-success"><span>'+error+'</span></li>');
    },
    showCoursePlans : function(){
        var locked_outer = $(this).closest('div.locked-courses');
        var bundle_id = locked_outer.find('input[name="b_id"]').val();
        var course_id = locked_outer.find('input[name="c_id"]').val();
        $.ajax({
            url: APP_URL + "/get-bundle-plans/" + bundle_id + "/" + course_id,
            method: "GET",
            type: "json",
            success:function(response){
                if (response.success){
                    locked_outer.find('div.unlock-plans').html(response.popup);
                    locked_outer.find('div.plan-model').modal('show');
                }
            },
            error: function(response){
                //alert("Sorry, please try again.")
            }
        });
        //$(this).closest('div.locked-courses').find('div.plan-model').modal('show');
    },
    showCourseByCategory : function (){
        var category = $(this).val();
        $.ajax({
            url: APP_URL + "/get-category-url",
            method: "GET",
            type: "json",
            data: { category:category },
            success:function(response){
                if (response.success){
                   window.location = response.url;
                }
            },
            error: function(response){
                //alert("Sorry, please try again.")
            }
        });
    },
    showBlogByCategory : function (){
        var category = $(this).val();
        $.ajax({
            url: APP_URL + "/get-blog-category-url",
            method: "GET",
            type: "json",
            data: { category:category },
            success:function(response){
                if (response.success){
                   window.location = response.url;
                }
            },
            error: function(response){
                //alert("Sorry, please try again.")
            }
        });
    },
    searchCourse : function (e){
        e.preventDefault();
        var search_box = $('input#search');
        var keyword = search_box.val();
        var category = search_box.closest('div.category-search').find('select[name="categories"]').val();
        $.ajax({
            url: APP_URL + "/search-course",
            method: "GET",
            type: "json",
            data: { keyword:keyword, category:category, _token: $('meta[name="csrf-token"]').attr('content') },
            success:function(response){
                $('a.allcourse').remove();
                $('div#course-list').replaceWith(response.html);
                total_courses = response.total_courses;
                site.page = 1;
                site.loadMoreCourses($('div.all-courses'), '/getcourses', total_courses, $('a.allcourse'));
            },
            error: function(response){
                //alert("Sorry, please try again.")
            }
        });
    },
    searchBlog : function (e){
        e.preventDefault();
        var search_box = $('input#search');
        var keyword = search_box.val();
        var category = search_box.closest('div.category-search').find('select[name="blog-categories"]').val();
        $.ajax({
            url: APP_URL + "/search-blog",
            method: "GET",
            type: "json",
            data: { keyword:keyword, category:category, _token: $('meta[name="csrf-token"]').attr('content') },
            success:function(response){
                $('a.allblog').remove();
                $('div#course-list').replaceWith(response.html);
                total_blogs = response.total_blogs;
                site.page = 1;
                site.loadMoreCourses($('div.all-blogs'), '/getblogs', total_blogs, $('a.allblog'));
            },
            error: function(response){
                //alert("Sorry, please try again.")
            }
        });
    },
    setFormErrors:function(errors){
        $.each(errors, function( key, value ) {
          // console.log( key + ": " + value );
            $('#'+key).addClass('form-control-error');
            if( $('#'+key).parent("div.input-group").length) {
                $('#'+key).parent("div.input-group").next('span.error-block').remove();
                $('#'+key).parent("div.input-group").after('<span class="error-block">'+value+'</span>');
            }
            else {
                $('#'+key).next('span.error').remove();
                $('#'+key).after('<span class="error">'+value+'</span>');
            }
        });
    },
    removeErrorMsg: function(){
        $(this).removeClass('form-control-error');
        if( $(this).parent("div.input-group").length) {
            $(this).parent("div.input-group").next('span.error-block').remove();
            $(this).parent("div.input-group").next('span.error').remove();
        }
        else {
            $(this).next('span.error-block').remove();
            $(this).next('span.error').remove();
        }
    },
    datePicker : function (){
        if ($(".date-picker").length == 0){
            return;
        }
        var start = start_date;
        var end = end_date;
        customRangeLabel =  typeof $default_school_strings.custom_range !== 'undefined' && $default_school_strings.custom_range != '' ? $default_school_strings.custom_range : 'Custom Range';
        defaultRangeLabel =  typeof $default_school_strings.last_7_days !== 'undefined' && $default_school_strings.last_7_days != '' ? $default_school_strings.last_7_days : 'Last 7 days';
        $('.date-picker').daterangepicker({
            startDate: start,
            endDate: end,locale: {
    "customRangeLabel": customRangeLabel,
  },
            ranges: dateRangeStringsJson,
            /*ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                //'Last 7 days': [moment().subtract(7, 'days'), moment()],
                //'Last 30 Days' : [moment().subtract(29, 'days'), moment()],
                'Last 7 days': [moment().subtract(8, 'days'), moment().subtract(1, 'days')],
                'Last 30 Days' : [moment().subtract(30, 'days'), moment().subtract(1, 'days')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month'   : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Year': [moment().startOf('year'), moment().endOf('year')],
                'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
                'All Time': [school_created_date, moment()]
            },*/
            autoApply       : true,
            linkedCalendars : false
        });

        $('.date-picker').val(defaultRangeLabel);

        $('.date-picker').on('apply.daterangepicker, cancel.daterangepicker, hide.daterangepicker', function(ev, picker){
            if(picker.chosenLabel != customRangeLabel){
              $(this).val(picker.chosenLabel);
            }
            else{
                var start = picker.startDate.toString().split(' ');
                var end   = picker.endDate.toString().split(' ');
                $(this).val(start[2] + ' ' + start[1] + ' ' + start[3] + ' - ' + end[2] + ' ' + end[1] + ' ' + end[3]);
            }
        });



        $('.aff-sales-overview-date-picker').on('apply.daterangepicker', function(ev, picker) {
            var date_val = picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY');
            affiliate.getAffiliateSalesOverview(date_val);
        });

        $('.aff-sales-date-picker').on('apply.daterangepicker', function(ev, picker) {
            var date_val = picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY');
            $(this).closest('.overview-filter').find('input[name="date-picker"]').val(date_val);
        });

        var initDateVal = start_date + ' - ' + end_date;
        $("#date-picker").val( initDateVal);
        $('.aff-payout-date-picker').on('apply.daterangepicker', function(ev, picker) {
            var date_val = picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY');
            $("#date-picker").val( date_val);
            //alert(date_val);
            //affiliate.getAffiliateSalesOverview(date_val);
        });

    },
    getParameterByName : function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    enrollInCourse : function (){
        var course_url = APP_URL + "/courses/" + slug;
        var coupon = site.getParameterByName('coupon');
        var valid_coupon = 0;
        var preview = site.getParameterByName('preview');
        var desc_outer = $(this).closest('div.course-description');
        var plan_count = desc_outer.find('input[name="p-c"]').val();
        var p_hidden = desc_outer.find('input[name="p-hidden"]').val();
        if (p_hidden == 1 || plan_count == 0){ //if course price is hidden or no plans are added for course, go to support
            var url = APP_URL + "/support";
            window.location = url;
        }
        if (plan_count == 1 && coupon != ''){
            $.ajax({
                url: APP_URL + "/check-coupon",
                method: "GET",
                type: "json",
                async : false,
                data: {coupon : coupon},
                success:function(response){
                    if (response.valid){
                        valid_coupon = 1;
                    }

                },
                error: function(response){
                    //alert("Sorry, please try again.")
                }
            });
        }
        var url = course_url + "/buy";
        if ( coupon && valid_coupon == 1){
            url = url + '?coupon=' + coupon;
            if (preview){
                url = url + '&preview=' + preview;
            }
        }else{
            if (preview){
                url = url + '?preview=' + preview;
            }
        }
        if (plan_count == 1){
            window.location = url;
        }
        if (plan_count > 1){
            if ($('.zen_cs_plans_dynamic').length > 0) {
                $('html, body').animate({ scrollTop: $('.zen_cs_plans_dynamic').offset().top }, 'slow');
            } else {
                window.location = url;
            }
        }
        return false;

    },
    showFooterLogo : function (){
        if ($('#secHeader').length > 0){ //For course player dont show footer "powered by zenler"
            return;
        }
        $.ajax({
            url: APP_URL + "/footer-logo",
            method: "GET",
            type: "json",
            success:function(response){
                if (response.show_logo){
                    var logo = $(response.html);
                    logo.appendTo("body");
                }
            },
            error: function(response){
                //alert("Sorry, please try again.")
            }
        });
    },
    autoHeight : function (){
        /*var bodyHeight = $("body").height();
        var vwptHeight = $(window).height();
        var gap = vwptHeight - bodyHeight;
        if (vwptHeight > bodyHeight) {
            $(".content-style:visible:last").css( "padding-bottom" , gap );
        } else {
            $(".content-style:visible:last").css( "padding-bottom" , "0" );
        }*/
    },

    loadCommunity_: function(e) {
            e.preventDefault()
            $('#communityPopup').modal({
                show: true,
                backdrop: 'static',
                keyboard: true
             });
             return false;
    },
    loadCommunityHome: function(e) {
        if (site.isIEBrowser()) {
            $('#jqSingleCommunityIframe').contents().find('body').addClass('content-style').append('<div style="display: flex;justify-content: center;align-items: center;height: calc(100% - 60px);font-family: \'Roboto\', sans-serif;font-weight: 300;font-size: 20px;letter-spacing: 1px;"><h4>The browser your are currently using is not supported. We recommend Google Chrome.</h4></div>');
        } else {
            var urlParams = new URLSearchParams(window.location.search);
            var single_communityId = urlParams.has('communityid') ? 1 : 0;
            var single_activityId = urlParams.has('activityid') ? 1 : 0;
            var notification_group_id = '';
            var ajax_url_community = APP_URL + "/communities";
            var ajax_data = {};
            if (single_communityId == 1 && single_activityId == 1) {
                var communityId = urlParams.get('communityid');
                var activityId = urlParams.get('activityid');
                ajax_url_community = APP_URL + "/single-community";
                ajax_data = {userId: user_id, communityId: communityId, activityId: activityId, notification_group_id: notification_group_id};
            } else {
                var ajax_url_community = APP_URL + "/communities";
            }
       $.ajax({
               url: ajax_url_community,
               method: "GET",
               type: "json",
               data: ajax_data,
               beforeSend: function() {
                   site.blockElement($('iframe').closest('div'));
               },
               success:function(response){
                   if (response.communityUrl) {
                   if ($('#jqSingleCommunityIframe').length > 0) {
                       document.getElementById('jqSingleCommunityIframe').src = response.communityUrl;
                       //$('.container-fluid').find('iframe#jqSingleCommunityIframe').attr("src", response.communityUrl);
                       $('.container-fluid').css("height", '100%');
                       //site.unblockElement($('iframe').closest('div'));
                        setTimeout(function(){ 
                            site.unblockElement($('iframe').closest('div'));
                        }, 4000);
                        $('#jqSingleCommunityIframe').load(function(){
                            site.unblockElement($('iframe').closest('div'));
                            $('#jqSingleCommunityIframe').closest('div.col-md-12').css({
                                   'margin': 0,
                                   'padding': 0,
                                   'display': 'block',
                                   'padding-top': '20px',
                                   'background': '#' + response.bg_color
                            });
                        });

                      // alert($('#jqSingleCommunityIframe').attr("src"));
                   } else {
                           $('#communityPopup').find('iframe').attr('src', response.communityUrl);
                           //$('#communityPopup').find('.modal-body').css('height', $(window).outerHeight()-130);
                           $('#communityPopup').find('.modal-body').css( {
                                            'height': '100%',
                                            'padding-top': '20px',
                                            'background':  '#' + response.bg_color
                                });
                           e.preventDefault();
                           /*$('.modal .modal-dialog').attr('class', 'modal-dialog  zoomIn  animated');*/
                           if ($('.jqNoficationBox').length > 0) {
                               //$('.jqNoficationBox').remove();
                               //$('.jqNotificationAlert').hide();
                           }
                           $('#communityPopup').modal({
                                show: true,
                                /*backdrop: 'static',
                                keyboard: true*/
                          });
                            $('#communityPopup').find('.modal-body').append('<div class="pre_loader"></div>');
                            setTimeout(function(){ 
                                $('#communityPopup').find('.modal-body div').remove('.pre_loader')
                            }, 4000);
                            $('#communityPopup').find('iframe').load(function(){
                                $('#communityPopup').find('.modal-body div').remove('.pre_loader')
                            });
                      }
                  } else {
                      if ($('#jqSingleCommunityIframe').length > 0) {
                          site.unblockElement($('iframe').closest('div'));
                          if (response.error) {
                            if(window.location.pathname == '/community'){
                                window.location.replace('/login');
                            } else {
                                $('#jqSingleCommunityIframe').contents().find('body').addClass('content-style').append('<div style="display: flex;justify-content: center;align-items: center;height: calc(100% - 60px);font-family: \'Roboto\', sans-serif;font-weight: 300;font-size: 20px;letter-spacing: 1px;"><h4>Please sign in to access community</h4></div>');
                            }
                        } else {
                            $('#jqSingleCommunityIframe').contents().find('body').addClass('content-style').append('<div style="display: flex;justify-content: center;align-items: center;height: calc(100% - 60px);font-family: \'Roboto\', sans-serif;font-weight: 300;font-size: 20px;letter-spacing: 1px;"><h4>You are currently not enrolled to any community</h4></div>');
                        }
                      }
                  }
               },
               error: function(response){
                   //alert("Sorry, please try again.")
               }
           });
       }
   },
    loadCommunity: function(e) {
       $.ajax({
               url: APP_URL + "/zcommunity",
               method: "GET",
               type: "json",
               success:function(response){
                           //$('#communityPopup').find('iframe').attr('src', response.communityUrl);
                           $('#communityPopup').find('.modal-body').html('<iframe src="" frameborder="0" height="100%" width="100%"></iframe>');
                           $('#communityPopup').find('iframe').attr('src', response.communityUrl);
                           //$('#communityPopup').find('.modal-body').css('height', $(window).outerHeight()-130);
                           $('#communityPopup').find('.modal-body').css( {
                                            'height': '100%',
                                            'padding-top': '20px',
                                            'background':  '#' + response.bg_color
                                });
                           e.preventDefault();
                           /*$('.modal .modal-dialog').attr('class', 'modal-dialog  zoomIn  animated');*/
                           if ($('.jqNoficationBox').length > 0) {
                               //$('.jqNoficationBox').remove();
                               //$('.jqNotificationAlert').hide();
                           }
                           $('#communityPopup').modal({
                                show: true,
                                /*backdrop: 'static',
                                keyboard: true*/
                          });

           /*$('.popupShadow').css({
               width:$('body').outerWidth(),
               height:$('body').outerHeight(),
               opacity:0.2,
               background:'grey',
               zIndex: 1,
           }).show();*/
                           /*$('.jqCommunityPopup').css({
               left: (($(window).outerWidth()-$('.jqCommunityPopup').outerWidth())/2),
               top: (($(window).outerHeight()-$('.jqCommunityPopup').outerHeight())/2)+$(document).scrollTop(),
               zIndex: 100000
           }).show();*/
               },
               error: function(response){
                   //alert("Sorry, please try again.")
               }
           });
   },
    loadSingleCommunity: function(e) {
        var current = $(this);
        var userId = current.closest('.jqSingleCommunity').find('input[name="hidNUserId"]').val();
        var communityId = current.closest('.jqSingleCommunity').find('input[name="hidNCommunityId"]').val();
        var activityId = current.closest('.jqSingleCommunity').find('input[name="hidNActivityId"]').val();
        var notification_group_id = current.closest('.jqSingleCommunity').find('input[name="hidNGroupId"]').val();
        var assignment = current.closest('.jqSingleCommunity').find('input[name="hidAssignment"]').val();
        var outerDiv = current.closest('.jqSingleCommunity');
        var assignmentStudent = current.closest('.jqSingleCommunity').find('input[name="hidAssignmentStudent"]').val();
        var is_assignment = typeof assignment !== 'undefined' ? 1: 0;
        var is_assignmentStudent = typeof assignmentStudent !== 'undefined' ? 1: 0;
        //current.closest('.jqSingleCommunity').removeClass('notification-unread');
        if ('' != userId && '' != communityId && '' != activityId) {
            if (is_assignment) {
                var assignment_manage_url = current.closest('.jqSingleCommunity').find('input[name="hidAssignmentManageUrl"]').val();
                if (typeof assignment_manage_url !== 'undefined' && '' != assignment_manage_url) {
                    window.open(assignment_manage_url, '_blank');
                }
                return false;
            }
        $.ajax({
               url: APP_URL + "/single-community",
               method: "GET",
               type: "json",
               data:{userId: userId, communityId: communityId, activityId: activityId, notification_group_id: notification_group_id, is_assignment: is_assignmentStudent},
                success:function(response){
                   if ('' != response.communityUrl) {
                        if (outerDiv.hasClass('notification-unread')) {
                            if(/^[0-9- ]*$/.test($('.jqNotificationCount').text()) == true) {
                                var currentNCount = parseInt($('.jqNotificationCount').text()) >= 1 ? parseInt($('.jqNotificationCount').text()) : 0;
                                //alert(currentNCount);
                                if (currentNCount > 0) {
                                    if (currentNCount == 1) {
                                        $('.jqNotificationCount').hide();
                                    } else {
                                        $('.jqNotificationCount').text(currentNCount-1);
                                    }
                                }
                            }
                        }
                        outerDiv.removeClass('notification-unread');
                           //$('#communityPopup').find('iframe').attr('src', response.communityUrl);
                           if (is_assignment == 1 || is_assignmentStudent == 1) {
                            $('#communityPopup').find('.modal-header h4').text('Comments');
                        }
                           $('#communityPopup').find('.modal-body').html('<iframe src="" frameborder="0" height="100%" width="100%"></iframe>');
                           $('#communityPopup').find('iframe').attr('src', response.communityUrl);
                           $('#communityPopup').find('.modal-body').css( {
                                            'height': '100%',
                                            'padding-top': '20px',
                                            'background':  '#' + response.bg_color
                                });
                                $('.navbar-collapse').css('display', 'block');
                           e.preventDefault();
                           /*$('.modal .modal-dialog').attr('class', 'modal-dialog  zoomIn  animated');*/
                           if ($('.jqNoficationBox').length > 0) {
                               //$('.jqNoficationBox').remove();
                               //$('.jqNotificationAlert').hide();
                           }
                           $('#communityPopup').modal({
                                show: true,
                                /*backdrop: 'static',
                                keyboard: true*/
                          });
                            $('#communityPopup').find('.modal-body').append('<div class="pre_loader"></div>');
                            setTimeout(function(){ 
                                $('#communityPopup').find('.modal-body div').remove('.pre_loader')
                            }, 4000);
                            $('#communityPopup').find('iframe').load(function(){
                                $('#communityPopup').find('.modal-body div').remove('.pre_loader')
                            });
                      }
               },
               error: function(response){
                   //alert("Sorry, please try again.")
               }
           });
       } else {
           console.log('No user, community, activity details provided');
       }
       return false;
   },
   loadCommunityNotifications: function() {
       var current = $(this);
       if ($('.jqLoginLogout .dropdown').hasClass('open')) {
           $('.jqLoginLogout .dropdown').removeClass('open');
       }
        if ($('.jqNoficationBox').length > 0) {
            $('.jqNoficationBox').remove();
        } else {
            $.ajax({
                url: APP_URL + "/community-get-notification",
                method: "GET",
                type: "json",
                beforeSend: function() {
                    $('.jqNotificationLoader').show();
                },
                complete: function() {
                    $('.jqNotificationLoader').hide();
                },
                success:function(response){
                    if (response.success) {
                        //$('.jqNotificationCount').text('');
                        //$('.jqNotificationCount').hide();
                        $('.jqNotificationAlert').append(response.html);
                        $('.jqNotificationAlert').show();
                        if ($('iframe').closest('div.col-md-12').length > 0) {
                            $('iframe').closest('div.col-md-12').prepend('<div class="jqIframeShadow" style="position: absolute;background: #00800000;width: 100%;z-index: 999;height: 100%;opacity: 0;"></div>');
                        }
                        if($('.jqNoficationBox').find('div.notification-unread').length == 0) {
                             $('.jqMarkAllAsRead i').css({'color': '#888888', 'pointer-events': 'none'});
                        }
                        $('.jqMarkAllAsReadTooltip').tooltip({
                                    title: 'Mark All As Read',
                                    placement:'bottom',
                                });
                        $('.jqMarkRead').tooltip({
                                    title: 'Mark As Read'
                                });
                        $('.jqDeleteNotification').tooltip({
                                    title: 'Delete Notification'
                                });
                    }else {
                        if (response.error) {
                            window.location.replace('/login');
                      }
                  }
                    if (response.error) {
                        //$('.jqNotification').remove();
                        //alert('Something went wrong. Please  try again!');
                    }
                },
                error: function(response){
                    //alert("Sorry, please try again.")
                }
            });
        }
        return false;
   },
   loadUserNotification: function(e) {
       
        if (site.isIEBrowser()) {
            $('#jqCommunityNotificationsIframe').contents().find('body').addClass('content-style').append('<div style="display: flex;justify-content: center;align-items: center;height: calc(100% - 60px);font-family: \'Roboto\', sans-serif;font-weight: 300;font-size: 20px;letter-spacing: 1px;"><h4>The browser your are currently using is not supported. We recommend Google Chrome.</h4></div>');
        } else {
       var userGetstreamId = $(this).closest('li').find('input[name="hidUserGetstreamId"]').val();
       var urlParams = new URLSearchParams(window.location.search);
       var expand_settings = urlParams.has('expand') ? 1 : 0;
            $.ajax({
                url: APP_URL + "/community-get-notification-url",
                method: "GET",
                type: "json",
                data: {userGetstreamId:userGetstreamId, expand_settings: expand_settings},
                beforeSend: function() {
                    site.blockElement($('iframe').closest('div'));
                },
                success:function(response){
                        if (response.url) {//alert(response.toSource())
                            if ($('#jqCommunityNotificationsIframe').length > 0) {
                                $('#jqCommunityNotificationsIframe').attr('src', response.url);
                                setTimeout(function(){ 
                                    site.unblockElement($('iframe').closest('div'));
                                }, 4000);
                                $('#jqCommunityNotificationsIframe').load(function(){
                                    site.unblockElement($('iframe').closest('div'));
                                    $('#jqCommunityNotificationsIframe').closest('div.col-md-12').css({
                                           'margin': 0,
                                           'padding': 0,
                                           'display': 'block',
                                           'padding-top': '20px',
                                           'background': '#' + response.bg_color
                                       })
                                });
                            } else {
                                $('#communityPopup').find('iframe').attr('src', response.url);
                                $('#communityPopup').find('.modal-body').css(
                                        {
                                            'height': '100%',
                                            'padding-top': '20px',
                                            'background':  '#' + response.bg_color
                                });
                                e.preventDefault();
                                //$('.modal .modal-dialog').attr('class', 'modal-dialog  zoomIn  animated');
                                if ($('.jqNoficationBox').length > 0) {
                                    //$('.jqNoficationBox').remove();
                                    //$('.jqNotificationAlert').hide();
                                }
                                /*$('#communityPopup').modal({
                                     show: true,
                                     backdrop: 'static',
                                     keyboard: true
                               });*/
                                $('#communityPopup').find('.modal-body').append('<div class="pre_loader"></div>');
                                setTimeout(function(){ 
                                    $('#communityPopup').find('.modal-body div').remove('.pre_loader')
                                }, 4000);
                                $('#communityPopup').find('iframe').load(function(){
                                    $('#communityPopup').find('.modal-body div').remove('.pre_loader')
                                });
                            }
                      }else {
                      if ($('#jqCommunityNotificationsIframe').length > 0) {
                          site.unblockElement($('iframe').closest('div'));
                          if (response.error) {
                            if(window.location.pathname == '/notifications'){
                                window.location.replace('/login');
                            } else {
                                $('#jqCommunityNotificationsIframe').contents().find('body').addClass('content-style').append('<div style="display: flex;justify-content: center;align-items: center;height: calc(100% - 60px);font-family: \'Roboto\', sans-serif;font-weight: 300;font-size: 20px;letter-spacing: 1px;"><h4>Please sign in to access the notifications</h4></div>');
                            }
                        } else {
                            $('#jqCommunityNotificationsIframe').contents().find('body').addClass('content-style').append('<div style="display: flex;justify-content: center;align-items: center;height: calc(100% - 60px);font-family: \'Roboto\', sans-serif;font-weight: 300;font-size: 20px;letter-spacing: 1px;"><h4>Page Not Found</h4></div>');
                        }
                      }
                  }
                },
                error: function(response){
                    //alert("Sorry, please try again.")
                }
            });
            return false;
        }
    },

    checkUpsellBlock: function (){
        if ($('.cs_upsell_buy').length > 0) {
            if ($('.cs_upsell_buy').attr('data-confirm') == 'true') {
                 $('body').off('click', '.cs_upsell_buy').on('click', '.cs_upsell_buy', function() {
                     var current = $(this);
                     var course_id = current.closest('#zen_cs_upsell_dynamic').attr('data-cid');
                     $.ajax({
                        url: '/get-course-slug',
                        method: "GET",
                        type: "json",
                        data: { course_id : course_id },
                        beforeSend: function () {
                                site.blockUI();
                        },
                        complete: function() {
                                site.unblockUI();
                        },
                        success:function(response){
                            if(response.success) {
                               stripe.slug = response.slug;
                               swal({
                                    title: '<h3 style="color:#000">' + $('.cs_upsell_buy').attr('data-msg') + '</h3>',
                                    //type: "info",
                                    //titleClass: "css-upsell-confirmation",
                                    containerClass: "header-style",
                                    showCancelButton: true,
                                    cancelButtonClass: "btn-default",
                                    confirmButtonClass: "dynamic-button",
                                    confirmButtonText: "Yes",
                                    closeOnConfirm: true,
                                    html: true
                                },
                                function(isConfirm){
                                    if (isConfirm) {//alert(current.closest('.jqUpsellContainer').length)
                                        var form = current.closest('.jqUpsellContainer').find('form.jqUpsellForm');
                                        form.attr('action', APP_URL + '/courses/' + response.slug + '/enroll/1');
                                        stripe.submitPaymentForm(form);
                                        return false;
                                    }
                                    else {
                                        return false;
                                    }
                                });
                            }
                        },
                        error: function(response){

                        }
                    });
                 });
            }else {
                $('body').off('click', '.cs_upsell_buy').on('click', '.cs_upsell_buy', function() {
                    //$('#checkout-form').submit();
                    //$(this).closest('.jqUpsellContainer').find('form.jqUpsellForm').submit();
                    var current = $(this);
                    var course_id = current.closest('#zen_cs_upsell_dynamic').attr('data-cid');
                     $.ajax({
                        url: '/get-course-slug',
                        method: "GET",
                        type: "json",
                        data: { course_id : course_id },
                        beforeSend: function () {
                                site.blockUI();
                        },
                        complete: function() {
                                site.unblockUI();
                        },
                        success:function(response){
                            if(response.success) {
                                stripe.slug = response.slug;
                                var form = current.closest('.jqUpsellContainer').find('form.jqUpsellForm');
                                form.attr('action', APP_URL + '/courses/' + response.slug + '/enroll/1');
                                stripe.submitPaymentForm(form);
                            }
                        },
                        error: function(response){

                        }
                    });


                });
            }
        }
    },
    deleteNotification: function() {
            var current = $(this);
            var ajaxContainer = current.closest('.jqSingleCommunity');
            var ajaxPreLoader = ajaxContainer.find('.jqCommunityPreloader');//alert(ajaxPreLoader.length);return false;
            var notification_group_activity_id = current.closest('.jqSingleCommunity').find('input[name="hidNGroupActivityId"]').val();
            var user_id = current.closest('.jqSingleCommunity').find('input[name="hidNUserId"]').val();
            var outerDiv = current.closest('.jqSingleCommunity');
            if ('' != notification_group_activity_id) {
                $.ajax({
                    url: APP_URL + "/community-delete-notification",//server_ip +  "api/v1/notication/delete",
                    method: "get",
                    type: "json",
                    beforeSend: function (){
                        ajaxContainer.addClass('transparent-shadow');
                        ajaxPreLoader.css('display', 'block').show();
                    },
                    complete: function (){
                        ajaxContainer.removeClass('transparent-shadow');
                        ajaxPreLoader.css('display', 'none').hide();
                    },
                    //data: {activity: activity, timelineid: '3-3-5cd92ea2e8a25'},
                    data: {
                        notification_group_activity_id: notification_group_activity_id,
                        user_id: user_id,
                    },

                    success: function (response) {//alert(response.toSource());
                        current.tooltip('destroy');
                        current.closest('.jqSingleCommunity').remove();
                        if (outerDiv.hasClass('notification-unread')) {
                            if(/^[0-9- ]*$/.test($('.jqNotificationCount').text()) == true) {
                                var currentNCount = parseInt($('.jqNotificationCount').text()) >= 1 ? parseInt($('.jqNotificationCount').text()) : 0;
                                //alert(currentNCount);
                                if (currentNCount > 0) {
                                    if (currentNCount == 1) {
                                        $('.jqNotificationCount').hide();
                                        $('.notification-row:last').remove();
                                        $('.jqNoficationBox').html('<div style="padding: 10px;position: relative;">Notifications</div><div class="notification-row" style="border-top:1px solid #e4e4e4"><p>No notifications for you</p></div>');
                                    } else {
                                        $('.jqNotificationCount').text(currentNCount-1);
                                    }
                                }
                            }
                        } 
                        if ($('.jqSingleCommunity').length == 0) {
                            $('.notification-row:last').remove();
                            $('.jqNoficationBox').html('<div style="padding: 10px;position: relative;">Notifications</div><div class="notification-row" style="border-top:1px solid #e4e4e4"><p>No notifications for you</p></div>');
                        }
                    },
                    error: function (response) {
                        console.log("Sorry, please try again.deleteNotification")
                    }
                });
            }
            return false;
        },
        markNotificationRead: function() {
            var current = $(this);
            var ajaxContainer = current.closest('.jqSingleCommunity');
            var ajaxPreLoader = ajaxContainer.find('.jqCommunityPreloader');
            var notification_group_id = current.closest('.jqSingleCommunity').find('input[name="hidNGroupId"]').val();
            var user_id = current.closest('.jqSingleCommunity').find('input[name="hidNUserId"]').val();
            var outerDiv = current.closest('.jqSingleCommunity');
            if ('' != notification_group_id) {
                $.ajax({
                    url: APP_URL + "/community-mark-notification-read",//server_ip +  "api/v1/notication/mark-read",
                    method: "get",
                    type: "json",
                    beforeSend: function (){
                        ajaxContainer.addClass('transparent-shadow');
                        ajaxPreLoader.css('display', 'block').show();
                    },
                    complete: function (){
                        ajaxContainer.removeClass('transparent-shadow');
                        ajaxPreLoader.css('display', 'none').hide();
                    },
                    //data: {activity: activity, timelineid: '3-3-5cd92ea2e8a25'},
                    data: {
                        notification_group_id: notification_group_id,
                        user_id: user_id,
                    },

                    success: function (response) {//alert(response.toSource());
                        if (response.status == 1) {
                             //current.closest('.jqSingleCommunity').removeClass('notification-unread');
                             if (outerDiv.hasClass('notification-unread')) {
                            if(/^[0-9- ]*$/.test($('.jqNotificationCount').text()) == true) {
                                var currentNCount = parseInt($('.jqNotificationCount').text()) >= 1 ? parseInt($('.jqNotificationCount').text()) : 0;
                                //alert(currentNCount);
                                if (currentNCount > 0) {
                                    if (currentNCount == 1) {
                                        $('.jqNotificationCount').hide();
                                    } else {
                                        $('.jqNotificationCount').text(currentNCount-1);
                                    }
                                }
                            }
                        }
                        outerDiv.removeClass('notification-unread');
                        outerDiv.find('.zen-mini-menu').append('<i class="zc-icon-tick" style="width: 25px;position: absolute;right: 5px;bottom: 5px;color: #01baf1;padding: 5px;"></i>');
                        $('.jqNotificationList .mini-dropdown').hide();
                        current.tooltip('destroy');
                             current.remove();
                                if($('.jqNoficationBox').find('div.notification-unread').length == 0) {
                                    $('.jqMarkAllAsRead i').css({'color': '#888888', 'pointer-events': 'none'});
                                }
                        } else {
                           alert(response.message);
                            //return;
                        }
                    },
                    error: function (response) {
                        console.log("Sorry, please try again.markNotificationRead")
                    }
                });
            }
            return false;
        },
        markAllNotificationsRead: function() {
            var current = $(this);
            var ajaxContainer = current.closest('.notificationOutr');
            var ajaxPreLoader = ajaxContainer.find('.jqNotificationBoxPreloader');//alert(ajaxPreLoader.length);return;
            var user_id = current.closest('.jqNoficationBox').find('input[name="hidUserGetstreamId"]').val();
            if ('' != user_id) {
                $.ajax({
                    url: APP_URL + "/community-mark-all-notification-read",//server_ip +  "api/v1/notication/mark-read",
                    method: "get",
                    type: "json",
                    beforeSend: function (){
                        ajaxContainer.addClass('transparent-shadow');
                        ajaxPreLoader.css({'display': 'block', 'z-index':'10000'}).show();
                    },
                    complete: function (){
                        ajaxContainer.removeClass('transparent-shadow');
                        ajaxPreLoader.css('display', 'none').hide();
                    },
                    //data: {activity: activity, timelineid: '3-3-5cd92ea2e8a25'},
                    data: {
                        user_id: user_id,
                    },

                    success: function (response) {//alert(response.toSource());
                        if (response.status == 1) {
                             current.closest('.jqNoficationBox').find('div').removeClass('notification-unread');
                             current.closest('.jqNoficationBox').find('.jqSingleCommunity .zen-mini-menu').append('<i class="zc-icon-tick" style="width: 25px;position: absolute;right: 5px;bottom: 5px;color: #01baf1;padding: 5px;"></i>');
                             $('.jqMarkRead').closest('li').remove();
                             $('.jqMarkAllAsRead i').css({'color': '#888888', 'pointer-events': 'none'});
                             $('.jqNotificationCount').text('');
                             $('.jqNotificationCount').hide();
                        } else {
                           alert(response.message);
                            //return;
                        }
                    },
                    error: function (response) {
                        console.log("Sorry, please try again.markNotificationRead")
                    }
                });
            }
            return false;
        },
    isIEBrowser: function () {
        var ua = navigator.userAgent;
        var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
        return is_ie;   
    },

    notifyErrorMain: function (message, text){
        /*PNotify.prototype.options.styling = "bootstrap3";
        PNotify.prototype.options.delay = 2000;
        new PNotify({
            title: message,
            text: text,
            type: 'error',
            icon: 'font-icon font-icon-warning',
            addclass: 'alert-with-icon'
        });*/
        message = (message) ? message : 'Error Message';
        text    = (text) ? text : '';
        $.notify({
            icon: 'fa fa-check-circle',
            title: '<strong>'+message+'</strong>',
            message: text
        },{
            placement: {
                from: "bottom"
            },
            type: 'danger'
        });
    },
    loadMoreButton : function (){
        var page = site.page;
        var current = $(this);
        var container;
        var url;
        var total;
        var cname;
        if (current.hasClass('allcourse')){
            container = $('div.all-courses');
            url = '/getcourses';
            total = total_courses;
            cname = $('a.allcourse');
            page = site.page;
        }
        if (current.hasClass('featuredcourse')){
            container = $('div.featured-courses');
            url = '/getfeaturedcourses';
            total = total_featured_courses;
            cname = $('a.featuredcourse');
            page = site.featuredpage;
        }
        if (current.hasClass('mycourse')){
            container = $('div.enrolled-courses');
            url = '/getmycourses';
            total = total_enrolled_courses;
            cname = $('a.mycourse');
            page = site.mycoursepage;
        }
        if (current.hasClass('allblog')){
            container = $('div.all-blogs');
            url = '/getblogs';
            total = total_blogs;
            cname = $('a.allblog');
            page = site.page;
        }
        if (current.hasClass('upcomingliveclassesListView')){
            container = $('div.upcoming-live-classes-list-view');
            url = '/getliveclasses/list_type';
            total = total_live_classes;
            cname = $('a.upcomingliveclassesListView');
            page = site.livelistpage;
        }
        if (current.hasClass('upcomingliveclassesGridView')){
            container = $('div.upcoming-live-classes-grid-view');
            url = '/getliveclasses/grid_type';
            total = total_live_classes;
            cname = $('a.upcomingliveclassesGridView');
            page = site.livegridpage;
        }

        if (current.hasClass('upcominglivewebinarsListView')){
            container = $('div.upcoming-webinars-list-view');
            url = '/getlivewebinars/list_type';
            total = total_live_webinars;
            cname = $('a.upcominglivewebinarsListView');
            page = site.webinarlistpage;
        }  
        if (current.hasClass('upcominglivewebinarsGridView')){
            container = $('div.upcoming-webinars-grid-view');
            url = '/getlivewebinars/grid_type';
            total = total_live_webinars;
            cname = $('a.upcominglivewebinarsGridView');
            page = site.webinargridpage;
        }  
        site.loadMore(++page, container, url);
        if(total <= (page * site_page_limit)) {
            cname.remove();
        }
        if (current.hasClass('allcourse')){
            site.page = page;
        }
        if (current.hasClass('featuredcourse')){
            site.featuredpage = page;
        }
        if (current.hasClass('mycourse')){
            site.mycoursepage = page;
        }
        if (current.hasClass('allblog')){
            site.page = page;
        }
        if (current.hasClass('upcomingliveclassesListView')){
           site.livelistpage = page;
        }
        if (current.hasClass('upcomingliveclassesGridView')){
            site.livegridpage = page;
        }
        if (current.hasClass('upcominglivewebinarsListView')){
            site.webinarlistpage = page;
        }
        if (current.hasClass('upcominglivewebinarsGridView')){
            site.webinargridpage = page;
        }
    },
    
    searchLiveclass: function(e) {
        e.preventDefault();
        var search_box = $('.upcoming-live-classes input#search');
        var keyword = search_box.val();
        var form = $(this);
        $.ajax({
            url: APP_URL + "/search-live-class",
            method: "POST",
            type: "json",
            data: form.serialize(),
            success: function (response) {
                if(response.success) {
                    if(response.type == "list_type"){
                    $("div#live-class-list").html(response.html);
                    site.livelistpage = 1;
                    }
                    else if(response.type == "grid_type"){
                        $("div#live-class-list").html(response.html);
                        site.livegridpage = 1;
                    }
                    //site.page = 1;
                    $("div.upcoming-live-classes-countdown").each(function () {
                        var live_class_id = $(this).find("#live_class_id").val();
                        var schedule_id = $(this).find("#schedule_id").val();                        
                        $(this).countEverest({
                            hour: $(this).find("#schedule_hour").val(),
                            minute: $(this).find("#schedule_minute").val(),
                            day: $(this).find("#schedule_day").val(),
                            month: $(this).find("#schedule_month").val(),
                            year: $(this).find("#schedule_year").val(),
                            timeZone: Number($(this).find("#schedule_timezone").val()),                            
                            onComplete: function () {
                                site.checkLiveclassStarted(live_class_id, schedule_id)
                            }
                        });
                    });
                }
            },
            error: function (response) {
                
            }
        });
    },
    
    checkuserloggedin: function() {
        var btn = $(this);
        var type = btn.attr("data-type");
        if (type == "liveclass") {
           var live_class_id = btn.attr("data-live-class-id");
           var live_session_id = live_class_id;
           var p_type = 3;
        }else{
           var webinar_id = btn.attr("data-webinar-id");
           var live_session_id = webinar_id;
           var p_type = 4;
        }
        $.ajax({
            url: APP_URL + "/check-user-logged-in",
            method: "POST",
            type: "json",
            data: {                
                _token: $('input[name="_token"]').val(), type : p_type, live_session_id  : live_session_id
            },
            success: function (response) { 
                var plan_count = response.plan_count;
                var url = btn.next('a.register-page-btn').attr("href");
                var buy_url = btn.closest('div.register-btn-div').find('input[name="l-s-buy-url"]').val();
                if(!buy_url){
                    buy_url = url ;
                }
                if(response.success) {
                    if (type == "liveclass") {
                        var schedule_id = btn.attr("data-schedule-id");
                        if (plan_count == 0){
                            site.registerLiveclass(live_class_id, schedule_id);
                        }else if (plan_count == 1){
                            window.open(buy_url);
                        }else{
                            window.open(url);
                        }
                    } else {
                        var schedule_id = btn.attr("data-schedule-id");
                        if (plan_count == 0){
                            site.registerWebinar(webinar_id, schedule_id);
                        }else if (plan_count == 1){
                            window.open(buy_url);
                        }else{
                            window.open(url);
                        }
                    }                                                            
                } else {
                    if (type == "liveclass") {
                        var schedule_id = btn.attr("data-schedule-id");
                        if (plan_count == 0){
                            site.ShowLoginPopup(live_class_id, schedule_id);
                        }else if (plan_count == 1){
                            window.open(buy_url);
                        }else{
                            window.open(url);
                        }
                    } else {
                        var schedule_id = btn.attr("data-schedule-id");
                        if (plan_count == 0){
                            site.showRegisterPopup(webinar_id, schedule_id);
                        }else if (plan_count == 1){
                            window.open(buy_url);
                        }else{
                            window.open(url);
                        }
                    }                                                                                
                }
            },
            error: function (response) {
                
            }
        });
        
    },
    
    ShowLoginPopup: function(live_class_id, schedule_id) {
        $('#login-live-class').modal('toggle');
        $(".login-error-block").html('');
        $(".login-error-block").css('padding', '0px');
        $(".login-textbox").val("");
        $("#live-class-id").val(live_class_id);
        $("#schedule-id").val(schedule_id);        
    },
    
    LoginLiveClass: function(e) {
        e.preventDefault();
        var live_class_id = $(this).find("#live-class-id").val();
        var schedule_id = $(this).find("#schedule-id").val();
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
                    site.registerLiveclass(live_class_id, schedule_id);
                } else {
                    $("#login-live-class .login-error-block").html(response.msg);
                    $("#login-live-class .login-error-block").css("padding", "0px 20px");
                    $("#login-live-class .login-error-block").css("padding-top", "15px");
                    return;
                }
            },
            error: function (response) {

            }
        });
    },
    
    registerLiveclass: function(live_class_id, schedule_id) {
        $.ajax({
            url: "/live-class/blocks/register",
            method: "POST",
            type: "json",
            data: {
                live_class_id: live_class_id,
                live_class_schedule_id: schedule_id,
                _token: $('input[name="_token"]').val()
            },
            beforeSend: function () {
                site.blockUI();
            },
            complete: function () {
                site.unblockUI();
            },
            success: function (response) {
                site.unblockUI();
                if (response.success) {
                        $("button.close").click();
                        var thank_you_page_url = response.redirect_hash_url;
                        $("a.hidden-thank-you-page-link").attr("href", thank_you_page_url);
                        $("a.hidden-thank-you-page-link")[0].click();
                        $("span.registration-btn-cover-" + live_class_id).html('');
                        var waiting_page_url = thank_you_page_url.replace("thank-you", "waiting");
                        var btn = "<a class='registered-btn btn btn-sm' href='" + waiting_page_url + "' target='_blank'><i class='fas fa-check'></i> Registered</a>";
                        $("span.registration-btn-cover-" + live_class_id).html(btn);
                        window.location.reload();
                    } else {
                       $("button.close").click();
                       site.notifyError("You can't Book this Live Class yet. Please contact the Site Admin.");                       
                    }
            },
            error: function (response) {
//                    alert("Sorry, please try again.")
            }
        });
    },
    
    registerWebinar: function(webinar_id, schedule_id, form_data = "") {
        if(form_data != "") {
            var data = form_data;
        } else {
            var data = {
                webinar_id: webinar_id,
                schedule_id: schedule_id,
                _token: $('input[name="_token"]').val()
            }
        }
        $.ajax({
            url: "/live-webinar/blocks/register-user",
            method: "POST",
            type: "json",
            data: data,
            beforeSend: function () {
                site.blockUI();
            },
            complete: function () {
                site.unblockUI();
            },
            success: function (response) {
                site.unblockUI();
                if (response.status) {
                    $("button.close").click();
                    var thank_you_page_url = response.redirect_hash_url;
                    $("a.hidden-thank-you-page-link").attr("href", thank_you_page_url);
                    $("a.hidden-thank-you-page-link")[0].click();
                    $("span.registration-btn-cover-" + webinar_id + '-' + schedule_id).html('');
                    var waiting_page_url = thank_you_page_url.replace("thank-you", "waiting");
                    var btn = "<a class='registered-btn btn btn-sm' href='" + waiting_page_url + "' target='_blank'><i class='fas fa-check'></i> Registered</a>";
                    $("span.registration-btn-cover-" + webinar_id + '-' + schedule_id).html(btn);                    
                    $(".zen-webinar-view-" + webinar_id).find('.upcoming-block-copy-url-btn').removeClass('hide');
                    $(".zen-webinar-view-" + webinar_id).find('.upcoming-block-copy-url-btn').attr('data-copy-url', waiting_page_url);                    
                } else {
                    $("button.close").click();
                    site.notifyError(response.msg);
                }
            },
            error: function (response) {
//                    alert("Sorry, please try again.")
            }
        });
    },
    
    showRegisterPopup: function(webinar_id, schedule_id) {
        $('#register-live-webinar').modal('toggle');
        $(".register-error-block").html('');
        $(".register-error-block").css('padding', '0px');
        $(".registration-text-box").val("");
        $("form[name='register-live-webinar-popup']").find("#webinar_id").val(webinar_id);
        $("form[name='register-live-webinar-popup']").find("#schedule_id").val(schedule_id);        
    },
    
    searchWebinar: function(e) {
        e.preventDefault();
      //  var search_box = $('.upcoming-webinars input#search-keyword');
       // var keyword = search_box.val();
        var form = $(this);
        $.ajax({
            url: APP_URL + "/search-webinar",
            method: "POST",
            type: "json",
            data: form.serialize(),
            success: function (response) {
                if(response.success) {
                    if(response.type == "list_type"){
                        $("div#webinar-list").html(response.html);
                        site.webinarlistpage = 1;
                    }
                    else if(response.type == "grid_type"){
                        $("div#webinar-list").html(response.html);
                        site.webinargridpage = 1;
                    }

                    $("div.upcoming-webinars-countdown").each(function () {
                        var webinar_id = $(this).find("#webinar_id").val();
                        var schedule_id = $(this).find("#schedule_id").val();
                        $(this).countEverest({
                            hour: $(this).find("#schedule_hour").val(),
                            minute: $(this).find("#schedule_minute").val(),
                            day: $(this).find("#schedule_day").val(),
                            month: $(this).find("#schedule_month").val(),
                            year: $(this).find("#schedule_year").val(),
                            timeZone: Number($(this).find("#schedule_timezone").val()),
                            onComplete: function () {
                                site.checkWebinarStarted(webinar_id, schedule_id);
                            }
                        });
                    });
                }
            },
            error: function (response) {
                
            }
        });
    },
    
    checkLiveclassStarted : function(live_class_id, schedule_id) {
        $.ajax({
            url: APP_URL + "/check-live-class-started",
            method: "POST",
            type: "json",
            data: {
                live_class_id: live_class_id,
                schedule_id: schedule_id,
                _token: $('input[name="_token"]').val()
            },
            success: function (response) {
                if (response.success) {
                    var element = $(".registration-btn-cover-" + live_class_id);
                    element.find('.registered-btn').attr("href", response.join_url);
                    element.find('.registered-btn').html("Join now");
                    element.find('.registered-btn').addClass('join-now-btn');
                    element.find('.registered-btn').removeClass('registered-btn');
                } else {
                    
                }
            },
            error: function (response) {

            }
        });
    },
    
    checkWebinarStarted: function(webinar_id, schedule_id) {
        $.ajax({
            url: APP_URL + "/check-live-webinar-started",
            method: "POST",
            type: "json",
            data: {
                webinar_id: webinar_id,
                schedule_id: schedule_id,
                _token: $('input[name="_token"]').val()
            },
            success: function (response) {
                if (response.success) {
                    var element = $(".registration-btn-cover-" + webinar_id + '-' + schedule_id);
                    element.find('.registered-btn').attr("href", response.join_url);
                    element.find('.registered-btn').html("Join now");
                    element.find('.registered-btn').addClass('join-now-btn');
                    element.find('.registered-btn').removeClass('registered-btn');
                } else {

                }
            },
            error: function (response) {

            }
        });    
    },
    
    showEUGdprPopup:function(){
        $.ajax({
            url: APP_URL + "/show-gdpr-popup",
            method: "GET",
            type: "json",
            success:function(response){
                
                if (response.success){
                    if (response.show_pop_up){console.log(response);
                        $('body').find('div#page').append(response.pop_up);
                       // $('#eugdpr-consent-popup').modal('show');
                       $('#eugdpr-consent-popup  #consent_text').html(response.text);
                     $('#eugdpr-consent-popup').modal({
                            backdrop: 'static',
                            keyboard: false,
                            show :true,
                        })
                    }
                }
            },
            error: function(response){
                //alert("Sorry, pleasdde try again.")
            }
        });
    },
    updateEuGdprStatus:function(e){
        e.preventDefault();
        var status=0;
        var cb=document.getElementById('consent_text_cb');
        if(cb.checked==true){
            status=1;
        }
        $.ajax({
      //  url: APP_URL + "/admin/update-consent-status",
         url: APP_URL +"/update-eugdpr-consent-status",
        method: "GET",
        type: "json",
        data: {
                 'status' : status,
             },
        success:function(response){
            if (response.success){
                site.notifySuccess(response.message);
                 $("#eugdpr-consent-popup").modal("hide");
            }
        },
        error: function(response){
            //alert("Sorry, pleasdde try again.")
        }
    });

    },
    onfbhashchange:function(){console.log(window.location.hash);
        if(window.location.hash && window.location.hash == '#_=_'){
            window.location.hash = "";
            history.pushState('', document.title, window.location.pathname); // nice and clean
            //e.preventDefault(); // no page reload
        }
    },
    
    copyWaitingPageUrl: function(e) {
        e.preventDefault();
        var copyText = $(this).attr('data-copy-url');        
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(copyText).select();
        document.execCommand("copy");
        $temp.remove();
        site.notifySuccess("URL Copied");
        return false;
    },
    getUpcomingLiveClassNotification:function(e){
       // e.preventDefault();
        $.ajax({
            url: APP_URL + "/get-upcoming-live-classes",
            method: "GET",
            type: "json",
            success:function(response){
                
                if (response.success == true){
                      $('body').find('div#page').append(response.html);
                }
            },
            error: function(response){
                //alert("Sorry, pleasdde try again.")
            }
        });
    },
    updateNotGoingLiveStatus:function(e){
        e.preventDefault();
        var current = $(this);
        var liveClassId = current.closest('.live_timer_data').find('input[name="liveClassId"]').val();
        var userId = current.closest('.live_timer_data').find('input[name="userId"]').val();
        var courseId = current.closest('.live_timer_data').find('input[name="courseId"]').val();
        $.ajax({
            url: APP_URL + "/update-live-notgoing-status",
            method: "GET",
            type: "json",
            async : false,
            data : {liveClassId:liveClassId,
                    userId:userId,
                    course:courseId},
            success:function(response){
                
                if (response.success == true){
                        current.closest('.live_timer_data').hide();
                }
            },
            error: function(response){
                //alert("Sorry, pleasdde try again.")
            }
        });

    },
    registerUserToLiveClass:function(e){
        e.preventDefault();
        var current = $(this);
        var liveClassId = current.closest('.live_timer_data').find('input[name="liveClassId"]').val();
        var userId = current.closest('.live_timer_data').find('input[name="userId"]').val();
        var courseId = current.closest('.live_timer_data').find('input[name="courseId"]').val();
        var scheduleId = current.closest('.live_timer_data').find('input[name="liveScheduleId"]').val();
        $.ajax({
            url: APP_URL + "/register-user-to-live-class",
            method: "GET",
            type: "json",
            async : false,
            data : {liveClassId:liveClassId,
                    userId:userId,
                    course:courseId,
                    scheduleId:scheduleId},
            success:function(response){
                
                if (response.success == true){
                   // site.notifySuccess("User Registered Successfully.");
                     current.closest('#live-upcoming-notification').remove();
                     site.getUpcomingLiveClassNotification();
                }
            },
            error: function(response){
                //alert("Sorry, pleasdde try again.")
            }
        });
    },

    validateEmail : function (email, classname){
        if (email == '' || typeof (email) == 'undefined'){
            $(classname).html('This field is required.').show();
            return false;
        }
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if (! emailReg.test( email )){
            $(classname).html('The email must be a valid email address.').show();
            return false;
        }
        return true;
    },
    closeUpcomingLiveNotification:function(){
        var current = $(this);
        var data = current.attr('data-live-ids');
        //var regOrNot = current.attr('data-reg'); 
        current.closest('#live-upcoming-notification').remove();
        $.ajax({
            url: APP_URL + "/updateNotificationSession",
            method: "GET",
            type: "json",
            async : false,
            data : {liveid:data},
            success:function(response){
                if (response=='success'){
                        console.log("cookie session updated successfully");
                }
            },
            error: function(response){
                //alert("Sorry, pleasdde try again.")
            }
        });
    },
    joinLiveClassNow:function(e){
        e.preventDefault();
        var current = $(this);
         var liveClassId = current.closest('.live_timer_data').find('input[name="liveClassId"]').val();
        var userId =  current.closest('.live_timer_data').find('input[name="userId"]').val();
        var courseId =  current.closest('.live_timer_data').find('input[name="courseId"]').val();
        var scheduleId =  current.closest('.live_timer_data').find('input[name="liveScheduleId"]').val();
        $.ajax({
            url: APP_URL + "/join-ongoing-live-class",
            method: "GET",
            type: "json",
            async : false,
            data : {liveClassId:liveClassId,
                    userId:userId,
                    course:courseId,
                    scheduleId:scheduleId},
            success:function(response){
                if (response.status == 1){
                    var url = APP_URL +"/courses/" + response.cslug + "/contents/" + response.lessonId;
                    //console.log(url);
                    window.location.href = url;
                   // window.location.reload();
                }
            },
            error: function(response){
                //alert("Sorry, pleasdde try again.")
            }
        });
    },
   
    
    
    
    /*hideCurriculumBlockTitle : function (){
        var curriculum_block = $('div.course-curriculum');
        if (curriculum_block.length > 0){
            var contents = curriculum_block.find('div#zen_cs_cur_dynamic');
            if (!$.trim(contents.html())) {
                curriculum_block.remove();
            }
        }
        return true;

    },
    hidePricingBlockTitle : function (){
        var pricing_block = $('div.pricing');
        if (pricing_block.length > 0){
            var contents = pricing_block.find('div#zen_cs_plans_dynamic');
            if (!$.trim(contents.html())) {
                pricing_block.remove();
            }
        }
        return true;
    }*/
};
$(site.ready);
