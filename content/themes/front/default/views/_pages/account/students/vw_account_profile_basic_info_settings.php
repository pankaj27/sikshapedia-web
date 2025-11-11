<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<div class="profile-content py-4">
  <div class="wrapper">
    <div class="row">
      <div class="col-lg-9 mb-4 mb-lg-0" id="general_tabs">
        <div class="row">
          <div class="col-sm-12">
            <div class="card userCard">
            	<div class="card-header bg-white">
            	  <h5 class="m-0 d-inline">Basic Details</h5> <small id="user_type" class="form-text text-muted">HELPS US KNOW YOU BETTER</small>
            	</div>
            	<div class="card-body">
                <form id="form_general_settings">
                  <input type="hidden" name="registration_from" value="<?php echo $userdata->user_sent_from;?>">
                  <div class="row">
                    <input type="hidden" name="data_type" value="general_settings">
                      <div class="form-group col-sm-6">
                          <label>Account Type</label>

                          <select class="form-control" name="user_type" id="user_type" <?php echo ($userdata->user_role>0)?'disabled':'';?>>
                  					<option value="">Select Account Type</option>
                  					<option value="<?php echo encode_data(3);?>" <?php echo ($userdata->user_role==3)?'selected':'';?>>University</option>
                  					<option value="<?php echo encode_data(4);?>" <?php echo ($userdata->user_role==4)?'selected':'';?>>College</option>
                            <option value="<?php echo encode_data(8);?>" <?php echo ($userdata->user_role==8)?'selected':'';?>>Student</option>
                  				</select>
                      </div>
                      <div class="form-group col-sm-6">
                          <label>Name</label>
                          <input type="text" class="form-control" id="registration_name" name="registration_name" aria-describedby="registration_name" placeholder="Enter Name" value="<?php echo isset($userdata)?$userdata->user_fullname:'';?>">
                      </div>
                      <div class="form-group col-sm-6">
                          <label>Email</label>
                          <input type="text" class="form-control" id="registration_email" name="registration_email" placeholder="Email" value="<?php echo isset($userdata)?$userdata->user_email:'';?>" <?php echo ($userdata->user_role>0 && $userdata->user_email!='')?'disabled':'';?>>
                      </div>
                      <div class="form-group col-sm-6">
                          <label>Phone no</label>
                          <input type="text" class="form-control" id="registration_phone_no" name="registration_phone_no" aria-describedby="registration_phone_no" placeholder="Enter Phone No" value="<?php echo isset($userdata)?$userdata->user_phone_no:'';?>" <?php echo ($userdata->user_role>0 && $userdata->user_phone_no!='')?'disabled':'';?>>
                      </div>

                      <?php

                      if($userdata->user_phone_no_verified!='1'){
                        ?>
                        <div class="form-group col-sm-6">
                            <label>OTP</label>
                            <div class="input-group mb-3">
                              <input type="text" class="form-control" id="registration_otp" name="registration_otp" aria-describedby="registration_otp" placeholder="6 digit OTP" value="">
                              <div class="input-group-append">
                                <button class="btn btn-primary" id="btn_send_otp" type="button">Send OTP</button>
                              </div>
                            </div>
                        </div>
                        <?php
                      }

                      ?>
                      


                      <div class="form-group col-sm-3">
                          <label>Date of Birth</label>
                          <input type="text" class="form-control" id="registration_dob" name="registration_dob" aria-describedby="registration_dob" placeholder="Enter your DOB" value="<?php echo (isset($userdata) && isDateValid($userdata->user_dob))?date('d-m-Y',strtotime($userdata->user_dob)):'';?>" readonly>
                      </div>

                      <div class="form-group col-sm-3">
                          <label class="d-block">Gender</label>
                          <div class="form-check form-check-inline">
                              <input type="radio" class="form-check-input" value="1" id="Male" name="registration_gender" <?php echo (isset($userdata) && ($userdata->user_gender=='1'))?'checked':'';?>>
                              <label class="form-check-label" for="Male" >Male</label>
                          </div>
                          <div class="form-check form-check-inline">
                              <input type="radio" class="form-check-input" value="2" id="Female" name="registration_gender" <?php echo (isset($userdata) && ($userdata->user_gender=='2'))?'checked':'';?>>
                              <label class="form-check-label" for="Female">Female</label>
                          </div>
                      </div>



                      <div class="form-group col-sm-6">
                        <label for="inputState">Country</label>
                        <select class="form-control" name="register_country" id="register_country">
                          <option value="">Select Country</option>
                          <?php
                            if(!empty($countries)){
                              foreach ($countries as $key => $value) {
                                ?>
                                <option value="<?php echo $value['country_id'];?>" <?php echo $value['selected'];?>><?php echo $value['country_name'];?></option>
                                <?php
                              }
                            }
                          ?>
                        </select>
                      </div>

                      <div class="form-group col-sm-6">
                        <label for="inputState">State</label>
                        <select class="form-control" name="registration_state" id="registration_state">
                          <option value="">Select State</option>
                          <?php
                          if(isset($states) && !empty($states)){
                          	foreach ($states as $key => $value) {
                          		?>
                          		<option value="<?php echo $value['state_id'];?>" <?php echo $value['selected'];?>><?php echo $value['state_name'];?></option>
                          		<?php
                          	}
                          }
                          ?>
                        </select>
                      </div>

                      <div class="form-group col-sm-6">
                        <label for="inputState">District</label>
                        <select class="form-control" name="registration_district" id="registration_district">
                          <option value="">Select District</option>
                        </select>
                      </div>

                      <div class="form-group col-sm-6">
                        <label for="inputState">City/Town</label>
                        <select class="form-control" name="registration_city" id="registration_city">
                          <option value="">Select City/Town</option>
                          <?php
                          if(isset($cities) && !empty($cities)){
                            foreach ($cities as $key => $value) {
                              ?>
                              <option value="<?php echo $value['city_id'];?>" <?php echo $value['selected'];?>><?php echo $value['city_name'];?></option>
                              <?php
                            }
                          }
                          ?>
                        </select>
                      </div>



                      <div class="form-group col-sm-6">
                          <label>Pincode</label>
                          <input type="text" class="form-control" id="registration_pincode" name="registration_pincode" aria-describedby="registration_pincode" placeholder="Enter Pincode" value="<?php echo (isset($userdata) && !empty($userdata->user_pincode))?$userdata->user_pincode:'';?>">
                      </div>

                      

                      <div class="form-group col-sm-6">
                          <label>Address</label>
                          <textarea class="form-control" name="registration_address" id="registration_address" rows="5"><?php echo (isset($userdata) && isset($userdata->user_address))?$userdata->user_address:'';?></textarea>
                      </div>

                      <div class="form-group col-sm-6">
                          <label>A Brief About You</label>
                          <textarea class="form-control" name="registrtion_brief" id="registrtion_brief" rows="5" placeholder="Maximum 300 charachter"><?php echo (isset($userdata) && isset($userdata->user_brief))?$userdata->user_brief:'';?></textarea>
                      </div>


                      <div class="form-group col-sm-6">
                          <label>Last Qualification</label>
                          <select class="form-control" name="registration_last_qualification" id="registration_last_qualification">
                            <?php
                            if(!empty($qualifications)){
                              foreach ($qualifications as $key => $value) {
                                ?>
                                <option value="<?php echo $value['qualification_id'];?>" <?php echo $value['selected'];?>><?php echo $value['qualification_name'];?></option>
                                <?php
                              }
                            }
                            ?>
                          </select>
                      </div>

                      <div class="form-group col-sm-3">
                          <label>Passing Year</label>
                          <input type="text" class="form-control" id="registration_passing_year" name="registration_passing_year" aria-describedby="registration_passing_year" placeholder="Enter Passing Year" value="<?php echo (isset($userdata) && isset($userdata->user_address))?$userdata->user_last_qualification_year:'';?>" readonly>
                      </div>           

                      <div class="col-sm-12">
                         <button type="submit" class="btn btn-primary" id="btn_update_account">Update</button>
                      </div>
                  </div>
                </form>
            	</div>
            </div>
          </div>
        
          <div class="col-sm-12" style="margin-top: 10px;">
            <div class="card userCard">
              <div class="card-header bg-white">
                <h5 class="m-0 d-inline">High School Details</h5> <small id="user_type" class="form-text text-muted">HELPS US KNOW YOU BETTER</small>
              </div>
              <div class="card-body">
                <form id="form_highschool_settings">
                  <input type="hidden" name="data_type" value="highschool_settings">
                  <div class="row">
                    <div class="form-group col-sm-12">
                     <table class="table">
                       <thead>
                         <th>10th Passing Year</th>
                         <th>Grading System</th>
                         <th>10th Marks</th>
                       </thead>
                       <tbody>
                         <tr>
                           <td><input type="txet" name="" class="form-control year_of_passing"></td>
                           <td>
                             <select class="form-control">
                               <?php
                               if(!empty($grades)){
                                foreach ($grades as $key => $value) {
                                  ?>
                                  <option value="<?php echo $value['grading_id'];?><"><?php echo $value['grading_name'];?></option>
                                  <?php
                                }
                               }
                               ?>
                             </select>
                           </td>
                           <td><input type="txet" name="" class="form-control"></td>
                         </tr>
                       </tbody>
                     </table> 
                    </div>
                  </div>
                  <div class="row">
                    <div class="form-group col-sm-12">
                     <table class="table">
                       <thead>
                         <th>12th Passing Year</th>
                         <th>Grading System</th>
                         <th>12th Marks</th>
                       </thead>
                       <tbody>
                         <tr>
                           <td><input type="txet" name="" class="form-control year_of_passing"></td>
                           <td>
                             <select class="form-control">
                               <?php
                               if(!empty($grades)){
                                foreach ($grades as $key => $value) {
                                  ?>
                                  <option value="<?php echo $value['grading_id'];?><"><?php echo $value['grading_name'];?></option>
                                  <?php
                                }
                               }
                               ?>
                             </select>
                           </td>
                           <td><input type="txet" name="" class="form-control"></td>
                         </tr>
                       </tbody>
                     </table> 
                    </div>
                  </div>
                  <div class="row">
                    <div class="form-group col-sm-12">
                     <table class="table">
                       <thead>
                         <th>Grad Passing Year</th>
                         <th>Grading System</th>
                         <th>Grad Marks</th>
                       </thead>
                       <tbody>
                         <tr>
                           <td><input type="txet" name="" class="form-control year_of_passing"></td>
                           <td>
                             <select class="form-control">
                               <?php
                               if(!empty($grades)){
                                foreach ($grades as $key => $value) {
                                  ?>
                                  <option value="<?php echo $value['grading_id'];?><"><?php echo $value['grading_name'];?></option>
                                  <?php
                                }
                               }
                               ?>
                             </select>
                           </td>
                           <td><input type="txet" name="" class="form-control"></td>
                         </tr>
                       </tbody>
                     </table> 
                    </div>
                  </div>
                  <div class="row">
                    <div class="form-group col-sm-12">
                     <label>A Brief About your Educational Details</label>
                     <textarea class="form-control" rows="5"></textarea>
                    </div>
                    <div class="col-sm-12">
                       <button type="submit" class="btn btn-primary" id="btn_update_highschool_account">Update</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-3 ">
          <div class="card mb-4">
            <div class="card-header bg-white">
              <h5 class="m-0">Profile</h5>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <a href="<?php echo base_url();?>account" class="media"> 
                  <div class="media-body">
                    <h6 class="mb-0 color2">Edit Profile</h6>
                  </div>
                </a>
              </li>
              <li class="list-group-item">
                <a href="<?php echo base_url();?>account/applied-colleges" class="media"> 
                  <div class="media-body">
                    <h6 class="mb-0 color2">Applied Colleges</h6>
                  </div>
                </a>
              </li>
              <li class="list-group-item">
                <a href="<?php echo base_url();?>account/my-reviews" class="media">
                  <div class="media-body">
                    <h6 class="mb-0 color2">My Reviews</h6>
                  </div>
                </a>
              </li>
              <li class="list-group-item">
                <a href="#" class="media">
                  <div class="media-body">
                    <h6 class="mb-0 color2">Pending Applications</h6>
                  </div>
                </a>
              </li>
              <li class="list-group-item">
                <a href="#" class="media">
                  <div class="media-body">
                    <h6 class="mb-0 color2">Account Settings</h6>
                  </div>
                </a>
              </li>
            </ul>
            <div class="card-header bg-white text-center">
              <a class="#">Logout</a>
            </div>
          </div>
          <!-- <div class="card mb-4">
            <div class="card-header bg-white">
              <h5 class="m-0">Featured News</h5>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <a href="#" class="media">
                  <img src="assets/img/img-1.jpg" width="40" class="mr-2" alt="..."> 
                  <div class="media-body">
                    <h6 class="mb-0 color2">Media heading</h6>
                    <small> sit amet nibh libero, in gravida nulla. </small> 
                  </div>
                </a>
              </li>
              <li class="list-group-item">
                <a href="#" class="media">
                  <img src="assets/img/img-2.jpg" width="40" class="mr-2" alt="..."> 
                  <div class="media-body">
                    <h6 class="mb-0 color2">Media heading</h6>
                    <small> sit amet nibh libero, in gravida nulla. </small> 
                  </div>
                </a>
              </li>
              <li class="list-group-item">
                <a href="#" class="media">
                  <img src="assets/img/img-3.jpg" width="40" class="mr-2" alt="..."> 
                  <div class="media-body">
                    <h6 class="mb-0 color2">Media heading</h6>
                    <small> sit amet nibh libero, in gravida nulla. </small> 
                  </div>
                </a>
              </li>
            </ul>
            <div class="card-header bg-white text-center">
              <a class="#">View All News</a>
            </div>
          </div> -->
      </div>
    </div>
  </div><br>

  <div class="wrapper">
    <div class="row">
      <div class="col-lg-9 mb-4 mb-lg-0" id="">
        
      </div>
    </div>
  </div>
</div>
<?php $this->widget->run('front_subscription_section',TRUE);?>
<script type="text/javascript">var page='';var _c='';var _st='';var _ct='';var _strm='';var _cu='';var ads_image='';</script>