jQuery(function($) {
  'use strict';

  //Countries
  $('#country_list_table').DataTable({ 
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
          "url": base_url+'/settings/search_countries',
          "type": "POST",
          "data":{csrf_test_name:csrf_hash}
      },
      //Set column definition initialisation properties.
      "columnDefs": [
      { 
          "targets": [ 0 ], //first column / numbering column
          "orderable": false, //set not orderable
      },
      ],
  });


  //States
  $('#state_list_table').DataTable({ 
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
          "url": base_url+'/settings/search_countries_states',
          "type": "POST",
          "data":{csrf_test_name:csrf_hash,country:country}
      },
      //Set column definition initialisation properties.
      "columnDefs": [
      { 
          "targets": [ 0 ], //first column / numbering column
          "orderable": false, //set not orderable
      },
      ],
  });


  //Citties
  // $('body').on('change','#city_state',function(){
  //   var state=$('#city_state :selected').val();

  //   loadCities(state)
  // });
  // loadCities(state);

 
  

 // function loadCities($state){
    //$('#city_list_table').destroy();
    var table=$('#city_list_table').DataTable({ 
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
          "url": base_url+'/settings/search_countries_cities',
          "type": "POST",
          "data":{csrf_test_name:csrf_hash,country:country,state:state}
      },
      //Set column definition initialisation properties.
      "columnDefs": [
      { 
          "targets": [ 0 ], //first column / numbering column
          "orderable": false, //set not orderable
      },
      ],
    });
 // }

 $('#district_list_table').DataTable({ 
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
          "url": base_url+'/settings/search_countries_districts',
          "type": "POST",
          "data":{csrf_test_name:csrf_hash,country:country,state:state}
      },
      //Set column definition initialisation properties.
      "columnDefs": [
      { 
          "targets": [ 0 ], //first column / numbering column
          "orderable": false, //set not orderable
      },
      ],
    });


  $('#form_states').validate({
    rules:{
      state_name:{
        required:true,
      },
      state_serial:{
        required:true,
        digits:true
      }
    },
    messages:{
       state_name:{
        required:'Please enter state name',
      },
      state_serial:{
        required:'Please enter serial',
        digits:'Only numeric value allowed',
      }
    },
    errorPlacement: function(label, element) {
      label.addClass('mt-2 text-danger');
      label.insertAfter(element);
    },
    highlight: function(element, errorClass) {
      $(element).parent().addClass('has-danger')
      $(element).addClass('form-control-danger')
    },
    submitHandler:function(){
      
      var f_data = FormDataJson.formToJson(document.getElementById("form_states"));
      var ctext= CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();

      $.ajax({
        type:'POST',
        url:base_url+'/settings/save_countries_states',
        data: {ctext:ctext,state_country:country,csrf_test_name:csrf_hash},
        cache:true,
        beforeSend:function(){
          $('#state_name').prop('disabled',true);
          $('#state_serial').prop('disabled',true);
          $('#btn_save_state').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
        },
        success:function(d,status,xhr){

          if(d.success){

            var table=$('#state_list_table').DataTable();
            table.ajax.reload( null, false );

            $('#state_name').prop('disabled',false);
            $('#state_serial').prop('disabled',false);
            $('#btn_save_state').html(d.success).prop('disabled',false);

            setTimeout(function(){               
              $('#btn_save_state').html('Save').prop('disabled',true);
            },1200);
            
            
          }else{
            Swal.fire({
              icon: 'error',
              title: d.error,
              confirmButtonText:'Close',
              confirmButtonColor:'#d33',
              allowOutsideClick: false,
            });

            $('#state_name').prop('disabled',false);
            $('#state_serial').prop('disabled',false);
            $('#btn_save_state').html('Login').prop('disabled',false);
          }
        },
        error: function( jqXhr ) {
          //alert(jqXhr)
          if( jqXhr.status == 400 ) {
              Swal.fire({
                icon: 'error',
                title: 'Request url not found',
                confirmButtonText:'Close',
                confirmButtonColor:'#d33',
                allowOutsideClick: false,
              });
              window.location.reload();
          }else if( jqXhr.status == 403 ) {
              Swal.fire({
                icon: 'error',
                title: 'Request is forbidden',
                confirmButtonText:'Close',
                confirmButtonColor:'#d33',
                allowOutsideClick: false,
              });
              window.location.reload();
          }

          $('#state_name').prop('disabled',false);
          $('#state_serial').prop('disabled',false);


          $('#btn_save_state').html('Save').prop('disabled',false);
        },
        complete:function(status,xhr){
         $('#form_states')[0].reset();
        }
      });
    }
  });


  $('#form_cities').validate({
    rules:{
      city_name:{
        required:true,
      },
      city_serial:{
        required:true,
        digits:true
      }
    },
    messages:{
      city_name:{
        required:'Please enter city name',
      },
      city_serial:{
        required:'Please enter serial',
        digits:'Only numeric value allowed',
      }
    },
    errorPlacement: function(label, element) {
      label.addClass('mt-2 text-danger');
      label.insertAfter(element);
    },
    highlight: function(element, errorClass) {
      $(element).parent().addClass('has-danger')
      $(element).addClass('form-control-danger')
    },
    submitHandler:function(){
      
      var f_data = FormDataJson.formToJson(document.getElementById("form_cities"));
      var ctext= CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();

      $.ajax({
        type:'POST',
        url:base_url+'/settings/save_countries_cities',
        data: {ctext:ctext,city_country:country,csrf_test_name:csrf_hash},
        cache:true,
        beforeSend:function(){
          $('#city_name').prop('disabled',true);
          $('#city_serial').prop('disabled',true);
          $('#btn_save_city').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
        },
        success:function(d,status,xhr){

          if(d.success){

            var table=$('#city_list_table').DataTable();
            table.ajax.reload( null, false );

            $('#_city').val('');
            $('#city_name').prop('disabled',false);
            $('#city_serial').prop('disabled',false);
            $('#btn_save_city').html(d.success).prop('disabled',true);

            setTimeout(function(){               
              $('#btn_save_city').html('Save').prop('disabled',false);
            },1000);
            
            
          }else{
            Swal.fire({
              icon: 'error',
              title: d.error,
              confirmButtonText:'Close',
              confirmButtonColor:'#d33',
              allowOutsideClick: false,
            });

            $('#city_name').prop('disabled',false);
            $('#city_serial').prop('disabled',false);
            $('#btn_save_city').html('Save').prop('disabled',false);
          }
        },
        error: function( jqXhr ) {
          //alert(jqXhr)
          if( jqXhr.status == 400 ) {
              Swal.fire({
                icon: 'error',
                title: 'Request url not found',
                confirmButtonText:'Close',
                confirmButtonColor:'#d33',
                allowOutsideClick: false,
              });
              window.location.reload();
          }else if( jqXhr.status == 403 ) {
              Swal.fire({
                icon: 'error',
                title: 'Request is forbidden',
                confirmButtonText:'Close',
                confirmButtonColor:'#d33',
                allowOutsideClick: false,
              });
              window.location.reload();
          }

          $('#city_name').prop('disabled',false);
          $('#city_serial').prop('disabled',false);


          $('#btn_save_city').html('Save').prop('disabled',false);
        },
        complete:function(status,xhr){
         $('#form_cities')[0].reset();
        }
      });
    }
  });


  $('#form_districts').validate({
    rules:{
      district_name:{
        required:true,
      }
    },
    messages:{
      district_name:{
        required:'Please enter district name',
      }
    },
    errorPlacement: function(label, element) {
      label.addClass('mt-2 text-danger');
      label.insertAfter(element);
    },
    highlight: function(element, errorClass) {
      $(element).parent().addClass('has-danger')
      $(element).addClass('form-control-danger')
    },
    submitHandler:function(){
      
      var f_data = FormDataJson.formToJson(document.getElementById("form_districts"));
      var ctext= CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();

      $.ajax({
        type:'POST',
        url:base_url+'/settings/save_countries_districts',
        data: {ctext:ctext,district_country:country,csrf_test_name:csrf_hash},
        cache:true,
        beforeSend:function(){
          $('#district_name').prop('disabled',true);
          $('#btn_save_district').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
        },
        success:function(d,status,xhr){

          if(d.success){

            var table=$('#district_list_table').DataTable();
            table.ajax.reload( null, false );
            $('#district_name').prop('disabled',false);
            $('#btn_save_district').html(d.success).prop('disabled',true);

            setTimeout(function(){               
              $('#btn_save_district').html('Save').prop('disabled',false);
            },1000);
            
            
          }else{
            Swal.fire({
              icon: 'error',
              title: d.error,
              confirmButtonText:'Close',
              confirmButtonColor:'#d33',
              allowOutsideClick: false,
            });

            $('#district_name').prop('disabled',false);
            $('#btn_save_district').html('Save').prop('disabled',false);
          }
        },
        error: function( jqXhr ) {
          //alert(jqXhr)
          if( jqXhr.status == 400 ) {
              Swal.fire({
                icon: 'error',
                title: 'Request url not found',
                confirmButtonText:'Close',
                confirmButtonColor:'#d33',
                allowOutsideClick: false,
              });
              window.location.reload();
          }else if( jqXhr.status == 403 ) {
              Swal.fire({
                icon: 'error',
                title: 'Request is forbidden',
                confirmButtonText:'Close',
                confirmButtonColor:'#d33',
                allowOutsideClick: false,
              });
              window.location.reload();
          }

          $('#district_name').prop('disabled',false);
            $('#btn_save_district').html('Save').prop('disabled',false);


          $('#btn_save_district').html('Save').prop('disabled',false);
        },
        complete:function(status,xhr){
         $('#form_districts')[0].reset();
        }
      });
    }
  });


  $('body').on('click','.btn_del_district',function(){
    let _district=$(this).attr('data-aid');

    Swal.fire({
      title: "Do you want to delete the District?",
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
          url:base_url+'/settings/delete_countries_districts',
          data:{_district:_district,csrf_test_name:csrf_hash},
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
              var table=$('#district_list_table').DataTable();
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


  $('body').on('click','.btn_del_city',function(){
    let _city=$(this).attr('data-aid');

    Swal.fire({
      title: "Do you want to delete the City?",
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
          url:base_url+'/settings/delete_countries_cities',
          data:{_city:_city,csrf_test_name:csrf_hash},
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
              var table=$('#city_list_table').DataTable();
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

  $('body').on('click','.btn_edit_city',function(){
    $('#_city').val($(this).attr('data-aid'));
    $('#city_name').val($(this).attr('data-city'));
  });


  $('body').on('click','.btn_edit_distruict',function(){
    $('#_district').val($(this).attr('data-aid'));
    $('#district_name').val($(this).attr('data-district'));
  });


  $('body').on('click','.btn_create_slug',function(){
    var data_value_id=$(this).attr('data-value_id');
    var data_type=$(this).attr('data-type')
    $.ajax({
      type:'POST',
      url:base_url+'/settings/save_countries_states_single_data',
      data:{csrf_test_name:csrf_hash,data_value_id:data_value_id,data_type:data_type},
      beforeSend:function(){
          $(this).prop('disabled',true);
          $(this).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
      },
      success:function(d){
        if(d.success){
          if(data_type=='state_slug'){
            var table=$('#state_list_table').DataTable();
            table.ajax.reload( null, false );
          }else if(data_type=='city_slug'){
            var table=$('#city_list_table').DataTable();
            table.ajax.reload( null, false );
          }
          
        }
      }
    });
  });


});