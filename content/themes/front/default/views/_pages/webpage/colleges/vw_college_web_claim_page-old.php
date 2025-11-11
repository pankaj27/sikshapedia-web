<?php defined('BASEPATH') OR exit('No direct script access allowed');?>
<section class="headerBnrSec overlayBnr">
    <img src="<?php echo $college_data['college_banner'];?>" class="headerBnrImg" alt="">
    <div class="wrapper">
      <div class="headerBnrPanel">
        <div class="bnrThumbBox">
          <div class="bnrThumb shadow bg-white"><img src="<?php echo $college_data['college_logo'];?>" alt="<?php echo $college_data['college_name'];?>"></div>
          <div class="bnrThumbCon pt-2">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb p-0 bg-none mb-1">
                <?php
                foreach ($college_data['college_breadcrumb'] as $key => $value) {
                  ?>
                  <li class="breadcrumb-item <?php echo (empty($value))?'active':'';?>">
                    <?php
                    if(!empty($value)){
                      ?>
                      <a href="<?php echo $value;?>"><?php echo $key;?></a>
                      <?php
                    }else{
                      echo $key;
                    }
                    ?>
                  </li>
                  <?php
                }
                ?>
              </ol>
            </nav>
            <h5 class="m-0 bnrTitle text-truncate text-uppercase w-75 font-weight-bolder"><?php echo $college_data['college_name_formatted'];?></h5>
            <div class="m-0  d-lg-flex  justify-content-between tagLists w-75">
              <div class="text-truncate tags">
                <span><i class="fas fa-map-marker-alt"></i> <?php echo $college_data['college_city'];?>,<?php echo $college_data['college_state'];?> </span>

                <?php
                if(!empty($college_data['college_affiliations'])){
                  ?>
                  <span><i class="fas fa-bookmark"> </i> <?php echo $college_data['college_affiliations'];?> </span> 
                  <?php
                }

                ?>

                <span><i class="fas fa-thumbtack"></i> ESTD <?php echo $college_data['college_estd'];?> </span> 
                <?php

                if(!empty($college_data['college_university'])){
                  ?>
                  <span><i class="fas fa-flag"></i> <?php echo $college_data['college_university'];?></span>
                  <?php
                }

                ?>

                
                
                <span><i class="fas fa-star"> </i> <?php echo $college_data['college_type'];?> </span> 
                <!-- <span><i class="fas fa-tags"> </i>  10 QUESTIONS </span> 
                <span><i class="fas fa-tags"> </i>  ANSWERED </span> 
                <span><i class="fas fa-tags"> </i>  RANKED 2 </span> 
                <span><i class="fas fa-tags"> </i>  RANKED 2 </span> 
                <span><i class="fas fa-tags"> </i>  RANKED 2 </span> 
                <span><i class="fas fa-tags"> </i>  RANKED 2 </span> --> 
              </div>
              <div class="pl-2"><a href="">  MORE </a></div> 
            </div>
          </div>

        </div>
        <div class="headerBnrCon d-none d-md-block">
          <div class="ratingBox ">
              <div class="points">9.2</div>
              <div class="reviewStars">
                <div class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i></div>
                <div class="reviewCounts">17 REVIEWS</div>
              </div>
          </div>

        </div>
       
      </div>
    </div>
  </section>


  <section class="pageDetailsSec py-4" style="background-color:#ffffff;">
    <div class="wrapper">
      <div class="row">
        
        <div class="col-md-5">
          <h2 class="jsx-1795103404 heading m-0 mb-3 font-weight-bold">Register <span class="jsx-1795103404 subheading">if you are:</span></h2>
          <ul class="jsx-1795103404 client-points">
            <li class="jsx-1795103404">A Marketing Manager of this college</li>
            <li class="jsx-1795103404">A person in-charge of this college</li>
            <li class="jsx-1795103404">A person who can be contacted for any further enquiry</li>
          </ul>
          <img data-src="https://static.waytoadmissions.com/data/app/2021/bkc1251511649.png?tr=c-force" src="https://static.waytoadmissions.com/data/app/2021/bkc1251511649.png?tr=c-force" alt="" class="jsx-1334679407 img-fluid d-none d-md-block mt-5 lazyloaded" height="auto">
        </div>

        <div class="col-md-7">
          <div class="card userCard">
          <!-- <div class="card-header bg-white">
            <h5 class="m-0 d-inline">Account Informations</h5> <small id="user_type" class="form-text text-muted">Update your account details & settings</small>
          </div> -->
          <div class="card-body">

            <div id="claim_thanks_msg"></div>
            
            <form id="form_claim_for_college" enctype="multipart/form-data">
              <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
              <input type="hidden" name="claim_institute_type" value="<?php echo encode_data('7');?>">
              <input type="hidden" name="claim_institute" value="<?php echo $college_data['college_id'];?>">
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