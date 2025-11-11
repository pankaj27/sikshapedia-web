jQuery(function() {
  'use strict';

  get_folders();
  get_folders_in();

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

  $( '.chat-list .chat-item' ).each(function(index) {
    $(this).on('click', function(){
        $('.chat-content').toggleClass('show');
    });
  });

  $('#backToChatList').on('click', function(index) {
    $('.chat-content').toggleClass('show');
  });


  $('body').on('change input paste','#folder_name',function(){
    var fn=$('#folder_name').val();
    if(fn!=''){
       $('#btn_create_btn').attr('disabled',false); 
    }else{
      $('#btn_create_btn').attr('disabled',true);
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
      var f_data = FormDataJson.formToJson(document.getElementById("form_folder_browser"));
      var ctext= CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();

      $.ajax({
        type:'POST',
        url:base_url+'/settings/browser/create_folder',
        data: {ctext:ctext,csrf_test_name:csrf_hash},
        cache:false,
        beforeSend:function(){
          $('#btn_create_btn').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
        },
        success:function(d,status,xhr){
          if(d.success){
            var html='<div class="alert alert-success alert-dismissible fade show" role="alert">'+d.success+'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
            $('#newFolderModal').find('div.diverror').html(html);

              get_folders();
             
              setTimeout(function(){
                $('#newFolderModal').find('div.diverror').html('');    
                $('#btn_create_btn').html('Create').prop('disabled',false);
                $('#newFolderModal').find('#form_folder_browser')[0].reset();
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

  $('body').on('click','.folder_ellipsed_name',function(){
    $('#curent_folder').html($(this).attr('data-fname'));
    $('#curent_folder_created').html($(this).attr('data-cdate'));
    $('#newFileModal').find('#folder_data').val($(this).attr('data-folder'));

    $('#document_folder').val($(this).attr('data-folder'));
    $('#parent_folder').val($(this).attr('data-folder'));
    $('#parent_folder_name').val($(this).attr('data-folder'));

    $('#back_to_parent').attr('data-back',$(this).attr('data-pfoldder'));

    if(typeof(Storage) !== "undefined"){
      sessionStorage.setItem('pfds',$(this).attr('data-folder'));
      sessionStorage.setItem('pfdsn',$(this).attr('data-fname'));
      sessionStorage.setItem('pfdsd',$(this).attr('data-cdate'));
      sessionStorage.setItem('pfdsb',$(this).attr('data-pfoldder'));
    }
    get_folders($(this).attr('data-folder'));
    get_folders_in();
  });

  $('body').on('click','#back_to_parent',function(){
    var p=$(this).attr('data-back');
    // alert(parent);
    get_folders(p,'back_to_parent');
    get_folders_in();
  });
  
  $("#uploader").plupload({
      // General settings
      runtimes : 'html5,flash,silverlight,html4',
      url : base_url+'/settings/browser/upload_file',
      max_file_size : '50mb', 
      chunk_size: '1mb',
      resize : {
          width : 200,
          height : 200,
          quality : 90,
          crop: true
      },
      filters : [
          {title : "Image files", extensions : "jpg,gif,png"},
          {title : "Zip files", extensions : "zip,avi"}
      ],
      preinit : {
          Init: function(up, info) {
             // log('[Init]', 'Info:', info, 'Features:', up.features);
          },

          UploadFile: function(up, file) {
              //log('[UploadFile]', file);

              // You can override settings before the file is uploaded
              // up.setOption('url', 'upload.php?id=' + file.id);
              //up.setOption('multipart_params', {csrf_test_name : csrf_hash, document_folder : 'value2'});
          }
      },
      init:{
        Browse: function(up) {
            // Called when file picker is clicked
           
        },
        BeforeUpload: function(up, file) {
          up.settings.multipart_params.csrf_test_name = csrf_hash;
              up.settings.multipart_params.document_folder = $('#document_folder').val();
        },
        FileUploaded: function(up, file, info) {  

            get_folders_in();
        },
      },
      rename: true,
      sortable: true,
      dragdrop: true,
      views: {
          list: true,
          thumbs: true,
          active: 'thumbs'
      }   
  });

  $('body').on('click','.del_folder',function(){

    var f_data = new Array($(this).attr('data-folder'),'delete_permanent','delete_folder');
    var ctext= CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();

    $.ajax({
      type:'POST',
      url:base_url+'/settings/browser/delete_folders',
      data: {ctext:ctext,csrf_test_name:csrf_hash},
      cache:true,
      success:function(d){
         if(d.success){
            $.ajax({
              type:'POST',
              url:base_url+'/settings/browser/get_folders',
              data: {csrf_test_name:csrf_hash},
              cache:true,
              success:function(f){
                $('#sys_folders').html(f.html);
                $('#curent_folder_created').html('');
                get_folders_in();
                $('#document_folder').val('');
                $('#parent_folder').val('');

              }
            });
         }else if(d.error){
          alert(d.error);
         }
      }
    });
  });



  function get_folders(parent='',folder_back=''){
    if(typeof(Storage) !== "undefined"){
      if (sessionStorage.pfds){
        parent=sessionStorage.getItem('pfds');        
      }else{
        parent=parent;
      }
      $('#newFileModal').find('#folder_data').val(parent);
      $('#document_folder').val(parent);
      $('#parent_folder').val(parent);
      $('#parent_folder_name').val(parent);


      if(sessionStorage.pfdsn){
        $('#curent_folder').html(sessionStorage.getItem('pfdsn'));
        $('#curent_folder_created').html(sessionStorage.getItem('pfdsd'));
      }else{
        $('#curent_folder').html('Default');
        $('#curent_folder_created').html('');
      }

      // if(sessionStorage.pfdsb){
      //     $('#back_to_parent').attr('data-back',sessionStorage.pfdsb);
      // }else{
      //   $('#back_to_parent').attr('data-back','');
      // }
    }else{
      parent=parent;
    }
    $.ajax({
      type:'POST',
      url:base_url+'/settings/browser/get_folders',
      data: {csrf_test_name:csrf_hash,parent_folder:parent,folder_back:folder_back},
      cache:true,
      success:function(f){
         $('#sys_folders').html(f.html);
      }
    });
  }


  function get_folders_in(){
    var f_data = new Array($('#parent_folder').val());
    var ctext= CryptoJS.AES.encrypt(JSON.stringify(f_data), _xtYu, { format: CryptoJSAesJson }).toString();         

    $.ajax({
      type:'POST',
      url:base_url+'/settings/browser/get_folders_inner',
      data: {csrf_test_name:csrf_hash,ctext:ctext},
      cache:true,
      success:function(f){
         $('#sys_folders_inner').html(f.html);
      }
    });
  }

  ///

   $('#storage_list_table').DataTable({ 
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
              "url": base_url+'/settings/browser/search_storage_data',
              "type": "POST",
              "data":{csrf_test_name:csrf_hash}
          },
          //Set column definition initialisation properties.
          "columnDefs": [
          { 
              "targets": [ 0,4 ], //first column / numbering column
              "orderable": false, //set not orderable
          },
          ],
      });

   $('body').on('click','.btn_convert_to_webp',function(){
    var storage_id=$(this).data('storage_id');

    $.ajax({
      type:'POST',
      url:base_url+'/settings/browser/convert_storage_data',
      data:{[csrf_name]:csrf_hash,storage_id:storage_id},
      success:function(d){

        alert(d.success);

        // Swal.fire({
        //   icon: 'success',
        //   title: d.success,
        //   confirmButtonText:'Close',
        //   confirmButtonColor:'#d33',
        //   allowOutsideClick: false,
        // });

      },complete:function(status,xhr){
         var table=$('#storage_list_table').DataTable();
            table.ajax.reload( null, false );
      }
    });
   });

  ///

});