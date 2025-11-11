jQuery(function($) {
  "use strict";

  // This set of validators requires the File API, so if we'ere in a browser
    // that isn't sufficiently "HTML5"-y, don't even bother creating them.  It'll
    // do no good, so we just automatically pass those tests.
    var is_supported_browser = !!window.File,
        fileSizeToBytes,
        formatter = $.validator.format;

    /**
     * Converts a measure of data size from a given unit to bytes.
     *
     * @param number size
     *   A measure of data size, in the give unit
     * @param string unit
     *   A unit of data.  Valid inputs are "B", "KB", "MB", "GB", "TB"
     *
     * @return number|bool
     *   The number of bytes in the above size/unit combo.  If an
     *   invalid unit is specified, false is returned
     */
    fileSizeToBytes = (function () {

        var units = ["B", "KB", "MB", "GB", "TB"];

        return function (size, unit) {

            var index_of_unit = units.indexOf(unit),
                coverted_size;

            if (index_of_unit === -1) {

                coverted_size = false;

            } else {

                while (index_of_unit > 0) {
                    size *= 1024;
                    index_of_unit -= 1;
                }

                coverted_size = size;
            }

            return coverted_size;
        };
    }());

  $.ajaxSetup({cache:false}); 

    //setup before functions
	var typingTimer;                //timer identifier
	var doneTypingInterval = 0.1;  //time in ms, 5 second for example
	var $input = $('#searchInput');

	//on keyup, start the countdown
	$input.on('keyup', function () {
	  clearTimeout(typingTimer);
	  typingTimer = setTimeout(doneTyping2, doneTypingInterval);
	  //doneTyping();
	});

	//on keydown, clear the countdown 
	$input.on('keydown', function () {
	 clearTimeout(typingTimer);
	 typingTimer = setTimeout(doneTyping2, doneTypingInterval);
	});

	$input.on('paste', function () {
	  // clearTimeout(typingTimer);
	  // typingTimer = setTimeout(doneTyping2, doneTypingInterval);
	  doneTyping2();
	});

	$input.on('cut', function () {
	  clearTimeout(typingTimer);
	 typingTimer = setTimeout(doneTyping2, doneTypingInterval);
	});

	//user is "finished typing," do something

	

	//url:base_url+'searchdata?_searched_param='+searchInput
	//url:base_url+'web-api/glob_search.php?_searched_param='+searchInput,
	//url:'https://api.waytoadmissions.com/v1/globapi/glob_search?_searched_param=c'+searchInput,

	function doneTyping2 () {
	  	var searchInput=$input.val();
	  	if(searchInput!=''){
			$.ajax({
		      type:'GET',
		      url:base_url+'web-api/glob_search.php?_searched_param='+searchInput,
		      data:{},
		      cache:false,
		      success:function(d){

		      	//console.log(d);

		        html='<div class="jsx-2743981883 desktop-search-list bg-offwhite">';
		        if(d.searched_data && d.searched_data!=''){

		      		$.each(d.searched_data,function(k,v){
			  			var exp=new RegExp(searchInput,'i');
			  			if(v.serach_data_name.search(exp)!=-1){
			  				
			  				html+='<span class="jsx-2743981883 menu-items pb-2  d-flex align-items-center text-heading undefined">';
		          			html+='<div class="jsx-2743981883 d-inline-block  align-self-start pt-1">';
		            		html+='<img data-src="'+v.searched_data_logo+'" src="'+v.searched_data_logo+'" alt="'+v.serach_data_name+'" class="jsx-2355921263 logo-img lazyloaded" loading="lazy">';
		          			html+='</div>';
		          			html+='<div class="jsx-2743981883 col text-new font-weight-bold text-capitalize"><a href="'+v.searched_access_url+'" class="jsx-2743981883 mb-0 h2 list-name"><strong>'+v.serach_data_name+'</strong></a><div class="jsx-2743981883 d-flex flex-nowrap tabs-container" wfd-id="2542"></div>';
		          			html+='</div>';
		          			html+='<p class="jsx-2743981883 m-0 text-17 text-subheading text-tiny font-weight-bold text-capitalize "><span style="margin-right:5px !important;"><img data-src="'+v.searched_country_logo+'" src="'+v.searched_country_logo+'" alt="'+v.serach_data_name+'" class="jsx-2355921263 logo-img lazyloaded" loading="lazy" style="height: 20px;vertical-align: bottom;"></span> <strong>'+v.search_data_type+'<strrong></p>';
		        			html+='</span>';
			  				
			  			}
			  		});
		      	}
			  		
		  		html+='</div>';
		  		$('div.trendingSearch').html(html);
		      }
		    });
		    
	  	}else{
	  		html='<div class="searchBody">';
              html+='<h5>TRENDING SEARCHES</h5>';
              html+='<ul class="">';
                html+='<li>Upcoming Exams';
                html+='</li><li> "IIT" in Colleges</li>';
                html+='<li>"CAT" in Exams</li>';
                html+='<li>"Cat Cutoff" in News</li>';
                html+='<li>"MBA Colleges" in Delhi/NCR</li>';
                html+='<li>"MCA Colleges" in Delhi/NCR</li>';
              html+='</ul>';
          html+='</div>';
	  		$('div.trendingSearch').html(html);
	  	}		  	
	}

	var json_data='';

	// $.getJSON(base_url+'uploads/app/searchresults.json',function(data){
	// 	json_data=data;
	// });



	var html='';

	// html+='<span class="jsx-2743981883 menu-items pb-2  d-flex align-items-center text-heading undefined">';
	//           			html+='<div class="jsx-2743981883 d-inline-block  align-self-start pt-1">';
	//             		html+='<img data-src="'+v.searched_data_logo+'" src="'+v.searched_data_logo+'" alt="logo" class="jsx-2355921263 logo-img lazyloaded" loading="lazy">';
	//           			html+='</div>';
	//           			html+='<div class="jsx-2743981883 col text-new font-weight-bold text-capitalize"><a href="'+v.searched_access_url+'" class="jsx-2743981883 mb-0 h2 list-name">'+v.serach_data_name+'</a><div class="jsx-2743981883 d-flex flex-nowrap tabs-container" wfd-id="2542"></div>';
	//           			html+='</div>';
	//           			html+='<p class="jsx-2743981883 m-0 text-17 text-subheading text-tiny font-weight-bold text-capitalize ">'+v.search_data_type+'</p>';
	//         			html+='</span>';

	// $('body').on('keyup','#searchInput',function (e) {
	// 	var markup = [];
	// 	var searchInput=$input.val();
	//   	if(searchInput===''){
	// 		$('div.trendingSearch').html('');
	// 		return;
	//   	}else{
	//   		var exp=new RegExp(searchInput,'i');		  	
	// 	  	//$.getJSON(base_url+'uploads/app/searchresults.json',function(data){
	// 	  		// html='<div class="jsx-2743981883 desktop-search-list bg-offwhite">';
	// 	  		markup.push('<div class="jsx-2743981883 desktop-search-list bg-offwhite">');
	// 	  		$.each(json_data.searched_data,function(k,v){
	// 	  			if(v.searched_data_name.search(exp)!=-1){	  				
		  				

	//         			markup.push('<span class="jsx-2743981883 menu-items pb-2  d-flex align-items-center text-heading">');
	//         			markup.push('<div class="jsx-2743981883 d-inline-block  align-self-start pt-1">');
	//         			markup.push('<img data-src="'+v.searched_data_logo+'" src="'+v.searched_data_logo+'" alt="logo" class="jsx-2355921263 logo-img lazyloaded" loading="lazy">');
	//         			markup.push('</div>');
	//         			markup.push('<div class="jsx-2743981883 col text-new font-weight-bold text-capitalize"><a href="'+v.searched_access_url+'" class="jsx-2743981883 mb-0 h2 list-name">'+v.searched_data_name+'</a><div class="jsx-2743981883 d-flex flex-nowrap tabs-container"></div>');
	//         			markup.push('</div>');
	//         			markup.push('<p class="jsx-2743981883 m-0 text-17 text-subheading text-tiny font-weight-bold text-capitalize ">'+v.searched_data_type+'</p>');
	//         			markup.push('</span>');
		  				
	// 	  			}
	// 	  		});
	// 	  		// html+='</div>';
	// 	  		markup.push('</div>');
	// 	  		$('div.trendingSearch').html(markup.join(""));
	// 	  	//});
	//   	}		  
	// });


	function doneTyping1 (){
		var searchInput=$input.val();
	  	if(searchInput===''){
			$('div.trendingSearch').html('');
			return;
	  	}else{
	  		var exp=new RegExp(searchInput,'i');		  	
		  	//$.getJSON(base_url+'uploads/app/searchresults.json',function(data){
		  		html='<div class="jsx-2743981883 desktop-search-list bg-offwhite">';
		  		$.each(json_data.searched_data,function(k,v){
		  			if(v.serach_data_name.search(exp)!=-1){
		  				
		  				html+='<span class="jsx-2743981883 menu-items pb-2  d-flex align-items-center text-heading undefined">';
	          			html+='<div class="jsx-2743981883 d-inline-block  align-self-start pt-1">';
	            		html+='<img data-src="'+v.searched_data_logo+'" src="'+v.searched_data_logo+'" alt="logo" class="jsx-2355921263 logo-img lazyloaded">';
	          			html+='</div>';
	          			html+='<div class="jsx-2743981883 col text-new font-weight-bold text-capitalize"><a href="'+v.searched_access_url+'" class="jsx-2743981883 mb-0 h2 list-name">'+v.serach_data_name+'</a><div class="jsx-2743981883 d-flex flex-nowrap tabs-container" wfd-id="2542"></div>';
	          			html+='</div>';
	          			html+='<p class="jsx-2743981883 m-0 text-17 text-subheading text-tiny font-weight-bold text-capitalize ">'+v.search_data_type+'</p>';
	        			html+='</span>';
		  				
		  			}
		  		});
		  		html+='</div>';
		  		$('div.trendingSearch').html(html);
		  	//});
	  	}
	}


	///Get Cities
	//setTimeout(function(){
		var cities='';

		// $.ajax({
		// 	type:'GET',
		// 	url:'https://api.waytoadmissions.com/v1/coapi/cities/_searched_param/'+country,
		// 	beforeSend:function(){

		// 	},
		// 	success:function(d){
		// 		cities=d.searched_data;
		// 	}
		// });
	//},1200);
	  



 

  jQuery.validator.addMethod("valueNotEquals", function(value, element, arg){
  	return arg !== value;
  }, "Value must not equal arg.");

  jQuery.validator.addMethod("alphanumeric", function(value, element) {
    return this.optional(element) || /^[\w.]+$/i.test(value);
  }, "Letters, numbers, and underscores only please");

  $.validator.addMethod(
      "minFileSize",
      function (value, element, params) {

          var files,
              unit = params.unit || "KB",
              size = params.size || 100,
              min_file_size = fileSizeToBytes(size, unit),
              is_valid = false;

          if (!is_supported_browser || this.optional(element)) {

              is_valid = true;

          } else {

              files = element.files;

              if (files.length < 1) {

                  is_valid = false;

              } else {

                  is_valid = files[0].size >= min_file_size;

              }
          }

          return is_valid;
      },
      function (params, element) {
          return formatter(
              "File must be at least {0}{1} large.",
              [params.size || 100, params.unit || "KB"]
          );
      }
  );

  $.validator.addMethod(
        "maxFileSize",
        function (value, element, params) {

            var files,
                unit = params.unit || "KB",
                size = params.size || 100,
                max_file_size = fileSizeToBytes(size, unit),
                is_valid = false;

            if (!is_supported_browser || this.optional(element)) {

                is_valid = true;

            } else {

                files = element.files;

                if (files.length < 1) {

                    is_valid = false;

                } else {

                    is_valid = files[0].size <= max_file_size;

                }
            }

            return is_valid;
        },
        function (params, element) {
            return formatter(
                "File cannot be larger than {0}{1}.",
                [params.size || 100, params.unit || "KB"]
            );
        }
  );


    $('body').on('click','.apply',function(){
    	var _cname='<h6 class="mt-0 mb-0">Register now to apply</h6>'+$(this).attr('data-cname');
    	var _clogo=$(this).attr('data-clogo');
    	var _cphcode='Phone no ('+$(this).attr('data-cphcode')+')';
    	var _ci=$(this).attr('data-inst');
    	var _cit=$(this).attr('data-inst_type');

    	var _co=$(this).attr('data-cou');
    	//$("#applicant_city").chosen({no_results_text: "Oops, nothing found!"});
    	$("#applicant_course").chosen({no_results_text: "Oops, nothing found!"});

    	$.ajax({
    		type:'POST',
    		url:base_url+'get_states_cities',
    		data:{_co:_co,csrf_test_name:csrf_hash},
    		success:function(d){
    			if(d.html!=''){
    				$('#reg3ApplyModal').find('#applicant_city').html(d.html);
    				$("#applicant_city").trigger("chosen:updated");
    			}
    		}
    	});

    	$.ajax({
    		type:'POST',
    		url:base_url+'get_courses',
    		data:{_co:_co,_inst:_ci,csrf_test_name:csrf_hash},
    		success:function(d){
    			if(d.html!=''){
    				$('#reg3ApplyModal').find('#applicant_course').html(d.html);
    				$("#applicant_course").trigger("chosen:updated");
    			}
    		}
    	});

    	$('#reg3ApplyModal').find('div.media img').attr('src',_clogo);
    	$('#reg3ApplyModal').find('div.media-body').html(_cname);
    	$('#reg3ApplyModal').find('label#ph_code').html(_cphcode);
    	$('#reg3ApplyModal').find('#applicant_institute').val(_ci);
    	$('#reg3ApplyModal').find('#applicant_institute_type').val(_cit);
    	$('#reg3ApplyModal').modal('show');
    });

    $('#reg3ApplyModal').on('hidden.bs.modal', function () {
	  $('#reg3ApplyModal').find('div.media img').attr('src','');
      $('#reg3ApplyModal').find('div.media-body').html('');
	});

	$('#reg3ApplyModal').on('show.bs.modal', function () {
	  
	});

	// $('#applicant_city').select2({
	// 	dropdownParent: $('#reg3ApplyModal'),
	// 	placeholder: 'City you live in'
	// });

	 
	$.validator.addMethod("valueNotEquals", function(value, element, arg){
    return arg !== value;
 	}, "Value must not equal arg.");

	


	$("#reg4ApplyModal").find('#applicant_state').chosen();
	$('body').on('click','button.btn_reg_for_job',function(){
		var _j=$(this).attr('data-job_position');
		var _cname='<h3 class="mt-0 mb-0">Register now to apply for '+_j+'</h3>Currently hiring is restricted to India';
		var _d=$(this).attr('data-job_value');
		var _co=$(this).attr('data-co');

		$('#reg4ApplyModal').find('div.media-body').html(_cname);
		$('#reg4ApplyModal').find('input#applicant_type').val(_d);
		$('#reg4ApplyModal').modal('show');
	});


	$('#form_apply_for_job').validate({
		ignore:[],
		rules:{
			applicant_full_name:{
				required:true
			},
			applicant_email:{
				required:true,
				email:true
			},
			applicant_ph:{
				required:true,
				digits:true
			},
			applicant_state:{
				valueNotEquals:"0"
			},
			applicant_pincode:{
				required:true,
				digits:true
			},
			applicant_address:{
				required:true
			},
			applicant_photo:{
				required:true,
	          	extension: "jpeg|jpg|png",
                maxFileSize: {
                    "unit": "KB",
                    "size": 10000
                },
                minFileSize: {
                    "unit": "KB",
                    "size": "1"
                }
			},
			applicant_cv:{
				required:true,
				extension: "doc|docx",
                maxFileSize: {
                    "unit": "KB",
                    "size": 100000
                },
                minFileSize: {
                    "unit": "KB",
                    "size": "1"
                }
			}
		},
		messages:{
			applicant_full_name:{
				required:'Please Enter full name'
			},
			applicant_email:{
				required:'Please Enter email address',
				email:'Email address is not valid'
			},
			applicant_ph:{
				required:'Please Enter phone no.',
				digits:'Only digits are allowed'
			},
			applicant_state:{
				valueNotEquals:"Please Select state"
			},
			applicant_pincode:{
				required:'Please Enter pincode',
				digits:'Only digits are allowed'
			},
			applicant_address:{
				required:'Please enter your full address'
			},
			applicant_photo:{
				required:'Please provide your photo'
			},
			applicant_cv:{
				required:'Please provide your CV'
			}
		},
		submitHandler:function(){
			var formData = new FormData($('#form_apply_for_job')[0]);
			//formData.append('csrf_test_name', csrf_hash);
	        $.ajax({
	            type:'POST',
	            url:base_url+'registerjobapplication',
	            data:formData,
	            cache: false,
	            contentType: false,
	            processData: false,
	            timeout: 60000000,
	            target: '.preview',
	            beforeSend:function(){
	              //$('#btn_submit_job_application').html('Uploading started').attr('disabled',true);
	            },
	            success:function(f){
	              if(f.success){
	                Toast.fire({
	                  icon: 'success',
	                  title: f.success
	                });
	                $('#form_gallery_settings')[0].reset(); 
	              }else if(f.error){
	                Toast.fire({
	                  icon: 'error',
	                  title: f.error
	                });
	              }else if(f.redirect){
	                window.location.href=f.redirect;
	              }
	            },
	            xhr: function(){
	                //Get XmlHttpRequest object
	                 var xhr = $.ajaxSettings.xhr() ;
	                //Set onprogress event handler
	                 xhr.upload.onprogress = function(data){
	                    var perc =(data.loaded / data.total) * 100;
	                    $('#btn_update_gallery').html(perc.toFixed(2) + '% Uploaded').attr('disabled',false);
	                 };
	                 return xhr ;
	            },
	            error: function (e) {
	              Toast.fire({
	                icon: 'error',
	                title: 'Error Occurred'
	              });
	            },
	            complete:function(status,xhr){
	              $('#btn_submit_job_application').html('Upload').attr('disabled',true);
	            },
	            resetForm: true 
	          });
			}
	});

	//setup before functions
	var typingTimer1;                //timer identifier
	var doneTypingInterval1 = 100;  //time in ms, 5 second for example
	var $input1 = $('#search_courses');



	//on keyup, start the countdown
	$input1.on('keyup', function () {
	  clearTimeout(typingTimer1);
	  // typingTimer1 = setTimeout(searchColleges, doneTypingInterval1);
	  typingTimer1 = setTimeout(_searchCourses, doneTypingInterval1);
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

	//if($('#search_exams').length>0){
		var $input2 = $('input#search_exams');

		//on keyup, start the countdown
		$input2.on('keyup', function () {
		  clearTimeout(typingTimer1);
		  // typingTimer1 = setTimeout(searchColleges, doneTypingInterval1);
		  typingTimer1 = setTimeout(_searchExams, doneTypingInterval1);
		  //doneTyping();
		});

		//on keydown, clear the countdown 
		$input2.on('keydown', function () {
		 clearTimeout(typingTimer1);
		 //doneTyping();
		});

		$input2.on('paste', function () {
		  clearTimeout(typingTimer1);
		  //doneTyping();
		});

		$input2.on('cut', function () {
		  clearTimeout(typingTimer1);
		  //doneTyping();
		});
	//}


		


	//'searchcoursedata?_searched_param='+searchInput,

	//data:{_searched_param:searchInput,csrf_test_name:csrf_hash},

	//'web-api/search_course.php?_searched_param='+searchInput,

	function _searchCourses(){
		var searchInput=$input1.val();
		var html2='';
		if(searchInput!=''){
			$.ajax({
		      type:'GET',
		      url:wb_api+'capi/courses/_searched_param/'+searchInput,
		      dataType:'json',
		      data:{},
		      cache:false,
		      beforeSend:function(){
		          
		      },
		      success:function(d){
		        if(d.searched_data){			        
			        $.each(d.searched_data,function(k,v){
					  	html2+='<li><a href="'+v.course_url+'">'+v.course_name+' [ '+v.course_short_name+' ]</a></li>';
					});

					$('ul#ul_course_list').html(html2);
				  	
		        }else{
		        	$('ul#ul_course_list').html('');
		        }		        
		      }
	    	});
			

		}else{
			$('ul#ul_course_list').html('');
		}		
	}

	function _filterCourses(_filter_stream,_filter_type){
		var html3='';
		$.ajax({
			type:'POST',
			url:wb_api+'capi/courses_filter',
			dataType:'json',
			data:{_filter_stream:_filter_stream,_filter_type:_filter_type},
			cache:false,
			beforeSend:function(){
		    },
		    success:function(d){
		    	if(d.course_data){
		    		$.each(d.course_data,function(k,v){
					  	html3+='<div class="card mb-4">';
                      html3+='<div class="card-body">';
                          html3+='<div class="row">';
                            html3+='<div class="col-md-9">';
                                html3+='<h5 class="text-uppercase">'+v.course_name+'</h5>';
                                html3+='<div><span class="color1">'+v.course_duration+' </span> | <span class="color2">'+v.course_duration_type+' </span></div>';
                            html3+='</div>';
                            html3+='<div class="col-md-3 text-right">';
                                html3+='<h2 class="color2">'+v.course_colleges_total+'</h2>';
                                html3+='<p>College offering this course</p>';
                            html3+='</div>';
                            html3+='<div class="col-md-12">';
                              html3+='<a href="#" class="btn btn btn-outline-primary btn-sm">Courses Overview</a>';
                              html3+='<a href="#" class="btn btn btn-primary btn-sm">Apply Now</a>';
                            html3+='</div>';
                        html3+='</div>';
                      html3+='</div>';
                  html3+='</div>';
					});


					$('#stream_course_list').html(html3);
		    	}else{
		    		$('#stream_course_list').html('');
		    	}
		    }
		});
	}


	if(page=='course_list_page'){
		$('body').on('click','li a.filter_course',function(){

			$(this).toggleClass('filter_course selected', true);

			var _filter_type=$(this).attr('data-type');

			_filterCourses(_filter_stream,_filter_type);

		});

		_filterCourses(_filter_stream,'all');
	}

		
	if(page=='exam_list_page'){
		//_filterExams("","");
		var start = 11;
   		var limit = 10;

		var doneScrollingInterval = 500;
	   	var scrollTimer=-1; 
	   	var processing=false;

		$('body').on('click','.exam_filter',function(){
			var selected_states = $('.states_filter:checked').map(function() {return this.value;}).get().join(',');

			_filterExams(selected_states,$(this).val(),$('.exam_application_filter').val());

		});

		$('body').on('click','.exam_application_filter',function(){
			var selected_states = $('.states_filter:checked').map(function() {return this.value;}).get().join(',');

			_filterExams(selected_states,$('.exam_filter').val(),$(this).val());

		});


		$('body').on('click','.states_filter',function(){

			var selected_states = $('.states_filter:checked').map(function() {return this.value;}).get().join(',');

			//console.log(selected_states);

			_filterExams(selected_states,$('.exam_filter').val(),$('.exam_application_filter').val());

		});



	    var position = $(window).scrollTop();

	    //need to fix
	     //$(window).scroll(function(){
	     	//if (processing)
    		//return false;
	        
	       	//if ($(window).scrollTop() >= ($(document).height() - $(window).height())*0.2){
				//scrollTimer = setTimeout(doScroll, doneScrollingInterval);
				
				//var selected_states = $('.states_filter:checked').map(function() {return this.value;}).get().join(',');
				//_filterExams(selected_states,$('.exam_filter').val(),$('.exam_application_filter').val(),limit,start,true);
				
				//$(window).scrollTop($(window).scrollTop()-1);

	      // }
	     //});


	 //    $(window).scroll(function(){
		// 	if ($(window).scrollTop() == $(document).height() - $(window).height()){
		// 		alert('hi');
		// 		var selected_states = $('.states_filter:checked').map(function() {return this.value;}).get().join(',');
		// 			_filterExams(selected_states,$('.exam_filter').val(),$('.exam_application_filter').val(),limit,start);;
		// 	}
		// });
		
	}

	function _searchExams(){
		var searchInput=$input2.val();
		var html2='';
		if(searchInput!=''){
			$.ajax({
		      type:'GET',
		      url:wb_api+'exapi/exams/_searched_param/'+searchInput,
		      dataType:'json',
		      data:{},
		      cache:false,
		      beforeSend:function(){
		          
		      },
		      success:function(d){
		        if(d.searched_data){			        
			        $.each(d.searched_data,function(k,v){
					  	html2+='<li><a href="'+v.course_url+'">'+v.course_name+' [ '+v.course_short_name+' ]</a></li>';

					  	html2+='<li class="jsx-4178042208 mt-5 border-bottom pb-5 d-flex align-items-start">';
                               html2+='<a href="'+v.exam_link+'">';
                                html2+='<div class="media">';
                                    html2+='<a href="'+v.exam_link+'"><img src="https://www.sikshapedia.com/public/data/exams/2022/Eo8GBmgF1l.webp" class="mr-3 shadow-sm w-60p" alt="'+v.exam_name+'"></a>';
                                html2+='</div>';
                               html2+='</a>';
                               html2+='<div class="d-inline-block position-relative ml-10 title-container pr-3 exm-container">';
                                 html2+='<h3 class="text-uppercase mt-0 exam-title">';
                                   html2+='<a class="text-sidebar-heading" href="/exams/cat">';
                                     html2+='<span>'+v.exam_name+'</span>';
                                   html2+='</a>';
                                 html2+='</h3>';
                               html2+='</div>';
                             html2+='</li>';
					});

					$('ul#ul_exam_list').html(html2);
				  	
		        }else{
		        	$('ul#ul_exam_list').html('');
		        }		        
		      }
	    	});
			

		}else{
			$('ul#ul_exam_list').html('');
		}		
	}
1

	function _searchExams2(){
		var searchInput=$input2.val();
		var html2='';
		if(searchInput!=''){
			$.ajax({
		      type:'GET',
		      url:wb_api+'exapi/listing_search?_filter_qr='+searchInput,
		      dataType:'json',
		      data:{},
		      cache:false,
		      beforeSend:function(){
		      },
		      success:function(d){
		        if(d.searched_data){			        
			        $.each(d.searched_data,function(k,v){
					  	html2+='<li class="jsx-2566320323 mt-5 border-bottom pb-5 d-flex align-items-start">';
					  	html2+='<a class="jsx-2566320323" href="'+v.exam_url+'">';
					  	html2+='<div class="jsx-2566320323 exam-logo d-flex align-items-center justify-content-center text-center ml-2 text-white rounded-circle">'+v.exam_short_name+'</div>';
					  	html2+='</a>';
					  	html2+='<div class="jsx-2566320323 d-inline-block position-relative ml-10 title-container pr-3">';
					  	html2+='<h3 class="jsx-2566320323 text-uppercase mt-0 exam-title">';
					  	html2+='<a class="jsx-2566320323 text-sidebar-heading" alt="'+v.exam_url+'">';
					  	html2+='<span class=""jsx-2566320323>'+v.exam_formatted_name+'</span>';
					  	html2+='</a>';
					  	html2+='</h3>';
					  	if(v.exam_streams!=null){
					  		$.each(v.exam_streams,function(_i,_v){
					  			html2+='<a class="jsx-2566320323 font-weight-bold mb-2 text-uppercase comma exam-stream" href="'+_v.stream_search_url+'"><span class="jsx-2566320323">'+_v.stream_name+'</span></a>';
					  		});					  		
					  	}
					  	html2+='</div>';
					  	html2+='</li>';
					});

					$('ul#ul_exam_list').html(html2);
				  	
		        }else{
		        	$('ul#ul_exam_list').html('');
		        }		        
		      }
	    	});
			

		}else{
			$('ul#ul_exam_list').html('');
		}		
	}

	


	function _filterExams(_filter_state,_filter_exam_mode,_filter_exam_application_mode,_filter_length=10,_filter_start=0,scrolling=false){
		var html='';
		$.ajax({
	      type:'POST',
	      url:wb_api+'exapi/exam_filter',
	      dataType:'json',
	      data:{_filter_country:_filter_country,_filter_state:_filter_state,_filter_stream:_filter_stream,_filter_exam_mode:_filter_exam_mode,_filter_exam_application_mode:_filter_exam_application_mode,_filter_length:_filter_length,_filter_start},
	      cache:false,
	      beforeSend:function(){
	      	processing = true;
	      },
	      success:function(d){
	      	//alert(d);
	        if(d.exams_data){			        
		        $.each(d.exams_data,function(k,v){
				  	html+='<div class="card examListCard mb-3">';
	            html+='<div class="card-header bg-white">';
	                html+='<div class="row">';
	                    html+='<div class="col-sm-6">';
	                        html+='<div class="media">';
	                            html+='<img src="'+v.exam_logo+'" class="mr-3 shadow-sm w-60p" alt="'+v.exam_full_name+'" loading="lazy">';
	                            html+='<div class="media-body">';
	                            	
	                            	if(v.exam_mode!=""){	                            		
	                            		html+='<div class="d-flex mb-1 examLabels">';
	                            		for (let indx in v.exam_mode) {
										  html+='<div  class="bg-indigo text-white px-1 mr-2 f10 examLabel">'+v.exam_mode[indx]+'</div>';
										}
	                            		html+='</div>';
	                            	}
	                            	
	                             html+='<h6 class="mt-0 mb-1"> '+v.exam_year_short_name+'</h6>';
	                              html+='<small>'+v.exam_full_name+'</small>';
	                            html+='</div>';
	                        html+='</div>';
	                    html+='</div>';
	                    html+='<div class="col-sm-6">';
	                        html+='<div class="row form-row">';
	                        
	                        	if(v.exam_application_form_dates!=""){
	                        		
	                        		html+='<div class="col">';
		                                html+='<div class="examDatesInfo">';
		                                	if(v.exam_application_form_dates['dates_active']=='1'){
		                                		html+='<div class="examLabel">Application is comming up</div>';
		                                	}
		                                     
		                                    html+='<p class="m-0"><small>'+v.exam_application_form_dates['start_date']+' - '+v.exam_application_form_dates['end_date']+'</small> </p>';
		                                    html+='<b class="color-teal"> application form</b>';
		                                html+='</div>';
		                            html+='</div>';	                        		
	                        	}


	                        	if(v.exam_dates!=""){
	                        		
	                        		html+='<div class="col">';
		                                html+='<div class="examDatesInfo">';
		                                	
		                                	if(v.exam_dates['dates_active']=='1'){
		                                	
		                                		html+='<div class="examLabel">Examination is comming up</div>';
		                                		
		                                	}
		                                
		                                    html+='<p class="m-0"><small>'+v.exam_dates['start_date']+' - '+v.exam_dates['end_date']+'</small> </p>';
		                                    html+='<b class="color-teal"> examination</b>';
		                                html+='</div>';
		                            html+='</div>';
	                        		
	                        	}


	                        	if(v.exam_result_dates!=""){
	                        		
	                        		html+='<div class="col">'
		                                html+='<div class="examDatesInfo">';
		                                    html+='<p class="m-0"><small>'+v.exam_result_dates['start_date']+' - '+v.exam_result_dates['end_date']+'</small> </p>';
		                                    html+='<b class="color-teal"> application form</b>';
		                                html+='</div>';
		                            html+='</div>';
	                        		
	                        	}

	                        	   
	                        html+='</div>';
	                    html+='</div>';
	                html+='</div>';
	            html+='</div>';
	            html+='<div class="card-body">'+v.exam_desc+'</div>';
	            html+='<div class="card-footer bg-white">';
	                html+='<a href="" class="btn btn-light btn-sm">APPLICATION</a>';
	                html+='<a href="" class="btn btn-light btn-sm">PROCESSCUTOFFEXAM</a>';
	                html+='<a href="" class="btn btn-light btn-sm">PATTERNPRACTICE</a>';
	                html+='<a href="" class="btn btn-light btn-sm">PAPERSPREPARATION</a>';
	                html+='<a href="" class="btn btn-light btn-sm">TIPSRESULTS</a>';
	                html+='<a href="" class="btn btn-primary btn-sm"> APPLY NOW</a>';
	            html+='</div>';
	        html+='</div>';
				});

				if(scrolling==true){
					$('section#exams_list').append(html);
				}else if(scrolling==false){
					$('section#exams_list').html(html);
				}
				
			  	
	        }else{
	        	if(scrolling==false){
	        		$('section#exams_list').html('');
	        	}
	        	
	        }		        
	      }
    	});
	}

	if(page=='course_details_page'){
		$("#query_city").chosen({no_results_text: "Select City",include_group_label_in_selected:true});
		$("#query_course").chosen({no_results_text: "Select Course",include_group_label_in_selected:true});
		$("#query_distance_course").chosen();
		$.getJSON(wb_api+'coapi/cities/_searched_param/'+country,function(data){
			json_data=data.searched_data;
			var city_html='';
			$.each(json_data,function(k,v){
				city_html+='<optgroup label="'+k+'">';
				$.each(v,function(_k,_v){
					city_html+='<option value="'+_v.city_id+'">'+_v.city_name+'</option>';
				});
  			 	
  			 	city_html+='</optgroup>';
  			 });

  			 $('#query_city').html(city_html);
  			 $("#query_city").trigger("chosen:updated");
		});

		$.getJSON(wb_api+'capi/courses_filters/_searched_param/1',function(data){
			json_data=data.searched_data;
			var course_html='';
			$.each(json_data,function(k,v){
				course_html+='<optgroup label="'+k+'">';
				$.each(v,function(_k,_v){
					course_html+='<option value="'+_v.course_id+'">'+_v.course_name+' [ '+_v.course_short_name+' ]</option>';
				});
  			 	
  			 	course_html+='</optgroup>';
  			 });

  			 $('#query_course').html(course_html);
  			 $("#query_course").trigger("chosen:updated");
		});


		// $('#form_ask_question').validate({
		// 	rules:{
		// 		query_user_full_name:{
		// 			required:true,
		// 			minlength:5,
		// 			maxlength:60
		// 		},
		// 		query_user_email:{
		// 			required:true,
		// 			email:true
		// 		},
		// 		query_user_ph:{
		// 			required:true,
		// 			digits:true
		// 		},
		// 		query_message:{
		// 			required:true,
		// 			rangelength:[20,300]
		// 		}
		// 	},
		// 	messages:{
		// 		query_user_full_name:{
		// 			required:'Enter your name',
		// 			minlength:'Minimum 5 charachter needs to be given',
		// 			maxlength:'Maximum 60 charachters allowed'
		// 		},
		// 		query_user_email:{
		// 			required:'Enter your mail id',
		// 			email:'Email id is not valid'
		// 		},
		// 		query_user_ph:{
		// 			required:'Enter your contact no',
		// 			digits:'Only numeric value allowed'
		// 		},
		// 		query_message:{
		// 			required:'Please enter your message',
		// 			rangelength:[20,300]
		// 		}
		// 	},
		// 	submitHandler:function(f){
		// 		var f_data = FormDataJson.formToJson(document.getElementById("form_ask_question"));
  //     			var ctext= CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();

  //     			$.ajax({
  //     				type:'POST',
		// 	        url:base_url+'registerquery',
		// 	        data: {ctext:ctext,csrf_test_name:csrf_hash},
		// 	        cache:false,
		// 	        beforeSend:function(){
		// 	          $('#query_user_full_name').prop('disabled',true);
		// 	          $('#query_user_email').prop('disabled',true);
		// 	          $('#query_user_ph').prop('disabled',true);
		// 	          $('#btn_submit_query').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
		// 	        },
		// 	        success:function(d,status,xhr){
		// 	        	if(d.success){
		// 	        		alert(d.success);
		// 	        	}else{
		// 	        		alert(d.error);
		// 	        	}
		// 	        }
  //     			});
		// 	}
		// });
	}

	//Record Visit


	if(_vtype!=''){
		setTimeout(function(){
			$.ajax({
				type:'POST',
				url:wb_api+'globapi/glob_visit',
				data:{visit_type:_vtype,visit_type_id:_cid,visit_state:_st,visit_city:_cit,visit_country:_cot,visit_ip:_vip},
				success:function(){

				}
			});
		},1200);
	}
		

	$('#regAskAquestionModal').on('shown.bs.modal', function (e) {
		var city_html='';
		//if(json_data){

		  		//}
		// $.ajax({
		// 	type:'GET',
		// 	url:'https://api.waytoadmissions.com/v1/coapi/cities/_searched_param/'+country,
		// 	beforeSend:function(){

		// 	},
		// 	success:function(d){
		// 		cities=d.searched_data;
		// 		if(json_data){
		//   			 $.each(json_data,function(k,v){
		//   			 	city_html+='<option value="'+v.city_id+'">'+v.city_name+'</option>'
		//   			 });

		//   			 $('#query_city').html(city_html);
		//   		}
		// 	}
		// });
  		
 	})

});