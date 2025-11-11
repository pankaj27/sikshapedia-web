jQuery(function($) {
  "use strict";
  var parent_folder='';
   jQuery.validator.addMethod("valueNotEquals", function(value, element, arg){
    return arg !== value;
  }, "Value must not equal arg.");

if($('#anonymous_review_list_table').length>0){
  $('#anonymous_review_list_table').DataTable({ 
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
        "url": base_url+'/reviews_anonymus_search',
        "type": "POST",
        "data":{csrf_test_name:csrf_hash,_college:_college_id}
    },
    //Set column definition initialisation properties.
    "columnDefs": [
    { 
        "targets": [ 0 ], //first column / numbering column
        "orderable": false, //set not orderable
    },
    ],
  });
}

$('body').on('change','#review_opt_for_hostels',function(){
    var selected=$('#review_opt_for_hostels :selected').val();

    if(selected=='yes'){
      $('#review_hostel_fees').prop('disabled',false);
      $('#review_hostel_fees').focus();
    }else if(selected=='no'){
      $('#review_hostel_fees').prop('disabled',true);
    }
});

  

  $('#form_review_step_1').validate({
    rules:{
      review_title:{
        required:true
      },
      review_enrollment_course:{
        valueNotEquals:'0'
      },
      review_enrollment_year:{
        valueNotEquals:'0'
      },
      review_program_fees:{
        required:true
      },
      review_board_12th:{
        valueNotEquals:'0'
      },
      review_board_10th:{
        valueNotEquals:'0'
      },
      review_percentage_12th_marks:{
        required:true
      },
      review_percentage_10th_marks:{
        required:true
      },
      review_class_size:{
        required:true
      },
      review_hostel_fees:{
        required:true
      },
    },
    messages:{
      review_title:{
        required:'Enter review title'
      },
      review_enrollment_course:{
        valueNotEquals:'Select course'
      },
      review_enrollment_year:{
        valueNotEquals:'Select enrollment year'
      },
      review_program_fees:{
        required:'Enter Fees'
      },
      review_board_12th:{
        valueNotEquals:'Select board'
      },
      review_board_10th:{
        valueNotEquals:'Select board'
      },
      review_percentage_12th_marks:{
        required:'Enter 12th percentage'
      },
      review_percentage_10th_marks:{
        required:'Enter 10th percentage'
      },
      review_class_size:{
        required:'Enter class size'
      },
      review_hostel_fees:{
        required:'Enter hostel fees'
      },
    },
    submitHandler:function(f){
      save_review_data($('#form_review_step_1').serialize())
    }
  });

  $('#form_review_step_2').validate({
      rules:{
        review_opt:{
          required:false,
          minlength:200,
          maxlength:10000
        },
        review_rating:{
          valueNotEquals:'-- no rating selected --'
        }
      },
      messages:{
        review_opt:{
          required:'Give your review',
          minlength:'Minimum 200 charachter required',
          maxlength:'Maximum 10000 charachter allowed'
        },
        review_rating:{
          valueNotEquals:'Select Rating'
        }
      },
      submitHandler:function(f){
        save_review_steps_data($('#form_review_step_2'),$('#form_review_step_2_btn'));
      }
  });


  $('#form_review_step_3').validate({
      rules:{
        review_opt:{
          required:false,
          minlength:200,
          maxlength:10000
        },
        review_rating:{
          valueNotEquals:'-- no rating selected --'
        }
      },
      messages:{
        review_opt:{
          required:'Give your review',
          minlength:'Minimum 200 charachter required',
          maxlength:'Maximum 10000 charachter allowed'
        },
        review_rating:{
          valueNotEquals:'Select Rating'
        }
      },
      submitHandler:function(f){
        save_review_steps_data($('#form_review_step_3'),$('#form_review_step_3_btn'));
      }
  });


  $('#form_review_step_4').validate({
      rules:{
        review_opt:{
          required:false,
          minlength:200,
          maxlength:10000
        },
        review_rating:{
          valueNotEquals:'-- no rating selected --'
        }
      },
      messages:{
        review_opt:{
          required:'Give your review',
          minlength:'Minimum 200 charachter required',
          maxlength:'Maximum 10000 charachter allowed'
        },
        review_rating:{
          valueNotEquals:'Select Rating'
        }
      },
      submitHandler:function(f){
        save_review_steps_data($('#form_review_step_4'),$('#form_review_step_4_btn'));
      }
  });


  $('#form_review_step_5').validate({
      rules:{
        review_opt:{
          required:false,
          minlength:200,
          maxlength:10000
        },
        review_rating:{
          valueNotEquals:'-- no rating selected --'
        }
      },
      messages:{
        review_opt:{
          required:'Give your review',
          minlength:'Minimum 200 charachter required',
          maxlength:'Maximum 10000 charachter allowed'
        },
        review_rating:{
          valueNotEquals:'Select Rating'
        }
      },
      submitHandler:function(f){
        save_review_steps_data($('#form_review_step_5'),$('#form_review_step_5_btn'));
      }
  });


  $('#form_review_step_6').validate({
      rules:{
        review_opt:{
          required:false,
          minlength:200,
          maxlength:10000
        },
        review_rating:{
          valueNotEquals:'-- no rating selected --'
        }
      },
      messages:{
        review_opt:{
          required:'Give your review',
          minlength:'Minimum 200 charachter required',
          maxlength:'Maximum 10000 charachter allowed'
        },
        review_rating:{
          valueNotEquals:'Select Rating'
        }
      },
      submitHandler:function(f){
        save_review_steps_data($('#form_review_step_6'),$('#form_review_step_6_btn'));
      }
  });


  $('#form_review_step_7').validate({
      rules:{
        review_opt:{
          required:false,
          minlength:200,
          maxlength:10000
        },
        review_rating:{
          valueNotEquals:'-- no rating selected --'
        }
      },
      messages:{
        review_opt:{
          required:'Give your review',
          minlength:'Minimum 200 charachter required',
          maxlength:'Maximum 10000 charachter allowed'
        },
        review_rating:{
          valueNotEquals:'Select Rating'
        }
      },
      submitHandler:function(f){
        save_review_steps_data($('#form_review_step_7'),$('#form_review_step_7_btn'));
      }
  });

  $('#form_review_step_8').validate({
      rules:{
        review_opt:{
          required:false,
          minlength:200,
          maxlength:10000
        },
        review_rating:{
          valueNotEquals:'-- no rating selected --'
        }
      },
      messages:{
        review_opt:{
          required:'Give your review',
          minlength:'Minimum 200 charachter required',
          maxlength:'Maximum 10000 charachter allowed'
        },
        review_rating:{
          valueNotEquals:'Select Rating'
        }
      },
      submitHandler:function(f){
        save_review_steps_data($('#form_review_step_8'),$('#form_review_step_8_btn'));
      }
  });


  $('#form_review_step_9').validate({
      rules:{
        review_opt:{
          required:false,
          minlength:200,
          maxlength:10000
        },
        review_rating:{
          valueNotEquals:'-- no rating selected --'
        }
      },
      messages:{
        review_opt:{
          required:'Give your review',
          minlength:'Minimum 200 charachter required',
          maxlength:'Maximum 10000 charachter allowed'
        },
        review_rating:{
          valueNotEquals:'Select Rating'
        }
      },
      submitHandler:function(f){
        save_review_steps_data($('#form_review_step_9'),$('#form_review_step_9_btn'));
      }
  });


  $('#form_review_step_10').validate({
      rules:{
        review_opt:{
          required:false,
          minlength:200,
          maxlength:10000
        },
        review_rating:{
          valueNotEquals:'-- no rating selected --'
        }
      },
      messages:{
        review_opt:{
          required:'Give your review',
          minlength:'Minimum 200 charachter required',
          maxlength:'Maximum 10000 charachter allowed'
        },
        review_rating:{
          valueNotEquals:'Select Rating'
        }
      },
      submitHandler:function(f){
        save_review_steps_data($('#form_review_step_10'),$('#form_review_step_10_btn'));
      }
  });

  $('#form_review_step_11').validate({
      rules:{
        review_opt:{
          required:false,
          minlength:200,
          maxlength:10000
        },
        review_rating:{
          valueNotEquals:'-- no rating selected --'
        }
      },
      messages:{
        review_opt:{
          required:'Give your review',
          minlength:'Minimum 200 charachter required',
          maxlength:'Maximum 10000 charachter allowed'
        },
        review_rating:{
          valueNotEquals:'Select Rating'
        }
      },
      submitHandler:function(f){
        save_review_steps_data($('#form_review_step_11'),$('#form_review_step_11_btn'));
      }
  });

  $('#form_review_step_12').validate({
      rules:{
        review_opt:{
          required:false,
          minlength:200,
          maxlength:10000
        },
        review_rating:{
          valueNotEquals:'-- no rating selected --'
        }
      },
      messages:{
        review_opt:{
          required:'Give your review',
          minlength:'Minimum 200 charachter required',
          maxlength:'Maximum 10000 charachter allowed'
        },
        review_rating:{
          valueNotEquals:'Select Rating'
        }
      },
      submitHandler:function(f){
        save_review_steps_data($('#form_review_step_12'),$('#form_review_step_12_btn'));
      }
  });

  $('#form_review_step_13').validate({
      rules:{
        review_opt:{
          required:false,
          minlength:200,
          maxlength:10000
        },
        review_rating:{
          valueNotEquals:'-- no rating selected --'
        }
      },
      messages:{
        review_opt:{
          required:'Give your review',
          minlength:'Minimum 200 charachter required',
          maxlength:'Maximum 10000 charachter allowed'
        },
        review_rating:{
          valueNotEquals:'Select Rating'
        }
      },
      submitHandler:function(f){
        save_review_steps_data($('#form_review_step_13'),$('#form_review_step_13_btn'));
      }
  });

  $('#form_review_comment').validate({
      submitHandler:function(f){
          var formData=new FormData($('#form_review_comment')[0]);
          formData.append('review_status_change','yes');
          formData.append('review_unique_id',$('#review_unique_id').val());
          $.ajax({
            type:'POST',
            url:base_url+'/reviews_anonymus',
            data:formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000000,
            target: '.preview',
            beforeSend:function(){
              $('#btn_update_review_status').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);           
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
              }else if(d.error){
                Swal.fire({
                  icon: 'error',
                  title: d.error,
                  confirmButtonText:'Close',
                  confirmButtonColor:'#69da68',
                  allowOutsideClick: false,
                });
              }
            },
            complete:function(status,xhr){
              $('#btn_update_review_status').html('Submit').prop('disabled',false);
            }
          });
      }
  });


  function save_review_data(data){
    $.ajax({
      type:'POST',
      url:base_url+'/reviews_anonymus',
      data:data,
      beforeSend:function(){
        $('#btn_save_step_1').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
        
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
        }else if(d.error){
          Swal.fire({
            icon: 'error',
            title: d.error,
            confirmButtonText:'Close',
            confirmButtonColor:'#69da68',
            allowOutsideClick: false,
          });
        }
      },
      complete:function(status,xhr){
        $('#btn_save_step_1').html('Submit').prop('disabled',false);
      }
    });
  }


  function save_review_steps_data(form,btn){
    var inst_course_id=$('#review_enrollment_course :selected').val();
    var review_anonym_user_id=$('#review_user_id :selected').val();

    if(inst_course_id!='0' && review_anonym_user_id!='0'){
      var formData=new FormData(form[0]);
      formData.append('inst_course_id',inst_course_id);
      formData.append('review_anonym_user_id',review_anonym_user_id);
      formData.append('review_status_change','no');
      $.ajax({
        type:'POST',
        url:base_url+'/reviews_anonymus',
        data:formData,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000000,
        target: '.preview',
        beforeSend:function(){
          btn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
          
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
          }else if(d.error){
            Swal.fire({
              icon: 'error',
              title: d.error,
              confirmButtonText:'Close',
              confirmButtonColor:'#69da68',
              allowOutsideClick: false,
            });
          }
        },
        complete:function(status,xhr){
          btn.html('Submit').prop('disabled',false);
        }
      });
    }else{
        Swal.fire({
          icon: 'error',
          title: 'Select user and course',
          confirmButtonText:'Close',
          confirmButtonColor:'#69da68',
          allowOutsideClick: false,
        });
    }
  }

});