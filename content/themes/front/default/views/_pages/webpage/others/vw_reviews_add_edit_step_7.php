<div class="row" id="div_step7">
    <div class="col-lg-1"></div>
    <div class="col-lg-10">
      <form id="review_form_step_7" class="review_form" autocomplete="off" novalidate style="width:100%;">
        <input type="hidden" name="review_step_data" id="review_step_data" value="step_7">
        <input type="hidden" name="review_step" id="review_step" value="step_8">
        <input type="hidden" name="review_college_id" id="review_college_id" value="<?php echo $college_data->college_user_id;?>">
        <input type="hidden" name="review_course" value="<?php echo $course_id;?>">
        <input type="hidden" name="review_q_type" value="6">
        <input type="hidden" name="review_question" value="How are the Placements of Your College?If No Campus Placement is offered discuss about employability or plans after completeing the course.">
        <input type="hidden" name="review_q_type_title" value="Placement Experience">
        <input type="hidden" name="review_q_category" value="Placement">
        <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
        
          <div class="card userCard mb-4">
            <div class="card-header bg-white">
              <h4 class="m-0 d-inline">Step 7 - Campus Placement Info</h4>
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
                  <div class="feedback feedback--custom">
                      <div class="feedback__header u-bg--custom"></div>
                      <div class="feedback__body">
                        <p> <span class="name name--company u-text--custom">Rate your Hostel or Rented Accomodation</span></p>
                        <p>Make it accurate considering all pros and cons</p>
                        <div class="feedback__form">
                          <div class="feedback__item-container">
                            <?php
                            for ($i=1; $i <=10 ; $i++) { 
                              ?>
                              <div class="feedback__item">
                                <input class="feedback__input" type="radio" name="review_rating" value="<?php echo $i;?>" id="feedback<?php echo $i;?>" <?php echo (!empty($review_question_data) && ($review_question_data->review_question_rating==$i))?'checked':'';?>>
                                <label class="feedback__label" for="feedback<?php echo $i;?>"><?php echo $i;?></label>
                              </div>
                              <?php
                            }
                            ?>
                          </div>
                          <div class="feedback__direction-container"><small class="feedback__direction">Not at all Likely</small><small class="feedback__direction">Extremely Likely</small></div>
                        </div>
                      </div>
                  </div>
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
    <div class="col-lg-1"></div>
</div>
<style type="text/css">
      /*  .feedback {
      position: absolute;
       top: 0%;
       left: 50%;
       transform: translateX(-50%);
       opacity: 0;
       top: -300px;
       animation: transitionDown 300ms ease 1s forwards;
      }*/
     .feedback {
       width: 100%;
       text-align: center;
       background: #fff;
       /*border: 1px solid #dee2e6;
       border-radius: 8px;*/
       /*box-shadow: 0px 15px 40px rgba(33, 37, 42, .12), 0px 5px 12px rgba(33, 37, 42, .07);*/
      }
     .feedback__body {
       padding: 3.2rem 2.4rem;
      }
     .feedback__header {
       height: 0.5rem;
      }
     .feedback__item-container {
       display: flex;
       align-items: center;
       flex-wrap: wrap;
      }
     .feedback__direction-container {
       display: flex;
       justify-content: space-between;
       margin-top: 1rem;
      }
     .feedback__direction {
       color: #adb5bd;
      }
     .feedback__item {
       position: relative;
       width: 10%;
      }
     .feedback__label {
       cursor: pointer;
       width: 40px;
       height: 40px;
       line-height: 40px;
       border: 1px solid #adb5bd;
       color: #adb5bd;
       border-radius: 50%;
       margin: auto;
       display: block;
       transition: all 200ms ease;
      }
      @media screen and (max-width: 600px) {
       .feedback__label {
         width: 30px;
         height: 30px;
         line-height: 30px;
        } 
      }
     .feedback__label:hover, .feedback__label:focus {
       box-shadow: 0px 0px 0px 3px rgba(255, 122, 89, .4);
       border-color: #ff7a59;
       transition: all 200ms ease;
      }
     .feedback__input {
       opacity: 0;
       width: 1px;
       height: 1px;
       position: absolute;
       top: 0;
       left: 0;
      }
     .feedback__input:checked + .feedback__label {
       background: #ff7a59;
       border-color: #ff7a59;
       color: #fff;
       text-shadow: 0px 2px 2px rgba(33, 37, 42, .3);
       transition: all 200ms ease;
      }
     .name {
       font-weight: 700;
      }
    /* .name--company:after {
       content: 'Green Apple';
    }*/
     .u-bg--custom {
       background: #ff7a59 !important;
      }
     .u-text--custom {
       color: #ff7a59 !important;
      }
     @keyframes transitionDown {
       from {
         opacity: 0;
      }
       to {
         opacity: 1;
         top: 0;
      }
    }
 
</style>

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