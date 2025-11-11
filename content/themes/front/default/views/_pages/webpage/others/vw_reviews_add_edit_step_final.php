<div class="wrapper">
  <div class="section-title">
    <h3>Thank You For your Response</h3>
  </div>
  <div class="text-center">
     <h5>Eligibility for Reward</h5>
     <p>To Be Eligible for the Reward,Please Verify Your Identity as a student of <strong><?php echo ucwords($college_data->college_name);?></strong>.Provide your College ID Card,Marksheet or College Email ID</p>

     <div class="row">
        <div class="col-lg-2"></div>
       <div class="col-lg-8">
          <div class="card border-0 shadow">
                <div class="card-header bg-white text-center"><h5 class="m-0"> Upload College Identity Documents </h5></div>
                <div class="card-body">
                    <form id="review_upload_docs" role="form" class="php-email-form" autocomplete="off" novalidate="novalidate" enctype="multipart/form-data">
                      <div class="row">
                            <div class="form-group col-sm-3">                      
                              <img src="<?php echo $file_profile_image;?>" alt="" class="img-thumbnail logo_image" style="width: 100px;height: 100px;" draggable="false" loading="lazy">
                              
                            </div>
                            <div class="form-group col-sm-6">
                              <div class="description style-scope ytcp-profile-image-upload" style="text-align:justify-all;">
                                Your profile picture will appear where college mini-website review presented.
                                It’s recommended to use a picture that’s at least 100 x 100 pixels and 4MB or less.
                                  Use a PNG or jpg or jpeg file. Make sure your picture follows the Sikshapedia
                                  Guidelines.
                              </div>
                                
                            </div>
                            <div class="form-group col-sm-3">
                              <div style="flex-direction: column;">
                                <input id="file_profile_photo" name="file_profile_photo" accept="image/png,image/jpog,image/jpg" hidden="" type="file" class="style-scope ytcp-profile-image-upload">
                                <button type="button" class="btn btn-sm btn-primary" id="btn_change_profile_image">Upload Profile Photo</button>
                              </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-sm-3">                      
                              <img src="<?php echo $file_cover_image;?>" alt="" class="img-thumbnail logo_image" style="width: 100px;height: 100px;">
                              
                            </div>
                            <div class="form-group col-sm-6">
                              <div class="description style-scope ytcp-profile-image-upload" style="text-align:justify-all;">
                                It’s recommended to use a picture of 4MB or less.
                                  Use a PNG or jpg or jpeg file. Make sure your picture follows the Sikshapedia
                                  Guidelines.
                                </div>
                                
                            </div>
                            <div class="form-group col-sm-3">
                              <div style="flex-direction: column;">
                                <input id="file_idproof_image" name="file_idproof_image" accept="image/png,image/jpog,image/jpg" hidden="" type="file" class="style-scope ytcp-profile-image-upload">
                                <button type="button" class="btn btn-sm btn-primary" id="btn_change_idproof">Upload ID Proof</button>
                              </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-sm-3" id="thumb">                      
                              <img src="<?php echo $file_logo;?>" id="cover_img_small" alt="" class="img-thumbnail " style="width: 100px;height:100px;">
                            </div>
                            <div class="form-group col-sm-6">
                              <div class="description style-scope ytcp-profile-image-upload" style="flex-direction: column;text-align:justify-all;">
                               For the best results on all devices, use an image that’s should be 1920 x 480 pixels and 4MB or less.
                                Use a PNG or jpg or jpeg file. Make sure your picture follows the Sikshapedia
                                  Guidelines.
                                </div>
                                
                            </div>
                            <div class="form-group col-sm-3">
                              <input id="file_marksheet_image" name="file_marksheet_image" accept="image/png,image/jpog,image/jpg" hidden="" type="file" class="style-scope ytcp-profile-image-upload">
                                <button type="button" class="btn btn-sm btn-primary" id="btn_change_marksheet">Upload Marksheet</button>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-sm-12">
                                <input type="text" class="form-control" name="review_college_email_id" id="review_college_email_id" placeholder="College Email ID">
                            </div>
                        </div>
                        <div class="my-3">
                            <!-- <div class="loading">Loading</div>
                            <div class="error-message"></div> -->
                            <div class="sent-message" id="thank_msg"></div>
                        </div>
                        <div class="text-center"><button type="submit" class="btn btn-primary" id="btn_upload_docs">Submit Now</button></div>
                    </form>
                </div>
          </div>
       </div>
     </div>

    <!-- <div class="row">
    <div class="col-lg-2"></div>
      <div class="col-lg-8">
        <div class="card border-0 shadow">
          <div class="card-body">
            <p>Join Us as Campus Ambasaador & Get internship & Exciting Rewards</p>
            <p>Are You Interested To Be Campus Ambassador</p>
            <div class="text-center"><button class="btn btn-warning" type="button">Register</button></div>
          </div>
        </div>
      </div>
    </div> -->

  </div>
</div>


<script type="text/javascript">
    $(document).ready(function(){
        $('#review_upload_docs').validate({
            rules:{
              review_college_email_id:{
                required:true,
                email:true
              }
            },
            messages:{
              review_college_email_id:{
                required:'Enter valid email address',
                email:'Email address is not valid'
              }
            },
            submitHandler:function(){
              var formData=new FormData($('#review_upload_docs')[0]);
              //var change_type='';
              formData.append([csrf_name], csrf_hash);
              $.ajax({
                  type:'POST',
                  url:base_url+'reviews/review_docs_up',
                  data:formData,
                  cache: false,
                  contentType: false,
                  processData: false,
                  timeout: 60000000,
                  target: '.preview',
                  beforeSend:function(){
                    $('#btn_upload_docs').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Saving...</span>').prop('disabled',true);
                  },
                  success:function(f){
                    if(f.success){
                     $('#btn_upload_docs').prop('disabled',true);
                     // Toast.fire({
                     //    icon: 'success',
                     //    title: f.success
                     //  });

                     $('#thank_msg').html(f.success);

                      window.location.href=f.redirect;           
                    }else if(f.error){
                      $('#btn_upload_docs').prop('disabled',true);
                      // Toast.fire({
                      //   icon: 'error',
                      //   title: f.error,
                      // });
                      $('#thank_msg').html(f.error);
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
                    $('#btn_upload_docs').html('Submit Now').attr('disabled',false);
                  },
                  resetForm: true 
              });
            }
        });
    });
</script>