jQuery(function($) {
  'use strict';

  var _URL = window.URL || window.webkitURL;

  var units = ["B", "KB", "MB", "GB", "TB"];

  function file_size(size, unit) {

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

  $('#campaign_contact_list_table').DataTable({ 
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
          "url": base_url+'/ads/search',
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


  if($('#ads_free_imagelist_table').length>0){
    $('#ads_free_imagelist_table').DataTable({ 
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
          "url": base_url+'/ads/searchfreeimageads',
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
  }

  if($('#adsgroup_list_table').html().length>0){ 
    var html='';
   $.ajax({
    type:'POST',
    url:base_url+'/ads/search',
    dataType:'JSON',
    data:{[csrf_name]:csrf_hash,listing_category_type:'TYPE_2'},
    success:function(d){
      //console.log(d.data);
      if(d.data!=null){
        $.each(d.data,function(i,v){
          html+=v;
        });

        $('#adsgroup_list_table').html(html);
        $( ".ads_body_live_form_container" ).draggable({ revert: "valid" });
        $( "#snaptarget" ).droppable({
          accept: ".ads_body_live_form_container",
          drop: function( event, ui ) {
            var droppable = $(this);
            var draggable = ui.draggable;
           // Move draggable into droppable
           droppable.find('p').remove();
            draggable.appendTo(droppable);
            draggable.removeAttr('style');

          }
        });

      }
    }
   });   
  }




  //Ads Group
  $('#adsgroup_name').val(ads_default_title);
  $('body').on('keyup keydown paste cut','#adsgroup_name',function(){
    var v=$('#adsgroup_name').val();
    var html=ads_default_title;
    if(v!=''){
      html=v;
    }else{
      html=html;
    }
    $('#add_title').html(html);
  });

  $('body').on('keyup keydown paste cut','#ads_name',function(){
    var v=$('#ads_name').val();
    var html='NIIT University - The University of the Future';
    if(v!=''){
      html=v;
    }else{
      html=html;
    }
    $('.type_1_title').html(html);
    $('.img_ads_logo').attr('alt', html);
  });


  $('body').on('keyup keydown paste cut','#ads_short_name',function(){
    var v1=$('#ads_short_name').val();
    var html1='Applications Open for 2020-21';
    if(v1!=''){
      html1=v1;
    }else{
      html1=html1;
    }
    $('.type_1_short_title').html(html1);
  });

  $('body').on('keyup keydown paste cut','#ads_short_desc',function(){
    var v2=$('#ads_short_desc').val();
    var html2='Applications Open for 2020-21';
    if(v2!=''){
      html2=v2;
    }else{
      html2=html2;
    }
    $('.type_1_short_desc').html(html2);
  });


  $('body').on('keyup keydown paste cut','#ads_external_link',function(){
    var v2=$('#ads_external_link').val();
    var href='';
    if(v2!=''){
      href=v2;
    }else{
      href=href;
    }
    $('.btn_ads_apply_now').attr('href',href);
  });



  //form_ads_add_edit_1

  $('body').on('keyup keydown paste cut','#form_ads_add_edit_1 #ads_name',function(){
    var v=$('#form_ads_add_edit_1 #ads_name').val();
    //alert(v);
    var html='IIM Kozhikode, Kochi Campus';
    if(v!=''){
      html=v;
    }else{
      html=html;
    }

    $('#_ads_view_port_1').find('#college_name').attr('title',html).html(html);
    $('#_ads_view_port_1').find('#logo_img').attr('alt', html);

    $('#ads_view_port_1').find('#college_name').attr('title',html).html(html);
    $('#ads_view_port_1').find('#logo_img').attr('alt', html);
  });

  $('body').on('keyup keydown paste cut','#form_ads_add_edit_1 #ads_short_name',function(){
    var v=$('#form_ads_add_edit_1 #ads_short_name').val();
    //alert(v);
    var html=' MBA for Working Executives ';
    if(v!=''){
      html=v;
    }else{
      html=html;
    }

    $('#_ads_view_port_1').find('.admission_info').html(html);
    $('#ads_view_port_1').find('.admission_info').html(html);
  });

  $('body').on('keyup keydown paste cut','#form_ads_add_edit_1 #ads_short_desc',function(){
    var v=$('#form_ads_add_edit_1 #ads_short_desc').val();
    //alert(v);
    var html='  Master of Business Administration(MBA) for Working Executives. A two-year class room programme at IIMK Kochi campus    ';
    if(v!=''){
      html=v;
    }else{
      html=html;
    }

    $('#_ads_view_port_1').find('.extra_info').html(html);
    $('#ads_view_port_1').find('.extra_info').html(html);
  });


  $('body').on('keyup keydown paste cut','#form_ads_add_edit_1 #ads_external_link',function(){
    var v=$('#form_ads_add_edit_1 #ads_external_link').val();
    //alert(v);
    var html='  ';
    if(v!=''){
      html=v;
    }else{
      html=html;
    }

    $('#_ads_view_port_1').find('.ads_live_form_desktop_tnew').attr('href',html);
    $('#ads_view_port_1').find('.ads_live_form_desktop_tnew').attr('href',html);
  });

  //form_ads_add_edit_1



  //form_ads_add_edit_2

  $('body').on('keyup keydown paste cut','#form_ads_add_edit_2 #ads_name',function(){
    var v=$('#form_ads_add_edit_2 #ads_name').val();
    //alert(v);
    var html='IIM Kozhikode, Kochi Campus';
    if(v!=''){
      html=v;
    }else{
      html=html;
    }

    $('#_ads_view_port_2').find('#college_name').attr('title',html).html(html);
    $('#_ads_view_port_2').find('#logo_img').attr('alt', html);

    $('#ads_view_port_2').find('#college_name').attr('title',html).html(html);
    $('#ads_view_port_2').find('#logo_img').attr('alt', html);
  });

  $('body').on('keyup keydown paste cut','#form_ads_add_edit_2 #ads_short_name',function(){
    var v=$('#form_ads_add_edit_2 #ads_short_name').val();
    //alert(v);
    var html=' MBA for Working Executives ';
    if(v!=''){
      html=v;
    }else{
      html=html;
    }

    $('#_ads_view_port_2').find('.admission_info').html(html);
    $('#ads_view_port_2').find('.admission_info').html(html);
  });

  $('body').on('keyup keydown paste cut','#form_ads_add_edit_2 #ads_short_desc',function(){
    var v=$('#form_ads_add_edit_2 #ads_short_desc').val();
    //alert(v);
    var html='  Master of Business Administration(MBA) for Working Executives. A two-year class room programme at IIMK Kochi campus    ';
    if(v!=''){
      html=v;
    }else{
      html=html;
    }

    $('#_ads_view_port_2').find('.extra_info').html(html);
    $('#ads_view_port_2').find('.extra_info').html(html);
  });


  $('body').on('keyup keydown paste cut','#form_ads_add_edit_2 #ads_external_link',function(){
    var v=$('#form_ads_add_edit_2 #ads_external_link').val();
    //alert(v);
    var html='  ';
    if(v!=''){
      html=v;
    }else{
      html=html;
    }

    $('#_ads_view_port_2').find('.ads_live_form_desktop_tnew').attr('href',html);
    $('#ads_view_port_2').find('.ads_live_form_desktop_tnew').attr('href',html);
  });

  //form_ads_add_edit_2


  //form_ads_add_edit_3

  $('body').on('keyup keydown paste cut','#form_ads_add_edit_3 #ads_name',function(){
    var v=$('#form_ads_add_edit_3 #ads_name').val();
    //alert(v);
    var html='IIM Kozhikode, Kochi Campus';
    if(v!=''){
      html=v;
    }else{
      html=html;
    }

    $('#_ads_view_port_3').find('#college_name').attr('title',html).html(html);
    $('#_ads_view_port_3').find('#logo_img').attr('alt', html);

    $('#ads_view_port_3').find('#college_name').attr('title',html).html(html);
    $('#ads_view_port_3').find('#logo_img').attr('alt', html);
  });

  $('body').on('keyup keydown paste cut','#form_ads_add_edit_3 #ads_short_name',function(){
    var v=$('#form_ads_add_edit_3 #ads_short_name').val();
    //alert(v);
    var html=' MBA for Working Executives ';
    if(v!=''){
      html=v;
    }else{
      html=html;
    }

    $('#_ads_view_port_3').find('.admission_info').html(html);
    $('#ads_view_port_3').find('.admission_info').html(html);
  });

  $('body').on('keyup keydown paste cut','#form_ads_add_edit_3 #ads_short_desc',function(){
    var v=$('#form_ads_add_edit_3 #ads_short_desc').val();
    //alert(v);
    var html='  Master of Business Administration(MBA) for Working Executives. A two-year class room programme at IIMK Kochi campus    ';
    if(v!=''){
      html=v;
    }else{
      html=html;
    }

    $('#_ads_view_port_3').find('.extra_info').html(html);
    $('#ads_view_port_3').find('.extra_info').html(html);
  });


  $('body').on('keyup keydown paste cut','#form_ads_add_edit_3 #ads_external_link',function(){
    var v=$('#form_ads_add_edit_3 #ads_external_link').val();
    //alert(v);
    var html='  ';
    if(v!=''){
      html=v;
    }else{
      html=html;
    }

    $('#_ads_view_port_3').find('.ads_live_form_desktop_tnew').attr('href',html);
    $('#ads_view_port_3').find('.ads_live_form_desktop_tnew').attr('href',html);


  });

  //form_ads_add_edit_3



  // $("#ads_image").change(function(e) {
  //     var file, img,img_height,img_width,allowed_file_size;

  //     if ((file = this.files[0])) {
  //         img = new Image();
  //         img.src = _URL.createObjectURL(file);
  //         img.onload = function() {            

  //             img_height=this.height;
  //             img_width=this.width;
  //             allowed_file_size=999500*5;
             
  //             if(img_height>=50 && img_width>=50 && file.size<=allowed_file_size){

  //               $('.img_ads_logo').attr('src', img.src);

  //             }else{
  //               Toast.fire({
  //                 icon: 'error',
  //                 title: 'For the best results on all devices, use an image that’s at least 500 x 500 pixels and 6MB or less.Selected file is '+img_width+'x'+img_height+' pixels and file size is '+file_size(file.size)
  //               });

  //             }

  //         };
  //         img.onerror = function() {
  //             alert( "not a valid file: " + file.type);
  //         };

  //     }

  // });


  jQuery.validator.addMethod("alphanumeric", function(value, element) {
    return this.optional(element) || /^[\w.]+$/i.test(value);
  }, "Letters, numbers, and underscores only please");

  // Applying perfect-scrollbar 
  if ($('.chat-aside .tab-content').length) {
    const sidebarBodyScroll = new PerfectScrollbar('.chat-aside .tab-content');
  }
  if ($('.chat-content .chat-body').length) {
    const sidebarBodyScroll = new PerfectScrollbar('.chat-content .chat-body');
  }

  $('body').on('change input paste','#folder_name',function(){
    var fn=$('#folder_name').val();
    if(fn!=''){
       $('#btn_create_btn').attr('disabled',false); 
    }else{
      $('#btn_create_btn').attr('disabled',true);
    }
  });




  $('#newFolderModal').find('#parent_folder_disk_name').val(parent_folder);


  $('body').on('click','.folder_ellipsed_name',function(){
  $('#newFolderModal').find('#parent_folder_disk_name').val($(this).attr('data-disk_name'));

  $('#back_to_parent').attr('data-back',$(this).attr('data-pfoldder_disk_name'));
  $('#back_to_parent').attr('data-p-back',$(this).attr('data-spfoldder_disk_name'));

    // $('#curent_folder').html($(this).attr('data-fname'));
    // $('#curent_folder_created').html($(this).attr('data-cdate'));
    // $('#newFileModal').find('#folder_data').val($(this).attr('data-folder'));

    // $('#document_folder').val($(this).attr('data-folder'));
    // $('#parent_folder').val($(this).attr('data-folder'));
    // $('#parent_folder_name').val($(this).attr('data-folder'));

    // $('#back_to_parent').attr('data-back',$(this).attr('data-pfoldder'));

    get_folders($(this).attr('data-disk_name'));
    get_files($(this).attr('data-disk_name'));
    $('#file_parent_folder').val($(this).attr('data-disk_name'));
    // get_folders_in();
  });



  $('body').on('click','#back_to_parent',function(){
    var p=$(this).attr('data-back');
    // alert(parent);
    get_folders(p);
    get_files(p);
    $('#file_parent_folder').val(p);
    $('#back_to_parent').attr('data-back',$(this).attr('data-p-back'));
  });


  $('#form_file_browser_upload').validate({
    
    submitHandler:function(d){
      $.ajax({
          type:'POST',
          url:base_url+'/settings/browser/_upload_file',
          data:new FormData($('#form_file_browser_upload')[0]),
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#btn_upload_files').html('<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Uploading...</span></div>').attr('disabled',true);
            $('.progress-bar').width('0%');
            $('.progress-bar').attr('aria-valuenow','0');
            // $('.progress-bar').text('0%');
          },
          success:function(f){
            if(f.success){
                Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
              $('.progress-bar').css('width','0%');
              $('.progress-bar').attr('aria-valuenow','0');
            }else if(f.error){
                Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
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
                  var perc =(data.loaded / data.total) * 100;// Math.round((data.loaded / data.total) * 100);
                  $('.progress-bar').css('width',perc.toFixed(2) + '%');
                  //.text(perc.toFixed(2) + '%');
                  $('.progress-bar').attr('aria-valuenow',perc.toFixed(2));
               };
               return xhr ;
          },
          error: function (e) {
            
              Swal.fire({
              icon: 'error',
              title: 'Error has occurred while uploading the media file.',
              confirmButtonText:'Close',
              confirmButtonColor:'#69da68',
              allowOutsideClick: false,
            });
          },
          complete:function(status,xhr){
            $('.progress-bar').css('width', '0%');
            $('.progress-bar').attr('aria-valuenow','0');
            $('#btn_upload_files').html('Upload').attr('disabled',false);
            get_files($('#form_file_browser_upload').find('#file_parent_folder').val());
          },
          resetForm: true 
        });
    }
  });


  $('#form_folder_browser').validate({
    rules:{
      folder_name:{
        required:true,
        alphanumeric: true,
        minlength:3,
        maxlength:128
      }
    },
    messages:{
      folder_name:{
        required:'Enter folder name',
        alphanumeric: "Letters, numbers, and underscores only please",
        minlength: "Folder name should be at least 8 characters",
        maxlength: "Folder name should be maximum 128 characters"
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
     var folder_name=$('#folder_name').val();
     var parent_folder_disk_name=$('#parent_folder_disk_name').val();

      $.ajax({
        type:'POST',
        url:base_url+'/settings/browser/_create_folder',
        data: {parent_folder_disk_name:parent_folder_disk_name,folder_name:folder_name,csrf_test_name:csrf_hash},
        cache:false,
        beforeSend:function(){
          $('#btn_create_btn').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
        },
        success:function(d,status,xhr){
          if(d.success){
            var html='<div class="alert alert-success alert-dismissible fade show" role="alert">'+d.success+'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            $('#newFolderModal').find('div.diverror').html(html);

              get_folders(parent_folder_disk_name);
             
              setTimeout(function(){
                $('#newFolderModal').find('div.diverror').html('');    
                $('#btn_create_btn').html('Create').prop('disabled',false);
                //$('#newFolderModal').find('#form_folder_browser')[0].reset();
                $('#newFolderModal').find('#folder_name').val('');
                $('#newFolderModal').modal('toggle');                
              },1200);              
          }else if(d.error){
            var html='<div class="alert alert-danger alert-dismissible fade show" role="alert">'+d.error+'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';

            $('#newFolderModal').find('div.diverror').html(html);

            setTimeout(function(){
              $('#newFolderModal').find('div.diverror').html('');    
              $('#btn_create_btn').html('Create').prop('disabled',false);
              $('#newFolderModal').find('#form_browser_folder')[0].reset();               
            },1200); 
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

          $('#newFolderModal').find('#form_browser_folder')[0].reset();

          $('#btn_create_btn').html('Create').prop('disabled',false);
        }
      });
    }
  });


  //0
  $('#tinyFileBrowserModal').on('hidden.bs.modal', function () {
      $('#buttons_wrapper').css('display','block');
  });

   $('#tinyFileBrowserModal').on('shown.bs.modal', function (e) {

    get_folders(parent_folder,'tinyFileBrowserModal');
    get_files(parent_folder,'tinyFileBrowserModal');
    $('#tinyFileBrowserModal #file_parent_folder').val(parent_folder);

    $('#buttons_wrapper').css('display','none');
  });


  //1
  $('#tinyFileBrowserModal_1').on('hidden.bs.modal', function () {
      $('#buttons_wrapper').css('display','block');
  });

   $('#tinyFileBrowserModal_1').on('shown.bs.modal', function (e) {

    get_folders(parent_folder,'tinyFileBrowserModal_1');
    get_files(parent_folder,'tinyFileBrowserModal_1');
    $('#tinyFileBrowserModal_1 #file_parent_folder').val(parent_folder);

    $('#buttons_wrapper').css('display','none');
  });


   //2
   $('#tinyFileBrowserModal_2').on('hidden.bs.modal', function () {
      $('#buttons_wrapper').css('display','block');
  });

   $('#tinyFileBrowserModal_2').on('shown.bs.modal', function (e) {

    get_folders(parent_folder,'tinyFileBrowserModal_2');
    get_files(parent_folder,'tinyFileBrowserModal_2');
    $('#tinyFileBrowserModal_2 #file_parent_folder').val(parent_folder);

    $('#buttons_wrapper').css('display','none');
  });

   //3
   $('#tinyFileBrowserModal_3').on('hidden.bs.modal', function () {
      $('#buttons_wrapper').css('display','block');
    });

   $('#tinyFileBrowserModal_3').on('shown.bs.modal', function (e) {

    get_folders(parent_folder,'tinyFileBrowserModal_3');
    get_files(parent_folder,'tinyFileBrowserModal_3');
    $('#tinyFileBrowserModal_3 #file_parent_folder').val(parent_folder);

    $('#buttons_wrapper').css('display','none');
  });


  function get_folders(parent_folder,popup){
    $.ajax({
      type:'POST',
      url:base_url+'/settings/browser/_get_folders',
      data:{csrf_test_name:csrf_hash,parent_folder:parent_folder},
      success:function(d){
        $('#'+popup+' #sys_folders').html(d.html);
      }
    });
  }

  function get_files(parent_folder,popup){
    $.ajax({
      type:'POST',
      url:base_url+'/settings/browser/_get_files',
      data:{csrf_test_name:csrf_hash,parent_folder:parent_folder},
      success:function(d){
        $('#'+popup+' #sys_files').html(d.html);
      }
    });
  }


  $('.file-upload-browse').on('click', function(e) {
      var file = $(this).parent().parent().parent().find('.file-upload-default');
      file.trigger('click');
  });

  $('.file-upload-default').on('change', function() {
    $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
  });

    //0
    $(document).on('click','#tinyFileBrowserModal .img-fluid',function(){
      var dataimg=$(this).attr('data-img');
      
      $('.img_ads_logo').attr('src', dataimg);
      $('.file-upload-info').val(dataimg);
        
      $('#tinyFileBrowserModal').modal('hide');
    });

    //1
    $(document).on('click','#tinyFileBrowserModal_1 .img-fluid',function(){
      var dataimg=$(this).attr('data-img');
      ///alert(dataimg);
      $('#tinyFileBrowserModal_1.file-upload-info').val(dataimg);
      $('img#logo_img').attr('src', dataimg);
        
      $('#tinyFileBrowserModal_1').modal('hide');
    });


    //2
    $(document).on('click','#tinyFileBrowserModal_2 .img-fluid',function(){
      var dataimg=$(this).attr('data-img');
      $('#tinyFileBrowserModal_2.file-upload-info').val(dataimg);
      $('img#logo_img2').attr('src', dataimg);
        
      $('#tinyFileBrowserModal_2').modal('hide');
    });


    //3
    $(document).on('click','#tinyFileBrowserModal_3 .img-fluid',function(){
      var dataimg=$(this).attr('data-img');
      $('#tinyFileBrowserModal_3.file-upload-info').val(dataimg);

      $('#tinyFileBrowserModal_3.logo img').attr('src', dataimg);
        
      $('#tinyFileBrowserModal_3').modal('hide');
    });


    $('body').on('change','#form_ads_add_edit_3 #ads_type',function(){
      var s=$('form#form_ads_add_edit_3 #ads_type :selected').val();

      if(s=='WAYTO_REVIEW_ADS'){
        $('#form_ads_add_edit_3').find('#ads_short_name_div').css('display','none');
        $('#form_ads_add_edit_3').find('#ads_short_desc_div').css('display','none');
        $('#form_ads_add_edit_3').find('#ads_image_div').css('display','none');
        $('#_ads_view_port_4').css('display','block');
        $('#_ads_view_port_3').css('display','none');
        $('#form_ads_add_edit_3').find('#ads_view_port_3').html($('#_ads_view_port_4').clone());
        $('#form_ads_add_edit_3').find('#ads_external_link').val(review_link);
        $('._ads_view_port_4').find('a#ads_link').attr('href',review_link);
      }else{
        $('#form_ads_add_edit_3').find('#ads_short_name_div').css('display','block');
        $('#form_ads_add_edit_3').find('#ads_short_desc_div').css('display','block');
        $('#form_ads_add_edit_3').find('#ads_image_div').css('display','block');
        $('#form_ads_add_edit_3').find('#ads_view_port_3').html($('#_ads_view_port_3').clone());
        $('#_ads_view_port_4').css('display','none');
        $('#_ads_view_port_3').css('display','block');
        $('#form_ads_add_edit_3').find('#ads_external_link').val('');
        $('._ads_view_port_4').find('a#ads_link').attr('href','');
      }
    });



  $('#form_ads_add_edit').validate({
    submitHandler:function(){
      var formData=new FormData($('#form_ads_add_edit')[0]);
      formData.append('ads_embed_code',$('#ads_embed_code_div').html());
      $.ajax({
          type:'POST',
          url:base_url+'/ads/add_ads',
          data:formData,
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#btn_save_ads').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
             $('#btn_save_ads').prop('disabled',true);
             Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });            
            }else if(f.error){
              $('#btn_save_ads').prop('disabled',true);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#btn_save_ads').prop('disabled',true);
              Swal.fire({
                icon: 'info',
                title: 'Your session expired',
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
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
            $('#btn_save_ads').html('Save').attr('disabled',false);
          },
          resetForm: true 
      });
    }
  });

  $('#form_ads_add_edit_1').validate({
    submitHandler:function(){
      var vhtml=$('#ads_view_port_1').html();
      var formData=new FormData($('#form_ads_add_edit_1')[0]);
      formData.append('ads_embed_code',vhtml);
      $.ajax({
          type:'POST',
          url:base_url+'/ads/add_ads',
          data:formData,
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#form_ads_add_edit_1').find('#btn_save_ads').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
             $('#btn_save_ads').prop('disabled',true);
             Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
              if(('#combined_ads_row').length>0){
              $('#combined_ads_row').append(vhtml);
             }else{
              $('#combined_ads_row').html(vhtml);
             }          
            }else if(f.error){
              $('#form_ads_add_edit_1').find('#btn_save_ads').prop('disabled',true);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#form_ads_add_edit_1').find('#btn_save_ads').prop('disabled',true);
              Swal.fire({
                icon: 'info',
                title: 'Your session expired',
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
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
            $('#form_ads_add_edit_1').find('#btn_save_ads').html('Save').attr('disabled',false);
          },
          resetForm: true 
      });
    }
  });


  $('#form_ads_add_edit_2').validate({
    submitHandler:function(){
      var vhtml=$('#ads_view_port_2').html();
      var formData=new FormData($('#form_ads_add_edit_2')[0]);
      formData.append('ads_embed_code',vhtml);
      $.ajax({
          type:'POST',
          url:base_url+'/ads/add_ads',
          data:formData,
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#form_ads_add_edit_2').find('#btn_save_ads').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
             $('#btn_save_ads').prop('disabled',true);
             Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
             if(('#combined_ads_row').length>0){
              $('#combined_ads_row').append(vhtml);
             }else{
              $('#combined_ads_row').html(vhtml);
             }
                        
            }else if(f.error){
              $('#form_ads_add_edit_2').find('#btn_save_ads').prop('disabled',true);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#form_ads_add_edit_2').find('#btn_save_ads').prop('disabled',true);
              Swal.fire({
                icon: 'info',
                title: 'Your session expired',
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
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
            $('#form_ads_add_edit_2').find('#btn_save_ads').html('Save').attr('disabled',false);
          },
          resetForm: true 
      });
    }
  });

  $('#form_ads_add_edit_3').validate({
    submitHandler:function(){
      var formData=new FormData($('#form_ads_add_edit_3')[0]);

      var ads_type=$('#form_ads_add_edit_3').find('#ads_type :selected').val();

      if(ads_type=='WAYTO_REVIEW_ADS'){
        formData.append('ads_embed_code',$('#ads_view_port_3').html());
        $('#combined_ads_row').append($('#_ads_view_port_4').html());
      }else{
        formData.append('ads_embed_code',$('#ads_view_port_3').html());
        if(('#combined_ads_row').length>0){
          $('#combined_ads_row').append($('#_ads_view_port_3').html());
        }else{
          $('#combined_ads_row').html($('#_ads_view_port_3').html());
        }
        
      }
      
      $.ajax({
          type:'POST',
          url:base_url+'/ads/add_ads',
          data:formData,
          cache: false,
          contentType: false,
          processData: false,
          timeout: 60000000,
          target: '.preview',
          beforeSend:function(){
            $('#form_ads_add_edit_3').find('#btn_save_ads').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
          },
          success:function(f){
            if(f.success){
             $('#form_ads_add_edit_3').find('#btn_save_ads').prop('disabled',true);
             Swal.fire({
                icon: 'success',
                title: f.success,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });            
            }else if(f.error){
              $('#form_ads_add_edit_3').find('#btn_save_ads').prop('disabled',true);
              Swal.fire({
                icon: 'error',
                title: f.error,
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
            }else if(f.redirect){
              $('#form_ads_add_edit_3').find('#btn_save_ads').prop('disabled',true);
              Swal.fire({
                icon: 'info',
                title: 'Your session expired',
                confirmButtonText:'Close',
                confirmButtonColor:'#69da68',
                allowOutsideClick: false,
              });
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
            $('#form_ads_add_edit_3').find('#btn_save_ads').html('Save').attr('disabled',false);
          },
          resetForm: true 
      });
    }
  });


  $('#form_adsgroups_add_edit').validate({
    rules:{
      ads_name:{
        required:true
      }
    },
    messages:{
      ads_name:{
        required:'Please enter Ads Title'
      }
    },
    submitHandler:function(){
      var group_ads=$('#group_ads').html();
      var group_ads_val=$('#snaptarget').html();

      console.log(group_ads_val.length);

      if(group_ads_val.length>0){
        var formData=new FormData($('#form_adsgroups_add_edit')[0]);
        formData.append('ads_category_type','TYPE_3');
        formData.append('ads_listing_grouped','1');
        formData.append('ads_embed_code',group_ads);
        $.ajax({
            type:'POST',
            url:base_url+'/ads/add_ads',
            data:formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000000,
            target: '.preview',
            beforeSend:function(){
              $('#form_adsgroups_add_edit').find('#btn_save_adsgroups').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
            },
            success:function(f){
              if(f.success){
               $('#form_adsgroups_add_edit').find('#btn_save_adsgroups').prop('disabled',true);
               Swal.fire({
                  icon: 'success',
                  title: f.success,
                  confirmButtonText:'Close',
                  confirmButtonColor:'#69da68',
                  allowOutsideClick: false,
                });            
              }else if(f.error){
                $('#form_adsgroups_add_edit').find('#btn_save_adsgroups').prop('disabled',true);
                Swal.fire({
                  icon: 'error',
                  title: f.error,
                  confirmButtonText:'Close',
                  confirmButtonColor:'#69da68',
                  allowOutsideClick: false,
                });
              }else if(f.redirect){
                $('#form_adsgroups_add_edit').find('#btn_save_adsgroups').prop('disabled',true);
                Swal.fire({
                  icon: 'info',
                  title: 'Your session expired',
                  confirmButtonText:'Close',
                  confirmButtonColor:'#69da68',
                  allowOutsideClick: false,
                });
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
              $('#form_adsgroups_add_edit').find('#btn_save_adsgroups').html('Save').attr('disabled',false);
            },
            resetForm: true 
        });
      }else{
        Swal.fire({
          icon: 'error',
          title: 'No ads selected to group',
          confirmButtonText:'Close',
          confirmButtonColor:'#69da68',
          allowOutsideClick: false,
        });
      } 
    }
  });


  if($('#ads_start_date').length) {
    var date = new Date();
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    $('#ads_start_date').datepicker({
      format: "dd-mm-yyyy",
      todayHighlight: true,
      autoclose: true
    });
    // $('#ads_start_date').datepicker('setDate', today);
  }

  if($('#ads_end_date').length) {
    var date = new Date();
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    $('#ads_end_date').datepicker({
      format: "dd-mm-yyyy",
      todayHighlight: true,
      autoclose: true
    });
    // $('#ads_end_date').datepicker('setDate', today);
  }


  $('#ads_page_type').on('change',function(){
    var ads_page_type=$('#ads_page_type :selected').val();

    if(ads_page_type=='COLLEGE_SEARCH_PAGE_AT_TOP' || ads_page_type=='COLLEGE_SEARCH_PAGE_IN_BETWEEN_RESULTS'){

      getadssearchpages('COLLEGE_SEARCH_PAGE_IN_BETWEEN_RESULTS');

      $('#ads_page_link_column').css('display','block');
      $('#ads_page_links_row').css('display','none');
    }else if(ads_page_type=='COLLEGE_SEARCH_PAGE_COLLEGE_PAGE_AT_TOP'){
      $('#ads_page_link_column').css('display','block');
      $('#ads_page_links_row').css('display','none');
    }else if(ads_page_type=='COLLEGE_PAGE_AT_TOP'){
      $('#ads_page_link_column').css('display','none');
      $('#ads_page_links_row').css('display','block');
    }else{
      $('#ads_page_link_column').css('display','block');
      $('#ads_page_links_row').css('display','none');
    }
  });

  if(ads_page_type && ads_page_type!=''){
    getadssearchpages(ads_page_type);
  }

  function getadssearchpages(ads_page_type){
    var selected='';
    var html='<option value="0">Select College Search Page</option>';
    $.ajax({
      type:'POST',
      url:base_url+'/ads/getadssearchpages',
      data:{[csrf_name]:csrf_hash,ads_page_type:ads_page_type},
      dataType:'json',
      beforeSend:function(){
      },
      success:function(d){
        if(d.pages){
          $.each(d.pages,function(i,v){
            if(ads_page_link==v.url_value){
              selected='selected';
            }
            html+='<option value="'+v.url_id+'" '+selected+'>'+v.url_value+'</option>';
          });

          $('#ads_page_link').html(html).trigger('change');

        }
      }
    });
  }


  // $('body').on('input,paste,keyup,keydown','.select2-search__field',function(){
  //   var seacrh_term=$('.select2-search__field').val();
  //   initializeAdsCollegeInnerPagesSelect(seacrh_term);
  // });


function initializeAdsCollegeInnerPagesSelect() {
  $('#ads_page_links').select2({
    placeholder: 'Select College Search Page',
    multiple: true,
    ajax: {
      url: base_url + '/ads/getadscollegepages',
      type: 'POST',
      dataType: 'json',
      delay: 250,
      data: function (params) {
        return {
          [csrf_name]: csrf_hash,
          search_term: params.term // Let Select2 pass the search term
        };
      },
      processResults: function (data) {
        return {
          results: data.pages.map(function (page) {
            return {
              id: page.college_user_id,
              text: page.college_name
            };
          })
        };
      },
      cache: true
    }
  });

  // Preload selected options (optional)
  if (typeof ads_page_link !== 'undefined' && Array.isArray(ads_page_link)) {
    ads_page_link.forEach(function (link) {
      var option = new Option(link.text, link.id, true, true);
      $('#ads_page_links').append(option).trigger('change');
    });
  }
}


$(document).ready(function () {
  initializeAdsCollegeInnerPagesSelect();
});





  if ($(".js-example-basic-single").length) {
    $(".js-example-basic-single").select2();
  }




  $('#form_ads_add_edit_4').validate({
    rules:{
      ads_type:{
        valueNotEquals:'0'
      },
      ads_page_type:{
        valueNotEquals:'0'
      },
      ads_package_category:{
        valueNotEquals:'0'
      },
      ads_custom_link:{
        required:false
      },
      ads_start_date:{
        required:true
      },
      ads_end_date:{
        required:true
      }
    },
    messages:{
      ads_type:{
        valueNotEquals:'Select Ads type'
      },
      ads_page_type:{
        valueNotEquals:'Select Page Type'
      },
      ads_package_category:{
        valueNotEquals:'Select Package Type'
      },
      ads_start_date:{
        required:'Enter Start Date'
      },
      ads_end_date:{
        required:'Enter End Date'
      }
    },
    submitHandler:function(f){
      var formData=new FormData($('#form_ads_add_edit_4')[0]);

      $.ajax({
        type:'POST',
        url:base_url+'/ads/add_image_ads',
        data:formData,
        cache: false,
        contentType: false,
        processData: false,
        timeout: 60000000,
        target: '.preview',
        beforeSend:function(){
          $('#btn_save_custom_free_image_ads').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
        },
        success:function(f){
          if(f.success){
           $('#btn_save_custom_free_image_ads').prop('disabled',true);
           Swal.fire({
              icon: 'success',
              title: f.success,
              confirmButtonText:'Close',
              confirmButtonColor:'#69da68',
              allowOutsideClick: false,
            });            
          }else if(f.error){
            $('#btn_save_custom_free_image_ads').prop('disabled',true);
            Swal.fire({
              icon: 'error',
              title: f.error,
              confirmButtonText:'Close',
              confirmButtonColor:'#69da68',
              allowOutsideClick: false,
            });

            setTimeout(function(){
              window.location.reload();
            },1500);
          }else if(f.redirect){
            $('#btn_save_custom_free_image_ads').prop('disabled',true);
            Swal.fire({
              icon: 'info',
              title: 'Your session expired',
              confirmButtonText:'Close',
              confirmButtonColor:'#69da68',
              allowOutsideClick: false,
            });
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
          $('#btn_save_custom_free_image_ads').html('Save').attr('disabled',false);
        },
        resetForm: true 
      });
    }
  });

});