<div class="row" id="div_step1"> 
  <div class="col-lg-1"></div>
  <div class="col-lg-10">
    <form id="review_form_step_1" class="review_form" autocomplete="off" novalidate>
      <input type="hidden" name="review_step_data" id="review_step_data" value="step_1">
      <input type="hidden" name="review_step" id="review_step" value="step_2">
      <input type="hidden" name="review_course" value="<?php echo encode_data($review_data['review_course_id']);?>">
              
      <input type="hidden" name="review_q_type" value="">              
      <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
      <div class="card userCard mb-4">
        <div class="card-header bg-white">
          <h4 class="m-0 d-inline">Step 1 - Academic Details - 10th & 12th Marks, Exam Scores & Class Size</h4>
          <small id="user_type" class="form-text text-muted">Include maximum details, more details more rewards</small>
        </div>
        <div class="card-body">                  
            <div class="row">
              <div class="form-group col-sm-6">
                  <label>Select Course</label>
                  <select class="form-control" name="review_enrollment_course" id="review_enrollment_course">
                    <option value="0">Choose...</option>
                    <?php
                    foreach ($inst_courses as $key => $value) {
                      ?>
                      <option value="<?php echo $value['course_id'];?>" <?php echo $value['selected'];?>><?php echo $value['course_name'];?></option>
                      <?php
                    }
                    ?>
                  </select>
              </div>
              <div class="form-group col-sm-3">
                  <label>Enrollment Year</label>
                  <select class="form-control" name="review_enrollment_year" id="review_enrollment_year">
                    <option value="0">Choose...</option>
                    <?php
                    foreach ($enrollment_years as $key => $value) {
                      ?>
                      <option value="<?php echo $value;?>" <?php echo ($value==$review_data['review_enroll_year'])?'selected':'';?>><?php echo $value;?></option>
                      <?php
                    }
                    ?>
                  </select>
              </div>
              <div class="form-group col-sm-3">
                  <label>Program Fees (Yr)</label>
                  <input class="form-control" type="text" name="review_program_fees" id="review_program_fees" value="<?php echo (!empty($review_data))?$review_data['review_program_fees']:'';?>">
              </div>
              <div class="form-group col-sm-3">
                  <label>Board/University [ 12th ]</label>
                  <select class="form-control" name="review_board_12th" id="review_board_12th">
                    <option value="0">Choose...</option>
                    <?php
                    foreach ($statutory_bodies_12th as $key => $value) {
                      ?>
                      <option value="<?php echo $value->statutory_body_id;?>" <?php echo ($value->statutory_body_id==$review_data['review_12th_board_id'])?'selected':'';?>><?php echo $value->statutory_body_abbr;?></option>
                      <?php
                    }
                    ?>
                  </select>
              </div>
              <div class="form-group col-sm-3">
                  <label>Percentage Marks</label>
                  <input class="form-control" type="text" name="review_percentage_12th_marks" id="review_percentage_12th_marks" value="<?php echo (!empty($review_data))?$review_data['review_12th_board_percentage']:'';?>">
              </div>
            </div>
            <div class="row">
              <div class="form-group col-sm-3">
                  <label>Board/University [ 10th ]</label>
                  <select class="form-control" name="review_board_10th" id="review_board_10th">
                    <option selected="">Choose...</option>
                    <?php
                    foreach ($statutory_bodies_10th as $key => $value) {
                      ?>
                      <option value="<?php echo $value->statutory_body_id;?>" <?php echo ($value->statutory_body_id==$review_data['review_10th_board_id'])?'selected':'';?>><?php echo $value->statutory_body_abbr;?></option>
                      <?php
                    }
                    ?>
                  </select>
              </div>
              <div class="form-group col-sm-3">
                  <label>Percentage Marks</label>
                  <input class="form-control" type="text" name="review_percentage_10th_marks" id="review_percentage_10th_marks"  value="<?php echo (!empty($review_data))?$review_data['review_10th_board_percentage']:'';?>">
              </div>

              <!-- <div class="form-group col-sm-6">
                  <label>Provide JEE MAIN Scores if you had taken any exams</label>
                  <input class="form-control" value=" ">
              </div>

              <div class="form-group col-sm-6">
                  <label>Provide WBJEE Scores if you had taken any exams</label>
                  <input class="form-control" value=" ">
              </div> -->

              <div class="form-group col-sm-3">
                  <label>Have you Availed any Quota?</label>
                  <select class="form-control" name="review_quota_available" id="review_quota_available">
                    <option value="no" <?php echo (!empty($review_data) && $review_data['review_caste_quota_applicable']=='no')?'selected':'';?>>No</option>
                    <option value="yes" <?php echo (!empty($review_data) && $review_data['review_caste_quota_applicable']=='yes')?'selected':'';?>>Yes</option>
                  </select>
              </div>

              <div class="form-group col-sm-3">
                  <label>Quota Type</label>
                  <select class="form-control" name="review_quota_type" id="review_quota_type">
                    <?php
                    foreach ($caste_quota as $key => $value) {
                      ?>
                      <option value="<?php echo $value->quota_id;?>" <?php echo ($value->quota_id==$review_data['review_caste_quota_id'])?'selected':'';?>><?php echo $value->quota_name;?></option>
                      <?php
                    }
                    ?>
                  </select>
              </div>

              
            </div>

            <div class="row">

              <div class="form-group col-sm-3">
                  <label>Was there any GD/PI for the admission</label>
                  <select class="form-control" name="review_gd_pi_available" id="review_gd_pi_available">
                    <option value="no" <?php echo (!empty($review_data) && $review_data['review_gd_pi_applicable']=='no')?'selected':'';?>>No</option>
                    <option value="yes" <?php echo (!empty($review_data) && $review_data['review_gd_pi_applicable']=='yes')?'selected':'';?>>Yes</option>
                  </select>
              </div>

              <div class="form-group col-sm-3">
                  <label>What was your class size?</label>
                  <input type="text" class="form-control" name="review_class_size" value="<?php echo (!empty($review_data))?$review_data['review_class_size']:'';?>">
              </div>                       
              

              <div class="form-group col-sm-3">
                  <label class="d-block">Did you opt for hostels?</label>
                  <select class="form-control" name="review_opt_for_hostels" id="review_opt_for_hostels">
                    <option value="no" <?php echo (!empty($review_data) && $review_data['review_opt_hostel']=='no')?'selected':'';?>>No</option>
                    <option value="yes" <?php echo (!empty($review_data) && $review_data['review_opt_hostel']=='yes')?'selected':'';?>>Yes</option>
                  </select>
              </div>

              <div class="form-group col-sm-3">
                  <label>Hostel Fees(Yr)</label>
                  <input class="form-control" type="text" <?php echo ($review_data['review_opt_hostel']=='no')?'disabled="true"':''?> name="review_hostel_fees" id="review_hostel_fees" value="<?php echo (!empty($review_data))?$review_data['review_opt_hostel_fees']:'';?>">
              </div>


              
            </div>

            <div class="row">
              <div class="form-group col-sm-3">
                  <label class="d-block">Does your college provide placements?</label>
                  <select class="form-control" name="review_placement_provided" id="review_placement_provided">
                    <option value="no" <?php echo (!empty($review_data) && $review_data['review_inst_placement_applicable']=='no')?'selected':'';?>>No</option>
                    <option value="yes" <?php echo (!empty($review_data) && $review_data['review_inst_placement_applicable']=='yes')?'selected':'';?>>Yes</option>
                  </select>
              </div>
              <div class="form-group col-sm-4">
                  <label class="d-block">Does your college provide internship opportunities?</label>
                  <select class="form-control" name="review_internship_provided" id="review_internship_provided">
                    <option value="no" <?php echo (!empty($review_data) && $review_data['review_inst_internship_applicable']=='no')?'selected':'';?>>No</option>
                    <option value="yes" <?php echo (!empty($review_data) && $review_data['review_inst_internship_applicable']=='yes')?'selected':'';?>>Yes</option>
                  </select>
              </div>
            </div>


            <div class="row">                    
              <div class="form-group col-sm-12">
                <label class="d-block"><h5>Have you applied for any other institute or program?</h5></label><hr>
              </div>
            </div>

            <div id="div_row">

              <?php

              //print_obj($review_data['review_other_program_data']);
              if(!empty($review_data['review_other_program_data'])){
                $i=0;
                foreach ($review_data['review_other_program_data'] as $key => $value) {
                  ?>
                   <div id="row_<?php echo $i;?>">
                      <div class="row">
                        <div class="form-group col-sm-6">
                          <input type="text" class="form-control" name="review_inst[<?php echo $i;?>][name]" id="review_inst_name_<?php echo $i;?>" placeholder="College Name" value="<?php echo $value['name'];?>">
                        </div>
                        <div class="form-group col-sm-6">
                          <input type="text" class="form-control" name="review_inst[<?php echo $i;?>][course]" id="review_inst_course_<?php echo $i;?>" placeholder="Course" value="<?php echo $value['course'];?>">
                        </div>
                      </div>

                      <div class="row">
                        <div class="form-group col-sm-12">
                          <textarea class="form-control" name="review_inst[<?php echo $i;?>][reason]" id="review_inst_reason_<?php echo $i;?>" placeholder="Why didn't you opt for this college?" rows="3"><?php echo $value['reason'];?></textarea>
                        </div>
                      </div>

                      <div class="row">
                        <div class="form-group col-sm-12">
                          <div class="row mx-0">
                            <span class="add-btn text-primary pt-2 col-12 px-0 text-right">
                              <span class="pointer" id="span_add_more" onclick="$('#row_<?php echo $i;?>').remove()">Remove</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  <?php
                  $i++;
                }
              }else{
                ?>
                <div class="row">
                  <div class="form-group col-sm-6">
                    <input type="text" class="form-control" name="review_inst[0][name]" id="review_inst_name_0" placeholder="College Name">
                  </div>
                  <div class="form-group col-sm-6">
                    <input type="text" class="form-control" name="review_inst[0][course]" id="review_inst_course_0" placeholder="Course">
                  </div>
                </div>

                <div class="row">
                  <div class="form-group col-sm-12">
                    <textarea class="form-control" name="review_inst[0][reason]" id="review_inst_reason_0" placeholder="Why didn't you opt for this college?" rows="3"></textarea>
                  </div>
                </div>
                <?php
              }
              ?>                

            </div>

            <div class="row">
              <div class="form-group col-sm-12">
                <div class="row mx-0">
                  <span class="add-btn text-primary border-top pt-2 col-12 px-0 text-right">
                    <span class="pointer" id="span_add_more">Add More</span>
                  </span>
                </div>
              </div>
            </div>

          </div>



          <div class="card-footer pull-right">
            <div class="col-sm-12">
              <button class="btn btn-primary " type="submit" id="save_next" style="float:right;"> Save & Next</button>
            </div>
          </div>
        </div>
    </form>
  </div>
  <div class="col-lg-1"></div>        
