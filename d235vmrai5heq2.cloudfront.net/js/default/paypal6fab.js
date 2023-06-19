var paypalpay = {
  ready : function(){
    paypalpay.user_id = '';
    paypalpay.paypal_verified = 0; //used to check whether paypal button is loaded
    paypalpay.subdata = [];
    paypalpay.initPaypal();
    var paypal_container = $('#paypal-button-container'); // button for one time plans
    var paypal_rec_container = $('#paypal-rec-button-container'); //button for recurring plans
    if (! paypal_container.is(':empty') || ! paypal_rec_container.is(':empty')){
        paypalpay.paypal_verified = 1;
    }
    paypalpay.getPaypalAttributes();
    //$('body').off('change','select.country-list').on('change','select.country-list' , paypalpay.getCountryCode);
  },
  initPaypal : function(){
    /*if (typeof btn_color !== 'undefined' && btn_color != '') {
        btn_color = btn_color;
    }else{
        btn_color = 'silver';
        var contact_outer = $('div.contact-info');
        var user = contact_outer.find('input[name="cu_id"]').val();
        if (user == 1){
            btn_color = 'gold';
        }
    }*/
    var paypal_container = $('#paypal-button-container');
    if (paypal_container.length > 0){
        paypal_container.html(""); //after email submitted, initialize paypal again to enable button
        paypalpay.oneTimePlans();
    }
    var paypal_rec_container = $('#paypal-rec-button-container');
    if (paypal_rec_container.length > 0){
        paypal_rec_container.html(""); //after email submitted, initialize paypal again to enable button
        paypalpay.recurringPlans();
    }
  },
  oneTimePlans : function(){
      paypal.Buttons({
            style: {
                label:   'pay',
                //color: btn_color
            },
            onInit: function(data, actions) {
                actions.disable();
                var contact_outer = $('div.contact-info');
                var user = contact_outer.find('input[name="cu_id"]').val();
                if (user == 1){
                    if($('#checkout-form').find('#checkout_extra_inputs .checkout-inputs').not('.hide').find('input[data-required="1"]').length){
                        $('#checkout-form').find('#checkout_extra_inputs .checkout-inputs').not('.hide').find('input[data-required="1"]').change(function() {
                            var valid = true;
                            $('#checkout-form').find('#checkout_extra_inputs .checkout-inputs').not('.hide').find('input[data-required="1"]').each(function(){
                                if($(this).val() == ''){
                                    valid = false;
                                }
                            });
                            if(valid==true){
                                actions.enable();
                            }
                            else{
                                actions.disable();
                            }
                        });
                        var valid = true;
                        $('#checkout-form').find('#checkout_extra_inputs .checkout-inputs').not('.hide').each(function(){
                            var chk_input = $(this).find('input');
                            if(chk_input.attr('data-required') == 1 && chk_input.val().trim() == ''){
                                valid = false;
                            }
                        });
                        if(valid==true){
                            actions.enable();
                        }
                        else{
                            actions.disable();
                        }
                    }
                    else{
                        actions.enable();
                    }
                }
            },
            onClick: function(data, actions) {
                var contact_outer = $('div.contact-info');
                var user = contact_outer.find('input[name="cu_id"]').val();
                var email = contact_outer.find('input#email').val();
                var p_type;
                if (contact_outer.closest('form').find('input[name="product-type"]').length > 0){
                    p_type = contact_outer.closest('form').find('input[name="product-type"]').val();
                   
                }
                if(email!=''){
                    checkout.FBOnInitiateCheckoutTrack(email);
                }
                var proceed = true;
                if (user != 1 && email == ''){
                    contact_outer.find('input#email').closest('.form-group').addClass('has-error').find('div.err-msg').html('<span class="contact-info-error-text text-danger">This field is required</span>');
                    $('.live-chk').find('input#email').next('div.err-msg').html('<span class="contact-info-error-text text-danger">This field is required</span>');
                    $('.live-chk').find('input#email').next('.msg-text').show().end().css('border-color', 'red');
                    proceed = false;
                }
                $('#checkout-form').find('#checkout_extra_inputs .checkout-inputs').not('.hide').each(function(){
                    var _this     = this;
                    var chk_input = $(this).find('input');
                    var label     = chk_input.parent().find('label').text();
                    if(chk_input.attr('data-required') == 1 && chk_input.val().trim() == ''){
                        chk_input.closest('.form-group').addClass('has-error').find('.msg-text').show();
                        chk_input.next('.msg-text').show().end().css('border-color', 'red');
                        proceed = false;
                    }
                });
                if(proceed == false){
                    $('html, body').animate({
                        scrollTop: $('div.contact-info').offset().top
                    }, 100);
                    return false;
                }
                if (user == 1){
                    /*if (p_type == 4){
                        var error_div = contact_outer.find('div.message ul');
                        return fetch('/live-webinar/check-webinar-register', {
                            method: 'post',
                            data : $('#checkout-form').serialize(),
                            headers: {
                              'content-type': 'application/json'
                            }
                          }).then(function(res) {
                            return res.json();
                          }).then(function(data) {
                            // If there is a validation error, reject, otherwise resolve
                            if (data.error) {
                                error_div.html('<li class="text-danger">' + data.msg + '</li>');
                                $('html, body').animate({
                                    scrollTop: 0 //contact_outer.offset().top
                                }, 'slow'); //100
                              return actions.reject();
                            } else {
                              return actions.resolve();
                            }
                          });
                    }*/
                    if (typeof siteTracking.userId !== 'undefined' && siteTracking.userId != null ) {
                        var error_div = contact_outer.find('div.message ul');
                        return fetch('/check-buy-permission?uid=' + siteTracking.userId, {
                            method: 'get',
                            headers: {
                              'content-type': 'application/json'
                            }
                          }).then(function(res) {
                            return res.json();
                          }).then(function(data) {
                            // If there is a validation error, reject, otherwise resolve
                            if (data.error) {
                                error_div.html('<li class="text-danger">' + data.msg + '</li>');
                                var scroll_div = $('div.summary-outer');
                                $('html, body').animate({
                                    scrollTop: 0 //contact_outer.offset().top
                                }, 'slow'); //100
                              return actions.reject();
                            } else {
                              return actions.resolve();
                            }
                          });
                    }else{
                        return actions.resolve();
                    }
                }else{
                    return actions.reject();
                }
                
            },
            createOrder: function(data, actions) {
                var form = $('#checkout-form');
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': form.find('input[name="_token"]').val()
                    }
                });
                var url = '/process-paypal';
                if (form.find('input[name="product-type"]').length > 0){
                    var p_type = form.find('input[name="product-type"]').val();
                    if (p_type == 3){ //live-class
                        url = '/live-class/register/2';
                    }else if (p_type == 4){ //live-webinar
                        url = '/live-webinar/register/2';
                    }
                }
                return $.when($.ajax({
                    url: url,
                    method: "post",
                    type: "json",
                    data: form.serialize(),

                }).error(function(res){
                    //sessionStorage.paypalError = 1;
                    var msg = "We cannot send your payment right now. Please contact support.";
                    paypalpay.appendError(msg);
                    $("html, body").animate({ scrollTop: 0 }, "slow");
                    //window.location = '/courses/' + slug + '/buy';
                })).then(function(res, textStatus, jqXHR){
                    var rep = JSON.parse(res);
                    if (rep.error == 1){
                        /*if (rep.captcha_msg){
                            $('div.cp-err').find('span').html(rep.captcha_msg);
                            return false;
                        }*/
                        //sessionStorage.paypalError = 1;
                        var msg = "We cannot send your payment right now. Please contact support.";
                        if (rep.msg != ''){
                            msg = rep.msg;
                        }
                        paypalpay.appendError(msg);
                        $("html, body").animate({ scrollTop: 0 }, "slow");
                        //window.location = '/courses/' + slug + '/buy';
                        return false;
                    }
                    if (rep.userID){
                        $('<input />').attr('type', 'hidden').attr('name', "l_user_id").attr('value', rep.userID).appendTo(form);
                    }
                    if (rep.success && rep.orderID){
                        return rep.orderID;//JSON.parse(res);
                    }
                    var msg = "We cannot send your payment right now. Please contact support.";
                    if (rep.msg != ''){
                        msg = rep.msg;
                    }
                    paypalpay.appendError(msg);
                    return false;
                    
                })/*.done(function(data, textStatus, jqXHR){alert(data.orderID);
                    return data.orderID;
                })*/;

            },
            onApprove: function(data, actions) {
                // Capture the funds from the transaction
                var form = $('#checkout-form');
                var url = '/enroll-by-paypal';
                var p_type;
                if (form.find('input[name="product-type"]').length > 0){
                    url = '/enroll-livesession-by-paypal';
                    p_type = form.find('input[name="product-type"]').val();
                    var lslug = form.find('input[name="slug"]').val();
                }
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': form.find('input[name="_token"]').val()
                    }
                });
                $('<input />').attr('type', 'hidden').attr('name', "order_id").attr('value', data.orderID).appendTo(form);
                $.ajax({
                    url: url,
                    method: "post",
                    type: "json",
                    data: form.serialize(),
                    beforeSend: function(){
                        site.blockUI();
                    },
                    complete: function(){
                        site.unblockUI();
                    }

                })/*.then(function(res) {
                    return JSON.parse(res);
                })*/.then(function(details) {
                    if (details.error == 1){
                        //sessionStorage.paypalError = 1;
                        site.notifyError('We cannot send your payment right now. Please contact support.');
                        if (p_type == 3){
                            window.location = '/live-class/' + lslug + '/buy';
                        }else if(p_type == 4){
                            window.location = '/live-webinar/' + lslug + '/buy';
                        }else{
                            window.location = '/courses/' + slug + '/buy';
                        }
                        return false;
                    }
                    if ((details.tier != '' && p_type != 3) && (details.tier != '' && p_type != 4)){
                         if(fbtrackid && fbtrackid!=''){
                               stripe.FBTrackOnCoursepurchase(form); 
                            }
                        window.location = '/courses/' + slug + '/subscribe?l=' + details.tier;
                    }else{
                        if(fbtrackid && fbtrackid!=''){
                               stripe.FBTrackOnCoursepurchase(form); 
                        }
                        if (p_type == 3){
                            window.location = details.redirect_url;
                        }else if(p_type == 4){
                            window.location = details.redirect_url;
                        }else{
                            window.location = '/courses/' + slug + '/subscribe';
                        }
                    }
                });

            },
            onCancel: function (data) {
                // Show a cancel page, or return to cart
                console.log(data);
                //window.location.reload();
            },
            onError: function (err) {
                // Show an error page here, when an error occurs
                console.log(err);
                var msg = "We cannot send your payment right now. Please contact support.";
                //paypalpay.appendError(msg);
                $("html, body").animate({ scrollTop: 0 }, "slow");
                //window.location.reload();
            }
        }).render('#paypal-button-container');
  },
  recurringPlans : function (){
      paypal.Buttons({
            style: {
                label:   'pay',
                //color: btn_color
            },
            onInit: function(data, actions) {
                actions.disable();
                var contact_outer = $('div.contact-info');
                var user = contact_outer.find('input[name="cu_id"]').val();
                if (user == 1){
                    if($('#checkout-form').find('#checkout_extra_inputs .checkout-inputs').not('.hide').find('input[data-required="1"]').length){
                        $('#checkout-form').find('#checkout_extra_inputs .checkout-inputs').not('.hide').find('input[data-required="1"]').change(function() {
                            var valid = true;
                            $('#checkout-form').find('#checkout_extra_inputs .checkout-inputs').not('.hide').find('input[data-required="1"]').each(function(){
                                if($(this).val() == ''){
                                    valid = false;
                                }
                            });
                            if(valid==true){
                                actions.enable();
                            }
                            else{
                                actions.disable();
                            }
                        });
                        var valid = true;
                        $('#checkout-form').find('#checkout_extra_inputs .checkout-inputs').not('.hide').each(function(){
                            var chk_input = $(this).find('input');
                            if(chk_input.attr('data-required') == 1 && chk_input.val().trim() == ''){
                                valid = false;
                            }
                        });
                        if(valid==true){
                            actions.enable();
                        }
                        else{
                            actions.disable();
                        }
                    }
                    else{
                        actions.enable();
                    }
                }
            },
            onClick: function(data, actions) {
                var contact_outer = $('div.contact-info');
                var user = contact_outer.find('input[name="cu_id"]').val();
                var email = contact_outer.find('input#email').val();
                var coupon = contact_outer.closest('form#checkout-form').find('input[name="coupon_code"]').val();
                var plan = contact_outer.closest('form#checkout-form').find('input[name="p_id"]').val();
                var proceed = true;
                if (user != 1 && email == ''){
                    contact_outer.find('input#email').closest('.form-group').addClass('has-error').find('div.err-msg').html('<span class="contact-info-error-text text-danger">This field is required</span>');
                    proceed = false;
                }
                $('#checkout-form').find('#checkout_extra_inputs .checkout-inputs').not('.hide').each(function(){
                    var _this     = this;
                    var chk_input = $(this).find('input');
                    var label     = chk_input.parent().find('label').text();
                    if(chk_input.attr('data-required') == 1 && chk_input.val().trim() == ''){
                        chk_input.closest('.form-group').addClass('has-error').find('.msg-text').show();
                        proceed = false;
                    }
                });
                if(proceed == false){
                    $('html, body').animate({
                        scrollTop: $('div.contact-info').offset().top
                    }, 100);
                    return false;
                }
                if (user == 1){
                    if ((typeof siteTracking.userId !== 'undefined' && siteTracking.userId != null) || coupon != '' ) {
                        var error_div = contact_outer.find('div.message ul');
                        var user_id = (typeof siteTracking.userId !== 'undefined' && siteTracking.userId != null) ? siteTracking.userId : "";
                        return fetch('/check-buy-permission?uid=' + user_id + '&coupon=' + coupon + '&plan=' + plan, {
                            method: 'get',
                            headers: {
                              'content-type': 'application/json'
                            }
                          }).then(function(res) {
                            return res.json();
                          }).then(function(data) {
                            // If there is a validation error, reject, otherwise resolve
                            if (data.error) {
                                if (data.msg_box){
                                   error_div =  $(data.msg_box).find('div.message ul');
                                }
                                var scroll_div = 0;
                                if (data.scroll_div){
                                    scroll_div = $(data.scroll_div).offset().top;
                                }
                                error_div.html('<li class="text-danger">' + data.msg + '</li>');
                                $('html, body').animate({
                                    scrollTop: scroll_div //contact_outer.offset().top
                                }, 'slow'); //100
                                
                                /*if (data.coupon_remove){
                                    contact_outer.closest('form#checkout-form').find('input[name="coupon_code"]').val('');
                                }*/
                              return actions.reject();
                            } else {
                              return actions.resolve();
                            }
                          });
                    }else{
                        return actions.resolve();
                    }
                }else{
                    return actions.reject();
                }
            },
            createSubscription: function(data, actions) {
                var form = $('#checkout-form');
                var plan = form.find('input[name="py_id"]').val();
                var site = form.find('input[name="site_name"]').val();
                var contact_outer = $('div.contact-info');
                var email = contact_outer.find('input#email').val();
                var site_id = form.find('input[name="site_id"]').val();
                var f_name = contact_outer.find('input#first_name').val();
                var l_name = contact_outer.find('input#last_name').val();
                var phone = contact_outer.find('input#phone').val();
                var address = contact_outer.find('input#user_address').val();
                var city = contact_outer.find('input#city').val();
                var state = contact_outer.find('input#state').val();
                var zip = contact_outer.find('input#zip_code').val();
                var country = form.find('input#country_code').val();
                 
                console.log("pppopo"+JSON.stringify(paypalpay.subdata));
                if (paypalpay.subdata.length === 0) {
                            return actions.subscription.create({
                            'plan_id': plan, // Creates the subscription
                            'custom_id' : site_id,
                            "subscriber": {
                                          "name": {
                                            "given_name": f_name,
                                            "surname": l_name
                                          },
                                          "email_address": email,
                                          "shipping_address": {
                                            "name": {
                                              "full_name": f_name + " " + l_name
                                            },
                                            "address": {
                                              "address_line_1": address,
                                              "address_line_2": city,
                                              "admin_area_2": state,
                                              "postal_code": zip,
                                              "country_code": country
                                            }
                                          }
                                        },
                          "intent": "SUBSCRIPTION",
                          "application_context": {
                                          "brand_name": site,
                                          "locale": "en-US",
                                          "shipping_preference": "SET_PROVIDED_ADDRESS",
                                          "user_action": "SUBSCRIBE_NOW",
                                          "payment_method": {
                                            "payer_selected": "PAYPAL",
                                            "payee_preferred": "IMMEDIATE_PAYMENT_REQUIRED"
                                          },
                                        }
                          });
                }else{//coupon or tax case
                            return actions.subscription.create({
                           'plan_id': plan, // Creates the subscription
                           'custom_id' : site_id,
                           "subscriber": {
                                         "name": {
                                           "given_name": f_name,
                                           "surname": l_name
                                         },
                                         "email_address": email,
                                         "shipping_address": {
                                           "name": {
                                             "full_name": f_name + " " + l_name
                                           },
                                           "address": {
                                             "address_line_1": address,
                                             "address_line_2": city,
                                             "admin_area_2": state,
                                             "postal_code": zip,
                                             "country_code": country
                                           }
                                         }
                                       },
                         "intent": "SUBSCRIPTION",
                         "application_context": {
                                         "brand_name": site,
                                         "locale": "en-US",
                                         "shipping_preference": "SET_PROVIDED_ADDRESS",
                                         "user_action": "SUBSCRIBE_NOW",
                                         "payment_method": {
                                           "payer_selected": "PAYPAL",
                                           "payee_preferred": "IMMEDIATE_PAYMENT_REQUIRED"
                                         },
                                       },
                         "plan" : JSON.parse(JSON.stringify(paypalpay.subdata))
                              //{ "taxes" : {"percentage" : 10, "inclusive": false}}
                             /*{"billing_cycles":[{"op" : 'replace', "sequence":1,"total_cycles":1,"pricing_scheme":{"fixed_price":{"value":"1.25","currency_code":"USD"}}},
                                                 {"op" : 'add', "sequence":2,"total_cycles":0,"pricing_scheme":{"fixed_price":{"value":"3.5","currency_code":"USD"}}}
                                                 ]}*/
                             //{"billing_cycles":[{"frequency":{"interval_unit":"Day","interval_count":1},"tenure_type":"REGULAR","sequence":1,"total_cycles":1,"pricing_scheme":{"fixed_price":{"value":"2.00","currency_code":"USD"}}},{"frequency":{"interval_unit":"Day","interval_count":1},"tenure_type":"REGULAR","sequence":2,"total_cycles":0}]}
                         });
                     }
            },
            onApprove: function(data, actions) {
                
        // use below code to activate/make first payments (if any)
        // or call your server using fetch / axios / XHR etc. 
        // Must return a promise. 
        //return actions.subscription.activate().then(res => alert('Activated by Merchant'))
                
                var form = $('#checkout-form');
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': form.find('input[name="_token"]').val()
                    }
                });
                $('<input />').attr('type', 'hidden').attr('name', "sub_id").attr('value', data.subscriptionID).appendTo(form);
                $.ajax({
                    url: '/subscribe-by-paypal',
                    method: "post",
                    type: "json",
                    data: form.serialize(),
                    beforeSend: function(){
                        site.blockUI();
                    },
                    complete: function(){
                        site.unblockUI();
                    }

                }).then(function(details) {
                    if (details.error == 1){
                        //sessionStorage.paypalError = 1;
                        paypalpay.appendError(details.msg);
                        //window.location = '/courses/' + slug + '/buy';
                        return false;
                    }
                    if (details.tier != ''){
                        window.location = '/courses/' + slug + '/subscribe?l=' + details.tier;
                    }else{
                        window.location = '/courses/' + slug + '/subscribe';
                    }
                    
                });
                

            },
            onCancel: function (data) {console.log(data);return false;
                // Show a cancel page, or return to cart
                console.log(data);
                //window.location.reload();
            },
            onError: function (err) {
                // Show an error page here, when an error occurs
                console.log(err);
                var msg = "We cannot send your payment right now. Please contact support.";
                paypalpay.appendError(msg);
                $("html, body").animate({ scrollTop: 0 }, "slow");
                //window.location.reload();
            }
        }).render('#paypal-rec-button-container');
  },
  appendError : function (msg){
      paypalpay.removeError();
      var error_html = '<div class="alert alert-danger p-err" role="alert"><p style="text-align:center;color:#c00;" class="dynamic-text"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>'+ msg +'</p></div>';
      $('div.checkout-container').prepend(error_html);
      $("html, body").animate({ scrollTop: 0 }, "slow");
  },
  removeError : function (){
      $('div.checkout-container').find('div.p-err').remove();
  },
  getCountryCode : function (){
      var country_list = $(this).closest('div.country');
      var country_id = $(this).val();
      $.ajax({
        url:  "/get-country-code",
        method: "GET",
        type: "json",
        data: { country_id  : country_id},
        success:function(response){
            if(response.success) {
                country_list.find('input#country_code').val(response.code);
            }

        },
        error: function(response){
            alert("Sorry, please try again.")
        }
    });
  },
  getPaypalAttributes: function (){
        var form = $('#checkout-form');
        var p_type = 1;
        var url = '/get-paypal-attributes';
        if (form.find('input[name="product-type"]').length > 0){
            p_type = form.find('input[name="product-type"]').val();
        }
        if (p_type == 3 || p_type == 4){ //live-session
            url = '/live/get-paypal-attributes';
        }
        $.ajax({
            url: url,
            method: "post",
            type: "json",
            data: form.serialize(),
            success: function (details){console.log("dfdf");console.log(details);
                paypalpay.subdata = details.data;
            }

        });
  }

};
$(paypalpay.ready);
