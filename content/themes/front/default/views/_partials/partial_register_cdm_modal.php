
<div class='container'>
    <div class="modal fade" id="registercdmModal" tabindex="-1" role="dialog" aria-labelledby="registercdmModal" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div>
                <div class="modal-body p-0 row">
                    <div class="col-12 col-lg-5 ad p-0"> <img src="https://i.imgur.com/UCqKKB4.jpg" width="100%" height="100%" /> </div>
                    <div class="details col-12 col-lg-7">
                        <h2>SIGN UP</h2>
                        <p><small class="para">Get best deals & coupons on popular brands<br> & on courses you want to persue. </small></p>
                        <p><small class="para">Provide your mobile no to avail now<br></small></p>
                        <div class="form-group mt-3 pt-3 mb-5">
                        	<form id="from_register_cdm">
                            	<div class="row">
    								<input type="text" placeholder="Phone No." class="form-control" name="_register_phone_no" id="_register_phone_no" autocomplete="off">
    			                </div>
	                        	<div class="row d-flex justify-content-between">
	                      			<button type="submit" class="btn-temp" id="btn_create_cdm_account">Sign Up</button>
	                  			</div>
                        	</form>

                            <form id="from_register_cdm_verify" style="display:none;">
                                <div class="row">
                                    <input type="text" placeholder="" class="form-control" name="_register_phone_otp" id="_register_phone_otp" autocomplete="off">
                                </div>
                                <div class="row d-flex justify-content-between">
                                    <button type="submit" class="btn-temp" id="btn_verify_cdm_account">Verify</button>
                                </div>
                            </form>
                        </div> <!-- <small class="text-muted"><a href="#">Personal Data Charter</a></small> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<style type="text/css">
	.container {
            display: flex;
            justify-content: center;
            margin-top: 200px;
            background: transparent
        }

        .trigger {
            background-color: green;
            color: #fff
        }

        #registercdmModal .modal,
        .fade,
        .show {
            /*background-color: lightpink;*/
            padding-left: 15px;
            padding-right: 15px
        }

        #registercdmModal h2 {
            font-weight: bold;
            margin-bottom: 15px;
            color: #000
        }

        #registercdmModal .modal-content {
            border: none;
            background: transparent;
            padding: 0 19px
        }

        #registercdmModal .close {
            position: relative;
            top: 48px;
            left: 13px;
            z-index: 1;
            font-size: 30px;
            font-weight: bold;
            line-height: 1;
            color: black
        }

        #registercdmModal .modal-header {
            border: none
        }

        #registercdmModal .modal-header .close {
            padding: 0rem 1rem !important;
            margin: -1rem -1rem -1rem auto
        }

        #registercdmModal .modal-body {
            border: none;
            background-color: white;
            padding-bottom: 5px
        }

        #registercdmModal .close.focus,
        #registercdmModal .close:focus {
            outline: 0;
            box-shadow: none !important
        }

        #registercdmModal .form-control {
            width: 80%;
            height: 50px;
            border: none;
            border-radius: 20px;
            box-shadow: 0px 0.5px 0px 0px #dae0e5 !important;
            color: #63686c;
            font-weight: bold;
            font-size: 12px
        }

        #registercdmModal .form-control.focus {
            border: none;
            border-color: #fff;
            border-bottom: 1px solid #000;
            outline: 0;
            box-shadow: 0 0 0 0 rgba(0, 123, 255, .25)
        }

        @media (min-width:599px) {
            #registercdmModal .modal-dialog {
                max-width: 47rem
            }

            #registercdmModal .details {
                padding: 60px 0 40px 50px
            }

            #registercdmModal .text-muted a {
                color: #c0bfbf;
                font-weight: bold;
                text-decoration: underline
            }

            #registercdmModal small.para {
                font-weight: bold;
                font-size: 14px;
                color: #63686c
            }
        }
</style>


<script type="text/javascript">
    jQuery(function($) {
        "use strict";

        $('#from_register_cdm').validate({
            rules:{
                _register_phone_no:{
                    required:true,
                    digits:true,
                    minlength:10,
                    maxlength:12,
                    remote: {
                      url: base_url+'checkval_available',
                      type: "POST",
                      async:true,
                      dataType:"json",
                      data: {
                        csrf_test_name:csrf_hash,
                        check_type:'phone',
                        check_value_of:'stu',
                        check_value: function() {              
                          return $('#from_register_cdm :input[name="_register_phone_no"]').val();
                        }
                      }
                    }
                }                
            },
            messages:{
                _register_phone_no:{
                    required:'Enter valid mobile no.',
                    digits:'Only numeric value allowed'
                }  
            },
            submitHandler:function(){
                var _register_phone_no=$('#_register_phone_no').val();

                $.ajax({
                    type:'POST',
                    url:base_url+'signup/student_signup',
                    data:{[csrf_name]:csrf_hash,register_student_phone_no:_register_phone_no,reg_type:'only_phone_no'},
                    cache:false,
                    beforeSend:function(){
                      $('#btn_create_cdm_account').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
                    },
                    success:function(d,status,xhr){
                      //alert(d.error);
                      if(d.success){
                        //setTimeout(function(){
                          // Toast.fire({
                          //   icon: 'success',
                          //   title: d.success
                          // });

                          $('#btn_create_cdm_account').html('Register').prop('disabled',true);

                          $('#from_register_cdm')[0].reset();

                          $('#from_register_cdm_verify').css('style','block');
                          $('#from_register_cdm').css('style','none');

                          
                         
                      }else if(d.error){
                        // Toast.fire({
                        //     icon: 'error',
                        //     title: d.error
                        // });

                        $('#register_msg').html('<div class="alert alert-danger">'+d.error+'</div>').css('display','block');
             
                        $('#btn_update_account').html('Register').prop('disabled',false);
                      }
                    },
                    error: function( jqXhr ) {
                      if( jqXhr.status == 400 ) {
                        window.location.reload();
                      }else if( jqXhr.status == 403 ) {
                        window.location.reload();
                      }
                   
                      $('#btn_update_account').html('Register').prop('disabled',false);
                    },
                    complete:function(status,xhr){
                     setTimeout(function(){
                      //$('#register_msg').html('').css('display','none');
                     },2000);
                });
            }
        });



    });
</script>