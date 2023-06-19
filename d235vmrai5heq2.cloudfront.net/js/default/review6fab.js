(function($){
var review = {
	ready: function() 
               {
                   review.$default_school_strings = [];
                   if (typeof $default_school_strings !== 'undefined') {
                       review.$default_school_strings = $default_school_strings;
                   }
                   $('.jqAddEditReview').on('click', review.showEditReviewPopup);
                   $('.jqClosePopup').on('click', review.hideReviewPopup);
                   $('.jqAddReview').on('click', review.addEditReview);
                   $('body').off("click",".jqReviewLoadMore").on("click",".jqReviewLoadMore",review.loadMoreReviews);
                   $('form[name=add-review]').on('submit', review.addEditReview);
                   if (!$.trim($('.zen-input-star .comments').html())) {
                       $('.zen-input-star .comments').closest('.block').remove();
                   }
                   $('body').off("hide.bs.modal" , "#exampleModal").on("hide.bs.modal" , "#exampleModal" , function() {
                      $('input[name=title]').closest('.form-group').find('span').text('');
                      $('textarea[name=comment]').closest('.form-group').find('span').text('');
                      $('input[type=text], textarea').val("");
                      $('#title').val($('input[name=reviewTitle]').val());
                      $('#reviewCommentTextArea').val($('input[name=reviewComment]').val()); 
                   });
               },
        showEditReviewPopup: function(e) {
            e.preventDefault()
            $('#exampleModal').modal({
                show: true, 
                backdrop: 'static',
                keyboard: true
             });
             return false;
            if ($('.jqReviewPopupWrapper').length > 0) {
                $('.jqPopupShadow').css(
                        {
                            width : $(document).outerWidth(),
                            height : $(document).outerHeight(),
                            opacity: 0.6,
                            top: 0,
                            left:0,
                            backgroundColor: '#000'
                        }
                        ).show();
                $('.jqReviewPopupWrapper').css(
                        {
                            
                            top : ($(window).outerHeight()-$('.jqReviewPopupWrapper').outerHeight())/2+$(document).scrollTop(),
                            left : ($(window).outerWidth()-$('.jqReviewPopupWrapper').outerWidth())/2,
                            zIndex:1000000,
                        }
                        ).show();
            }
        },
        hideReviewPopup: function() {
            $('.jqPopupShadow').hide();
            //$('.jqReviewPopupWrapper').find("input[type=text], textarea").val('');
            $('.jqReviewPopupWrapper').slideUp();            
            return false;
        },
        addEditReview: function() {
            if ($.trim($('input[name=title]').val()) == '') {
                $('input[name=title]').closest('.form-group').find('span').text(typeof $default_school_strings.review_enter_title !== 'undefined' && $default_school_strings.review_enter_title != '' ? $default_school_strings.review_enter_title : 'Please enter the review title').show();
                /*alert('Please enter the review title');
                $('input[name=title]').focus();*/
                return false;
            } else {
                $('input[name=title]').closest('.form-group').find('span').hide();
            }
            if ($.trim($('textarea[name=comment]').val()) == '') {
                $('textarea[name=comment]').closest('.form-group').find('span').text(typeof $default_school_strings.review_enter_comment !== 'undefined' && $default_school_strings.review_enter_comment != '' ? $default_school_strings.review_enter_comment :'Please enter your comment').show();
                /*alert('Please enter your comment');
                $('textarea[name=comment]').focus();*/
                return false;
            } else {
                $('textarea[name=comment]').closest('.form-group').find('span').hide();
            }
            
             $.ajax({
                        url: $('form[name=add-review]').attr('action'),
                        method: "POST",
                        type: "json",
                        data: $('form[name=add-review]').serialize(),
                        beforeSend: function (xhr) {
                            site.blockElement($('#exampleModal'))
                        },
                        complete: function() {
                            site.unblockElement($('#exampleModal'));
                        },
                        success:function(response){			
                                if(response.status == 1) {
                                        //alert(response.msg);
                                        review.hideReviewPopup;
                                        //$('.jqReviewPopupWrapper').find("input[type=text], textarea").val('');
                                        window.location.reload();
                                }
                                else {
                                   //alert(response.msg);
                                   review.hideReviewPopup;
                                  // $('.jqReviewPopupWrapper').find("input[type=text], textarea").val('');
                                   window.location.reload();
                                }
                        },
                        error: function(response){
                            //alert("Sorry, please try again.")
                        }
                    });
                    return false;
        },
        loadMoreReviews: function() {
            var current = $(this);
            $.ajax({
                        url: current.attr('loadmorelink'),
                        method: "GET",
                        type: "json",
                        //data: $('form[name=load-more-review]').serialize(),
                        beforeSend: function (xhr) {
                            site.blockElement($('.jqApprovedCommentsOutr'))
                        },
                        complete: function() {
                            site.unblockElement($('.jqApprovedCommentsOutr'));
                        },
                        success:function(response){			
                            if(response.status == 1) {
                                current.remove();
                                $('.jqApprovedCommentsOutr').append(response.html);
                            }
                            else {

                            }
                        },
                        error: function(response){
                        }
                    });
                    return false;
        }
};
$(review.ready);
})(jQuery);