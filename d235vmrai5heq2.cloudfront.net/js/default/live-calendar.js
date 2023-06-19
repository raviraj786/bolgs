var live_calendar = {
        ready: function() {
          $('body').off('click','.fc-dayGridMonth-button').on('click','.fc-dayGridMonth-button', function(){
            live_calendar.currentViewTitle = "Month";
            live_calendar.loadEventListLeft();
          });
          $('body').off('click','.fc-timeGridWeek-button').on('click','.fc-timeGridWeek-button', function(){
            live_calendar.currentViewTitle = "Week";
            live_calendar.loadEventListLeft();
          });
          $('body').off('click','.fc-timeGridDay-button').on('click','.fc-timeGridDay-button', function(){
            live_calendar.currentViewTitle = "Day";
            live_calendar.loadEventListLeft();
          });
          $('body').off('click','.fc-listMonth-button').on('click','.fc-listMonth-button', function(){
            live_calendar.currentViewTitle = "List";
            live_calendar.loadEventListLeft();
          });
          $('body').off('click','.fc-today-button').on('click','.fc-today-button', function(){
            live_calendar.currentViewTitle = "Month";
            live_calendar.loadEventListLeft();
          });
          $('body').off('click','.fc-prev-button').on('click','.fc-prev-button', function(){
            live_calendar.loadEventListLeft();
          });
          $('body').off('click','.fc-next-button').on('click','.fc-next-button', function(){
            live_calendar.loadEventListLeft();
          });
          $('body').off('click','a#fc-left').on('click','a#fc-left' , function() {
              var liveType = $(this).attr('data-type');
              var liveId = $(this).attr('data-id');
              var regUser = $(this).attr('data-reguser');
              live_calendar.loadPopupEventDetails(liveType, liveId, regUser);
          });
          $('body').off('click','#register-live-session').on('click','#register-live-session' , function() {
            $("#live-details-modal").modal("hide");
          });
          $('body').off("change" , "input[id=live-class-box]").on("change" , "input[id=live-class-box]", function(){
            live_calendar.loadEventListLeft();
          });
          $('body').off("change" , "input[id=live-webinar-box]").on("change" , "input[id=live-webinar-box]", function(){
            live_calendar.loadEventListLeft();
          });
          $('body').off("change" , "input[id=live-interactive-webinar-box]").on("change" , "input[id=live-interactive-webinar-box]", function(){
            live_calendar.loadEventListLeft();
          });
          $('body').off("change" , "input[id=live-stream-box]").on("change" , "input[id=live-stream-box]", function(){
            live_calendar.loadEventListLeft();
          });
          $('body').off("change" , "input[id=registered-sessions-box]").on("change" , "input[id=registered-sessions-box]", function(){
            live_calendar.loadEventListLeft();
          });
          $('body').off("change" , "input[id=live-1-1-box]").on("change" , "input[id=live-1-1-box]", function(){
            live_calendar.loadEventListLeft();
          });
          $('body').off('click','.zen-upcomingsessions-top').on('click','.zen-upcomingsessions-top', function(){
            var objDiv = document.getElementById("style-3");
            objDiv.scrollTop -=200;
          });

          $('body').off('click','.zen-upcomingsessions-bottom').on('click','.zen-upcomingsessions-bottom', function(){
            var objDiv = document.getElementById("style-3");
            objDiv.scrollTop +=200;
          });
        },

        loadEventListLeft: function(){
          var type_lc = $('input[id=live-class-box]').prop('checked');
          var type_w = $('input[id=live-webinar-box]').prop('checked');
          var type_lw = $('input[id=live-interactive-webinar-box]').prop('checked');
          var type_ls = $('input[id=live-stream-box]').prop('checked');
          var type_reg = $('input[id=registered-sessions-box]').prop('checked');
          var type_1_to_1 = 0;
          if($('input[id=live-1-1-box]').length >0){
            var type_1_to_1 = $('input[id=live-1-1-box]').prop('checked');
          }
          var start_date = '';
          var end_date = '';
          var leftTitle = '';
          var leftDateRange = '';
          if(live_calendar.currentViewTitle == 'Month'){
            leftTitle = "Month";
            leftDateRange = live_calendar.currentView.title;
            start_date = live_calendar.currentView.currentStart;
            end_date = live_calendar.currentView.currentEnd;
          } else if(live_calendar.currentViewTitle == 'Week'){
            leftTitle = "Week";
            leftDateRange = live_calendar.currentView.title;
            start_date = live_calendar.currentView.currentStart;
            end_date = live_calendar.currentView.currentEnd;
          } else if(live_calendar.currentViewTitle == 'Day'){
            leftTitle = "Day";
            leftDateRange = live_calendar.currentView.title;
            start_date = live_calendar.currentView.currentStart;
            end_date = live_calendar.currentView.currentEnd;
          } else if(live_calendar.currentViewTitle == 'List'){
            leftTitle = "Month";
            leftDateRange = live_calendar.currentView.title;
            start_date = live_calendar.currentView.currentStart;
            end_date = live_calendar.currentView.currentEnd;
          } else {
            leftDateRange = live_calendar.currentView.title;
            start_date = live_calendar.currentView.currentStart;
            end_date = live_calendar.currentView.currentEnd;
          }
          var ys = start_date.getFullYear();
          var ms = start_date.getMonth() + 1;
          var ds = start_date.getDate();
          var ye = end_date.getFullYear();
          var me = end_date.getMonth() + 1;
          var de = end_date.getDate();
          var date_filter = ms + "-" + ds + "-" + ys + " - " + me + "-" + de + "-" + ye;
          var localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

          $.ajax({
            url        : '/live-calendar/list/' + date_filter,
            method     : 'GET',
            type       : 'json',
            data       : {
              type_lc: type_lc,
              type_w: type_w,
              type_lw: type_lw,
              type_ls: type_ls,
              type_reg: type_reg,
              localTZ: localTZ,
              type_1_to_1:type_1_to_1,
            },
            success    : function(response){
              if(response.status == 1) {
                var eventObjects = live_calendar.calendarObj.getEvents();
                var len = eventObjects.length;
                for (var j = 0; j < len; j++) {
                    eventObjects[j].remove();
                }
                var i = 0;
                if(type_1_to_1 == true){
                  for(i=0; i < response.liveSessions['eventsArray1_1C'].length; i++){
                    if(response.liveSessions['eventsArray1_1C'][i]['regUser'] == null){
                      if(response.liveSessions['eventsArray1_1C'][i]['secret'] != 1){
                        live_calendar.calendarObj.addEvent(response.liveSessions['eventsArray1_1C'][i]);
                      }
                    } else if(type_reg == true){
                      live_calendar.calendarObj.addEvent(response.liveSessions['eventsArray1_1C'][i]);
                    }
                  }
                  for(i=0; i < response.liveSessions['eventsArrayR1_1C'].length; i++){
                    if(response.liveSessions['eventsArrayR1_1C'][i]['regUser'] == null){
                      if(response.liveSessions['eventsArrayR1_1C'][i]['secret'] != 1){
                        live_calendar.calendarObj.addEvent(response.liveSessions['eventsArrayR1_1C'][i]);
                      }
                    } else if(type_reg == true){
                      live_calendar.calendarObj.addEvent(response.liveSessions['eventsArrayR1_1C'][i]);
                    }
                  }
                }
                if(type_lc == true){
                  for(i=0; i < response.liveSessions['eventsArrayLC'].length; i++){
                    if(response.liveSessions['eventsArrayLC'][i]['regUser'] == null){
                      if(response.liveSessions['eventsArrayLC'][i]['secret'] != 1){
                        live_calendar.calendarObj.addEvent(response.liveSessions['eventsArrayLC'][i]);
                      }
                    } else if(type_reg == true){
                      live_calendar.calendarObj.addEvent(response.liveSessions['eventsArrayLC'][i]);
                    }
                  }
                  for(i=0; i < response.liveSessions['eventsArrayRLC'].length; i++){
                    if(response.liveSessions['eventsArrayRLC'][i]['regUser'] == null){
                      if(response.liveSessions['eventsArrayRLC'][i]['secret'] != 1){
                        live_calendar.calendarObj.addEvent(response.liveSessions['eventsArrayRLC'][i]);
                      }
                    } else if(type_reg == true){
                      live_calendar.calendarObj.addEvent(response.liveSessions['eventsArrayRLC'][i]);
                    }
                  }
                }
                if(type_w == true){
                  for(i=0; i < response.liveSessions['eventsArrayW'].length; i++){
                    if(response.liveSessions['eventsArrayW'][i]['regUser'] == null){
                      if(response.liveSessions['eventsArrayW'][i]['secret'] != 1){
                        live_calendar.calendarObj.addEvent(response.liveSessions['eventsArrayW'][i]);
                      }
                    } else if(type_reg == true){
                      live_calendar.calendarObj.addEvent(response.liveSessions['eventsArrayW'][i]);
                    }
                  }
                  for(i=0; i < response.liveSessions['eventsArrayRW'].length; i++){
                    if(response.liveSessions['eventsArrayRW'][i]['regUser'] == null){
                      if(response.liveSessions['eventsArrayRW'][i]['secret'] != 1){
                        live_calendar.calendarObj.addEvent(response.liveSessions['eventsArrayRW'][i]);
                      }
                    } else if(type_reg == true){
                      live_calendar.calendarObj.addEvent(response.liveSessions['eventsArrayRW'][i]);
                    }
                  }
                }
                if(type_lw == true){
                  for(i=0; i < response.liveSessions['eventsArrayLW'].length; i++){
                    if(response.liveSessions['eventsArrayLW'][i]['regUser'] == null){
                      if(response.liveSessions['eventsArrayLW'][i]['secret'] != 1){
                        live_calendar.calendarObj.addEvent(response.liveSessions['eventsArrayLW'][i]);
                      }
                    } else if(type_reg == true){
                      live_calendar.calendarObj.addEvent(response.liveSessions['eventsArrayLW'][i]);
                    }
                  }
                  for(i=0; i < response.liveSessions['eventsArrayRLW'].length; i++){
                    if(response.liveSessions['eventsArrayRLW'][i]['regUser'] == null){
                      if(response.liveSessions['eventsArrayRLW'][i]['secret'] != 1){
                        live_calendar.calendarObj.addEvent(response.liveSessions['eventsArrayRLW'][i]);
                      }
                    } else if(type_reg == true){
                      live_calendar.calendarObj.addEvent(response.liveSessions['eventsArrayRLW'][i]);
                    }
                  }
                }
                if(type_ls == true){
                  for(i=0; i < response.liveSessions['eventsArrayLS'].length; i++){
                    live_calendar.calendarObj.addEvent(response.liveSessions['eventsArrayLS'][i]);
                  }
                }

                $('span.jqLiveSessionsList').html(response.html);
                $("#left-daterange").html(leftDateRange);
                $("#left-title").html(leftTitle);
              }
              else {
                  //site.setFormErrors(response.msg);
                  return;
              }
            },
            error      : function(response){
              alert('Sorry, please try again.');
            }
          });
        },

        loadPopupEventDetails: function(liveType, liveId, regUser){
          var localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
          $.ajax({
            async   : true,
            url        : '/live-calendar/' + liveType + '/' + liveId,
            method     : 'GET',
            type       : 'json',
            data       : {
            },
            beforeSend : function(){
              site.blockUI();
            },
            complete   : function(){
              site.unblockUI();
            },
            success    : function(response){
              if(response.status == 1) {
                var startTime = new Date(response.startTime).toLocaleString("en-US", {timeZone: localTZ});
                startTime = new Date(startTime);
                $("#live-session-thumbnail").attr('src', response.live_session.thumbnail);
                $("#event-title").html(response.live_session.topic);
                $("#event-time").html(startTime);
                document.getElementById("register-live-session").href = response.live_session.reg_url;
                $("#live-type-popup").removeClass('fc-live-webinar');
                $("#live-type-popup").removeClass('fc-live-interactive-webinar');
                $("#live-type-popup").removeClass('fc-live-stream');
                $("#live-type-popup").removeClass('fc-live-class');
                $("#live-type-popup").removeClass('fc-registered-session');
                if(response.liveType == 'lc'){
                  $("#live-type").html('Live Class');
                  if(regUser == 'true'){
                    $("#live-type-popup").addClass('fc-registered-session');
                    $("#register-live-session").text('Join');
                  } else {
                    $("#live-type-popup").addClass('fc-live-class');
                    $("#register-live-session").text('Register');
                  }
                } else if(response.liveType == '1-to-1'){
                  $("#live-type").html('1 - 1 Booking');
                  if(regUser == 'true'){
                    $("#live-type-popup").addClass('fc-registered-session');
                    $("#register-live-session").text('Join');
                  } else {
                    $("#live-type-popup").addClass('fc-1-1-class');
                    $("#register-live-session").text('Register');
                  }

                }else if(response.liveType == 'lw'){
                  $("#live-type").html('Live Webinar');
                  if(regUser == 'true'){
                    $("#live-type-popup").addClass('fc-registered-session');
                    $("#register-live-session").text('Join');
                  } else {
                    $("#live-type-popup").addClass('fc-live-webinar');
                    $("#register-live-session").text('Register');
                  }
                } else if(response.liveType == 'liw'){
                  $("#live-type").html('Live Interactive Webinar');
                  if(regUser == 'true'){
                    $("#live-type-popup").addClass('fc-registered-session');
                    $("#register-live-session").text('Join');
                  } else {
                    $("#live-type-popup").addClass('fc-live-interactive-webinar');
                    $("#register-live-session").text('Register');
                  }
                } else if(response.liveType == 'ls'){
                  $("#live-type-popup").addClass('fc-live-stream');
                  $("#live-type").html('Live Stream');
                  $("#register-live-session").text('Join');
                }

                $("#live-details-modal").modal("show");
              }
              else {
                  //site.setFormErrors(response.msg);
                  return;
              }
            },
            error      : function(response){
              alert('Sorry, please try again.');
            }
          });
        }

};
