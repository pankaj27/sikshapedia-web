jQuery(function($) {
  'use strict';

  $.validator.addMethod("valueNotEquals", function(value, element, arg){
    return arg !== value;
  }, "Value must not equal arg.");

  jQuery.validator.addMethod("alphanumeric", function(value, element) {
    return this.optional(element) || /^[\w.]+$/i.test(value);
  }, "Letters, numbers, and underscores only please");


  $("#university_country").chosen({no_results_text: "Select Country"});
  $("#university_state").chosen({no_results_text: "Select State"});
  $("#university_district").chosen({no_results_text: "Select District"});
  $("#university_city").chosen({no_results_text: "Select City"});
  $('#university_same_group_colleges').chosen({no_results_text: "Select Other Colleges In this Group"});
  $(".select2_option").chosen({no_results_text: "Select Country"});

  $('#college_inner_menu_other_link').chosen();
   $('#college_menu_widgets').chosen();

  // $("#university_same_group_colleges").chosen().change(function(){
    
  // });

  $('body').on('click','#btn_create_inner_menu',function(){
    var menu_type=$(this).data('menu_type');
    var menu_type_id=$(this).data('menu_type_id');

    $('#collegeInnerMenuesModal').find('#menu_data_type_id').val(menu_type_id);
    $('#collegeInnerMenuesModal').find('#menu_data_type').val(menu_type);

   });

  if($('#form_university').length>0){

    var html='';
    $.ajax( {
      url: base_url+'/institutions/colleges_list',
      success: function( data ) {
        if(data.colleges){
          $.each(data.colleges,function(i,v){
            html+='<option value="'+v.college_user_id+'">'+v.college_name+' ['+v.college_short_name+']</option>';
          });

          $('#university_same_group_colleges').html(html);

          $('#university_same_group_colleges').trigger("chosen:updated");
          
        }
      }
    });
  }

  // $( "#university_same_group_colleges" ).autocomplete({
  //   source: function( request, response ) {
  //   $.ajax( {
  //       url: base_url+'/institutions/colleges_list',
  //       dataType: "jsonp",
  //       data: {
  //         term: request.term
  //       },
  //       success: function( data ) {
  //         response( data );
  //       }
  //     });
  //   },
  //   minLength: 2,
  //   select: function( event, ui ) {
  //     log( "Selected: " + ui.item.value + " aka " + ui.item.id );
  //   }
  // });

  //Universities
  $('#university_list_table').DataTable({ 
      'bJQueryUI': false,
      'stateSave': true,
      'iDisplayLength':50,
      'responsive': true,
      "pagingType": "full_numbers",
      'language': {
        'paginate': {
          'first': "<<", // This is the link to the first page
          'previous': "<", // This is the link to the previous page
          'next': ">", // This is the link to the next page
          'last': ">>" // This is the link to the last page
        }
      },
      "lengthMenu": [[10,25,50,100,250,500,1000,1500], [10,25,50,100,250,500,1000,1500]],
      "processing": true, //Feature control the processing indicator.
      "serverSide": true, //Feature control DataTables' server-side processing mode.
      "order": [], //Initial no order.
      // Load data for the table's content from an Ajax source
      "ajax": {
          "url": base_url+'/institutions/universities/search',
          "type": "POST",
          "data":{csrf_test_name:csrf_hash,}
      },
      //Set column definition initialisation properties.
      "columnDefs": [
      { 
          "targets": [ 0 ], //first column / numbering column
          "orderable": false, //set not orderable
      },
      ],
  });

  if ($(".university_info").length) {
    tiny_mce('.university_info','1000');
  }


  $('#form_university').validate({
    rules:{
      university_state:{
        valueNotEquals: "0" 
      },
      university_city:{
        valueNotEquals: "0" 
      },
      university_name:{
        required:true
      },
      university_email:{
        required:true,
        email:true
      },
      university_phone:{
        required:true
      },
      university_estd:{
        required:true,
        digits: true,
        minlength:4,
        maxlength:4
      },
      university_type:{
        valueNotEquals: "0"
      }
    },
    messages:{
      university_state:{
        valueNotEquals: "Please select state" 
      },
      university_city:{
        valueNotEquals: "Please select city" 
      },
      university_name:{
        required:"Please enter University name"
      },
      university_email:{
        required:"Please enter University email address",
        email:"Email address is not valid"
      },
      university_phone:{
        required:"Please enter university Phone No."
      },
      university_estd:{
        required:"Please enter Estd. year",
        digits: "Only numeric value allowed",
        minlength:"Estd. Year must be 4 digit long",
        maxlength:"Estd. Year must be 4 digit long",
      },
      university_type:{
        valueNotEquals: "Please enter University type"
      },
      college_university:{
        valueNotEquals: "Please select University" 
      }
    },
    submitHandler:function(){
      var myContent = tinymce.get("university_about_info").getContent();
      var formData=new FormData($('#form_university')[0]);
      formData.append('university_about_info',myContent);



      $.ajax({
          type:'POST',
          url:base_url+'/institutions/universities/save_university', 
          data:formData,
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',        
          beforeSend:function(){
            $('#btn_save_university').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
             $('#btn_save_university').html('Save').prop('disabled',true);
              Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });           
            }else if(f.error){
              $('#btn_save_university').html('Save').prop('disabled',true);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_save_university').html('Your session expired').prop('disabled',true);
            }
          },
          xhr: function(){
              //Get XmlHttpRequest object
               var xhr = $.ajaxSettings.xhr() ;
              //Set onprogress event handler
               xhr.upload.onprogress = function(data){
                  var perc =(data.loaded / data.total) * 100;// Math.round((data.loaded / data.total) * 100);
                  $('.progress-bar').css('width',perc.toFixed(2) + '%').text(perc.toFixed(2) + '%');
               };
               return xhr ;
          },
          error: function (e) {
          },
          complete:function(status,xhr){
            $('.progress-bar').css('width', '0%').text('0%');
            $('#btn_save_university').html('Save').attr('disabled',false);
          },
          resetForm: true 
        });
    }
  });


  $('body').on('click','.btn_del_university',function(){
    let _university=$(this).attr('data-aid');

    Swal.fire({
      title: "Do you want to delete the University?",
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#69da68',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value){
        $.ajax({
          type:'POST',
          url:base_url+'/institutions/universities/delete_university',
          data:{_university:_university,csrf_test_name:csrf_hash},
          beforeSend:function(){

          },
          success:function(d){
            if(d.success){
              Swal.fire({
                icon: 'success',
                title: d.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
              var table=$('#university_list_table').DataTable();
              table.ajax.reload( null, false );
            }else{
              Swal.fire({
                icon: 'error',
                title: d.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }
          }
        });
      }
    });
  });

  $('body').on('change','#university_country',function(){
    let country=$('#university_country :selected').val();

    let f_data  =   new Array(country);
    let ctext   =   CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();
    $.ajax({
      type:'POST',
      url:base_url+'/country/get_states',
      data:{ctext:ctext,listing_type:'1',csrf_test_name:csrf_hash},
      success:function(d){
        $('#university_state').html(d.html);
        $("#university_state").trigger("chosen:updated");
      }
    });
    load_statuetorybodies(country);
  });

  $('body').on('change','#university_state',function(){
    let country = $('#university_country :selected').val();
    let state   = $('#university_state :selected').val();
    let city    = $('#university_city :selected').val();
    let f_data  =   new Array(country,state);
    let ctext   =   CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();
    $.ajax({
      type:'POST',
      url:base_url+'/country/get_cities',
      data:{ctext:ctext,csrf_test_name:csrf_hash},
      success:function(d){
        $('#university_city').html(d.html);
        $("#university_city").trigger("chosen:updated");
      }
    });
    load_districts(country,state);
  });

  $('body').on('change','#university_city',function(){
    let country = $('#university_country :selected').val();
    let state   = $('#university_state :selected').val();
    let city    = $('#university_city :selected').val();
    load_university(country,state,city);
  });


  $('body').on('click','.btn_create_slug',function(){
    var data_value_id=$(this).attr('data-value_id');
    var data_type=$(this).attr('data-type')
    $.ajax({
      type:'POST',
      url:base_url+'/institutions/save_slug',
      data:{csrf_test_name:csrf_hash,data_value_id:data_value_id,data_type:data_type},
      beforeSend:function(){
          $(this).prop('disabled',true);
          $(this).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
      },
      success:function(d){
        if(d.success){
          var table=$('#university_list_table').DataTable();
          table.ajax.reload( null, false );          
        }
      }
    });
  });

  function load_districts(country,state){
    let f_data  =   new Array(country,state);
    let ctext   =   CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();
    $.ajax({
      type:'POST',
      url:base_url+'/country/get_districts',
      data:{ctext:ctext,csrf_test_name:csrf_hash},
      success:function(d){
        $('#university_district').html(d.html);
      }
    });
  }


  $('.file-upload-browse').on('click', function(e) {
    var file = $(this).parent().parent().parent().find('.file-upload-default');
    file.trigger('click');
       
  });
  // $('body').on('change','#university_logo', function(e) {
  //   $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
  //    var fileExtension = ['jpg','jpeg','png'];
  //   checkFile(fileExtension,$(this),e,$('#btn_save_university'));
  // });

  $("#university_logo").change(function (e) {
      var fileExtension = ['jpg','jpeg','png','webp'];
      checkFile(fileExtension,$(this),e,$('#btn_save_university'));
  });


  // $("#_university_country").chosen({no_results_text: "Select Country"});
  // $("#_university_state").chosen({no_results_text: "Select State/Province"});
  // $("#_university_city").chosen({no_results_text: "Select District"});



  $('body').on('change','#_university_country',function(){
    let country=$('#_university_country :selected').val();

    let f_data  =   new Array(country);
    let ctext   =   CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();
    $.ajax({
      type:'POST',
      url:base_url+'/country/get_states',
      data:{ctext:ctext,listing_type:'1',csrf_test_name:csrf_hash},
      success:function(d){
        $('#_university_state').html(d.html);
      }
    });
  });

  $('body').on('change','#_university_state',function(){
    let country = $('#_university_country :selected').val();
    let state   = $('#_university_state :selected').val();
    let f_data  =   new Array(country,state);
    let ctext   =   CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();
    $.ajax({
      type:'POST',
      url:base_url+'/country/get_cities',
      data:{ctext:ctext,csrf_test_name:csrf_hash},
      success:function(d){
        $('#_university_city').html(d.html);
      }
    });
  });


  $('#form_university_quick_upload').validate({
    rules:{
      _university_type:{
        valueNotEquals:'0'
      },
      university_name:{
        required:true
      },
      university_short_name:{
        required:true
      },
      university_estd:{
        required:true,
        digits:true,
        maxlength:4,
        minlength:4
      },
      _university_country:{
        valueNotEquals:'0'
      },
      _university_state:{
        valueNotEquals:'0'
      },
      _university_city:{
        valueNotEquals:'0'
      },
      university_pincode:{
        required:true
      },
      university_address:{
        required:true
      }
    },
    messages:{
       _university_type:{
        valueNotEquals:'Select University Type'
      },
      university_name:{
        required:'Enter University Name'
      },
      university_short_name:{
        required:'Enter University Short Name'
      },
      university_estd:{
        required:'Enter Estd. Year',
        digits:'Only numeric value allowed',
        maxlength:'Maximum 4 digits allowed',
        minlength:'Minimum 4 digits allowed'
      },
      _university_country:{
        valueNotEquals:'Select Country'
      },
      _university_state:{
        valueNotEquals:'Select State'
      },
      _university_city:{
        valueNotEquals:'Select City'
      },
      university_pincode:{
        required:'Enter Pincode'
      },
      university_address:{
        required:'Enter address'
      }
    },
    submitHandler:function(){
      $.ajax({
        type:'POST',
        url:base_url+'/institutions/universities/save_university_quick',
        data: $('#form_university_quick_upload').serialize(),
        beforeSend:function(){
            $('#btn_update_university_quick').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
        },
        success:function(f){
          if(f.success){
             $('#btn_update_university_quick').html('Save').prop('disabled',false);
              Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });  
              var table=$('#university_list_table').DataTable();
              table.ajax.reload( null, false );          
            }else if(f.error){
             //$('#btn_update_university_quick').html('Save').prop('disabled',true);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_update_university_quick').html('Your session expired').prop('disabled',true);
            }
        }
      });
    }
  });



  //university FAQ rows
  var cfr=colleg_faq_row;

  $(document).on('click','#btn_add_college_faqus_row',function(){
    var html='';

    html+='<tr id="tr' + cfr + '">';
    html+='<td>';
    html+='<input type="text" class="form-control" name="university_faqus['+cfr+'][ques]" aria-describedby="university_faqus" placeholder="Question" value="">';

    html+='<textarea class="form-control university_info" name="university_faqus['+cfr+'][ans]" aria-describedby="university_faqus" placeholder="Answer" rows="5"></textarea>';
    html+='</td>';
    html+='<td>';
    html+='<div class="btn-group">';
    html+='<button type="button" class="btn btn-xs btn-primary" id="btn_add_college_faqus_row"><i class="fa fa-plus"></i></button>';
    html+='<button type="button" class="btn btn-xs btn-danger" onclick="$(\'#tr' + cfr + '\').remove()"><i class="fa fa-minus"></i></button>';
    html+='</div>';
    html+='</td>';
    html+='</tr>';

    $('#form_college_faqus_table tbody').append(html);

    college_info_area();

    cfr++;
  });



  var cfr2=colleg_placement_faq_row;

    $(document).on('click','#btn_add_college_placement_faqus_row',function(){
      var html='';

      html+='<tr id="tr2' + cfr2 + '">';
      html+='<td>';
      html+='<input type="text" class="form-control" name="university_placement_faqs['+cfr2+'][ques]" aria-describedby="university_faqus" placeholder="Question" value="">';
      
      html+='<textarea class="form-control university_info" name="university_placement_faqs['+cfr2+'][ans]" aria-describedby="university_faqus" placeholder="Answer" rows="5"></textarea>';
      html+='</td>';
      html+='<td>';
      html+='<div class="btn-group">';
      html+='<button type="button" class="btn btn-xs btn-primary" id="btn_add_college_placement_faqus_row"><i class="fa fa-plus"></i></button>';
      html+='<button type="button" class="btn btn-xs btn-danger" onclick="$(\'#tr2' + cfr2 + '\').remove()"><i class="fa fa-minus"></i></button>';
      html+='</div>';
      html+='</td>';
      html+='</tr>';

      $('#form_college_placement_faqus_table tbody').append(html);

      college_info_area();

      cfr2++;
    });


    var cfr3=colleg_scholarship_faq_row;

    $(document).on('click','#btn_add_college_scholarship_faqus_row',function(){
      var html='';

      html+='<tr id="tr3' + cfr3 + '">';
      html+='<td>';
      html+='<input type="text" class="form-control" name="university_scholarship_faqs['+cfr3+'][ques]" aria-describedby="university_faqus" placeholder="Question" value="">';
      html+='<textarea class="form-control university_info" name="university_scholarship_faqs['+cfr3+'][ans]" aria-describedby="university_faqus" placeholder="Answer" rows="5"></textarea>';
      html+='</td>';
      html+='<td>';
      html+='<div class="btn-group">';
      html+='<button type="button" class="btn btn-xs btn-primary" id="btn_add_college_scholarship_faqus_row"><i class="fa fa-plus"></i></button>';
      html+='<button type="button" class="btn btn-xs btn-danger" onclick="$(\'#tr3' + cfr3 + '\').remove()"><i class="fa fa-minus"></i></button>';
      html+='</div>';
      html+='</td>';
      html+='</tr>';

      $('#form_college_scholarship_faqus_table tbody').append(html);

      college_info_area();

      cfr2++;
    });


    var crankr=colleg_ranking_row;

    $(document).on('click','#btn_add_college_ranking_row',function(){
      var rhtml='';

      rhtml+='<tr id="tr' + crankr + '">';
      rhtml+='<td>';
      rhtml+='<select class="form-control" name="university_ranking['+crankr+'][body]">';
      $.each(institute_ranking_bodies,function(i,v){
        rhtml+='<option value="'+v.rank_body_id+'">'+v.rank_body+'</option>';
      });
      rhtml+='<select>';
      rhtml+='</td>';
      rhtml+='<td>';
      rhtml+='<select class="form-control" name="university_ranking['+crankr+'][years]">';
      $.each(institue_ranking_years,function(i,v){
        rhtml+='<option value="'+v.ranking_year+'">'+v.ranking_year+'</option>';
      });
      rhtml+='<select>';
      rhtml+='</td>';
      rhtml+='<td>';
      rhtml+='<select class="form-control" name="university_ranking['+crankr+'][category]">';
      $.each(institute_ranking_categories,function(i,v){
        rhtml+='<option value="'+v.rank_category_id+'">'+v.rank_category+'</option>';
      });
      rhtml+='<select>';
      rhtml+='</td>';         
      rhtml+='<td>';
      rhtml+='<input type="text" class="form-control" name="university_ranking['+crankr+'][value]" value="0">';
      rhtml+='</td>';
      rhtml+='<td>';
      rhtml+='<select class="form-control" name="university_ranking['+crankr+'][category_value]" id="college_ranking_category_value'+crankr+'">';
      for (var i = 100; i <=700; i++) {
        rhtml+='<option value="'+i+'">'+i+'</option>';
      }
      rhtml+='<select>';
      rhtml+='</td>'; 
      rhtml+='<td>';
      rhtml+='<button type="button" class="btn btn-xs btn-danger" onclick="$(\'#tr' + crankr + '\').remove()"><i class="fa fa-minus"></i></button>';
      rhtml+='</td>';
      rhtml+='</tr>';

      $('#form_college_ranking_table tbody').append(rhtml);

      crankr++;
    });


  function create_ranking_value(vid,d){
    var v=vid;
    var vhtml='';

    //alert(vid);

    for (i = 100; i <=700; i++) {
      vhtml+='<option value="'+i+'">'+i+'</option>';
    }

    $('#college_ranking_category_value'+d).html(vhtml);
  }





  //UNIVERSITY INNER MENUES

  if ($("#widget_sortable").length) {
    var handleExample = document.querySelector("#widget_sortable");
    new Sortable(handleExample, {
      handle: '.handle', // handle's class
      animation: 150,
      ghostClass: 'bg-light'
    });
  }



  // var gridDemo = document.getElementById('gridDemo');

  // new Sortable(gridDemo, {
  //   animation: 150,
  //   ghostClass: 'blue-background-class'
  // });

      $('#college_menu_type_list_table').DataTable({ 
        'bJQueryUI': false,
        'stateSave': true,
        'iDisplayLength':50,
        'responsive': true,
        "pagingType": "full_numbers",
        'language': {
          'paginate': {
            'first': "<<", // This is the link to the first page
            'previous': "<", // This is the link to the previous page
            'next': ">", // This is the link to the next page
            'last': ">>" // This is the link to the last page
          }
        },
        "lengthMenu": [[10,25,50,100,250,500,1000,1500], [10,25,50,100,250,500,1000,1500]],
        "processing": true, //Feature control the processing indicator.
        "serverSide": true, //Feature control DataTables' server-side processing mode.
        "order": [], //Initial no order.
        // Load data for the table's content from an Ajax source
        "ajax": {
            "url": base_url+'/institutions/colleges/inner_menu_serach',
            "type": "POST",
            "data":{csrf_test_name:csrf_hash,_college:_college,college_type:college_type}
        },
        //Set column definition initialisation properties.
        "columnDefs": [
        { 
            "targets": [ 0 ], //first column / numbering column
            "orderable": false, //set not orderable
        },
        ],
      });

    $('#form_college_inner_menues').validate({
      rules:{
        college_inner_menu_type:{
          valueNotEquals:'0'
        },
        college_inner_menu_name:{
          required:true,
          minlength:3,
          maxlength:255
        },
        college_inner_menu_status:{
          valueNotEquals:'0'
        },
        college_inner_menu_page_heading:{
          required:true,
          minlength:3,
          maxlength:255
        },
        college_inner_menu_meta_description:{
          required:true,
          minlength:10
        },
        college_inner_menu_serial:{
          required:true
        }
      },
      messages:{
        college_inner_menu_type:{
          valueNotEquals:'Select menu type'
        },
        college_inner_menu_name:{
          required:'Enter menu name',
          minlength:'Minimum 3 charachters required',
          maxlength:'Maximum 255 charachters allowed'
        },
        college_inner_menu_status:{
          valueNotEquals:'Select menu status'
        },
        college_inner_menu_page_heading:{
          required:'Enter page heading',
          minlength:3,
          maxlength:255
        },
        college_inner_menu_meta_description:{
          required:'Enter page description',
          minlength:'Minimum 10 charachters required'
        },
        college_inner_menu_serial:{
          required:'Enter the serial no'
        }
      },
      submitHandler:function(){
          var selected=$('#college_inner_menu_type :selected').val().split("#");
          // var college_inner_menu_name=$('')
          var formdata=new FormData($('#form_college_inner_menues')[0]);
          //formdata.append('college_inner_menu_name',selected[1]);
          formdata.append('college_inner_menu_type',selected[0]);
          formdata.append('_inst_id',_college);

          $.ajax({
            type:'POST',
            url:base_url+'/institutions/create_inner_menu',
            data:formdata,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000000,
            target: '.preview',
            beforeSend:function(){
               $('#btn_college_inner_menues').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
            },
            success:function(d){
              if(d.success){

                var cid=$(this).attr('data-cid');
                var menu_id=$(this).attr('data-aid');
                var menu_type_name=$(this).attr('data-menu_name');

                var table=$('#college_menu_type_list_table').DataTable();
                table.ajax.reload( null, false );
                $('#btn_college_inner_menues').html('Save').attr('disabled',false);
                $('#form_college_inner_menues')[0].reset();
              }else{
                Swal.fire({
                  icon: 'error',
                  title: d.error,
                  confirmButtonText:'Close',
                  confirmButtonColor:'#69da68',
                  allowOutsideClick: false,
                });
                $('#btn_college_inner_menues').html('Save').attr('disabled',false);
              }
            }
          });
        }
    });


  $('body').on('change','#college_inner_menu_type',function(){
    var selected=$('#college_inner_menu_type option:selected').val().split('#');

    if(selected[0]==='16'){
      $('div.menu_des_div').css('display','none');
      $('div#special_menu_type_link_div').css('display','block');
    }else{
      $('div.menu_des_div').css('display','block');
      $('div#special_menu_type_link_div').css('display','none');
    }
  });

  $('body').on('click','.btn_edit_college_inner_menu',function(){

    var menu_name=$(this).data('menu_name');
    var menu_id=$(this).data('aid');
    var menu_serial=$(this).data('serial');
    var menu_active=$(this).data('active');
    var menu_link=$(this).data('menu_url')

    $('#collegeInnerMenuesEditModal').find('#collegeInnerMenuesEditModalTitle').html('<a href="'+menu_link+'" target="_blank">'+menu_name+'</a>');
    // $('#collegeInnerMenuesEditModal').find('#college_inner_menu_id').val(menu_id);
    // $('#collegeInnerMenuesEditModal').find('#college_inner_menu_name').val(menu_name);
    // $('#collegeInnerMenuesEditModal').find('#college_inner_menu_serial').val(menu_serial);
    //$('#collegeInnerMenuesEditModal').find('#college_inner_menu_status').val(menu_active).triger('change');

    $.ajax({
      type:'POST',
      url:base_url+'/institutions/load_inner_menu_form_data',
      data:{[csrf_name]:csrf_hash,college_id:_college,college_menu_id:menu_id},
      beforeSend:function(){
        $('#inner_menu_form_data').html('<img src="'+loadergif+'" style="text-align: center;">');
      },
      success:function(d){
        if(d.html){
          
          $('#inner_menu_form_data').html(d.html);
          // var handleExample = document.querySelector("#widget_sortable2");
          // let sortable =new Sortable(handleExample, {
          //   handle: '.handle', // handle's class
          //   animation: 150,
          //   ghostClass: 'bg-light'
          // });
          // sortable.reAssignList(handleExample);
          //$('#college_menu_widgets').trigger("chosen:updated");
          
        }else{
          $('#inner_menu_form_data').html('<div class="alert alert-error">'+d.error+'</div>');
        }
      }
    });

    $('#collegeInnerMenuesEditModal').modal('show');


  });

  $('#collegeInnerMenuesEditModal').on('hidden.bs.modal', function () {
    $('#inner_menu_form_data').html('');
  });


  //UNIVERSITY INNER MENUES


  //UNIVERSITY QUICK UPDATE

  $('body').on('click','.btn_university_quick_update',function(){
    var college_name=$(this).data('college_name');
    var college_short_name=$(this).data('college_short_name');

    $('#collegeQuickAddModal').find('#collegeQuickUpdateModalTitle').html(college_name);

    $('#collegeQuickAddModal').find('#university_name').val(college_name);
    $('#collegeQuickAddModal').find('#university_short_name').val(college_short_name);

    localStorage.setItem('media_operation','college_university_logo');
  });


  $('body').on('click','.btn_inst_quick_update',function(){

    var college_id=$(this).data('college_id');
    var college_name=$(this).data('college_name');

    $('#collegeQuickUpdateModalTitle').html(college_name);

    $.ajax({
      type:'POST',
      url:base_url+'/institutions/quick_data_load',
      data:{[csrf_name]:csrf_hash,college_id:college_id},
      beforeSend:function(){
         $("#quick_update_div").html('<img src="https://www.waytoadmissions.com/public/data/app/app_data/loader_icon.gif"/>');
      },
      success:function(d){
        if(d.html){
          $('#quick_update_div').html(d.html);
        }else{
          alert(d.error);
        }
      }
    });

    $('#collegeQuickAddModal').modal('show');


  });



 $('.file-upload-browse').on('click', function(e) {
      var file = $(this).parent().parent().parent().find('.file-upload-default');
      file.trigger('click');
  });
  $('.file-upload-default').on('change', function() {
    $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
  });


  //UNIVERSITY QUICK UPDATE




  function college_info_area(){
      if ($(".university_info").length) {
        tinymce.init({
          selector: '.university_info',
          entity_encoding : "raw",
          height: 400,
          theme: 'silver',
          plugins: [
            'advlist autolink lists link image charmap print preview hr anchor pagebreak',
            'searchreplace wordcount visualblocks visualchars code fullscreen table',
          ],
          toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
          toolbar2: 'forecolor backcolor emoticons | codesample',
          table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
          table_appearance_options: true,
          table_use_colgroups: true,
          link_quicklink: true,
          default_link_target: '_blank',
          link_context_toolbar: true,
          link_default_protocol: 'https',
          link_class_list: [
            {title: 'None', value: ''},
            {title: 'External Link', value: 'ext_link'},
            {title: 'Internal Links',
              menu: [
                {title: 'Internal Support Link', value: 'int_sup_link'},
                {title: 'Internal Marketing Link', value: 'int_mark_link'},
                {title: 'Other Internal Link', value: 'int_other_link'}
              ]
            }
          ],
          link_list: [
            {title: 'Tiny Home Page', value: 'https://www.tiny.cloud'},
            {title: 'Tiny Blog', value: 'https://www.tiny.cloud/blog'},
            {title: 'TinyMCE Support resources',
              menu: [
                {title: 'TinyMCE Documentation', value: 'https://www.tiny.cloud/docs/'},
                {title: 'TinyMCE on Stack Overflow', value: 'https://stackoverflow.com/questions/tagged/tinymce'},
                {title: 'TinyMCE GitHub', value: 'https://github.com/tinymce/'}
              ]
            }
          ],
          target_list: [
            {title: 'None', value: ''},
            {title: 'Same page', value: '_self'},
            {title: 'New page', value: '_blank'},
            {title: 'Parent frame', value: '_parent'}
          ],
          image_advtab: true,
          templates: [{
              title: 'Test template 1',
              content: 'Test 1'
            },
            {
              title: 'Test template 2',
              content: 'Test 2'
            }
          ],
          content_css: []
        });
      }
    }


function tinyMceEditLinkFrom(editor) {
    editor.windowManager.oldOpen = editor.windowManager.open;  // save for later
    editor.windowManager.open = function (t, r) {    // replace with our own function
        var modal = this.oldOpen.apply(this, [t, r]);  // call original

        var h='';
        h+='<select class="form-control" id="search_form">';
        h+='<option value="exam">Search from exams</option>';
        h+='<option value="exam_menu">Search from exams menu</option>';
        h+='<option value="college">Search from college</option>';
        h+='<option value="college_menu">Search from college menu</option>';
        h+='<option value="courses">Search from course</option>';
        h+='</select>'

        if (t.title === "Insert/Edit Link") {
            $('.tox-dialog__footer-end').append(h);

            $('#custom_button').on('click', function () {
                //Replace this with your custom function
                console.log('Running custom function')
            });
        }

        return modal; // Template plugin is dependent on this return value
    };
}


function tinyMceEditLinkSearch(editor){
  editor.windowManager.oldOpen = editor.windowManager.open;  // save for later
    editor.windowManager.open = function (t, r) {    // replace with our own function
        var modal = this.oldOpen.apply(this, [t, r]);  // call original
        var h='';
        h+='<select class="form-control" id="search_form">';
        h+='<optgroup label="Exams">';
        h+='<option value="exam">Search from exams</option>';
        h+='</optgroup>';
        h+='<optgroup label="Colleges & Universities">';
        h+='<option value="college">Search from college</option>';
        h+='<option value="universities">Search from universities</option>';
        h+='</optgroup>';
        h+='<optgroup label="Streams & Courses">';
        h+='<option value="streams">Search from streams</option>';
        h+='<option value="courses">Search from course</option>';
        h+='</optgroup>';
        h+='</select>'

        if (t.title === "Insert/Edit Link") {
            $('.tox-form').prepend('<div class="tox-form__group" aria-disabled="false"><label class="tox-label" for="form-field_9522091895521669618487996">Search URL</label><div class="tox-form__controls-h-stack"><div class="tox-control-wrap" aria-disabled="false">'+h+'<div class="tox-control-wrap__status-icon-wrap"><div title="invalid" aria-live="polite" id="aria-invalid_427930829591669618476687" class="tox-icon tox-control-wrap__status-icon-invalid"><svg width="24" height="24" focusable="false"><path d="M19.8 18.3c.2.5.3.9 0 1.2-.1.3-.5.5-1 .5H5.2c-.5 0-.9-.2-1-.5-.3-.3-.2-.7 0-1.2L11 4.7l.5-.5.5-.2c.2 0 .3 0 .5.2.2 0 .3.3.5.5l6.8 13.6zM12 18c.3 0 .5-.1.7-.3.2-.2.3-.4.3-.7a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7c0 .3.1.5.3.7.2.2.4.3.7.3zm.7-3l.3-4a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7l.3 4h1.4z" fill-rule="evenodd"></path></svg></div></div></div></div></div><div class="tox-form__group" aria-disabled="false"><label class="tox-label" for="form-field_9522091895521669618487996">Search URL</label><div class="tox-form__controls-h-stack"><div class="tox-control-wrap" aria-disabled="false"><input type="text" role="combobox" aria-autocomplete="list" aria-haspopup="true" tabindex="-1" class="tox-textfield jAuto" aria-expanded="false" id="search-box"><div id="suggesstion-box"><ul id="search_tag-list"></ul></div><div class="tox-control-wrap__status-icon-wrap"><div title="invalid" aria-live="polite" id="aria-invalid_427930829591669618476687" class="tox-icon tox-control-wrap__status-icon-invalid"><svg width="24" height="24" focusable="false"><path d="M19.8 18.3c.2.5.3.9 0 1.2-.1.3-.5.5-1 .5H5.2c-.5 0-.9-.2-1-.5-.3-.3-.2-.7 0-1.2L11 4.7l.5-.5.5-.2c.2 0 .3 0 .5.2.2 0 .3.3.5.5l6.8 13.6zM12 18c.3 0 .5-.1.7-.3.2-.2.3-.4.3-.7a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7c0 .3.1.5.3.7.2.2.4.3.7.3zm.7-3l.3-4a1 1 0 00-.3-.7 1 1 0 00-.7-.3 1 1 0 00-.7.3 1 1 0 00-.3.7l.3 4h1.4z" fill-rule="evenodd"></path></svg></div></div></div></div></div>'
            );

            $('.tox-dialog__footer-end').prepend(
                '<button title="Custom button" type="button" data-alloy-tabstop="true" tabindex="-1" class="tox-button" id="custom_button">Search</button>'
            );

        }

        return modal; // Template plugin is dependent on this return value
    };
}

function tiny_mce(ctrl_area,height=400){
    tinymce.init({
      selector: ctrl_area,
      entity_encoding : "raw",
      height: height+'px',
      autosave_restore_when_empty: true,
      theme: 'silver',
      font_formats:"Ubuntu Condensed=UbuntuCondensed;Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
      plugins: [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak,searchreplace wordcount visualblocks visualchars code fullscreen table',
      ],
      toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
      toolbar2: 'forecolor backcolor emoticons | codesample',
      table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
      setup: function(editor) {
        // Register our custom button callback function
        editor.on('init',function(e) {
            //tinyMceEditLink(editor);
            tinyMceEditLinkSearch(editor);
        });

      },
      table_appearance_options: true,
      table_use_colgroups: true
    });
  }

  $('body').on('click','#custom_button',function(){
    var search_tag=$('input#search-box').val();
    var search_from=$('#search_form :selected').val();
    load_search_link_list(search_tag,search_from);
  });

  $('body').on('click','.search_list_val',function(){
    var selected_url=$(this).data('link_list');

    console.log(selected_url);

    $('input[type=url]').val(selected_url);
    $("#suggesstion-box").hide();
  });


  function load_search_link_list(search_tag,search_from){
    var link_html='';

    $.ajax({
          type: "GET",
          url: base_url+'/link_list_exmas',
          data: 'search_from='+search_from+'&search_tag=' + search_tag,
          dataType: "json",
          beforeSend: function() {
              $("#search-box").css("background", "#FFF url(https://www.waytoadmissions.com/public/data/app/app_data/loader_icon.gif) no-repeat 165px");
          },
          success: function(d) {
             if(d.link_list!=''){
              var dd=JSON.parse(d.link_list);
              $.each(dd,function(i,v){
                link_html+='<li class="search_list_val" data-link_list="'+v.value+'">'+v.title+'</li>';
              });
             }
              $("#suggesstion-box").show();
              $("#search_tag-list").html(link_html);
              $("#search-box").css("background", "#FFF");
          }
      });

    
    // $.ajax({
    //   type:'POST',
    //   url:base_url+'/link_list_exmas',
    //   dataType: "json",
    //   data:{[csrf_name]:csrf_hash,search_tag:search_tag},
    //   success:function(d){
    //     if(d.link_list!=''){
    //       var dd=JSON.parse(d.link_list);
    //       //console.log(d.link_list);
    //       $.each(dd,function(i,v){

    //         console.log(v.title);
    //         link_html+='<button type="button" class="dropdown-item" data-link_list="'+v.value+'">'+v.title+'</button>';
    //       });
    //     }



    //     $('.list-autocomplete').html(link_html);
    //   }
    // });
  }



  function tiny_mce1(tiny_mce_class){
    tinymce.init({
      selector: tiny_mce_class,
      entity_encoding : "raw",
      height: 400,
      theme: 'silver',
      plugins: [
        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen table',
      ],
      toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link',
      toolbar2: 'forecolor backcolor emoticons | codesample',
      table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
      table_appearance_options: true,
      table_use_colgroups: true,
      autosave_restore_when_empty: true,
      autosave_retention: '30m',
      link_quicklink: true,
      default_link_target: '_blank',
      link_context_toolbar: true,
      link_default_protocol: 'https',
      link_class_list: [
        {title: 'None', value: ''},
        {title: 'External Link', value: 'ext_link'},
        {title: 'Internal Links',
          menu: [
            {title: 'Internal Support Link', value: 'int_sup_link'},
            {title: 'Internal Marketing Link', value: 'int_mark_link'},
            {title: 'Other Internal Link', value: 'int_other_link'}
          ]
        }
      ],
      link_list: [
        {
          title:'Connect to Colleges',
          menu: colleges_links
        },
        {
          title:'Connect to Universities',
          menu: university_links
        },
        {
          title:'Connect to Courses',
          menu: courses_links
        },
        {title: 'Connect to Exams',
          menu: exams_links
        },
        {title: 'Connect to Exam Menues',
          menu: exam_menues
        },
        {title: 'Connect to Exam News',
          menu: ''
        },
        {
          title:'Connect to Question Paper',
          menu:course_page_question_paper
        },
        {
          title:'Connect to Answer Paper',
          menu:course_page_answer_paper
        },
        {
          title:'Connect to Speaking Practice Paper',
          menu:course_page_speaking_test_paper
        },
        {
          title:'Connect to Writing Practice Paper',
          menu:course_page_writing_practice_paper
        },
        {
          title:'Connect to Listening Practice Paper',
          menu:course_page_listening_practice_paper
        },
        {
          title:'Connect to Sample Practice Paper',
          menu:course_page_sample_practice_paper
        },
        {title: 'Connect to Exam Syllabus PDF Links',
          menu: course_page_syllabus_pdfs
        },
        {title: 'Connect to Exam Cutoff PDF Links',
          menu: course_page_cutoff_pdfs
        }
      ],
      target_list: [
        {title: 'None', value: ''},
        {title: 'Same page', value: '_self'},
        {title: 'New page', value: '_blank'},
        {title: 'Parent frame', value: '_parent'}
      ],
      image_advtab: true,
      templates: [{
          title: 'Test template 1',
          content: 'Test 1'
        },
        {
          title: 'Test template 2',
          content: 'Test 2'
        }
      ],
      content_css: []
    });
  }


  function checkFile(fileExtension,control,e,btn_control){
 
    if ($.inArray(control.val().split('.').pop().toLowerCase(), fileExtension) == -1) {
        Swal.fire({
          icon: 'error',
          //title: "Only formats are allowed : "+fileExtension.join(', '),
          title: "Oops! Incorrect format. Only ("+fileExtension.join(', ')+") file is allowed.",
          confirmButtonText:'Close',
          confirmButtonColor:'#d33',
          allowOutsideClick: false,
        });
    }else{
      if(e.target.files[0].size<=3100000){
        control.next('div.file-select-name').html(e.target.files[0].name);
        btn_control.prop('disabled', false);
      }else{
        Swal.fire({
          icon: 'error',
          title: 'File size of '+FileZise(e.target.files[0].size)+' is violating the allowed file size of '+FileZise(3100000),
          confirmButtonText:'Close',
          confirmButtonColor:'#69da68',
          allowOutsideClick: false,
        });
        btn_control.prop('disabled', true);
      }    
    }
  }


  function FileZise(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['KB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
  }

});