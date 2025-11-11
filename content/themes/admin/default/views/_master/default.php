<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
   <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <!-- Favicon icon -->
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo base_url('public/data/app/app_data/waytologo.png');?>">
    <title><?php echo Events::trigger('the_title', $title, 'string'); ?></title>
    
    <script type="text/javascript">
        var base_url='<?php echo $this->data['admin_base_url'];?>';
        var csrf_name='<?php echo $csrf['name'];?>';
        var csrf_hash='<?php echo $csrf['hash'];?>';
        var _xtYu='<?php echo $security_token;?>';
        var loader_icon='<?php echo base_url('uploads/app/default/carina_loader_animation.gif');?>'
    </script>
    
    <?php echo @$css_files; ?>

    <style type="text/css">

        .tagify{
            height: auto !important;
        }
        select#search_form{
            width: 100%;
            height: 34px;
            border: 1px solid #00000026;
            padding: 5px;
        }

        .bodyslot-new {
        background: #F5F8F9;
        padding-bottom: 16px;
        margin-top: 0;
        margin-bottom: 10px;
    }

    .live-form-container-new .live-form-heading--icon {
        height: 30px;
        width: 30px;
        margin-right: 10px;
    }
    .live-form-container-new h4 {
        padding: 16px;
        text-transform: uppercase;
        color: #000;
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 0;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
        background: #f5f8f9;
    }

    .live-form-container-new .live-form-heading--icon svg {
        height: 30px;
        width: 30px;
    }

    .live-form-container-new h4 .sponsored {
        font-size: 13px;
        background: #ef233f1f;
        border-radius: 30px;
        color: #EF233F;
        padding: 5px 20px;
    }
      
      .live-form-container-new .live-form-body-row {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        box-shadow: 0 0 4px 0 #cfcfcf80;
        border-radius: 4px 4px 0px 0px;
        overflow-x: scroll;
    }

    .live-form-container-new {
        overflow: hidden;
        text-align: initial;
        background: #FFFFFF;
        box-shadow: 0 0 4px 0 #cfcfcf80;
        border-radius: 4px;
    }
      
      .ads_body_live_form_container{
        -webkit-text-decoration: none;
        text-decoration: none;
        margin: 0 auto 0px;
        max-width: 100%;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
      }

      .live-form-container-new {
        overflow: hidden;
        text-align: initial;
        background: #FFFFFF;
        box-shadow: 0 0 4px 0 #cfcfcf80;
        border-radius: 4px;
      }
      
      .ads_live_form_desktop_tnew{
        -webkit-text-decoration: none;
        text-decoration: none;
        margin: 0 auto 0px;
        max-width: 100%;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
      }
      
      .ads_live_form_desktop_tnew {
        background: #fff;
        position: relative;
        min-height: 100px;
        height: 100%;
        display: block;
        font-size: 14px;
        line-height: 18px;
        color: #333;
        font-weight: 400;
        flex: 1;
        padding: 16px;
        padding-top: 12px;
        text-align: left;
        border-right: 1px solid #00000012;
    }

    .live-form-container-new .ads_body_live_form_container:nth-child(odd) a .ads_bottom_border {
        background: #ff7900;
    }
    .live-form-container-new .ads_body_live_form_container:nth-child(even) a .ads_bottom_border {
        background: #4FB8DD;
    }

    a.ads-live-form-review-banner .ads-bottom-border {
        position: absolute;
        bottom: 0px;
        left: 0;
        width: 100%;
        height: 5px;
        background: #ff7900 !important;
    }
      a.ads_live_form_desktop_tnew:last-child {
        border-right: 1px  solid #00000012;
      }
      .top-section {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
      }
      *, *::before, *::after {
        box-sizing: border-box;
      }
      .top-section.logo {
          border: 2px  solid #E7EBEF;
          height: 48px;
          width: 48px;
          min-width: 48px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 12px;
      }
      .top-section .college_name {
        font-weight: 700;
        font-size: 16px;
        line-height: 20px;
        color: #4FB8DD;
        height: 42px;
        overflow: hidden;
      }
      .ads_live_form_desktop_tnew .extra_info, .ads_live_form_desktop_tnew:hover .extra_info {
        color: #333;
      }
      .extra_info {
        height: 72px;
        overflow: hidden;
      }
      .info-section .admission_info {
        line-height: 17px;
        color: #1BCE90;
        margin-top: 4px;
        height: 32px;
        overflow: hidden;
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
      }
      .apply-btn {
        text-align: center;
      }
      .ads_live_form_desktop_tnew .apply, .ads_live_form_desktop_tnew .apply:hover {
        background: #ff7900;
        display: inline-block;
        font-size: 14px;
        color: #fff;
        min-width: 220px;
        text-align: center;
        text-transform: uppercase;
        border-radius: 4px;
        padding: 6px;
        margin-top: 8px;
      }
      .ads_live_form_desktop_tnew .ads_bottom_border {
        position: absolute;
        bottom: 0px;
        left: 0;
        width: 100%;
        height: 5px;
      }
      a.ads-live-form-review-banner {
        min-height: 210px;
        min-width: 255px;
        height: 100%;
        color: #333;
        padding: 16px 16px 20px 16px;
        background: #FFF8F1;
    }



    #search_tag-list {
        float: left;
        list-style: none;
        margin-top: -3px;
        max-height: 200px;
        overflow-y: scroll;
        padding: 0;
        width: 100% !important;
        position: absolute;
        z-index: 999;
    }

    #search_tag-list li {
        padding: 10px;
        background: #f0f0f0;
        border-bottom: #bbb9b9 1px solid;
    }

    #search_tag-list li:hover {
        background: #ece3d2;
        cursor: pointer;
    }

    #search-box {
        padding: 10px;
        border: #a8d4b1 1px solid;
        border-radius: 4px;
}
    </style>
    
    <?php
    

    $tiny_mce_key=load_editor_version();
    $script_arr=array(
        js('assets/vendors/core/core'),
        js('https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js'),
        js(get_common_url('assets/js/jquery.validate.min')),
        js(get_common_url('assets/js/additional-methods.min')),
        js('assets/js/form-data-json.min'),
        js('assets/js/cryptojs-aes.min'),
        js('assets/js/cryptojs-aes-format'),
        js("https://cdn.tiny.cloud/1/{$tiny_mce_key}/tinymce/7/tinymce.min.js")
    );
    

    echo implode("\t", $script_arr);

    ?>
