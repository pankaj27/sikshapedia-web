
<div class="card userCard">
              <div class="card-header bg-white">
                <h5 class="m-0 d-inline">Update Branding Details</h5> <small id="user_type" class="form-text text-muted">You can update your branding details.It will be visible to the site visitor as college profile.</small>
              </div>
              <div class="card-body">

                <div class="row">
                  <div class="col-lg-12">
                    <form id="form_user_branding" novalidate="novalidate" enctype="multipart/form-data">
                      <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>" id="_token">
                      <input type="hidden" name="change_type" value="branding_change" >
                      <div class="row">
                        <div class="form-group col-sm-3">                      
                          <img src="<?php echo $file_logo;?>" alt="" class="img-thumbnail logo_image" style="width: 140px;height: 120px;">
                          
                        </div>
                        <div class="form-group col-sm-9">
                          <div class="description style-scope ytcp-profile-image-upload">
                            Your profile picture will appear where your mini-website is presented on WayToAdmissions.
                          </div>
                          <div class="description style-scope ytcp-profile-image-upload">
                            It’s recommended to use a picture that’s at least 500 x 500 pixels and 4MB or less.
                              Use a PNG or jpg or jpeg file. Make sure your picture follows the WayToAdmissions
                              Guidelines.
                            </div>
                            <div style="flex-direction: column;">
                              <input id="file_logo_image" name="file_logo_image" accept="image/*" hidden="" type="file" class="style-scope ytcp-profile-image-upload">
                              <button type="button" class="btn btn-sm btn-primary" id="btn_change_logo">Change</button>
                            </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="form-group col-sm-3" id="thumb">                      
                          <img src="<?php echo $file_cover_image;?>" id="cover_img_small" alt="" class="img-thumbnail " style="width: 640px;display: flex;flex-direction: column;">
                        </div>
                        <div class="form-group col-sm-9">
                          <div class="description style-scope ytcp-profile-image-upload">
                           This image will appear across the top of your mini-website
                          </div>
                          <div class="description style-scope ytcp-profile-image-upload" style="flex-direction: column;">
                           For the best results on all devices, use an image that’s should be 1920 x 480 pixels and 6MB or less.
                            </div>
                            <input id="file_cover_image" name="file_cover_image" accept="image/*" hidden="" type="file" class="style-scope ytcp-profile-image-upload">
                            <button type="button" class="btn btn-sm btn-primary" id="btn_change_cover_image">Change</button>
                        </div>
                      </div>

                      <div class="row">
                        <div class="form-group col-sm-12">
                          <button class="btn btn-primary" style="float: right;" id="btn_publish">Publish</button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="col-lg-4"></div>
                </div>

              </div>
              
            </div>