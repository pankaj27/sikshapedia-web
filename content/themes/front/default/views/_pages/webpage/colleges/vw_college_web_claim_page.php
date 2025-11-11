<?php defined('BASEPATH') OR exit('No direct script access allowed');?>


  <section class="pageDetailsSec py-4" style="background-color:#ffffff;">
    <div class="wrapper">
      <div class="row">


        <div class="col-md-12">
          <div class="card userCard">
          <!-- <div class="card-header bg-white">
            <h5 class="m-0 d-inline">Account Informations</h5> <small id="user_type" class="form-text text-muted">Update your account details & settings</small>
          </div> -->
          <div class="card-body">

            <div id="claim_thanks_msg"></div>
            
            <form id="form_claim_for_college" enctype="multipart/form-data">
              <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
              <input type="hidden" name="claim_institute_type" value="<?php echo $college_data['college_type'];?>">
              <input type="hidden" name="claim_institute" value="<?php echo $college_data['college__user_id'];?>">
              <input type="hidden" name="claimer_country" value="<?php echo $college_data['college_country_id'];?>">
              <div class="row">
                <div class="form-group col-sm-6">
                  <label>Name </label>
                  <input type="text" class="form-control" id="claimer_full_name" name="claimer_full_name" aria-describedby="claimer_full_name" placeholder="Full Name" value="">
                </div>
                <div class="form-group col-sm-6">
                    <label>Official E-mail </label>
                    <input type="text" class="form-control" id="claimer_email" name="claimer_email" aria-describedby="claimer_email" placeholder="Official E-mail" value="">
                </div>
              </div>

              <div class="row">
                <div class="form-group col-sm-6">
                    <label>Mobile No. </label>
                    <input type="text" class="form-control" id="claimer_mobile_no" name="claimer_mobile_no" aria-describedby="claimer_mobile_no" placeholder="Mobile No. without Country Code" value="">
                </div>
                <div class="form-group col-sm-6">
                    <label>Linkedin Profile Link </label>
                    <input type="text" class="form-control" id="claimer_linkedin_profile_link" name="claimer_linkedin_profile_link" aria-describedby="claimer_linkedin_profile_link" placeholder="Linkedin Profile Link" value="">
                </div>
              </div>

              <div class="row">
                <div class="form-group col-sm-6">
                    <label>Landline With Std Code (e.g. 01842285665)</label>
                    <input type="text" class="form-control" id="claimer_inst_landline_no" name="claimer_inst_landline_no" aria-describedby="claimer_inst_landline_no" placeholder="Landline With Std Code" value="">
                </div>
                <div class="form-group col-sm-6">
                    <label>Landline Extension</label>
                    <input type="text" class="form-control" id="claimer_inst_landline_ext" name="claimer_inst_landline_ext" aria-describedby="claimer_inst_landline_ext" placeholder="Landline Extension" value="">
                </div> 
              </div>
              <div class="row">
                <div class="form-group col-sm-12">
                    <label>Select Designation</label>
                    <select class="form-control" name="claimer_designation" id="claimer_designation">
                      <?php
                      if(!empty($designations)){
                        foreach ($designations as $key => $value) {
                          ?>
                          <option value="<?php echo $value['designation_id'];?>"><?php echo $value['designation_name'];?></option>
                          <?php
                        }
                      }
                      ?>
                    </select>
                </div>
              </div>
              <div class="row">
                <div class="form-group col-sm-8">
                    <label>Referer</label>
                    <input type="text" class="form-control" id="claimer_referer" name="claimer_referer" aria-describedby="claimer_referer" placeholder="Referer Person" value="">
                </div>  
                <div class="form-group col-sm-4">
                    <label>Referer Mobile No</label>
                    <input type="text" class="form-control" id="claimer_referer_ph_no" name="claimer_referer_ph_no" aria-describedby="claimer_referer_ph_no" placeholder="Referer Person Mobile No" value="">
                </div>                      
              </div>

              <div class="row">
                <div class="col-sm-12">
                   <button type="submit" class="btn btn-primary" id="btn_add_claim">Submit</button>
                </div>
              </div>

            </form>

            <form id="form_claim_for_college_verify" autocomplete="off" style="display: none;">
              <div class="error" id="otp_error"></div>
                <div class="my-5 mx-auto " style="max-width: 200px;">
                  <div class="row form-row">
                    <div class="col"><input type="text" class="form-control claim_otp_value" name="claim_otp_value[]" maxlength="1"></div>
                    <div class="col"><input type="text" class="form-control claim_otp_value" name="claim_otp_value[]" maxlength="1"></div>
                    <div class="col"><input type="text" class="form-control claim_otp_value" name="claim_otp_value[]" maxlength="1"></div>
                    <div class="col"><input type="text" class="form-control claim_otp_value" name="claim_otp_value[]" maxlength="1"></div>
                  </div>
                </div>
                <div class="d-flex justify-content-between">
                  <button type="submit" class="btn-temp " id="btn_submit_claim_verify">Submit</button>
                </div>
            </form>

          </div>
        </div>
        </div>

      </div>
    </div> 
  </section>


  <?php $this->widget->run('front_subscription_section',TRUE);?>

  <script type="text/javascript">var _cid='<?php echo $college_data['college_user_id'];?>';var _co='<?php echo $college_data['college_country_id'];?>';var _cot='<?php echo $college_data['college_city_country_id'];?>';var _cit='<?php echo $college_data['college_city_id'];?>';var _st='<?php echo $college_data['college_city_state_id'];?>';var page='';var wbpage='<?php echo $college_data['inst_web_page'];?>';var _c='';var _ct='';var _vtype='COLLEGE';let _vip='<?php echo $this->input->ip_address();?>';var _strm='';;var _cu='';</script>