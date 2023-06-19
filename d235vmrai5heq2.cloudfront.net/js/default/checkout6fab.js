var checkout = {
    ready: function (){

        //$('body').off('submit','form[id="buy-course"]').on('submit','form[id="buy-course"]', checkout.submitPaymentForm);
        //$('body').off('click','a.redeem-coupon-cancel').on('click','a.redeem-coupon-cancel', checkout.hideRedeemCoupon);
        //$('body').off('click','a.card-change').on('click','a.card-change', checkout.showAddCardForm);
        //$('body').off('click','a.saved-card').on('click','a.saved-card', checkout.hideAddCardForm);
        
        //Authenticate
        $('body').off('click','a.has-password').on('click','a.has-password', checkout.togglePasswordField);
        $('body').off('click','a.no-password').on('click','a.no-password', checkout.togglePasswordField);
        $('body').off('click','a.check-email').on('click','a.check-email', checkout.checkEmail);
        $('body').off('click','a.login-btn').on('click','a.login-btn', checkout.loginUser);
        $('body').off('click','a.logout-btn').on('click','a.logout-btn', checkout.logoutUser);

        //Coupon
        $('body').off('click','a.coupon').on('click','a.coupon', checkout.showCouponBox);
        $('body').off('click','a.redeem-coupon').on('click','a.redeem-coupon', checkout.showCouponDiscount);
        $('body').off('click','a.remove-coupon').on('click','a.remove-coupon', checkout.removeCoupon);
        //Country change
        $('body').off('change','select.country-list').on('change','select.country-list', checkout.showCountryVat);

        //Submti VATID
        $('body').off('click','a.vat-id').on('click','a.vat-id', checkout.showVatIdBox);
        $('body').off('click','button.btn-vatid').on('click','button.btn-vatid', checkout.submitVatId);

        //Change Plan
        //$('body').off('click','input.course-plan').on('click','input.course-plan', checkout.showPlanDetails);
        $('body').off('click','div.plan-list').on('click','div.plan-list', checkout.showPlanDetails);
        
        //Order Bump
        $('body').off('click','input[name="addtoorder"]').on('click','input[name="addtoorder"]', checkout.addToOrder);

        $('#checkout_extra_inputs .checkout-inputs').find('input').off('focus').on('focus', function(){
            $(this).closest('.form-group').removeClass('has-error').find('.msg-text').hide();
        });
        
        $('#email').off('focus').on('focus', function(){
            $(this).closest('.form-group').removeClass('has-error').find('.contact-info-error-text').hide();
        });
        
        $('.live-chk').find('#checkout_extra_inputs .checkout-inputs').find('input').off('focus').on('focus', function(){
            $(this).css('border-color', '');
            $(this).next('.msg-text').hide();
        });
        
        $('.live-chk').find('#email').off('click').on('click', function(){
            $(this).css('border-color', '');
            $(this).next('.contact-info-error-text').hide();
        });
        

        checkout.checkEmailInput();
        checkout.checkCouponInput();
        checkout.checkPasswordInput();

        var u_email = $('div.contact-info').find('input[name="email"]').val();
        if (u_email != ''){
            $('div.contact-info').find('input[name="cu_id"]').val(1);
        }

        $('div.checkout').find('input[name="vat_id"]').val('');
        //$('div.checkout').find('input[name="coupon_code"]').val('');
        $('div.checkout').find('div.vat-verified').html('');
        //$('div.checkout').find('input[name="c_er"]').val(1);

        //CHOOSE PAYMENT GATEWAY
        /*$('body').off('click','div.payment-gateway input[name="payment-type"]').on('click','div.payment-gateway input[name="payment-type"]', checkout.chooseGateway);
        $('div.payment-gateway').find('input:radio[value="1"]').attr("checked", true);*/
        $('body').off('click','.checkout-button').on('click','.checkout-button', checkout.processPayment);
        
        //$('input[name="odrbp"]').prop("disabled", true);

        //$('body').off('click','.free-button').on('click','.free-button', checkout.enrollFree);
        /*if ( sessionStorage.paypalError == 1 ) { //IN CASE OF PAYPAL ERROR
            paypalpay.appendError();
            sessionStorage.paypalError = 0;//alert(sessionStorage.paypalError);
        }*/
        checkout.showCardBlockedPopup();
        
        checkout.statesList();
        
        /*$('body').off('change','#state').on('change','#state', function (){
            $('input[name=state-detected').val($(this).val());
            checkout.showCountryVat();
        });*/
        



    },
    statesList : function (){
        if(states.length > 0 && $('#state').length > 0){
            var states_arr = [];
            $.each(states, function (index, state) {
                states_arr.push({
                    id: state.id,
                    text: state.state
                });
            });
            $('#state').select2({
                width: '100%',
                allowClear: true,
                maximumSelectionSize: 1,
                placeholder: "State",
                data: states_arr  
            });
            $("#state").val(detected_state_id).trigger("change");
            
            $("#state").on('change', function (){
                $('input[name=state-detected').val($(this).val());
                checkout.showStateVat();
            });
        
        }else if (states.length == 0 && $('#state').length > 0 && $('#state').data('select2')){
            $("#state").val("");
            $('#state').select2('destroy'); 
        }
    },
    showCardBlockedPopup : function (){
        $.ajax({
            url: APP_URL + "/show-card-declined-popup",
            method: "GET",
            type: "json",
            beforeSend : function(){

            },
            complete   : function(){

            },
            success:function(response){//console.log(response);


                if (response.success){
                    if (response.popup == 1){
                        $('div.alert').remove();
                        swal({
                            title: "Your card is declined. Please contact your Bank/Issuer for more information",
                            text: "If you have already confirmed, please continue purchase",
                            type: "warning",
                            showCancelButton: true,
                            cancelButtonClass: "btn-default",
                            confirmButtonClass: "btn-danger",
                            confirmButtonText: "Continue",
                            closeOnConfirm: true
                        },
                        function(isConfirm){
                            if (isConfirm) {

                            }else{
                                window.location = window.location .protocol + "//" + window.location.host + "/courses/" + slug;
                            }
                        });
                    }
                }
            },
            error: function(response){
                //alert("Sorry, please try again.")
            }
        });
    },
    checkEmailInput : function (){
        // e.type is the type of event fired
        var user_outer = $('div.user-details');
        var u_id = user_outer.closest('div.contact-info').find('input[name="cu_id"]');
        
        var form = $('form#checkout-form');
        
        user_outer.find('input#email:visible').on('keyup keypress change', function(e) {console.log("wer")
            var contact_outer = $(this).closest('div.user-details');

            //if (e.type == 'keypress'){
                    var key = e.which;
                    if(key == 13)  // the enter key code
                    {
                        //contact_outer.find('div.continue-btn').addClass('hide');
                        contact_outer.find('a.check-email').trigger( "click" );
                        
                        var s_email = user_outer.closest('div.contact-info').find('input[name="sEmail"]').val();
                        var email = user_outer.closest('div.contact-info').find('input[name="email"]').val();
                        var sLogin = user_outer.closest('div.contact-info').find('input[name="sLogin"]').val();
                        if(sLogin == 1){
                            if(email!=s_email){
                               $("#sLogin").val("0");
                               $("#sProvider").val('');
                               $("#sId").val('');
                               $("#sEmail").val('');
                                var spath = user_outer.closest('div.contact-info').find('input[name="sPath"]').val();
                                window.history.pushState("object or string", "Title", spath);
                                //alert(url);
                            }
                        }
                       //e.preventDefault();
                    }else{
                        u_id.val("");
                        //$('form#checkout-form').find('.btn-gtw').prop('disabled', true); //button disabled
                        contact_outer.find('span.check-login').removeClass("hide");

                        //var user_val = contact_outer.closest('div.contact-info').find('input[name="cu_id"]').val();
                        if ($(this).val() != ''){
                            contact_outer.find("div.password-box").addClass("hide");
                            contact_outer.find('div.continue-btn').removeClass('hide');
                            contact_outer.find('div.email-outer').removeClass("has-success");
                            contact_outer.find('span.st-icon').addClass("hide");
                            /*if (contact_outer.find('div.jqGdprCheckbox').length > 0) {
                                contact_outer.find('div.jqGdprCheckbox').removeClass("hide");
                            }*/
                        }else{
                            contact_outer.find('div.continue-btn').addClass('hide');
                            $(this).closest('div.has-error').removeClass('has-error');
                            contact_outer.closest('div.contact-info').find('div.message ul').html("");
                        }
                    }
            //}



        });
        user_outer.find('input#email:visible').on('blur', function(e) {
            if (user_outer.find('input#email:visible').val() != '' && u_id.val() == ''){
                user_outer.find('a.check-email').trigger( "click" );
            }else{
                if (u_id.val() == ''){
                    user_outer.find('div.email-outer').removeClass('has-error has-success');
                    user_outer.closest('div.contact-info').find('div.message ul').html("");
                    user_outer.find('span.st-icon').addClass("hide");
                    if (paypalpay.paypal_verified == 1){
                        paypalpay.initPaypal();
                    }
                }
            }
        });

        /*user_outer.find('input#email:visible').on('keydown', function(e) {
            //Enter key pressed
            //if (e.type == 'keypress'){
                var key = e.which;
                if(key == 9)  // the enter key code
                {
                  user_outer.find('a.check-email').trigger( "click" );
                  //e.preventDefault();
                }
            //}
        });*/


    },
    checkCouponInput : function (){
        $('div.order-summary-box input.coupon').on('keyup keypress change', function(e) {
            var coupon_outer = $(this).closest('tr.coupon-input');

            if ($(this).val() != ''){
                coupon_outer.find('a.redeem-coupon').removeClass('hide');
            }else{
                coupon_outer.find('a.redeem-coupon').addClass('hide');
                coupon_outer.find('div.has-error').removeClass('has-error');
                coupon_outer.find('div.message').html("");
                coupon_outer.find('span.st-icon').addClass("hide");
            }

            //Enter key pressed
            if (e.type == 'keypress'){
                var key = e.which;
                if(key == 13)  // the enter key code
                {
                    coupon_outer.find('a.redeem-coupon').trigger( "click" );
                    //e.preventDefault();
                }
            }
        })

        $('div.order-summary-box input.coupon').on('blur', function(e) {
            var coupon = $('div.order-summary-box input.coupon');
            if (coupon.val() != ''){
                $('div.order-summary-box').find('a.redeem-coupon').trigger( "click" );
            }else{
                coupon.closest('tr.coupon-input').find('span.st-icon').addClass("hide");
            }
        });


    },
    checkPasswordInput : function (){
        var user_outer = $('div.user-details');

         user_outer.find('input#password:visible').on('keypress', function(e) {

            var key = e.which;
            if(key == 13)  // the enter key code
            {
                user_outer.find('a.login-btn').trigger( "click" );

            }

        });

        user_outer.find('input#password:visible').on('blur', function(e) {

            user_outer.find('a.login-btn').trigger( "click" );

        });

    },
    togglePasswordField : function (){
        var user_password = $(this).closest('div.user-details').find('div.password-box');
        var has_password = $(this).closest('span.check-login').find('p.has-password');
        var no_password = $(this).closest('span.check-login').find('p.no-password');
        var live_no_password = user_password.find('p.no-password');
        var live_has_password = $(this).closest('div.user-details').find('div.email-outer').find('span.check-login').find('p.has-password');
        var pass_input = $(this).closest('div.user-details').find('input[name="has-password"]');
        var email_input = $(this).closest('div.user-details').find('input[name="email"]');
        var continue_btn = $(this).closest('div.user-details').find('div.continue-btn');
        if (user_password.is(":visible")){
            user_password.addClass('hide');
            pass_input.val(0);
            if (email_input.val() != ''){
                continue_btn.removeClass('hide');
            }
            has_password.removeClass('hide');
            live_has_password.removeClass('hide');
            no_password.addClass('hide');
            live_no_password.addClass('hide');

        }else{
            user_password.removeClass('hide');
            pass_input.val(1);
            continue_btn.addClass('hide');
            has_password.addClass('hide');
            no_password.removeClass('hide');
            live_no_password.removeClass('hide');
        }

        /*if (has_password.is(":visible")){
            has_password.addClass('hide');
            no_password.removeClass('hide');
        }else{
            has_password.removeClass('hide');
            no_password.addClass('hide');
        }*/

    },
    checkEmail: function(){
        var current = $(this);
        var contact_outer = current.closest("div.user-details");
        var email = contact_outer.find('input[name="email"]').val();
        var form = current.closest('form');

        var msg_box = contact_outer.closest('div.contact-info').find('div.message ul');
        //msg_box.html("");
        
        var s_email = contact_outer.closest('div.contact-info').find('input[name="sEmail"]').val();
        var email = contact_outer.closest('div.contact-info').find('input[name="email"]').val();
        var sLogin = contact_outer.closest('div.contact-info').find('input[name="sLogin"]').val();
        if(sLogin == 1){
            if(email!=s_email){
               $("#sLogin").val("0");
               $("#sProvider").val('');
               $("#sId").val('');
               $("#sEmail").val('');
                var spath = contact_outer.closest('div.contact-info').find('input[name="sPath"]').val();
                window.history.pushState("object or string", "Title", spath);
                //alert(url);
            }
        }

        $.ajax({
            url: APP_URL + "/check-email",
            method: "POST",
            type: "json",
            data: form.serialize(),
            beforeSend : function(){
                site.blockElement(contact_outer);
            },
            complete   : function(){
                site.unblockElement(contact_outer);
            },
            success:function(response){

                if (response.success){
                    if (response.show_password){
                        //msg_box.find('span').prepend(response.messages);
                        msg_box.addClass("has-success");
                        contact_outer.find('div.continue-btn').addClass('hide');
                        contact_outer.find('div.password-box').removeClass('hide');
                        /*if (contact_outer.find('div.jqGdprCheckbox').length > 0) {
                            contact_outer.find('div.jqGdprCheckbox').addClass("hide");
                        }*/
                        site.showSuccessMsg(response.message, msg_box);

                        var has_password = contact_outer.find('p.has-password');
                        var no_password = contact_outer.find('p.no-password');
                        var pass_input = contact_outer.find('input[name="has-password"]');
                        pass_input.val(1);
                        has_password.addClass('hide');
                        no_password.removeClass('hide');
                        contact_outer.closest('div.contact-info').find('input[name="cu_id"]').val('');

                        checkout.checkEmailInput();
                        checkout.checkPasswordInput();
                    }else{
                        //window.location.reload();
                        msg_box.html("");
                        contact_outer.find('div.err-msg').html('');
                        /*var c_outer = contact_outer.closest('div.contact-info');
                        c_outer.find('div.logged-info').removeClass('hide');
                        c_outer.find('div.user-details').addClass('hide');
                        c_outer.find('div.logged-info').find('input[name="email"]').val(response.email);
                        c_outer.find('input[name="cu_id"]').val(response.id);*/
                        contact_outer.find('div.email-outer').addClass("has-success");
                        contact_outer.find('div.email-outer').removeClass("has-error");
                        contact_outer.find('span.st-icon').removeClass("hide");
                        contact_outer.find('div.continue-btn').addClass("hide");
                        contact_outer.find('span.check-login').addClass("hide");
                        //var preview = site.getParameterByName('preview', $(this).attr("href"));
                        //if (preview != "on"){
                            contact_outer.closest('div.contact-info').find('input[name="cu_id"]').val(1);
                            if (paypalpay.paypal_verified == 1){ //if paypal button is loaded correctly, then only call the function else shows error
                                paypalpay.initPaypal();
                            }
                        //}
                        /*if(contact_outer.find('div.jqGdprCheckbox').length > 0) {
                            contact_outer.find('div.jqGdprCheckbox').removeClass("hide");
                        }*/
                        var card_info = $('form#checkout-form').find('div.cc-payment:visible').find('input[name="c_er"]');
                        //$('form#checkout-form').find('.btn-gtw').prop('disabled', false);//button disabled
                        if (card_info.length > 0){//for free course button should be enabled. but for paid course if there is card error button should be enabled
                            if ($('form#checkout-form').find('input[name="c_er"]').val() == 0){
                                //$('form#checkout-form').find('.btn-gtw').prop('disabled', false); //button disabled
                            }else{
                                //$('form#checkout-form').find('.btn-gtw').prop('disabled', true); //button disabled
                            }
                        }

                        //checkout.checkEmailInput();
                    }
                }else{
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
                alert("Sorry, please try again.")
            }
        });
    },
    loginUser: function(){
        var current = $(this);
        var contact_outer = current.closest("div.user-details");
        var form = current.closest('form');
        var url = '';
        if (form.find('input[name="product-type"]').length > 0){
            var slug = form.find('input[name="slug"]').val();
            var p_type = form.find('input[name="product-type"]').val();
            var plan_id = form.find('input[name="p_id"]').val();
            var s_id = form.find('input[name="live_class_schedule_id"]').val();
            if (p_type == 3){ //live-class
                var l_c_type = form.find('input[name="l_c_type"]').val();
                url = APP_URL + '/live-class/' + slug + '/buy/' + plan_id +'?live_schedule_id=' + s_id;
                if(l_c_type = 2){
                    url = APP_URL + '/1-1-booking/' + slug + '/buy/' + plan_id +'?live_schedule_id=' + s_id;
                }
            }else if (p_type == 4){
                url = APP_URL + '/live-webinar/' + slug + '/buy/' + plan_id +'?live_schedule_id=' + s_id;
            }
        }else{
            //for courses
            if (current.closest('div.checkout').find('div.zen-plan-active').length > 0){// more than 1 plan case
                url = current.closest('div.checkout').find('div.zen-plan-active').find('input.plan-url').val();
            }else{//single plan case
                url = current.closest('div.checkout').find('input.single-plan').val();
            }
        }

        var msg_box = contact_outer.closest('div.contact-info').find('div.message ul');
        //msg_box.html("");
        var coupon =  current.closest('div.checkout').find('input[name="coupon_code"]').val();
        //only redeem coupon click case , not coupon url case. For coupon url cookie will handle , this case coupon should be applicable to the current course only
        if (coupon != '' && site.getParameterByName('coupon', url) == null){ 
            url = url + '?l-coupon=' + coupon;
        }
        $.ajax({
            url: APP_URL + "/login-user",
            method: "POST",
            type: "json",
            data: form.serialize(),
            beforeSend: function(){
                //site.blockUI();
            },
            complete: function (){
                //site.unblockUI();
            },
            success:function(response){

                if (response.success){
                    /*if (coupon != ""){
                        url += '?coupon=' + coupon; // issue ?copuon=a?coupon=a
                    }*/
                    window.location = url;
                    //window.location.reload();
                    //Done as reload bcoz if card is already saved and vat submitted it should reflect
                    //jQuery.data(document.body, "user_id", response.id );
                    /*var c_outer = contact_outer.closest('div.contact-info');
                    c_outer.find('div.logged-info').removeClass('hide');
                    c_outer.find('div.user-details').addClass('hide');
                    c_outer.find('div.logged-info').find('input[name="email"]').val(response.email);
                    c_outer.find('input[name="cu_id"]').val(response.id);*/
                }else{
                    msg_box.removeClass("has-success");
                    var errors = response.messages;
                    var error = '';
                    $.each( errors, function( key, value ) {
                        error += '<span class="contact-info-error-text text-danger">'+value+'</span>';
                    });
                    contact_outer.find('div.err-msg').html(error);
                    //site.listErrors(errors, msg_box);
                    contact_outer.find('div.email-outer').addClass("has-error");

                }
            },
            error: function(response){
                //alert("Sorry, please try again.");
            }
        });
    },
    logoutUser: function(){

        $.ajax({
            url: APP_URL + "/logout-user",
            method: "GET",
            type: "json",
            beforeSend: function(){
                site.blockUI();
            },
            complete: function (){
                site.unblockUI();
            },
            success:function(response){

                if (response.success){
                    window.location.reload();

                }else{
                    alert("Sorry, please try again.")
                }
            },
            error: function(response){
                //alert("Sorry, please try again.")
            }
        });
    },
    showCouponBox: function (){
        $(this).closest('div.order-summary-box').find('tr.coupon-input').removeClass('hide');
        $(this).closest('tr.redeem-coupon-box').hide();
    },
    showCouponDiscount: function(){
        var current = $(this);
        var coupon_box = current.closest('tr.coupon-input');
        var checkout_outer = current.closest('div.checkout');
        var coupon = coupon_box.find('input[name="coupon"]').val();
        var course = checkout_outer.find('input[name="c_id"]').val();
        var plan = checkout_outer.find('input[name="p_id"]').val();
        var country = checkout_outer.find('.country-list').val();
        var vatid = checkout_outer.find('input[name="vat_id"]').val();
        var cu_id = checkout_outer.find('input[name="cu_id"]').val();
        var ord_bmp = checkout_outer.find('input[name="odrbp"]');
        var cnt_changed = checkout_outer.find('input[name="cnt_changed"]').val();
        var state = checkout_outer.find('input[name="state-detected"]').val();

        var url = APP_URL + "/course/redeem-coupon";
        var data = { course:course, plan:plan, coupon:coupon, country:country, vatid:vatid, ord_bmp:ord_bmp.val(), cnt_changed:cnt_changed , state:state};
        if (checkout_outer.find('input[name="product-type"]').length > 0){
            var p_type = checkout_outer.find('input[name="product-type"]').val();
            if (p_type == 3){ //live-class
                url = APP_URL + '/live-session/redeem-coupon';
                var liveclass = checkout_outer.find('input[name="live_class_id"]').val();
                data = { livesession:liveclass, plan:plan, coupon:coupon, country:country, vatid:vatid, p_type:p_type, cnt_changed:cnt_changed , state:state};
            }else if (p_type == 4){
                url = APP_URL + '/live-session/redeem-coupon';
                var livewebinar = checkout_outer.find('input[name="webinar_id"]').val();
                data = { livesession:livewebinar, plan:plan, coupon:coupon, country:country, vatid:vatid, p_type:p_type, cnt_changed:cnt_changed , state:state};
            }
        }
        
        if (coupon){
            $.ajax({
                url: url,
                method: "GET",
                type: "json",
                data: data ,
                beforeSend: function(){
                     site.blockElement(coupon_box);
                },
                complete: function (){
                     site.unblockElement(coupon_box);
                },
                success:function(response){
                    if (response.success){
                        var show_paypal = 0; //for paypal rec
                        checkout_outer.find('div.order-summary-box').replaceWith(response.order_summary);
                        checkout.checkCouponInput();
                        
                        
                        checkout_outer.find('input[name="coupon_code"]').val(coupon);
                        paypalpay.getPaypalAttributes();
                        //checkout_outer.find('input[name="discount_applied_'+plan+'"]').val(1);
                        //Hide payment info for full off coupon for one time plans and subscription plans with coupon forever
                        if (! response.final_price > 0){console.log("sss");
                            if (! response.recurring){
                                checkout_outer.find('.payment-outer').hide();
                                checkout_outer.find('button.zen-subscribe:first').removeClass('hide').show();
                                checkout_outer.find('div.agree-text:first').removeClass('hide').show();
                                /*if (cu_id != ""){
                                    $('form#checkout-form').find('.btn-gtw').prop('disabled', false);
                                }*/ //button disabled
                            }else {console.log("vvvv");
                                if (! response.coupon_repeating && ! response.obp_free_trial){console.log("sdsd");
                                    checkout_outer.find('.payment-outer').hide();
                                    checkout_outer.find('button.zen-subscribe:first').removeClass('hide').show();
                                    checkout_outer.find('div.agree-text:first').removeClass('hide').show();
                                    /*if (cu_id != ""){
                                        $('form#checkout-form').find('.btn-gtw').prop('disabled', false);
                                    }*///button disabled
                                }else{console.log("nnnn");
                                    show_paypal = 1; //for paypal rec
                                    checkout_outer.find('.payment-outer').removeClass('hide');
                                    checkout_outer.find('.payment-outer').show();
                                    checkout_outer.find('div.agree-text').show();
                                }
                            }console.log("nop");
                            if (show_paypal == 0){
                                checkout_outer.find('div#paypal-button-container').hide();
                                checkout_outer.find('div#paypal-rec-button-container').hide();
                                checkout_outer.find('.paypal-outer:visible').addClass('hide');
                                checkout_outer.find('div.paypal-op').hide();
                            }
                            checkout_outer.find('div.razorpay-outer').hide();
                            //checkout_outer.find('.f-c-buy:hidden').removeClass('hide');//alert(checkout_outer.find('.zen-subscribe:hidden').length)
                            //checkout_outer.find('.sp-buy:visible').hide();
                            if (response.only_paypal == 1 && ! response.recurring){console.log("bbbb");
                                checkout_outer.find('.f-c-buy:hidden').removeClass('hide');//alert(checkout_outer.find('.zen-subscribe:hidden').length)
                                checkout_outer.find('.sp-buy:visible').hide();
                            }console.log("fgfgfgf");console.log(response.paid_trial_full_coupon)
                        }
                        if(response.paid_trial_full_coupon){
                            checkout_outer.find('div#paypal-rec-button-container').attr("id","paypal-button-container");
                        }console.log("ddd");console.log(response.paid_trial_full_coupon);
                    }else{
                        var coupon_input = coupon_box.find('input[name="coupon"]').closest('div');
                        coupon_input.addClass('has-error');
                        coupon_input.find('span').removeClass("hide");
                        coupon_input.find('div.message').html(response.message);
                    }
                    /*
                    var c_error_message = coupon_box.find('.coupon-error-message');
                    var c_success_message = coupon_box.find('.coupon-success-message');
                    if (response.success){
                        checkout_outer.find('div.plan-price').html(response.plan_price);
                        var order_summary = checkout_outer.find('div.check-order-summery');


                        if (response.discount != ''){
                            order_summary.find('table tbody tr.coupon-discount').html('');
                            order_summary.find('table tbody tr.course-price').after(response.discount);
                        }

                        if (response.vat != ''){
                            order_summary.find('table tbody tr.vat-details').html('');
                            order_summary.find('table tbody').append(response.vat);
                        }


                        checkout_outer.find('div.total-price').html(response.total);


                        c_error_message.addClass('hide');
                        c_success_message.removeClass('hide');
                        c_success_message.html(response.message);
                        coupon_box.find('div.coupon-outer').hide();*/


                    /*}else{
                        c_error_message.removeClass('hide');
                        c_success_message.addClass('hide');
                        c_error_message.html(response.message);

                    }*/
                },
                error: function(response){
                    //alert("Sorry, please try again.")
                }
            });
        }
        return false;
    },
    removeCoupon: function(){
        var current = $(this);
        var coupon_box = current.closest('tr.coupon-input');
        var checkout_outer = current.closest('div.checkout');
        var course = checkout_outer.find('input[name="c_id"]').val();
        checkout_outer.find('input[name="coupon_code"]').val("");
        var plan = checkout_outer.find('input[name="p_id"]').val();
        var country = checkout_outer.find('.country-list').val();
        var vatid = checkout_outer.find('input[name="vat_id"]').val();
        var cu_id = checkout_outer.find('input[name="cu_id"]').val();//alert("dfd");return false;
        var ord_bmp = checkout_outer.find('input[name="odrbp"]');
        var page_captcha = checkout_outer.find('input[name="page_captcha"]').val();
        var page_captcha_type = checkout_outer.find('input[name="page_captcha_type"]').val();
        var site_key = checkout_outer.find('input[name="site_key"]').val();
        var cnt_changed = checkout_outer.find('input[name="cnt_changed"]').val();
        var state = checkout_outer.find('input[name="state-detected"]').val();
        
        var url = APP_URL + "/course/remove-coupon";
        var data = { course:course, plan:plan, country:country, vatid:vatid, page_captcha: page_captcha, page_captcha_type : page_captcha_type, ord_bmp:ord_bmp.val(), cnt_changed:cnt_changed, state:state };
        if (checkout_outer.find('input[name="product-type"]').length > 0){
            var p_type = checkout_outer.find('input[name="product-type"]').val();
            if (p_type == 3){ //live-class
                url = APP_URL + '/live-session/remove-coupon';
                var liveclass = checkout_outer.find('input[name="live_class_id"]').val();
                data = { livesession:liveclass, plan:plan, country:country, vatid:vatid, page_captcha: page_captcha, page_captcha_type : page_captcha_type, p_type:p_type, cnt_changed:cnt_changed, state:state};
            }else if (p_type == 4){
                url = APP_URL + '/live-session/remove-coupon';
                var livewebinar = checkout_outer.find('input[name="webinar_id"]').val();
                data = { livesession:livewebinar, plan:plan, country:country, vatid:vatid, page_captcha: page_captcha, page_captcha_type : page_captcha_type, p_type:p_type, cnt_changed:cnt_changed, state:state};
            }
        }
        
        $.ajax({
            url: url,
            method: "GET",
            type: "json",
            data: data,
            beforeSend: function(){
                 site.blockElement(coupon_box);
            },
            complete: function (){
                 site.unblockElement(coupon_box);
            },
            success:function(response){
                if (response.success){
                    var data = response.checkout_data;
                    var checkout_container = checkout_outer.closest('div.checkout-container');
                    var plan_features = response.plan_features;//$(data).find('div.plan-features').html();
                    var summary = $(data).find('div.summary-outer').html();
                    var payment_info = $(data).find('div.payment-panel').html();
                    var plan_list = $(data).find('div.pricing-plans').html();
                    //checkout_container.find('div.plan-features').html(plan_features);
                    checkout_container.closest('div#page').find('div.plan-features').html(plan_features);
                    checkout_container.find('div.summary-outer').html(summary);
                    checkout_container.find('div.payment-panel').html(payment_info);
                    checkout_container.find('div.pricing-plans').html(plan_list);
                    /*checkout_outer.closest('div.checkout-container').html(response.checkout_data);*/
                    checkout.checkEmailInput();
                    checkout.checkPasswordInput();
                    checkout.checkCouponInput();
                    paypalpay.getPaypalAttributes();
                    if (paypalpay.paypal_verified == 1){ //if paypal button is loaded correctly, then only call the function else shows error
                        /*var btn_color  = 'silver';
                        if (cu_id == 1){
                            btn_color  = 'gold';
                        }*/
                        paypalpay.initPaypal();
                    }
                    var checkout_form = checkout_outer.find("#checkout-form").find("div.cc-payment:visible");
                    if (checkout_form.length > 0 ){
                        stripe.initializeStripeVariables();
                        stripe.validatePaymentForm();
                    }
                    if (page_captcha == 1 && page_captcha_type == 'invisible' && checkout_outer.find('.checkout-button:visible').length > 0){
                        var c_button = checkout_outer.find('.checkout-button:visible')[0];
                         grecaptcha.render(c_button, {
                            'sitekey'  : site_key,
                            'callback' : checkout.processPayment,
                            'size'     : 'invisible',
                            'badge'    : 'bottomleft'
                        });
                    }
                    if (page_captcha == 1 && page_captcha_type == 'visible' && checkout_outer.find('div#zen-recaptcha-div').length > 0){
                        grecaptcha.render('zen-visible-captcha', {
                            'sitekey' : site_key
                        });
                    }
                    
                    /*var checkout_top = $('#zen_cs_checkout_top_dynamic');
                    if (response.plan_price > 0){
                        checkout_top.find("div.money-back").removeClass("hide");
                        checkout_top.find("div.free-img").addClass("hide");
                    }else{
                        checkout_top.find("div.money-back").addClass("hide");
                        checkout_top.find("div.free-img").removeClass("hide");
                    }*/
                }

            },
            error: function(response){
                //alert("Sorry, please try again.")
            }
        });


    },
    showCountryVat: function(e){
        var current = $(this);
        var country = current.val();
        var country_list = $(this).closest('div.country');
        var checkout_outer = current.closest('div.checkout');
        var course = checkout_outer.find('input[name="c_id"]').val();
        var plan = checkout_outer.find('input[name="p_id"]').val();
        var coupon = checkout_outer.find('input[name="coupon_code"]').val();
        var state = checkout_outer.find('input[name="state-detected"]').val();
        var sc = 1;
        
        var vatid = "";
        if (checkout_outer.find('input[name="vat_id"]').length > 0){
            vatid = checkout_outer.find('input[name="vat_id"]').val();
        }
        var vat_id_box = checkout_outer.find('div.vat-id-box:first');//alert(vat_id_box.length);
        var ord_bmp = checkout_outer.find('input[name="odrbp"]');
        checkout_outer.find('input[name="cnt_changed"]').val(1); //on cntry chaged, vatid gets removedd, user saved vatid should not be taken in this case

        /*if (checkout_outer.find('div.cc-payment-outer').length > 0){
            vat_id_box = checkout_outer.find('div.cc-payment-outer').find('div.vat-id-box');
        }*/
        var url = APP_URL + "/course/get-tax";
        var p_type = 1;
        var data = { country:country, course:course, plan:plan, coupon:coupon, vatid:vatid, ord_bmp:ord_bmp.val(), p_type:p_type, state: state, sc : sc}
        if (checkout_outer.find('input[name="product-type"]').length > 0){
            p_type = checkout_outer.find('input[name="product-type"]').val();
            if (p_type == 3){ //live-class or webinar
                url = APP_URL + '/live-session/get-tax';
                var livesession = checkout_outer.find('input[name="live_class_id"]').val();
                data = { country:country, livesession:livesession, plan:plan, coupon:coupon, vatid:vatid, ord_bmp:ord_bmp.val(), p_type:p_type, state: state, sc : sc}
            }else if (p_type == 4){
                url = APP_URL + '/live-session/get-tax';
                var livesession = checkout_outer.find('input[name="webinar_id"]').val();
                data = { country:country, livesession:livesession, plan:plan, coupon:coupon, vatid:vatid, ord_bmp:ord_bmp.val(), p_type:p_type, state: state, sc : sc}
            }
        }
        $.ajax({
            url: url,
            method: "GET",
            type: "json",
            beforeSend: function(){
                //site.blockUI();
            },
            complete: function (){
                //site.unblockUI();
            },
            data: data,
            success:function(response){//alert(response.is_eu_country);
                vatid = '';//vatid can be reset if country is changed
                if (vatid == ""){
                    if (response.success){
                         checkout_outer.find('div.order-summary-box').replaceWith(response.order_summary);
                         checkout.checkCouponInput();
                    }
                }
                if (response.show_vat_id){
                    vat_id_box.removeClass("hide");
                    vat_id_box.find('div.vat-id-outer').removeClass("hide").show();
                }else{
                    vat_id_box.addClass("hide");
                    vat_id_box.find('div.vat-id-outer').addClass("hide").hide();
                }
                if (response.is_eu_country) {//alert($('.jqGdprCheckbox').length)
                    $('.jqGdprCheckbox').show();
                } else {
                    $('.jqGdprCheckbox input[name=gdpr]'). prop("checked", false);
                    $('.jqGdprCheckbox').hide();
                }
                country_list.find('input#country_code').val(response.code);
                paypalpay.getPaypalAttributes();
                states = response.states;
                detected_state_id = response.detected_state_id;
                $('input[name=state-detected').val("");
                checkout.statesList();
            },
            error: function(response){
                //alert("Sorry, please try again.")
            }
        });
    },
    
    showStateVat: function(e){
        var checkout_outer = $('div.checkout');
        var country = checkout_outer.find('select[name="country-list"]').val();
        var country_list = checkout_outer.find('div.country');
        var course = checkout_outer.find('input[name="c_id"]').val();
        var plan = checkout_outer.find('input[name="p_id"]').val();
        var coupon = checkout_outer.find('input[name="coupon_code"]').val();
        var state = checkout_outer.find('input[name="state-detected"]').val();
        var sc = 2;
        /*if (typeof(e.target.name) !== "undefined" && e.target.name == 'country-list'){
            sc = 1;
            var country = current.val();
            var country_list = $(this).closest('div.country');
        }else{
            var country = checkout_outer.find('input[name="country_list"]').val();
        }*/

        var vatid = "";
        if (checkout_outer.find('input[name="vat_id"]').length > 0){
            vatid = checkout_outer.find('input[name="vat_id"]').val();
        }
        var vat_id_box = checkout_outer.find('div.vat-id-box:first');//alert(vat_id_box.length);
        var ord_bmp = checkout_outer.find('input[name="odrbp"]');
        checkout_outer.find('input[name="cnt_changed"]').val(1); //on cntry chaged, vatid gets removedd, user saved vatid should not be taken in this case

        /*if (checkout_outer.find('div.cc-payment-outer').length > 0){
            vat_id_box = checkout_outer.find('div.cc-payment-outer').find('div.vat-id-box');
        }*/
        var url = APP_URL + "/course/get-tax";
        var p_type = 1;
        var data = { country:country, course:course, plan:plan, coupon:coupon, vatid:vatid, ord_bmp:ord_bmp.val(), p_type:p_type, state: state, sc : sc}
        if (checkout_outer.find('input[name="product-type"]').length > 0){
            p_type = checkout_outer.find('input[name="product-type"]').val();
            if (p_type == 3){ //live-class or webinar
                url = APP_URL + '/live-session/get-tax';
                var livesession = checkout_outer.find('input[name="live_class_id"]').val();
                data = { country:country, livesession:livesession, plan:plan, coupon:coupon, vatid:vatid, ord_bmp:ord_bmp.val(), p_type:p_type, state: state, sc : sc}
            }else if (p_type == 4){
                url = APP_URL + '/live-session/get-tax';
                var livesession = checkout_outer.find('input[name="webinar_id"]').val();
                data = { country:country, livesession:livesession, plan:plan, coupon:coupon, vatid:vatid, ord_bmp:ord_bmp.val(), p_type:p_type, state: state, sc : sc}
            }
        }
        $.ajax({
            url: url,
            method: "GET",
            type: "json",
            beforeSend: function(){
                //site.blockUI();
            },
            complete: function (){
                //site.unblockUI();
            },
            data: data,
            success:function(response){//alert(response.is_eu_country);
                vatid = '';//vatid can be reset if country is changed
                if (vatid == ""){
                    if (response.success){
                         checkout_outer.find('div.order-summary-box').replaceWith(response.order_summary);
                         checkout.checkCouponInput();
                    }
                }
                if (response.show_vat_id){
                    vat_id_box.removeClass("hide");
                    vat_id_box.find('div.vat-id-outer').removeClass("hide").show();
                }else{
                    vat_id_box.addClass("hide");
                    vat_id_box.find('div.vat-id-outer').addClass("hide").hide();
                }
                if (response.is_eu_country) {//alert($('.jqGdprCheckbox').length)
                    $('.jqGdprCheckbox').show();
                } else {
                    $('.jqGdprCheckbox input[name=gdpr]'). prop("checked", false);
                    $('.jqGdprCheckbox').hide();
                }
                country_list.find('input#country_code').val(response.code);
                paypalpay.getPaypalAttributes();
                /*states = response.states;
                detected_state_id = response.detected_state_id;
                $('input[name=state-detected').val("");
                checkout.statesList();*/
            },
            error: function(response){
                //alert("Sorry, please try again.")
            }
        });
    },
    
    addToOrder: function(){
        var current = $(this);
        var outer = current.closest('div.order-bump-div');
        var ord_bmp = outer.find('input[name="odrbp"]');
        var checkout_outer = current.closest('div.checkout');
        var course = checkout_outer.find('input[name="c_id"]').val();
        var plan = checkout_outer.find('input[name="p_id"]').val();
        var coupon = checkout_outer.find('input[name="coupon_code"]').val();
        var country = checkout_outer.find('.country-list').val();
        var cu_id = checkout_outer.find('input[name="cu_id"]').val();
        var vatid = checkout_outer.find('input[name="vat_id"]').val();
        var state = checkout_outer.find('input[name="state-detected"]').val();
        ord_bmp.val(0);
        if (current.prop('checked') == true){
            ord_bmp.val(1);
        }
            $.ajax({
                url: APP_URL + "/course/add-to-order",
                method: "GET",
                type: "json",
                beforeSend: function(){
                    //site.blockUI();
                },
                complete: function (){
                    //site.unblockUI();
                },
                data: { course : course, plan : plan, coupon : coupon, vatid:vatid, ord_bmp : ord_bmp.val(), country : country, state : state},
                success:function(response){console.log(response);
                        if (response.success){
                            var show_paypal = 1; //for paypal rec
                                checkout_outer.find('div.order-summary-box').replaceWith(response.order_summary);
                                checkout.checkCouponInput();
                            //Hide payment info for full off coupon for one time plans and subscription plans with coupon forever
                            if ( response.final_price > 0){console.log("aaa");
                                checkout_outer.find('.payment-outer').removeClass('hide');
                                checkout_outer.find('.payment-outer').show();
                                if (! response.stripe_connected){console.log("pop");
                                    checkout_outer.find('button.zen-subscribe').hide();
                                    checkout_outer.find('div.agree-text').hide();
                                }
                                if (! response.recurring){console.log("mmm");
                                    checkout_outer.find('div.paypal-outer:first').removeClass('hide');
                                    checkout_outer.find('div#paypal-button-container').show();
                                    checkout_outer.find('div.paypal-op:first').show();
                                }
                                if ((response.recurring && ord_bmp.val() == 1 && response.stripe_connected) || (response.recurring_orderbump == 1 && ord_bmp.val() == 1)) {console.log("ssspp");
                                    checkout_outer.find('div.razorpay-outer').hide();
                                    checkout_outer.find('div.paypal-outer').hide(); //for paypal rec
                                    show_paypal = 0;//for paypal rec
                                }else{console.log('ppodd')
                                    checkout_outer.find('div.razorpay-outer:first').removeClass('hide').show();
                                    checkout_outer.find('div.paypal-outer:first').removeClass('hide').show(); //for paypal rec
                                    checkout_outer.find('div.paypal-op:first').removeClass('hide').show(); //for paypal rec
                                }
                            }else{console.log("bbb");// Total price = 0
                                if (! response.recurring){console.log("111"); // One time plan - dont show card
                                    checkout_outer.find('.payment-outer').hide();
                                    checkout_outer.find('button.zen-subscribe:first').removeClass('hide').show();
                                    checkout_outer.find('div.agree-text:first').removeClass('hide').show();
                                    checkout_outer.find('div.razorpay-outer').hide();
                                    if( response.obp_free_trial){console.log("v22");
                                        checkout_outer.find('.payment-outer').removeClass('hide');
                                        checkout_outer.find('.payment-outer').show();
                                    }
                                }else {console.log("fff");
                                    if (ord_bmp.val() == 1 && ! response.obp_free_trial && coupon!= '' && ! response.coupon_repeating){ // for recurring plan if coupon applicable to all billing hide, also if obp not free trail
                                        checkout_outer.find('.payment-outer').hide();
                                        checkout_outer.find('button.zen-subscribe:first').removeClass('hide').show();
                                        checkout_outer.find('div.agree-text:first').removeClass('hide').show();
                                    }else{console.log("kkk");
                                        checkout_outer.find('.payment-outer').removeClass('hide');
                                        checkout_outer.find('.payment-outer').show();
                                    }
                                    checkout_outer.find('div.razorpay-outer').hide(); //no rzp for rec plans
                                }console.log("cc");
                                checkout_outer.find('div#paypal-button-container').hide();
                                checkout_outer.find('div.paypal-op').hide();
                                if (checkout_outer.find('.payment-outer').length == 0){
                                    checkout_outer.find('button.zen-subscribe:first').removeClass('hide').show();
                                    checkout_outer.find('div.agree-text:first').removeClass('hide').show();
                                }
                            }
                            if (checkout_outer.find('.payment-outer').length > 0 ){
                                stripe.initializeStripeVariables();
                                stripe.validatePaymentForm();
                            }
                            if (response.recurring_orderbump == 1) { //if recurring order bump
                                checkout_outer.find('div.paypal-outer').hide();
                            }else {
                                console.log("pay");
                                if(show_paypal == 1){//for paypal rec
                                    checkout_outer.find('div.paypal-outer:first').show();
                                    checkout_outer.find('div.paypal-op:first').removeClass('hide').show(); //for paypal rec
                                }
                            }
                        }
                },
                error: function(response){
                    //alert("Sorry, please try again.")
                }
            });
        
    },
    showPlanDetails: function(event){
        var current = $(this);
        var checkout_outer = current.closest('div.checkout');
        var plan = current.find('input.course-plan').val();
        //var plan_url = current.find('input.plan-url').val();
        //window.location = plan_url;

        var country = checkout_outer.find('.country-list').val();
        var course = checkout_outer.find('input[name="c_id"]').val();
        var coupon = checkout_outer.find('input[name="coupon_code"]').val();

        //var slug = checkout_outer.find('input[name="hid-slug"]').val();
        checkout_outer.find('input[name="p_id"]').val(plan);
        var vatid = checkout_outer.find('input[name="vat_id"]').val();
        var vat_id_box = checkout_outer.find('div.vat-id-box:first');

        current.closest('div.pricing-plans').find('div.plan-list').removeClass('zen-plan-active');
        current.addClass('zen-plan-active').find('input.course-plan').prop('checked', true) ;

        //Popular plan color
        var popular_plan = current.find(".popular-plan");
        if (popular_plan.length > 0){
            popular_plan.addClass("txt-white");
            popular_plan.removeClass("text-primary");
        }else{
            checkout_outer.find('.popular-plan').removeClass("txt-white");
            checkout_outer.find('.popular-plan').addClass("text-primary");
        }

        var cu_id = checkout_outer.find('input[name="cu_id"]').val();
        
        var page_captcha = checkout_outer.find('input[name="page_captcha"]').val();
        var page_captcha_type = checkout_outer.find('input[name="page_captcha_type"]').val();
        var site_key = checkout_outer.find('input[name="site_key"]').val();

        var page_captcha = checkout_outer.find('input[name="page_captcha"]').val();
        var page_captcha_type = checkout_outer.find('input[name="page_captcha_type"]').val();
        var site_key = checkout_outer.find('input[name="site_key"]').val();
        var ord_bmp = checkout_outer.find('input[name="odrbp"]');
        var state = checkout_outer.find('input[name="state-detected"]').val();
        
        $.ajax({
            url: APP_URL + "/course/choose-plan",
            method: "GET",
            type: "json",
            beforeSend: function(){
               site.blockElement(checkout_outer, true);//to change bg color of overlay, [ass second parameter
            },
            complete: function (){
               site.unblockElement(checkout_outer);
            },
            data: { plan:plan, country:country, course:course, coupon:coupon, vatid:vatid, cu_id:cu_id, page_captcha: page_captcha, page_captcha_type : page_captcha_type, ord_bmp:ord_bmp.val(), state:state},
            success:function(response){console.log(response);
                if (response.success){
                    var data = response.checkout_data;
                    var checkout_container = checkout_outer.closest('div.checkout-container');
                    var plan_features = response.plan_features;//$(data).find('div.plan-features').html();
                    var summary = $(data).find('div.summary-outer').html();
                    var payment_info = $(data).find('div.payment-panel').html();
                    //checkout_container.find('div.plan-features').html(plan_features);
                    checkout_container.closest('div#page').find('div.plan-features').html(plan_features);
                    checkout_container.find('div.summary-outer').html(summary);
                    checkout_container.find('div.payment-panel').html(payment_info);
                    if ( response.plan_price <= 0 || response.hide_obp){
                        checkout_outer.find('div.order-bump-div').addClass('hide');
                    }else{
                        checkout_outer.find('div.order-bump-outer').removeClass('hide');
                        checkout_outer.find('div.order-bump-div').removeClass('hide');
                    }
                    if (response.py_id != ''){
                        checkout_outer.find('input[name="py_id"]').val(response.py_id);
                    }
                    checkout_container.find('input[name="coupon_code"]').val(response.coupon);//coupon code value is to be change because now coupon is plan wise

                    /*checkout_outer.closest('div.checkout-container').html(response.checkout_data);*/
                    checkout.checkEmailInput();
                    checkout.checkPasswordInput();
                    checkout.checkCouponInput();
                    if (paypalpay.paypal_verified == 1){ //if paypal button is loaded correctly, then only call the function else shows error
                        /*var btn_color  = 'silver';
                        if (cu_id == 1){
                            btn_color  = 'gold';
                        }*/
                        paypalpay.initPaypal();
                        paypalpay.getPaypalAttributes();
                    }
                    
                    var checkout_form = checkout_outer.find("#checkout-form").find("div.cc-payment:visible");
                    if (checkout_form.length > 0 ){
                        stripe.initializeStripeVariables();
                        stripe.validatePaymentForm();
                    }
                    
                    if ((response.recurring && ord_bmp.val() == 1 && response.stripe_connected) || (response.recurring_orderbump == 1 && ord_bmp.val() == 1)) {
                        checkout_outer.find('div.razorpay-outer').hide();
                        checkout_outer.find('div.paypal-outer').hide(); //for paypal rec
                    }else if (response.is_daily_plan){
                        checkout_outer.find('div.razorpay-outer').hide();
                    }else{
                        if (response.revenue > 0 || (response.total > 0 && response.plan_price != 0)){
                            checkout_outer.find('div.razorpay-outer:first').removeClass('hide').show();
                            checkout_outer.find('div.paypal-outer:first').removeClass('hide').show(); //for paypal rec
                        }else{
                            checkout_outer.find('div.razorpay-outer').hide();
                            if (coupon!= '' &&  ! response.coupon_repeating){
                                checkout_outer.find('div.paypal-outer').hide(); //for paypal rec
                            }
                        }
                    }
                            
                    if (page_captcha == 1 && page_captcha_type == 'visible' && checkout_outer.find('div#zen-recaptcha-div').length > 0){
                        grecaptcha.render('zen-visible-captcha', {
                            'sitekey' : site_key
                        });
                    }

                    if (page_captcha == 1 && page_captcha_type == 'invisible' && checkout_outer.find('.checkout-button:visible').length > 0){
                        var c_button = checkout_outer.find('.checkout-button:visible')[0];
                         grecaptcha.render(c_button, {
                            'sitekey'  : site_key,
                            'callback' : checkout.processPayment,
                            'size'     : 'invisible',
                            'badge'    : 'bottomleft'
                        });
                    }
                    // var checkout_top = $('#zen_cs_checkout_top_images');
                    // if (response.plan_price > 0){
                    //     checkout_top.find("div.money-back").removeClass("hide");
                    //     checkout_top.find("div.free-img").addClass("hide");
                    // }else{
                    //     checkout_top.find("div.money-back").addClass("hide");
                    //     checkout_top.find("div.free-img").removeClass("hide");
                    // }
                }

                /*var saved_card = checkout_outer.find('div.card-details');
                checkout_outer.find('div.plan-price').html(response.plan_price);
                if (response.free_plan){
                    checkout_outer.find('div.redeem-coupon-box').addClass('hide').end()
                                  .find('div.payment-info').addClass('hide').end()
                                  .find('div.vat-id-box').addClass('hide').end()
                                  .find('div.country').addClass('hide');//.end()
                                  //.find('div.card-details').hide();
                }else{
                    //check both whether coupon is present and whether applied to current plan . If no coupon and coupon not applied to current plan we need to show redeem coupon
                    if (coupon == '' && response.coupon_applied == false){
                        checkout_outer.find('div.redeem-coupon-box').removeClass('hide');
                    }

                    if (saved_card.length > 0){
                        checkout_outer.find('div.payment-info').removeClass('hide').end()
                                      .find('div.cc-payment').addClass('hide').end()
                                      .find('div.card-details').removeClass('hide').end()
                                      .find('div.saved-card-outer').addClass('hide');
                    }else{
                        checkout_outer.find('div.cc-payment').removeClass('hide');
                    }
                    checkout_outer.find('div.country').removeClass('hide');

                    if (response.show_vat_id){
                        vat_id_box.removeClass("hide");
                    }else{
                        vat_id_box.addClass("hide");
                    }

                    //Hide payment info for full off coupon
                    if (response.final_price > 0){
                        checkout_outer.find('.payment-info').show();
                    }else if (response.recurring){
                        checkout_outer.find('.payment-info').show();
                    }else{
                        checkout_outer.find('.payment-info').hide();
                    }

                    //checkout_outer.find('div.vat-id-box').removeClass('hide');
                }

                checkout_outer.find('.btn-gtw').text(response.button_text);

                if (response.plan_features != ''){
                    checkout_outer.find('div.plan-features').html(response.plan_features);
                }else{
                    checkout_outer.find('div.plan-features').html('');
                }*/
            },
            error: function(response){
                //alert("Sorry, please try again.")
            }
        });


        /*var country = checkout_outer.find('.country-list').val();
        var course = checkout_outer.find('input[name="c_id"]').val();
        var coupon = checkout_outer.find('input[name="coupon_code"]').val();

        //var slug = checkout_outer.find('input[name="hid-slug"]').val();
        checkout_outer.find('input[name="p_id"]').val(plan);
        var vatid = checkout_outer.find('input[name="vat_id"]').val();
        var vat_id_box = checkout_outer.find('div.vat-id-box');

        $.ajax({
            url: APP_URL + "/course/choose-plan",
            method: "GET",
            type: "json",
            data: { plan:plan, country:country, course:course, coupon:coupon, vatid:vatid},
            success:function(response){
                if (response.summary){
                    checkout_outer.find('div.order-summary').html(response.summary);
                }
                var saved_card = checkout_outer.find('div.card-details');
                checkout_outer.find('div.plan-price').html(response.plan_price);
                if (response.free_plan){
                    checkout_outer.find('div.redeem-coupon-box').addClass('hide').end()
                                  .find('div.payment-info').addClass('hide').end()
                                  .find('div.vat-id-box').addClass('hide').end()
                                  .find('div.country').addClass('hide');//.end()
                                  //.find('div.card-details').hide();
                }else{
                    //check both whether coupon is present and whether applied to current plan . If no coupon and coupon not applied to current plan we need to show redeem coupon
                    if (coupon == '' && response.coupon_applied == false){
                        checkout_outer.find('div.redeem-coupon-box').removeClass('hide');
                    }

                    if (saved_card.length > 0){
                        checkout_outer.find('div.payment-info').removeClass('hide').end()
                                      .find('div.cc-payment').addClass('hide').end()
                                      .find('div.card-details').removeClass('hide').end()
                                      .find('div.saved-card-outer').addClass('hide');
                    }else{
                        checkout_outer.find('div.cc-payment').removeClass('hide');
                    }
                    checkout_outer.find('div.country').removeClass('hide');

                    if (response.show_vat_id){
                        vat_id_box.removeClass("hide");
                    }else{
                        vat_id_box.addClass("hide");
                    }

                    //Hide payment info for full off coupon
                    if (response.final_price > 0){
                        checkout_outer.find('.payment-info').show();
                    }else if (response.recurring){
                        checkout_outer.find('.payment-info').show();
                    }else{
                        checkout_outer.find('.payment-info').hide();
                    }

                    //checkout_outer.find('div.vat-id-box').removeClass('hide');
                }

                checkout_outer.find('.btn-gtw').text(response.button_text);

                if (response.plan_features != ''){
                    checkout_outer.find('div.plan-features').html(response.plan_features);
                }else{
                    checkout_outer.find('div.plan-features').html('');
                }
            },
            error: function(response){
                alert("Sorry, please try again.")
            }
        });*/
    },
    showVatIdBox: function (){
        //$(this).closest('div.vat-id-outer').find('div.vat-id-input').removeClass('hide');
        var vat_id_outer = $(this).closest('div.vat-id-box');
        var vat_id_popup = vat_id_outer.find('div.vat-id-model');
        var country_dp = vat_id_outer.closest('div.checkout').find('div.country').find('select.country-list');
        var v_message = vat_id_outer.find('div.message ul');
        v_message.html('');
        vat_id_popup.modal("show");

        if (country_dp.length > 0){
            var country = vat_id_outer.closest('div.checkout').find('div.country').find('select.country-list option:selected').text();
            vat_id_popup.find('input[name="country"]').val(country);
        }
        //$(this).remove();
    },
    submitVatId: function (e){
        e.preventDefault();
        var current = $(this);
        var vat_outer = current.closest('div.vat-id-model');
        var checkout_outer = current.closest('div.checkout');
        

        var vat_id = vat_outer.find('input[name="vatid"]').val();
        var name = vat_outer.find('input[name="name"]').val();
        var address = vat_outer.find('textarea[name="address"]').val();

        var plan = checkout_outer.find('input[name="p_id"]').val();
        var course = checkout_outer.find('input[name="c_id"]').val();
        var coupon = checkout_outer.find('input[name="coupon_code"]').val();
        var country = checkout_outer.find('select.country-list').val();
        var ord_bmp = checkout_outer.find('input[name="odrbp"]');
        var state = checkout_outer.find('input[name="state-detected"]').val();
        
        
        var form = checkout_outer.find('form');
        var action = APP_URL + "/course/validate-vat-id";
        var p_type = 2;
        if (form.find('input[name="product-type"]').length > 0){
            p_type = form.find('input[name="product-type"]').val();
            if (p_type == 3){ //live-class
                action = APP_URL + '/live-session/validate-vat-id';
                course = checkout_outer.find('input[name="live_class_id"]').val();
            }else if (p_type == 4){ //live-webinar
                action = APP_URL + '/live-session/validate-vat-id';
                course = checkout_outer.find('input[name="webinar_id"]').val();
            }
        }

        var v_message = vat_outer.find('div.message ul');
        //v_message.html('');

        var error = '';

        if (vat_id == ""){
            error += '<li class="text-danger"><span>Please enter VAT ID</span></li>';

        }
        if (name == ""){
            error += '<li class="text-danger"><span>Please enter organization name</span></li>';

        }
        if (address == ""){
           error += '<li class="text-danger"><span>Please enter organization address</span></li>';

        }
        if (error != ""){
            v_message.html(error);
            return false;
        }

        $.ajax({
                url: action,
                method: "GET",
                type: "json",
                data: { vat_id:vat_id, name:name, address:address, plan:plan, course:course, coupon:coupon, country:country, ord_bmp:ord_bmp.val(), p_type:p_type, state:state },
                beforeSend: function(){
                    site.blockUI();
                },
                complete: function(data){
                    $('html, body').animate({
                        scrollTop: $("#checkout-order-summary").offset().top
                    }, 500);
                    site.unblockUI();
                },
                success:function(response){
                    if (response.success){
                        checkout_outer.find('div.order-summary-box').replaceWith(response.order_summary);
                        checkout.checkCouponInput();
                        checkout_outer.find('input[name="vat_id"]').val(vat_id);
                        //site.notifySuccess(response.message);
                        checkout_outer.find('div.vat-verified').html('<input type="hidden" value=1 name="vat_id_verified" /><input type="hidden" value="'+vat_id+'" name="vatid" /><input type="hidden" value="'+name+'" name="vname" /><input type="hidden" value="'+address+'" name="vaddress" /><input type="hidden" value="'+response.name+'" name="name_returned" /><input type="hidden" value="'+response.address+'" name="address_returned" />');
                        vat_outer.modal('hide');
                        vat_outer.closest('div.vat-id-box').find('div.vat-id-outer').hide();
                    }else{
                        if ($.isArray(response.messages)) {
                            site.listErrors(response.messages, v_message);
                        }else{
                            site.addError(response.messages, v_message);
                        }
                    }
                    paypalpay.getPaypalAttributes();

                },
                error: function(response){
                    if (response.status == 429){ //Too many attempts(throtle)
                        site.addError("The VAT ID you submitted cannot be validated. Please try again after some time.", v_message);
                        //v_message.html('<li class="help-block"><span>The VAT ID you submitted cannot be validated. Please try again after some time.</span></li>');
                    }else{
                        //alert("Sorry, please try again.")
                    }
                }
            });

    },
    /*enrollFree: function (){
        var form = $(this).closest('form');
        form.find('.btn-gtw').prop('disabled', true);
        form.attr('action', APP_URL + '/courses/' + slug + '/enroll-free');
        form.get(0).submit();
    },*/
    processPayment: function (token){
        //e.preventDefault();
        var form = $('button.checkout-button').closest('form');
        var gateway_chosed = 1;//gateway_outer.find('input[name="payment-type"]:checked').val();s
        var action = APP_URL + '/courses/' + slug + '/enroll/' + gateway_chosed;
        if (form.find('input[name="product-type"]').length > 0){
            var p_type = form.find('input[name="product-type"]').val();
            if (p_type == 3){ //live-class
                action = APP_URL + '/live-class/register/' + gateway_chosed;
            }else if (p_type == 4){ //live-webinar
                action = APP_URL + '/live-webinar/register/' + gateway_chosed;
            }
        }
        var page_captcha = form.find('input[name="page_captcha"]').val();
        var page_captcha_type = form.find('input[name="page_captcha_type"]').val();
        var invisible_captcha = false;
        if (page_captcha == 1 && page_captcha_type == 'invisible'){
            invisible_captcha = true;
        }
        //Check login
        var u_id = form.find('input[name="cu_id"]').val();
        var card_info = form.find('div.cc-payment:visible').find('input[name="c_er"]');

        var email = form.find('input#email').val();

        var fbEmail = siteTracking.userEmail?siteTracking.userEmail:email;
        if(fbEmail!=''){
            checkout.FBOnInitiateCheckoutTrack(fbEmail);
        }

        var proceed = true;
        if (email == '' && u_id != 1){
            form.find('input#email').closest('.form-group').addClass('has-error').find('div.err-msg').html('<span class="contact-info-error-text text-danger">This field is required</span>');
            $('.live-chk').find('input#email').next('div.err-msg').html('<span class="contact-info-error-text text-danger">This field is required</span>');
            $('.live-chk').find('input#email').next('.msg-text').show().end().css('border-color', 'red');
            proceed = false;
            
        }
        if (u_id != 1){
            proceed = false;
        }
        
        form.find('#checkout_extra_inputs .checkout-inputs').not('.hide').each(function(){
            var _this     = this;
            var chk_input = $(this).find('input');
            var label     = chk_input.parent().find('label').text();
            if(chk_input.attr('data-required') == 1 && (chk_input.val().trim() == '' || chk_input.val() == 0)){
                chk_input.closest('.form-group').addClass('has-error').find('.msg-text').show();
                chk_input.next('.msg-text').show().end().css('border-color', 'red');
                proceed = false;
            }
        });
        
        if(proceed == false){
            $('html, body').animate({
                scrollTop: $('div.contact-info').offset().top
            }, 100);
            if (invisible_captcha){
                grecaptcha.reset();
            }
            return false;
        }

        //check login

        //var gateway_outer = form.find('div.payment-info');
        
        if (gateway_chosed == 1){
            //form.action = APP_URL + '/courses/new-one/cc/enroll';
            form.attr('action', action);
            stripe.submitPaymentForm(form);
            //form.get(0).submit();
            //return false;
        }/*else if (gateway_chosed == 2){
            form.attr('action', APP_URL + '/courses/' + slug + '/paypal');
            form.get(0).submit();
        }*/
    },
    hideRedeemCoupon: function (){
        var coupon_outer = $(this).closest('div.redeem-coupon-box');
        coupon_outer.find('div.coupon-input').addClass('hide');
        coupon_outer.find('a').show();
        coupon_outer.find('div.coupon-error-message').addClass('hide');
        coupon_outer.find('div.coupon-error-message').html("");
    },
    showAddCardForm: function(e){
        e.preventDefault();
        var current = $(this);
        var checkout_outer = current.closest('div.checkout');
        checkout_outer.find('div.cc-payment').removeClass('hide').end()
                      .find('div.country').removeClass('hide').end()
                      .find('div.saved-card-outer').removeClass('hide').end()
                      .find('div.card-details').hide();
        stripe.initializeStripeVariables();
        stripe.validatePaymentForm();
    },
    hideAddCardForm: function(e){
        e.preventDefault();
        var current = $(this);
        var checkout_outer = current.closest('div.checkout');
        checkout_outer.find('div.cc-payment').addClass('hide').end()
                      .find('div.saved-card-outer').addClass('hide').end()
                      .find('div.card-details').show().end()
                      .find('div.card-errors ul').html('');
    },
    chooseGateway: function (){
        var gateway = $(this).val();
        var gateway_outer = $(this).closest("div.payment-info");
        if (gateway == 1){
            gateway_outer.find("div.cc-payment-outer").removeClass("hide");
            gateway_outer.find("div.paypal").addClass("hide");
            gateway_outer.find("div.another").addClass("hide");
        }else if (gateway == 2){
            gateway_outer.find("div.cc-payment-outer").addClass("hide");
            gateway_outer.find("div.paypal").removeClass("hide");
            gateway_outer.find("div.another").addClass("hide");
        }else if (gateway == 3){
            gateway_outer.find("div.cc-payment-outer").addClass("hide");
            gateway_outer.find("div.paypal").addClass("hide");
            gateway_outer.find("div.another").removeClass("hide");
        }
    },
    FBOnInitiateCheckoutTrack:function(email){
        if(fbtrackid && fbtrackid!=''){
            var form = $('button.checkout-button').closest('form');
            var course_name = form.find('input[name="c_name"]').val();
            var plan_id = form.find('input[name="p_id"]').val();
            var coupon_code = form.find('input[name="coupon_code"]').val();
            if(coupon_code == ''){
                coupon_code = 'NULL';
            }
            var plan_name ='',plan_price='',cur_code='',course_id ='';
            $.ajax({
                    url: APP_URL + "/course/get-plan-details",
                    method: "GET",
                    type: "json",
                    async:false,
                    data: { plan_id:plan_id ,course_id:course_id},
                    success:function(response){
                        if (response.success){
                           //console.log(response); 
                           plan_name = response.plan_name;
                           plan_price = response.plan_price;
                        //   if(plan_price>0){
                               cur_code = response.cur_code;
                          // }else
                              // cur_code = 'NULL';

                        }
                    }
                });
            fbq('track','InitiateCheckout',{email:email,course:course_name,Plan:plan_name,Currency:cur_code,Price:plan_price,CouponCode:coupon_code}); 
        }
        
    }
    /*validateVatId: function (e){
        e.preventDefault();
        var current = $(this);
        var vatid =  current.closest('div.vat-id-input').find('input[name="vatid"]').val();
        var vat_outer = current.closest('div.vat-id-box');
        var checkout_outer = current.closest('div.checkout');
        var plan = checkout_outer.find('input[name="plan-id"]').val();
        var course = checkout_outer.find('input[name="course-id"]').val();
        var coupon = checkout_outer.find('input[name="coupon"]').val();
        var v_message = vat_outer.find('div.vat-id-message');
        v_message.removeClass('has-success has-danger');
        if (vatid != ''){
            $.ajax({
                url: APP_URL + "/course/validate-vat-id",
                method: "GET",
                type: "json",
                data: { vatid:vatid, plan:plan, course:course, coupon:coupon },
                success:function(response){
                    if (response.success){
                        checkout_outer.find('div.coupon-discount').html(response.discount);
                        checkout_outer.find('div.vat-details').html('');
                        checkout_outer.find('div.total-price').html(response.total);
                        checkout_outer.find('input[name="vat-id"]').val(vatid);
                        site.notifySuccess(response.message);
                        vat_outer.find('div.vat-id-outer').hide();
                    }else{
                        v_message.html(response.message);
                        v_message.addClass('has-danger');
                    }

                },
                error: function(response){
                    if (response.status == 429){ //Too many attempts(throtle)
                        v_message.html('The VAT ID you submitted cannot be validated. Please try again after some time.');
                        v_message.addClass('has-danger');
                    }else{
                        alert("Sorry, please try again.")
                    }
                }
            });
        }else{
            v_message.html('Please enter VAT ID');
            v_message.addClass('has-danger');
            return false;
        }
    }*/





};
$(checkout.ready);
