var stripe = {
    ready: function (){
        stripe.slug = '';
        if (typeof slug != "undefined"){
            stripe.slug = slug;
        }
        stripe.$default_school_strings = [];
        if (typeof $default_school_strings !== 'undefined') {
            stripe.$default_school_strings = $default_school_strings;
        }
        //Use this for card add from admin, student side
        $('body').off('submit','form[id="form-payment"]').on('submit','form[id="form-payment"]', stripe.addCard);

        var add_card_form = $("#form-payment").find("div.cc-payment");
        var checkout_form = $("#checkout-form").find("div.cc-payment");
        if (checkout_form.length > 0){
            if (typeof course_currency != 'undefined' && course_currency != ''){ //only for paid courses (student side)
               stripe.initializeStripeVariables(0);
               stripe.validatePaymentForm();
            }else if (typeof admin_section != 'undefined' && admin_section > 0) { //only for site plan purchase (admin side)
               stripe.initializeStripeVariables(0);
               stripe.validatePaymentForm();
            }
        }else if(add_card_form.length > 0){
            stripe.initializeStripeVariables(1);
            stripe.validatePaymentForm();
        }

    },
    initializeStripeVariables : function (addCard){
        var style = {
            base: {
                lineHeight: '1.65',
                //color: '#C1C7CD',
            }
        }
        if (addCard == 1){
            /*if(window.location.href.indexOf("/admin") > -1) {
                user_publishable_key = publishable_key;
            }
            stripe.stripe = Stripe(user_publishable_key);*/
            if (typeof user_publishable_key != 'undefined' && user_publishable_key != ''){
                stripe.stripe = Stripe(user_publishable_key);
            }else{
                stripe.stripe = Stripe(publishable_key);
            }
        }else if (typeof account_id != 'undefined' && account_id != ''){//course purchase
            stripe.stripe = Stripe(publishable_key, {stripeAccount: account_id});
        }else{//Account_id missing case
            var form = $("#checkout-form");
            var s_ac_id = form.find('input[name="account_id"]').val();
            if(s_ac_id != ''){ //course purchase
                stripe.stripe = Stripe(publishable_key, {stripeAccount: s_ac_id});
            }else{ //nz plan purchase
                stripe.stripe = Stripe(publishable_key);
            }
        }
        var elements = stripe.stripe.elements();

        var card_number_placeholder_text = typeof $default_school_strings.card_number !== 'undefined' && $default_school_strings.card_number != '' ? $default_school_strings.card_number : "Card Number";
        var cvc_placeholder_text = typeof $default_school_strings.security_code !== 'undefined' && $default_school_strings.security_code != '' ? $default_school_strings.security_code : "CVC";

        stripe.card_number = stripe.card = elements.create('cardNumber', {placeholder: card_number_placeholder_text,  style: style });
        if (addCard == 1){
            stripe.card.mount('#card-number-add');
        }else{
            stripe.card.mount('#card-number');
        }

        stripe.cvc = stripe.card = elements.create('cardCvc', {placeholder: cvc_placeholder_text, style: style });
        if (addCard == 1){
            stripe.card.mount('#card-cvc-add');
        }else{
            stripe.card.mount('#card-cvc');
        }

        stripe.expiry = stripe.card = elements.create('cardExpiry', {style: style });
        if (addCard == 1){
            stripe.card.mount('#card-expiry-add');
        }else{
            stripe.card.mount('#card-expiry');
        }

    },
    validatePaymentForm : function (){
        var errors = $('.card-errors ul');


        var card_no_error = 1;
        var cvc_error = 1;
        var exp_error = 1;
        //var zip_error;

        //Identify checkout form or card update form
        var form = $("#form-payment");
        var checkout_contact_info = 1;
        if ($('#checkout-form').length > 0){
            form = $('#checkout-form');
        }


        stripe.card_number.addEventListener('change', function(event) {
            $('.errors ul').html("");//for add card
            stripe.updateBrandIcon(event.brand);
            checkout_contact_info = stripe.getContactInfo();
            card_no_error = 0;
            if (event.error) {
                form.find('.btn-gtw').prop('disabled', true); //button disabled
                form.find('input[name="c_er"]').val(1);
                errors.append('<li class="card-no text-danger"><span>'+event.error.message+'</span></li>');
                card_no_error = 1;
                form.find('div#card-number').closest('.form-group').addClass('has-error');
            }else {
                errors.find('.card-no').remove();
                if (card_no_error != 1 && cvc_error != 1 && exp_error != 1){
                    form.find('input[name="c_er"]').val(0);
                    if ( checkout_contact_info != ''){
                        form.find('.btn-gtw').prop('disabled', false); //button disabled
                    }
                }
                form.find('div#card-number').closest('.form-group').removeClass('has-error');
            }
        });
        stripe.cvc.addEventListener('change', function(event) {
            $('.errors ul').html("");//for add card
            checkout_contact_info = stripe.getContactInfo();
            cvc_error = 0;
            if (event.error) {
                form.find('.btn-gtw').prop('disabled', true); //button disabled
                form.find('input[name="c_er"]').val(1);
                errors.append('<li class="cvc text-danger"><span>'+event.error.message+'</span></li>');
                cvc_error = 1;
                form.find('div#card-cvc').closest('.form-group').addClass('has-error');
            }else {
                errors.find('.cvc').remove();
                if (card_no_error != 1 && cvc_error != 1 && exp_error != 1){
                    form.find('input[name="c_er"]').val(0);
                    if ( checkout_contact_info != ''){
                        form.find('.btn-gtw').prop('disabled', false); //button disabled
                    }
                }
                form.find('div#card-cvc').closest('.form-group').removeClass('has-error');
            }
        });
        stripe.expiry.addEventListener('change', function(event) {
            $('.errors ul').html(""); //for add card
            checkout_contact_info = stripe.getContactInfo();
            exp_error = 0;
            if (event.error) {
                form.find('.btn-gtw').prop('disabled', true); //button disabled
                form.find('input[name="c_er"]').val(1);
                errors.append('<li class="expiry text-danger"><span>'+event.error.message+'</span></li>');
                exp_error = 1;
                form.find('div#card-expiry').closest('.form-group').addClass('has-error');
            }else {
                errors.find('.expiry').remove();
                if (card_no_error != 1 && cvc_error != 1 && exp_error != 1){
                    form.find('input[name="c_er"]').val(0);
                    if ( checkout_contact_info != ''){
                        form.find('.btn-gtw').prop('disabled', false); //button disabled
                    }
                }
                form.find('div#card-expiry').closest('.form-group').removeClass('has-error');
            }
        });
        /*stripe.zip.addEventListener('change', function(event) {
            zip_error = 0;
            if (event.error) {
                form.find('.btn-gtw').prop('disabled', true);
                errors.append('<li class="card-no"><span>'+event.error.message+'</span></li>');
                zip_error = 1;
            }else {
                errors.find('.card-no').remove();
                if (card_no_error != 1 && cvc_error != 1 && exp_error != 1 && zip_error != 1){
                    form.find('.btn-gtw').prop('disabled', false);
                }
            }
        });*/

        /*stripe.card_number.addEventListener('change', function(event) {
            if (event.error) {
            errors.append('<li class="card-no"><span>'+event.error.message+'</span></li>');
            } else {
              errors.find('.card-no').remove();
            }
            /alert(this.maxLength);
            if (this.value.length == this.maxLength) {
                $(this).next('.inputs').focus();
            }/
        });
        stripe.cvc.addEventListener('change', function(event) {
            if (event.error) {
              errors.append('<li class="cvc"><span>'+event.error.message+'</span></li>');
            } else {
              errors.find('.cvc').remove();
            }
        });
        stripe.expiry.addEventListener('change', function(event) {
            if (event.error) {
              errors.append('<li class="expiry"><span>'+event.error.message+'</span></li>');
            } else {
              errors.find('.expiry').remove();
            }
        });*/
    },
    addCard : function (event){
        var form = $(this);
        event.preventDefault();

        var country = 1;
        var errorElement = $('.card-errors ul');
         //for add card country should be validated.
        country = form.find(".country-list").val();
        errorElement = $('.errors ul');//for add card only this type of error is showing, other errors are just highlighted . So used diff class
        errorElement.html("");

        form.find('.btn-gtw').prop('disabled', true);

        if (country == 0){
            form.find(".country-list").addClass('form-control-error');
            form.find('.btn-gtw').prop('disabled', false);
            return false;
        }

        //SETUP INTENT - NEW METHOD
        var clientSecret = form.find('.btn-gtw').data().secret;//console.log(clientSecret);
        stripe.stripe.handleCardSetup(
                clientSecret, stripe.card, {
                  payment_method_data: {
                    //billing_details: {name: "Jisna"}
                  }
                }
              ).then(function(result) {//console.log(result);
                if (result.error) {
                    // Display error.message in your UI.
                    //for add card only this type of error is showing, other errors are just highlighted . So used diff class
                    var errorElement = $('.errors ul');
                    errorElement.html("");
                    errorElement.append('<li class="card-no cvc expiry text-danger"><span>'+result.error.message+'</span></li>');
                    form.find('.btn-gtw').prop('disabled', false);
                    stripe.showBuyText();
                    //country
                } else {
                    // The setup has succeeded. Display a success message.
                    var processingText = 'Processing';
                    if(window.location.href.indexOf("/admin") > -1) {
                        processingText = 'Processing';
                    }else {
                        processingText = typeof $default_school_strings.processing !== 'undefined' && $default_school_strings.processing != '' ? $default_school_strings.processing : "Processing";
                    }
                    form.find('.btn-gtw').text(processingText + "...");
                    form.append($('<input type="hidden" name="payment-method">').val(result.setupIntent.payment_method));
                    form.append($('<input type="hidden" name="idp_key">').val(site.school_id + '-' + $.now() + '-' + Math.floor((Math.random() * 100) + 1)));
                    form.get(0).submit();
                }
              });

    },
    submitPaymentForm : function (form){
        //For 100% coupon don't need payment , just submit form
        //For card saved case just use the payment method
        //For card not saved case create new payment method
        form.find('.btn-gtw').prop('disabled', true); //double payment
        var page_captcha = form.find('input[name="page_captcha"]').val();
        var page_captcha_type = form.find('input[name="page_captcha_type"]').val();
        var invisible_captcha = false;
        if (page_captcha == 1 && page_captcha_type == 'invisible'){
            invisible_captcha = true;
        }
        var free_plan = 0;
        if (form.find('input[name="free"]').length > 0){
            free_plan = form.find('input[name="free"]').val();
        }
        var cc_payment_info = form.find('div.cc-payment');
        if (! cc_payment_info.is(':visible')){
            form.find('.btn-gtw').prop('disabled', true);

            if (card_saved == 1 && free_plan == 0){
                if (typeof account_id != 'undefined' && account_id != ''){
                    stripe.stripe = Stripe(publishable_key, {stripeAccount: account_id});
                }else{ // account_id missing case recheck
                    var s_ac_id = form.find('input[name="account_id"]').val();
                    if(s_ac_id != ''){
                        stripe.stripe = Stripe(publishable_key, {stripeAccount: s_ac_id});
                    }else{
                        stripe.stripe = Stripe(publishable_key);
                    }
                }
                stripe.postPaymentMethod(form, payment_method);
            }else{//For 100% coupon don't need payment , just submit form (Also Upsell)
                $.ajax({
                    url: form.attr('action'),
                    method: "POST",
                    type: "json",
                    data: form.serialize(),
                    beforeSend: function (xhr) {
                            site.blockUI();
                    },
                    complete: function() {
                            site.unblockUI();
                    },
                    success:function(response){ // console.log(response);
                        /*if (response.captcha_msg){
                            $('div.cp-err').find('span').html(response.captcha_msg);
                            form.find('.btn-gtw').prop('disabled', false);
                            return false;
                        }*/
                        if(response.redirect_url) {
                            if(fbtrackid && fbtrackid!=''){
                               stripe.FBTrackOnCoursepurchase(form); 
                            }
                            window.location.href = response.redirect_url;
                        }else{
                            if(fbtrackid && fbtrackid!=''){
                               stripe.FBTrackOnCoursepurchase(form); 
                            }
                            window.location.reload();
                        }
                    },
                    error: function(response){

                    }
                });
            }
        }else{ //For card not saved case create new payment method
            var country = 1;
            //form.find('.btn-gtw').prop('disabled', true); //button disabled
            var errorElement = $('.card-errors ul');
            errorElement.html("");

            //CREATE PAYMENT METHOD - NEW METHOD
            stripe.stripe.createPaymentMethod('card', stripe.card)
                    .then(function(result) {
                        if (result.error) {
                            // Show error in payment form

                            errorElement.html('<li class="card-no cvc expiry text-danger"><span>'+result.error.message+'</span></li>'); //append button disabled
                            if (country == 0){
                                form.find(".country-list").addClass('form-control-error');
                                form.find('.btn-gtw').prop('disabled', false);
                            }
                            if (invisible_captcha){
                                grecaptcha.reset();
                            }
                        } else {
                          // Send paymentMethod.id to server
                            form.find('.btn-gtw').prop('disabled', true);
                            stripe.postPaymentMethod(form, result.paymentMethod.id);
                        }
                    });
            }

    },
    handleServerResponse : function(response,form){//console.log("HandleServerRespone");console.log(response)
        var errorElement = $('.card-errors ul');
        errorElement.html("");
        var message = '';
        if (response.error) {
          // Show error from server on payment form
            if (response.redirect_url){
                window.location.href = response.redirect_url;
            }
            if (response.error.message){
                message = response.error.message;
            }else if (response.message){
                message = response.message;
            }
            errorElement.append('<li class="card-no cvc expiry text-danger"><span>' + message + '</span></li>');
            stripe.showBuyText();
        } else if (response.requires_action) {
          // Use Stripe.js to handle required card action
          stripe.handleAction(response,form);
        } else {
          // Show success message //Call function after payment
          if (response.redirect_url){
               if(fbtrackid && fbtrackid!=''){
                    stripe.FBTrackOnCoursepurchase(form); 
               }
            window.location.href = response.redirect_url;

          }
        }
    },
    handleAction : function (response,form){//console.log("Jisna");console.log(response.payment_intent_client_secret);
        var errorElement = $('.card-errors ul');
        errorElement.html("");
        var paymentSuccessUrl = '';
        var paymentFailedUrl = '';
        var p_type;
        if(window.location.href.indexOf("/admin") > -1 && stripe.slug == "") {
            paymentSuccessUrl = '/admin/account/plans/payment-success';
            paymentFailedUrl = '/admin/account/plans/payment-failed';
        }else{
            if (form.find('input[name="product-type"]').length > 0){
                var lslug = form.find('input[name="slug"]').val();
                paymentSuccessUrl = '/live-session/' + lslug + '/payment-success';
                paymentFailedUrl = '/live-session/' + lslug + '/payment-failed';
                stripe.slug = lslug;
                p_type = form.find('input[name="product-type"]').val();
            }else{
                paymentSuccessUrl = '/courses/' + stripe.slug + '/payment-success';
                paymentFailedUrl = '/courses/' + stripe.slug + '/payment-failed';
            }
        }
        /*$.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });*/
        if (response.subscription){
            //FOR SUBSCRIPTION WITH TRIAL handleCardSetup
            if (response.trialing){
                    clientSecret = response.setup_intent_client_secret;
                    stripe.stripe.handleCardSetup(
                    clientSecret, stripe.card, {
                      payment_method_data: {
                        //billing_details: {name: "Jisna"}
                      }
                    }
                  ).then(function(result) {//console.log(result);
                    if (result.error) {
                            return $.when($.ajax({
                              url: paymentFailedUrl,
                              method: "post",
                              type: "json",
                              data:  {  params : response.params, slug : stripe.slug, subscription_response : response.subscription_response, message : result.error.message  },
                              beforeSend: function (xhr) {
                                  site.blockUI()
                              },
                              complete: function() {
                                site.unblockUI();
                              }

                          }).error(function(failureresult){

                          })).then(function(confirmResult, textStatus, jqXHR){
                                if (confirmResult.redirect_url){
                                    if (confirmResult.reload){
                                      window.location.reload();
                                    }else{
                                        window.location.href = confirmResult.redirect_url;
                                    }
                                }else{
                                    errorElement.append('<li class="card-no cvc expiry text-danger"><span>' + confirmResult.message + '</span></li>');
                                    stripe.showBuyText();
                                }
                          })
                        //errorElement.append('<li class="card-no cvc expiry text-danger"><span>'+result.error.message+'</span></li>');
                        //stripe.showBuyText();
                    } else {

                        //The setup has succeeded. Display a success message.
                        return $.when($.ajax({
                          url: paymentSuccessUrl,
                          method: "post",
                          type: "json",
                          data:  { setup_intent_id : result.setupIntent.id, payment_method : result.setupIntent.payment_method, slug : stripe.slug, params : response.params, trialing:true, subscription_response : response.subscription_response },
                          beforeSend: function (xhr) {
                              site.blockUI()
                          },
                          complete: function() {
                              site.unblockUI();
                          }

                      }).error(function(result){
                          errorElement.append('<li class="card-no cvc expiry text-danger"><span>'+result.error.message+'</span></li>');
                          stripe.showBuyText();
                      })).then(function(confirmResult, textStatus, jqXHR){
                          stripe.handleServerResponse(confirmResult,form);
                      })
                    }
                  });
            }else{
                //FOR SUBSCRIPTION handleCardPayment
                stripe.stripe.handleCardPayment(
                    response.payment_intent_client_secret,
                stripe.stripe.card,
                {
                    payment_method_data: {
                        billing_details: {
                            //name: 'Jenny Rosen'
                        }
                    }
                }
              ).then(function(result) {//console.log('OSIOO');console.log(result);
                // IF auth failed for 3D case like wrong otp
                if (result.error){
                    return $.when($.ajax({
                          url: paymentFailedUrl,
                          method: "post",
                          type: "json",
                          data:  {  params : response.params, slug : stripe.slug, subscription_response : response.subscription_response, message : result.error.message },
                          beforeSend: function (xhr) {
                              site.blockUI()
                          },
                          complete: function() {
                            site.unblockUI();
                          }

                      }).error(function(failureresult){

                      })).then(function(confirmResult, textStatus, jqXHR){
                            if (confirmResult.redirect_url){
                                if (confirmResult.reload){
                                  window.location.reload();
                                }else{
                                    window.location.href = confirmResult.redirect_url;
                                }
                            }else{
                                errorElement.append('<li class="card-no cvc expiry text-danger"><span>' + confirmResult.message + '</span></li>');
                                stripe.showBuyText();
                            }
                            stripe.handleServerResponse(confirmResult,form);
                      })

                }else{
                    return $.when($.ajax({
                          url: paymentSuccessUrl,
                          method: "post",
                          type: "json",
                          data:  { payment_intent_id : result.paymentIntent.id, payment_method : result.paymentIntent.payment_method, slug : stripe.slug, params : response.params, subscription_response : response.subscription_response },
                          beforeSend: function (xhr) {
                              site.blockUI()
                          },
                          complete: function() {
                            site.unblockUI();
                          }

                      }).error(function(result){console.log("DSE");console.log(result);
                          errorElement.append('<li class="card-no cvc expiry text-danger"><span>'+result.error.message+'</span></li>');
                          stripe.showBuyText();
                      })).then(function(confirmResult, textStatus, jqXHR){console.log("REEE");console.log(confirmResult);
                          stripe.handleServerResponse(confirmResult,form);
                      })
                }
              });
            }
        }else{
            //FOR ONETIME handleCardAction
            stripe.stripe.handleCardAction(
                response.payment_intent_client_secret
              ).then(function(result) {//console.log('hello');console.log(result.paymentIntent.payment_method);
                if (result.error) {
                  // Show error in payment form
                  /*errorElement.append('<li class="card-no cvc expiry text-danger"><span>'+result.error.message+'</span></li>');
                  stripe.showBuyText();
                  $("#checkout-form").find('.btn-gtw').prop('disabled', false);*/
                      return $.when($.ajax({
                              url: paymentFailedUrl,
                              method: "post",
                              type: "json",
                              data:  {  params : response.params, slug : stripe.slug, onetime : 1, message : result.error.message, p_type : p_type},
                              beforeSend: function (xhr) {
                                  site.blockUI()
                              },
                              complete: function() {
                                site.unblockUI();
                              }

                          }).error(function(failureresult){

                          })).then(function(confirmResult, textStatus, jqXHR){
                                if (confirmResult.redirect_url){
                                    if (confirmResult.reload){
                                      window.location.reload();
                                    }else{
                                        window.location.href = confirmResult.redirect_url;
                                    }
                                }else{
                                    errorElement.append('<li class="card-no cvc expiry text-danger"><span>' + confirmResult.message + '</span></li>');
                                    stripe.showBuyText();
                                    $("#checkout-form").find('.btn-gtw').prop('disabled', false);
                                }
                          })
                } else {
                    // The card action has been handled
                    // The PaymentIntent can be confirmed again on the server
                    var url = '/courses/' + stripe.slug + '/confirm-payment';
                    if (form.find('input[name="live_class_id"]').length > 0 || form.find('input[name="webinar_id"]').length > 0){
                        stripe.slug = form.find('input[name="slug"]').val();
                        url = '/live-session/' + stripe.slug + '/confirm-payment';
                    }console.log(url);
                    return $.when($.ajax({
                        url: url,
                        method: "post",
                        type: "json",
                        data:  { payment_intent_id : result.paymentIntent.id, payment_method : result.paymentIntent.payment_method, slug : stripe.slug, params : response.params, prd_type : response.prd_type},
                        beforeSend: function (xhr) {
                            site.blockUI()
                        },
                        complete: function() {
                          site.unblockUI();
                        }

                    }).error(function(result){

                    })).then(function(confirmResult, textStatus, jqXHR){
                        stripe.handleServerResponse(confirmResult,form)
                    })
                }
              });
        }
    },
    postPaymentMethod : function (form, payment_method){
        var errorElement = $('.card-errors ul');
        errorElement.html("");
        var processingText = 'Processing';
        if(window.location.href.indexOf("/admin") > -1) {
            processingText = 'Processing';
        }else{
            processingText = typeof $default_school_strings.processing !== 'undefined' && $default_school_strings.processing != '' ? $default_school_strings.processing : "Processing";
        }
        //console.log(processingText);
        form.find('.btn-gtw').text(processingText + "...");
        var url = form.attr('action');
        
        form.append($('<input type="hidden" name="payment_method_id">').val(payment_method));
        form.append($('<input type="hidden" name="idp_key">').val(site.school_id + '-' + $.now() + '-' + Math.floor((Math.random() * 100) + 1)));
          $.ajaxSetup({
              headers: {
                  'X-CSRF-TOKEN': form.find('input[name="_token"]').val()
              }
          });

          return $.when($.ajax({
              url: url,
              method: "post",
              type: "json",
              data:  form.serialize(),
              beforeSend: function (xhr) {
                site.blockUI()
              },
              complete: function() {
                site.unblockUI();
              }

          }).error(function(result){

          })).then(function(result, textStatus, jqXHR){//SHOW SWAL HERE;
              if (result.error){
                  /*if (result.captcha_msg){
                        $('div.cp-err').find('span').html(result.captcha_msg);
                        form.find('.btn-gtw').prop('disabled', false);
                        stripe.showBuyText();
                        return false;
                  }*/
                  if (result.redirect_url){
                      if (result.reload){
                        window.location.reload();
                      }else{
                          window.location.href = result.redirect_url;
                      }
                  }else{
                      errorElement.append('<li class="card-no cvc expiry text-danger"><span>' + result.message + '</span></li>');
                      form.find('.btn-gtw').prop('disabled', false);
                      stripe.showBuyText();
                  }
              }else{
                  //console.log("WHATAT");console.log(result);
                  if(result.redirect_url){
                      if (result.reload){
                        window.location.reload();
                      }else{
                       window.location.href = result.redirect_url;
                      }
                  }
                  if (result.paymentintent){
                      stripe.handleServerResponse(result,form);
                  }
              }
          })
    },
    stripeTokenHandler : function (response, form){
        if (response.error) {
            //Done for checkout page(Enble button only if contact info submitted)
            /*var contact_info = $('div.contact-info').find('input[name="cu_id"]').val();
            if (contact_info == 1){
                form.find('.btn-gtw').prop('disabled', false); // Re-enable submission
            }*/
            var errorElement = $('.card-errors ul');
            if(form.attr("id") == "form-payment"){ //for add card only this type of error is showing, other errors are just highlighted . So used diff class
                errorElement = $('.errors ul');
                errorElement.html("");
            }
            errorElement.append('<li class="card-no cvc expiry text-danger"><span>'+response.error.message+'</span></li>');

        }else { // Token was created!
            var preocessingText = 'Processing';
            if(window.location.href.indexOf("/admin") > -1) {
                preocessingText = 'Processing';
            } else {
                preocessingText = typeof $default_school_strings.processing !== 'undefined' && $default_school_strings.processing != '' ? $default_school_strings.processing : "Processing";
            }
            //console.log(preocessingText);
            form.find('.btn-gtw').text(preocessingText + "...");
            var token = response.id;
            form.append($('<input type="hidden" name="stripeToken">').val(token));
            form.get(0).submit();
        }

    },
    toggleContainer : function (element, container){
        if(element.prop('checked')) {
            container.show();
        }else{
            container.find("input[type=text]").val("");
            container.hide();
        }

    },
    updateBrandIcon : function (brand){
        var cardBrandClass = {
            'visa': 'fab fa-cc-visa',
            'mastercard': 'fab fa-cc-mastercard',
            'amex': 'fab fa-cc-amex',
            'discover': 'fab fa-cc-discover',
            'diners': 'fab fa-cc-diners-club',
            'jcb': 'fab fa-cc-jcb',
            'unknown': 'far fa-credit-card',
        }
        var pfClass = 'far fa-credit-card';
        if (brand in cardBrandClass){
            pfClass = cardBrandClass[brand];
        }
        var brandIconElement = $('.card-icon');
        brandIconElement.removeClass();
        brandIconElement.addClass('card-icon');
        brandIconElement.addClass(pfClass);
    },
    getContactInfo : function (){
        if ($('#checkout-form').length > 0){
            return $('#checkout-form').find('input[name="cu_id"]').val(); //Contact info should be there for checkout page to enable buy button
        }else{
            return 1;
        }
    },
    showBuyText:function(){
        var form = $('#checkout-form');
        var buyText = '';
        if(window.location.href.indexOf("/admin") > -1) {
            buyText = 'Buy';
        }else {
            buyText = typeof $default_school_strings.buy !== 'undefined' && $default_school_strings.buy != '' ? $default_school_strings.buy : "Buy";
        }
        //var buyText = typeof $default_school_strings.buy !== 'undefined' && $default_school_strings.buy != '' ? $default_school_strings.buy : "Buy";
        form.find('.btn-gtw').text(buyText);
    },
    
    FBTrackOnCoursepurchase:function(form){

        var email = '',course_name = '', plan_id = '', coupon_code = 'NULL' ,course_id = '';
        if(form.attr('id')=='checkout-form'){
             email = siteTracking.userEmail?siteTracking.userEmail:form.find('input#email').val();
             course_name = form.find('input[name="c_name"]').val();
             plan_id = form.find('input[name="p_id"]').val();
             coupon_code = form.find('input[name="coupon_code"]').val();
            if(coupon_code == ''){
                coupon_code = 'NULL';
            } 
        }
        else if(form.attr('class')=='jqUpsellForm'){
             email = siteTracking.userEmail?siteTracking.userEmail:'';
             course_id = form.find('input[name="upsell_c_id"]').val();
             plan_id = form.find('input[name="upsell_p_id"]').val();
             coupon_code = form.find('input[name="upsell_coupon_code"]').val();
             if(coupon_code == ''){
                coupon_code = 'NULL';
            } 
        }
        var plan_name ='',plan_price='0.00',cur_code='USD';
        $.ajax({
                url: APP_URL + "/course/get-plan-details",
                method: "GET",
                type: "json",
                async:false,
                data: { plan_id:plan_id,course_id:course_id },
                success:function(response){
                    if (response.success){
                       //console.log(response); 
                       plan_name = response.plan_name;
                       plan_price = response.plan_price;
                      // if(plan_price>0){
                           cur_code = response.cur_code;
                      // }else
                          // cur_code = 'NULL';
                          if(response.course_name){
                              course_name = response.course_name;
                          }

                    }
                }
            });
        fbq('track','Purchase',{email:email,course:course_name,Plan:plan_name,currency:cur_code,value:plan_price,CouponCode:coupon_code}); 

    }





};
$(stripe.ready);