</head>
<body class="sidebar-white" id="body_tag">
    <div class="main-wrapper">        
        <?php echo @$layout;?>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/TableDnD/0.9.1/jquery.tablednd.js" integrity="sha256-d3rtug+Hg1GZPB7Y/yTcRixO/wlI78+2m08tosoRn7A=" crossorigin="anonymous"></script>
    <?php echo @$js_files;?>

    <script type="text/javascript">
        window.onload = function(){
            if(window.navigator.onLine){
                onLine()
            }else{
                offLine()
            }
        }

        window.addEventListener("online", function(){
           onLine(); 
        });
        window.addEventListener("offline", function(){
            offLine(); 
        });

        function onLine(){
            $.notify('Back to Online',{position:'top center',className:"success"});
        }
        function offLine(){
            Swal.fire({
              icon: 'error',
              title: 'You are offline.Check your network connection.',
              timer:2000,
              showConfirmButton: false,
              allowOutsideClick: false,
              allowOutsideClick: false,
            });
        }


        $('body').on('click', '#btn_update_editor_version', function() {
          var s = $('#editor_version option:selected').val();
          if (s == 0) {
              alert('Select proper version');
          } else {
              $.ajax({
                  type: 'POST',
                  url: base_url + '/settings/update_editor_version',
                  data: { [csrf_name]: csrf_hash, editor_key: s },
                  beforeSend: function() {
                    $(this).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
                  },
                  success: function(response) {
                      if (response.success) {
                          alert(response.success);
                          window.location.reload();
                      } else {
                          alert(response.error);
                      }
                  },
                  error: function(xhr, status, error) {
                      // Handle AJAX error here
                      alert('An error occurred: ' + error);
                  }
              }); // Missing closing bracket added here
          }
      });

    </script>
</body>
</html>