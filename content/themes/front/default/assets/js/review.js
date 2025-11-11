jQuery(function($) {
  "use strict";

  var _URL = window.URL || window.webkitURL;

  //setup before functions
	var typingTimer1;                //timer identifier
	var doneTypingInterval1 = 1000;  //time in ms, 5 second for example
	var $input1 = $('#search_review_college');

	//on keyup, start the countdown
	$input1.on('keyup', function () {
	  clearTimeout(typingTimer1);
	  // typingTimer1 = setTimeout(searchColleges, doneTypingInterval1);
	  typingTimer1 = setTimeout(_searchColleges, doneTypingInterval1);
	  //doneTyping();
	});

	//on keydown, clear the countdown 
	$input1.on('keydown', function () {
	 clearTimeout(typingTimer1);
	 //doneTyping();
	});

	$input1.on('paste', function () {
	  clearTimeout(typingTimer1);
	  //doneTyping();
	});

	$input1.on('cut', function () {
	  clearTimeout(typingTimer1);
	  //doneTyping();
	});

   var json_data='';

	// $.getJSON(base_url+'uploads/app/searchresults.json',function(data){
	// 	json_data=data;
	// });

	var html='';

	function searchColleges (){
		var searchInput=$input1.val();
	  	if(searchInput===''){
			$('ul.suggestList').html('');
			return;
	  	}else{
	  		var exp=new RegExp(searchInput,'i');
	  		var html='';		  	
		  	//$.getJSON(base_url+'uploads/app/searchresults.json',function(data){
		  		$.each(json_data.searched_data,function(k,v){
		  			if(v.serach_data_name.search(exp)!=-1){
		  				
		  				html+='<li><a href="'+base_url+'reviews/write/"><span class="text">'+v.serach_data_name+'</span> <span class="category"></span></a></li>';
		  				
		  			}
		  		});
		  		$('ul.suggestList').html(html);
		  	//});
	  	}
	}

//url:base_url+'searchinstdata?_searched_param='+searchInput,

//base_url+'web-api/review.php?_searched_param='+searchInput,

	function _searchColleges_old(){
		var searchInput=$input1.val();
		 $.ajax({
      type:'GET',
      url:base_url+'searchinstdata?_searched_param='+searchInput,
      dataType:'json',
      cache:false,
      beforeSend:function(){
       
      },
      success:function(d){
        if(d!=''){
        	var html='';
          $.each(d,function(k,v){		  				
		  			html+='<li><a href="'+v.inst_review_link+'"><span class="text">'+v.inst_name+'</span> <span class="category"></span></a></li>';
		  		});
		  		$('ul.suggestList').html(html);
        }
      }
    });
	}

	function _searchColleges(){
		var searchInput=$input1.val();
		 $.ajax({
      type:'GET',
      url:base_url+'reviews/load_colleges?search_param='+searchInput,
      dataType:'json',
      cache:false,
      beforeSend:function(){
       
      },
      success:function(d){
      	var html='';
   
        if(d.searched_data!=''){        	
          $.each(d.searched_data,function(k,v){
              html+='<div class="col-6 d-flex text-lg hover-primary mb-6 pointer">';
			          html+='<span class="jsx-1879175554 icon-md icon">';
			            html+='<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><path fill="#ff7900" d="M0 11C0 4.925 4.925 0 11 0s11 4.925 11 11-4.925 11-11 11S0 17.075 0 11z"></path><path fill="#fff" d="M9.35 15.007a.822.822 0 01-.584-.241L6.242 12.24a.823.823 0 111.165-1.165l1.942 1.942 4.776-4.776a.826.826 0 011.166 1.166l-5.36 5.36a.825.825 0 01-.582.24z"></path></svg>';
			          html+='</span>';
			          html+='<span class="jsx-1879175554 pl-3"><a class="college_review_link" data-reviewlink="'+v.inst_review_link+'">'+v.inst_name+'</a></span>';
			        html+='</div>';
		  		});		  		
        }else{
        	$.each(html_r_col,function(k,v){
              html+='<div class="col-6 d-flex text-lg hover-primary mb-6 pointer">';
			          html+='<span class="jsx-1879175554 icon-md icon">';
			            html+='<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><path fill="#ff7900" d="M0 11C0 4.925 4.925 0 11 0s11 4.925 11 11-4.925 11-11 11S0 17.075 0 11z"></path><path fill="#fff" d="M9.35 15.007a.822.822 0 01-.584-.241L6.242 12.24a.823.823 0 111.165-1.165l1.942 1.942 4.776-4.776a.826.826 0 011.166 1.166l-5.36 5.36a.825.825 0 01-.582.24z"></path></svg>';
			          html+='</span>';
			          html+='<span class="jsx-1879175554 pl-3"><a class="college_review_link" data-reviewlink="'+v.inst_review_link+'">'+v.inst_name+'</a></span>';
			        html+='</div>';
		  		});	
        }

        $('div#suggestList').html(html);
      }
    });
	}


	$('body').on('click','.college_review_link',function(){
		var review_link=$(this).data('reviewlink');
		// Set the review_link value to sessionStorage
    window.localStorage.setItem('review_link', review_link);

    setTimeout(function(){
    	window.location.href=review_link;
    },1000);
	});




	// function _searchColleges(){
	// 	var searchInput=$input1.val();
	// 	 $.ajax({
 //      type:'GET',
 //      url:base_url+'web-api/glob_search.php?_searched_param='+searchInput,
 //      dataType:'json',
 //      cache:false,
 //      beforeSend:function(){
       
 //      },
 //      success:function(d){
 //        if(d!=''){
 //        	var html='';
 //          $.each(d,function(k,v){		  				
	// 	  			html+='<li><a href="'+v.inst_review_link+'"><span class="text">'+v.inst_name+'</span> <span class="category"></span></a></li>';
	// 	  		});
	// 	  		$('ul.suggestList').html(html);
 //        }
 //      }
 //    });
	// }



	if(review_course_populate==true){
		console.log(review_inst);
		var html='';
		$.ajax({
      type:'GET',
      url:base_url+'searchinstcoursedata?_searched_param='+review_inst+'&_searched_param_type='+review_inst_type,
      dataType:'json',
      cache:false,
      beforeSend:function(){
       
      },
      success:function(d){

      	console.log(d);
        if(d!=''){

        	$.each(d,function(k,v){
						html+='<div class="card mb-4 col-md-12">';
	              html+='<div class="card-body">';
	                  html+='<div class="row">';
	                    html+='<div class="col-md-9">';
	                        html+='<h5 class="text-uppercase">'+v.course_name+'</h5>';
	                        html+='<div><span class="color1"> 3 Years </span> | <span class="color2"> Fulltime </span></div>';
	                    html+='</div>';
	                    html+='<div class="col-md-3 text-right">';
	                        html+='<a href="'+v.review_link+'" class="btn btn btn-outline-primary btn-sm">Review Now</a>';
	                    html+='</div>';
	                html+='</div>';
	              html+='</div>';
	          html+='</div>';
        	});
	        	
        }

        console.log()

        $('#inst_courses').html(html);
      }
    });
	}


	$('#reviewCollegeSearckModal').on('shown.bs.modal', function (e) {
	  $('#reviewCollegeSearckModal').find('#search_review_college').focus();
	});


	// $('#review_form_step_1').validate({
	// 	rules:{

	// 	},
	// 	submitHandler:function(d){
	// 		$.ajax({
	// 			type:'POST',
	// 			url:base_url+'reviews/write_review',
	// 			data:$('#review_form_step_1').serialize(),
	// 			success:function(d){
	// 				$('#review_div').html(d.html);
	// 			}
	// 		});
			
	// 		//alert('hi');
	// 	}
	// });



	// $('#review_form_step_1').validate({
	// 	rules:{

	// 	},
	// 	submitHandler:function(d){
	// 		$.ajax({
	// 			type:'POST',
	// 			url:base_url+'reviews/write_review',
	// 			data:$('#review_form_step_1').serialize(),
	// 			success:function(d){
	// 				$('#review_div').html(d.html);
	// 			}
	// 		});
			
	// 		//alert('hi');
	// 	}
	// });


	


	function review_data(review_step,review_step_data='',review_q_type='',review_step_save=false){
		var html='';
		$.ajax({
			type:'POST',
			url:base_url+'reviews/write_review',
			data:{[csrf_name]:csrf_hash,review_step:review_step,review_step_data:review_step_data,review_q_type:review_q_type,review_step_save:review_step_save},
			success:function(d){

				if(d.html){
					$('#review_div').html(d.html);
					review_rating();
				}
					
			}
		});
	}


	function load_review_step(review_step){
		$.ajax({
			type:'POST',
			url:base_url+'reviews/load_steps_review',
			data:{[csrf_name]:csrf_hash,review_step:review_step},
			success:function(d){

				if(d.html){
					$('#review_div').html(d.html);
					review_rating();
				}
					
			}
		});
	}


	function save_review_data(data){
		$.ajax({
			type:'POST',
			url:base_url+'reviews/write_review',
			data:data,
			beforeSend:function(){
				$('#save_next').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
				$('#prev_point').prop('disabled',true);
			},
			success:function(d){
				$('#save_next').html('Save & Next').prop('disabled',false);
				$('#prev_point').prop('disabled',false);
				if(d.next_step!='final'){
					load_review_step(d.next_step);
				}else if(d.next_step=='final'){
					$('#wrapper_div').addClass('bg-white').html(d.html);
				}
			}
		});
	}



	$('body').on('click','#prev_point',function(){
		var review_step=$(this).attr('data-point');
		load_review_step(review_step);
	});

	$('body').on('change','#review_opt_for_hostels',function(){
		var selected=$('#review_opt_for_hostels :selected').val();

		if(selected=='yes'){
			$('#review_hostel_fees').prop('disabled',false);
			$('#review_hostel_fees').focus();
		}else if(selected=='no'){
			$('#review_hostel_fees').prop('disabled',true);
		}
	});


	$('#review_form_step_start').validate({
		rules:{
			review_enrollment_year:{
				valueNotEquals:'0'
			},
			review_program_fees:{
				required:true
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
			review_referrel_code:{
        remote: {
          url: base_url+'checkval_available',
          type: "POST",
          async:true,
          dataType:"json",
          data: {
            csrf_test_name:csrf_hash,
            check_type:'_ref_code',
            check_value_of:'stu',
            check_value: function() {              
              return $('#review_form_step_start :input[name="review_referrel_code"]').val();
            }            
          },
          complete: function(data){
              if( data != "true" ) {
              }
          }
        }
      },
		},
		messages:{
			review_enrollment_year:{
				valueNotEquals:'Select enrollment year'
			},
			review_program_fees:{
				required:'Enter Fees'
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
			review_referrel_code:{
				remote:'Referrel code not exists'
			}
		},
		submitHandler:function(f){
			save_review_data($('#review_form_step_start').serialize())
		}
	});

	// $('body').on('submit','#review_form_step_1',function(e){
	// 	e.preventDefault();
		
	// 	var valid=false;
	// 	var ey=$('#review_enrollment_year :selected').val();
	// 	var pfee=$('#review_program_fees').val();
	// 	var p12thmarks=$('#review_percentage_12th_marks').val();
	// 	var p10thmarks=$('#review_percentage_10th_marks').val();
	// 	var quota=$('#review_quota_available :selected').val();
	// 	var qtype=$('#review_quota_type :selected').val();
	// 	var classsize=$('#review_class_size').val();
	// 	var opthostel=$('#review_opt_for_hostels :selected').val();
	// 	var hostelfees=$('#review_hostel_fees').val();

	// 	if(opthostel=='yes'){
	// 		if(hostelfees!='' && hostelfees>0){
	// 			valid=true;
	// 			$('#review_hostel_fees-error').closest('label').css('display','none').html('');
	// 		}else{
	// 			valid=false;
	// 			$('#review_hostel_fees-error').closest('label').css('display','block').html('Enter Hostel Cost');
	// 		}
	// 	}else{
	// 		valid=true;
	// 		$('#review_hostel_fees-error').closest('label').css('display','block').html('');
	// 	}

	// 	if(classsize!='' && classsize>0){
	// 		valid=true;
	// 		$('#review_class_size-error').closest('label').css('display','none').html('');
	// 	}else{
	// 		valid=false;
	// 		$('#review_class_size-error').closest('label').css('display','block').html('Enter Class Size');
	// 	}

	// 	if(p10thmarks!='' && p10thmarks>0){
	// 		valid=true
	// 		$('#review_percentage_10th_marks-error').closest('label').css('display','none').html('');
	// 	}else{
	// 		valid=false;
	// 		$('#review_percentage_10th_marks-error').closest('label').css('display','block').html('Enter Percentage');
	// 	}

	// 	if(p12thmarks!='' && p12thmarks>0){
	// 		valid=true
	// 		$('#review_percentage_12th_marks-error').closest('label').css('display','none').html('');
	// 	}else{
	// 		valid=false;
	// 		$('#review_percentage_12th_marks-error').closest('label').css('display','block').html('Enter Percentage');
	// 	}

	// 	if(quota=='yes'){
	// 		if(qtype!='0'){
	// 			valid=true;
	// 			$('#review_quota_type-error').closest('label').css('display','none').html('');
	// 		}else{
	// 			valid=false;
	// 			$('#review_quota_type-error').closest('label').css('display','block').html('Select Quota');
	// 		}
	// 	}else{
	// 		valid=true;
	// 		$('#review_quota_type-error').closest('label').css('display','block').html('');
	// 	}

	// 	if(ey!='0'){
	// 		valid=true;
	// 		$('#review_enrollment_year-error').closest('label').css('display','none').html('');
	// 	}else{
	// 		valid=false;
	// 		$('#review_enrollment_year-error').closest('label').css('display','block').html('Select enrollment year');
	// 	}

	// 	if(pfee>0){
	// 		valid=true
	// 		$('#review_program_fees-error').closest('label').css('display','none').html('');
	// 	}else{
	// 		valid=false;
	// 		$('#review_program_fees-error').closest('label').css('display','block').html('Enter Program Fees');
	// 	}

		

		

	// 	console.log('valid:'+valid);

	// 	if(valid==true){
	// 		//save_review_data($('#review_form_step_1').serialize());
			
	// 	}else{
	// 		alert('Fields are blank');
	// 	}

		
		

	// });

	// $('#review_form_step_1').sisyphus({
 //    customKeyPrefix: 'data_form', //data prefix
 //    timeout: 10, // in seconds
 //    onSave: function() {console.log('Data form saved to Local Storage');},
 //    onRestore: function() {console.log('Data form restore from Local Storage');}
 //   });


	// $('body').on('submit','#review_form_step_2',function(e){
	// 	e.preventDefault();
	// 	// var review_step=$('#review_step').val();
	// 	// var review_step_data=$('#review_step_data').val();
	// 	// review_data(review_step,review_step_data);
	// 	save_review_data($('#review_form_step_2').serialize());
	// });

	// $('body').on('submit','#review_form_step_3',function(e){
	// 	e.preventDefault();
	// 	// var review_step=$('#review_step').val();
	// 	// var review_step_data=$('#review_step_data').val();
	// 	// review_data(review_step,review_step_data);
	// 	save_review_data($('#review_form_step_3').serialize());
	// });


	// $('body').on('submit','#review_form_step_4',function(e){
	// 	e.preventDefault();
	// 	// var review_step=$('#review_step').val();
	// 	// var review_step_data=$('#review_step_data').val();
	// 	// review_data(review_step,review_step_data);
	// 	save_review_data($('#review_form_step_4').serialize());
	// });


	// $('body').on('submit','#review_form_step_5',function(e){
	// 	e.preventDefault();
	// 	// var review_step=$('#review_step').val();
	// 	// var review_step_data=$('#review_step_data').val();
	// 	// review_data(review_step,review_step_data);
	// 	save_review_data($('#review_form_step_5').serialize());
	// });


	// $('body').on('submit','#review_form_step_6',function(e){
	// 	e.preventDefault();
	// 	// var review_step=$('#review_step').val();
	// 	// var review_step_data=$('#review_step_data').val();
	// 	// review_data(review_step,review_step_data);
	// 	save_review_data($('#review_form_step_6').serialize());
	// });


	// $('body').on('submit','#review_form_step_7',function(e){
	// 	e.preventDefault();
	// 	var review_step=$('#review_step').val();
	// 	// var review_step_data=$('#review_step_data').val();
	// 	// review_data(review_step,review_step_data);
	// 	save_review_data($('#review_form_step_7').serialize());
	// });


	// $('body').on('submit','#review_form_step_8',function(e){
	// 	e.preventDefault();
	// 	// var review_step=$('#review_step').val();
	// 	// var review_step_data=$('#review_step_data').val();
	// 	// review_data(review_step,review_step_data);
	// 	save_review_data($('#review_form_step_8').serialize());
	// });


	// $('body').on('submit','#review_form_step_9',function(e){
	// 	e.preventDefault();
	// 	// var review_step=$('#review_step').val();
	// 	// var review_step_data=$('#review_step_data').val();
	// 	// review_data(review_step,review_step_data);
	// 	save_review_data($('#review_form_step_9').serialize());
	// });

	// $('body').on('submit','#review_form_step_10',function(e){
	// 	e.preventDefault();
	// 	// var review_step=$('#review_step').val();
	// 	// var review_step_data=$('#review_step_data').val();
	// 	// review_data(review_step,review_step_data);
	// 	save_review_data($('#review_form_step_10').serialize());
	// });


	$('body').on('keyup','#review_opt',function() {
    
	  var characterCount = $(this).val().length,
	      maximum = 1000,
	      theCount = $('#the-count');

	      console.log(characterCount+'/'+maximum);
	    
	  	theCount.text(characterCount+'/'+maximum);
	 
	  
	      
	});


	// $('body').on('change','#review_opt_for_hostels',function(e){
	// 	var hopt=$('#review_opt_for_hostels :selected').val();
	// 	if(hopt=='yes'){
	// 		$('#review_hostel_fees').prop('disabled',false).focus();
	// 	}else{
	// 		$('#review_hostel_fees').prop('disabled',true);
	// 	}
	// });


	var i=1;

	$('body').on('click','#span_add_more',function(e){
		var html='';


		html+='<div id="row_'+i+'">';
			html+='<div class="row">';
        html+='<div class="form-group col-sm-6">';
          html+='<input class="form-control" name="review_inst['+i+'][name]" id="review_inst_name_'+i+'" placeholder="College Name">';
            html+='</div>';
              html+='<div class="form-group col-sm-6">';
                  html+='<input class="form-control" name="review_inst['+i+'][course]" id="review_inst_course_'+i+'" placeholder="Course">';
              html+='</div>';
            html+='</div>';

            html+='<div class="row">';
              html+='<div class="form-group col-sm-12">';
                html+='<textarea class="form-control" name="review_inst['+i+'][reason]" id="review_inst_reason_'+i+'" placeholder="Why didn\'t you opt for this college?" rows="3"></textarea>';
              html+='</div>';
            html+='</div>';

            html+='<div class="row">';
              html+='<div class="form-group col-sm-12">';
                html+='<div class="row mx-0">';
                  html+='<span class="add-btn text-primary pt-2 col-12 px-0 text-right">';
                    html+='<span class="pointer" id="span_add_more" onclick="$(\'#row_' + i + '\').remove()">Remove</span>';
                  html+='</span>';
                html+='</div>';
              html+='</div>';
            html+='</div>';
        html+='</div>';
      html+='</div>';

            $('#div_row').append(html);

		i++;
	});


	$("#file_idproof_image").change(function(e) {
      var file, img,img_height,img_width,allowed_file_size;

      if ((file = this.files[0])) {
          img = new Image();
          img.src = _URL.createObjectURL(file);
          img.onload = function() {            

              allowed_file_size=999500*5;
             
              if(file.size<=allowed_file_size){

                $('.logo_image').attr('src', img.src);

              }else{
                Toast.fire({
                  icon: 'error',
                  title: 'Selected file size is '+file_size(file.size)
                });

              }

          };
          img.onerror = function() {
              alert( "not a valid file: " + file.type);
          };

      }

  });

  $("#file_marksheet_image").change(function(e) {
      var file, img,img_height,img_width,allowed_file_size;

      if ((file = this.files[0])) {
          img = new Image();
          img.src = _URL.createObjectURL(file);
          img.onload = function() {            

              allowed_file_size=999500*5;
             
              if(file.size<=allowed_file_size){

                $('.logo_image').attr('src', img.src);

              }else{
                Toast.fire({
                  icon: 'error',
                  title: 'Selected file size is '+file_size(file.size)
                });

              }

          };
          img.onerror = function() {
              alert( "not a valid file: " + file.type);
          };

      }

  });

  $('body').on('click','#btn_change_profile_image',function(){
    $('#file_profile_photo').trigger('click');
  });

  $('body').on('click','#btn_change_idproof',function(){
    $('#file_idproof_image').trigger('click');
  });

  $('body').on('click','#btn_change_marksheet',function(){
    $('#file_marksheet_image').trigger('click');
  });

	


});