jQuery(function($) {
  'use strict';

  $('#ads_list_table').DataTable({ 
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
          "url": base_url+'/ads/searchinnerlinkads',
          "type": "POST",
          "data":{csrf_test_name:csrf_hash,listing_type:'1'}
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

    $('body').on('click','.btn_del_free_image_ads',function(){
      var _ads=$(this).attr('data-aid');
      $.ajax({
        type:'POST',
        url:base_url+'/ads/delete',
        data:{[csrf_name]:csrf_hash,_ads:_ads},
        dataType:'json',
        beforeSend:function(){
          $(this).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Deleting...</span>').prop('disabled',true);
        },
        success:function(f){
          if(f.success){
          $(this).prop('disabled',true);
          Swal.fire({
              icon: 'success',
              title: f.success,
              confirmButtonText:'Close',
              confirmButtonColor:'#69da68',
              allowOutsideClick: false,
            });            
          }else if(f.error){
            $(this).prop('disabled',true);
            Swal.fire({
              icon: 'error',
              title: f.error,
              confirmButtonText:'Close',
              confirmButtonColor:'#69da68',
              allowOutsideClick: false,
            });
          }else if(f.redirect){
            $(this).prop('disabled',true);
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
          $(this).html('Delete').attr('disabled',false);
          var table=$('#ads_free_imagelist_table').DataTable();
          table.ajax.reload( null, false );
        },
        resetForm: true 
      });
    });
  }



  

});