<div class="row" id="div_step9">
    <div class="col-lg-2"></div>
    <div class="col-lg-8">
  <form id="review_form_step_10" class="review_form" autocomplete="off" novalidate style="width:100%;">
    <input type="hidden" name="review_step_data" id="review_step_data" value="step_10">
    <input type="hidden" name="review_step" id="review_step" value="step_9">
    <input type="hidden" name="review_q_type" value="0">
    <input type="hidden" name="review_question" value="Give A Nice Title">
    <input type="hidden" name="<?php echo $csrf['name'];?>" value="<?php echo $csrf['hash'];?>">
    <div class="col-lg-12">
      <div class="card userCard mb-4">
        <div class="card-header bg-white">
          <h4 class="m-0 d-inline">Give A Nice Title for Your Review</h5>
        </div>
        <div class="card-body">                  
          <div class="row">
              <div class="form-group col-sm-12">
                  <input type="text" class="form-control" name="review_nice_title" value="<?php echo $review_data['review_nice_title'];?>">
              </div>
          </div>
          <div class="row">
            <div class="form-group col-sm-12">
                  <div class="jsx-2879957041 ques-div">
                    <p class="jsx-2879957041 mb-1 ques-head"></p>
                    <p class="jsx-2879957041 font-weight-bold mb-2 ques-subhead">
                    You Agree that you will not:</p>
                  </div>
                  <div class="jsx-2879957041">
                    <div class="jsx-2879957041 points">
                      <div class="jsx-2879957041">
                        <p class="jsx-2879957041 point-text">Impersonate another person or his or her email address, or misrepresent your current or former affiliation with an institution.</p>
                      </div>
                      <div class="jsx-2879957041">
                        <p class="jsx-2879957041 point-text">Create user accounts under false or fraudulent pretences, create or use an account for anyone other than yourself.</p>
                      </div>
                      <div class="jsx-2879957041">
                        <p class="jsx-2879957041 point-text">Post content that is defamatory, libelous or fraudulent, that you know to be false or misleading or that does not reflect your honest.</p>
                      </div>
                    </div>
                  </div>
                  
              </div>
          </div>                 
        </div>
        <div class="card-footer">
            <div class="row">
              <div class="col-lg-4">
                <button class="btn btn-primary " type="button" id="prev_point" data-point="step_9"> Previous</button>
              </div>
              <div class="col-lg-8">
                <input type="checkbox" name="review_agree" id="review_agree" value="1" <?php echo ($review_data['review_agreed_tc']=='1')?'checked':'';?>> I Agree with above mentioned T&C
                <button class="btn btn-primary " type="submit" style="float:right;" id="save_next" <?php echo ($review_data['review_agreed_tc']=='1')?'':'disabled="disabled"';?>> Submit</button>
              </div>
            </div>
          
        </div>
      </div>
    </div>
  </form>
</div>

<script type="text/javascript">
  $(document).ready(function(){

     $.validator.addMethod("valueNotEquals", function(value, element, arg){
        return arg !== value;
      }, "Value must not equal arg.");
    $('#review_form_step_10').validate({
      rules:{
        review_nice_title:{
          required:true,
          minlength:10,
          maxlength:200
        },
        review_rating:{
          valueNotEquals:'-- no rating selected --'
        }
      },
      messages:{
        review_nice_title:{
          required:'Give your review',
          minlength:'Minimum 10 charachter required',
          maxlength:'Maximum 200 charachter allowed'
        }
      },
      submitHandler:function(f){
        $.ajax({
          type:'POST',
          url:base_url+'reviews/write_review',
          data:$('#review_form_step_10').serialize(),
          beforeSend:function(){
            $('#save_next').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>').prop('disabled',true);
            $('#prev_point').prop('disabled',true);
          },
          success:function(d){
            $('#save_next').html('Submit').prop('disabled',false);
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

    $("#review_agree").click(function() {
      $("#save_next").attr("disabled", !this.checked);
    });

  });
</script>