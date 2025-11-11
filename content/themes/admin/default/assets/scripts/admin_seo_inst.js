jQuery(function($) {
  'use strict';

    

    

    $("#page_country").chosen({no_results_text: "Select Country"});
    $("#page_state").chosen({no_results_text: "Select State"});
    $("#page_city").chosen({no_results_text: "Select City"});
    $("#page_stream").chosen({no_results_text: "Select Stream"});
    $("#page_course").chosen({no_results_text: "Select Course"});


    $('body').on('change','#page_country',function(){
      var state_id=$('#page_state :selected').val();
      var city_id=$('#page_city :selected').val();
      var country_id=$(this).val();
      var html='<option value="0">Select State</option>';
      $.ajax({
        type:'POST',
        url:base_url+'/country/get_inst_states',
        data:{csrf_test_name:csrf_hash,country_id:country_id},
        success:function(d){
          if(d.states!=''){
            $.each(d.states,function(i,v){
              html+='<option value="'+v.college_state_id+'">'+v.state_name+'</option>';
            });
          }           

          $('#page_state').html(html);
          $("#page_state").trigger("chosen:updated");
        }
      });

      //load_streams(country_id,state_id,city_id);
    });


    $('body').on('change','#page_state',function(){
      var state_id=$(this).val();
      var city_id=$('#page_city :selected').val();
      var country_id=$('#page_country :selected').val();
      var chtml='<option value="0">Select City</option>';
      $.ajax({
        type:'POST',
        url:base_url+'/country/get_inst_cities',
        data:{csrf_test_name:csrf_hash,state_id:state_id},
        success:function(d){
          if(d.cities!=''){
            $.each(d.cities,function(i,v){
              chtml+='<option value="'+v.college_city_id+'">'+v.city_name+'</option>';
            });
          }           

          $('#page_city').html(chtml);
          $("#page_city").trigger("chosen:updated");
        }
      });

      //load_streams(country_id,state_id,city_id);

      

      load_college_list('state',state_id,state_id);
    });


    $('body').on('change','#page_city',function(){
      var state_id=$('#page_state :selected').val();
      var city_id=$(this).val();
      var country_id=$('#page_country :selected').val();
      //load_streams(country_id,state_id,city_id);
      load_college_list('city',city_id,state_id);
    });

    $('body').on('change','#page_stream',function(){
      var state_id=$('#page_state :selected').val();
      var stream_id=$(this).val();
      var city_id=$('#page_city :selected').val();
      var country_id=$('#page_country :selected').val();
      load_streams_courses(country_id,stream_id,state_id,city_id);
      load_college_list('stream',stream_id,state_id);
    });

    $('body').on('change','#page_course',function(){
      var state_id=$('#page_state :selected').val();
      var stream_id=$('#page_stream').val();
      var city_id=$('#page_city :selected').val();
      var country_id=$('#page_country :selected').val();
      var course_id=$(this).val();
      load_college_list('course',stream_id,state_id);
    });


    $('body').on('click','#generate_search_slug',function(){

      var page_country=$('#page_country :selected').val();
      var page_state=$('#page_state :selected').val();
      var page_city=$('#page_city :selected').val();
      var inst_category=$('#inst_category :selected').val();
      var page_stream=$('#page_stream :selected').val();
      var page_course=$('#page_course :selected').val();
      var ranking_agency=$('#ranking_agency :selected').val();
      var inst_type=$('#inst_type :selected').val();
      var affiliation_type=$('#affiliation_type :selected').val();

      $.ajax({
        type:'POST',
        url:base_url+'/seo/generate_search_inst_urls',
        data:{csrf_test_name:csrf_hash,page_country:page_country,page_state:page_state,page_city:page_city,inst_category:inst_category,page_stream:page_stream,page_course:page_course,ranking_agency:ranking_agency,inst_type:inst_type,affiliation_type:affiliation_type},
        beforeSend:function(){
          $('#generate_search_slug').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Validating...</span>').prop('disabled',true);
        },
        success:function(d){
          if(d.success){
            alert(d.success);
          }else if(d.error){
            alert(d.error);
          }
        },complete:function(xhr,status){
          load_college_list('',0,page_state);
          $('#generate_search_slug').html('Generate').prop('disabled',false);
        }
      });


    });


    if($('#slug_list_table').length>0){

    load_college_list('',0,0);
    }


    function load_streams(country_id,state_id=0,city_id=0){
      var shtml='<option value="0">Select Stream</option>';
      $.ajax({
        type:'POST',
        url:base_url+'/streams/get_inst_streams',
        data:{csrf_test_name:csrf_hash,country_id:country_id,state_id:state_id,city_id:city_id},
        success:function(d){
          if(d.streams!=''){
            $.each(d.streams,function(i,v){
              shtml+='<option value="'+v.stream_id+'">'+v.stream_name+'</option>';
            });
          }           

          $('#page_stream').html(shtml);
          $("#page_stream").trigger("chosen:updated");
        }
      });
    }


    function load_streams_courses(country_id,stream_id,state_id=0,city_id=0){
      var shtml='<option value="0">Select Course</option>';
      $.ajax({
        type:'POST',
        url:base_url+'/streams/get_inst_courses',
        data:{csrf_test_name:csrf_hash,country_id:country_id,state_id:state_id,city_id:city_id,stream_id:stream_id},
        success:function(d){
          if(d.courses!=''){
            $.each(d.courses,function(i,v){
              shtml+='<option value="'+v.user_course+'">'+v.course_name+'</option>';
            });
          }           

          $('#page_course').html(shtml);
          $("#page_course").trigger("chosen:updated");
        }
      });
    }


    function load_college_list(url_type,url_type_id,url_state_id,url_stream=0){
      $('#slug_list_table').DataTable().destroy();
      $('#slug_list_table').DataTable({ 
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
            "url": base_url+'/seo/search_inst_urls',
            "type": "POST",
            "data":{csrf_test_name:csrf_hash,url_type:url_type,url_type_id:url_type_id,url_state_id:url_state_id,url_stream:url_stream}
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


    $('body').on('click','.btn_update_slug_stream',function(){
      var param_type=$(this).data('param_type');
      var url_id=$(this).data('url_id');
      var url_val=$(this).data('url_val');
      var page_stream=$('#page_stream :selected').val();

      $.ajax({
        type:'POST',
        url:base_url+'/seo/update_college_slug_data',
        data:{[csrf_name]:csrf_hash,param_type:param_type,param_url:url_val,param_url_id:url_id},
        success:function(d){
          if(d.success){
            alert(d.success);
          }else if(d.error){
            alert(d.error);
          }
        },complete:function(xhr,status){
          load_college_list('',0,0,page_stream);
        }
      });

    });


    if ($('#div_college_list').length > 0) {
      
      var el = document.getElementById('div_college_list');
      new Sortable(el, {
          animation: 150,
          sort: true, // Allow sorting inside the list
          onEnd: function () {
              // Update order numbers after sorting
              let orderNumbers = document.querySelectorAll('#div_college_list .order-number');
              let orderInputs = document.querySelectorAll('#div_college_list .college_order');
              
              orderNumbers.forEach((item, index) => {
                  item.textContent = index + 1; // Update the displayed order number
              });
  
              orderInputs.forEach((item, index) => {
                  item.value = index + 1; // Update the hidden input value
              });
          }
      });



      
  }
  
  // Save order to database
  $('body').on('click', '#btn_save_course_details_data', function () {
    let collegeData = [];

    // Collect college IDs and their updated order
    document.querySelectorAll('#div_college_list .list-group-item').forEach((item, index) => {
        let collegeIdInput = item.querySelector('.college_id');
        let collegeOrderInput = item.querySelector('.college_order');

        // Debugging output to check what is being found
        console.log(`Item ${index + 1}:`, { collegeIdInput, collegeOrderInput });

        // Check if the elements exist
        if (collegeIdInput && collegeOrderInput) {
            let collegeId = collegeIdInput.value;
            let collegeOrder = collegeOrderInput.value;

            collegeData.push({
                college_id: collegeId,
                order: collegeOrder
            });
        } else {
            console.warn('Missing college_id or college_order input for an item:', item);
        }
    });

    // Debugging output for collected data
    console.log('Collected College Data:', collegeData);

    // Check if any data is collected before sending the AJAX request
    if (collegeData.length === 0) {
        alert('No college data to save!');
        return;
    }

    // Send data to the server using AJAX
    $.ajax({
        url: base_url + '/seo/update_college_list_order',
        type: 'POST',
        data: { colleges: collegeData, [csrf_name]: csrf_hash },
        success: function (response) {
            alert('Order saved successfully!');
            console.log(response);
        },
        error: function (xhr, status, error) {
            console.error('Error saving order:', error);
            alert('Failed to save order. Please try again.');
        }
    });
});


  
  
  

    

});