jQuery(function($) {
  'use strict';


  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/textmate");
  editor.session.setMode("ace/mode/robot");

  // Assuming you've initialized Ace Editor as `editor`
  editor.getSession().on('change', function(delta) {
      // Get the current content of the editor
      var content = editor.getSession().getValue();

      // Split the content into lines or words, based on your needs
      var lines = content.split('\n');

      // Data structure to keep track of lines and detect duplicates
      var lineSet = new Set();
      var duplicates = [];

      // Check for duplicates
      lines.forEach((line, index) => {
          if (lineSet.has(line)) {
              duplicates.push(index); // Store the index of the duplicate line
          } else {
              lineSet.add(line);
          }
      });

      // Clear previous markers
      editor.getSession().clearAnnotations();

      // Highlight duplicates by adding annotations
      var annotations = duplicates.map(lineNumber => {
          return {
              row: lineNumber,
              column: 0,
              text: "Duplicate line", // Text to show in the gutter tooltip
              type: "warning" // Also can be "error" or "information"
          };
      });

      editor.getSession().setAnnotations(annotations);
  });


  $('#form_robots').validate({
    submitHandler:function(){
      var editorContent = editor.getValue();

      if(editorContent!=''){
        $.ajax({
          type:'POST',
          url:base_url+'/seo/update_fileeditor_data',
          data:{[csrf_name]:csrf_hash,op_type:'update_file',editorContent:editorContent},
          beforeSend:function(){
            $('#btn_submit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
            $('#btn_close_filet').html('Close File').prop('disabled',true);
          },
          success:function(d,status,xhr){

              if(d.success){

                setTimeout(function(){               
                  $('#btn_submit').html(d.success).prop('disabled',true);
                  window.location.href=d.redirect;
                },1200);
                
              }else{
                Swal.fire({
                  icon: 'error',
                  title: d.error,
                  confirmButtonText:'Close',
                  confirmButtonColor:'#d33',
                  allowOutsideClick: false,
                });
                $('#btn_submit').html('Save Changes & Close File').prop('disabled',false);
                $('#btn_close_filet').html('Close File').prop('disabled',false);
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


              $('#btn_submit').html('Save Changes & Close File').prop('disabled',false);
              $('#btn_close_filet').html('Close File').prop('disabled',false);
          },
          complete:function(status,xhr){
             // $('#btn_submit').html('Sign In');
          }
        });
      }else{
        Swal.fire({
          icon: 'error',
          title: 'No data to save',
          confirmButtonText:'Close',
          confirmButtonColor:'#d33',
          allowOutsideClick: false,
        });
}
      
    }



  });


  $('body').on('click','#btn_close_filet',function(){
    var op_type='close_file';
    $.ajax({
      type:'POST',
      url:base_url+'/seo/update_fileeditor_data',
      data:{[csrf_name]:csrf_hash,op_type:op_type},
      beforeSend:function(){
        $('#btn_close_filet').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
      },
      success:function(d,status,xhr){

          if(d.success){

            setTimeout(function(){               
              $('#btn_close_filet').html(d.success).prop('disabled',true);
              window.location.href=d.redirect;
            },1200);
            
          }else{
            Swal.fire({
              icon: 'error',
              title: d.error,
              confirmButtonText:'Close',
              confirmButtonColor:'#d33',
              allowOutsideClick: false,
            });
            $('#btn_close_filet').html('Close File').prop('disabled',false);
            //$('input["hidden"][name="csrf_test_name"]').val(d.hash);
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


          $('#btn_close_filet').html('Close File').prop('disabled',false);
        },
        complete:function(status,xhr){
         // $('#btn_submit').html('Sign In');
        }
    });
  });

});