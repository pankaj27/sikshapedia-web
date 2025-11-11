jQuery(function($) {
  "use strict";

  var _start=11;
  var _limit=10;
  var _doneScrollingInterval = 500;
  var _scrollTimer=-1; 
  var _processing=false;

  var _position = $(window).scrollTop();

  
// alert(values);

  $('.listing_filter').change(function(){

    //if($(this).is(":checked")){
      var data_filter_type=$(this).data('type');

      var data_cross=$(this).data('cross');

      var data_filter_val=$(this).val();

      var exam_application_mode=$("input[name='exam_application_mode']:checked").val();

      var exam_mode=$("input[name='exam_mode']:checked").val();

      var exam_practice_paper=$("input[name='exam_practice_paper']:checked").val();

      $('#'+data_cross).css('display','block');

      var country_filter=$("input[name='country_filter']:checked").val();

      
      var states_filter = []
      $("input[name='states_filter[]']:checked").each(function ()
      {
          states_filter.push($(this).val());
      });

      //console.log(states_filter);

      _doScroll(data_filter_type,data_filter_val,country_filter,states_filter,exam_application_mode,exam_mode,exam_practice_paper);
   // }

  });

  // $(window).scroll(function(){
  //   var data_filter_type=$('.listing_filter :checked').data('type');

  //     var data_filter_val=$('.listing_filter :checked').val();

  //     var states_filter = []
  //     $("input[name='states_filter[]']:checked").each(function ()
  //     {
  //         states_filter.push($(this).val());
  //     });

  //   //    var scroll = $(window).scrollTop();
  //    // if(scroll > position) {
  //    //      console.log('scrollDown');
  //    //       if (scrollTimer != -1){
  //    //         clearTimeout(scrollTimer);
  //    //       }

  //     if (_processing)
  //       return false;
          
  //        if ($(window).scrollTop() >= ($(document).height() - $(window).height())*0.2){
  //         //scrollTimer = setTimeout(doScroll, doneScrollingInterval);
  //         //if(_c!=''){
  //           _doScroll(data_filter_type,data_filter_val,states_filter);
  //           $(window).scrollTop($(window).scrollTop()-1);
  //         //}
          
          
  //       }
        
          
  //    // }

  //    //  position = scroll;
  // });


  function _doScroll(data_filter_type,data_filter_val,country_filter,states_filter,exam_application_mode,exam_mode,exam_practice_paper){
    $.ajax({
      type:'POST',
      url:base_url+'exams/searchlist',
      data:{
        [csrf_name]:csrf_hash,
        _filter_stream:_filter_stream,
        data_filter_type:data_filter_type,
        data_filter_val:data_filter_val,
        country_filter:country_filter,
        states_filter:states_filter,
        data_length:_limit,
        data_start:_start,
        exam_application_mode:exam_application_mode,
        exam_mode:exam_mode,
        exam_practice_paper:exam_practice_paper
      },
      cache:false,
      beforeSend:function(){
        _processing = true;
      },
      success:function(d){
        if(d.html!=''){
          _start += _limit;
          $("#exams_list").html(d.html);
          _processing = false;
        }

        $('#total_exams').html(d.total_exams);
      }
    });
  }



  $('body').on('click','#exam_application_mode_both_cross',function(){
    $('#exam_application_mode_both').prop('checked', false);
    $(this).css('display','none');
    var data_filter_type=$(this).data('type');
    var data_filter_val=$(this).val();
    var states_filter = []
    $("input[name='states_filter[]']:checked").each(function ()
    {
        states_filter.push($(this).val());
    });
    var country_filter=$("input[name='country_filter']:checked").val();
    var exam_application_mode=$("input[name='exam_application_mode']:checked").val();
    var exam_mode=$("input[name='exam_mode']:checked").val();
    var exam_practice_paper=$("input[name='exam_practice_paper']:checked").val();
    _doScroll(data_filter_type,data_filter_val,country_filter,states_filter,exam_application_mode,exam_mode,exam_practice_paper);
  });

  $('body').on('click','#exam_application_mode_online_cross',function(){
    $('#exam_application_mode_online').prop('checked', false);
    $(this).css('display','none');
    var data_filter_type=$(this).data('type');
    var data_filter_val=$(this).val();
    var states_filter = []
    $("input[name='states_filter[]']:checked").each(function ()
    {
        states_filter.push($(this).val());
    });
    var country_filter=$("input[name='country_filter']:checked").val();
    var exam_application_mode=$("input[name='exam_application_mode']:checked").val();
    var exam_mode=$("input[name='exam_mode']:checked").val();
    var exam_practice_paper=$("input[name='exam_practice_paper']:checked").val();
    _doScroll(data_filter_type,data_filter_val,country_filter,states_filter,exam_application_mode,exam_mode,exam_practice_paper);
  });

  $('body').on('click','#exam_application_mode_offline_cross',function(){
    $('#exam_application_mode_offline').prop('checked', false);
    $(this).css('display','none');
    var data_filter_type=$(this).data('type');
    var data_filter_val=$(this).val();
    var states_filter = []
    $("input[name='states_filter[]']:checked").each(function ()
    {
        states_filter.push($(this).val());
    });
    var country_filter=$("input[name='country_filter']:checked").val();
    var exam_application_mode=$("input[name='exam_application_mode']:checked").val();
    var exam_mode=$("input[name='exam_mode']:checked").val();
    var exam_practice_paper=$("input[name='exam_practice_paper']:checked").val();
    _doScroll(data_filter_type,data_filter_val,country_filter,states_filter,exam_application_mode,exam_mode,exam_practice_paper);
  });



  $('body').on('click','#exam_mode_both_cross',function(){
    $('#exam_mode_both').prop('checked', false);
    $(this).css('display','none');
    var data_filter_type=$(this).data('type');
    var data_filter_val=$(this).val();
    var states_filter = []
    $("input[name='states_filter[]']:checked").each(function ()
    {
        states_filter.push($(this).val());
    });
    var country_filter=$("input[name='country_filter']:checked").val();
    var exam_application_mode=$("input[name='exam_application_mode']:checked").val();
    var exam_mode=$("input[name='exam_mode']:checked").val();
    var exam_practice_paper=$("input[name='exam_practice_paper']:checked").val();
    _doScroll(data_filter_type,data_filter_val,country_filter,states_filter,exam_application_mode,exam_mode,exam_practice_paper);
  });

  $('body').on('click','#exam_mode_online_cross',function(){
    $('#exam_mode_online').prop('checked', false);
    $(this).css('display','none');
    var data_filter_type=$(this).data('type');
    var data_filter_val=$(this).val();
    var states_filter = []
    $("input[name='states_filter[]']:checked").each(function ()
    {
        states_filter.push($(this).val());
    });
    var country_filter=$("input[name='country_filter']:checked").val();
    var exam_application_mode=$("input[name='exam_application_mode']:checked").val();
    var exam_mode=$("input[name='exam_mode']:checked").val();
    var exam_practice_paper=$("input[name='exam_practice_paper']:checked").val();
    _doScroll(data_filter_type,data_filter_val,country_filter,states_filter,exam_application_mode,exam_mode,exam_practice_paper);
  });

  $('body').on('click','#exam_mode_offline_cross',function(){
    $('#exam_mode_offline').prop('checked', false);
    $(this).css('display','none');
    var data_filter_type=$(this).data('type');
    var data_filter_val=$(this).val();
    var states_filter = []
    $("input[name='states_filter[]']:checked").each(function ()
    {
        states_filter.push($(this).val());
    });
    var country_filter=$("input[name='country_filter']:checked").val();
    var exam_application_mode=$("input[name='exam_application_mode']:checked").val();
    var exam_mode=$("input[name='exam_mode']:checked").val();
    var exam_practice_paper=$("input[name='exam_practice_paper']:checked").val();
    _doScroll(data_filter_type,data_filter_val,country_filter,states_filter,exam_application_mode,exam_mode,exam_practice_paper);
  });

  $('input[type=radio][name=exam_application_mode]').change(function(){

    var v=$(this).val();

    if(v=='ONLINE TEST'){
      $('#exam_application_mode_offline_cross').css('display','none');
      $('#exam_application_mode_both_cross').css('display','none');
      console.log(v);
    }else if(v=='WRITTEN TEST'){
      $('#exam_application_mode_online_cross').css('display','none');
      $('#exam_application_mode_both_cross').css('display','none');
      console.log(v);
    }else if(v=='ONLINE TEST,WRITTEN TEST'){
      $('#exam_application_mode_offline_cross').css('display','none');
      $('#exam_application_mode_online_cross').css('display','none');
      console.log(v);
    }
  });

  $('input[type=radio][name=exam_mode]').change(function(){

    var v=$(this).val();

    if(v=='ONLINE TEST'){
      $('#exam_mode_offline_cross').css('display','none');
      $('#exam_mode_both_cross').css('display','none');
      console.log(v);
    }else if(v=='WRITTEN TEST'){
      $('#exam_mode_online_cross').css('display','none');
      $('#exam_mode_both_cross').css('display','none');
      console.log(v);
    }else if(v=='ONLINE TEST,WRITTEN TEST'){
      $('#exam_mode_offline_cross').css('display','none');
      $('#exam_mode_online_cross').css('display','none');
      console.log(v);
    }
  })

});