</div>

<script type="text/javascript">
  $(document).ready(function(){
    function load_review_step(review_step){
      $.ajax({
        type:'POST',
        url:base_url+'reviews/load_steps_review',
        data:{[csrf_name]:csrf_hash,review_step:review_step},
        success:function(d){

          if(d.html){
            $('#review_div').html(d.html);
            review_rating();
          }
            
        }
      });
    }
     $.validator.addMethod("valueNotEquals", function(value, element, arg){
        return arg !== value;
      }, "Value must not equal arg.");
    $('#review_form_step_1').validate({
      rules:{
        review_enrollment_year:{
          valueNotEquals:'0'
        },
        review_program_fees:{
          required:true
        },
        review_percentage_12th_marks:{
          required:true
        },
        review_percentage_10th_marks:{
          required:true
        },
        review_class_size:{
          required:true
        },
        review_hostel_fees:{
          required:true
        },
      },
      messages:{
        review_enrollment_year:{
          valueNotEquals:'Select enrollment year'
        },
        review_program_fees:{
          required:'Enter Fees'
        },
        review_percentage_12th_marks:{
          required:'Enter 12th percentage'
        },
        review_percentage_10th_marks:{
          required:'Enter 10th percentage'
        },
        review_class_size:{
          required:'Enter class size'
        },
        review_hostel_fees:{
          required:'Enter hostel fees'
        },
      },
      submitHandler:function(f){
        $.ajax({
          type:'POST',
          url:base_url+'reviews/write_review',
          data:$('#review_form_step_1').serialize(),
          beforeSend:function(){
            $('#save_next').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
            $('#prev_point').prop('disabled',true);
          },
          success:function(d){
            $('#save_next').html('Save & Next').prop('disabled',false);
            $('#prev_point').prop('disabled',false);
            if(d.next_step!='final'){
              load_review_step(d.next_step);
            }else if(d.next_step=='final'){
              $('#wrapper_div').addClass('bg-white').html(d.html);
            }
          }
        });
      }
    });
  });
</script>