jQuery(function($) {
  "use strict";

  $.getJSON(wb_api+'comapi/streamsexams', '', function (data, textStatus, jqXHR){
    var futureTabContent='';

    if(data!==''){
       futureTabContent+='<div class="tab-pane show fade active" id="futureTab1">';
          futureTabContent+='<div class="row">';
      $.each(data.streamsexams,function(k,v){
       
              if(v.streams!==''){
                  
                  futureTabContent+='<div class="col-md-3 col-sm-6">';
                    futureTabContent+='<a href="'+v.access_link+'" class="futureBox">';
                      futureTabContent+='<div class="future-icon">';
                        futureTabContent+=v.stream_icon
                      futureTabContent+='</div>';
                      futureTabContent+='<div class="future-content">';

                                  futureTabContent+='<h3>'+v.stream_name+'</h3>';

                                  futureTabContent+='<h4>'+v.stream_tolal_colleges+' </h4>';

                              futureTabContent+='</div>';
                    futureTabContent+='</a>';
                  futureTabContent+='</div>';
              }
         

      });

       futureTabContent+='</div>';
        futureTabContent+='</div>';


        futureTabContent+='<div class="tab-pane show fade" id="futureTab2">';
          futureTabContent+='<div class="row">';
      $.each(data.streamsexams,function(__k,__v){
        
          if(__v.streams!==''){
              
              futureTabContent+='<div class="col-md-3 col-sm-6">';
                futureTabContent+='<a href="'+__v.exam_access_link+'" class="futureBox">';
                  futureTabContent+='<div class="future-icon">';
                    futureTabContent+=__v.stream_icon
                  futureTabContent+='</div>';
                  futureTabContent+='<div class="future-content">';

                              futureTabContent+='<h3>'+__v.stream_name+'</h3>';

                              futureTabContent+='<h4>'+__v.stream_tolal_exams+' </h4>';

                          futureTabContent+='</div>';
                futureTabContent+='</a>';
              futureTabContent+='</div>';
          }
          
      });

      futureTabContent+='</div>';
        futureTabContent+='</div>';

      
    }

    $('#futureTabContent').html(futureTabContent);
  });


  // $.getJSON(wb_api+'capi/courseslist', '', function (data, textStatus, jqXHR){
  //   var top_courses_section='';

  //   $.each(data.top_courses,function(k,v){
  //     top_courses_section+='<a href="'+v.course_college_url+'" class="btn btn-outline-primary" style="border: 1px solid #fff;color:white; border-radius: 50px;padding: 6px 12px;font-size: 12.352 !important;">'+v.course_name+'</a>';
  //   });

  //   $('#top_sourses_section').html(top_courses_section);
  // });


  // $.getJSON(wb_api+'capi/courseslist', '', function (data, textStatus, jqXHR){
  //   var skill_courses_section='';

  //   $.each(data.top_courses,function(k,v){
  //     skill_courses_section+='<a href="'+v.course_college_url+'" class="btn btn-outline-primary" style="border: 1px solid #fff;color:white; border-radius: 50px;padding: 6px 12px;font-size: 12.352 !important;">'+v.course_name+'</a>';
  //   });

  //   $('#skill_courses_section').html(skill_courses_section);
  // });

});