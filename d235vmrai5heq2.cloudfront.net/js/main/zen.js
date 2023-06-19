(function($) {
  "use strict"; // Start of use strict

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 75
  });

  // Collapse Navbar
  var navbarCollapse = function() {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-scrolled");
    } else {
      $("#mainNav").removeClass("navbar-scrolled");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  // Magnific popup calls
  $('#imagepopup').magnificPopup({
    delegate: 'a',
    type: 'image',
    tLoading: 'Loading image #%curr%...',
    mainClass: 'mfp-img-mobile',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1]
    },
    image: {
      tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
    }
  });



  var mobMode = false;
 // Tab-Pane change function
   var tabChange = function(){
       var tabs = $('.nav-swich > li >a');
       var active = tabs.filter('.active');
       var nextLi = active.parent().next('li').length? active.parent().next('li').children('a') : tabs.filter(':first-child a:first');
       active.removeClass('active');
       nextLi.tab('show');
       nextLi.addClass('active');

       if(mobMode == true){
          $('.nav-swich').animate({
              scrollLeft: $(".active").offset().left
          }, 2000);
        }     

   }
   // Tab Cycle function
   var tabCycle = setInterval(tabChange, 4000);

   var t;

   // Tab click event handler

   $('.nav-swich li').click(function(e) {
       clearTimeout(t);

       e.preventDefault();      

       clearInterval(tabCycle);
       
       $(this).tab('show');
      
        t = setTimeout(function(){
           tabCycle = setInterval(tabChange, 4000)
       }, 10000);
   });
    


//media query

function getMode(x) {
  if (x.matches) { // If media query matches   
     mobMode = true;      
  } else {  
    mobMode = false; 
  }
}

var x = window.matchMedia("(max-width: 990px)");
getMode(x); // Call listener function at run time
x.addListener(getMode); // Attach listener function on state changes







})(jQuery); // End of use strict