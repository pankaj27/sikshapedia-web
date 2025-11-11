<div class="row" id="div_step7">
    <div class="col-lg-2"></div>
    <div class="col-lg-8">
  <form id="review_form_step_7" class="review_form" autocomplete="off" novalidate style="width:100%;">
    <input type="hidden" name="review_step_data" id="review_step_data" value="step_7">
    <input type="hidden" name="review_step" id="review_step" value="step_8">
    <input type="hidden" name="review_q_type" value="6">
    <input type="hidden" name="review_question" value="How is the Hostel Facility or provide details of your rented accomodation?">
    <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
    
      <div class="card userCard mb-4">
        <div class="card-header bg-white">
          <h4 class="m-0 d-inline">Step 7 - Hostel Facility or Accomodation Info</h4>
          <small id="user_type" class="form-text text-muted">Include maximum details, more details more rewards</small>
        </div>
        <div class="card-body">                  
          <div class="row">
              <div class="form-group col-sm-12">
                  <div class="jsx-2879957041 ques-div">
                    <p class="jsx-2879957041 mb-1 ques-head"></p>
                    <p class="jsx-2879957041 font-weight-bold mb-2 ques-subhead">
                    Q6. How is the Hostel Facility or provide details of your rented accomodation?</p>
                    <p class="jsx-2879957041 font-weight-bold mb-2 ques-subhead">
                    What to include?</p>
                  </div>
                  <div class="jsx-2879957041">
                    <div class="jsx-2879957041 points">
                        <div class="jsx-2879957041">
                          <p class="jsx-2879957041 point-text">Provide details of the facilities provided oin the room</p>
                        </div>
                        <div class="jsx-2879957041">
                          <p class="jsx-2879957041 point-text">Review of meal quality & menu</p>
                        </div>
                        <div class="jsx-2879957041">
                          <p class="jsx-2879957041 point-text">Registration process for Hostel & Affordability</p>
                        </div>
                        <div class="jsx-2879957041">
                          <p class="jsx-2879957041 point-text">Brief of course & extra curricular activities on the campus</p>
                        </div>
                        <div class="jsx-2879957041">
                          <p class="jsx-2879957041 point-text">Mention the locality if you rented a room or PG</p>
                        </div>
                      </div>
                    </div>
                  <textarea name="review_opt" id="review_opt" placeholder="Type your info" spellcheck="false" rows="7" maxlength="1000" minlength="200" class="jsx-4258272566 pl-5 form-control q-area border-red"><?php echo (!empty($review_question_data))?$review_question_data->review_question_answer:'';?></textarea>
                  <div class="jsx-4258272566 d-flex justify-content-between mt-1 text-sm"><div class="jsx-4258272566">Min. Character: 200</div><div class="jsx-4258272566"><span class="">Character:</span><span class="ml-1" id="the-count">0/1000</span></div></div>
              </div>
          </div> 
          <div class="row">
            <div class="col-lg-12">
            <fieldset class="jsx-4149282442 jsx-497415273 d-block"><div class="jsx-2879957041 ques-div"><p class="jsx-2879957041 mb-1 ques-head">Rate your Hostel or Rented Accomodation</p><p class="jsx-2879957041 font-weight-bold mb-2 ques-subhead">Make it accurate considering all pros and cons</p></div><div class="jsx-4149282442 jsx-497415273 undefined"><div class="jsx-4149282442 jsx-497415273"></div><fieldset class="jsx-4028593834 rating-input "><p class="jsx-4028593834 mb-1 ques-head"></p><p class="jsx-4028593834 font-weight-bold"></p><div class="jsx-4028593834 rating"><div class="jsx-4028593834 d-flex justify-content-between"><p class="jsx-4028593834 m-0 rating-txt">Not at all Likely</p><p class="jsx-4028593834 m-0 rating-txt">Extremely Likely</p></div>
              <div class="jsx-4028593834 d-flex justify-content-between my-4 my-sm-1">
                <div  class="form-group">
                  <div class="br-wrapper br-theme-bars-pill">
                    <select class="review_rating" id="review_rating" name="review_rating" autocomplete="off" style="display: none;">
                      <option value="-- no rating selected --"></option>
                      <?php
                      for ($i=1; $i <=10 ; $i++) { 
                        ?>
                        <option value="<?php echo $i;?>" <?php echo (!empty($review_question_data) && ($review_question_data->review_question_rating==$i))?'selected':'';?>><?php echo $i;?></option>
                        <?php
                      }
                      ?>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="jsx-4028593834 invalid-feedback undefined d-none">Field is required</div></div></fieldset></div></fieldset>
            </div>
          </div>                 
        </div>
        <div class="card-footer">
          
          <div class="row">
                    <div class="col-lg-6">
                            <button class="btn btn-primary " type="button" id="prev_point" data-point="step_6"> Previous</button>
                    </div>
                    <div class="col-lg-6">
                            <button class="btn btn-primary " type="submit" style="float:right;" id="save_next"> Save & Next</button>
                    </div>
                 </div>
        </div>
      </div>
    </div>
  </form>
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
    $('#review_form_step_7').validate({
      rules:{
        review_opt:{
          required:true,
          minlength:200,
          maxlength:10000
        },
        review_rating:{
          valueNotEquals:'-- no rating selected --'
        }
      },
      messages:{
        review_opt:{
          required:'Give your review',
          minlength:'Minimum 200 charachter required',
          maxlength:'Maximum 10000 charachter allowed'
        },
        review_rating:{
          valueNotEquals:'Select Rating'
        }
      },
      submitHandler:function(f){
        $.ajax({
          type:'POST',
          url:base_url+'reviews/write_review',
          data:$('#review_form_step_7').serialize(),
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