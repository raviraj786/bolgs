var curriculum = {
    ready : function() {
    ca = document.getElementsByTagName('canvas');
        if(ca.length!=0){
            sections = (typeof course !== 'undefined') ? course.curriculum.sections : [];          

            for (var i = 0; i < sections.length; i++) {
                var lessons = sections[i].lessons;
                for(var j = 0; j < lessons.length; j++){

                    var can = document.getElementById(lessons[j].id);
                    // if(!can.getContext) return;
                    perc = $('#perc_'+lessons[j].id).val();
                    c = can.getContext('2d');

                    var posX = can.width / 2,
                          posY = can.height / 2,
                          fps = 1000 / 200,
                          oneProcent = 360 / 100,
                          result = oneProcent * 64;

                    c.lineCap = 'round';

                    //............create canvas..............

                    var deegres = 0;
                   // var acrInterval = setInterval (function() {
                    deegres += 1;
                    c.clearRect( 0, 0, can.width, can.height );

                    c.beginPath();
                    c.arc( posX, posY, 12, (Math.PI/180) * 270, (Math.PI/180) * (270 + 360) );
                    c.strokeStyle = '#b1b1b1';
                    c.lineWidth = '1.5';
                    c.stroke();

                    if(perc>0){
                        c.beginPath();
                        c.strokeStyle = '#2f4671' ; //themebgcolor;
                        c.lineWidth = '1.5';
                        var thisvalue = perc/100;

                        c.arc(posX, posY,12,0,(2 * Math.PI )* thisvalue,false);
                        c.stroke();
                    }

                    if( deegres >= result ) clearInterval(acrInterval);
                   // }, fps);
                }
            }
        }
    }

};

$(curriculum.ready);
